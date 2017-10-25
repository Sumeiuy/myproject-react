/**
 * @file components/customerPool/list/CustomerLists.js
 *  客户列表
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Pagination, Checkbox, message } from 'antd';

import SaleDepartmentFilter from './SaleDepartmentFilter';
import ServiceManagerFilter from './ServiceManagerFilter';
import CustomerRow from './CustomerRow';
import CreateContactModal from './CreateContactModal';
import Reorder from './Reorder';
import Loading from '../../../layouts/Loading';

import { fspContainer } from '../../../config';
import { fspGlobal, helper } from '../../../utils';
import NoData from '../common/NoData';

import styles from './customerLists.less';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
let modalKeyCount = 0;

/*
 * 格式化钱款数据和单位
 * 入参： 190000000 转化成 { value: '1.90', unit: '亿元' }
 */
const formatAsset = (num) => {
  // 数字常量
  const WAN = 1e4;
  const YI = 1e8;
  const WANYI = 1e12;

  // 单位常量
  const UNIT_DEFAULT = '元';
  const UNIT_WAN = '万元';
  const UNIT_YI = '亿元';
  const UNIT_WANYI = '万亿元';

  const newNum = Number(num);
  const absNum = Math.abs(newNum);

  if (absNum >= WANYI) {
    return {
      value: (newNum / WANYI).toFixed(2),
      unit: UNIT_WANYI,
    };
  }
  if (absNum >= YI) {
    return {
      value: (newNum / YI).toFixed(2),
      unit: UNIT_YI,
    };
  }
  if (absNum >= WAN) {
    return {
      value: (newNum / WAN).toFixed(2),
      unit: UNIT_WAN,
    };
  }
  return { value: newNum, unit: UNIT_DEFAULT };
};

export default class CustomerLists extends PureComponent {
  static propTypes = {
    fllowCustData: PropTypes.object,
    followLoading: PropTypes.bool,
    page: PropTypes.object.isRequired,
    custList: PropTypes.array.isRequired,
    curPageNum: PropTypes.string,
    pageSize: PropTypes.string,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    q: PropTypes.string,
    source: PropTypes.string.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    entertype: PropTypes.string.isRequired,
    condition: PropTypes.object.isRequired,
    getCustContact: PropTypes.func.isRequired,
    getCustEmail: PropTypes.func.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    getFollowCust: PropTypes.func.isRequired,
    custContactData: PropTypes.object.isRequired,
    custEmail: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    authority: PropTypes.bool.isRequired,
    custIncomeReqState: PropTypes.bool,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    reorderValue: PropTypes.object.isRequired,
    onReorderChange: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func,
    custRange: PropTypes.array.isRequired,
    expandAll: PropTypes.bool,
    orgId: PropTypes.string,
    searchServerPersonList: PropTypes.array.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    onRequestLoading: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    handleAddServiceRecord: PropTypes.func.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageSize: null,
    curPageNum: null,
    q: '',
    fllowCustData: {},
    followLoading: false,
    custIncomeReqState: false,

    expandAll: false,
    orgId: null,
    collectCustRange: () => { },
  }

