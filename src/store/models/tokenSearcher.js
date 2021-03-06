// @flow
import type { State, ThunkAction } from '../../types';
import { getTokenPairsDomain } from '../domains';
import * as actionCreators from '../actions/tokenSearcher';
import * as ohlcvActionCreators from '../actions/ohlcv';

import { getQuoteToken, getBaseToken } from '../../utils/tokens';
import { quoteTokenSymbols as quotes } from '../../config/quotes';

export default function tokenSearcherSelector(state: State) {
  let domain = getTokenPairsDomain(state);

  let tokenPairs = domain.getTokenPairsDataArray();
  let favoriteTokenPairs = domain.getFavoritePairs();
  let tokenPairsByQuoteToken = {};

  for (let quote of quotes) {
    tokenPairsByQuoteToken[quote] = tokenPairs
      .filter(({ pair }) => getQuoteToken(pair) === quote)
      .map(tokenPair => ({
        ...tokenPair,
        base: getBaseToken(tokenPair.pair),
        quote: getQuoteToken(tokenPair.pair),
      }))
      .map(tokenPair => ({
        ...tokenPair,
        favorited: favoriteTokenPairs.indexOf(tokenPair.pair) > -1,
      }));
  }

  let currentPair = domain.getCurrentPair();

  return {
    tokenPairsByQuoteToken,
    currentPair,
  };
}

export const updateCurrentPair = (pair: string): ThunkAction => {
  return async (dispatch, getState, { api, trading }) => {
    try {
      dispatch(actionCreators.updateCurrentPair(pair));

      let ohlcv = await trading.getData();
      dispatch(ohlcvActionCreators.saveData(ohlcv));

      let { bids, asks, trades } = await api.getOrderBookData();
      dispatch(actionCreators.updateOrderBook(bids, asks));
      dispatch(actionCreators.updateTradesTable(trades));
    } catch (e) {
      console.log(e);
    }
  };
};
