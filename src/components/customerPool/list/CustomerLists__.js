/**
 * @file components/customerPool/list/CustomerLists.js
 *  客户列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Checkbox } from 'antd';
import SaleDepartmentFilter from './manageFilter/SaleDepartmentFilter';
import ServiceManagerFilter from './manageFilter/ServiceManagerFilter';
import CustomerRow from './CustomerRow__';
import CreateContactModal from './CreateContactModal';
import Sort from './sort';
import BottomFixedBox from './BottomFixedBox__';
import SignCustomerLabel from './modal/SignCustomerLabel';
import MultiCustomerLabel from './modal/MultiCustomerLabel';
import { openInTab } from '../../../utils';
import { url as urlHelper, emp, number } from '../../../helper';
import NoData from '../common/NoData';
import Pagination from '../../common/Pagination';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import {
  ENTERLIST_PERMISSION_TASK_MANAGE,
  ENTERLIST_PERMISSION_INDEX_QUERY,
  MAIN_MAGEGER_ID,
  ALL_DEPARTMENT_ID,
  ENTERLIST_LEFTMENU,
} from '../../../routes/customerPool/config';
import logable from '../../../decorators/logable';
import styles from './customerLists__.less';

// 服务营业部筛选项去重的key
const UNIQBY_KEY = 'id';
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
let modalKeyCount = 0;
// 服务营业中的'所有'选项
const allSaleDepartment = { id: ALL_DEPARTMENT_ID, name: '不限' };

// 数字千分位格式
function thousandFormat(num) {
  return number.thousandFormat(num, true, ',', true);
}

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
      value: thousandFormat((newNum / WANYI).toFixed(2)),
      unit: UNIT_WANYI,
    };
  }
  if (absNum >= YI) {
    return {
      value: thousandFormat((newNum / YI).toFixed(2)),
      unit: UNIT_YI,
    };
  }
  if (absNum >= WAN) {
    return {
      value: thousandFormat((newNum / WAN).toFixed(2)),
      unit: UNIT_WAN,
    };
  }
  return {
    value: thousandFormat(newNum.toFixed(2)),
    unit: UNIT_DEFAULT,
  };
};

@RestoreScrollTop
export default class CustomerLists extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    custList: PropTypes.array.isRequired,
    curPageNum: PropTypes.string,
    pageSize: PropTypes.string,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    q: PropTypes.string,
    monthlyProfits: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    entertype: PropTypes.string.isRequired,
    condition: PropTypes.object.isRequired,
    getCustContact: PropTypes.func.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    custContactData: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    reorderValue: PropTypes.object.isRequired,
    onReorderChange: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func,
    custRange: PropTypes.object.isRequired,
    expandAll: PropTypes.bool,
    orgId: PropTypes.string,
    searchServerPersonList: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    handleAddServiceRecord: PropTypes.func.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    custServedByPostnResult: PropTypes.bool.isRequired,
    hasTkMampPermission: PropTypes.bool.isRequired,
    hasIndexViewPermission: PropTypes.bool.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    hasNPCTIQPermission: PropTypes.bool.isRequired,
    hasPCTIQPermission: PropTypes.bool.isRequired,
    queryHoldingProduct: PropTypes.func.isRequired,
    holdingProducts: PropTypes.object.isRequired,
    queryHoldingProductReqState: PropTypes.bool,
    isNotSaleDepartment: PropTypes.bool.isRequired,
    dataForNextPage: PropTypes.object,
    addCallRecord: PropTypes.func.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
    currentPytMng: PropTypes.object.isRequired,
    // 组合产品订购客户查询持仓证券重合度
    queryHoldingSecurityRepetition: PropTypes.func.isRequired,
    getSearchPersonList: PropTypes.func.isRequired,
    clearSearchPersonList: PropTypes.func.isRequired,
    holdingSecurityData: PropTypes.object.isRequired,
    queryHoldingIndustryDetail: PropTypes.func.isRequired,
    industryDetail: PropTypes.object.isRequired,
    queryHoldingIndustryDetailReqState: PropTypes.bool,
    queryCustSignedLabels: PropTypes.func.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signCustLabels: PropTypes.func.isRequired,
    signBatchCustLabels: PropTypes.func.isRequired,
    custLabel: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    addLabel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageSize: null,
    curPageNum: null,
    q: '',
    custIncomeReqState: false,
    filesList: [],
    expandAll: false,
    orgId: null,
    collectCustRange: () => { },
    queryHoldingProductReqState: false,
    dataForNextPage: {},
    queryHoldingIndustryDetailReqState: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentCustId: '',
      isShowContactModal: false,
      modalKey: `modalKeyCount${modalKeyCount}`,
      currentSignLabelCustId: '',
      multiSignLabelVisible: false,
    };
    this.checkMainServiceManager(props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: {
        query: {
          ptyMngId: prePtyMngId,
        },
      },
    } = this.props;
    const {
      location: {
        query: {
          ptyMngId,
        },
      },
    } = nextProps;
    if (prePtyMngId !== ptyMngId) {
      this.checkMainServiceManager(nextProps);
    }
  }

  /**
   * 判断当前登录用户是否为主服务经理
   */
  @autobind
  checkMainServiceManager(props) {
    const { currentPytMng, location: { query } } = props;
    const { ptyMngId } = currentPytMng;
    this.mainServiceManager = _.has(query, 'ptyMngId') ? ptyMngId === emp.getId() : !this.hasPermission();
  }

  // 没有 任务管理权限从首页搜索、热词、联想和潜在业务 或 绩效指标的客户范围为 我的客户 下钻到列表
  @autobind
  orgIdIsMsm() {
    const { location: { query: { orgId = '' } } } = this.props;
    return orgId === MAIN_MAGEGER_ID;
  }

  /**
   * 单选列表中的数据
   * 数据： url中：selectedIds=id1.name1,id2.name2,id3.name3
   * 逻辑：
   * url中没有selectedIds时，选中id=id1， selectedIds=id1.name1
   * url中selectedIds=id1.name1,id2.name2，并且选中id=id1，过滤id1.name1 => selectedIds=id1.name1
   * url中selectedIds=id1.name1，并且选中id=id2时  => selectedIds=id1.name1,id2.name2
   */
  @autobind
  handleSingleSelect(id, name) {
    const {
      replace,
      location: {
        query,
        pathname,
      },
    } = this.props;
    const { selectedIds } = query;
    const cur = `${id}.${name}`;
    let tmpStr = '';
    if (!selectedIds) {
      tmpStr = cur;
    } else {
      const selectedIdsArr = selectedIds.split(',');
      tmpStr = _.includes(selectedIdsArr, cur) ?
        selectedIdsArr.filter(v => v !== cur).join(',') :
        [...selectedIdsArr, cur].join(',');
    }
    replace({
      pathname,
      query: {
        ...query,
        selectedIds: tmpStr,
        selectAll: false,
      },
    });
  }

  // 点击全选，获取按钮的状态赋值url中的selectAll,并且将selectedIds置空
  @autobind
  @logable({ type: 'Click', payload: { name: '全选' } })
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
    });
  }

  @autobind
  showCreateContact({ custName, custId, custType }) {
    const {
      getCustContact,
      getServiceRecord,
    } = this.props;
    // 联系人依赖联系人信息和服务记录信息
    const getContactInfo = Promise.all([getCustContact({ custId }), getServiceRecord({ custId })]);
    getContactInfo.then(() => {
      this.setState({
        custName,
        currentCustId: custId,
        custType,
        isShowContactModal: true,
        modalKey: `modalKeyCount${modalKeyCount++}`,
      });
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

    const ptyMng = `${item.ptyMngName}_${item.ptyMngId}`;
    // 手动上传日志
    handleSelect({ param: ptyMng });

    replace({
      pathname,
      query: {
        ...query,
        ptyMngId: item.ptyMngId,
        ptyMngName: item.ptyMngName,
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
      },
    });
  }

  @autobind
  dropdownToSearchInfo(value) {
    const { handleSearch, getSearchPersonList } = this.props;
    handleSearch({ param: `keyword_${value}` });
    // 下拉菜单搜索查询关键字
    getSearchPersonList({
      keyword: value,
      pageSize: 10,
      pageNum: 1,
    });
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
      obj.departmentOrgId = orgId;
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

  // 跳转到分组页面或新建任务页面
  @autobind
  goGroupOrTask({ id, title, url, obj, shouldStay, editPane }) {
    const { push, dataForNextPage } = this.props;
    const newurl = `${url}?${urlHelper.stringify({ ...obj, ...dataForNextPage })}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id,
      title,
    };
    openInTab({
      routerAction: push,
      url: newurl,
      param,
      pathname: url,
      query: obj,
      shouldStay,
      editPane,
    });
  }

  // 判断是否是主服务经理
  @autobind
  canSelectSM() {
    const {
      hasTkMampPermission,
      hasIndexViewPermission,
    } = this.props;
    // 如果有【任务管理岗】或【首页指标查询】则服务经理可选
    return !(hasTkMampPermission || hasIndexViewPermission);
  }

  // 判断从首页不同入口处进入列表页有没有相应的权限
  @autobind
  hasPermission() {
    const {
      hasTkMampPermission,
      hasIndexViewPermission,
      location: { query: { source } },
      isNotSaleDepartment,
    } = this.props;
    // 潜在业务客户进入，判断当前用户岗位是否在分公司或经总，在分公司或经总，再判断是否任务管理权限，反之dou
    return (_.includes(ENTERLIST_PERMISSION_TASK_MANAGE, source) && hasTkMampPermission) ||
      (_.includes(ENTERLIST_PERMISSION_INDEX_QUERY, source) && hasIndexViewPermission) ||
      (_.includes(ENTERLIST_LEFTMENU, source) && (hasTkMampPermission || hasIndexViewPermission)) ||
      (source === 'business' && isNotSaleDepartment && hasTkMampPermission);
  }

  /**
   * 根据不同的权限入口选择不同的服务营业部的下拉列表数据
   */
  @autobind
  switchCustRange() {
    const {
      custRange = {},
      location: { query: { source } },
      hasTkMampPermission,
      isNotSaleDepartment,
      hasIndexViewPermission,
    } = this.props;
    const { taskManagerResp = EMPTY_ARRAY, firstPageResp = EMPTY_ARRAY } = custRange;
    if (_.includes(ENTERLIST_PERMISSION_TASK_MANAGE, source)) {
      // 从首页的搜索、热词、联想词、瞄准镜和外部平台过来，判断是否有任务管理权限
      return taskManagerResp;
    }
    if (_.includes(ENTERLIST_LEFTMENU, source)) {
      if (hasTkMampPermission) {
        return taskManagerResp;
      }
      if (hasIndexViewPermission) {
        return firstPageResp;
      }
      return _.uniqBy([allSaleDepartment, ...taskManagerResp], UNIQBY_KEY);
    }
    if (source === 'business') {
      if (!(isNotSaleDepartment && hasTkMampPermission)) {
        return _.uniqBy([allSaleDepartment, ...taskManagerResp], UNIQBY_KEY);
      }
      return taskManagerResp;
    }
    // 有首页指标查询权限 且 首页绩效指标客户范围选中的是 我的客户
    if (!hasIndexViewPermission || this.orgIdIsMsm()) {
      return _.uniqBy([allSaleDepartment, ...firstPageResp], UNIQBY_KEY);
    }
    return firstPageResp;
  }

  // 添加客户标签 -- start
  @autobind
  queryCustSignLabel(custId) {
    const { queryCustSignedLabels } = this.props;
    queryCustSignedLabels({ custId }).then(() => {
      this.setState({
        currentSignLabelCustId: custId,
      });
    });
  }

  @autobind
  removeSignLabelCust() {
    this.setState({
      currentSignLabelCustId: '',
    });
  }

  @autobind
  switchMultiCustSignLabel() {
    const { multiSignLabelVisible } = this.state;
    this.setState({
      multiSignLabelVisible: !multiSignLabelVisible,
    });
  }
  // 添加客户标签 -- end
  render() {
    const {
      isShowContactModal,
      currentCustId,
      custType,
      modalKey,
      custName,
      currentSignLabelCustId,
      multiSignLabelVisible,
    } = this.state;

    const {
      q,
      page,
      custList,
      curPageNum,
      pageSize,
      onSizeChange,
      onPageChange,
      getCustIncome,
      monthlyProfits,
      location,
      custContactData,
      serviceRecordData,
      dict,
      custIncomeReqState,
      toggleServiceRecordModal,
      onReorderChange,
      reorderValue,
      orgId,
      collectCustRange,
      expandAll,
      searchServerPersonList,
      empInfo,
      handleCheck,
      handleCloseClick,
      handleAddServiceRecord,
      handleCollapseClick,
      getCeFileList,
      filesList,
      condition,
      push,
      entertype,
      clearCreateTaskData,
      queryCustUuid,
      custServedByPostnResult,
      hasTkMampPermission,
      sendCustsServedByPostnResult,
      isSendCustsServedByPostn,
      addServeRecord,
      motSelfBuiltFeedbackList,
      hasNPCTIQPermission,
      hasPCTIQPermission,
      queryHoldingProduct,
      holdingProducts,
      queryHoldingProductReqState,
      addCallRecord,
      currentCommonServiceRecord,
      currentPytMng,
      queryHoldingSecurityRepetition,
      holdingSecurityData,
      clearSearchPersonList,
      queryHoldingIndustryDetail,
      industryDetail,
      queryHoldingIndustryDetailReqState,
      custLabel,
      custLikeLabel,
      queryLikeLabelInfo,
      signCustLabels,
      signBatchCustLabels,
      addLabel,
    } = this.props;
    // console.log('1---', this.props)
    // 服务记录执行方式字典
    const { executeTypes = EMPTY_ARRAY, serveWay = EMPTY_ARRAY } = dict;
    const finalContactData = custContactData[currentCustId] || EMPTY_OBJECT;
    const finalServiceRecordData = serviceRecordData[currentCustId] || EMPTY_ARRAY;
    const {
      selectedIds = '',
      selectAll,
      departmentOrgId,
    } = location.query;
    const orgIdIsMsm = this.orgIdIsMsm();
    // current: 默认第一页
    // pageSize: 默认每页大小20
    // curTotal: 当前列表数据总数
    let current = 1;
    let pagesize = 20;
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
    const BottomFixedBoxVisible = (!_.isEmpty(selectIdsArr) || isAllSelectBool);
    // 已选中的条数：选择全选显示所有数据量，非全选显示选中的条数
    const selectCount = isAllSelectBool ? page.total : selectIdsArr.length;
    // 当前所处的orgId,默认所有
    let curOrgId = allSaleDepartment.id;
    // 根据url中的orgId赋值，没有时判断权限，有权限取岗位对应的orgId,无权限取‘all’
    if (departmentOrgId) {
      curOrgId = departmentOrgId;
    } else if (orgId) {
      // url中orgId=msm 时,服务营业部选中所有
      curOrgId = orgIdIsMsm ? allSaleDepartment.id : orgId;
    } else if (this.hasPermission()) {
      curOrgId = emp.getOrgId();
    }
    const paginationOption = {
      current,
      total: curTotal,
      pageSize: pagesize,
      onChange: onPageChange,
      onShowSizeChange: onSizeChange,
      isHideLastButton: true,
    };
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
            {_.isEmpty(custList) ? null : <span className="hint">自动选择所有符合条件的客户</span>}
          </div>
          <div className={styles.reorder}>
            <Sort onChange={onReorderChange} value={reorderValue} />
          </div>
          <div className={styles.filterWrap}>
            <div className={styles.selectBox}>
              <SaleDepartmentFilter
                orgId={curOrgId}
                custRange={this.switchCustRange()}
                updateQueryState={this.changeSaleDepartment}
                collectData={collectCustRange}
                expandAll={expandAll}
              />
            </div>
            <div className={styles.selectBox}>
              <ServiceManagerFilter
                disable={this.canSelectSM()}
                searchServerPersonList={searchServerPersonList}
                clearSearchPersonList={clearSearchPersonList}
                currentPytMng={currentPytMng}
                dropdownSelectedItem={this.dropdownSelectedItem}
                dropdownToSearchInfo={this.dropdownToSearchInfo}
              />
            </div>
          </div>
          <div className={styles.simplePagination}>
            <span>共{number.thousandFormat(curTotal, false)}位匹配客户</span>
            <Pagination
              key={paginationOption.current}
              simple
              {...paginationOption}
            />
          </div>
        </div>
        {
          !_.isEmpty(custList) ?
            <div className="list-wrapper">
              {
                custList.map(
                  item => <CustomerRow
                    empInfo={empInfo}
                    handleCheck={handleCheck}
                    dict={dict}
                    location={location}
                    getCustIncome={getCustIncome}
                    monthlyProfits={monthlyProfits}
                    listItem={item}
                    q={q}
                    isAllSelect={isAllSelectBool}
                    selectedIds={selectIdsArr}
                    onChange={this.handleSingleSelect}
                    createContact={this.showCreateContact}
                    key={`${item.empId}-${item.custId}-${item.idNum}-${item.telephone}-${item.asset}`}
                    custIncomeReqState={custIncomeReqState}
                    toggleServiceRecordModal={toggleServiceRecordModal}
                    formatAsset={formatAsset}
                    queryCustUuid={queryCustUuid}
                    condition={condition}
                    entertype={entertype}
                    goGroupOrTask={this.goGroupOrTask}
                    push={push}
                    custServedByPostnResult={custServedByPostnResult}
                    hasNPCTIQPermission={hasNPCTIQPermission}
                    hasPCTIQPermission={hasPCTIQPermission}
                    queryHoldingProduct={queryHoldingProduct}
                    holdingProducts={holdingProducts}
                    queryHoldingProductReqState={queryHoldingProductReqState}
                    queryHoldingSecurityRepetition={queryHoldingSecurityRepetition}
                    holdingSecurityData={holdingSecurityData}
                    queryHoldingIndustryDetail={queryHoldingIndustryDetail}
                    industryDetail={industryDetail}
                    queryHoldingIndustryDetailReqState={queryHoldingIndustryDetailReqState}
                    queryCustSignLabel={this.queryCustSignLabel}
                  />,
                )
              }
            </div>
            : <NoData />
        }
        <div
          className="list-pagination"
        >
          <Pagination
            key={paginationOption.current}
            {...paginationOption}
            showTotal={total => `共${number.thousandFormat(total, false)}位匹配客户`}
          />
        </div>
        {
          BottomFixedBoxVisible ?
            <BottomFixedBox
              selectCount={selectCount}
              mainServiceManager={this.mainServiceManager}
              page={page}
              condition={condition}
              location={location}
              push={push}
              custList={custList}
              entertype={entertype}
              clearCreateTaskData={clearCreateTaskData}
              onClick={this.goGroupOrTask}
              hasTkMampPermission={hasTkMampPermission}
              sendCustsServedByPostnResult={sendCustsServedByPostnResult}
              isSendCustsServedByPostn={isSendCustsServedByPostn}
              handleSignLabelClick={this.switchMultiCustSignLabel}
            /> : null
        }
        {
          isShowContactModal ?
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
              currentCustName={custName}
              executeTypes={executeTypes}
              serveWay={serveWay}
              getCeFileList={getCeFileList}
              filesList={filesList}
              toggleServiceRecordModal={toggleServiceRecordModal}
              addServeRecord={addServeRecord}
              motSelfBuiltFeedbackList={motSelfBuiltFeedbackList}
              addCallRecord={addCallRecord}
              currentCommonServiceRecord={currentCommonServiceRecord}
            /> : null
        }
        <SignCustomerLabel
          currentPytMng={currentPytMng}
          custId={currentSignLabelCustId}
          custLabel={custLabel}
          queryLikeLabelInfo={queryLikeLabelInfo}
          custLikeLabel={custLikeLabel}
          signCustLabels={signCustLabels}
          handleCancelSignLabelCustId={this.removeSignLabelCust}
          addLabel={addLabel}
        />
        <MultiCustomerLabel
          visible={multiSignLabelVisible}
          onClose={this.switchMultiCustSignLabel}
          currentPytMng={currentPytMng}
          queryLikeLabelInfo={queryLikeLabelInfo}
          custLikeLabel={custLikeLabel}
          signBatchCustLabels={signBatchCustLabels}
          condition={condition}
          location={location}
          addLabel={addLabel}
        />
      </div>
    );
  }
}
