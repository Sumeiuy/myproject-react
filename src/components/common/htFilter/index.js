import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import LegoFilter, {
  SingleFilter,
  MultiFilter,
  MoreFilter,
  RangeFilter,
  MultiFilterWithSearch,
} from 'lego-react-filter/src';

import { TreeFilter } from 'lego-tree-filter/src';

import DateFilter from './dateFilter';
import TagFilter from './tagFilter';
import AmountRangeFilter from './amountSelect';
import LastServiceDate from './lastServiceDate';

function getDateFilter(props) {
  const dateProps = _.omit(props, ['type', 'data', 'onInputChange']);
  return (<DateFilter {...dateProps} />);
}

function getTreeFilter(props) {
  const treeProps = _.omit(props, ['type', 'data', 'onInputChange']);
  const { data } = props; // eslint-disable-line
  return (<TreeFilter treeData={data} {...treeProps} />);
}
export default function Filter(props) {
  switch (props.type) {
    case 'date':
      return getDateFilter(props);
    case 'amountRangeSelect':
      return (<AmountRangeFilter {...props} />);
    case 'lastServiceDate':
      return (<LastServiceDate {...props} />);
    case 'tree':
      return getTreeFilter(props);
    default:
      return <LegoFilter {...props} />;
  }
}

export {
  DateFilter,
  LegoFilter,
  SingleFilter,
  MultiFilter,
  MoreFilter,
  RangeFilter,
  TagFilter,
  MultiFilterWithSearch,
  AmountRangeFilter,
};

Filter.propTypes = {
  type: PropTypes.string,
};

Filter.defaultProps = {
  type: '',
};
