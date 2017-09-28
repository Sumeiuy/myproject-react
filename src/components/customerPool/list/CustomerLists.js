/**
 * @file components/customerPool/list/CustomerLists.js
 *  客户列表
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Pagination, Checkbox, message } from 'antd';

import CustomerRow from './CustomerRow';
import CreateContactModal from './CreateContactModal';

import { fspContainer } from '../../../config';
import { fspGlobal, helper } from '../../../utils';
import NoData from '../common/NoData';

import styles from './customerLists.less';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
let modalKeyCount = 0;

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
    custRange: PropTypes.array.isRequired,
    condition: PropTypes.object.isRequired,
    getCustContact: PropTypes.func.isRequired,
    getCustEmail: PropTypes.func.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    getFollowCust: PropTypes.func.isRequired,
    custContactData: PropTypes.object.isRequired,
    custEmail: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    isSms: PropTypes.bool.isRequired,
    custIncomeReqState: PropTypes.bool,
    toggleServiceRecordModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageSize: null,
    curPageNum: null,
    q: '',
    fllowCustData: {},
    followLoading: false,
    custIncomeReqState: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      taskAndGroupLeftPos: '0',
      currentCustId: '',
      isShowContactModal: false,
      modalKey: `modalKeyCount${modalKeyCount}`,
      // 判断是否是主服务经理
      isSms: false,
      currentEmailCustId: '',
      email: '',
      isFollows: {},
      currentFollowCustId: '',
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
  }
  componentWillReceiveProps(nextProps) {
    const {
      custContactData: prevCustContactData = EMPTY_OBJECT,
      serviceRecordData: prevServiceRecordData = EMPTY_ARRAY,
      followLoading: preFL,
      custList,
      custEmail,
     } = this.props;
    const {
      custContactData: nextCustContactData = EMPTY_OBJECT,
      serviceRecordData: nextServiceRecordData = EMPTY_ARRAY,
      followLoading,
      fllowCustData,
      custList: nextCustList,
      custEmail: nextCustEmail,
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
          message.success('关注成功，并添加到“我关注的客户”分组');
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
    const { replace, location: { query, pathname } } = this.props;
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
    const { getCustContact, getServiceRecord, custContactData } = this.props;
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

  // 分组只针对服务经理，也就是说：
  // 1、搜素、标签客户池列表：客户列表是“我的客户”时可以添加用户分组
  // 2、业务办理客户池：默认是只显示自己负责客户的，所以可以添加用户分组
  // 3、业绩目标客户池：客户列表是“我的客户”时可以添加用户分组
  renderGroup() {
    // const { custRange, source, location: { query: { orgId } } } = this.props;
    // const tmpArr = ['custIndicator', 'numOfCustOpened', 'search', 'tag'];
    // // 从绩效、搜索和热词进入且只有我的客户
    // const onlyMyCustomer = _.includes(tmpArr, source) &&
    // custRange.length === 1 &&
    // custRange[0].id === 'msm';
    // // 从业务入口进入的
    // const fromBusiness = source === 'business';
    // // 从绩效、搜索和热词进入,通过客户范围切换到我的客户
    // const inMyCustomer = _.includes(tmpArr, source) && orgId && orgId === 'msm';
    if (this.props.isSms) {
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
      isSms,
      custIncomeReqState,
      toggleServiceRecordModal,
    } = this.props;
    // 服务记录执行方式字典
    const { executeTypes = EMPTY_ARRAY, serveWay = EMPTY_ARRAY } = dict;
    const finalContactData = custContactData[currentCustId] || EMPTY_OBJECT;
    const finalEmailData = custEmail[currentCustId] || EMPTY_OBJECT;
    const finalServiceRecordData = serviceRecordData[currentCustId] || EMPTY_ARRAY;
    const {
      selectedIds = '',
      selectAll,
    } = location.query;
    if (!custList.length) {
      return <div className="list-box"><NoData /></div>;
    }
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
    // debugger
    // console.log('current: ', current, page, selectIdsArr, isAllSelectBool);
    return (
      <div className="list-box">
        <div className={styles.selectAllBox}>
          <div className="selectAll">
            <Checkbox
              checked={isAllSelectBool}
              onChange={this.selectAll}
            >
              全选
            </Checkbox>
            <span className="hint">自动选择所有符合条件的客户</span>
          </div>
        </div>
        <div className="list-wrapper">
          {
            custList.map(
              item => <CustomerRow
                isSms={isSms}
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
                currentCustId={currentCustId}
                custIncomeReqState={custIncomeReqState}
                toggleServiceRecordModal={toggleServiceRecordModal}
              />,
            )
          }
        </div>
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
          isShowContactModal ?
            <CreateContactModal
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
      </div>
    );
  }
}
