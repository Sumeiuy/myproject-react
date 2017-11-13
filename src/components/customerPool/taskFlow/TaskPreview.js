/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-10 14:29:11
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Mention } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import GroupTable from '../groupManage/GroupTable';
import Button from '../../common/Button';
import { RestoreScrollTop } from '../../common/hocComponent';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';
import styles from './taskPreview.less';

const { toString } = Mention;

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
    storedTaskFlowData: PropTypes.object.isRequired,
    approvalList: PropTypes.array,
    currentTab: PropTypes.string.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    executeTypes: PropTypes.array.isRequired,
    taskTypes: PropTypes.array.isRequired,
    currentSelectRowKeys: PropTypes.array.isRequired,
    currentSelectRecord: PropTypes.object.isRequired,
    onSingleRowSelectionChange: PropTypes.func.isRequired,
    onRowSelectionChange: PropTypes.func.isRequired,
    isNeedApproval: PropTypes.bool,
    custSource: PropTypes.string,
    custTotal: PropTypes.string,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    approvalList: EMPTY_LIST,
    isNeedApproval: false,
    custSource: '',
    custTotal: '',
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
    this.setState({
      isShowTable: true,
    });
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

  render() {
    const {
      storedTaskFlowData,
      isNeedApproval,
      currentTab = '1',
      executeTypes,
      taskTypes,
      currentSelectRowKeys,
      currentSelectRecord,
      onSingleRowSelectionChange,
      onRowSelectionChange,
      custSource,
      custTotal,
      isApprovalListLoadingEnd,
    } = this.props;
    const {
      taskFormData = EMPTY_OBJECT,
      labelCust = EMPTY_OBJECT,
      custSegment = EMPTY_OBJECT,
    } = storedTaskFlowData;

    let finalData = {};
    if (currentTab === '1') {
      // 第一个tab
      finalData = {
        ...taskFormData,
        ...custSegment,
      };
    } else if (currentTab === '2') {
      // 第二个tab
      finalData = {
        ...taskFormData,
        ...labelCust,
      };
    }

    const {
      labelDesc,
      customNum,
      originFileName,
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc,
      totalCount: custTotalCount,
      timelyIntervalValue,
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
          <div className={styles.title}>基本任务信息</div>
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
              <div>{!_.isEmpty(templetDesc) ? toString(templetDesc) : '--'}</div>
            </div>
          </div>
        </div>

        <div className={styles.basicInfoSection}>
          <div className={styles.title}>目标客户</div>
          <div className={styles.divider} />
          {
            currentTab === '1' ?
              <div className={styles.infoDescription}>
                <div className={styles.descriptionOrNameSection}>
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
                }
              </div>
              : <div className={styles.infoDescription}>
                <div className={styles.descriptionOrNameSection}>
                  <div>客户来源：</div>
                  <div>标签圈人</div>
                </div>
                <div className={styles.descriptionOrNameSection}>
                  <div>客户数量：</div>
                  <div>{customNum || 0}户</div>
                </div>
                <div className={styles.descriptionOrNameSection}>
                  <div>标签说明：</div>
                  <div>{labelDesc || '--'}</div>
                </div>
              </div>
          }
        </div>
        {
          isNeedApproval ?
            <div className={styles.selectApprover} onClick={this.handleClick}>
              <span>选择审批人：</span>
              <Search className={styles.searchSection} readOnly value={empName} />
            </div> : null
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
                  <Button type="default" size="default" onClick={this.handleCloseModal}>
                    取消
                </Button>
                  <Button type="primary" size="default" className={styles.confirmBtn} onClick={this.handleCloseModal}>
                    确定
                </Button>
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
                        <Button
                          className="search-btn"
                          size="large"
                          type="primary"
                          onClick={this.handleSearchApproval}
                        >
                          <Icon type="search" />
                        </Button>
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
