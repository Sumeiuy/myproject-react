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
import { DatePicker, Input } from 'antd';
// import DateRangePicker from '../common/dateRangePicker';
import Select from '../common/Select';
import DropDownSelect from '../common/dropdownSelect';
import Button from '../common/Button';
// import Icon from '../common/Icon';
import { dom, check } from '../../helper';
import { fspContainer } from '../../config';
import { getViewInfo } from '../../routes/taskList/helper';
import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  currentDate,
  beforeCurrentDate60Days,
  afterCurrentDate60Days,
  dateFormat,
} from '../../routes/taskList/config';

import styles from './pageHeader.less';

const { RangePicker } = DatePicker;
const Search = Input.Search;
// 50代表执行中
// 60代表结果跟踪
// 70代表结束
const EXECUTE_STATE = '50';
const RESULT_TRACK_STATE = '60';
const COMPLETED_STATE = '70';
const MANAGER_VIEW_STATUS = [
  EXECUTE_STATE,
  RESULT_TRACK_STATE,
  COMPLETED_STATE,
];
// 头部筛选filterBox的高度
const FILTERBOX_HEIGHT = 32;
// 时间设置
const today = moment(new Date());
const beforeToday = moment(today).subtract(60, 'days');
const afterToday = moment(today).add(60, 'days');
const allCustomers = '所有客户';
const ptyMngAll = { ptyMngName: '所有创建者', ptyMngId: '' };
const stateAll = { label: '所有状态', value: '', show: true };
const typeAll = { label: '所有类型', value: '', show: true };
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
      showMore: true,
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
      dom.removeClass(this.filterMore, 'filterMoreIcon');
      dom.addClass(this.filterMore, 'filterNoneIcon');
    } else {
      dom.removeClass(this.filterMore, 'filterNoneIcon');
      dom.addClass(this.filterMore, 'filterMoreIcon');
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
  handleMoreChange() {
    this.setState({
      showMore: !this.state.showMore,
    });
    if (this.state.showMore) {
      dom.addClass(this.pageCommonHeader, 'HeaderOverflow');
    } else {
      dom.removeClass(this.pageCommonHeader, 'HeaderOverflow');
    }
    this.onWindowResize();
  }


  // 选中创建者下拉对象中对应的某个对象s
  @autobind
  selectItem(name, item) {
    this.props.filterCallback({
      [name]: item.ptyMngId,
    });
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  selectCustomerItem(item) {
    this.props.filterCallback({
      custId: item.custId,
      custName: encodeURIComponent(item.name),
    });
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    const { location: { query: {
      createTimeStart,
      createTimeEnd,
      endTimeStart,
      endTimeEnd } } } = this.props;

    // 判断是否改变的是视图选择
    if (key === 'missionViewType') {
      this.handleViewTypeTime(key, v);
    } else {
      // 不是视图选择时发送请求
      this.props.filterCallback({
        [key]: v,
        createTimeStart,
        createTimeEnd,
        endTimeStart,
        endTimeEnd,
      });
    }
    this.setState({
      [key]: v,
    });
  }

  // 选择不同视图给定时间入参
  @autobind
  handleViewTypeTime(key, v) {
    const { filterCallback } = this.props;
    if (v === INITIATOR) {
      const {
        createTimeStart,
        createTimeEnd,
      } = this.handleDefaultTime(
        {
          before: beforeCurrentDate60Days,
          todays: currentDate,
        },
      );
      filterCallback({
        name: 'switchView',
        [key]: v,
        createTimeStart,
        createTimeEnd,
      });
      // this.setState({
      //   startTime: before,
      //   endTime: todays,
      //   disabledEndTime: todays,
      // });
    } else {
      const {
        endTimeStart,
        endTimeEnd,
      } = this.handleDefaultTime(
        {
          todays: currentDate,
          after: afterCurrentDate60Days,
        },
      );
      filterCallback({
        name: 'switchView',
        [key]: v,
        endTimeStart,
        endTimeEnd,
      });
      // this.setState({
      //   startTime: todays,
      //   endTime: after,
      //   disabledEndTime: after,
      // });
    }
  }

  // 切换视图设置默认时间设置
  @autobind
  handleDefaultTime({ before, todays, after }) {
    const createTimeStart = _.isEmpty(before) ? null :
      moment(before).format('YYYY-MM-DD');
    const createTimeEnd = _.isEmpty(before) ? null : moment(todays).format('YYYY-MM-DD');
    const endTimeStart = _.isEmpty(after) ? null : moment(todays).format('YYYY-MM-DD');
    const endTimeEnd = _.isEmpty(after) ? null : moment(after).format('YYYY-MM-DD');
    return { createTimeStart, createTimeEnd, endTimeStart, endTimeEnd };
  }

  // 任务名称搜索
  @autobind
  handleSearchChange(e) {
    const value = e.target.value;
    this.setState({ missionName: value });
  }

  @autobind
  handleSearch(value) {
    this.props.filterCallback({
      missionName: value,
    });
  }

  // 查询客户、拟稿人、审批人公共调接口方法
  @autobind
  toSearch(method, value) {
    method({
      keyword: value,
    });
  }

  @autobind
  handleCreateDateChange(date) {
    const createTimeStart = moment(date[0]).format(dateFormat);
    const createTimeEnd = moment(date[1]).format(dateFormat);
    this.props.filterCallback({
      createTimeStart,
      createTimeEnd,
    });
  }

  @autobind
  handleEndDateChange(date) {
    const endTimeStart = moment(date[0]).format(dateFormat);
    const endTimeEnd = moment(date[1]).format(dateFormat);
    this.props.filterCallback({
      endTimeStart,
      endTimeEnd,
    });
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
  searchCustomer(value) {
    const { queryCustomer } = this.props;
    // pageSize传1000000，使能够查到足够的数据
    queryCustomer({
      keyWord: value,
    });
  }

  // 创建者视图 只能选择今天往前推60天的日期，其余时间不可选
  @autobind
  disabledDateStart(value) {
    if (!value) {
      return false;
    }
    const time = value.valueOf();
    return time < moment(today).subtract(60, 'days') || time > moment().subtract(0, 'days');
  }

  // 我部门的任务和执行者视图 只能选择今天往后推60天的日期，其余时间不可选
  @autobind
  disabledDateEnd(value) {
    if (!value) {
      return false;
    }
    const time = value.valueOf();
    return time < moment().subtract(0, 'days') || time > moment(today).add(60, 'days');
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

    if (filterControl === CONTROLLER || filterControl === EXECUTOR) {
      // 管理者视图或者执行者视图只有保留三种状态和所有状态
      stateAllOptions = _.filter(stateAllOptions,
        item => _.includes(MANAGER_VIEW_STATUS, item.value));
    }

    let statusValue = status;
    // 判断当前在url上的status
    if (_.isEmpty(status) || _.isEmpty(_.find(stateAllOptions, item => item.value === status))) {
      // 在所提供的列表中找不到
      // 则将status置为默认的，所有
      statusValue = '所有状态';
    }

    return {
      stateAllOptions: [stateAll, ...stateAllOptions],
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
        },
      },
    } = this.props;
    let node;
    if (missionViewType === INITIATOR || !isGrayFlag) {
      const startTime = createTimeStart ?
        moment(createTimeStart, dateFormat) :
        moment(moment(beforeCurrentDate60Days).format(dateFormat), dateFormat);
      const endTime = createTimeEnd ?
        moment(createTimeEnd, dateFormat) :
        moment(moment(currentDate).format(dateFormat), dateFormat);
      node = (<div className={`${styles.filterFl} ${styles.dateWidget}`}>
        创建时间&nbsp;:&nbsp;
        <div className={styles.dropDownSelectBox}>
          <RangePicker
            ref={ref => this.timers = ref}
            value={[startTime, endTime]}
            onChange={this.handleCreateDateChange}
            placeholder={['开始时间', '结束时间']}
            disabledDate={this.disabledDateStart}
            key={`${missionViewType}创建时间`}
            format={dateFormat}
          />
        </div>
      </div>);
    } else {
      const startTime = endTimeStart ?
        moment(endTimeStart, dateFormat) :
        moment(moment(currentDate).format(dateFormat), dateFormat);
      const endTime = endTimeEnd ?
        moment(endTimeEnd, dateFormat) :
        moment(moment(afterCurrentDate60Days).format(dateFormat), dateFormat);
      node = (<div className={`${styles.filterFl} ${styles.dateWidget}`}>
        结束时间&nbsp;:&nbsp;
        <div className={styles.dropDownSelectBox}>
          <RangePicker
            value={[startTime, endTime]}
            onChange={this.handleEndDateChange}
            placeholder={['开始时间', '结束时间']}
            disabledDate={this.disabledDateEnd}
            key={`${missionViewType}结束时间`}
            ref={ref => this.date = ref}
            format={dateFormat}
          />
        </div>
      </div>);
    }
    return node;
  }

  /**
   * 将字典里面的状态数据前面加一个 ‘所有状态’
   * 根据不同的视图渲染构造不同的页面状态数据
   */
  @autobind
  getStateAllOptions(missionStatus) {
    const { location: { query: { missionViewType } } } = this.props;
    const currentViewType = getViewInfo(missionViewType).currentViewType;
    // 管理者视图或者执行者视图只有保留三种状态和所有状态
    const newMissionStatus = this.constructorDataType(missionStatus);
    if (currentViewType === EXECUTOR || currentViewType === CONTROLLER) {
      const stateAllOptions = _.filter(newMissionStatus,
        item => _.includes(MANAGER_VIEW_STATUS, item.value));
      return [stateAll, ...stateAllOptions];
    }
    return [stateAll, ...newMissionStatus];
  }

  render() {
    const {
      getDrafterList,
      creatSeibelModal,
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

    const { missionName, statusValue } = this.state;
    const { missionType, missionStatus } = dict;
    const stateAllOptions = this.getStateAllOptions(missionStatus);
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
      <div className={`${styles.pageCommonHeader}`} ref={this.pageCommonHeaderRef}>
        <div className={styles.filterBox} ref={this.filterBoxRef}>

          <div className={`${styles.filterFl} ${styles.mr30} ${styles.view}`}>
            <Select
              name="missionViewType"
              value={missionViewTypeValue}
              data={chooseMissionViewOptions}
              onChange={this.handleSelectChange}
            />
          </div>

          <div className={`${styles.filterFl} ${styles.mr15}`}>
            <Search
              placeholder="任务名称"
              style={{ width: 186 }}
              value={missionNameValue}
              onChange={this.handleSearchChange}
              onSearch={this.handleSearch}
            />
          </div>

          <div className={styles.filterFl}>
            <Select
              name="type"
              value={typeValue}
              data={typeAllOptions}
              onChange={this.handleSelectChange}
            />
          </div>

          <div className={styles.filterFl}>
            <Select
              name="status"
              value={statusValue}
              data={stateAllOptions}
              onChange={this.handleSelectChange}
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

          {this.renderTime()}
          {
            this.state.showMore ?
              <div
                className={styles.filterMore}
                onClick={this.handleMoreChange}
                ref={this.filterMoreRef}
              >
                <span>更多</span>
              </div>
              :
              <div
                className={styles.filterMore}
                onClick={this.handleMoreChange}
                ref={this.filterMoreRef}
              >
                <span>收起</span>
              </div>
          }
        </div>
        <Button
          type="primary"
          icon="plus"
          size="small"
          onClick={creatSeibelModal}
        >
          新建
        </Button>
      </div>
    );
  }
}
