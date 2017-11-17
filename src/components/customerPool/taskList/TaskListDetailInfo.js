/**
 * @file components/customerPool/TaskListDetailInfo.js
 *  自建任务列表详情
 * @author 朱胜楠
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InfoItem from '../../common/infoItem';
import { seibelConfig } from '../../../config';

import styles from './detailInfo.less';

const { tasklist: { status } } = seibelConfig;

// 存储状态码，处理中：'01'，驳回：'04'
const arr = ['01', '04'];

export default class TaskListDetailInfo extends PureComponent {

  static propTypes = {
    infoData: PropTypes.object,
  }

  static defaultProps = {
    infoData: {},
  }

  // 后台返回的子类型字段、状态字段转化为对应的中文显示
  changeDisplay(st, options) {
    if (st && !_.isEmpty(st)) {
      const nowStatus = _.find(options, o => o.value === st) || {};
      return nowStatus.label || '--';
    }
    return '--';
  }

  render() {
    const { infoData } = this.props;
    return (
      <div id="detailModule" className={styles.module}>
        {_.includes(arr, infoData.status) ?
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="任务状态" value={this.changeDisplay(infoData.status, status) || '--'} />
              </li>
              <li className={styles.item}>
                <InfoItem label="有效期（天）" value={String(infoData.timelyIntervalValue) || '--'} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务策略" value={infoData.strategyDesc || '--'} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务提示" value={infoData.infoContent || '--'} />
              </li>
            </ul>
          </div> :
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.fir}>
                <InfoItem label="任务状态" value={this.changeDisplay(infoData.status, status) || '--'} />
              </li>
              <li className={styles.sed}>
                <InfoItem label="触发时间" value={infoData.triggerTime || '--'} />
              </li>
              <li className={styles.fir}>
                <InfoItem label="创建时间" value={infoData.createTime || '--'} />
              </li>
              <li className={styles.sed}>
                <InfoItem label="截止时间" value={infoData.deadTime || '--'} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务策略" value={infoData.strategyDesc || '--'} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务提示" value={infoData.infoContent || '--'} />
              </li>
            </ul>
          </div>
        }
      </div>
    );
  }
}
