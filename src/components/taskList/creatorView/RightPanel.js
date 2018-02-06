/**
 * @file customerPool/tasklist/RightPanel.js
 *  目标客户池 任务列表右侧
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import InfoTitle from '../../common/InfoTitle';
import InfoItem from '../../common/infoItem';
import ApproveList from '../../common/approveList';
import TaskListDetailInfo from './TaskListDetailInfo';
import styles from './rightPanel.less';
import Icon from '../../common/Icon';
import Button from '../../common/Button';
import GroupTable from '../../customerPool/groupManage/GroupTable';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
import Clickable from '../../../components/common/Clickable';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const COLUMN_WIDTH = 115;
const INITIAL_PAGE_SIZE = 10;
const COLUMN_HEIGHT = 36;
const PAGE_SIZE = 10;
const PAGE_NO = 1;
// 答案自定义的index
const getAlphaIndex = index => String.fromCharCode(97 + index);
// 后台返回题目类型
const TYPE = {
  radioType: '1',
  checkboxType: '2',
  textAreaType: '3',
};
const emptyData = (value) => {
  if (!_.isEmpty(value)) {
    return value;
  }
  return '';
};
export default class RightPanel extends PureComponent {

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
      curPageNum: PAGE_NO,
      curPageSize: PAGE_SIZE,
      isShowTable: false,
      fileNames: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { priviewCustFileData } = nextProps;
    const { page = EMPTY_OBJECT } = priviewCustFileData;
    this.setState({
      totalRecordNum: page.totalCount,
    });
  }

  @autobind
  handleSeeCust() {
    const { onPreview, taskBasicInfo } = this.props;
    // const { curPageNum, curPageSize } = this.state;
    const { tagetCustModel = EMPTY_OBJECT } = taskBasicInfo;
    const filename = tagetCustModel.dataName || '';
    this.setState({
      isShowTable: true,
      fileNames: filename,
      curPageNum: PAGE_NO,
      curPageSize: PAGE_SIZE,
    });
    onPreview({
      filename,
      pageNum: PAGE_NO,
      pageSize: PAGE_SIZE,
    });
  }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
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
    console.log(currentPageNum, changedPageSize);
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
      const rowData = {};
      return _.merge(rowData,
        _.fromPairs(_.map(item, (itemData, index) => ([column[index], itemData]))));
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
            {
              tagetCustModel.dataName ?
                <div className={styles.value}>
                  <Icon type="excel" className={styles.excel} />
                  客户列表
                  <Clickable
                    onClick={this.handleSeeCust}
                    eventName="/click/taskListRightPanel/lookOverview"
                  >
                    <a className={styles.seeCust}>查看预览</a>
                  </Clickable>
                </div>
                :
                <div className={styles.value}>--</div>
            }
          </div>
        </li>
      );
    } else if (tagetCustModel.custSource === '标签圈人') {
      return (
        <li className={styles.item}>
          <InfoItem label="标签描述" value={tagetCustModel.custLabelDesc || '--'} />
        </li>
      );
    }
    return null;
  }

  // 拼接结果跟踪数据
  @autobind
  renderResultData() {
    const { taskBasicInfo: { motDetailModel = EMPTY_OBJECT } } = this.props;
    const { resultTraceVO = {} } = motDetailModel;
    const {
      indexCateName,
      finProductVO = {},
      traceOpVO = {},
      threshold,
      indexUnit } = resultTraceVO;
    let indicatorText = '';
    if (traceOpVO.key === 'COMPLETE') {
      indicatorText = `完善${indexCateName}`;
    } else if (traceOpVO.key === 'OPEN') {
      indicatorText = `开通${indexCateName}`;
    } else if (traceOpVO.key === 'TRUE') {
      indicatorText = `${indexCateName}，状态：是`;
    } else {
      // ${二级指标名称}${产品名称}${操作符}${输入值}${单位}
      indicatorText = `${!_.isEmpty(finProductVO) ? emptyData(finProductVO.aliasName) : ''}${indexCateName || ''}${emptyData(traceOpVO.name)}${emptyData(threshold)}${emptyData(indexUnit)}`;
    }
    return indicatorText;
  }

  @autobind
  renderOption(optionRespDtoList = []) {
    return _.map(optionRespDtoList, (item, index) =>
      <span className={styles.quesRight}>{`${getAlphaIndex(index)}.${item.optionValue}`}</span>);
  }

  // 问卷调查数据处理
  renderTaskSurvey() {
    const { taskBasicInfo: { motDetailModel = EMPTY_OBJECT } } = this.props;
    const { quesVO = [] } = motDetailModel;
    const quesData = _.map(quesVO, (item, key) => {
      const { quesType = {}, optionRespDtoList = [] } = item;
      if (quesType.key === TYPE.radioType || quesType.key === TYPE.checkboxType) {
        return (<div>
          <p>{`${key + 1}.${item.value}？(${quesType.value})`}</p>
          <p>{this.renderOption(optionRespDtoList)}</p>
        </div>);
      }
      return (<div>
        <p>{`${key + 1}.${item.value}？(${quesType.value})`}</p>
        <p>{item.remark}</p>
      </div>);
    });
    return quesData;
  }

  render() {
    const { taskBasicInfo, priviewCustFileData } = this.props;
    const {
      motDetailModel = EMPTY_OBJECT,
      workflowHistoryBeanList = EMPTY_LIST,
      tagetCustModel = EMPTY_OBJECT,
    } = taskBasicInfo;
    const { resultTraceVO = {}, quesVO } = motDetailModel;
    const { trackDay } = resultTraceVO;
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
    const custNum = tagetCustModel.custNum || '--';
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
              />
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="目标客户" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="客户来源" value={tagetCustModel.custSource || '--'} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem
                      label="客户总数"
                      value={String(custNum)}
                    />
                  </li>
                  {this.renderMention()}
                </ul>
              </div>
            </div>
            {_.isEmpty(resultTraceVO) ? null :
            <div className={styles.module}>
              <InfoTitle head="结果跟踪" />
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="跟踪窗口期" value={`${trackDay}天`} />
                </li>
                <li className={styles.item}>
                  <InfoItem label={resultTraceVO.indexName} value={this.renderResultData()} />
                </li>
              </ul>
            </div>
            }
            {
              _.isEmpty(quesVO) ? null :
              <div className={styles.module}>
                <InfoTitle head="任务调查" />
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="调查内容" value={this.renderTaskSurvey()} />
                  </li>
                </ul>
              </div>
            }
            <div id="approvalRecord" className={styles.lastModule}>
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
              <Clickable
                onClick={this.handleCloseModal}
                eventName="/click/taskListRightPanel/confirm"
              >
                <Button type="primary" size="default">确定</Button>
              </Clickable>
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
