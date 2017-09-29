/*
 * @Description: 审批记录列表组件
 * @Author: LiuJianShu
 * @Date: 2017-09-25 18:42:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-29 21:39:16
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
    // const test = [
    //   {
    //     id: '1',
    //     approver: '002332',
    //     time: '2017-09-21 13:39:21',
    //     stepName: '流程发起',
    //     status: '同意',
    //     statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
    //   },
    //   {
    //     id: '2',
    //     approver: '002332',
    //     time: '2017-09-21 13:39:21',
    //     stepName: '流程发起',
    //     status: '同意',
    //     statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
    //   },
    //   {
    //     id: '3',
    //     approver: '002332',
    //     time: '2017-09-21 13:39:21',
    //     stepName: '流程发起',
    //     status: '同意',
    //     statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
    //   },
    //   {
    //     id: '4',
    //     approver: '002332',
    //     time: '2017-09-21 13:39:21',
    //     stepName: '流程发起',
    //     status: '同意',
    //     statusDescription: '这里是审批意见，有很多的意见，说不完的意见',
    //   },
    // ];
    return (
      <div className={styles.approveWrapper}>
        <div className={styles.approveNow}>
          <span>当前步骤：</span>
          <span>{nowStep.stepName}</span>
          <span>当前审批人：</span>
          <span>{nowStep.stepName}</span>
        </div>
        <div className={styles.approveList}>
          {
            data.map(item => (
              <div key={item.handleTime}>
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
