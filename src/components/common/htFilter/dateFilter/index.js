import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import DateRangePick from 'lego-react-date/src';
import isInclusivelyBeforeDay from '../../dateRangePicker/utils/isInclusivelyBeforeDay';

export default class DateFilter extends React.Component {
  static propTypes = {
    // example props for the demo
    stateDateWrapper: PropTypes.func,
    className: PropTypes.string,
    initialStartDate: PropTypes.object,
    initialEndDate: PropTypes.object,
    filterName: PropTypes.string,
    filterId: PropTypes.string,
    onChange: PropTypes.func,
    defaultVisible: PropTypes.bool,
    isCloseable: PropTypes.bool,
    onClose: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
    disabledCurrentEnd: PropTypes.bool,
  };
  static defaultProps = {
    // example props for the demo
    defaultVisible: false,
    className: '',
    isCloseable: false,
    disabledCurrentEnd: true,
    initialStartDate: null,
    initialEndDate: null,
    stateDateWrapper: date => date.format('YYYY-MM-DD'),
    filterName: '开户日期',
    filterId: 'dateOpened',
    onChange: _.noop,
    onClose: _.noop,
  };

  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(formatStartDate, formatEndDate) {
    const { onChange, filterId, filterName } = this.props;
    onChange({
      name: filterId,
      filterName,
      value: [formatStartDate, formatEndDate],
    });
  }

  handleClickClose = () => {
    this.props.onClose();
  }

  render() {
    const { value, disabledCurrentEnd } = this.props;

    let initialStartDate;
    let initialEndDate;
    if (_.isArray(value)) {
      if (value[0]) {
        initialStartDate = moment(value[0]);
      }
      if (value[1]) {
        initialEndDate = moment(value[1]);
      }
    }
    return (
      <DateRangePick
        className={this.props.className}
        filterName={this.props.filterName}
        filterValue={[initialStartDate, initialEndDate]}
        onChange={date => this.handleDateChange(date.value[0], date.value[1])}
        disabledStart={disabledCurrentEnd ?
          startDate => !isInclusivelyBeforeDay(startDate, moment())
          : _.noop}
        disabledEnd={disabledCurrentEnd ?
          (startDate, endDate) => !isInclusivelyBeforeDay(endDate, moment())
          : _.noop}
        defaultVisible={this.props.defaultVisible}
        isCloseable={this.props.isCloseable}
        onClose={this.handleClickClose}
      />
    );
  }
}
