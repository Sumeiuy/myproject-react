/**
 * @file components/commissionAdjustment/Detail.js
 *  任务列表详情
 * @author zhushwengnan
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InfoItem from '../../common/infoItem';
import styles from './taskListDetailInfo.less';


export default class TaskListDetailInfo extends PureComponent {

  static propTypes = {
    status: PropTypes.string,
    infoData: PropTypes.object,
    onIsEmpty: PropTypes.func.isRequired,
  }

  static defaultProps = {
    status: '',
    infoData: {},
  }


  handleIsEmpty(value) {
    let words = '--';
    if (!_.isEmpty(value)) {
      words = value;
    }
    return words;
  }

  render() {
    const { status, infoData, onIsEmpty } = this.props;
    return (
      <div id="detailModule" className={styles.module}>
        {status === '审批中' || status === '被驳回' ?
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="任务状态" value={status} />
              </li>
              <li className={styles.item}>
                <InfoItem label="有效期（天）" value={onIsEmpty(infoData.timelyIntervalValue)} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务策略" value={onIsEmpty(infoData.strategyDesc)} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务提示" value={onIsEmpty(infoData.infoContent)} />
              </li>
            </ul>
          </div> :
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.fir}>
                <InfoItem label="任务状态" value={status} />
              </li>
              <li className={styles.sed}>
                <InfoItem label="触发时间" value={onIsEmpty(infoData.triggerTime)} />
              </li>
              <li className={styles.fir}>
                <InfoItem label="创建时间" value={onIsEmpty(infoData.createTime)} />
              </li>
              <li className={styles.sed}>
                <InfoItem label="截止时间" value={onIsEmpty(infoData.deadTime)} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务策略" value={onIsEmpty(infoData.strategyDesc)} />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务提示" value={onIsEmpty(infoData.infoContent)} />
              </li>
            </ul>
          </div>
        }
      </div>
    );
  }
}

