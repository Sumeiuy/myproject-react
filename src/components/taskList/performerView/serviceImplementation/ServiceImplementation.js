/*
 * @Description: 服务实施
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:52:01
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-27 16:44:57
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Affix } from 'antd';
import contains from 'rc-util/lib/Dom/contains';
import Header from './Header';
import ListSwiper from './ListSwiper';
import CustomerProfile from './CustomerProfile';
import CustomerDetail from './CustomerDetail';
import SimpleDisplayBlock from './SimpleDisplayBlock';
// import { defaultStateCode, ASSET_DESC } from './config';
import styles from './serviceImplementation.less';

// fsp页面折叠左侧菜单按钮的id
const foldFspLeftMenuButtonId = 'sidebar-hide-btn';

// 这个是防止页面里有多个class重复，所以做个判断，必须包含当前节点
// 如果找不到无脑取第一个就行
const getStickyTarget = (currentNode) => {
  const containers = document.querySelectorAll('.sticky-container');
  return (currentNode && _.find(
    containers,
    element => contains(element, currentNode),
  )) || containers[0];
};

// 当左侧列表或fsp中左侧菜单被折叠或者展开时，返回当前的服务实施列表的pageSize
// isFoldFspLeftMenu=true fsp的左侧菜单被折叠收起
// isFoldLeftList=true 执行者视图左侧列表被折叠收起
const getPageSize = (isFoldFspLeftMenu, isFoldLeftList) => {
  // 全部都折叠起来放12个
  if (isFoldFspLeftMenu && isFoldLeftList) {
    return 12;
  }
  // FSP左侧菜单折叠放9个
  if (isFoldFspLeftMenu) {
    return 9;
  }
  // 任务列表折叠起来放10个
  if (isFoldLeftList) {
    return 10;
  }
  return 6;
};

export default class ServiceImplementation extends PureComponent {
  static propTypes = {
    searchCustomer: PropTypes.func.isRequired,
    customerList: PropTypes.array,
    currentId: PropTypes.string.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    parameter: PropTypes.object.isRequired,
    changeParameter: PropTypes.func.isRequired,
    targetCustList: PropTypes.object.isRequired,
    performerViewCurrentTab: PropTypes.string.isRequired,
    changePerformerViewTab: PropTypes.func.isRequired,
    isFold: PropTypes.bool.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    targetCustDetail: PropTypes.object.isRequired,
    servicePolicy: PropTypes.string,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    customerList: [],
    servicePolicy: '',
  }

  static contextTypes = {
    dict: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { targetCustList: { list } } = props;
    this.state = {
      // Fsp页面左侧菜单是否被折叠
      isFoldFspLeftMenu: false,
      // 当前服务实施列表的数据
      currentTargetList: list || [],
    };
  }

  componentDidMount() {
    // 给FSP折叠菜单按钮注册点击事件
    window.onFspSidebarbtn(this.handleFspLeftMenuClick);
  }

  componentWillReceiveProps(nextProps) {
    // 将服务实施的列表存到state里面
    const { targetCustList } = this.props;
    const { targetCustList: nextTargetCustList } = nextProps;
    if (targetCustList !== nextTargetCustList) {
      this.setState({
        currentTargetList: nextTargetCustList.list,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isFoldFspLeftMenu } = this.state;
    const { isFold } = this.props;
    if (
      prevProps.isFold !== isFold
      || prevState.isFoldFspLeftMenu !== isFoldFspLeftMenu
    ) {
      const { parameter } = this.props;
      const { rowId, assetSort, state, activeIndex } = parameter;
      const pageSize = getPageSize(isFoldFspLeftMenu, isFold);
      const pageNum = Math.ceil(parseInt(activeIndex, 10) / pageSize);
      this.queryTargetCustList({
        state,
        rowId,
        assetSort,
        pageSize,
        pageNum,
      });
    }
  }

  componentWillUnmount() {
    // 移除FSP折叠菜单按钮注册的点击事件
    window.onFspSidebarbtn(this.handleFspLeftMenuClick);
  }

  // FSP折叠菜单按钮被点击
  @autobind
  handleFspLeftMenuClick(e) {
    // 是否折叠了fsp左侧菜单
    const isFoldFspLeftMenu = e.target.id === foldFspLeftMenuButtonId
      || e.target.parentNode.id === foldFspLeftMenuButtonId;
    this.setState({ isFoldFspLeftMenu });
  }

  // 状态筛选
  @autobind
  handleStateChange({ value = '' }) {
    const { parameter, changeParameter, targetCustList } = this.props;
    const { page: { pageSize } } = targetCustList;
    const { rowId, assetSort } = parameter;
    changeParameter({ state: value, activeIndex: '1', preciseInputValue: '1' })
      .then(() => {
        this.queryTargetCustList({
          state: value,
          rowId,
          assetSort,
          pageSize,
          pageNum: 1,
        });
      });
  }

  // 客户筛选
  @autobind
  handleCustomerChange({ value = {} }) {
    const { parameter, changeParameter, targetCustList } = this.props;
    const { page: { pageSize } } = targetCustList;
    const { state, assetSort } = parameter;
    changeParameter({ rowId: value.rowId || '', activeIndex: '1', preciseInputValue: '1' })
      .then(() => {
        this.queryTargetCustList({
          rowId: value.rowId || '',
          state,
          assetSort,
          pageSize,
          pageNum: 1,
        });
      });
  }

  // 资产排序
  @autobind
  handleAssetSort(obj) {
    const assetSort = obj.isDesc ? 'desc' : 'asc';
    const { parameter, changeParameter, targetCustList } = this.props;
    const { page: { pageSize, pageNum } } = targetCustList;
    const { state, rowId } = parameter;
    changeParameter({ assetSort })
      .then(() => {
        this.queryTargetCustList({
          rowId,
          state,
          assetSort,
          pageSize,
          pageNum,
        });
      });
  }

  // 精准搜索框输入值变化
  @autobind
  handlePreciseQueryChange(e) {
    const value = e.target.value;
    const reg = /^([0-9]*)?$/;
    const { changeParameter, targetCustList } = this.props;
    const { page: { totalCount } } = targetCustList;
    // 限制输入框中只能输1到客户总数之间的正整数
    if (value === '' || (!isNaN(value) && reg.test(value) && value > 0 && value <= totalCount)) {
      changeParameter({ preciseInputValue: value });
    }
  }

  // 处理精确查找输入框enter搜索
  @autobind
  handlePreciseQueryEnterPress(e) {
    if (e.keyCode === 13) {
      const value = e.target.value;
      if (!value) return;
      const { parameter, targetCustList, changeParameter } = this.props;
      changeParameter({ activeIndex: value }).then(() => {
        const { rowId, state, assetSort } = parameter;
        console.log('handlePreciseQueryEnterPress: ', value);
        const { page: { pageSize } } = targetCustList;
        const pageNum = Math.ceil(parseInt(value, 10) / pageSize);
        this.queryTargetCustList({
          rowId,
          state,
          assetSort,
          pageSize,
          pageNum,
        });
      });
    }
  }

  // 点击了列表中的客户
  @autobind
  handleCustomerClick(obj = {}) {
    const { changeParameter, currentId, getCustDetail } = this.props;
    changeParameter({
      activeIndex: obj.activeIndex,
      currentCustomer: obj.currentCustomer,
      preciseInputValue: obj.activeIndex,
    }).then(() => {
      const { custId, missionFlowId } = obj.currentCustomer;
      getCustDetail({
        custId,
        missionId: currentId,
        missionFlowId,
      });
    });
  }

  // 客户列表左右按钮翻页
  @autobind
  handlePageChange(pageNum) {
    const { parameter, targetCustList, changeParameter } = this.props;
    const { page: { pageSize } } = targetCustList;
    const { rowId, assetSort, state } = parameter;
    const activeIndex = ((pageNum - 1) * pageSize) + 1;
    changeParameter({
      activeIndex,
      preciseInputValue: activeIndex,
    }).then(() => {
      this.queryTargetCustList({
        state,
        rowId,
        assetSort,
        pageSize,
        pageNum,
      });
    });
  }

  // 查询服务实施客户的列表
  @autobind
  queryTargetCustList(obj) {
    const {
      currentId,
      queryTargetCust,
    } = this.props;
    queryTargetCust({
      ...obj,
      missionId: currentId,
    });
  }

  render() {
    const { dict = {} } = this.context;
    const {
      parameter, targetCustDetail, servicePolicy,
      monthlyProfits, custIncomeReqState, getCustIncome,
    } = this.props;
    const { currentTargetList } = this.state;
    console.log('parameter', parameter, currentTargetList);
    return (
      <div className={styles.serviceImplementation} ref={ref => this.container = ref}>
        <Header
          {...this.props}
          {...this.state}
          dict={dict}
          handleStateChange={this.handleStateChange}
          handleCustomerChange={this.handleCustomerChange}
          handleAssetSort={this.handleAssetSort}
          handlePreciseQueryChange={this.handlePreciseQueryChange}
          handlePreciseQueryEnterPress={this.handlePreciseQueryEnterPress}
        />
        <Affix target={() => getStickyTarget(this.container)}>
          <ListSwiper
            {...this.props}
            containerClass={styles.listSwiper}
            currentTargetList={currentTargetList}
            onCustomerClick={this.handleCustomerClick}
            onPageChange={this.handlePageChange}
          />
          <CustomerProfile targetCustDetail={targetCustDetail} />
        </Affix>
        <div className={styles.taskDetail}>
          <CustomerDetail
            targetCustDetail={targetCustDetail}
            monthlyProfits={monthlyProfits}
            custIncomeReqState={custIncomeReqState}
            getCustIncome={getCustIncome}
          />
          <SimpleDisplayBlock title="服务策略" data={servicePolicy} />
          <SimpleDisplayBlock title="任务提示" data={targetCustDetail.serviceTips} />
        </div>
      </div>
    );
  }
}
