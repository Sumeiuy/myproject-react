/**
 * @file components/customerPool/HoldingProductDetail.js
 *  客户池-客户列表持仓详情查看
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Popover } from 'antd';
import { fspContainer } from '../../../config';
import logable from '../../../decorators/logable';

import styles from './holdingProductDetail.less';

// 持仓产品的类型：'stock' 股票
const TYPE_STOCK = 'stock';
// 持仓产品的类型：'fund' 基金
const TYPE_FUND = 'fund';

export default class HoldingProductDetail extends PureComponent {

  static propTypes = {
    custId: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    queryHoldingProduct: PropTypes.func.isRequired,
    holdingProducts: PropTypes.object.isRequired,
    queryHoldingProductReqState: PropTypes.bool.isRequired,
    formatAsset: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      isMouseEnter: false,
    };
    this.debounced = _.debounce(
      this.getDetail,
      500,
      { leading: false },
    );
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '持仓详情',
    },
  })
  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

  /**
   * 获取持仓产品的详情
   * 判断当前产品的详情是否已经存在，不存在时再去请求
   * 详情已经存在，直接显示popover，不需要发请求
   */
  @autobind
  getDetail() {
    const { data, queryHoldingProduct, holdingProducts, custId } = this.props;
    const { id = '' } = data;
    if (_.isEmpty(holdingProducts[`${custId}${id}`])) {
      queryHoldingProduct({ custId, prdtHold: id }).then(() => {
        this.setState({ hasData: true });
      });
    } else {
      this.setState({ hasData: true });
    }
  }

  /**
   * 当接口返回的数据只有一个产品时，生成持仓产品的详细信息
   */
  @autobind
  generateDetailNode() {
    const {
      data,
      holdingProducts = {},
      custId,
    } = this.props;
    // 取当前产品的id
    const currentHoldingProductId = data.id;
    // 当前客户所持有的当前产品的信息
    const customerProductInfo = holdingProducts[`${custId}${currentHoldingProductId}`] || {};
    // 取当前客户所持有的当前产品在本地存储的数据中对应的详情信息，type时产品的类别，detail时产品的具体信息
    const { type = '', detail = [] } = customerProductInfo;
    // 详情接口返回的数据为null值或detail为空数组时，显示暂无数据
    if (_.isEmpty(customerProductInfo) || _.isEmpty(detail)) {
      return <div className={styles.detailItem}>暂无数据</div>;
    }

    // 当前产品为股票、基金时，需要显示类型
    const isShowCategory = type === TYPE_STOCK || type === TYPE_FUND;
    return _.map(detail, (item = {}) => (
      <div className={styles.detailItem} key={`${item.holdingNumber}-${item.marketValue}`}>
        {isShowCategory && <p className={styles.category}>{item.category}</p>}
        <ul className={styles.content}>
          {this.generateDetailItemNode({ name: '持仓数量', value: item.holdingNumber, isFormatAsset: false })}
          {this.generateDetailItemNode({ name: '持仓市值', value: item.marketValue, currency: item.unit })}
          {this.generateDetailItemNode({ name: '累计收益', value: item.cumulativeProfit, currency: item.unit })}
          {this.generateDetailItemNode({ name: '昨日到账收益', value: item.ytdIncomeToAccount, currency: item.unit })}
          {this.generateDetailItemNode({ name: '昨日预估收益', value: item.ytdEstimatedEarnings, currency: item.unit })}
        </ul>
      </div>
    ));
  }

  /**
   * 根据参数生成持仓产品除产品类型外的其他信息
   * @param {*} name 显示的文字说明
   * @param {*} value 显示的数字
   * @param {*} isFormatAsset 表示value传入的数字需要格式成资产类别来显示，eg: 12.23万，默认为true
   */
  @autobind
  generateDetailItemNode({ name, value, currency, isFormatAsset = true }) {
    if (value !== null) {
      let newValue = value;
      if (isFormatAsset) {
        const { formatAsset } = this.props;
        newValue = 0;
        if (value !== 0) {
          const obj = formatAsset(value, currency);
          newValue = `${obj.value}${obj.unit}`;
        }
      }
      return (
        <li>
          <span className={styles.label}>{name}:</span>
          <span className={styles.value}>{newValue}</span>
        </li>
      );
    }
    return null;
  }

  @autobind
  handleMouseEnter() {
    this.setState({
      isMouseEnter: true,
    });
    this.debounced();
  }

  @autobind
  handleMouseLeave() {
    this.setState({
      isMouseEnter: false,
    });
    this.debounced.cancel();
    this.setState({
      popoverVisible: false,
    });
  }

  render() {
    const { hasData, isMouseEnter } = this.state;
    const { queryHoldingProductReqState } = this.props;
    const suspendedLayer = (
      <div className={styles.suspendedLayer}>
        {this.generateDetailNode()}
      </div>
    );
    return (
      <div
        className={styles.holdingProductDetail}
        style={{
          cursor: queryHoldingProductReqState ? 'wait' : 'pointer',
        }}
      >
        <Popover
          overlayClassName={styles.holdingProductDetailToolTip}
          content={suspendedLayer}
          mouseEnterDelay={0.5}
          autoAdjustOverflow
          placement="top"
          visible={isMouseEnter && hasData}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          getPopupContainer={this.getPopupContainer}
        >
          <em className={styles.holdingProductDetailBtn}>持仓详情</em>
        </Popover>
      </div>
    );
  }
}
