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

// 头部筛选filterBox的高度
const FILTERBOX_HEIGHT = 32;
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
  }

  static defaultProps = {
    page: '',
    empInfo: {},
    typeOptions: [],
    chooseMissionViewOptions: [],
    dict: {},
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


  // 选中创建者下拉对象中对应的某个对象
  @autobind
  selectItem(name, item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [name]: item.ptyMngId,
        isResetPageNum: 'Y',
      },
    });
  }


  // select改变
  @autobind
  handleSelectChange(key, v) {
    this.setState({
      [key]: v,
    });
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [key]: v,
        isResetPageNum: 'Y',
      },
    });
  }

  // 任务名称搜索
  @autobind
  handleSearchChange(value) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        missionName: value,
        isResetPageNum: 'Y',
      },
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
    const { replace, location: { pathname, query } } = this.props;
    const createTimePartFrom = dateStrings[0];
    const createTimePartTo = dateStrings[1];
    const createTimeStart = createTimePartFrom && moment(createTimePartFrom).format('YYYY-MM-DD');
    const createTimeEnd = createTimePartTo && moment(createTimePartTo).format('YYYY-MM-DD');
    if (createTimeEnd && createTimeStart) {
      if (createTimeEnd >= createTimeStart) {
        replace({
          pathname,
          query: {
            ...query,
            createTimeStart,
            createTimeEnd,
            isResetPageNum: 'Y',
          },
        });
        return true;
      }
      return false;
    }
    replace({
      pathname,
      query: {
        ...query,
        createTimeStart: '',
        createTimeEnd: '',
        isResetPageNum: 'Y',
      },
    });
    return false;
  }

  // 从字典里面拿来的数据进行数据转化
  @autobind
  constructorDataType(data = []) {
    if (data.length) {
      const newData = data.map(item => ({
        label: item.value,
        value: item.key,
        show: true,
      }));
      return newData;
    }
    return null;
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
          drafterId,
          createTimePartFrom,
          createTimePartTo,
        },
      },
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
    const stateAllOptions = !_.isEmpty(stateOptions) ?
    [stateAll, ...stateOptions] : stateOptions;
    // 创建者增加全部
    const drafterAllList = !_.isEmpty(drafterList) ?
      [ptyMngAll, ...drafterList] : drafterList;
    // 创建者回填
    const curDrafterInfo = _.find(drafterList, o => o.ptyMngId === drafterId);
    let curDrafter = '所有创建者';
    if (curDrafterInfo && curDrafterInfo.ptyMngId) {
      curDrafter = `${curDrafterInfo.ptyMngName}(${curDrafterInfo.ptyMngId})`;
    }

    // 默认时间
    const startTime = createTimePartFrom ? moment(createTimePartFrom) : null;
    const endTime = createTimePartTo ? moment(createTimePartTo) : null;
    const typeValue = !_.isEmpty(type) ? type : '所有类型';
    const statusValue = !_.isEmpty(status) ? status : '所有状态';
    const missionViewTypeValue = !_.isEmpty(missionViewType) ? missionViewType : '我执行的任务';
    return (
      <div className={styles.pageCommonHeader} ref={this.pageCommonHeaderRef}>
        <div className={styles.filterBox} ref={this.filterBoxRef}>
          <div className={styles.filterFl}>
            <Search
              className={styles.taskNameSearch}
              placeholder="任务名称"
              style={{ width: 186 }}
              onSearch={this.handleSearchChange}
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

          <div className={`${styles.filterFl} ${styles.dateWidget}`}>
            创建时间:
            <div className={styles.dropDownSelectBox}>
              <RangePicker
                defaultValue={[startTime, endTime]}
                onChange={this.handleDateChange}
                placeholder={['开始时间', '结束时间']}
              />
            </div>
          </div>
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
