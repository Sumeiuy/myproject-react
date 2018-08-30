import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import _ from 'lodash';
import DateRangePick from 'lego-react-date/src';
import isInclusivelyBeforeDay from '../../dateRangePicker/utils/isInclusivelyBeforeDay';

import styles from './dateFilter.less';

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
    this.onDatesChange = this.onDatesChange.bind(this);
    this.state = {
      hidden: false,
    };
  }

  onDatesChange(formatStartDate, formatEndDate) {
    this.props.onChange({
      name: this.props.filterId,
      filterName: this.props.filterName,
      value: [formatStartDate, formatEndDate],
    });
  }

  handleClickClose = () => {
    this.setState({ hidden: true });
    this.props.onClose();
  }

  render() {
    const { value, disabledCurrentEnd } = this.props;
    const filterContainerClasses = classNames({
      [styles.dateFilter]: true,
      [styles.dateFilterContainer]: true,
      [styles.hidden]: this.state.hidden,
    });

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
    const dateProps = _.omit(this.props, _.keys(DateFilter.propTypes));
    return (
      <div className={this.props.className}>
        <div className={filterContainerClasses}>
          <span className={styles.dateLabel}>
            {`${this.props.filterName}:`}
          </span>
          <DateRangePick
            {...dateProps}
            filterName=""
            filterValue={[initialStartDate, initialEndDate]}
            onChange={date => this.onDatesChange(date.value[0], date.value[1])}
            disabledStart={disabledCurrentEnd ?
              startDate => !isInclusivelyBeforeDay(startDate, moment())
              : _.noop}
            disabledEnd={disabledCurrentEnd ?
              (startDate, endDate) => !isInclusivelyBeforeDay(endDate, moment())
              : _.noop}
            defaultVisible={this.props.defaultVisible}
          />
        </div>
        <div
          style={this.props.isCloseable ? {} : { display: 'none' }}
          className={`${styles.closeIcon} ht-iconfont ht-icon-guanbi1`}
          onClick={this.handleClickClose}
        />
      </div>
    );
  }
}
