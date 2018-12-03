/**
 * @Author: hongguangqing
 * @Description: 公务手机卡号申请详情页面
 * @Date: 2018-04-19 18:46:58
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-27 10:21:14
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import ApprovalRecord from '../permission/ApprovalRecord';
import Table from '../common/commonTable';
import CommonUpload from '../common/biz/CommonUpload';
import styles from './applyDetail.less';

export default class ApplyDetail extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    empAppBindingList: PropTypes.object.isRequired,
    queryEmpAppBindingList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
  }

  static defaultProps = {
    attachmentList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: 1,
      curPageSize: 10,
    };
  }

  componentWillReceiveProps() {

  }

  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { appId } = this.props.data;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    this.props.queryEmpAppBindingList({
      appId,
      pageNum: nextPage,
      pageSize: currentPageSize,
    });
  }

  @autobind
  renderColumnTitle() {
    const { currentNodeCode } = this.props.data;
    let columns = [{
      key: 'empName',
      value: '姓名',
    },
    {
      key: 'empId',
      value: '工号',
    },
    {
      key: 'orgName',
      value: '所属营业部',
    }];
    // branchHandle表示分公司处理状态
    // headAudit表示总部审核状态
    // trueOver表示办结状态
    if (currentNodeCode === 'branchHandle'
    || currentNodeCode === 'headAudit'
    || currentNodeCode === 'trueOver') {
      // 处于以上三种状态，表示此时电话号码，手机串号，SIM卡号1，SIM卡号2已经录入
      // 需要增加展示电话号码，手机串号，SIM卡1，SIM卡2四列
      const increasedColumns = [
        { key: 'phoneNumber', value: '电话号码' },
        { key: 'imsi', value: '手机串号' },
        { key: 'sim', value: 'SIM卡号1' },
        { key: 'sim2', value: 'SIM卡号2' },
      ];
      columns = [...columns, ...increasedColumns];
    }
    return columns;
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  @autobind
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, (item, index) => ({ ...item, id: `${item.empId}-${index}` }));
    }
    return [];
  }

  @autobind
  isShowAttachmentModule() {
    const { currentNodeCode } = this.props.data;
    // 按照新增需求，分公司处理时候上传附件，所以只有在总部审核和办结状态才显示附件
    // headAudit表示总部审核状态
    // trueOver表示办结状态r
    return currentNodeCode === 'headAudit' || currentNodeCode === 'trueOver';
  }

  render() {
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
    } = this.props.data;
    const { curPageNum, curPageSize } = this.state;
    const { empAppBindingList, attachmentList } = this.props;
    const { advisorBindList, page } = empAppBindingList;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();
    const columnSize = _.size(titleColumn);
    let columnWidth;
    let columnWidthTotal;
    if (columnSize === 7) {
      // 7列全部都有
      columnWidth = ['110px', '100px', '180px', '130px', '170px', '190px', '190px'];
      columnWidthTotal = 1000;
    } else if (columnSize === 3) {
      // 开始的时候没有电话号码，手机串号，SIM卡号1，SIM卡号2四列
      columnWidth = ['180px', '170px', '250px'];
      columnWidthTotal = 600;
    }

    const newAdvisorBindList = this.addIdToDataSource(advisorBindList);
    return (
      <div className={styles.applyDetailbox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>
编号
              {id}
            </h1>
            <div id="advisorAppBindingTable_module" className={styles.module}>
              <InfoTitle head="服务经理" />
              <Table
                pageData={{
                  curPageNum,
                  curPageSize,
                  totalRecordNum: !_.isEmpty(page) ? page.totalRecordNum : 0,
                }}
                listData={newAdvisorBindList}
                onPageChange={this.handlePageNumberChange}
                tableClass={styles.advisorAppBindingTable}
                titleColumn={this.renderColumnTitle()}
                columnWidth={columnWidth}
                needShowEmptyRow={false}
                isFixedColumn
                // 横向滚动，固定服务经理姓名列
                fixedColumn={[0]}
                // 列的总宽度加上固定列的宽度
                scrollX={columnWidthTotal}
              />
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="申请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={statusDesc} />
                  </li>
                </ul>
              </div>
            </div>
            {
              this.isShowAttachmentModule()
                ? (
                  <div id="attachment_module" className={styles.module}>
                    <div className={styles.detailWrapper}>
                      <InfoTitle head="附件信息" />
                      <div className={styles.attachmentTitle}>
                        <span>*</span>
                        {' '}
合规承诺书
                      </div>
                      <CommonUpload attachmentList={attachmentList} />
                    </div>
                  </div>
                )
                : null
            }
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
