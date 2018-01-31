/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-23 10:06:52
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import GroupTable from '../groupManage/GroupTable';
import Button from '../../common/Button';
import { data } from '../../../helper';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';
import Clickable from '../../../components/common/Clickable';
import styles from './taskPreview.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const Search = Input.Search;
const COLUMN_WIDTH = ['10%', '30%', '30%', '30%'];

const renderColumnTitle = () => {
  const columns = [
    {
      key: 'login',
      value: '工号',
    },
    {
      key: 'empName',
      value: '姓名',
    },
    {
      key: 'occupation',
      value: '所在营业部',
    },
  ];

  return columns;
};

@RestoreScrollTop
export default class TaskPreview extends PureComponent {
  static propTypes = {
    storedData: PropTypes.object.isRequired,
    approvalList: PropTypes.array,
    currentEntry: PropTypes.number,
    getApprovalList: PropTypes.func.isRequired,
    executeTypes: PropTypes.array.isRequired,
    taskTypes: PropTypes.array.isRequired,
    currentSelectRowKeys: PropTypes.array.isRequired,
    currentSelectRecord: PropTypes.object.isRequired,
    onSingleRowSelectionChange: PropTypes.func.isRequired,
    onRowSelectionChange: PropTypes.func.isRequired,
    needApproval: PropTypes.bool,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    creator: PropTypes.string.isRequired,
  };

