import React, { createContext, useContext } from 'react'

import {
  addressByChain$,
  clientByChain$,
  symDepositFees$,
  reloadSymDepositFees,
  asymDepositFee$,
  reloadAsymDepositFee,
  symDepositTxMemo$,
  asymDepositTxMemo$,
  getWithdrawMemo$,
  symWithdrawFee$,
  reloadWithdrawFees,
  retrieveLedgerAddress,
  removeLedgerAddress,
  removeAllLedgerAddress,
  reloadSwapFees,
  swapFees$,
  getExplorerUrlByAsset$,
  getExplorerAddressByChain$,
  assetAddress$,
  swap$,
  asymDeposit$,
  symDeposit$,
  upgradeRuneToNative$,
  symWithdraw$,
  asymWithdraw$,
  transfer$,
  assetWithDecimal$
} from '../services/chain'

type ChainContextValue = {
  addressByChain$: typeof addressByChain$
  clientByChain$: typeof clientByChain$
  symDepositFees$: typeof symDepositFees$
  reloadSymDepositFees: typeof reloadSymDepositFees
  asymDepositFee$: typeof asymDepositFee$
  reloadAsymDepositFee: typeof reloadAsymDepositFee
  symWithdrawFee$: typeof symWithdrawFee$
  reloadWithdrawFees: typeof reloadWithdrawFees
  symDepositTxMemo$: typeof symDepositTxMemo$
  asymDepositTxMemo$: typeof asymDepositTxMemo$
  getWithdrawMemo$: typeof getWithdrawMemo$
  retrieveLedgerAddress: typeof retrieveLedgerAddress
  removeLedgerAddress: typeof removeLedgerAddress
  removeAllLedgerAddress: typeof removeAllLedgerAddress
  reloadSwapFees: typeof reloadSwapFees
  swapFees$: typeof swapFees$
  getExplorerUrlByAsset$: typeof getExplorerUrlByAsset$
  getExplorerAddressByChain$: typeof getExplorerAddressByChain$
  assetAddress$: typeof assetAddress$
  swap$: typeof swap$
  asymDeposit$: typeof asymDeposit$
  symDeposit$: typeof symDeposit$
  upgradeRuneToNative$: typeof upgradeRuneToNative$
  symWithdraw$: typeof symWithdraw$
  asymWithdraw$: typeof asymWithdraw$
  transfer$: typeof transfer$
  assetWithDecimal$: typeof assetWithDecimal$
}

const initialContext: ChainContextValue = {
  addressByChain$,
  clientByChain$,
  symDepositFees$,
  reloadSymDepositFees,
  asymDepositFee$,
  reloadAsymDepositFee,
  symWithdrawFee$,
  reloadWithdrawFees,
  symDepositTxMemo$,
  asymDepositTxMemo$,
  getWithdrawMemo$,
  retrieveLedgerAddress,
  removeLedgerAddress,
  removeAllLedgerAddress,
  reloadSwapFees,
  swapFees$,
  getExplorerUrlByAsset$,
  getExplorerAddressByChain$,
  assetAddress$,
  swap$,
  asymDeposit$,
  symDeposit$,
  upgradeRuneToNative$,
  symWithdraw$,
  asymWithdraw$,
  transfer$,
  assetWithDecimal$
}
const ChainContext = createContext<ChainContextValue | null>(null)

export const ChainProvider: React.FC = ({ children }): JSX.Element => {
  return <ChainContext.Provider value={initialContext}>{children}</ChainContext.Provider>
}

export const useChainContext = () => {
  const context = useContext(ChainContext)
  if (!context) {
    throw new Error('Context must be used within a ChainProvider.')
  }
  return context
}
