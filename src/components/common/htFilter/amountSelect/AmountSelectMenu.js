import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Radio } from 'antd';
import { Button, UnitInput } from 'lego-react-filter/src';
import styles from './amountSelectMenu.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const pattern = /^(-)?([0-9]|\.)*/;

export default class AmountSelectMenu extends PureComponent {
  static propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({label, value})
    data: PropTypes.object.isRequired,
    unit: PropTypes.string,
    unitStyle: PropTypes.object,
  }

  static defaultProps = {
    unit: '元',
    unitStyle: {
      right: 8,
    },
  }

  state = {
    dateType: this.props.value[0] || '',
    dateTypeErr: false,
    min: this.props.value[1] || '',
    max: this.props.value[2] || '',
    error: {
      isValid: true,
      minError: '',
      maxError: '',
      commmonError: '',
    },
  }

  getNumValue(value) {
    if (value === '') {
      return '';
    }
    return _.toNumber(value);
  }

  handleRidioChange = (e) => {
    this.setState({
      dateType: e.target.value,
      dateTypeErr: false,
    });
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
      dateType: '',
      dateTypeErr: false,
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
      dateType: '',
      min: '',
      max: '',
    });
  }

  handleSubmitBtnClick = () => {
    const { dateType } = this.state;
    const validData = this.validData();
    const isInputHasValue = this.checkInputValue();

    // 通过了input输入校验
    if (validData.isValid) {
      // 周期与金额都选或者都不选
      if ((!dateType && !isInputHasValue)
        || (dateType && isInputHasValue)) {
        this.props.onChange({
          dateType: this.state.dateType,
          min: this.getNumValue(this.state.min),
          max: this.getNumValue(this.state.max),
        }, {
          inVisible: true,
        });
      } else if (!dateType) { // 没有选择周期
        this.setState({
          dateTypeErr: true,
        });
        this.props.onChange({
          dateType: this.state.dateType,
          min: this.state.min,
          max: this.state.max,
        }, {
          isUnValid: true,
        });
      } else if (!isInputHasValue) { // 没有选择金额
        this.setState({
          error: {
            isValid: false,
            commmonError: '请输入最小值或者最大值',
          },
        });

        this.props.onChange({
          dateType: this.state.dateType,
          min: this.state.min,
          max: this.state.max,
        }, {
          isUnValid: true,
        });
      }
    } else { // 没有通过数据校验
      this.setState({
        error: validData,
      });
      this.props.onChange({
        dateType: this.state.dateType,
        min: this.state.min,
        max: this.state.max,
      }, {
        isUnValid: true,
      });
    }
  }

  checkInputValue = () => {
    const { min, max } = this.state;
    return !!(min || max);
  }

  validData = () => {
    const { min, max } = this.state;

    const minNum = _.toNumber(min);
    const maxNum = _.toNumber(max);

    const minError = this.valid(minNum);
    if (minError) {
      return {
        isValid: false,
        minError,
      };
    }

    const maxError = this.valid(maxNum);
    if (maxError) {
      return {
        isValid: false,
        maxError,
      };
    }

    if (!min || !max) {
      return {
        isValid: true,
      };
    }

    const commmonError = this.commonValid({ minNum, maxNum });
    if (commmonError) {
      return {
        isValid: false,
        commmonError,
      };
    }

    return {
      isValid: true,
    };
  }

  valid = (num) => {
    if (_.isNaN(num)) {
      return '请输入数字';
    }

    /*  if (num < 0) {
      return '请输入一个大于0的数字';
    } */

    return '';
  }

  commonValid = ({ minNum, maxNum }) => {
    if (minNum > maxNum) {
      return '请保证输入的最大值不小于最小值';
    }

    return '';
  }

  renderErrorMessage = () => this.state.error.minError
    || this.state.error.maxError
    || this.state.error.commmonError

  render() {
    const { data } = this.props;
    const radioCls = classNames({
      [styles.errMessage]: true,
      [styles.show]: this.state.dateTypeErr,
    });
    const cls = classNames({
      [styles.errMessage]: true,
      [styles.show]: !this.state.error.isValid,
    });

    const maxInputCls = classNames({
      [styles.inputError]: this.state.error.maxError || this.state.error.commmonError,
    });

    const minInputCls = classNames({
      [styles.inputError]: this.state.error.minError || this.state.error.commmonError,
    });

    return (
      <div className={styles.amountSelectMenu}>
        <div className={styles.radioGroup} onChange={this.handleRidioChange}>
          <div className={styles.label}>周期</div>
          <RadioGroup value={this.state.dateType} size="large">
            {
              _.map(data.dateType, item => ((
                <RadioButton key={item.key} value={item.key} autoFocus>{item.value}</RadioButton>
              )))
            }
          </RadioGroup>
          <div className={radioCls}>请选择周期</div>
        </div>
        <div className={styles.menuRange}>
          <div className={styles.label}>金额</div>
          <UnitInput
            placeholder="最小"
            className={minInputCls}
            value={this.state.min}
            unit={this.props.unit}
            unitStyle={this.props.unitStyle}
            onChange={this.handleMinInputChange}
            autoFocus
          />
          <span><i className={styles.divider} /></span>
          <UnitInput
            placeholder="最大"
            className={maxInputCls}
            value={this.state.max}
            unit={this.props.unit}
            unitStyle={this.props.unitStyle}
            onChange={this.handleMaxInputChange}
          />
          <div className={cls}>{this.renderErrorMessage()}</div>
        </div>
        <div className={styles.btnGroup}>
          <Button onClick={this.handleResetBtnClick} type="cancel">重置</Button>
          <Button onClick={this.handleSubmitBtnClick} type="submit">确定</Button>
        </div>
      </div>
    );
  }
}
