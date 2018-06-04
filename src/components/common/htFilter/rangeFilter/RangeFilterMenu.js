import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import Input from '../htInput';
import Button from '../button';
import styles from './rangeFilterMenu.less';

const pattern = /([0-9]|\.)*/;

export default class RangeFilterMenu extends PureComponent {
  static propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({label, value})
    unit: PropTypes.string.isRequired,
    unitStyle: PropTypes.object.isRequired,
  }

  state = {
    min: this.props.value[0] || '',
    max: this.props.value[1] || '',
    error: {
      isValid: true,
      minError: '',
      maxError: '',
      commmonError: '',
    },
  }

  componentDidMount() {
    return this.firstFocusElem && this.firstFocusElem.focus();
  }

  handleMinInputChange = (e) => {
    this.setState({
      min: pattern.exec(e.target.value)[0],
      error: {
        isValid: true,
        minError: '',
        commmonError: '',
      },
    });
  }

  handleMaxInputChange = (e) => {
    this.setState({
      max: pattern.exec(e.target.value)[0],
      error: {
        isValid: true,
        maxError: '',
        commmonError: '',
      },
    });
  }

  handleResetBtnClick = () => {
    this.setState({
      min: '',
      max: '',
      error: {
        isValid: true,
        minError: '',
        maxError: '',
        commmonError: '',
      },
    });

    this.props.onChange({
      min: '',
      max: '',
    });
  }

  handleSubmitBtnClick = () => {
    const isValid = this.validData();
    if (isValid) {
      this.props.onChange({
        min: this.state.min,
        max: this.state.max,
      }, {
        inVisible: true,
      });
    } else {
      this.props.onChange({
        ...this.state,
      }, {
        isUnValid: true,
      });
    }
  }

  validData = () => {
    const { min, max } = this.state;

    const minNum = _.toNumber(min);
    const maxNum = _.toNumber(max);

    const minError = this.valid(minNum);

    if (minError) {
      this.setState({
        error: {
          isValid: false,
          minError,
        },
      });
      return false;
    }

    const maxError = this.valid(maxNum);
    if (maxError) {
      this.setState({
        error: {
          isValid: false,
          maxError,
        },
      });

      return false;
    }

    if (!min || !max) {
      return true;
    }

    const commmonError = this.commonValid({ minNum, maxNum });
    if (commmonError) {
      this.setState({
        error: {
          isValid: false,
          commmonError,
        },
      });

      return false;
    }

    return true;
  }

  valid = (num) => {
    if (_.isNaN(num)) {
      return '请输入数字';
    }

    if (num < 0) {
      return '请输入一个大于0的数字';
    }

    return '';
  }

  commonValid = ({ minNum, maxNum }) => {
    if (minNum > maxNum) {
      return '请保证输入的最大值不小于最小值';
    }

    return '';
  }

  renderErrorMessage = () =>
    this.state.error.minError ||
    this.state.error.maxError ||
    this.state.error.commmonError


  render() {
    const cls = classNames({
      [styles.errMessage]: true,
      [styles.show]: !this.state.error.isValid,
    });

    return (
      <div className={styles.rangeFilterMenu}>
        <Input
          className={
            this.state.error.minError || this.state.error.commmonError ?
            styles.error : null
          }
          placeholder="最小"
          value={this.state.min}
          unit={this.props.unit}
          unitStyle={this.props.unitStyle}
          onChange={this.handleMinInputChange}
          autoFocus
        />
        <span><i className={styles.divider} /></span>
        <Input
          placeholder="最大"
          className={
            this.state.error.maxError || this.state.error.commmonError ?
              styles.error : null
          }
          value={this.state.max}
          unit={this.props.unit}
          unitStyle={this.props.unitStyle}
          onChange={this.handleMaxInputChange}
        />
        <div className={cls}>{this.renderErrorMessage()}</div>
        <div className={styles.btnGroup}>
          <Button onClick={this.handleResetBtnClick} type="cancel">重置</Button>
          <Button onClick={this.handleSubmitBtnClick} type="submit">确定</Button>
        </div>
      </div>
    );
  }
}
