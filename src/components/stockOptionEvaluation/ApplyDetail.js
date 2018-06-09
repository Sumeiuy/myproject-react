/*
 * @Author: zhangjun
 * @Date: 2018-06-07 14:29:19
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-09 14:59:53
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import { autobind } from 'core-decorators';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import BasicInfo from './BasicInfo';
import AssessTable from './AssessTable';
import CommonUpload from '../common/biz/CommonUpload';
import ApprovalRecord from '../permission/ApprovalRecord';
import Approval from '../permission/Approval';
import styles from './applyDetail.less';

export default class ApplyDetail extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    attachmentList: PropTypes.array,
  }
  static defaultProps = {
    attachmentList: [],
  }
  render() {
    const {
      data,
      data: {
        bizId,
        custId,
        custName,
        empId,
        empName,
        orgName,
        createTime,
        statusDesc,
        custType,
        workflowHistoryBeans,
        currentApproval,
        currentNodeName,
        approvalSuggestion,
      },
      attachmentList,
    } = this.props;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    const custInfo = `${custName}(${custId})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 判断是否是个人客户
    const isPerCustType = custType === 'per';
    return (
      <div className={styles.applyDetailbox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{bizId}</h1>
            <div className={styles.module}>
              <InfoTitle head="基本信息" />
              <InfoItem label="客户" value={custInfo} />
              <BasicInfo data={data} />
            </div>
            <div className={styles.module}>
              <InfoTitle head="适当性评估表" />
              {
                isPerCustType ?
                  <AssessTable data={data} />
                : null
              }
            </div>
            <div className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="申请请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={statusDesc} />
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.module}>
              <InfoTitle head="附件信息" />
              <CommonUpload attachmentList={attachmentList} />
            </div>
            <div className={styles.module}>
              <Approval
                head="审批"
                type="suggestion"
                textValue={approvalSuggestion}
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
