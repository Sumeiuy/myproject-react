import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import _ from 'lodash';
import DateRangePicker from '../../dateRangePicker';
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
  };
  static defaultProps = {
    // example props for the demo
    defaultVisible: false,
    className: '',
    isCloseable: false,
    initialStartDate: null,
    initialEndDate: null,
    stateDateWrapper: date => date.format('YYYY-MM-DD'),
    filterName: '开户日期',
    filterId: 'dateOpened',
    onChange: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.state = {
      hidden: false,
    };
  }

  onDatesChange({ startDate, endDate }) {
    const { stateDateWrapper } = this.props;
    const formatStartDate = startDate && stateDateWrapper(startDate);
    const formatEndDate = endDate && stateDateWrapper(endDate);
    this.props.onChange({
      name: this.props.filterId,
      value: [formatStartDate, formatEndDate],
    });
  }

  handleClickClose = () => {
    this.setState({ hidden: true });
    this.props.onClose();
  }

  render() {
    const { value } = this.props;
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

    return (
      <div className={this.props.className}>
        <div className={filterContainerClasses}>
          <span className={styles.dateLabel}>
            {`${this.props.filterName}:`}
          </span>
          <DateRangePicker
            inputIconPosition="after"
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
            disabledRange={day => !isInclusivelyBeforeDay(day, moment())}
            onChange={this.onDatesChange}
            defaultVisible={this.props.defaultVisible}
            noBorder
            readOnly
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
