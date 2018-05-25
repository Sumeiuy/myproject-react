/*
 * @Description: 服务实施
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:52:01
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-25 16:12:08
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Header from './Header';
import ListSwiper from './ListSwiper';
import CustomerProfile from './CustomerProfile';
// import { defaultStateCode, ASSET_DESC } from './config';
import styles from './serviceImplementation.less';

// fsp页面折叠左侧菜单按钮的id
const foldFspLeftMenuButtonId = 'sidebar-hide-btn';

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
  }

  static defaultProps = {
    customerList: [],
  }

  static contextTypes = {
    dict: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      // Fsp页面左侧菜单是否被折叠
      isFoldFspLeftMenu: false,
    };
  }

  componentDidMount() {
    // 给FSP折叠菜单按钮注册点击事件
    window.onFspSidebarbtn(this.handleFspLeftMenuClick);
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
      const pageSize = this.getPageSize(isFoldFspLeftMenu, isFold);
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

  // 当左侧列表或fsp中左侧菜单被折叠或者展开时，返回当前的客户列表的pageSize
  getPageSize(isFoldFspLeftMenu, isFoldLeftList) {
    // 全部都折叠起来放12个
    if (isFoldFspLeftMenu && isFoldLeftList) {
      return 12;
    }
    // FSP左侧菜单折叠方9个
    if (isFoldFspLeftMenu) {
      return 9;
    }
    // 任务列表折叠起来放10个
    if (isFoldLeftList) {
      return 10;
    }
    return 6;
  }

  // FSP折叠菜单按钮被点击
  @autobind
  handleFspLeftMenuClick(e) {
    console.log('handleFspLeftSideBarClick: ', e);
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
    console.log('handleAssetSort:  ', obj);
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
    console.log('handleIndexChange: ', obj);
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
    const { parameter, targetCustDetail } = this.props;
    console.log('parameter', parameter);
    return (
      <div className={styles.serviceImplementation}>
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
        <ListSwiper
          {...this.props}
          containerClass={styles.listSwiper}
          onCustomerClick={this.handleCustomerClick}
          onPageChange={this.handlePageChange}
        />
        <CustomerProfile targetCustDetail={targetCustDetail} />
      </div>
    );
  }
}
