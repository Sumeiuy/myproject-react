import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DatePicker, Radio } from 'antd';
import moment from 'moment';
import { Button } from 'lego-react-filter/src';
import styles from './lastServiceDateMenu.less';

const RadioGroup = Radio.Group;

export default class LastServiceDateMenu extends PureComponent {
  static propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({label, value})
  }


  state = {
    date: this.props.value[0] ? moment(this.props.value[0]) : null,
    radioValue: this.props.value[1] || null,
    error: false,
  }

  handleRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value,
      error: false,
    });
  }

  handleDateChange = (date) => {
    this.setState({
      date,
      dateError: false,
    });
  }

  handleResetBtnClick = () => {
    this.setState({
      date: null,
      radioValue: null,
      error: false,
      dateError: false,
    });

    this.props.onChange({
      date: null,
      radioValue: null,
    });
  }

  handleSubmitBtnClick = () => {
    const { date, radioValue } = this.state;
    const dateString = date ? date.format('YYYY-MM-DD') : null;
    if ((radioValue && dateString) || (!radioValue && !dateString)) {
      this.props.onChange({
        date: dateString,
        radioValue,
      }, {
        inVisible: true,
      });
    } else if (!radioValue) {
      this.setState({
        error: true,
      });
      this.props.onChange({
        date: dateString,
        radioValue,
      }, {
        isUnValid: true,
      });
    } else if (!dateString) {
      this.setState({
        dateError: true,
      });
      this.props.onChange({
        date: dateString,
        radioValue,
      }, {
        isUnValid: true,
      });
    }
  }

  disabledDate = current => (current > moment().endOf('day'))

  render() {
    const cls = classNames({
      [styles.errMessage]: true,
      [styles.show]: this.state.error,
    });

    const dateCls = classNames({
      [styles.errMessage]: true,
      [styles.show]: this.state.dateError,
    });

    return (
      <div className={styles.lastServiceDateMenu}>
        <div className={styles.datePickerContent}>
          <span>在</span>
          <DatePicker
            value={this.state.date}
            disabledDate={this.disabledDate}
            className={styles.datePicker}
            onChange={this.handleDateChange}
            getCalendarContainer={() => this.elem}
          />
          <span>之后</span>
        </div>
        <div ref={ref => this.elem = ref} />
        <div className={dateCls}>请选择时间</div>
        <div className={styles.menuRadio}>
          <RadioGroup
            className={styles.radioGroup}
            onChange={this.handleRadioChange}
            value={this.state.radioValue}
          >
            <Radio className={styles.radio} value="serviced">服务过</Radio>
            <Radio className={styles.radio} value="unServiced">未服务</Radio>
          </RadioGroup>
          <div className={cls}>请选择一个选项</div>
        </div>
        <div className={styles.btnGroup}>
          <Button onClick={this.handleResetBtnClick} type="cancel">重置</Button>
          <Button onClick={this.handleSubmitBtnClick} type="submit">确定</Button>
        </div>
      </div>
    );
  }
}
