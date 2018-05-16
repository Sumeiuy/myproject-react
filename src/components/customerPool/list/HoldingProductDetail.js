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

import styles from './holdingProductDetail.less';

// 持仓产品的类型：'finance' 金融产品
const TYPE_FINANCE = 'finance';

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
      popoverVisible: false,
    };
    this.debounced = _.debounce(
      this.getDetail,
      500,
      { leading: false },
    );
  }

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
      queryHoldingProduct({ custId, prdtHold: id });
    }
    this.setState({ popoverVisible: true });
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
    // 详情接口返回的数据为null值时
    if (_.isEmpty(holdingProducts[`${custId}${currentHoldingProductId}`])) {
      return <div className={styles.detailItem}>暂无数据</div>;
    }
    // 取当前产品id在本地存储的数据中对应的详情信息，type时产品的类别，detail时产品的具体信息
    const { type = '', detail = [] } = holdingProducts[`${custId}${currentHoldingProductId}`] || {};
    // 当前产品的类别是否为金融产品
    const isNotFinance = type !== TYPE_FINANCE;
    return _.map(detail, (item = {}) => (
      <div className={styles.detailItem} key={`${item.holdingNumber}-${item.marketValue}`}>
        {isNotFinance && <p className={styles.category}>{item.category}</p>}
        <ul className={styles.content}>
          {this.generateDetailItemNode({ name: '持仓数量', value: item.holdingNumber, isFormatAsset: false })}
          {this.generateDetailItemNode({ name: '持仓市值', value: item.marketValue })}
          {this.generateDetailItemNode({ name: '盈亏', value: item.profit })}
          {this.generateDetailItemNode({ name: '累计收益', value: item.cumulativeProfit })}
          {this.generateDetailItemNode({ name: '累计到账收益', value: item.incomeToAccount })}
          {this.generateDetailItemNode({ name: '累计预估收益', value: item.estimatedEarnings })}
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
  generateDetailItemNode({ name, value, isFormatAsset = true }) {
    if (value) {
      let newValue = value;
      if (isFormatAsset) {
        const { formatAsset } = this.props;
        newValue = 0;
        if (value !== 0) {
          const obj = formatAsset(value);
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
  handleMouseLeave() {
    this.debounced.cancel();
    this.setState({
      popoverVisible: false,
    });
  }

  render() {
    const { popoverVisible } = this.state;
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
          visible={popoverVisible}
          onMouseEnter={this.debounced}
          onMouseLeave={this.handleMouseLeave}
          getPopupContainer={this.getPopupContainer}
        >
          <em className={styles.holdingProductDetailBtn}>&nbsp;持仓详情</em>
        </Popover>
      </div>
    );
  }
}
