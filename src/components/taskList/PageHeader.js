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
import Icon from '../common/Icon';
import { dom } from '../../helper';
import { fspContainer } from '../../config';
import styles from './pageHeader.less';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const CONTROLLER_VIEW = 'controller';
// 50代表执行中
// 60代表结果跟踪
// 70代表结束
const EXECUTE_STATE = '50';
const RESULT_TRACK_STATE = '60';
const COMPLETED_STATE = '70';
// 头部筛选filterBox的高度
const FILTERBOX_HEIGHT = 32;
// 时间设置
const today = moment(new Date());
const beforeToday = moment(today).subtract(60, 'days');
const afterToday = moment(today).add(60, 'days');

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
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
  }

  static defaultProps = {
    page: '',
    empInfo: {},
    typeOptions: [],
    chooseMissionViewOptions: [],
    dict: {},
    filterCallback: () => { },
    filterControl: 'performerView',
  }

  constructor(props) {
    super(props);
    this.state = {
      showMore: true,
    };
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
    let starts;
    let ends;
    // 根据选择视图判断具体视图，给定默认时间请求
    if (key === 'missionViewType') {
      // 判断具体视图给定默认时间请求
      if (v === 'initiator') {
        starts = moment(beforeToday).format('YYYY-MM-DD');
        ends = moment(today).format('YYYY-MM-DD');
        this.props.filterCallback({
          [key]: v,
          createTimeStart: starts,
          createTimeEnd: ends,
          endTimeStart: null,
          endTimeEnd: null,
        });
      } else {
        starts = moment(today).format('YYYY-MM-DD');
        ends = moment(afterToday).format('YYYY-MM-DD');
        this.props.filterCallback({
          [key]: v,
          createTimeStart: null,
          createTimeEnd: null,
          endTimeStart: starts,
          endTimeEnd: ends,
        });
      }
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
    const createTimePartFrom = dateStrings[0];
    const createTimePartTo = dateStrings[1];
    const createTimeStart = createTimePartFrom && moment(createTimePartFrom).format('YYYY-MM-DD');
    const createTimeEnd = createTimePartTo && moment(createTimePartTo).format('YYYY-MM-DD');
    if (createTimeEnd && createTimeStart) {
      if (createTimeEnd >= createTimeStart) {
        this.props.filterCallback({
          createTimeStart,
          createTimeEnd,
        });
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

  @autobind
  // 设置不可选日期
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
      return currentDate > localDate;
    }
    // startValue
    return value.valueOf() <= nowDay.valueOf();
  }

  @autobind
  disabledDateEnd(value, type) {
    if (!value) {
      return false;
    }

    // 设置间隔日期，只能在大于六个月之前日期和当前日期之间选择
    const currentMonth = moment(type).month() + 1;
    const localMonth = moment(afterToday).month() + 1;
    const currentDate = moment(value).format('YYYY-MM-DD');
    const localDate = moment(moment(new Date()).subtract(1, 'days')).format('YYYY-MM-DD');

    if (currentMonth === localMonth) {
      // endValue
      return value.valueOf() > afterToday.valueOf();
    }
    // startValue
    return currentDate <= localDate;
  }


  // 选择不同视图创建时间不同是
  renderTime(startTime, endTime, isInitiator) {
    const item = isInitiator;
    const value = item ?
      (<div className={`${styles.filterFl} ${styles.dateWidget}`}>
        创建时间:
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
        结束时间:
        <div className={styles.dropDownSelectBox}>
          <RangePicker
            defaultValue={[startTime, endTime]}
            onChange={this.handleDateChange}
            placeholder={['开始时间', '结束时间']}
            disabledDate={this.disabledDateEnd}
            key="结束时间"
          />
        </div>
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
        status,
        creator,
        // createTimeStart,
        // createTimeEnd,
        missionName,
        },
      },
      filterControl,
    } = this.props;

    const ptyMngAll = { ptyMngName: '所有创建者', ptyMngId: '' };
    const stateAll = { label: '所有状态', value: '', show: true };
    const typeAll = { label: '所有类型', value: '', show: true };

    const { missionStatus, missionType } = dict;
    const stateOptions = this.constructorDataType(missionStatus);
    const typeOptions = this.constructorDataType(missionType);
    // 类型增加全部
    const typeAllOptions = !_.isEmpty(typeOptions) ?
      [typeAll, ...typeOptions] : typeOptions;

    // 状态增加全部
    let stateAllOptions = stateOptions || [];
    if (filterControl === CONTROLLER_VIEW) {
      // 管理者视图只有保留三种状态
      stateAllOptions = _.filter(stateAllOptions,
        item => item.value === EXECUTE_STATE
          || item.value === RESULT_TRACK_STATE
          || item.value === COMPLETED_STATE);
    } else {
      stateAllOptions = [stateAll, ...stateAllOptions];
    }
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
    // const startTime = createTimeStart ? moment(createTimeStart) : null;
    // const endTime = createTimeEnd ? moment(createTimeEnd) : null;
    const typeValue = !_.isEmpty(type) ? type : '所有类型';
    const statusValue = !_.isEmpty(status) ? status : '所有状态';
    const missionViewTypeValue = !_.isEmpty(missionViewType) ? missionViewType : '我执行的任务';
    // console.warn('missionViewTypeValue-->', missionViewTypeValue);
    return (
      <div className={styles.pageCommonHeader} ref={this.pageCommonHeaderRef}>
        <div className={styles.filterBox} ref={this.filterBoxRef}>
          <div className={styles.filterFl}>
            <Search
              className={styles.taskNameSearch}
              placeholder="任务名称"
              style={{ width: 186 }}
              onSearch={this.handleSearchChange}
              defaultValue={missionNameValue}
            />
          </div>
          <div className={styles.filterFl}>
            <Select
              name="missionViewType"
              value={missionViewTypeValue}
              data={chooseMissionViewOptions}
              onChange={this.handleSelectChange}
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

          {missionViewTypeValue === 'initiator' ?
            this.renderTime(beforeToday, today, true) : this.renderTime(today, afterToday, false)
          }
          {/* <div className={`${styles.filterFl} ${styles.dateWidget}`}>
            创建时间:
            <div className={styles.dropDownSelectBox}>
              <RangePicker
                defaultValue={[startTime, endTime]}
                onChange={this.handleDateChange}
                placeholder={['开始时间', '结束时间']}
              />
            </div>
          </div> */}
          {
            this.state.showMore ?
              <div
                className={styles.filterMore}
                onClick={this.handleMoreChange}
                ref={this.filterMoreRef}
              >
                <span>更多</span>
                <Icon type="xiangxia" />
              </div>
              :
              <div
                className={styles.filterMore}
                onClick={this.handleMoreChange}
                ref={this.filterMoreRef}
              >
                <span>收起</span>
                <Icon type="xiangshang" />
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
