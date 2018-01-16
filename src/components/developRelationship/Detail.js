/**
 * @Author: hongguangqing
 * @Description: 开发关系认定的新开发团队页面
 * @Date: 2018-01-04 13:59:02
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-16 09:48:20
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import ApprovalRecord from '../permission/ApprovalRecord';
import { seibelConfig } from '../../config';
import commonHelpr from './developRelationshipHelpr';
import styles from './detail.less';

// 表头
const { developTeamTableHeader } = seibelConfig.developRelationship;
export default class Detail extends PureComponent {
  static propTypes = {
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
      originTeam,
      newTeam,
      currentApproval,
      workflowHistoryBeans,
      develop,
      other,
      developAttachment,
      otherAttachment,
    } = this.props.data;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 客户信息
    const custInfo = `${custName} (${custNumber})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    const attachmentList = commonHelpr.handleAttachmentData(develop, other,
      developAttachment, otherAttachment);
    const originTeamData = commonHelpr.convertTgFlag(originTeam, true);
    const newTeamData = commonHelpr.convertTgFlag(newTeam, true);
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
                  data={originTeamData}
                  titleList={developTeamTableHeader}
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
                  data={newTeamData}
                  titleList={developTeamTableHeader}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </div>
            </div>
            <div id="developAttachment" className={styles.module}>
              <InfoTitle head="附件信息" />
              {
                !_.isEmpty(attachmentList) ?
                  attachmentList.map(item => (
                    <MultiUploader
                      attachmentList={item.attachmentList}
                      attachment={item.uuid}
                      title={item.title}
                      key={`${item.title}`}
                    />
                  ))
                  :
                  <div className={styles.fileList}>
                    <div className={styles.noFile}>暂无附件</div>
                  </div>
              }
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
