/*
 * @Author: sunweibin
 * @Date: 2018-08-29 16:26:43
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-28 15:58:35
 * @description 临时委托任务右侧详情组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import DetailWrap from '../common/detailWrap';
import ApproveList from '../common/approveList';

import styles from './detail.less';

export default function Detail(props) {
  const {
    data,
    data: {
      itemId,
      applyBasicInfo,
      recallFlag,
      workflowHistoryBeans = [],
      currentApproval = {},
      applyTime,
      statusName,
    },
  } = props;

  function handlePushBtnClick() {
    props.onRevert({ itemId });
  }

  const isEmpty = _.isEmpty(data);

  // 此处用来判断撤销委托按钮的显示与否
  const hasRevertBtn = recallFlag !== 'notDisplay';
  // disabled的情况表示已经发起撤销委托，此时需要显示 灰色文本
  const disbaledRevertBtn = recallFlag === 'disabled';
  let revertBtn = null;
  if (hasRevertBtn) {
    revertBtn = !disbaledRevertBtn ?
    (
      <Button
        type="default"
        disabled={disbaledRevertBtn}
        onClick={handlePushBtnClick}
      >
        撤消委托
      </Button>
    )
    : (
      <div className={styles.hasLaunchRevert}>
        <Icon type="exclamation-circle" />
        {`已发起委托撤销申请，${moment().add(1, 'days').format('MM月DD日')}生效。`}
      </div>
    );
  }
  // 组装数据
  // 委托原因
  const deputeReason = _.get(applyBasicInfo, 'deputeReason');
  // 受托人
  const acceptEmpId = _.get(applyBasicInfo, 'assigneeId');
  const acceptEmpName = _.get(applyBasicInfo, 'assigneeName');
  const acceptOrgName = _.get(applyBasicInfo, 'assigneeOrgName');
  const acceptEmp = `${acceptOrgName} - ${acceptEmpName} (${acceptEmpId})`;
  // 委托期限
  const deputeStartTime = _.get(applyBasicInfo, 'assigneeTimeStart');
  const deputeEndTime = _.get(applyBasicInfo, 'assigneeTimeEnd');
  const deputePeriod = `${deputeStartTime}  ~  ${deputeEndTime}`;
  // 拟稿人信息
  const empName = _.get(data, 'drafterName');
  const empId = _.get(data, 'drafterId');
  const draftOrg = _.get(data, 'orgName');
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
    <DetailWrap
      isEmpty={isEmpty}
      currentId={`${itemId}`}
      extra={revertBtn}
      extraIsFllowTitle={hasRevertBtn && disbaledRevertBtn}
    >
      <div className={styles.module}>
        <InfoTitle head="委托信息" />
        <div className={styles.modContent}>
          <ul className={styles.dpertyList}>
            <li className={styles.item}>
              <InfoItem label="委托原因" value={deputeReason} width="130px" />
            </li>
            <li className={styles.item}>
              <InfoItem label="受托人" value={acceptEmp} width="130px" />
            </li>
            <li className={styles.item}>
              <InfoItem label="委托期限" value={deputePeriod} width="130px" />
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.module}>
        <InfoTitle head="拟稿信息" />
        <div className={styles.modContent}>
          <ul className={styles.dpertyList}>
            <li className={styles.item}>
              <InfoItem label="拟稿人" value={drafter} width="130px" />
            </li>
            <li className={styles.item}>
              <InfoItem label="申请时间" value={applyTime} width="130px" />
            </li>
            <li className={styles.item}>
              <InfoItem label="状态" value={statusName} width="130px" />
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.module}>
        <InfoTitle head="审批记录" />
        <ApproveList data={workflowHistoryBeans} nowStep={nowStep} />
      </div>
    </DetailWrap>
  );
}

Detail.propTypes = {
  data: PropTypes.object.isRequired,
  onRevert: PropTypes.func.isRequired,
};

