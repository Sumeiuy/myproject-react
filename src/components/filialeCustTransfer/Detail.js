/**
 * @Author: hongguangqing
 * @Description: 开发关系认定的新开发团队页面
 * @Date: 2018-01-04 13:59:02
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-31 11:09:13
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import ApprovalRecord from '../permission/ApprovalRecord';
import Pagination from '../common/Pagination';
import { seibelConfig } from '../../config';
import styles from './detail.less';

// 表头
const { titleList } = seibelConfig.filialeCustTransfer;
const SINGLECUSTTRANSFER = '0701'; // 单客户人工划转
export default class Detail extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    // 客户表格的分页信息
    getPageAssignment: PropTypes.func.isRequired,
    pageAssignment: PropTypes.object,
  }

  static defaultProps = {
    pageAssignment: {},
  }

  constructor(props) {
    super(props);
    const { assignmentList } = props.data;
    this.state = {
      assignmentListData: assignmentList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (data !== this.props.data) {
      this.setState({ assignmentListData: data.assignmentList });
    }
  }


  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { appId } = this.props.data;
    this.props.getPageAssignment({
      appId,
      pageNum: nextPage,
      pageSize: currentPageSize,
    }).then(() => {
      const { pageAssignment } = this.props;
      this.setState({
        assignmentListData: pageAssignment.assignmentList,
      });
    });
  }

  render() {
    const {
      id,
      empId,
      empName,
      orgName,
      createTime,
      status,
      subType,
      subTypeDesc,
      currentApproval,
      workflowHistoryBeans,
      assignmentList,
      page,
    } = this.props.data;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    const assignmentListValue = assignmentList[0];
    // 客户信息
    const custInfoValue = `${assignmentListValue.custName} (${assignmentListValue.brokerNumber})`;
    // 服务经理信息
    const empInfoValue = `${assignmentListValue.empName} (${assignmentListValue.empId})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 分页
    const paginationOption = {
      curPageNum: page.curPageNum,
      totalRecordNum: page.totalRecordNum,
      curPageSize: page.pageSize,
      onPageChange: this.handlePageNumberChange,
    };
    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <div className={styles.propertyList}>
                  <div className={styles.item}>
                    <InfoItem label="划转方式" value={subTypeDesc} />
                  </div>
                  {
                    subType !== SINGLECUSTTRANSFER ? null :
                    <div>
                      <div className={styles.item}>
                        <InfoItem label="选择客户" value={custInfoValue} />
                      </div>
                      <div className={styles.item}>
                        <InfoItem label="选择新服务经理" value={empInfoValue} />
                      </div>
                    </div>
                  }
                </div>
                <CommonTable
                  data={this.state.assignmentListData}
                  titleList={titleList}
                />
                {
                  subType !== SINGLECUSTTRANSFER ?
                    <Pagination
                      {...paginationOption}
                    />
                  :
                  null
                }
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
