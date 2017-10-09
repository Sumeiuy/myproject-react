/**
 * @file components/commissionAdjustment/OtherCommissionSelect.js
 * @description 新建批量佣金调整中其他佣金费率下拉框
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Select from '../common/Select';
import styles from './otherCommissionSelect.less';

export default class OtherCommissionSelect extends PureComponent {
  static propTypes = {
    reset: PropTypes.number.isRequired,
    label: PropTypes.string,
    options: PropTypes.array,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    getPopupContainer: PropTypes.func.isRequired,
  }

  static defaultProps = {
    name: '',
    label: '',
    options: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { reset: prevReset } = this.props;
    const { reset: nextReset } = nextProps;
    if (prevReset !== nextReset) {
      this.setState({
        value: '',
      });
    }
  }

  @autobind
  onChange(name, value) {
    this.setState({
      value,
    });
    this.props.onChange(name, value);
  }

  render() {
    const { value } = this.state;
    const { name, label, options, getPopupContainer } = this.props;
    const newOptions = _.cloneDeep(options);
    newOptions.unshift({
      label: '请选择',
      value: '',
      show: true,
    });
    return (
      <div className={styles.lineInputWrap}>
        <div className={styles.label}>
          {label}<span className={styles.colon}>:</span>
        </div>
        <div className={`${styles.componentBox} ${styles.selectBox}`}>
          <Select
            name={name}
            data={newOptions}
            value={value}
            onChange={this.onChange}
            getPopupContainer={getPopupContainer}
          />
        </div>
      </div>
    );
  }
}
