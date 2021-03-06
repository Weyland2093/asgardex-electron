import { Asset, AssetRuneNative } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as RxOp from 'rxjs/operators'

import { ZERO_BASE_AMOUNT } from '../../../const'
import { isRuneNativeAsset } from '../../../helpers/assetHelper'
import { eqOAsset } from '../../../helpers/fp/eq'
import { liveData } from '../../../helpers/rx/liveData'
import { observableState } from '../../../helpers/stateHelper'
import { service as midgardService } from '../../midgard/service'
import * as THOR from '../../thorchain'
import { SymWithdrawFees, SymWithdrawFeesHandler } from '../types'
import { poolFee$ } from './common'

const {
  pools: { reloadGasRates }
} = midgardService

/**
 * Returns zero withdraw fees
 * by given asset to withdraw
 */
const getZeroWithdrawFees = (asset: Asset): SymWithdrawFees => ({
  rune: {
    inFee: ZERO_BASE_AMOUNT,
    outFee: ZERO_BASE_AMOUNT
  },
  asset: {
    asset,
    amount: ZERO_BASE_AMOUNT
  }
})

// State to reload sym deposit fees
const {
  get$: reloadWithdrawFees$,
  get: reloadWithdrawFeeState,
  set: _reloadSymDepositFees
} = observableState<O.Option<Asset>>(O.none)

// Triggers reloading of deposit fees
const reloadWithdrawFees = (asset: Asset) => {
  // (1) update reload state only, if prev. vs. current assets are different
  if (!eqOAsset.equals(O.some(asset), reloadWithdrawFeeState())) {
    _reloadSymDepositFees(O.some(asset))
  }

  if (isRuneNativeAsset(asset)) {
    // Reload fees for RUNE
    THOR.reloadFees()
  } else {
    // OR reload fees for asset
    reloadGasRates()
  }
}

const symWithdrawFee$: SymWithdrawFeesHandler = (initialAsset) =>
  FP.pipe(
    reloadWithdrawFees$,
    RxOp.debounceTime(300),
    RxOp.switchMap((oAsset) => {
      // Since `oAsset` is `none` by default,
      // `initialAsset` will be used as first value
      const asset = FP.pipe(
        oAsset,
        O.getOrElse(() => initialAsset)
      )

      return FP.pipe(
        liveData.sequenceS({
          runeFee: poolFee$(AssetRuneNative),
          assetFee: poolFee$(asset)
        }),
        liveData.map(({ runeFee, assetFee }) => ({
          // outbound fee is 3x inbound fee
          // see "ADD: Better Fees Handling #1381" (search for OutboundFee):
          // Check issue description
          // https://github.com/thorchain/asgardex-electron/issues/1381
          // and following comment
          // https://github.com/thorchain/asgardex-electron/issues/1381#issuecomment-827513798
          rune: { inFee: runeFee.amount, outFee: runeFee.amount.times(3) },
          asset: {
            asset: assetFee.asset,
            amount: assetFee.amount.times(3)
          }
        }))
      )
    })
  )

export { reloadWithdrawFees, symWithdrawFee$, getZeroWithdrawFees }
