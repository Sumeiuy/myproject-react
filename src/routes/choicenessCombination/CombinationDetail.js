/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-07 16:27:12
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';

import styles from './combinationDetail.less';
import { permission, dva, url as urlHelper, emp } from '../../helper';
import config from '../../components/choicenessCombination/config';
import { openRctTab } from '../../utils';
import CombinationModal from '../../components/choicenessCombination/CombinationModal';
import AdjustHistory from '../../components/choicenessCombination/combinationDetail/AdjustHistory';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const effects = {
  // 获取调仓历史
  getAdjustWarehouseHistory: 'choicenessCombination/getAdjustWarehouseHistory',
  // 获取组合证券构成数据/获取近一周表现前十的证券
  getCombinationSecurityList: 'choicenessCombination/getCombinationSecurityList',
  // 获取组合树
  getCombinationTree: 'choicenessCombination/getCombinationTree',
  // 获取趋势折线图
  getCombinationLineChart: 'choicenessCombination/getCombinationLineChart',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 调仓历史数据
  adjustWarehouseHistoryData: state.choicenessCombination.adjustWarehouseHistoryData,
  // 弹窗调仓历史数据
  tableHistoryList: state.choicenessCombination.tableHistoryList,
  // 组合调仓数据
  combinationAdjustHistoryData: state.choicenessCombination.combinationAdjustHistoryData,
  // 组合树列表数据
  combinationTreeList: state.choicenessCombination.combinationTreeList,
  // 折线图数据
  combinationLineChartData: state.choicenessCombination.combinationLineChartData,
});
const mapDispatchToProps = {
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory, { loading: false }),
  getCombinationSecurityList: dispatch(effects.getCombinationSecurityList, { loading: false }),
  getCombinationTree: dispatch(effects.getCombinationTree, { loading: false }),
  getCombinationLineChart: dispatch(effects.getCombinationLineChart, { loading: true }),
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class CombinationDetail extends PureComponent {
  static propTypes = {
    // 字典数据
    dict: PropTypes.object.isRequired,
    // 获取调仓历史数据
    getAdjustWarehouseHistory: PropTypes.func.isRequired,
    adjustWarehouseHistoryData: PropTypes.object.isRequired,
    // 获取组合证券构成数据/获取近一周表现前十的证券
    getCombinationSecurityList: PropTypes.func.isRequired,
    tableHistoryList: PropTypes.object.isRequired,
    // 组合树列表数据
    getCombinationTree: PropTypes.func.isRequired,
    combinationTreeList: PropTypes.array.isRequired,
    // 请求折线图数据
    getCombinationLineChart: PropTypes.func.isRequired,
    combinationLineChartData: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // HTSC 任务管理岗
      hasTkMampPermission: permission.hasTkMampPermission(),
      // 组织 ID
      orgId: emp.getOrgId(),
    };
  }

  componentDidMount() {
    const {
      getAdjustWarehouseHistory,
      getCombinationSecurityList,
      getCombinationTree,
    } = this.props;
    // 调仓方向传 3 视为取最新两条数据
    const payload = {
      directionCode: '3',
    };
    getAdjustWarehouseHistory(payload);
    getCombinationSecurityList();
    // 获取组合树
    getCombinationTree();
  }


  // 打开弹窗
  @autobind
  showModal(obj) {
    this.setState({
      visible: true,
      directionCode: obj.code || '',
      modalType: obj.type || '',
    });
  }

  // 关闭弹窗
  @autobind
  closeModal() {
    this.setState({
      visible: false,
    });
  }

  // 图表tab切换
  @autobind
  handleChartTabChange(payload) {
    console.log('图表tab切换', payload);
    const { getCombinationLineChart } = this.props;
    getCombinationLineChart(payload);
  }

  // 查看持仓客户
  @autobind
  openCustomerListPage(obj) {
    const { name, code, type } = obj;
    const { push } = this.props;
    const { hasTkMampPermission, orgId } = this.state;
    // 组合 productId
    let productId = '';
    if (type) {
      const filterType = _.filter(config.securityType, o => o.value === type);
      if (filterType.length) {
        productId = `${filterType[0].shortName}${code}`;
      }
    } else {
      productId = code;
    }

    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    // GP\JJ\ZQ
    const labelName = `${name}(${code})`;
    const query = {
      labelMapping: encodeURIComponent(productId),
      labelName: encodeURIComponent(labelName),
      orgId: hasTkMampPermission ? orgId : 'msm',
      q: encodeURIComponent(code),
      source: 'association',
      type: 'PRODUCT',
      productName: encodeURIComponent(name),
    };
    const url = `/customerPool/list?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: url,
      query,
    });
  }

  @autobind
  openStockPage(obj) {
    const { code } = obj;
    const { push } = this.props;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_STOCK_INFO',
      title: '个股资讯',
    };
    const query = {
      keyword: code,
    };
    const url = `/stock?${urlHelper.stringify(query)}`;
    console.log('打开个股资讯');
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: url,
      query,
    });
  }

  render() {
    const {
      dict,
      push,
      getCombinationTree,
      adjustWarehouseHistoryData,
      tableHistoryList,
      combinationTreeList,
      combinationLineChartData,
      getCombinationLineChart,
      getAdjustWarehouseHistory,
    } = this.props;
    const {
      visible,
      directionCode,
      hasTkMampPermission,
      orgId,
      modalType,
    } = this.state;
    console.log('test',
      dict,
      push,
      adjustWarehouseHistoryData,
      combinationLineChartData,
      getCombinationLineChart,
      hasTkMampPermission,
      orgId,
    );
    const modalProps = {
      history: {
        type: config.typeList[0],
        title: '调仓历史',
        // 调仓方向集合
        direction: directionCode,
        // 获取组合名称树接口
        getTreeData: getCombinationTree,
        // 组合名称树数据
        treeData: combinationTreeList,
        // 获取列表接口
        getListData: getAdjustWarehouseHistory,
        // 列表数据
        listData: tableHistoryList,
        // 查看持仓客户事件
        openCustomerListPage: this.openCustomerListPage,
      },
      report: {
        type: config.typeList[1],
        title: '历史报告',
        // 获取组合名称树接口
        getTreeData: getCombinationTree,
        // 组合名称树数据
        treeData: combinationTreeList,
        // 获取列表接口
        getListData: getAdjustWarehouseHistory,
        // 列表数据
        listData: tableHistoryList,
      },
    };

    return (
      <div className={styles.combinationDetailBox}>
        组合详情
        <div className={styles.floor}>
          <AdjustHistory />
        </div>
        {
          visible
          ?
            <CombinationModal
              // 关闭弹窗
              closeModal={this.closeModal}
              {...modalProps[modalType]}
            />
          :
            null
        }
      </div>
    );
  }
}
