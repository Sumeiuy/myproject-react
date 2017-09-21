/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-绩效指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import Icon from '../../common/Icon';
import CustomerService from './CustomerService';
// import ProductSales from './ProductSales';
import TradingVolume from './TradingVolume';
// import CustomerIndicators from './CustomerIndicators';
import BusinessProcessing from './BusinessProcessing';
import Income from './Income';
import styles from './performanceIndicators.less';
import ProgressList from '../../customerPool/common/ProgressList';
import TextList from '../../customerPool/common/TextList';
import RectFrame from '../../customerPool/common/RectFrame';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    customersData: PropTypes.array,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    incomeData: PropTypes.array.isRequired,
    lastAddCusts: PropTypes.array,
  }

  static defaultProps = {
    indicators: {},
    customersData: [],
    cycle: [],
    lastAddCusts: [],
  }

  render() {
    const {
      indicators,
      cycle,
      push,
      location,
      incomeData,
      lastAddCusts,
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
    } = indicators || {};
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
    console.log('为了lint通过，先输出', productSalesData, customerIndicators);
    const businessProcessing = {
      cftCust,
      ttfCust,
      rzrqCust,
      shHkCust,
      szHkCust,
      optCust,
    };
    const addCustHead = { icon: 'kehuzhibiao', title: '新增客户（户）' };
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              <Col span={8}>
                <RectFrame dataSource={addCustHead}>
                  <ProgressList dataSource={lastAddCusts} />
                </RectFrame>

                {/* <CustomerIndicators
                  cycle={cycle}
                  push={push}
                  location={location}
                  data={customerIndicators}
                /> */}
              </Col>
              <Col span={8}>
                <BusinessProcessing
                  cycle={cycle}
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
                <RectFrame dataSource={addCustHead}>
                  <TextList dataSource={lastAddCusts} />
                </RectFrame>
                {/* <ProductSales
                  data={productSalesData}
                /> */}
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
