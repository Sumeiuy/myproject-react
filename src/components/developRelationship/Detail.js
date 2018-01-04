/**
 * @Author: hongguangqing
 * @Description: 开发关系认定的详情页面
 * @Date: 2018-01-04 13:59:02
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-04 17:44:07
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import CommonUpload from '../common/biz/CommonUpload';
import ApprovalRecord from '../permission/ApprovalRecord';
import styles from './detail.less';

// 表头
const tableHeader = [
  {
    dataIndex: 'empName',
    key: 'empName',
    title: '姓名',
  },
  {
    dataIndex: 'orgName',
    key: 'orgName',
    title: '部门',
  },
  {
    dataIndex: 'postnName',
    key: 'poatnName',
    title: '职位',
  },
  {
    dataIndex: 'weight',
    key: 'weight',
    title: '权重',
  },
  {
    dataIndex: 'isRugang',
    key: 'isRugang',
    title: '是否入岗投顾',
  },
];
export default class Detail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  render() {
    const {
      id,
      custName,
      custNumber,
      remark,
      empId,
      empName,
      orgName,
      createTime,
      status,
      oldDevelopTeamList,
      newDevelopTeamList,
      currentApproval,
      workflowHistoryBeans,
      attachInfoList,
    } = this.props.data;
    // 客户信息
    const custInfo = `${custName} ${custNumber}`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="客户" value={custInfo} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="备注" value={remark} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="提请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={status} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="oldDevelopTeam_module" className={styles.module}>
              <InfoTitle head="原开发团队" />
              <div className={styles.modContent}>
                <CommonTable
                  data={oldDevelopTeamList}
                  titleList={tableHeader}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
            <div id="newDevelopTeam_module" className={styles.module}>
              <InfoTitle head="新开发团队" />
              <div className={styles.modContent}>
                <CommonTable
                  data={newDevelopTeamList}
                  titleList={tableHeader}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
            <div id="enclosure" className={styles.module}>
              <InfoTitle head="附件" />
              <CommonUpload
                attachmentList={attachInfoList}
              />
            </div>
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                statusType="ready"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
