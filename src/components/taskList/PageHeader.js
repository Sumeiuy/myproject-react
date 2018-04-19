/**
 * @file Pageheader.js
 * 创建者视图、执行者视图头部筛选
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import { Input } from 'antd';
import DateRangePicker from '../common/dateRangePicker';
import Select from '../common/Select';
import DropDownSelect from '../common/dropdownSelect';
import Button from '../common/Button';
import { dom, check } from '../../helper';
import { fspContainer } from '../../config';
import { getViewInfo } from '../../routes/taskList/helper';
import logable from '../../decorators/logable';
import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  currentDate,
  dateFormat,
  STATUS_MANAGER_VIEW,
  STATUS_EXECUTOR_VIEW,
  STATE_COMPLETED_CODE,
  STATE_EXECUTE_CODE,
  STATE_FINISHED_CODE,
} from '../../routes/taskList/config';

import styles from './pageHeader.less';

const Search = Input.Search;
const beforeCurrentDate60Days = moment(currentDate).subtract(59, 'days');

// 头部筛选filterBox的高度
const FILTERBOX_HEIGHT = 32;
// 时间设置
const today = moment(new Date());
const beforeToday = moment(today).subtract(60, 'days');
const afterToday = moment(today).add(60, 'days');
const allCustomers = '所有客户';
const ptyMngAll = { ptyMngName: '所有创建者', ptyMngId: '' };
const typeAll = { label: '所有类型', value: '', show: true };
const executeTypeAll = { label: '所有方式', value: '', show: true };
const unlimitedCustomers = { name: allCustomers, custId: '' };
const NOOP = _.noop;

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 页面
    page: PropTypes.string,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 页面类型
    pageType: PropTypes.string.isRequired,
    // 创建者列表
    drafterList: PropTypes.array.isRequired,
    // 获取创建者列表
    getDrafterList: PropTypes.func.isRequired,
    // 视图选择
    chooseMissionViewOptions: PropTypes.array,
    // dict字典
    dict: PropTypes.object,
    // 头部筛选后的回调
    filterCallback: PropTypes.func,
    // 当前视图名称
    filterControl: PropTypes.string,
    // 判断是否有灰度客户
    isGrayFlag: PropTypes.bool.isRequired,
    // 执行者视图头部查询客户
    queryCustomer: PropTypes.func,
    // 执行者视图头部查询到的客户列表
    customerList: PropTypes.array,
  }

  static defaultProps = {
    page: '',
    empInfo: {},
    typeOptions: [],
    chooseMissionViewOptions: [],
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
      showMore: false,
      startTime: '',
      endTime: '',
      disabledEndTime: '',
      // 任务搜索框内容默认取url中的missionName
      missionName,
    };
  }

  componentWillMount() {
    const { location: { query }, isGrayFlag } = this.props;
    const { createTimeStart,
      createTimeEnd,
      endTimeStart,
      endTimeEnd,
      missionViewType,
    } = query;
    if (missionViewType === INITIATOR || !isGrayFlag) {
      // 判断URL里是否存在日期，若存在设置日期（例如页面跳转，日期已设置）
      this.setState({
        startTime: this.handleURlTime(createTimeStart, beforeToday),
        endTime: this.handleURlTime(createTimeEnd, today),
        disabledEndTime: this.handleURlTime(createTimeEnd, today),
      });
    } else {
      this.setState({
        startTime: this.handleURlTime(endTimeStart, today),
        endTime: this.handleURlTime(endTimeEnd, afterToday),
        disabledEndTime: this.handleURlTime(endTimeEnd, afterToday),
      });
    }
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

  componentDidUpdate() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.onWindowResize, false);
      sidebarShowBtn.addEventListener('click', this.onWindowResize, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.onWindowResize, false);
      sidebarShowBtn.removeEventListener('click', this.onWindowResize, false);
    }
  }

  @autobind
  onWindowResize() {
    const filterBoxHeight = this.filterBox.getBoundingClientRect().height;
    if (filterBoxHeight <= FILTERBOX_HEIGHT) {
      dom.removeClass(this.filterMore, styles.filterMoreIcon);
      dom.addClass(this.filterMore, styles.filterNoneIcon);
    } else {
      dom.removeClass(this.filterMore, styles.filterNoneIcon);
      dom.addClass(this.filterMore, styles.filterMoreIcon);
    }
  }

  // 判断url里是否有时间设置
  @autobind
  handleURlTime(urlTime, time) {
    return _.isEmpty(urlTime) ? time : moment(urlTime);
  }

  @autobind
  pageCommonHeaderRef(input) {
    this.pageCommonHeader = input;
  }

  @autobind
  filterBoxRef(input) {
    this.filterBox = input;
  }

  @autobind
  filterMoreRef(input) {
    this.filterMore = input;
  }
  @autobind
  @logable({ type: 'Click', payload: { name: '更多' } })
  handleMore() {
    this.handleMoreChange();
  }
  @autobind
  @logable({ type: 'Click', payload: { name: '收起' } })
  handleShrik() {
    this.handleMoreChange();
  }

  @autobind
  handleMoreChange() {
    this.setState({
      showMore: !this.state.showMore,
    });
    if (this.state.showMore) {
      dom.addClass(this.pageCommonHeader, styles.HeaderOverflow);
    } else {
      dom.removeClass(this.pageCommonHeader, styles.HeaderOverflow);
    }
    this.onWindowResize();
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
  selectItem(name, item) {
    this.props.filterCallback({
      [name]: item.ptyMngId,
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
    this.props.filterCallback({
      custId: item.custId,
      custName: encodeURIComponent(item.name),
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '视图选择',
      value: '$args[1]',
    },
  })
  handleSelctView(key, value) {
    this.handleSelectChange(key, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '类型',
      value: '$args[1]',
    },
  })
  handleSelctType(key, value) {
    this.handleSelectChange(key, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[1]',
    },
  })
  handleSelctStatus(key, value) {
    this.handleSelectChange(key, value);
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    const {
      filterCallback,
      location: {
        query: {
          createTimeStart,
          createTimeEnd,
          endTimeStart,
          endTimeEnd,
          missionViewType,
        },
      },
    } = this.props;

    // 判断是否改变的是视图选择
    if (key === 'missionViewType') {
      this.handleViewTypeTime(key, v);
    } else {
      // 获取当前的视图类型
      const { currentViewType } = getViewInfo(missionViewType);
      // 当状态选择的不是 结束 的时候需要清除url中的日期
      const isClearUrlDate = key === 'status' && v !== STATE_FINISHED_CODE;
      if (currentViewType === INITIATOR) {
        filterCallback({
          [key]: v,
          createTimeStart: !isClearUrlDate ? createTimeStart : '',
          createTimeEnd: !isClearUrlDate ? createTimeEnd : '',
        });
      } else {
        filterCallback({
          [key]: v,
          endTimeStart: !isClearUrlDate ? endTimeStart : '',
          endTimeEnd: !isClearUrlDate ? endTimeEnd : '',
        });
      }
    }
    this.setState({
      [key]: v,
    });
  }

  // 选择不同视图给定时间入参
  @autobind
  handleViewTypeTime(key, v) {
    const { filterCallback } = this.props;
    filterCallback({
      name: 'switchView',
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
    console.warn('点击了搜索', value);
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
  toSearch(method, value) {
    method({
      keyword: value,
    });
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
    const { startDate, endDate } = date;
    if (startDate !== null && endDate !== null) {
      const createTimeStart = startDate.format(dateFormat);
      const createTimeEnd = endDate.format(dateFormat);
      // const createTimeStart = moment(date[0]).format(dateFormat);
      // const createTimeEnd = moment(date[1]).format(dateFormat);
      this.props.filterCallback({
        createTimeStart,
        createTimeEnd,
      });
    }
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
    const { startDate, endDate } = date;
    if (startDate !== null && endDate !== null) {
      const endTimeStart = startDate.format(dateFormat);
      const endTimeEnd = endDate.format(dateFormat);
      // const endTimeStart = moment(date[0]).format(dateFormat);
      // const endTimeEnd = moment(date[1]).format(dateFormat);
      this.props.filterCallback({
        endTimeStart,
        endTimeEnd,
      });
    }
  }

  // 视图不变下，判断视图是否为创建视图，修改时间入参
  @autobind
  handleIsCreateTime({ missionViewType, createTimeStarts, createTimeEnds }) {
    let endTimeStart = null;
    let endTimeEnd = null;
    let createTimeStart = createTimeStarts;
    let createTimeEnd = createTimeEnds;
    if (missionViewType !== INITIATOR) {
      endTimeStart = createTimeStarts;
      endTimeEnd = createTimeEnds;
      createTimeStart = null;
      createTimeEnd = null;
    }
    return { createTimeStart, createTimeEnd, endTimeStart, endTimeEnd };
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
    // pageSize传1000000，使能够查到足够的数据
    queryCustomer({
      keyWord: value,
    });
  }
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '打开自建任务' } })
  handleCreateTask() {
    this.props.creatSeibelModal();
  }

  // 判断当用户选择了第一次日期之后，需要disabled掉的日期
  // 本需求在选择的两个日期的区间范围在60天之内
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
    return day > firstDay.clone().subtract(60, 'days');
  }

  // 只能选择最近3个月的
  @autobind
  setDisableRange(date) {
    return date >= moment();
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

  // 选择不同视图创建时间不同
  @autobind
  renderTime() {
    const {
      isGrayFlag,
      location: {
        query: {
          missionViewType,
          endTimeStart = '',
          endTimeEnd = '',
          createTimeEnd = '',
          createTimeStart = '',
          status,
        },
      },
    } = this.props;
    // 当头部的筛选状态不是‘结束’时，不显示时间组件
    if (status !== STATE_FINISHED_CODE) {
      return null;
    }
    let node;
    if (missionViewType === INITIATOR || !isGrayFlag) {
      const startTime = createTimeStart ?
        moment(createTimeStart, dateFormat) :
        moment(moment(beforeCurrentDate60Days).format(dateFormat), dateFormat);
      const endTime = createTimeEnd ?
        moment(createTimeEnd, dateFormat) :
        moment(moment(currentDate).format(dateFormat), dateFormat);
      node = (<div className={`${styles.filterFl} ${styles.dateWidget}`}>
        <span className={styles.dateLable}>
          创建时间&nbsp;:&nbsp;
        </span>
        <div className={styles.dropDownSelectBox}>
          {/* 新的日历范围组件 */}
          <DateRangePicker
            hasCustomerOffset
            initialEndDate={endTime}
            initialStartDate={startTime}
            disabledRange={this.setDisableRange}
            onChange={this.handleCreateDateChange}
            isInsideOffSet={this.isInsideOffSet}
            key={`${missionViewType}创建时间`}
          />
        </div>
      </div>);
    } else {
      const startTime = endTimeStart ?
        moment(endTimeStart, dateFormat) :
        moment(moment(beforeCurrentDate60Days).format(dateFormat), dateFormat);
      const endTime = endTimeEnd ?
        moment(endTimeEnd, dateFormat) :
        moment(moment(currentDate).format(dateFormat), dateFormat);
      node = (<div className={`${styles.filterFl} ${styles.dateWidget}`}>
        <span className={styles.dateLable}>
          结束时间&nbsp;:&nbsp;
        </span>
        <div className={styles.dropDownSelectBox}>
          <DateRangePicker
            hasCustomerOffset
            initialEndDate={endTime}
            initialStartDate={startTime}
            disabledRange={this.setDisableRange}
            onChange={this.handleEndDateChange}
            isInsideOffSet={this.isInsideOffSet}
            key={`${missionViewType}结束时间`}
          />
        </div>
      </div>);
    }
    return node;
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
        <Select
          name="executeType"
          value={executeType || executeTypeAll.value}
          data={[executeTypeAll, ...list]}
          onChange={this.handleSelectChange}
        />
      </div>
    );
  }

  render() {
    const {
      getDrafterList,
      drafterList,
      page,
      chooseMissionViewOptions,
      dict,
      location: {
        query: {
          missionViewType,
          type,
          creator,
          custId = '',
          custName = '',
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

    // 创建者增加全部
    const drafterAllList = !_.isEmpty(drafterList) ?
      [ptyMngAll, ...drafterList] : [];
    // 创建者回填
    const curDrafterInfo = _.find(drafterList, o => o.ptyMngId === creator);
    let curDrafter = '所有创建者';
    if (curDrafterInfo && curDrafterInfo.ptyMngId) {
      curDrafter = `${curDrafterInfo.ptyMngName}(${curDrafterInfo.ptyMngId})`;
    }

    // 执行者视图按客户搜索
    const allCustomerList = !_.isEmpty(customerList) ?
      [unlimitedCustomers, ...customerList] : [];
    const currentCustomer = check.isNull(custId) ?
      allCustomers : `${decodeURIComponent(custName)}(${custId})`;

    // 搜索框回填
    const missionNameValue = !_.isEmpty(missionName) ? missionName : '';
    // 默认时间
    const typeValue = !_.isEmpty(type) ? type : typeAll.value;
    // 默认取url中的missionViewType，否则从helper的getViewInfo方法中取
    const missionViewTypeValue = !_.isEmpty(missionViewType) ?
      missionViewType : getViewInfo().currentViewType;
    return (
      <div className={`${styles.pageCommonHeader} ${styles.HeaderOverflow}`} ref={this.pageCommonHeaderRef}>
        <div className={`${styles.missionViewType} ${styles.view}`}>
          <Select
            name="missionViewType"
            value={missionViewTypeValue}
            data={chooseMissionViewOptions}
            onChange={this.handleSelctView}
          />
        </div>

        <div className={styles.headerRight}>
          {
            this.state.showMore ?
              <div
                className={styles.filterMore}
                onClick={this.handleMore}
                ref={this.filterMoreRef}
              >
                <span>更多</span>
              </div>
              :
              <div
                className={styles.filterMore}
                onClick={this.handleShrik}
                ref={this.filterMoreRef}
              >
                <span>收起</span>
              </div>
          }
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={this.handleCreateTask}
          >
            新建
          </Button>
        </div>

        <div className={styles.filterBox} ref={this.filterBoxRef}>
          <div className={`${styles.filterFl}`}>
            <Search
              placeholder="任务名称"
              style={{ width: 110 }}
              value={missionNameValue}
              onChange={this.handleSearchChange}
              onSearch={this.handleSearch}
              enterButton
            />
          </div>

          <div className={styles.filterFl}>
            <Select
              name="type"
              value={typeValue}
              data={typeAllOptions}
              onChange={this.handleSelctType}
            />
          </div>

          <div className={`${styles.filterFl} ${styles.mlMinux15}`}>
            <Select
              name="status"
              value={statusValue}
              data={stateAllOptions}
              onChange={this.handleSelctStatus}
            />
          </div>
          {missionViewTypeValue === INITIATOR ? null :
          <div className={styles.filterFl}>
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value={curDrafter}
                placeholder="工号/名称"
                searchList={drafterAllList}
                showObjKey="ptyMngName"
                objId="ptyMngId"
                emitSelectItem={item => this.selectItem('creator', item)}
                emitToSearch={value => this.toSearch(getDrafterList, value)}
                name={`${page}-ptyMngName`}
              />
            </div>
          </div>
          }
          {
            /* 执行者视图中增加客户筛选 */
            missionViewTypeValue === EXECUTOR ?
              <div className={styles.filterFl}>
                <div className={styles.dropDownSelectBox}>
                  <DropDownSelect
                    value={currentCustomer}
                    placeholder="姓名/经纪客户号"
                    searchList={allCustomerList}
                    showObjKey="name"
                    objId="custId"
                    emitSelectItem={this.selectCustomerItem}
                    emitToSearch={this.searchCustomer}
                    name={`${page}-name`}
                  />
                </div>
              </div> : null
          }
          {this.renderExecuteType()}
          {this.renderTime()}
        </div>
      </div>
    );
  }
}
