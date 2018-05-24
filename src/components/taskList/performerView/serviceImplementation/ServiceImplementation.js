/*
 * @Description: 服务实施
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:52:01
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-24 19:40:10
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Header from './Header';
import ListSwiper from './ListSwiper';
import { defaultStateCode, ASSET_DESC } from './config';
import styles from './serviceImplementation.less';


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
      state: defaultStateCode,
      rowId: '',
      assetSort: ASSET_DESC,
      activeIndex: '',
      currentCustomer: { id: 3, name: '3' },
    };
  }

  componentWillReceiveProps(nextProps) {
    // 左侧列表变化时请求服务实施的列表接口
    if (nextProps.isFold !== this.props.isFold) {
      const { parameter } = this.props;
      const { rowId, assetSort, state, activeIndex } = parameter;
      // 左侧列表收起来的时候，服务实施显示10个客户，展开时显示6个客户
      const pageSize = nextProps.isFold ? 10 : 6;
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
    const { parameter, targetCustList } = this.props;
    const { page: { pageSize } } = targetCustList;
    const { rowId, assetSort, state } = parameter;
    this.queryTargetCustList({
      state,
      rowId,
      assetSort,
      pageSize,
      pageNum,
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
    const { parameter } = this.props;
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
      </div>
    );
  }
}
