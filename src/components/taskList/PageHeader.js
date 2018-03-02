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
import Select from '../common/Select';
import DropDownSelect from '../common/dropdownSelect';
import Button from '../common/Button';
// import Icon from '../common/Icon';
import { dom } from '../../helper';
import { fspContainer } from '../../config';
import styles from './pageHeader.less';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const CONTROLLER_VIEW = 'controller'; // 管理者视图
const EXECUTE_VIEW = 'executor'; // 执行者视图
const INITIATOR_VIEW = 'initiator'; // 创建者视图
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
const ptyMngAll = { ptyMngName: '所有创建者', ptyMngId: '' };
const stateAll = { label: '所有状态', value: '', show: true };
const typeAll = { label: '所有类型', value: '', show: true };

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
    // 时间入参
    filterTimer: PropTypes.func,
  }

  static defaultProps = {
    page: '',
    empInfo: {},
    typeOptions: [],
    chooseMissionViewOptions: [],
    dict: {},
    filterCallback: () => { },
    filterControl: EXECUTE_VIEW,
    hasPermissionOfManagerView: false,
    filterTimer: () => { },
  }

  constructor(props) {
    super(props);
    const { dict = {}, filterControl, location: { query: { status } } } = props;
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
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    const { createTimeStart,
      createTimeEnd,
      endTimeStart,
      endTimeEnd,
      missionViewType,
    } = query;
    if (missionViewType === INITIATOR_VIEW) {
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
    const { location: { query: { status } }, filterControl } = this.props;
    const { location: nextLocation, filterControl: nextFilterControl } = nextProps;
    const { query: nextQuery } = nextLocation;
    const { status: nextStatus } = nextQuery;

    if (status !== nextStatus || filterControl !== nextFilterControl) {
      const {
        stateAllOptions,
        statusValue,
      } = this.renderStatusOptions(nextFilterControl, nextStatus);
      this.setState({
        stateAllOptions,
        statusValue,
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

  // 判断url里是否有时间设置
  handleURlTime(urlTime, time) {
    return _.isEmpty(urlTime) ? time : moment(urlTime);
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
      this.handleViewTypeTime(key, v, beforeToday, today, afterToday);
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
  handleViewTypeTime(key, v, before, todays, after) {
    const { filterTimer } = this.props;
    let timerValue;
    if (v === INITIATOR_VIEW) {
      timerValue = filterTimer({ before, todays });
      this.setState({
        startTime: before,
        endTime: todays,
        disabledEndTime: todays,
      });
    } else {
      timerValue = filterTimer({ todays, after });
      this.setState({
        startTime: todays,
        endTime: after,
        disabledEndTime: after,
      });
    }
    const { createTimeStart, createTimeEnd, endTimeStart, endTimeEnd } = timerValue;
    this.props.filterCallback({
      [key]: v,
      createTimeStart,
      createTimeEnd,
      endTimeStart,
      endTimeEnd,
    });
  }
  // 任务名称搜索
  @autobind
  handleSearchChange(value) {
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
  handleDateChange(dateStrings) {
    const { location: { query: { missionViewType } } } = this.props;
    const createTimePartFrom = dateStrings[0];
    const createTimePartTo = dateStrings[1];
    // 改变开始时间，限定结束时间范围
    const disabledTime = moment(createTimePartFrom).add(60, 'days');
    const createTimeStarts = createTimePartFrom && moment(createTimePartFrom).format('YYYY-MM-DD');
    const createTimeEnds = createTimePartTo && moment(createTimePartTo).format('YYYY-MM-DD');
    const param = this.handleIsCreateTime({ missionViewType, createTimeStarts, createTimeEnds });
    this.setState({
      startTime: createTimeStarts,
      endTime: createTimeEnds,
      disabledEndTime: disabledTime,
    });
    if (createTimeEnds && createTimeStarts) {
      if (createTimeEnds >= createTimeStarts) {
        this.props.filterCallback(param);
        return true;
      }
      return false;
    }
    this.props.filterCallback({
      createTimeStart: '',
      createTimeEnd: '',
    });
    return false;
  }
  // 视图不变下，判断视图是否为创建视图，修改时间入参
  @autobind
  handleIsCreateTime({ missionViewType, createTimeStarts, createTimeEnds }) {
    let endTimeStart = null;
    let endTimeEnd = null;
    let createTimeStart = createTimeStarts;
    let createTimeEnd = createTimeEnds;
    if (missionViewType !== INITIATOR_VIEW) {
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

  // 设置不可选日期
  @autobind
  disabledDateStart(value, type) {
    if (!value) {
      return false;
    }

    // 设置间隔日期，只能在大于六个月之前日期和当前日期之间选择
    const nowDay = moment(beforeToday).subtract(1, 'days');
    const currentMonth = moment(type).month() + 1;
    const localMonth = moment(new Date()).month() + 1;
    const currentDate = moment(value).format('YYYY-MM-DD');
    const localDate = moment(new Date()).format('YYYY-MM-DD');

    if (currentMonth === localMonth) {
      // endValue
      // return currentDate.valueOf() > localDate.valueOf();
      return currentDate > localDate;
    }
    // startValue
    return value.valueOf() <= nowDay.valueOf();
  }

  // 我部门的任务和执行者视图 开始时间不限，结束时间根据开始时间后推60天
  @autobind
  disabledDateEnd(value, type) {
    const { disabledEndTime } = this.state;
    if (!value) {
      return false;
    }

    // 设置间隔日期，只能在大于六个月之前日期和当前日期之间选择
    const currentMonth = moment(type).month() + 1;
    const localMonth = moment(type).month() + 1;

    if (currentMonth === localMonth) {
      // endValue
      return value.valueOf() >= disabledEndTime.valueOf();
    }
    // startValue
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

    if (filterControl === CONTROLLER_VIEW || filterControl === EXECUTE_VIEW) {
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
  renderTime(startTime, endTime, isInitiator, isController) {
    const item = isInitiator;
    const controller = isController === CONTROLLER_VIEW ?
      (<div className={styles.dropDownSelectBox}>
        <RangePicker
          defaultValue={[startTime, endTime]}
          onChange={this.handleDateChange}
          placeholder={['开始时间', '结束时间']}
          disabledDate={this.disabledDateEnd}
          key="controller结束时间"
          ref={ref => this.date = ref}
        />
      </div>) :
      (<div className={styles.dropDownSelectBox}>
        <RangePicker
          defaultValue={[startTime, endTime]}
          onChange={this.handleDateChange}
          placeholder={['开始时间', '结束时间']}
          disabledDate={this.disabledDateEnd}
          key="executor结束时间"
          ref={ref => this.date = ref}
        />
      </div>);
    const value = item ?
      (<div className={`${styles.filterFl} ${styles.dateWidget}`}>
        创建时间&nbsp;:&nbsp;
        <div className={styles.dropDownSelectBox}>
          <RangePicker
            ref={ref => this.timers = ref}
            defaultValue={[startTime, endTime]}
            onChange={this.handleDateChange}
            placeholder={['开始时间', '结束时间']}
            disabledDate={this.disabledDateStart}
            key="创建时间"
          />
        </div>
      </div>) :
      (<div className={`${styles.filterFl} ${styles.dateWidget}`}>
        结束时间&nbsp;:&nbsp;
        {controller}
      </div>);

    return value;
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
        // createTimeStart,
        // createTimeEnd,
        missionName,
        },
      },
    } = this.props;

    const { stateAllOptions, statusValue, startTime, endTime } = this.state;
    const { missionType } = dict;
    const typeOptions = this.constructorDataType(missionType);
    // 类型增加全部
    const typeAllOptions = !_.isEmpty(typeOptions) ?
      [typeAll, ...typeOptions] : typeOptions;

    // 创建者增加全部
    const drafterAllList = !_.isEmpty(drafterList) ?
      [ptyMngAll, ...drafterList] : drafterList;
    // 创建者回填
    const curDrafterInfo = _.find(drafterList, o => o.ptyMngId === creator);
    let curDrafter = '所有创建者';
    if (curDrafterInfo && curDrafterInfo.ptyMngId) {
      curDrafter = `${curDrafterInfo.ptyMngName}(${curDrafterInfo.ptyMngId})`;
    }
    // 搜索框回填
    const missionNameValue = !_.isEmpty(missionName) ? missionName : '';
    // 默认时间
    const typeValue = !_.isEmpty(type) ? type : '所有类型';

    const missionViewTypeValue = !_.isEmpty(missionViewType) ? missionViewType : '我执行的任务';
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
              onSearch={this.handleSearchChange}
              defaultValue={missionNameValue}
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
          {missionViewTypeValue === INITIATOR_VIEW ? null :
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

          {missionViewTypeValue === INITIATOR_VIEW ?
            this.renderTime(startTime, endTime, true) :
            this.renderTime(startTime, endTime, false, missionViewType)
          }
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
