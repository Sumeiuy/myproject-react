/**
 * @file customerPool/ManageIndicators.js
 *  目标客户池-经营指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';

import RectFrame from './RectFrame';
import IECharts from '../../IECharts';
import CheckLayout from './CheckLayout';
import ProgressList from './ProgressList';
import CustomerService from './CustomerService';
// import CycleProgressList from './CycleProgressList';
import styles from './performanceIndicators.less';
import {
  // getHSRate,
  getPureAddCust,
  getProductSale,
  getClientsNumber,
  getTradingVolume,
  // getServiceIndicatorOfManage,
} from './HomeIndicators';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    hsRate: PropTypes.string,
  }

  static defaultProps = {
    indicators: {},
    cycle: [],
    hsRate: '',
  }

  render() {
    const {
      indicators,
      // hsRate,
      cycle,
      push,
      location,
    } = this.props;
    const {
      motOkMnt,
      motTotMnt,
      taskCust,
      totCust,
      cftCust,
      ttfCust,
      rzrqCust,
      shHkCust,
      szHkCust,
      optCust,
      hkCust,
      otcTranAmt,
      fundTranAmt,
      finaTranAmt,
      privateTranAmt,
      purAddCustaset,
      purRakeGjpdt,
      tranAmtBasicpdt,
      tranAmtTotpdt,
      purAddCust,
      newProdCust,
      purAddNoretailcust,
      purAddHighprodcust,
    } = indicators || {};

    // 新增客户（经营指标）
    const pureAddData = [
      _.parseInt(purAddCust, 10),
      _.parseInt(purAddNoretailcust, 10),
      _.parseInt(purAddHighprodcust, 10),
      _.parseInt(newProdCust, 10),
    ];
    const { newUnit: pureAddUnit, items: pureAddItems } = getPureAddCust({ pureAddData });
    const pureAddHead = { icon: 'kehu', title: `新增客户（${pureAddUnit}）` };

    // 业务开通数（经营指标）
    const clientNumberData = [
      _.parseInt(ttfCust, 10),
      _.parseInt(shHkCust, 10),
      _.parseInt(rzrqCust, 10),
      _.parseInt(optCust, 10),
      _.parseInt(cftCust, 10),
    ];
    const param = {
      clientNumberData,
      colourfulIndex: 1,
      colourfulData: [
        { value: _.parseInt(szHkCust, 10), color: '#38d8e8' },
      ],
      colourfulTotalNumber: _.parseInt(hkCust, 10),
    };
    const { newUnit: clientUnit, items: clientItems } = getClientsNumber(param);
    const clientHead = { icon: 'kehuzhibiao', title: `业务开通数（${clientUnit}）` };

    // 沪深归集率
    // const hsRateData = getHSRate([_.toNumber(hsRate)]);
    const hsRateHead = { icon: 'jiaoyiliang', title: '沪深归集率' };

    // 资产和交易量（经营指标）
    const tradeingVolumeData = [
      _.toNumber(purAddCustaset),
      _.toNumber(tranAmtBasicpdt),
      _.toNumber(tranAmtTotpdt),
      _.toNumber(purRakeGjpdt),
    ];
    const {
      newUnit: tradeVolumeUnit,
      items: tradeItems,
    } = getTradingVolume({ tradeingVolumeData });
    const tradeVolumeHead = { icon: 'chanpinxiaoshou', title: `资产和交易量（${tradeVolumeUnit}）` };

    // 产品销售（经营指标）
    const productSaleData = [
      _.toNumber(fundTranAmt),
      _.toNumber(finaTranAmt),
      _.toNumber(privateTranAmt),
      _.toNumber(otcTranAmt),
    ];
    const {
      newUnit: productSaleUnit,
      items: productSaleItems,
    } = getProductSale({ productSaleData });
    const productSaleHead = { icon: 'shouru', title: `产品销售（${productSaleUnit}）` };

    // 服务指标（经营业绩）
    const customerServiceData = { motOkMnt, motTotMnt, taskCust, totCust };
    // const serviceIndicator = getServiceIndicatorOfManage(customerServiceData);
    const serviceIndicatorHead = { icon: 'kehufuwu', title: '服务指标' };

    return (
      <div className={styles.indexBox}>
        <div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              <Col span={8}>
                <RectFrame dataSource={pureAddHead}>
                  <ProgressList
                    key={'pureAdd'}
                    dataSource={pureAddItems}
                    cycle={cycle}
                    push={push}
                    location={location}
                  />
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={clientHead}>
                  <IECharts
                    option={clientItems}
                    resizable
                    style={{
                      height: '170px',
                    }}
                  />
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={hsRateHead}>
                  <div />
                  {/* <IECharts
                    option={liquidOption}
                    resizable
                    style={{
                      height: '170px',
                    }}
                  /> */}
                </RectFrame>
              </Col>
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={16}>
              <Col span={8}>
                <RectFrame dataSource={tradeVolumeHead}>
                  <CheckLayout dataSource={tradeItems} />
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={productSaleHead}>
                  <ProgressList dataSource={productSaleItems} key={'productSale'} />
                </RectFrame>
              </Col>
              <Col span={8}>
                {/* <CycleProgressList dataSource={serviceIndicator} /> */}
                <RectFrame dataSource={serviceIndicatorHead}>
                  <CustomerService
                    data={customerServiceData}
                  />
                </RectFrame>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
