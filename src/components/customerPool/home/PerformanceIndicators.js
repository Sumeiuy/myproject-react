/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-绩效指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Icon from '../../common/Icon';
import CustomerService from './CustomerService';
import ProductSales from './ProductSales';
import TradingVolume from './TradingVolume';
import CustomerIndicators from './CustomerIndicators';
import BusinessProcessing from './BusinessProcessing';
import Income from './Income';
import CustRange from '../common/CustRange';
import styles from './performanceIndicators.less';

const Option = Select.Option;
let KEYCOUNT = 0;
export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    customersData: PropTypes.array,
    custRange: PropTypes.array,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    expandAll: PropTypes.bool,
    selectValue: PropTypes.string,
    location: PropTypes.object.isRequired,
    incomeData: PropTypes.array.isRequired,
  }

  static defaultProps = {
    indicators: {},
    customersData: [],
    custRange: [],
    cycle: [],
    expandAll: false,
    selectValue: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      key: KEYCOUNT,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { custRange: preCustRange } = this.props;
    const { custRange: nextCustRange } = nextProps;
    if (!_.isEqual(preCustRange, nextCustRange)) {
      this.setState({
        key: ++KEYCOUNT,
      });
    }
  }

  @autobind
  handleChange(value) {
    const { updateQueryState } = this.props;
    updateQueryState({
      cycleSelect: value,
    });
  }

  render() {
    const {
      indicators,
      custRange,
      replace,
      updateQueryState,
      collectCustRange,
      cycle,
      expandAll,
      selectValue,
      push,
      location,
      incomeData,
    } = this.props;
    const {
      cftCust,
      // dateType,
      finaTranAmt,
      fundTranAmt,
      // hkCust,
      szHkCust,
      shHkCust,
      newProdCust,
      optCust,
      otcTranAmt,
      privateTranAmt,
      purAddCust,
      purAddCustaset,
      purAddHighprodcust,
      purAddNoretailcust,
      purRakeGjpdt,
      rzrqCust,
      // staId,
      // staType,
      tranAmtBasicpdt,
      tranAmtTotpdt,
      ttfCust,
      motOkMnt,
      motTotMnt,
      taskCust,
      totCust,
    } = indicators;
    const tradingVolume = {
      purAddCustaset,
      purRakeGjpdt,
      tranAmtBasicpdt,
      tranAmtTotpdt,
    };
    const productSalesData = { fundTranAmt, privateTranAmt, finaTranAmt, otcTranAmt };
    const customerServiceData = { motOkMnt, motTotMnt, taskCust, totCust };
    const customerIndicators = {
      totCust,
      purAddCust,
      purAddNoretailcust,
      purAddHighprodcust,
      newProdCust,
    };
    const businessProcessing = {
      cftCust,
      ttfCust,
      rzrqCust,
      shHkCust,
      szHkCust,
      optCust,
    };
    const { key } = this.state;
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={styles.title}>
            <span className={styles.name}>绩效指标</span>
            <div className={styles.timeBox}>
              <Icon type="kehu" />
              {
                !_.isEmpty(custRange) ?
                  <CustRange
                    custRange={custRange}
                    location={location}
                    replace={replace}
                    updateQueryState={updateQueryState}
                    collectData={collectCustRange}
                    expandAll={expandAll}
                    key={`selectTree${key}`}
                  /> :
                  <Select
                    style={{ width: 200, color: '#CCC' }}
                    defaultValue="暂无数据"
                    key="seletTreeNull"
                  >
                    <Option value="暂无数据">暂无数据</Option>
                  </Select>
              }
              <i className={styles.bd} />
              <Icon type="rili" />
              <Select
                style={{ width: 60 }}
                value={selectValue}
                onChange={this.handleChange}
                key="dateSelect"
              >
                {cycle.map(item =>
                  <Option key={item.key} value={item.key}>{item.value}</Option>)}
              </Select>
            </div>
          </div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              <Col span={8}>
                <CustomerIndicators
                  push={push}
                  location={location}
                  data={customerIndicators}
                />
              </Col>
              <Col span={8}>
                <BusinessProcessing
                  push={push}
                  location={location}
                  data={businessProcessing}
                />
              </Col>
              <Col span={8}>
                <TradingVolume
                  data={tradingVolume}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={16}>
              <Col span={8}>
                <ProductSales
                  data={productSalesData}
                />
              </Col>
              <Col span={8}>
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="shouru" />净创收
                  </div>
                    <div className={styles.content}>
                      <Income
                        incomeData={incomeData}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="kehufuwu" />客户服务
                  </div>
                    <div className={`${styles.content} ${styles.jyContent}`}>
                      <CustomerService
                        data={customerServiceData}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