  static contextTypes = {
    getSearchServerPersonList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      taskAndGroupLeftPos: '0',
      currentCustId: '',
      isShowContactModal: false,
      modalKey: `modalKeyCount${modalKeyCount}`,
      isFollows: {},
      currentFollowCustId: '',
      emailCustId: '',
    };
  }
  componentDidMount() {
    this.setTaskAndGroup();
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.updateLeftPos);
      sidebarShowBtn.addEventListener('click', this.updateLeftPos);
    }
    // console.log('this.props----', this.props);
    const { location: { query: { ptyMng } }, authority, empInfo } = this.props;
    let bool = false;
    if (ptyMng) {
      bool = ptyMng.split('_')[1] === empInfo.empNum;
    }
    this.mainServiceManager = !!(bool) || !authority;
  }
  componentWillReceiveProps(nextProps) {
    const {
      custContactData: prevCustContactData = EMPTY_OBJECT,
      serviceRecordData: prevServiceRecordData = EMPTY_ARRAY,
      followLoading: preFL,
      custList,
      custEmail,
      location: {
        query: {
          ptyMng: prePtyMng,
        },
      },
     } = this.props;
    const {
      custContactData: nextCustContactData = EMPTY_OBJECT,
      serviceRecordData: nextServiceRecordData = EMPTY_ARRAY,
      followLoading,
      fllowCustData,
      custList: nextCustList,
      custEmail: nextCustEmail,
      empInfo,
      authority,
      location: {
        query: {
          ptyMng,
        },
      },
     } = nextProps;
    const { currentCustId, isShowContactModal, currentFollowCustId } = this.state;
    const prevContact = prevCustContactData[currentCustId] || EMPTY_OBJECT;
    const nextContact = nextCustContactData[currentCustId] || EMPTY_OBJECT;
    const prevRecord = prevServiceRecordData[currentCustId] || EMPTY_OBJECT;
    const nextRecord = nextServiceRecordData[currentCustId] || EMPTY_OBJECT;
    let isFollows = {};
    let change = {};
    const { result } = fllowCustData || '';
    if ((prevContact !== nextContact || prevRecord !== nextRecord)) {
      if (!isShowContactModal) {
        this.setState({
          isShowContactModal: true,
          modalKey: `modalKeyCount${modalKeyCount++}`,
        });
      }
    }
    if (custEmail !== nextCustEmail) {
      this.getEmail(nextCustEmail[currentCustId]);
    }
    if (preFL && !followLoading) {
      if (result === 'success') {
        if (!this.state.isFollows[currentFollowCustId]) {
          message.success('关注成功，并添加到“我的关注”分组');
          change = {
            ...this.state.isFollows,
            ...{ [currentFollowCustId]: true },
          };
          this.setState({
            isFollows: change,
          });
        } else {
          message.success('已取消关注');
          change = {
            ...this.state.isFollows,
            ...{ [currentFollowCustId]: false },
          };
          this.setState({
            isFollows: change,
          });
        }
      }
    }
    if (nextCustList !== custList) {
      nextCustList.map((item) => {
        isFollows = {
          ...isFollows,
          [item.custId]: item.whetherExist,
        };
        return isFollows;
      });
      this.setState({
        ...this.state.isFollows,
        isFollows,
      });
    }
    if (prePtyMng !== ptyMng) {
      let bool = false;
      if (ptyMng) {
        bool = ptyMng.split('_')[1] === empInfo.empNum;
      }
      this.mainServiceManager = !!(bool) || !authority;
    }
  }

  componentDidUpdate() {
    this.setTaskAndGroup();
  }

  componentWillUnmount() {
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.updateLeftPos);
      sidebarShowBtn.removeEventListener('click', this.updateLeftPos);
    }
  }

  @autobind
  setTaskAndGroup() {
    const workspaceSidebar = document.querySelector(fspContainer.workspaceSidebar);
    if (workspaceSidebar) {
      this.setState({
        taskAndGroupLeftPos: `${workspaceSidebar.offsetWidth}px`,
      });
    }
  }
  // 判断已有信息邮箱是否存在
  @autobind
  getEmail(address) {
    let finded = 0;// 邮件联系
    if (!_.isEmpty(address.orgCustomerContactInfoList)) {
      const index = _.findLastIndex(address.orgCustomerContactInfoList,
        val => val.mainFlag);
      finded = _.findLastIndex(address.orgCustomerContactInfoList[index].emailAddresses,
        val => val.mainFlag);
    } else if (!_.isEmpty(address.perCustomerContactInfo)) {
      finded = _.findLastIndex(address.perCustomerContactInfo.emailAddresses,
        val => val.mainFlag);
    } else {
      finded = -1;
    }
    if (finded === -1) {
      message.error('暂无客户邮箱，请与客户沟通尽快完善信息');
    }
  }
  updateLeftPos() {
    const workspaceSidebar = document.querySelector(fspContainer.workspaceSidebar);
    const fixedEleDom = document.querySelector('fixedEleDom');
    if (fixedEleDom && workspaceSidebar) {
      fixedEleDom.style.left = `${workspaceSidebar.offsetWidth}px`;
    }
  }

  // 单选列表中的数据
  @autobind
  handleSingleSelect(id, name) {
    const { replace, location: { query, pathname } } = this.props;
    const str = `${id}.${name}`;
    if (!query.selectedIds) {
      replace({
        pathname,
        query: {
          ...query,
          selectedIds: str,
          selectAll: false,
        },
        state: {
          noScrollTop: true,
        },
      });
    } else {
      const selectedIdsArr = query.selectedIds.split(',');
      if (_.includes(selectedIdsArr, str)) {
        replace({
          pathname,
          query: {
            ...query,
            selectedIds: selectedIdsArr.filter(v => v !== str).join(','),
            selectAll: false,
          },
          state: {
            noScrollTop: true,
          },
        });
      } else {
        replace({
          pathname,
          query: {
            ...query,
            selectedIds: [...selectedIdsArr, str].join(','),
            selectAll: false,
          },
          state: {
            noScrollTop: true,
          },
        });
      }
    }
  }

  // 点击全选
  @autobind
  selectAll(e) {
    const status = e.target.checked;
    const {
      replace,
      location: { query, pathname },
      handleCheck,
    } = this.props;
    // 手动发送日志
    handleCheck({ param: 'check_all' });

    replace({
      pathname,
      query: {
        ...query,
        selectedIds: '',
        selectAll: status,
      },
      state: {
        noScrollTop: true,
      },
    });
  }

  // 点击新建分组或者发起任务按钮
  @autobind
  handleClick(url, title, id) {
    const {
      page,
      condition,
      entertype,
      location: {
        query: {
          selectedIds,
        selectAll,
        },
      },
    } = this.props;
    if (selectedIds) {
      const selectedIdsArr = selectedIds.split(',');
      this.openByIds(url, selectedIdsArr, selectedIdsArr.length, title, id, entertype);
    } else if (selectAll) {
      this.openByAllSelect(url, condition, page.total, title, id, entertype);
    }
  }

  // 单个点击选中时跳转到新建分组或者发起任务
  @autobind
  openByIds(url, ids, count, title, id, entertype) {
    // debugger
    const tmpArr = [];
    _(ids).forEach((item) => {
      tmpArr.push(item.split('.')[0]);
    });
    const idStr = encodeURIComponent(tmpArr.join(','));
    const name = encodeURIComponent(ids[0].split('.')[1]);
    const obj = {
      ids: idStr,
      count,
      entertype,
      name,
    };
    if (document.querySelector(fspContainer.container)) {
      const newurl = `${url}?${helper.queryToString(obj)}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id,
        title,
      };
      fspGlobal.openRctTab({ url: newurl, param });
    } else {
      this.props.push({
        pathname: url,
        query: obj,
      });
    }
  }

  // 全选按钮选中时跳转到新建分组或者发起任务
  @autobind
  openByAllSelect(url, condition, count, title, id, entertype) {
    // 全选时取整个列表的第一个数据的name属性值传给后续页面
    const name = encodeURIComponent(this.props.custList[0].name);
    const condt = encodeURIComponent(JSON.stringify(condition));
    const obj = {
      condition: condt,
      count,
      entertype,
      name,
    };
    if (document.querySelector(fspContainer.container)) {
      const newurl = `${url}?${helper.queryToString(obj)}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id,
        title,
      };
      fspGlobal.openRctTab({ url: newurl, param });
    } else {
      this.props.push({
        pathname: url,
        query: obj,
      });
    }
  }

  @autobind
  showCreateContact({ custId, custType }) {
    const { getCustContact, getServiceRecord, custContactData, onRequestLoading } = this.props;
    this.setState({
      currentCustId: custId,
      custType,
    }, () => {
      if (_.isEmpty(custContactData[custId])) {
        getCustContact({
          custId,
        });
      } else {
        this.setState({
          isShowContactModal: true,
          modalKey: `modalKeyCount${modalKeyCount++}`,
        });
      }
      // 请求服务记录不需要作缓存
      getServiceRecord({
        custId,
      });
      onRequestLoading();
    });
  }

  @autobind
  handleSendEmail(item) {
    const { getCustEmail } = this.props;
    const { custId } = item;
    getCustEmail({
      custId,
    });
    this.setState({
      currentCustId: custId,
      emailCustId: custId,
    });
  }

  @autobind
  handleAddFollow(item) {
    const { getFollowCust } = this.props;
    const { custId, empId } = item;
    let operateType = null;
    if (!this.state.isFollows[custId]) {
      operateType = 'new';
      getFollowCust({
        empId, operateType, custId,
      });
    } else {
      operateType = 'delete';
      getFollowCust({
        empId, operateType, custId,
      });
    }
    this.setState({
      currentFollowCustId: custId,
    });
  }
  /**
 * 回调，关闭modal打开state
 */
  @autobind
  resetModalState() {
    this.setState({
      isShowContactModal: false,
    });
  }

  // 选服务经理
  @autobind
  dropdownSelectedItem(item) {
    const {
      location: {
        query,
        pathname,
      },
      replace,
      handleSelect,
    } = this.props;
    // 手动上传日志
    handleSelect({ param: `${item.ptyMngName}_${item.ptyMngId}` });

    replace({
      pathname,
      query: {
        ...query,
        ptyMng: `${item.ptyMngName}_${item.ptyMngId}`,
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
      },
    });
  }

  @autobind
  dropdownToSearchInfo(value) {
    const { handleSearch } = this.props;
    handleSearch({ param: `keyword_${value}` });
    // 下拉菜单搜错查询关键字
    this.context.getSearchServerPersonList(value);
  }

  // 服务营业部
  @autobind
  changeSaleDepartment(state) {
    const {
      replace,
      location: { query, pathname },
      handleSelect,
    } = this.props;
    const { orgId } = state;
    const obj = {};
    if (orgId) {
      obj.orgId = orgId;
    }
    // 手动上传日志
    handleSelect({ param: obj.orgId });

    replace({
      pathname,
      query: {
        ...query,
        ...obj,
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
      },
    });
  }

  // 分组只针对服务经理，也就是说：
  // 有首页指标查看权限或者服务经理筛选选的是当前登录用户时显示用户分组
  renderGroup() {
    if (this.mainServiceManager) {
      return (<button
        onClick={() => { this.handleClick('/customerPool/customerGroup', '新建分组', 'RCT_FSP_CUSTOMER_LIST'); }}
      >
        用户分组
      </button>);
    }
    return null;
  }

  render() {
    const {
      taskAndGroupLeftPos,
      currentFollowCustId,
      isShowContactModal,
      currentCustId,
      emailCustId,
      custType,
      modalKey,
      isFollows,
    } = this.state;

    const {
      q,
      page,
      custList,
      curPageNum,
      pageSize,
      onPageChange,
      onSizeChange,
      getCustIncome,
      monthlyProfits,
      location,
      custEmail,
      custContactData,
      serviceRecordData,
      dict,
      authority,
      custIncomeReqState,
      toggleServiceRecordModal,
      onReorderChange,
      reorderValue,
      custRange,
      orgId,
      collectCustRange,
      expandAll,
      isLoadingEnd,
      searchServerPersonList,
      empInfo,
      handleCheck,
      handleCloseClick,
      handleAddServiceRecord,
      handleCollapseClick,
    } = this.props;
    // console.log('1---', this.props)
    // 服务记录执行方式字典
    const { executeTypes = EMPTY_ARRAY, serveWay = EMPTY_ARRAY } = dict;
    const finalContactData = custContactData[currentCustId] || EMPTY_OBJECT;
    const finalEmailData = custEmail[emailCustId] || EMPTY_OBJECT;
    const finalServiceRecordData = serviceRecordData[currentCustId] || EMPTY_ARRAY;
    const {
      selectedIds = '',
      selectAll,
      ptyMng,
    } = location.query;
    // current: 默认第一页
    // pageSize: 默认每页大小10
    // curTotal: 当前列表数据总数
    let current = 1;
    let pagesize = 10;
    let curTotal = 0;
    if (curPageNum) {
      current = Number(curPageNum);
    } else {
      current = Number(page.pageNo);
    }
    if (pageSize) {
      pagesize = Number(pageSize);
    } else {
      pagesize = Number(page.pageSize);
    }
    if (page.total) {
      curTotal = Number(page.total);
    }
    const selectIdsArr = selectedIds ?
      selectedIds.split(',') : EMPTY_ARRAY;
    const isAllSelectBool = !((!selectAll || selectAll === 'false'));
    // 是否显示底部的发起任务和分组，全选或者有选中数据时才显示
    const isShow = (!_.isEmpty(selectIdsArr) || isAllSelectBool) ? 'block' : 'none';
    // 已选中的条数：选择全选显示所有数据量，非全选显示选中的条数
    const selectCount = isAllSelectBool ? page.total : selectIdsArr.length;
    // 默认服务经理
    let serviceManagerDefaultValue = `${empInfo.empName}（${empInfo.empNum}）`;
    if (authority) {
      if (ptyMng && ptyMng.split('_')[1]) {
        serviceManagerDefaultValue = `${ptyMng.split('_')[0]}（${ptyMng.split('_')[1]}）`;
      } else {
        serviceManagerDefaultValue = '所有人';
      }
    }
    // 当前所处的orgId,默认所有
    let curOrgId = 'all';
    // 根据url中的orgId赋值，没有时判断权限，有权限取岗位对应的orgId,无权限取‘all’
    if (orgId) {
      curOrgId = orgId;
    } else if (authority) {
      if (document.querySelector(fspContainer.container)) {
        curOrgId = window.forReactPosition.orgId;
      } else {
        curOrgId = empInfo.occDivnNum;
      }
    }
    return (
      <div className="list-box">
        <div className={styles.listHeader}>
          <div className="selectAll">
            <Checkbox
              checked={isAllSelectBool}
              onChange={this.selectAll}
              disabled={_.isEmpty(custList)}
            >
              全选
            </Checkbox>
            { _.isEmpty(custList) ? null : <span className="hint">自动选择所有符合条件的客户</span> }
          </div>
          <div className={styles.reorder}>
            <Reorder
              value={reorderValue}
              onChange={onReorderChange}
            />
          </div>
          <div className={styles.reorder}>
            <div className={styles.selectBox}>
              <SaleDepartmentFilter
                orgId={curOrgId}
                custRange={custRange}
                updateQueryState={this.changeSaleDepartment}
                collectData={collectCustRange}
                expandAll={expandAll}
              />
            </div>
            <div className={styles.selectBox}>
              <ServiceManagerFilter
                disable={!authority}
                searchServerPersonList={searchServerPersonList}
                serviceManagerDefaultValue={serviceManagerDefaultValue}
                dropdownSelectedItem={this.dropdownSelectedItem}
                dropdownToSearchInfo={this.dropdownToSearchInfo}
              />
            </div>
          </div>
        </div>
        {
          !_.isEmpty(custList) ?
            <div className="list-wrapper">
              {
                custList.map(
                  item => <CustomerRow
                    handleCheck={handleCheck}
                    mainServiceManager={this.mainServiceManager}
                    authority={authority}
                    dict={dict}
                    location={location}
                    getCustIncome={getCustIncome}
                    monthlyProfits={monthlyProfits}
                    listItem={item}
                    q={q}
                    isAllSelect={isAllSelectBool}
                    selectedIds={selectIdsArr}
                    onChange={this.handleSingleSelect}
                    onSendEmail={this.handleSendEmail}
                    onAddFollow={this.handleAddFollow}
                    createContact={this.showCreateContact}
                    key={`${item.empId}-${item.custId}-${item.idNum}-${item.telephone}-${item.asset}`}
                    custEmail={finalEmailData}
                    currentFollowCustId={currentFollowCustId}
                    isFollows={isFollows}
                    emailCustId={emailCustId}
                    custIncomeReqState={custIncomeReqState}
                    toggleServiceRecordModal={toggleServiceRecordModal}
                    formatAsset={formatAsset}
                  />,
                )
              }
            </div>
            : <NoData />
        }
        <div className="list-pagination">
          <Pagination
            current={current}
            total={curTotal}
            pageSize={pagesize}
            onChange={onPageChange}
            size="small"
            showSizeChanger
            showTotal={total => `共${total}项`}
            onShowSizeChange={onSizeChange}
          />
          <Checkbox
            checked={isAllSelectBool}
            onChange={this.selectAll}
            className={styles.selectAllTwo}
            disabled={_.isEmpty(custList)}
          >
            全选
          </Checkbox>
        </div>
        <div
          id="fixedEleDom"
          className={styles.taskAndGroup}
          style={{
            left: taskAndGroupLeftPos,
            display: isShow,
          }}
        >
          <p className="left">
            已选&nbsp;
            <span className="marked">{selectCount}</span>
            &nbsp;户，选择目标用户以创建自定义任务，或者把用户加入分组管理
          </p>
          <div className="right">
            {this.renderGroup()}
            <button
              onClick={() => { this.handleClick('/customerPool/createTask', '发起任务', 'RCT_FSP_CUSTOMER_LIST'); }}
            >
              发起任务
            </button>
          </div>
        </div>
        {
          (isShowContactModal && isLoadingEnd) ?
            <CreateContactModal
              handleCollapseClick={handleCollapseClick}
              handleAddServiceRecord={handleAddServiceRecord}
              handleCloseClick={handleCloseClick}
              key={modalKey}
              visible={isShowContactModal}
              custContactData={finalContactData}
              serviceRecordData={finalServiceRecordData}
              custType={custType}
              createServiceRecord={toggleServiceRecordModal} /* 创建服务记录 */
              onClose={this.resetModalState}
              currentCustId={currentCustId}
              executeTypes={executeTypes}
              serveWay={serveWay}
            /> : null
        }
        {
          <Loading loading={!isLoadingEnd} />
        }
      </div>
    );
  }
}
