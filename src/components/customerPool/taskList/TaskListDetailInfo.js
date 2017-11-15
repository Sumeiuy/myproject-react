/**
 * @file components/commissionAdjustment/Detail.js
 *  批量佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';

// import InfoTitle from '../../common/InfoTitle';
import InfoItem from '../../common/infoItem';
import styles from './taskListDetailInfo.less';


export default class TaskListDetailInfo extends PureComponent {

  static propTypes = {
    // location: PropTypes.object.isRequired,
    // checkApproval: PropTypes.func.isRequired,
    status: PropTypes.object,
  }

  static defaultProps = {
    status: '',
  }

  render() {
    const { status } = this.props;
    return (
      <div id="detailModule" className={styles.module}>
        {status === '审批中' || status === '被驳回' ?
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="任务状态" value="审批中" />
              </li>
              <li className={styles.item}>
                <InfoItem label="有效期（天）" value="21" />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务策略" value="32323232323232323" />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务提示" value="{comments}" />
              </li>
            </ul>
          </div> :
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.fir}>
                <InfoItem label="任务状态" value="进行中" />
              </li>
              <li className={styles.sed}>
                <InfoItem label="触发时间" value="21" />
              </li>
              <li className={styles.fir}>
                <InfoItem label="创建时间" value="21" />
              </li>
              <li className={styles.sed}>
                <InfoItem label="截止时间" value="21" />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务策略" value="32323232323232323" />
              </li>
              <li className={styles.item}>
                <InfoItem label="服务提示" value="{comments}" />
              </li>
            </ul>
          </div>
        }
      </div>
    );
  }
}

