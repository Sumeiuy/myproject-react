/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import _ from 'lodash';
import Icon from '../../components/common/Icon';
import CustomerService from './CustomerService';
import ProductSales from './ProductSales';
import Income from './Income';
import { customerOptionMap } from '../../config';
import styles from './performanceIndicators.less';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    customersData: PropTypes.array,
  }

  static defaultProps = {
    indicators: {},
    customersData: [],
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }
  // 客服范围下拉框数据
  createCustomerOption(data) {
    if (!_.isEmpty(data)) {
      return data.map((item, index) => {
        const itemKey = `customerOption${index}`;
        if (index === 0) {
          return <Option key={itemKey} value={item.value}>{item.label}</Option>;
        }
        return <Option key={itemKey} value={item.value}>{item.label}</Option>;
      });
    }
    return <Option value="0">暂无数据</Option>;
  }
  // 时间筛选条件
  creatTimeSelectOptions() {
    return customerOptionMap.time.map((item, index) => {
      const itemKey = `timeOption${index}`;
      return <Option key={itemKey} value={item.key}>{item.name}</Option>;
    });
  }
  render() {
    const { indicators, customersData } = this.props;
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
    const productSalesData = { fundTranAmt, privateTranAmt, finaTranAmt, otcTranAmt };
    const customerServiceData = { motOkMnt, motTotMnt, taskCust, totCust };
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={styles.title}>
            <span className={styles.name}>绩效指标</span>
            <div className={styles.timeBox}>
              <Icon type="renyuan" />
              <Select
                style={{ width: 120 }}
                defaultValue={customersData[0].value || 0}
                onChange={this.handleChange}
              >
                {this.createCustomerOption(customersData)}
              </Select>
              <i className={styles.bd} />
              <Icon type="renyuan" />
              <Select
                style={{ width: 120 }}
                defaultValue="518003"
                onChange={this.handleChange}
              >
                {this.creatTimeSelectOptions()}
              </Select>
            </div>
          </div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              <Col span={8}>
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="renyuan" />客户指标
                      <div className={styles.rightInfo}>
                        客户总数：<span>{346}</span>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <ul>
                        <li>
                          <p>{purAddCust} <span>人</span></p>
                          <div>净新增有效户</div>
                        </li>
                        <li>
                          <p>{purAddNoretailcust} <span>人</span></p>
                          <div>净新增非零售客户</div>
                        </li>
                        <li>
                          <p>{purAddHighprodcust} <span>人</span></p>
                          <div>净新增高端产品户</div>
                        </li>
                        <li>
                          <p>{newProdCust} <span>人</span></p>
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
                      <Icon type="renyuan" />业务办理
                    </div>
                    <div className={`${styles.content} ${styles.ywContent}`}>
                      <ul>
                        <li>
                          <p>{cftCust} <span>人</span></p>
                          <div>涨乐财富通</div>
                        </li>
                        <li>
                          <p>{ttfCust} <span>人</span></p>
                          <div>天天发</div>
                        </li>
                        <li>
                          <p>{rzrqCust} <span>人</span></p>
                          <div>融资融券</div>
                        </li>
                        <li>
                          <p>{hkCust} <span>人</span></p>
                          <div>港股通</div>
                        </li>
                        <li>
                          <p>{optCust} <span>人</span></p>
                          <div>期权</div>
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
                      <Icon type="renyuan" />交易量
                    </div>
                    <div className={`${styles.content} ${styles.jyContent}`}>
                      <ul>
                        <li>
                          <p>{purAddCustaset} <span>万</span></p>
                          <div>净新增客户资产</div>
                        </li>
                        <li>
                          <p>{tranAmtBasicpdt} <span>万</span></p>
                          <div>累计基础交易量</div>
                        </li>
                        <li>
                          <p>{tranAmtTotpdt} <span>万</span></p>
                          <div>累计综合交易量</div>
                        </li>
                        <li>
                          <p>{purRakeGjpdt} <span>万</span></p>
                          <div>股基累计净佣金</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={16}>
              <Col span={8}>
                <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="renyuan" />产品销售
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
                      <Icon type="renyuan" />收入
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
                      <Icon type="renyuan" />客户服务
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
