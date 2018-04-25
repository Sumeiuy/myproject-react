/**
 * @Description: 精选组合弹窗
 * @Author: Liujianshu
 * @Date: 2018-04-24 15:40:21
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-04-25 17:20:11
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';
import moment from 'moment';
import _ from 'lodash';


import Select from '../common/Select';
import Button from '../common/Button';
// import Icon from '../common/Icon';
import config from './config';
import styles from './combinationModal.less';

const { timeRange, directionRange } = config;
export default class CombinationModal extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      time: '3',
      direction: '',
      startDate: '',
      endDate: '',
    };
  }

  componentDidMount() {
    this.calcDate('3');
  }

  // 计算事件函数，返回格式化后的开始、结束日期
  @autobind
  calcDate(value) {
    // 开始日期
    let begin = '';
    // 结束日期
    let end = '';
    // 取出现在的时间
    const now = new Date();
    // 结束日期对象
    const endMoment = moment(now);
    // 开始日期对象
    if (!_.isEmpty(value)) {
      const beginMoment = moment(endMoment).subtract(value, 'month');
      // 开始日期格式化
      begin = beginMoment.format('YYYYMMDD');
      // 结束日期格式化
      end = endMoment.format('YYYYMMDD');
    }
    this.setState({
      startDate: begin,
      endDate: end,
    });
  }

  @autobind
  selectChangeHandle(key, value) {
    if (key === 'time') {
      this.calcDate(value);
    }
    this.setState({
      [key]: value,
    });
  }

  render() {
    const footerContent = (<Button
      key="close"
    >
      关闭
    </Button>);
    const { time, direction, startDate, endDate } = this.state;
    console.warn('render startDate', startDate);
    console.warn('render endDate', endDate);
    return (
      <div className={styles.combinationModal}>
        <Modal
          title="标题"
          visible
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={footerContent}
          wrapClassName={styles.modal}
        >
          时间范围
          <Select
            name="time"
            width="142px"
            data={timeRange}
            value={time}
            onChange={this.selectChangeHandle}
          />
          组合名称
          {/* <Select
            name="subType"
            data={subTypeList}
            value={subType}
            onChange={this.handleSubTypeSelect}
          /> */}
          调仓方向
          <Select
            name="direction"
            width="142px"
            data={directionRange}
            value={direction}
            onChange={this.selectChangeHandle}
          />
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}
