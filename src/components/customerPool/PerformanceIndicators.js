/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-绩效指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Icon from '../../components/common/Icon';
import CustomerService from './CustomerService';
import ProductSales from './ProductSales';
import TradingVolume from './TradingVolume';
import Income from './Income';
import CustRange from './CustRange';
import styles from './performanceIndicators.less';

const Option = Select.Option;
export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    customersData: PropTypes.array,
    custRange: PropTypes.array,
    replace: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    cycle: PropTypes.array,
  }

  static defaultProps = {
    indicators: {},
    customersData: [],
    custRange: [],
    cycle: [],
  }

  constructor(props) {
    super(props);
    const { cycle } = props;
    this.state = {
      defaultSelectValue: _.isEmpty(cycle) ? '' : cycle[0].key,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { cycle: preCycle } = this.props;
    const { cycle: nextCycle } = nextProps;
    if (preCycle !== nextCycle) {
      this.setState({
        defaultSelectValue: nextCycle[0].key,
      });
    }
  }

  @autobind
  handleChange(value) {
    const { updateQueryState } = this.props;
    updateQueryState({
      cycle: value,
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
    } = this.props;
    const {
      cftCust,
      // dateType,
      finaTranAmt,
      fundTranAmt,
      hkCust,
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
    const tradingVolume = { purAddCustaset, purRakeGjpdt, tranAmtBasicpdt, tranAmtTotpdt };
    const productSalesData = { fundTranAmt, privateTranAmt, finaTranAmt, otcTranAmt };
    const customerServiceData = { motOkMnt, motTotMnt, taskCust, totCust };
    const { defaultSelectValue } = this.state;
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={styles.title}>
            <span className={styles.name}>绩效指标</span>
            <div className={styles.timeBox}>
              <Icon type="kehu" />
              <CustRange
                custRange={custRange}
                location={location}
                replace={replace}
                updateQueryState={updateQueryState}
                collectData={collectCustRange}
              />
              <i className={styles.bd} />
              <Icon type="rili" />
              {
                defaultSelectValue ? <Select
                  style={{ width: 80 }}
                  defaultValue={defaultSelectValue}
                  onChange={this.handleChange}
                >
                  {cycle.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)}
                </Select> :
                <Select
                  style={{ width: 80, color: '#CCC' }}
                  defaultValue="暂无数据"
                >
                  <Option value="暂无数据">暂无数据</Option>
                </Select>
              }
            </div>
          </div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              <Col span={8}>
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="kehuzhibiao" />客户指标（人）
                      <div className={styles.rightInfo}>
                        客户总数：<span>{346}</span>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <ul>
                        <li>
                          <p>{purAddCust || '--'} </p>
                          <div>净新增有效户</div>
                        </li>
                        <li>
                          <p>{purAddNoretailcust || '--'} </p>
                          <div>净新增非零售客户</div>
                        </li>
                        <li>
                          <p>{purAddHighprodcust || '--'} </p>
                          <div>净新增高端产品户</div>
                        </li>
                        <li>
                          <p>{newProdCust || '--'} </p>
                          <div>新增产品客户</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="yewubanli" />业务办理（人）
                    </div>
                    <div className={`${styles.content} ${styles.ywContent}`}>
                      <ul>
                        <li>
                          <p>{cftCust || '--'}</p>
                          <div>涨乐财富通</div>
                        </li>
                        <li>
                          <p>{ttfCust || '--'}</p>
                          <div>天天发</div>
                        </li>
                        <li>
                          <p>{rzrqCust || '--'}</p>
                          <div>融资融券</div>
                        </li>
                        <li>
                          <p>{hkCust || '--'}</p>
                          <div>港股通</div>
                        </li>
                        <li>
                          <p>{optCust || '--'}</p>
                          <div>期权</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
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
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="chanpinxiaoshou" />产品销售
                  </div>
                    <div className={styles.content}>
                      <ProductSales
                        data={productSalesData}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="shouru" />收入
                  </div>
                    <div className={styles.content}>
                      <Income />
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
