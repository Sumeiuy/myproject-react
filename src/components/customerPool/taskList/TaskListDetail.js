/**
 * @file components/commissionAdjustment/Detail.js
 *  任务列表详情
 * @author zhushwengnan
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import InfoTitle from '../../common/InfoTitle';
import InfoItem from '../../common/infoItem';
// import OtherCommission from './OtherCommission';
// import CommonTable from '../../common/biz/CommonTable';
import ApproveList from '../../common/approveList';
import TaskListDetailInfo from './TaskListDetailInfo';
import styles from './taskListDetail.less';
import Icon from '../../common/Icon';
import Button from '../../common/Button';
import GroupTable from '../groupManage/GroupTable';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';

const COLUMN_WIDTH = 115;
const INITIAL_PAGE_SIZE = 10;
const COLUMN_HEIGHT = 36;
const PAGR_SIZE = 10;
const PAGE_NO = 1;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const taskStatus = [
  {
    key: '01',
    value: '处理中',
  },
  {
    key: '02',
    value: '完成',
  },
  {
    key: '03',
    value: '终止',
  },
  {
    key: '04',
    value: '被驳回',
  },
];
export default class TaskListDetail extends PureComponent {

  static propTypes = {
    // location: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object,
    taskBasicInfo: PropTypes.object,
  }

  static defaultProps = {
    priviewCustFileData: {},
    taskBasicInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: 1,
      curPageSize: 10,
      isShowTable: false,
      fileNames: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { priviewCustFileData } = nextProps;
    const { priviewCustFileData: prevPriviewCustFileData } = this.props;
    const { page } = priviewCustFileData;
    const { page: prevPage } = prevPriviewCustFileData;
    if (page !== prevPage) {
      this.setState({
        totalRecordNum: page.totalCount,
      });
    }
  }

  @autobind
  handleSeeCust() {
    const { taskBasicInfo } = this.props;
    const { tagetCustModel = {} } = taskBasicInfo;
    const { onPreview } = this.props;
    this.setState({
      isShowTable: true,
      fileNames: tagetCustModel.dataName,
      curPageNum: PAGE_NO,
      curPageSize: PAGR_SIZE,
    });
    onPreview({
      filename: tagetCustModel.dataName,
      pageNum: PAGE_NO,
      pageSize: PAGR_SIZE,
    });
  }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { fileNames } = this.state;
    const { onPreview } = this.props;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    // 预览数据
    onPreview({
      filename: fileNames,
      pageNum: nextPage,
      pageSize: currentPageSize,
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { fileNames } = this.state;
    const { onPreview } = this.props;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    // 预览数据
    onPreview({
      filename: fileNames,
      pageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  @autobind
  handleCloseModal() {
    this.setState({
      isShowTable: false,
    });
  }

  handleTaskStatus(key) {
    let value = '--';
    if (!_.isEmpty(key)) {
      value = _.filter(taskStatus, item => item.key === key);
      value = value[0].value;
    }
    return value;
  }

  handleIsEmpty(value) {
    let words = '--';
    if (!_.isEmpty(value)) {
      words = value;
    }
    return words;
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, (item, index) => _.merge(item, { id: index }));
    }

    return [];
  }

  @autobind
  renderDataSource(column, datas) {
    const dataSource = _.map(datas, (item) => {
      const rowData = EMPTY_OBJECT;
      return _.merge(rowData, _.fromPairs(_.map(item, (itemData, index) => { // eslint-disable-line
        return [column[index], itemData];
      })));
    });
    return dataSource;
  }

  renderColumnTitle(columns) {
    // 随着导入表格列的变化而变化
    return _.map(columns, item => ({
      key: item,
      value: item,
    }));
  }

  renderMention() {
    const { taskBasicInfo } = this.props;
    const { tagetCustModel = EMPTY_OBJECT } = taskBasicInfo;
    if (tagetCustModel.custSource === '导入客户') {
      return (
        <li className={styles.item}>
          <div className={styles.wrap}>
            <div className={styles.label}>
              客户连接<span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              <Icon type="excel" className={styles.excel} />客户列表
                        <a className={styles.seeCust} onClick={this.handleSeeCust}>查看预览</a>
            </div>
          </div>
        </li>
      );
    } else if (tagetCustModel.custSource === '标签圈人') {
      return (
        <li className={styles.item}>
          <InfoItem label="标签描述" value={tagetCustModel.dataName} />
        </li>
      );
    }
    return null;
  }

  render() {
    const { taskBasicInfo, priviewCustFileData } = this.props;
    const {
      motDetailModel = EMPTY_OBJECT,
      workflowHistoryBeanList = EMPTY_ARRAY,
      tagetCustModel = EMPTY_OBJECT } = taskBasicInfo;
    const status = this.handleTaskStatus(motDetailModel.status);
    const { isShowTable, curPageNum, curPageSize, totalRecordNum } = this.state;

    const columns = _.head(priviewCustFileData.custInfos);
    const columnSize = _.size(columns);
    const scrollX = (columnSize * COLUMN_WIDTH);

    const scrollXProps = columnSize >= 6 ? {
      isFixedColumn: true,
      // 前两列固定，如果太长，后面的就滚动
      fixedColumn: [0, 1],
      // 列的总宽度加上固定列的宽度
      scrollX,
    } : null;
    const scrollY = (INITIAL_PAGE_SIZE * COLUMN_HEIGHT);
    const dataSource =
      this.addIdToDataSource(this.renderDataSource(columns, _.drop(priviewCustFileData.custInfos)));
    const titleColumn = this.renderColumnTitle(columns);

    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.bugTitle}>任务名称：
              {_.isEmpty(motDetailModel.eventName) ? null : motDetailModel.eventName}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <TaskListDetailInfo
                infoData={motDetailModel}
                status={status}
                onIsEmpty={this.handleIsEmpty}
              />
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="目标客户" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="客户类型" value={this.handleIsEmpty(tagetCustModel.custSource)} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="客户总数" value={this.handleIsEmpty(tagetCustModel.custNum)} />
                  </li>
                  {this.renderMention()}
                </ul>
              </div>
            </div>
            <div id="approvalRecord" className={styles.module}>
              <InfoTitle head="审批意见" />
              <ApproveList
                data={workflowHistoryBeanList}
              />
            </div>
          </div>
        </div>
        {isShowTable ?
          <GroupModal
            // 为了每次都能打开一个新的modal
            visible={isShowTable}
            title={'客户预览'}
            okText={'提交'}
            okType={'primary'}
            onOkHandler={this.handleCloseModal}
            footer={
              <Button type="primary" size="default" onClick={this.handleCloseModal}>
                确定
            </Button>
            }
            width={700}
            modalContent={
              <GroupTable
                pageData={{
                  curPageNum,
                  curPageSize,
                  totalRecordNum,
                }}
                listData={dataSource}
                onSizeChange={this.handleShowSizeChange}
                onPageChange={this.handlePageChange}
                tableClass={styles.custListTable}
                titleColumn={titleColumn}
                // title fixed
                isFixedTitle
                // 纵向滚动
                scrollY={scrollY}
                {...scrollXProps}
                columnWidth={COLUMN_WIDTH}
                bordered
              />
            }
          /> : null
        }
      </div>
    );
  }
}

