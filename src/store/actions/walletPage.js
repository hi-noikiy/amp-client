// @flow
import type { UpdateAccountAllowancesAction, UpdateAccountBalancesAction } from '../../types/walletPage';

import type { AccountAllowances, AccountBalances } from '../../types/accountBalances';

const actionTypes = {
  updateBalances: 'walletPage/UPDATE_BALANCES',
  updateAllowances: 'walletPage/UPDATE_ALLOWANCES',
  updateCurrentBlock: 'walletPage/UPDATE_CURRENT_BLOCK',
};

export function updateBalances(balances: AccountBalances): UpdateAccountBalancesAction {
  return {
    type: actionTypes.updateBalances,
    payload: { balances },
  };
}

export function updateAllowances(allowances: AccountAllowances): UpdateAccountAllowancesAction {
  return {
    type: actionTypes.updateAllowances,
    payload: { allowances },
  };
}

export function updateCurrentBlock(currentBlock: string) {
  console.log(currentBlock);
  return {
    type: actionTypes.updateCurrentBlock,
    payload: { currentBlock },
  };
}

export default actionTypes;
