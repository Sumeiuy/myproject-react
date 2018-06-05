import React from 'react';
import PropTypes from 'prop-types';
import LegoFilter, {
  SingleFilter,
  MultiFilter,
  MoreFilter,
  RangeFilter,
} from 'lego-react-filter/src';


import DateFilter from './dateFilter';

export default function Filter(props) {
  switch (props.type) {
    case 'date':
      return (<DateFilter {...props} />);
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
};

Filter.propTypes = {
  type: PropTypes.string,
};

Filter.defaultProps = {
  type: '',
};

