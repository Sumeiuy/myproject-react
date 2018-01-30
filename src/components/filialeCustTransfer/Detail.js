/**
 * @Author: hongguangqing
 * @Description: 开发关系认定的新开发团队页面
 * @Date: 2018-01-04 13:59:02
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-29 14:49:17
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import ApprovalRecord from '../permission/ApprovalRecord';
import { seibelConfig } from '../../config';
import styles from './detail.less';

// 表头
const { titleList } = seibelConfig.filialeCustTransfer;
export default class Detail extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    const {
      id,
      custName,
      custNumber,
      empId,
      empName,
      orgName,
      createTime,
      status,
      subType,
      currentApproval,
      workflowHistoryBeans,
      transferCust,
    } = this.props.data;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 客户信息
    const custInfo = `${custName} (${custNumber})`;
    // 服务经理信息
    const empInfo = `${empName} (${empId})`;
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
                    <InfoItem label="划转方式" value={subType} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="选择客户" value={custInfo} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="选择新服务经理" value={empInfo} />
                  </li>
                </ul>
                <CommonTable
                  data={transferCust}
                  titleList={titleList}
                  pagination={{
                    pageSize: 5,
                  }}
                />
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
