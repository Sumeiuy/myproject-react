/**
 * @file Pageheader.js
 * 权限申请，合约管理，佣金调整头部筛选
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import Select from '../Select';
import CustRange from '../../pageCommon/SeibelCustRange';
import DropDownSelect from '../dropdownSelect';
import Button from '../Button';
import Icon from '../Icon';
import CommonDatePicker from '../datePicker';
import styles from '../../style/jiraLayout.less';
import { hasPermission, addClass, removeClass } from '../../../utils/helper';
import { hasPermissionOfProtocolCreate } from '../../../utils/permission';
import { fspContainer, seibelConfig } from '../../../config';

const {
  contract: { pageType: contractPageType },
  channelsTypeProtocol: { pageType: channelsPageType },
} = seibelConfig;

// 日期格式
const dateFormat = 'YYYY/MM/DD';

const datePickerStyle = {
  height: '32px',
  width: 'auto',
};

// 头部筛选filterBox的高度
const FILTERBOX_HEIGHT = 32;
// 头部筛选不同的项目显示不同的筛选条件
const displayConfig = {
  seibel: ['needPtyMng', 'needSubType', 'needStatus', 'needDrafter', 'needDepartment', 'needApprover'],
  performerView: ['needType', 'needStatus', 'needCreator', 'needCreationTime'],
  taskList: ['needType', 'needStatus', 'needCreator', 'needCreationTime'],
};
export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 页面
    page: PropTypes.string,
    // 子类型
    subtypeOptions: PropTypes.array,
    // 状态
    stateOptions: PropTypes.array.isRequired,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 操作类型
    needOperate: PropTypes.bool,
    operateOptions: PropTypes.array,
    // 新建权限
    empInfo: PropTypes.object,
    // 页面类型
    pageType: PropTypes.string.isRequired,
    // 部门列表
    custRange: PropTypes.array.isRequired,
    // 获取部门列表
    getCustRange: PropTypes.func.isRequired,
    // 拟稿人列表
    drafterList: PropTypes.array.isRequired,
    // 获取拟稿人列表
    getDrafterList: PropTypes.func.isRequired,
    // 审批人列表
    approvePersonList: PropTypes.array.isRequired,
    // 获取审批人列表
    getApprovePersonList: PropTypes.func.isRequired,
    // 客户列表
    customerList: PropTypes.array.isRequired,
    // 获取客户列表
    getCustomerList: PropTypes.func.isRequired,
    // 控制筛选条件选项
    filterControl: PropTypes.string,
  }

  static defaultProps = {
    page: '',
    needOperate: false,
    operateOptions: [],
    empInfo: {},
    subtypeOptions: [],
    filterControl: 'seibel',
  }

  constructor(props) {
    super(props);
    this.state = {
      showMore: true,
    };
  }

  componentWillMount() {
    this.props.getCustRange({
      type: this.props.pageType,
    });
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
      removeClass(this.filterMore, 'filterMoreIcon');
      addClass(this.filterMore, 'filterNoneIcon');
    } else {
      removeClass(this.filterMore, 'filterNoneIcon');
      addClass(this.filterMore, 'filterMoreIcon');
    }
  }

  @autobind
  judgeComponentNeedShow(componentName) {
    const { filterControl } = this.props;
    return displayConfig[filterControl].indexOf(componentName) > -1;
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
      addClass(this.pageCommonHeader, 'HeaderOverflow');
    } else {
      removeClass(this.pageCommonHeader, 'HeaderOverflow');
    }
    this.onWindowResize();
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  selectCustItem(item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        custNumber: item.custNumber,
        isResetPageNum: 'Y',
      },
    });
  }

  // 选中拟稿人/审批人下拉对象中对应的某个对象
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

  // 选中部门下拉对象中对应的某个对象
  @autobind
  selectCustRange(obj) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        orgId: obj.orgId,
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

  // 查询客户、拟稿人、审批人公共调接口方法
  @autobind
  toSearch(method, value) {
    method({
      keyword: value,
      type: this.props.pageType,
    });
  }

  // 自建任务创建日期
  @autobind
  changeDate({ name, value }) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [name]: value,
        isResetPageNum: 'Y',
      },
    });
  }

  render() {
    const {
      getCustomerList,
      getApprovePersonList,
      getDrafterList,
      subtypeOptions,
      stateOptions,
      creatSeibelModal,
      drafterList,
      approvePersonList,
      customerList,
      custRange,
      replace,
      page,
      pageType,
      operateOptions,
      needOperate,
      empInfo,
      location: {
        query: {
          subType,
          status,
          business2,
          createTime,
          drafterId,
          custNumber,
          approvalId,
        },
      },
    } = this.props;

    // 默认取当前默认日期时间
    // const creationTime = moment(Date.now()).format(dateFormat);
    // const { createTime } = this.state;


    const dateProps = {
      allowClear: true,
      boxStyle: datePickerStyle,
      placeholder: 'yyyy/mm/dd',
      dateFormat,
      name: 'createTime',
      onChange: this.changeDate,
    };

    if (createTime) {
      dateProps.value = moment(createTime, dateFormat);
    }

    const ptyMngAll = { ptyMngName: '全部', ptyMngId: '' };
    // 客户增加全部
    const customerAllList = !_.isEmpty(customerList) ?
      [{ custName: '全部', custNumber: '' }, ...customerList] : customerList;
    // 客户回填
    const curCustomerInfo = _.find(customerAllList, o => o.custNumber === custNumber);
    let curCustomer = '全部';
    if (curCustomerInfo && curCustomerInfo.custNumber) {
      curCustomer = `${curCustomerInfo.custName}(${curCustomerInfo.custNumber})`;
    }

    // 拟稿人增加全部
    const drafterAllList = !_.isEmpty(drafterList) ?
      [ptyMngAll, ...drafterList] : drafterList;
    // 拟稿人回填
    const curDrafterInfo = _.find(drafterList, o => o.ptyMngId === drafterId);
    let curDrafter = '全部';
    if (curDrafterInfo && curDrafterInfo.ptyMngId) {
      curDrafter = `${curDrafterInfo.ptyMngName}(${curDrafterInfo.ptyMngId})`;
    }

    // 审批人增加全部
    const approvePersonAllList = !_.isEmpty(approvePersonList) ?
      [ptyMngAll, ...approvePersonList] : approvePersonList;
    // 审批人回填
    const curApprovePersonInfo = _.find(approvePersonAllList, o => o.ptyMngId === approvalId);
    let curApprovePerson = '全部';
    if (curApprovePersonInfo && curApprovePersonInfo.ptyMngId) {
      curApprovePerson = `${curApprovePersonInfo.ptyMngName}(${curApprovePersonInfo.ptyMngId})`;
    }

    // 新建按钮权限
    let hasCreatePermission = true;
    // 如果是合作合约页面
    if (pageType === contractPageType) {
      hasCreatePermission = hasPermission(empInfo);
    } else if (pageType === channelsPageType) {
      // 如果是通道类协议页面
      hasCreatePermission = hasPermissionOfProtocolCreate(empInfo);
    }
    return (
      <div className={styles.pageCommonHeader} ref={this.pageCommonHeaderRef}>
        <div className={styles.filterBox} ref={this.filterBoxRef}>
          {
            this.judgeComponentNeedShow('needPtyMng') ?
              <div className={styles.filterFl}>
                <div className={styles.dropDownSelectBox}>
                  <DropDownSelect
                    value={curCustomer}
                    placeholder="经纪客户号/客户名称"
                    searchList={customerAllList}
                    showObjKey="custName"
                    objId="custNumber"
                    emitSelectItem={this.selectCustItem}
                    emitToSearch={value => this.toSearch(getCustomerList, value)}
                    name={`${page}-custName`}
                  />
                </div>
              </div>
            : null
          }
          { /* 操作类型 */}
          {
            this.judgeComponentNeedShow('needSubType') && needOperate ?
              <div className={styles.filterFl}>
                操作类型:
                <Select
                  name="business2"
                  value={business2}
                  data={operateOptions}
                  onChange={this.handleSelectChange}
                  style={{ width: '20%' }}
                />
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needSubType') ?
              <div className={styles.filterFl}>
                子类型:
                <Select
                  name="subType"
                  value={subType}
                  data={subtypeOptions}
                  onChange={this.handleSelectChange}
                />
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needType') ?
              <div className={styles.filterFl}>
                类型:
                <Select
                  name="subType"
                  value={subType}
                  data={subtypeOptions}
                  onChange={this.handleSelectChange}
                />
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needStatus') ?
              <div className={styles.filterFl}>
                状态:
                <Select
                  name="status"
                  value={status}
                  data={stateOptions}
                  onChange={this.handleSelectChange}
                />
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needDrafter') ?
              <div className={styles.filterFl}>
                拟稿人:
                <div className={styles.dropDownSelectBox}>
                  <DropDownSelect
                    value={curDrafter}
                    placeholder="工号/名称"
                    searchList={drafterAllList}
                    showObjKey="ptyMngName"
                    objId="ptyMngId"
                    emitSelectItem={item => this.selectItem('drafterId', item)}
                    emitToSearch={value => this.toSearch(getDrafterList, value)}
                    name={`${page}-ptyMngName`}
                  />
                </div>
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needCreator') ?
              <div className={styles.filterFl}>
                创建者:
                <div className={styles.dropDownSelectBox}>
                  <DropDownSelect
                    value={curDrafter}
                    placeholder="工号/名称"
                    searchList={drafterAllList}
                    showObjKey="ptyMngName"
                    objId="ptyMngId"
                    emitSelectItem={item => this.selectItem('drafterId', item)}
                    emitToSearch={value => this.toSearch(getDrafterList, value)}
                    name={`${page}-ptyMngName`}
                  />
                </div>
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needDepartment') ?
              <div className={styles.filterFl}>
                部门:
                <CustRange
                  style={{ width: '20%' }}
                  custRange={custRange}
                  location={location}
                  replace={replace}
                  updateQueryState={this.selectCustRange}
                />
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needApprover') ?
              <div className={styles.filterFl}>
                审批人:
                <div className={styles.dropDownSelectBox}>
                  <DropDownSelect
                    value={curApprovePerson}
                    placeholder="工号/名称"
                    searchList={approvePersonAllList}
                    showObjKey="ptyMngName"
                    objId="ptyMngId"
                    emitSelectItem={item => this.selectItem('approvalId', item)}
                    emitToSearch={value => this.toSearch(getApprovePersonList, value)}
                    name={`${page}-ptyMngName`}
                  />
                </div>
              </div>
            : null
          }
          {
            this.judgeComponentNeedShow('needCreationTime') ?
              <div className={`${styles.filterFl} ${styles.dateWidget}`}>
                创建时间:
                <div className={styles.dropDownSelectBox}>
                  <CommonDatePicker
                    {...dateProps}
                  />
                </div>
              </div>
            : null
          }
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
        {
          hasCreatePermission ?
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={creatSeibelModal}
            >
              新建
            </Button>
            :
            null
        }
      </div>
    );
  }
}
