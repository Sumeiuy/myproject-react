/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系详情页面
 * @Date: 2018-06-08 17:39:51
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-12 16:34:55
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApprovalRecord from '../permission/ApprovalRecord';
import CommonUpload from '../common/biz/CommonUpload';
import config from './config';
import styles from './detail.less';

const { custRelationshipColumns } = config;
export default class Detail extends PureComponent {
  static propTypes = {
    // 数据
    data: PropTypes.object.isRequired,
    // 附件
    attachmentList: PropTypes.array,
  }

  static defaultProps = {
    attachmentList: [],
  }

  /**
   * 为数据源的每一项添加一个key属性
   * @param {*} listData 数据源
   */
  @autobind
  addKeyToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, (item, index) => ({ ...item, key: index }));
    }
    return [];
  }

  render() {
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    const {
      id,
      empId,
      empName,
      orgName,
      createTime,
      statusDesc,
      currentApproval,
      workflowHistoryBeans,
      currentNodeName,
      custRelationshipList,
      custDetail,
    } = this.props.data;
    const {
      custName,
      custId,
      custTypeLabel,
      IDType,
      IDNum,
      businessFlag,
      empLogin,
      empLoginName,
    } = custDetail;
    const { attachmentList } = this.props;
    // 客户信息
    const custInfo = `${custName} (${custId})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 服务经理信息
    const projectManagerInfo = `${empLoginName} (${empLogin})`;
    // 是否回购
    const businessFlagValue = businessFlag ? '是' : '否';
    // 为表格数据增加key
    const newCustRelationshipList = this.addKeyToDataSource(custRelationshipList);
    return (
      <div className={styles.custRelationshipsDetail}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="basicInfor_module" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="客户" value={custInfo} width="70px" />
                  </li>
                  <li className={styles.item2}>
                    <InfoItem label="客户类型" value={custTypeLabel} width="70px" />
                  </li>
                  <li className={styles.item2}>
                    <InfoItem label="证件类型" value={IDType} width="70px" />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="证件号码" value={IDNum} width="70px" />
                  </li>
                  <li className={styles.item2}>
                    <InfoItem label="是否办理股票质押回购业务" value={businessFlagValue} width="185px" />
                  </li>
                  <li className={styles.item2}>
                    <InfoItem label="项目经理" value={projectManagerInfo} width="70px" />
                  </li>
                </ul>
              </div>
            </div>
            <div id="custRelationshipsTable_module" className={styles.module}>
              <InfoTitle head="关联关系" />
              <Table
                dataSource={newCustRelationshipList}
                columns={custRelationshipColumns}
                pagination={{
                  pageSize: 5,
                }}
              />
            </div>
            <div id="attachment_module" className={styles.module}>
              <div className={styles.detailWrapper}>
                <InfoTitle head="附件信息" />
                <CommonUpload attachmentList={attachmentList} />
              </div>
            </div>
            <div id="nginformation_module" className={styles.module}>
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
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                currentNodeName={currentNodeName}
                statusType="ready"
                approvalRecordListStyle={{ padding: '10px' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
