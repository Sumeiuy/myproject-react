/*
 * @Description: 审批记录列表组件
 * @Author: LiuJianShu
 * @Date: 2017-09-25 18:42:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-11 11:08:30
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './index.less';

export default class ApproveList extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    nowStep: PropTypes.object,
  }

  static defaultProps = {
    data: [],
    nowStep: {},
  }

  render() {
    const { data, nowStep } = this.props;
    return (
      <div className={styles.approveWrapper}>
        {
          !_.isEmpty(nowStep) ?
            <div className={styles.approveNow}>
              <span>当前步骤：</span>
              <span>{nowStep.stepName}</span>
              <span>当前审批人：</span>
              <span>{nowStep.handleName}</span>
            </div>
          :
            null
        }
        <div className={styles.approveList}>
          {
            data.map(item => (
              <div key={item.entryTime}>
                <p>
                  审批人：{item.handleName}
                  于{item.handleTime}，
                  步骤名称：{item.stepName}
                </p>
                <p>
                  {item.comment}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
