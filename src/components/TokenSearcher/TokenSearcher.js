//@flow
import React from 'react';
import TokenSearcherRenderer from './TokenSearcherRenderer';
import { sortTable } from '../../utils/helpers';

//TODO not sure exactly where to define this type.
type Token = {
  pair: string,
  lastPrice: string,
  change: string,
  low: string,
  high: string,
  volume: string,
  base: string,
  quote: string,
  favorited: boolean,
};

type Props = {
  tokenPairsByQuoteToken: { [string]: Array<Token> },
  updateFavorite: (string, boolean) => void,
  updateCurrentPair: string => void,
};

type State = {
  quoteTokens: Array<string>,
  searchFilter: string,
  selectedToken: ?Token,
  filterName: string,
  sortOrder: string,
  selectedTabId: string,
  orderChanged: boolean,
  isOpen: boolean,
};

class TokenSearcher extends React.PureComponent<Props, State> {
  state = {
    quoteTokens: [],
    searchFilter: '',
    selectedToken: null,
    filterName: 'symbol',
    sortOrder: 'asc',
    selectedTabId: '',
    orderChanged: false,
    isOpen: true,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    let { tokenPairsByQuoteToken } = nextProps;
    const quoteTokens: Array<string> = Object.keys(tokenPairsByQuoteToken);
    const defaultQuote = quoteTokens[0];
    const defaultPairs = tokenPairsByQuoteToken[defaultQuote];

    if (!prevState.selectedToken) {
      return {
        quoteTokens: quoteTokens,
        selectedToken: defaultPairs[0],
        selectedTabId: defaultQuote,
      };
    } else return null;
  }

  onChangeSearchFilter = ({ target }: SyntheticInputEvent<>) => {
    this.setState({ searchFilter: target.value });
  };

  onChangeFilterName = ({ target }: SyntheticInputEvent<>) => {
    let value = target.className;
    const { filterName, orderChanged } = this.state;

    if (value === filterName && !orderChanged) {
      this.setState({
        filterName: value,
        sortOrder: 'desc',
        orderChanged: true,
      });
    } else {
      this.setState({
        filterName: value,
        sortOrder: 'asc',
        orderChanged: false,
      });
    }
  };

  onChangeSortOrder = (value: string) => {
    this.setState({ sortOrder: value });
  };

  toggleCollapse = () => {
    this.setState(function(prevState) {
      return { isOpen: !prevState.isOpen };
    });
  };

  changeTab = (tabId: string) => {
    this.setState({ selectedTabId: tabId });
  };

  filterTokens = () => {
    let result = { favorites: [] };
    const { tokenPairsByQuoteToken } = this.props;
    const { searchFilter, filterName, sortOrder } = this.state;

    for (let quote of Object.keys(tokenPairsByQuoteToken)) {
      result[quote] = tokenPairsByQuoteToken[quote].filter(pair => {
        return pair.base.indexOf(searchFilter.toUpperCase()) > -1;
      });

      result['favorites'] = sortTable(
        result['favorites'].concat(tokenPairsByQuoteToken[quote].filter(pair => pair.favorited)),
        filterName,
        sortOrder
      );
      result[quote] = sortTable(result[quote], filterName, sortOrder);
    }

    return result;
  };

  changeSelectedToken = (token: Token) => {
    this.setState({ selectedToken: token });
    this.props.updateCurrentPair(token.pair);
  };

  render() {
    const {
      state: { selectedTabId, searchFilter, selectedToken, sortOrder, filterName, quoteTokens, isOpen },
      props: { updateFavorite },
      onChangeSearchFilter,
      onChangeFilterName,
      onChangeSortOrder,
      changeTab,
      toggleCollapse,
      changeSelectedToken,
    } = this;

    const filteredPairs = this.filterTokens();

    //Temporary loading condition
    let loading = typeof selectedToken === 'undefined';

    return (
      <TokenSearcherRenderer
        loading={loading}
        quoteTokens={quoteTokens}
        selectedTabId={selectedTabId}
        searchFilter={searchFilter}
        // silence-error: couldn't resolve selectedToken === undefined case
        selectedToken={selectedToken}
        sortOrder={sortOrder}
        isOpen={isOpen}
        filterName={filterName}
        filteredPairs={filteredPairs}
        updateFavorite={updateFavorite}
        onChangeSearchFilter={onChangeSearchFilter}
        onChangeFilterName={onChangeFilterName}
        onChangeSortOrder={onChangeSortOrder}
        changeTab={changeTab}
        toggleCollapse={toggleCollapse}
        changeSelectedToken={changeSelectedToken}
      />
    );
  }
}

export default TokenSearcher;
