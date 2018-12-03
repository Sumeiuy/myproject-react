/*
 * @Author: zhangjun
 * @Date: 2018-06-07 14:29:19
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-27 10:04:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import BasicInfo from './BasicInfo';
import AssessTable from './AssessTable';
import CommonUpload from '../common/biz/CommonUpload';
import ApprovalRecord from '../permission/ApprovalRecord';

import styles from './applyDetail.less';

const EMPTY_INFO = '--';

export default class ApplyDetail extends PureComponent {
  static propTypes = {
    detailInfo: PropTypes.object.isRequired,
    attachmentList: PropTypes.array,
  }

  static defaultProps = {
    attachmentList: [],
  }

  render() {
    const {
      detailInfo,
      detailInfo: {
        id,
        empId,
        empName,
        orgName,
        createTime,
        statusDesc,
        custType,
        workflowHistoryBeans,
        currentApproval,
        currentNodeName,
      },
      attachmentList,
    } = this.props;
    if (_.isEmpty(this.props.detailInfo)) {
      return null;
    }
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 判断是否是个人客户
    const isPerCustType = custType === 'per';
    return (
      <div className={styles.applyDetailbox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>
编号
              {id}
            </h1>
            <div className={styles.module}>
              <BasicInfo data={detailInfo} />
            </div>
            {
              isPerCustType
                ? (
                  <div className={styles.module}>
                    <InfoTitle head="适当性评估表" />
                    <AssessTable data={detailInfo} />
                  </div>
                )
                : null
            }
            <div className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        拟稿人
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {drafter || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        申请时间
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {createTime || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        状态
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {statusDesc || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.module}>
              <InfoTitle head="附件信息" />
              <CommonUpload
                attachmentList={attachmentList}
                wrapClassName={styles.stockAttachmentList}
              />
            </div>
            <div id="approvalRecord_module" className={styles.module}>
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                currentNodeName={currentNodeName}
                statusType="ready"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
