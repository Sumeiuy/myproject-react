/**
 * @file Pageheader.js
 * 创建者视图、执行者视图头部筛选
 * @author xiaZhiQiang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import { Input } from 'antd';
import { SingleFilter } from 'lego-react-filter/src';
import { MoreFilter, DateFilter } from '../common/htFilter';
import ServiceManagerFilter from '../common/serviceManagerFilter';
import { getViewInfo } from '../../routes/taskList/helper';
import logable from '../../decorators/logable';
import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  currentDate,
  dateFormat,
  beforeCurrentDate60Days,
  STATUS_MANAGER_VIEW,
  STATUS_EXECUTOR_VIEW,
  STATE_COMPLETED_CODE,
  STATE_EXECUTE_CODE,
  STATE_FINISHED_CODE,
  moreFilterData,
} from '../../routes/taskList/config';

import styles from './pageHeader.less';

const Search = Input.Search;

const typeAll = { label: '不限', value: '', show: true }; // 不限
const creatorFilterId = 'creatorId'; // 创建者filterId
const custFilterId = 'custId'; // 客户filterId
const triggerFilterId = 'triggerTime'; // 触发时间filterId
const endTimeFilterId = 'endTime'; // 结束时间filterId
const NOOP = _.noop;

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 页面
    page: PropTypes.string,
    // 页面类型
    pageType: PropTypes.string.isRequired,
    // 创建者列表
    drafterList: PropTypes.array.isRequired,
    // 获取创建者列表
    getDrafterList: PropTypes.func.isRequired,
    // dict字典
    dict: PropTypes.object,
    // 头部筛选后的回调
    filterCallback: PropTypes.func,
    // 当前视图名称
    filterControl: PropTypes.string,
    // 执行者视图头部查询客户
    queryCustomer: PropTypes.func,
    // 执行者视图头部查询到的客户列表
    customerList: PropTypes.array,
    // 按名称或工号搜服务经理
    getSearchPersonList: PropTypes.func.isRequired,
    // 服务经理列表数据
    serverManagerList: PropTypes.array.isRequired,
    // 清除服务经理列表数据
    clearServiceManagerList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    page: '',
    empInfo: {},
    typeOptions: [],
    dict: {},
    filterCallback: () => { },
    filterControl: EXECUTOR,
    hasPermissionOfManagerView: false,
    queryCustomer: NOOP,
    customerList: [],
  }

  constructor(props) {
    super(props);
    const { dict = {}, filterControl, location: { query: { status, missionName } } } = props;
    const { missionStatus } = dict || {};
    this.missionStatus = missionStatus;
    const { stateAllOptions, statusValue } = this.renderStatusOptions(filterControl, status);
    this.state = {
      stateAllOptions,
      statusValue,
      // 任务搜索框内容默认取url中的missionName
      missionName,
    };
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: { status, missionName } }, filterControl } = this.props;
    const { location: nextLocation, filterControl: nextFilterControl } = nextProps;
    const { query: nextQuery } = nextLocation;
    const { status: nextStatus } = nextQuery;

    if (
      status !== nextStatus ||
      filterControl !== nextFilterControl ||
      nextQuery.missionName !== missionName
    ) {
      const {
        stateAllOptions,
        statusValue,
      } = this.renderStatusOptions(nextFilterControl, nextStatus);
      this.setState({
        stateAllOptions,
        statusValue,
        missionName: nextQuery.missionName,
      });
    }
  }

  // 选中创建者下拉对象中对应的某个对象s
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '创建者',
      value: '$args[1].ptyMngName',
    },
  })
  selectItem(item) {
    const { value: { ptyMngId, ptyMngName } } = item;
    this.props.filterCallback({
      creatorId: ptyMngId,
      creatorName: encodeURIComponent(ptyMngName),
    });
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].name',
    },
  })
  selectCustomerItem(item) {
    const { value: { custId, name } } = item;
    this.props.filterCallback({
      custId,
      custName: decodeURIComponent(name),
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '类型',
      value: '$args[1]',
    },
  })
  handleSelctType(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  // 状态变化时创建时间和结束时间的处理
  @autobind
  setDefaultTime(state) {
    const {
      location: {
        query,
        query: {
          missionViewType,
        },
      },
    } = this.props;

    const startTime = moment(beforeCurrentDate60Days).format(dateFormat);
    const endTime = moment(currentDate).format(dateFormat);
    // 当切换用户状态时覆盖创建时间或则结束时间
    let coverQuery = {
      ...query,
      endTimeStart: '',
      endTimeEnd: '',
      createTimeEnd: '',
      createTimeStart: '',
    };
    const isFinalState = state === STATE_FINISHED_CODE;
    if (!isFinalState) {
      return coverQuery;
    }
    // 当状态为结束状态时添加默认值
    if (missionViewType === INITIATOR) {
      coverQuery = {
        ...coverQuery,
        createTimeStart: startTime,
        createTimeEnd: endTime,
      };
    } else {
      coverQuery = {
        ...coverQuery,
        endTimeStart: startTime,
        endTimeEnd: endTime,
      };
    }
    return coverQuery;
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[1]',
    },
  })
  handleSelctStatus(option) {
    const { id, value: { value } } = option;
    const coverQuery = this.setDefaultTime(value);
    this.handleSelectChange(id, value, coverQuery);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '方式',
      value: '$args[1]',
    },
  })
  handleSelctMode(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  // select改变
  @autobind
  handleSelectChange(key, v, otherQuery) {
    const { filterCallback } = this.props;
    filterCallback({
      ...otherQuery,
      [key]: v,
    });
    this.setState({
      [key]: v,
    });
  }

  // 任务名称搜索
  @autobind
  handleSearchChange(e) {
    const value = e.target.value;
    this.setState({ missionName: value });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索任务名称',
      value: '$args[0]',
    },
  })
  handleSearch(value) {
    this.props.filterCallback({
      missionName: value,
    });
  }

  // 查询客户、拟稿人、审批人公共调接口方法
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索创建者',
      value: '$args[1]',
    },
  })
  toSearch(value) {
    const { getDrafterList } = this.props;
    if (value) {
      getDrafterList({
        keyword: value,
      });
    }
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '创建时间',
      value: (instance, args) => {
        const dateArr = _.map(
          args[0],
          item => moment(item).format(dateFormat),
        );
        return _.join(dateArr, '~');
      },
    },
  })
  handleCreateDateChange(date) {
    const { value } = date;
    this.props.filterCallback({
      createTimeStart: value[0],
      createTimeEnd: value[1],
    });
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '结束时间',
      value: (instance, args) => {
        const dateArr = _.map(
          args[0],
          item => moment(item).format(dateFormat),
        );
        return _.join(dateArr, '~');
      },
    },
  })
  handleEndDateChange(date) {
    const { value } = date;
    this.props.filterCallback({
      endTimeStart: value[0],
      endTimeEnd: value[1],
    });
  }

  @autobind
  handleTriggerTimeChange(date) {
    const { value } = date;
    this.props.filterCallback({
      triggerTimeStart: value[0],
      triggerTimeEnd: value[1],
    });
  }

  // 从字典里面拿来的数据进行数据转化
  @autobind
  constructorDataType(data = []) {
    if (!_.isEmpty(data)) {
      const newData = data.map(item => ({
        label: item.value,
        value: item.key,
        show: true,
      }));
      return newData;
    }
    return null;
  }

  /**
   * 发送执行者视图头部查客户的请求
   * @param {*} value 输入的关键词
   */
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索客户',
      value: '$args[0]',
    },
  })
  searchCustomer(value) {
    const { queryCustomer } = this.props;
    if (value) {
      queryCustomer({
        keyWord: value,
      });
    }
  }

  // 判断当用户选择了第一次日期之后，需要disabled掉的日期
  // 在任务状态为结束时选择的两个日期的区间范围在60天之内
  @autobind
  isInsideOffSet({ day, firstDay, focusedInput, flag }) {
    // focusedInput 的值 只有两种情况：1.为 endDate 2.为 null
    if (focusedInput === 'endDate') {
      // 首次聚焦日历组件为 END_DATE时，需要圈定可选范围： startEnd 向后推 60 天
      if (flag) {
        return day <= firstDay.clone().add(60, 'days') && day >= firstDay.clone();
      }
      // 赋值 START_DATE后，圈定 END_DATE 的可选范围 startEnd 向后推 59 天
      return day <= firstDay.clone().add(59, 'days') && day >= firstDay.clone().subtract(1, 'days');
    }
    return true;
  }

  /**
   * 构造任务状态
   * @param {*string} filterControl 当前页面类型
   */
  @autobind
  renderStatusOptions(filterControl, status) {
    const stateOptions = this.constructorDataType(this.missionStatus);
    // 状态增加全部
    let stateAllOptions = stateOptions || [];
    let statusValue = status;
    if (filterControl === CONTROLLER) {
      // 我部门的任务有 所有状态 执行中 、结果跟踪、结束、已完成 筛选项
      stateAllOptions = _.filter(stateAllOptions,
        item => _.includes(STATUS_MANAGER_VIEW, item.value));
    }
    if (filterControl === EXECUTOR) {
      // 我执行的任务有 所有状态 执行中 、结果跟踪、结束、已完成 筛选项
      stateAllOptions = _.filter(
        stateAllOptions,
        item => _.includes(STATUS_EXECUTOR_VIEW, item.value),
      );
    }
    if (filterControl === INITIATOR) {
      // 我创建的任务没有'已完成' 筛选项
      stateAllOptions = _.filter(stateAllOptions,
        item => STATE_COMPLETED_CODE !== item.value);
    }
    // 判断当前在url上的status不存在时，取执行中的value值
    if (_.isEmpty(status)) {
      statusValue = STATE_EXECUTE_CODE;
    }
    return {
      stateAllOptions: [...stateAllOptions],
      statusValue,
    };
  }

  // 时间选择器
  @autobind
  renderTime() {
    const {
      location: {
        query: {
          missionViewType,
          createTimeEnd = '',
          createTimeStart = '',
        },
      },
    } = this.props;
    let node;
    if (missionViewType === INITIATOR) {
      node = (<div
        className={classNames(
          [styles.filterFl],
          [styles.dateWidget])
        }
      >
        <DateFilter
          hasCustomerOffset
          filterName="创建时间"
          filterId="startTime"
          value={[createTimeStart, createTimeEnd]}
          onChange={this.handleCreateDateChange}
          isInsideOffSet={this.isInsideOffSet}
          key={`${missionViewType}创建时间`}
          disabledCurrentEnd={false}
        />
      </div>);
    } else if (missionViewType === EXECUTOR) {
      node = this.renderEndTimer();
    }
    return node;
  }

  // 触发时间
  renderTriggerTimer() {
    const {
      location: {
        query: {
          missionViewType,
          triggerTimeStart,
          triggerTimeEnd,
        },
      },
    } = this.props;
    const selectedFilter = this.selectMoreFilter();
    if (selectedFilter.includes(triggerFilterId)) {
      return (
        <div
          className={classNames(
            [styles.filterFl],
            [styles.dateWidget])
          }
        >
          <DateFilter
            hasCustomerOffset
            filterName="触发时间"
            filterId={triggerFilterId}
            value={[triggerTimeStart, triggerTimeEnd]}
            onChange={this.handleTriggerTimeChange}
            isInsideOffSet={this.isInsideOffSet}
            key={`${missionViewType}触发时间`}
            disabledCurrentEnd={false}
            onClose={() => { this.closeFilter(triggerFilterId); }}
            isCloseable
          />
        </div>
      );
    }
    return null;
  }

  // 结束时间过滤器
  renderEndTimer(options = {}) {
    const {
      location: {
        query: {
          endTimeStart = '',
          endTimeEnd = '',
        },
        filterControl,
      },
    } = this.props;
    const props = {
      key: `${filterControl}结束时间`,
      hasCustomerOffset: true,
      filterName: '结束时间',
      filterId: endTimeFilterId,
      value: [endTimeStart, endTimeEnd],
      onChange: this.handleEndDateChange,
      isInsideOffSet: this.isInsideOffSet,
      disabledCurrentEnd: false,
    };
    if (options.isCloseable) {
      props.isCloseable = true;
      props.onClose = () => { this.closeFilter(endTimeFilterId); };
    }
    return (
      <div
        className={classNames(
          [styles.filterFl],
          [styles.dateWidget],
        )}
      >
        <DateFilter {...props} />
      </div>
    );
  }
  /**
   * 渲染'执行方式'筛选组件
   * 默认显示'所有方式'
   */
  @autobind
  renderExecuteType() {
    const { dict: { executeTypes } } = this.props;
    const list = _.isEmpty(executeTypes) ? [] :
      this.constructorDataType(executeTypes);
    const { location: { query: { executeType } } } = this.props;
    return (
      <div className={styles.filterFl}>
        <SingleFilter
          filterId="executeType"
          filterName="执行方式"
          value={executeType || typeAll.value}
          data={[typeAll, ...list]}
          dataMap={['value', 'label']}
          onChange={this.handleSelctMode}
          needItemObj
        />
      </div>
    );
  }

  @autobind
  renderCustFilterName(item) {
    const { location: { query } } = this.props;
    const { custName, custId } = query;
    const { filterName, value } = item;
    const displayValue = !_.isEmpty(custId) ? `${custName}(${custId})` : value.name;
    return (
      <div className={styles.customerFilterContent}>
        <span className={styles.customerFilterName}>{filterName}:</span>
        <span className={styles.customerFilterValue} title={displayValue}>{displayValue}</span>
      </div>
    );
  }

  // 获取当前moreFilterList
  @autobind
  getMoreFilterList() {
    const { filterControl } = this.props;
    return _.filter(moreFilterData,
      item => _.some(item.type, pageTypeItem => pageTypeItem === filterControl));
  }

  @autobind
  moreFilterChange(obj) {
    const { location: {
      pathname,
      query,
    } } = this.props;
    const { replace } = this.context;
    const { isDeleteFilterFromLocation, id } = obj;
    const currentMoreFilterData = this.getMoreFilterList();
    const currentFilterItem = _.filter(currentMoreFilterData, item => item.key === id)[0];
    const filterOption = currentFilterItem && currentFilterItem.filterOption;
    let finalQuery = query;
    if (isDeleteFilterFromLocation && currentFilterItem) {
      finalQuery = _.omit(query, filterOption);
    } else {
      // ['a','b'] => {a:'', b: ''}
      const filterMap = _.reduce(filterOption,
        (filterQuery, itemQuery) => ({ ...filterQuery, [itemQuery]: '' }), {});
      finalQuery = _.merge(query, filterMap);
    }
    replace({
      pathname,
      query: finalQuery,
    });
  }

  @autobind
  selectMoreFilter() {
    const {
      location: {
        query,
      },
    } = this.props;
    const currentMoreFilterData = this.getMoreFilterList();
    return _.map(currentMoreFilterData, (itemFilter) => {
      const hasFilterItem = _.every(itemFilter.filterOption, item => _.hasIn(query, item));
      if (hasFilterItem) {
        return itemFilter.key;
      }
      return null;
    });
  }

  @autobind
  closeFilter(filterId) {
    this.moreFilterChange({ id: filterId, isDeleteFilterFromLocation: true });
  }

  // 按服务经理过滤筛选
  @autobind
  renderServiceManager() {
    const {
      filterControl,
      serverManagerList,
      clearServiceManagerList,
      location: { query: { ptyMngId = '', ptyMngName = '' } },
    } = this.props;
    const currentPtyMng = { ptyMngId, ptyMngName };
    // 管理者视图显示服务经理过滤筛选
    if (filterControl === CONTROLLER) {
      return (
        <div className={styles.filterFl}>
          <ServiceManagerFilter
            list={serverManagerList}
            clearServiceManagerList={clearServiceManagerList}
            currentPtyMng={currentPtyMng}
            dropdownSelectedItem={this.dropdownSelectedItem}
            dropdownToSearchInfo={this.dropdownToSearchInfo}
          />
        </div>
      );
    }
    return null;
  }

  // 服务经理组件下拉列表数据
  @autobind
  dropdownToSearchInfo(value) {
    const { getSearchPersonList } = this.props;
    // 下拉菜单搜索查询关键字
    getSearchPersonList({
      keyword: value,
      pageSize: 10,
      pageNum: 1,
    });
  }

  // 选服务经理
  @autobind
  dropdownSelectedItem({ ptyMngName = '', ptyMngId = '' }) {
    const {
      location: {
        query,
        pathname,
      },
    } = this.props;
    this.context.replace({
      pathname,
      query: {
        ...query,
        ptyMngId,
        ptyMngName,
        pageNum: 1,
      },
    });
  }

  render() {
    const {
      drafterList,
      dict,
      location: {
        query: {
          missionViewType,
          type,
          creatorId,
          custId = '',
        },
      },
      customerList,
    } = this.props;

    const { missionName, statusValue, stateAllOptions } = this.state;
    const { missionType } = dict;
    const typeOptions = this.constructorDataType(missionType);
    // 类型增加全部
    const typeAllOptions = !_.isEmpty(typeOptions) ?
      [typeAll, ...typeOptions] : typeOptions;

    // 过滤器当前客户id
    const currentCustomer = _.find(customerList, { custId }) || {};
    const currentCustId = currentCustomer ? currentCustomer.custId : '';

    // 搜索框回填
    const missionNameValue = !_.isEmpty(missionName) ? missionName : '';
    // 默认时间
    const typeValue = !_.isEmpty(type) ? type : typeAll.value;
    // 默认取url中的missionViewType，否则从helper的getViewInfo方法中取
    const missionViewTypeValue = !_.isEmpty(missionViewType) ?
      missionViewType : getViewInfo().currentViewType;

    const selectFilterKeys = this.selectMoreFilter();
    const currentMoreFilterData = this.getMoreFilterList();
    return (
      <div className={styles.pageCommonHeader}>
        <div className={styles.filterBox}>
          <div className={`${styles.filterFl}`}>
            <Search
              placeholder="任务名称"
              style={{ width: 158 }}
              value={missionNameValue}
              onChange={this.handleSearchChange}
              onSearch={this.handleSearch}
              enterButton
            />
          </div>
          <div className={styles.filterFl}>
            <SingleFilter
              filterId="type"
              filterName="任务类型"
              value={typeValue}
              data={typeAllOptions}
              dataMap={['value', 'label']}
              onChange={this.handleSelctType}
              needItemObj
            />
          </div>
          <div className={`${styles.filterFl} ${styles.mlMinux10}`}>
            <SingleFilter
              filterId="status"
              filterName="任务状态"
              value={statusValue}
              data={stateAllOptions}
              dataMap={['value', 'label']}
              onChange={this.handleSelctStatus}
              needItemObj
            />
          </div>
          {this.renderExecuteType()}
          {this.renderTime()}
          {this.renderServiceManager()}
          {
            currentMoreFilterData.length ?
              <div className={classNames(styles.filterFl, styles.moreFilterBtn)}>
                <MoreFilter
                  value={this.selectMoreFilter()}
                  data={currentMoreFilterData}
                  onChange={this.moreFilterChange}
                />
              </div> : null
          }
        </div>
        <div className={styles.moreFilterBox}>
          {
            /* 执行者视图中增加客户筛选 */
            missionViewTypeValue === EXECUTOR &&
            _.includes(selectFilterKeys, custFilterId) ?
              <div className={styles.filterFl}>
                <div className={styles.dropDownSelectBox}>
                  <SingleFilter
                    filterId={custFilterId}
                    filterName="客户"
                    value={currentCustId}
                    data={customerList}
                    dataMap={['custId', 'name']}
                    onChange={this.selectCustomerItem}
                    onInputChange={this.searchCustomer}
                    getFilterLabelValue={this.renderCustFilterName}
                    showSearch
                    needItemObj
                    onClose={() => { this.closeFilter(custFilterId); }}
                    isCloseable
                  />
                </div>
              </div> : null
          }
          {missionViewTypeValue !== INITIATOR &&
          _.includes(selectFilterKeys, creatorFilterId) ?
            <div className={styles.filterFl}>
              <div className={styles.dropDownSelectBox}>
                <SingleFilter
                  filterId={creatorFilterId}
                  filterName="创建者"
                  value={creatorId || ''}
                  data={drafterList}
                  dataMap={['ptyMngId', 'ptyMngName']}
                  onChange={this.selectItem}
                  onInputChange={this.toSearch}
                  showSearch
                  needItemObj
                  onClose={() => { this.closeFilter(creatorFilterId); }}
                  isCloseable
                />
              </div>
            </div> : null
          }
          {
            missionViewTypeValue === CONTROLLER
            && _.includes(selectFilterKeys, endTimeFilterId)
            && this.renderEndTimer({ isCloseable: true })
          }
          {this.renderTriggerTimer()}
        </div>
      </div>
    );
  }
}
