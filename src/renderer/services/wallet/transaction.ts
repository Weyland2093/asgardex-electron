import * as RD from '@devexperts/remote-data-ts'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { observableState } from '../../helpers/stateHelper'
import * as BNB from '../binance'
import * as BTC from '../bitcoin'
import * as BCH from '../bitcoincash'
import * as C from '../clients'
import { ExplorerUrl$, GetExplorerTxUrl$, TxsPageLD, LoadTxsParams } from '../clients'
import * as ETH from '../ethereum'
import * as LTC from '../litecoin'
import * as THOR from '../thorchain'
import { client$, selectedAsset$ } from './common'
import { INITIAL_LOAD_TXS_PROPS } from './const'
import { ApiError, ErrorId, LoadTxsHandler, ResetTxsPageHandler } from './types'

export const explorerUrl$: ExplorerUrl$ = C.explorerUrl$(client$)

export const getExplorerTxUrl$: GetExplorerTxUrl$ = C.getExplorerTxUrl$(client$)

/**
 * State of `LoadTxsProps`, which triggers reload of txs history
 */
const { get$: loadTxsProps$, set: setLoadTxsProps } = observableState<LoadTxsParams>(INITIAL_LOAD_TXS_PROPS)

export { setLoadTxsProps }

export const loadTxs: LoadTxsHandler = setLoadTxsProps

export const resetTxsPage: ResetTxsPageHandler = () => setLoadTxsProps(INITIAL_LOAD_TXS_PROPS)

/**
 * Factory create a stream of `TxsPageRD` based on selected asset
 */
export const getTxs$: (walletAddress: O.Option<string>, walletIndex?: number) => TxsPageLD = (
  walletAddress = O.none,
  walletIndex = 0 /* TODO (@asgdx-team) Will we still use `0` as default by introducing HD wallets in the future */
) =>
  Rx.combineLatest([selectedAsset$, loadTxsProps$]).pipe(
    RxOp.switchMap(([oAsset, { limit, offset }]) =>
      FP.pipe(
        oAsset,
        O.fold(
          () => Rx.of(RD.initial),
          (asset) => {
            switch (asset.chain) {
              case 'BNB':
                return BNB.txs$({ asset: O.some(asset), limit, offset, walletAddress, walletIndex })
              case 'BTC':
                return BTC.txs$({ asset: O.none, limit, offset, walletAddress, walletIndex })
              case 'ETH':
                return ETH.txs$({ asset: O.some(asset), limit, offset, walletAddress, walletIndex })
              case 'THOR':
                return THOR.txs$({ asset: O.none, limit, offset, walletAddress, walletIndex })
              case 'LTC':
                return LTC.txs$({ asset: O.none, limit, offset, walletAddress, walletIndex })
              case 'BCH':
                return BCH.txs$({ asset: O.none, limit, offset, walletAddress, walletIndex })
              default:
                return Rx.of(
                  RD.failure<ApiError>({ errorId: ErrorId.GET_ASSET_TXS, msg: `Unsupported chain ${asset.chain}` })
                )
            }
          }
        )
      )
    )
  )
