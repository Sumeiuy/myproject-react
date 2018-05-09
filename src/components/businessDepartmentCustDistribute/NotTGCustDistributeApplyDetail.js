/**
 * @Author: sunweibin
 * @Date: 2018-05-08 16:52:50
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-09 16:22:48
 * @description 营业部非投顾签约客户分配申请详情
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import DeatilWrapper from '../common/detailWrap';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApproveList from '../common/approveList';
import CommonTable from '../common/biz/CommonTable';
import Tag from '../common/tag';

import { detailTableColumns } from './config';
import { createDetailCustTableData, fixCurrentApprovalData } from './utils';

import styles from './notTGCustDistributeApplyDetail.less';

export default class NotTGCustDistributeApplyDetail extends Component {

  @autobind
  addRenderForManagerCell(columns) {
    // 给原服务经理|新服务经理的Column添加render属性
    // 以便可以添加入岗投顾的Tag
    return _.map(columns, (column) => {
      const { dataIndex } = column;
      if (dataIndex === 'preManager' || dataIndex === 'newManager') {
        return {
          ...column,
          render: this.renderServiceManagerCell,
        };
      }
      return { ...column };
    });
  }

  // 取出record中关于原服务经理或者新服务经理的入岗投顾标志
  // 以便判断是否展示投顾Tag
  @autobind
  renderServiceManagerCell(text, record) {
    const { empTgFlag, newEmpTgFlag } = record;
    return (
      <div className={styles.managerCell}>
        <div className={styles.textArea}>{text}</div>
        <div className={styles.tagArea}>
          {
            !(empTgFlag || newEmpTgFlag) ? null
            : (<Tag text="投顾" color="#60c1ea" />)
          }
        </div>
      </div>
    );
  }

  render() {
    const { currentId, data } = this.props;
    const isEmpty = _.isEmpty(data);
    // 需要将获取的客户列表数据，转化成客户列表表格所需要的数据
    const custList = createDetailCustTableData(_.get(data, 'custList'));
    // 因为客户列表表格中的原服务经理|新服务经理需要显示是否入岗投顾标签
    // 所以需要对客户列表表格的columns进行的服务经理项进行重新渲染
    const newColumns = this.addRenderForManagerCell(detailTableColumns);
    const approvalList = _.get(data, 'approvalHistoryList') || [];
    const currentApproval = _.get(data, 'currentApproval') || {};
    const nowStep = fixCurrentApprovalData(currentApproval);
    const applyStatus = _.get(data, 'statusText') || '';
    const applyCreateTime = _.get(data, 'createTime') || '';
    // 拟稿人信息
    const orgName = _.get(data, 'orgName') || '';
    const empId = _.get(data, 'empId') || '';
    const empName = _.get(data, 'empName') || '';
    const draftInfo = `${orgName}-${empName}(${empId})`;
    const ruleText = _.get(data, 'ruleText') || '';

    return (
      <DeatilWrapper isEmpty={isEmpty} currentId={currentId}>
        <div className={styles.module}>
          <InfoTitle head="客户列表" />
          <CommonTable
            pagePosition="right"
            data={custList}
            titleList={newColumns}
            pagination={{
              pageSize: 10,
              showTotal(total) {
                return `共${total}条`;
              },
            }}
          />
        </div>
        <div className={styles.module}>
          <InfoTitle head="客户分配规则" />
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="规则" value={ruleText} />
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="拟稿人" value={draftInfo} />
              </li>
              <li className={styles.item}>
                <InfoItem label="提请时间" value={applyCreateTime} />
              </li>
              <li className={styles.item}>
                <InfoItem label="状态" value={applyStatus} />
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="审批记录" />
          <ApproveList
            data={approvalList}
            nowStep={nowStep}
          />
        </div>
      </DeatilWrapper>
    );
  }
}

NotTGCustDistributeApplyDetail.propTypes = {
  currentId: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
