import { ETHChain } from '@xchainjs/xchain-util'

import { reloadBalances, balances$, reloadBalances$, resetReloadBalances } from './balances'
import {
  client$,
  clientViewState$,
  address$,
  addressUI$,
  explorerUrl$,
  getExplorerTxUrl$,
  getExplorerAddressUrl$
} from './common'
import { createFeesService } from './fees'
import { createTransactionService } from './transaction'

const {
  txs$,
  tx$,
  txStatus$,
  subscribeTx,
  resetTx,
  sendTx,
  txRD$,
  sendPoolTx$,
  approveERC20Token$,
  isApprovedERC20Token$
} = createTransactionService(client$)
const { reloadFees, fees$, poolInTxFees$, poolOutTxFee$, approveFee$, reloadApproveFee } = createFeesService({
  client$,
  chain: ETHChain
})

export {
  client$,
  clientViewState$,
  address$,
  addressUI$,
  reloadBalances,
  explorerUrl$,
  getExplorerTxUrl$,
  getExplorerAddressUrl$,
  balances$,
  reloadBalances$,
  resetReloadBalances,
  txs$,
  tx$,
  txStatus$,
  sendTx,
  subscribeTx,
  resetTx,
  txRD$,
  reloadFees,
  fees$,
  sendPoolTx$,
  poolInTxFees$,
  poolOutTxFee$,
  approveFee$,
  reloadApproveFee,
  approveERC20Token$,
  isApprovedERC20Token$
}
