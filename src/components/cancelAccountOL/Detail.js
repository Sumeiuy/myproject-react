/**
 * @Author: sunweibin
 * @Date: 2018-07-09 13:57:57
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-23 15:10:38
 * @description 线上销户详情页面
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import DetailWrap from '../common/detailWrap';
import CommonUpload from '../common/biz/CommonUpload';
import ApproveList from '../common/approveList';

import { PUSHBTN } from './config';
import { combineInvestVars, combineLostReason, isTransferLostDirection } from './utils';

import styles from './detail.less';

export default function Detail(props) {
  const {
    optionsDict,
    data,
    data: {
      id,
      flowId,
      basicInfo,
      buttonStatus,
      attachmentList = [],
      workflowHistoryBeans = [],
      currentApproval = {},
      createTime,
      statusDesc,
    },
  } = props;

  function handlePushBtnClick() {
    props.onPush({ id, flowId });
  }

  const isEmpty = _.isEmpty(data);

  const hasPushBtn = buttonStatus !== 'notDisplay';
  const disbaledPushBtn = buttonStatus === 'disabled';
  const pushButton = !hasPushBtn ? null
    : (
      <Button
        ghost={!disbaledPushBtn}
        type="primary"
        disabled={disbaledPushBtn}
        onClick={handlePushBtnClick}
      >
        {PUSHBTN[buttonStatus]}
      </Button>
    );

  // 组装数据
  const custName = _.get(basicInfo, 'custName');
  const custId = _.get(basicInfo, 'custId');
  const empName = _.get(data, 'empName');
  const empId = _.get(data, 'empId');
  const draftOrg = _.get(data, 'orgName');
  // 客户
  const cust = `${custName}（${custId}）`;
  // 服务营业部
  const orgName = _.get(basicInfo, 'orgName');
  // 流失去向
  const lostDirectionCode = _.get(basicInfo, 'lostDirectionCode');
  const lostDirectionText = _.get(basicInfo, 'lostDirectionValue');
  // 证券营业部
  const stockExchange = _.get(basicInfo, 'stockExchange');
  // 流失原因
  const lostReason = _.get(basicInfo, 'lostReason');
  const lostReasonText = combineLostReason(lostReason, optionsDict.custLossReasonTypeList);
  // 投资品种
  const investVars = _.get(basicInfo, 'investVars');
  const investVarsText = combineInvestVars(investVars, optionsDict.custInvestVarietyTypeList);
  // 判断当前的流失去向是否 转户或者投资其他
  // 如果流失去向是转户，则显示证券营业部
  // 如果流失去向是投资其他，则显示投资品种
  const isTransfer = isTransferLostDirection(lostDirectionCode);
  // 备注
  const commet = _.get(basicInfo, 'commet');
  // 拟稿人信息
  const drafter = `${draftOrg} - ${empName} (${empId})`;
  // 审批记录当前节点信息
  const approverName = !_.isEmpty(currentApproval) ? `${currentApproval.empName} (${currentApproval.empNum})` : '--';
  const nowStep = {
    // 当前步骤
    stepName: currentApproval.occupation || '--',
    // 当前审批人
    handleName: approverName,
  };

  return (
    <DetailWrap isEmpty={isEmpty} currentId={`${id}`} extra={pushButton}>
      <div className={styles.module}>
        <InfoTitle head="基本信息" />
        <div className={styles.modContent}>
          <ul className={styles.propertyList}>
            <li className={styles.item2}>
              <InfoItem label="客户" value={cust} width="70px" />
            </li>
            <li className={styles.item2}>
              <InfoItem label="服务营业部" value={orgName} width="84px" />
            </li>
            <li className={styles.item2}>
              <InfoItem label="流失去向" value={lostDirectionText} width="70px" />
            </li>
            {
              isTransfer
                ? (
                  <li className={styles.item2}>
                    <InfoItem label="证券营业部" value={stockExchange} width="84px" />
                  </li>
                )
                : (
                  <li className={styles.item2}>
                    <InfoItem label="投资品种" value={investVarsText} width="84px" />
                  </li>
                )
            }
            <li className={styles.item}>
              <InfoItem label="流失原因" value={lostReasonText} width="70px" />
            </li>
            <li className={styles.item}>
              <InfoItem label="备注" value={commet} width="70px" />
            </li>
          </ul>
        </div>
        <div className={styles.module}>
          <div className={styles.detailWrapper}>
            <InfoTitle head="附件信息" />
            <CommonUpload attachmentList={attachmentList} />
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="拟稿人" value={drafter} width="70px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="申请时间" value={createTime} width="70px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="状态" value={statusDesc} width="70px" />
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="审批记录" />
          <ApproveList data={workflowHistoryBeans} nowStep={nowStep} />
        </div>
      </div>
    </DetailWrap>
  );
}

Detail.propTypes = {
  pushResult: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  optionsDict: PropTypes.object.isRequired,
  onPush: PropTypes.func.isRequired,
};
