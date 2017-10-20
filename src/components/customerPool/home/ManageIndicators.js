/**
 * @file customerPool/ManageIndicators.js
 *  目标客户池-经营指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import 'echarts-liquidfill';
import _ from 'lodash';

import RectFrame from './RectFrame';
import IECharts from '../../IECharts';
import IfEmpty from '../common/IfEmpty';
import CheckLayout from './CheckLayout';
import ProgressList from './ProgressList';
import CustomerService from './CustomerService';
import styles from './performanceIndicators.less';
import {
  getHSRate,
  getPureAddCust,
  getProductSale,
  getClientsNumber,
  getTradingVolume,
  filterEmptyToInteger,
  filterEmptyToNumber,
  businessOpenNumLabelList,
  linkTo,
} from './homeIndicators_';

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

  @autobind
  handleBusinessOpenClick(instance) {
    const {
      push,
      cycle,
      location,
    } = this.props;
    instance.on('click', (arg) => {
      console.log('instance arg >>>>', arg);
      if (arg.componentType !== 'xAxis') {
        return;
      }
      const param = {
        source: 'numOfCustOpened',
        cycle,
        push,
        location,
      };
      if (arg.value === businessOpenNumLabelList[0]) {
        param.value = 'ttfCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === businessOpenNumLabelList[1]) {
        param.value = 'shHkCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === businessOpenNumLabelList[2]) {
        param.value = 'szHkCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === businessOpenNumLabelList[3]) {
        param.value = 'rzrqCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === businessOpenNumLabelList[4]) {
        param.value = 'optCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === businessOpenNumLabelList[5]) {
        param.value = 'cyb';
        param.bname = arg.value;
        linkTo(param);
      }
    });
  }

  render() {
    const {
      indicators,
      hsRate,
      cycle,
      push,
      location,
    } = this.props;
    // 字段语义，在mock文件内：/mockup/groovynoauth/fsp/emp/kpi/queryEmpKPIs.js
    const {
      motOkMnt, motTotMnt, taskCust, totCust, startupCust,
      ttfCust, rzrqCust, shHkCust, szHkCust, optCust,
      otcTranAmt, fundTranAmt, finaTranAmt, privateTranAmt,
      purAddCustaset, purRakeGjpdt, tranAmtBasicpdt, tranAmtTotpdt,
      purAddCust, newProdCust, purAddNoretailcust, purAddHighprodcust,
    } = indicators || {};

    // 控制是否显示 暂无数据
    const isEmpty = _.isEmpty(indicators);

    // 新增客户（经营指标）
    const pureAddData = [
      filterEmptyToInteger(purAddCust),
      filterEmptyToInteger(purAddNoretailcust),
      filterEmptyToInteger(purAddHighprodcust),
      filterEmptyToInteger(newProdCust),
    ];
    const { newUnit: pureAddUnit, items: pureAddItems } = getPureAddCust({ pureAddData });
    const pureAddHead = { icon: 'kehu', title: `新增客户（${pureAddUnit}）` };

    // 业务开通数（经营指标）
    const clientNumberData = [
      filterEmptyToInteger(ttfCust),
      filterEmptyToInteger(shHkCust),
      filterEmptyToInteger(szHkCust),
      filterEmptyToInteger(rzrqCust),
      filterEmptyToInteger(optCust),
      filterEmptyToInteger(startupCust),
    ];
    const param = { clientNumberData };
    const { newUnit: clientUnit, items: clientItems } = getClientsNumber(param);
    const clientHead = { icon: 'kehuzhibiao', title: `业务开通数（${clientUnit}次）` };

    // 沪深归集率
    const hsRateData = getHSRate([filterEmptyToNumber(hsRate)]);
    const hsRateHead = { icon: 'jiaoyiliang', title: '沪深归集率' };

    // 资产和交易量（经营指标）
    const tradeingVolumeData = [
      filterEmptyToNumber(purAddCustaset),
      filterEmptyToNumber(tranAmtBasicpdt),
      filterEmptyToNumber(tranAmtTotpdt),
      filterEmptyToNumber(purRakeGjpdt),
    ];
    const {
      newUnit: tradeVolumeUnit,
      items: tradeItems,
    } = getTradingVolume({ tradeingVolumeData });
    const tradeVolumeHead = { icon: 'chanpinxiaoshou', title: `资产和交易量（${tradeVolumeUnit}）` };

    // 产品销售（经营指标）
    const productSaleData = [
      filterEmptyToNumber(fundTranAmt),
      filterEmptyToNumber(finaTranAmt),
      filterEmptyToNumber(privateTranAmt),
      filterEmptyToNumber(otcTranAmt),
    ];
    const {
      newUnit: productSaleUnit,
      items: productSaleItems,
    } = getProductSale({ productSaleData });
    const productSaleHead = { icon: 'shouru', title: `产品销售（${productSaleUnit}）` };

    // 服务指标（经营业绩）
    const customerServiceData = { motOkMnt, motTotMnt, taskCust, totCust };
    const serviceIndicatorHead = { icon: 'kehufuwu', title: '服务指标' };

    return (
      <div className={styles.indexBox}>
        <div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={30}>
              <Col span={8}>
                <RectFrame dataSource={pureAddHead}>
                  <IfEmpty isEmpty={isEmpty}>
                    <ProgressList
                      key={'pureAdd'}
                      dataSource={pureAddItems}
                      cycle={cycle}
                      push={push}
                      location={location}
                    />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={clientHead}>
                  <IfEmpty isEmpty={isEmpty}>
                    <IECharts
                      onReady={this.handleBusinessOpenClick}
                      option={clientItems}
                      resizable
                      style={{
                        height: '170px',
                      }}
                    />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={hsRateHead}>
                  <IfEmpty isEmpty={isEmpty}>
                    <IECharts
                      option={hsRateData}
                      resizable
                      style={{
                        height: '180px',
                      }}
                    />
                  </IfEmpty>
                </RectFrame>
              </Col>
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={30}>
              <Col span={8}>
                <RectFrame dataSource={tradeVolumeHead}>
                  <IfEmpty isEmpty={isEmpty}>
                    <CheckLayout dataSource={tradeItems} />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={productSaleHead}>
                  <IfEmpty isEmpty={isEmpty} className={styles.empty}>
                    <ProgressList dataSource={productSaleItems} key={'productSale'} />
                  </IfEmpty>
                </RectFrame>
              </Col>
              <Col span={8}>
                <RectFrame dataSource={serviceIndicatorHead}>
                  <IfEmpty isEmpty={isEmpty}>
                    <CustomerService data={customerServiceData} />
                  </IfEmpty>
                </RectFrame>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