  static defaultProps = {
    approvalList: EMPTY_LIST,
    needApproval: false,
    currentEntry: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowTable: false,
      titleColumn: renderColumnTitle(),
      dataSource: [],
      dataSize: 0,
    };
  }


  componentWillReceiveProps(nextProps) {
    const {
      approvalList = EMPTY_LIST,
      isShowApprovalModal,
     } = this.props;
    const {
      approvalList: nextData = EMPTY_LIST,
      isShowApprovalModal: nextApprovalModal,
     } = nextProps;

    if (approvalList !== nextData) {
      // 审批人数据
      this.setState({
        dataSource: nextData,
        dataSize: _.size(nextData),
      });
    }

    if (isShowApprovalModal !== nextApprovalModal) {
      this.setState({
        isShowTable: nextApprovalModal,
      });
    }
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.login }));
    }

    return [];
  }

  @autobind
  handleClick() {
    const { getApprovalList } = this.props;
    getApprovalList();
  }

  @autobind
  handleCloseModal() {
    const { onCancel } = this.props;
    this.setState({
      isShowTable: false,
    });
    onCancel();
  }

  @autobind
  filterDataSource(value) {
    const { approvalList } = this.props;
    if (_.isEmpty(value)) {
      this.setState({
        dataSource: approvalList,
      });
      return;
    }
    const newDataSource = _.filter(approvalList, item =>
      item.login === value || item.empName === value);
    this.setState({
      dataSource: newDataSource,
    });
  }

  @autobind
  handleSearchApproval() {
    const value = this.inputRef.refs.input.value;
    this.filterDataSource(value);
  }

  @autobind
  renderOption(optionInfoList = []) {
    return _.map(optionInfoList, (item, index) =>
      <span key={item.optionId}>{`${data.convertNumToLetter(Number(index) + 1)}.${item.optionValue || '--'}；`}</span>);
  }

  @autobind
  renderQuestionDetail(questionList) {
    return _.map(questionList, (item, index) => {
      // 1代表单选
      if (item.quesTypeCode === '1' || item.quesTypeCode === '2') {
        return (
          <div className={styles.singleOrMultipleChoice} key={item.quesId}>
            {Number(index) + 1}.{item.quesValue}  此问题为{item.quesTypeCode === '1' ? '单选' : '多选'}，
            选项内容为：{this.renderOption(item.optionInfoList)}
          </div>
        );
      }
      return (
        <div className={styles.subjectiveQuestion} key={item.quesId}>
          {Number(index) + 1}.{item.quesValue}  此问题为主观问答题，问题描述为：{item.quesDesp}
        </div>
      );
    });
  }

  renderIndicatorTarget(indicatorData) {
    const {
      indicatorLevel2Value,
      hasSearchedProduct,
      currentSelectedProduct,
      // hasState,
      operationValue,
      operationKey,
      inputIndicator,
      unit,
    } = indicatorData;

    let indicatorText = '';

    if (operationKey === 'COMPLETE') {
      indicatorText = `完善${indicatorLevel2Value}`;
    } else if (operationKey === 'OPEN') {
      indicatorText = `开通${indicatorLevel2Value}`;
    } else if (operationKey === 'TRUE') {
      indicatorText = `${indicatorLevel2Value}，状态：是`;
    } else {
      // ${二级指标名称}${产品名称}${操作符}${输入值}${单位}
      indicatorText = `${indicatorLevel2Value || ''}${hasSearchedProduct ? currentSelectedProduct.aliasName : ''}${operationValue || ''}${inputIndicator || ''}${unit || ''}`;
    }

    return indicatorText;
  }

  render() {
    const {
      storedData,
      needApproval,
      currentEntry = 0,
      executeTypes,
      taskTypes,
      currentSelectRowKeys,
      currentSelectRecord,
      onSingleRowSelectionChange,
      onRowSelectionChange,
      isApprovalListLoadingEnd,
      creator,
    } = this.props;
    const {
      taskFormData = EMPTY_OBJECT,
      labelCust = EMPTY_OBJECT,
      custSegment = EMPTY_OBJECT,
      resultTrackData = EMPTY_OBJECT,
      missionInvestigationData = EMPTY_OBJECT,
      custSource,
      custTotal,
    } = storedData;

    let finalData = {
      custSource,
      custTotal,
      ...resultTrackData,
      ...missionInvestigationData,
      ...taskFormData,
    };

    if (currentEntry === 0) {
      // 第一个tab
      finalData = {
        ...finalData,
        ...custSegment,
      };
    } else if (currentEntry === 1) {
      // 第二个tab
      finalData = {
        ...finalData,
        ...labelCust,
      };
    }

    const {
      labelDesc,
      custNum,
      // originFileName,
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc,
      timelyIntervalValue,
      // 跟踪窗口期
      trackWindowDate,
      // 一级指标
      indicatorLevel1Value,
      // 二级指标
      indicatorLevel2Value,
      // 产品名称
      currentSelectedProduct,
      // 操作符key,传给后台,譬如>=/<=
      operationKey,
      // 操作符name,展示用到，譬如达到/降到
      operationValue,
      // 当前输入的指标值
      inputIndicator,
      // 单位
      unit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
      // hasState,
      // 是否有产品搜索
      hasSearchedProduct,
      // 是否选中
      isResultTrackChecked,
      // 是否来自瞄准镜标签
      isSelectCustFromSightLabel,
      // 瞄准镜标签条件
      sightLabelCondition,
      // 圈人规则
      sightLabelRule,
      // 是否选中
      isMissionInvestigationChecked,
      // 选择的问题List
      questionList,
      // stateText,
      custSource: custSourceEntry,
      custTotal: totalCount,
    } = finalData;

    let finalExecutionType = executionType;
    const executionTypeDictionary = _.find(executeTypes, item => item.key === executionType);
    if (executionTypeDictionary) {
      finalExecutionType = executionTypeDictionary.value;
    }

    let finalTaskType = taskType;
    const taskTypeDictionary = _.find(taskTypes, item => item.key === taskType);
    if (taskTypeDictionary) {
      finalTaskType = taskTypeDictionary.value;
    }

    const {
      dataSource,
      isShowTable,
      titleColumn,
      dataSize,
     } = this.state;

    const { empName = '' } = currentSelectRecord;

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <div className={styles.taskOverViewContainer}>
        <div className={styles.basicInfoSection}>
          <div className={styles.title}>目标客户</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.taskSection}>
              <div>
                <div>客户来源：</div>
                <div>{custSource || custSourceEntry}</div>
              </div>
              {
                currentEntry === 1 ?
                  <div>
                    <div>标签描述：</div>
                    <div>{labelDesc || '--'}</div>
                  </div> : null
              }
            </div>
            {
              isSelectCustFromSightLabel ?
                <div className={styles.taskSection}>
                  <div>
                    <div>过滤条件：</div>
                    <div>{sightLabelCondition || '--'}</div>
                  </div>
                  <div>
                    <div>圈人规则：</div>
                    <div>{sightLabelRule || '--'}</div>
                  </div>
                </div>
                : null
            }
            <div className={styles.taskSection}>
              <div>
                <div>客户数量：</div>
                {
                  <div>{custTotal || custNum || totalCount || 0}户</div>
                  // : <div>{custNum || 0}户</div>
                }
              </div>
              <div>
                <div>创建人：</div>
                <div>{creator || '--'}</div>
              </div>
            </div>

            {/* <div className={styles.descriptionOrNameSection}>
                  <div>客户来源：</div>
                  <div>{_.isEmpty(custSource) ? '导入客户' : custSource}</div>
                </div>
                <div className={styles.descriptionOrNameSection}>
                  <div>客户数量：</div>
                  <div>{_.isEmpty(custSource) ? custTotalCount || 0 : custTotal}户</div>
                </div>
                {_.isEmpty(custSource) ?
                  <div className={styles.descriptionOrNameSection}>
                    <div>数据来源：</div>
                    <div>{originFileName || '--'}</div>
                  </div>
                  :
                  null
                } */}
          </div>
          {/* : <div className={styles.infoDescription}>
                <div className={styles.descriptionOrNameSection}>
                  <div>客户来源：</div>
                  <div>标签圈人</div>
                </div>
                <div className={styles.descriptionOrNameSection}>
                  <div>客户数量：</div>
                  <div>{custNum || 0}户</div>
                </div>
                <div className={styles.descriptionOrNameSection}>
                  <div>标签描述：</div>
                  <div>{labelDesc || '--'}</div>
                </div>
              </div> */}
          {/* {} */}
        </div>

        <div className={styles.basicInfoSection}>
          <div className={styles.title}>基本信息</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.descriptionOrNameSection}>
              <div>任务名称：</div>
              <div>{taskName || '--'}</div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>任务类型：</div>
                <div>{finalTaskType || '--'}</div>
              </div>
              <div>
                <div>执行方式：</div>
                <div>{finalExecutionType || '--'}</div>
              </div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>有效期（天）：</div>
                <div>{timelyIntervalValue || '--'}</div>
              </div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>服务策略：</div>
              <div>{serviceStrategySuggestion || '--'}</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>任务提示：</div>
              <div>{!_.isEmpty(templetDesc) ? templetDesc : '--'}</div>
            </div>
          </div>
        </div>
        {
          isResultTrackChecked ?
            <div className={styles.basicInfoSection}>
              <div className={styles.title}>结果跟踪</div>
              <div className={styles.divider} />
              <div className={styles.infoDescription}>
                <div className={styles.descriptionOrNameSection}>
                  <div>跟踪窗口期：</div>
                  <div>{`${trackWindowDate}天` || '--'}</div>
                </div>
                <div className={styles.descriptionOrNameSection}>
                  {<div>{`${indicatorLevel1Value}：` || ''}</div>}
                  <div>
                    {
                      this.renderIndicatorTarget({
                        indicatorLevel2Value,
                        hasSearchedProduct,
                        currentSelectedProduct,
                        operationValue,
                        operationKey,
                        inputIndicator,
                        unit,
                      })
                    }
                    {/* {
                      `${indicatorLevel2Value || ''}
                      ${hasSearchedProduct ? currentSelectedProduct.aliasName : ''}
                      ${!hasState ? `${operationValue || ''}${inputIndicator || ''}${unit || ''}`
                        : stateText}` || '--'
                    } */}
                  </div>
                </div>
              </div>
            </div>
            : null
        }
        {
          isMissionInvestigationChecked ?
            <div className={styles.basicInfoSection}>
              <div className={styles.title}>任务调查</div>
              <div className={styles.divider} />
              <div className={styles.infoDescription}>
                <div className={styles.descriptionOrNameSection}>
                  <div>调查内容：</div>
                  <div>{this.renderQuestionDetail(questionList)}</div>
                </div>
              </div>
            </div>
            : null
        }
        {
          needApproval ? (
            <div>
              <Clickable
                onClick={this.handleClick}
                eventName="/click/taskPreview/selectApprover"
              >
                <div className={styles.selectApprover}>
                  <span>选择审批人：</span>
                  <Search className={styles.searchSection} readOnly value={empName} />
                </div>
              </Clickable>
              <p className={styles.tishi}><Icon type="exclamation-circle" className={styles.icon} />新建任务要求在5个自然日内完成审批流程，否则该任务失效，不会下发给服务经理</p>
            </div>

          ) : null
        }
        {
          isShowTable && isApprovalListLoadingEnd ?
            <GroupModal
              wrapperClass={
                classnames({
                  [styles.approvalModalContainer]: true,
                })
              }
              visible={isShowTable}
              title={'选择审批人员'}
              okText={'确定'}
              okType={'primary'}
              onOkHandler={this.handleCloseModal}
              footer={
                <div className={styles.btnSection}>
                  <Clickable
                    onClick={this.handleCloseModal}
                    eventName="/click/taskPreview/cancel"
                  >
                    <Button type="default" size="default">取消</Button>
                  </Clickable>
                  <Clickable
                    onClick={this.handleCloseModal}
                    eventName="/click/taskPreview/confirm"
                  >
                    <Button type="primary" size="default" className={styles.confirmBtn}>确定</Button>
                  </Clickable>
                </div>
              }
              modalContent={
                <div className={styles.modalContainer}>
                  <div className={styles.searchWrapper}>
                    <Input
                      placeholder="员工号/员工姓名"
                      onPressEnter={this.handleSearchApproval}
                      style={{
                        height: '30px',
                        width: '300px',
                      }}
                      ref={inst => (this.inputRef = inst)}
                      suffix={(
                        <Clickable
                          onClick={this.handleSearchApproval}
                          eventName="/click/taskPreview/search"
                        >
                          <Button
                            className="search-btn"
                            size="large"
                            type="primary"
                          >
                            <Icon type="search" />
                          </Button>
                        </Clickable>
                      )}
                    />
                  </div>
                  {
                    !_.isEmpty(newDataSource) ?
                      <GroupTable
                        pageData={{
                          curPageNum: 1,
                          curPageSize: 8,
                          totalRecordNum: dataSize,
                        }}
                        listData={newDataSource}
                        tableClass={styles.approvalListTable}
                        titleColumn={titleColumn}
                        columnWidth={COLUMN_WIDTH}
                        bordered={false}
                        isNeedRowSelection
                        onSingleRowSelectionChange={onSingleRowSelectionChange}
                        onRowSelectionChange={onRowSelectionChange}
                        currentSelectRowKeys={currentSelectRowKeys}
                      />
                      :
                      <div className={styles.emptyContent}>
                        <span>
                          <Icon className={styles.emptyIcon} type="frown-o" />
                          暂无数据
                        </span>
                      </div>
                  }
                </div>
              }
            />
            : null
        }
      </div>
    );
  }
}
