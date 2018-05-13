import React from 'react';
import PropTypes from 'prop-types';
import SingleFilter from './singleFilter/SingleFilter';
import MultiFilter from './multiFilter/MultiFilter';
import Input from './input/index';
import MoreFilter from './moreFilter/MoreFilter';
import RangeFilter from './rangeFilter/RangeFilter';
import FormFilter from './formFilter/FormFilter';
import TreeFilter from './treeFilter/src/index';
import DateFilter from './dateFilter/index';

import '../../../../static/htFont/iconfont.less';

export {
  SingleFilter,
  MultiFilter,
  MoreFilter,
  RangeFilter,
  TreeFilter,
  DateFilter,
  Input,
};

export default function HtFilter(props) {
  switch (props.type) {
    case 'single':
    case 'singleSearch':
      return (<SingleFilter {...props} />);
    case 'multi':
      return (<MultiFilter {...props} />);
    case 'range':
      return (<RangeFilter {...props} />);
    case 'form':
      return (<FormFilter {...props} />);
    case 'date':
      return (<DateFilter {...props} />);
    default:
      return (
        <SingleFilter {...props} />
      );
  }
}

HtFilter.propTypes = {
  type: PropTypes.string,
};

HtFilter.defaultProps = {
  type: '',
};

