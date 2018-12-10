/*
 * @Author: zhangjun
 * @Date: 2018-12-07 17:07:07
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-08 17:41:25
 * @description 风控能力分析
 */
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import InfoTitle from '../InfoTitle';
import Icon from '../../common/Icon';
import {
  TAB_LIST,
  TabKeys,
  RISK_PROFIT_CONTRAST,
  WAVERATE_SUMMARY,
  WAVERATE_COMPUTE_METHOD_DATA,
  SHARP_RATE_SUMMARY,
  SHARP_RATE_COMPUTE_METHOD_DATA,
  RETREAT_SUMMARY,
  RETREAT_COMPUTE_METHOD,
} from './config';
import {
  SUMMARY,
  COMPUTE_METHOD,
} from '../config';
import logable from '../../../decorators/logable';
import styles from './windControlAnalysis.less';

const TabPane = Tabs.TabPane;

export default class WindControlAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 账户风险收益对比当前激活的是Tab, 默认显示年化波动率的Tab
      activeKey: TabKeys.WAVERATE,
    };
  }

  // 获取年化波动率组件
  @autobind
  getWaveRateComponent() {
    const {
      WAVERATE_COMPUTE_METHOD1,
      WAVERATE_COMPUTE_METHOD2,
    } = WAVERATE_COMPUTE_METHOD_DATA;
    return (
      <div className={styles.infoContainer}>
        <div className={styles.infoSummary}>
          <div className={styles.name}>{SUMMARY}</div>
          <p className={styles.summary}>
            {WAVERATE_SUMMARY}
          </p>
        </div>
        <div className={styles.infoComputeMethod}>
          <div className={styles.name}>{COMPUTE_METHOD}</div>
          <p className={styles.computeMethod}>
            {WAVERATE_COMPUTE_METHOD1}
            <Icon type="gongshi2" className={styles.formula} />
            {WAVERATE_COMPUTE_METHOD2}
          </p>
          <div className={styles.formulaContainer}>
            波动率=
            <Icon type="gongshi" className={styles.wareFormula} />
          </div>
        </div>
      </div>
    );
  }

  // 获取年化夏普比率组件
  @autobind
  getSharpRateComponent() {
    const {
      SHARP_RATE_COMPUTE_METHOD1,
      SHARP_RATE_COMPUTE_METHOD2,
      SHARP_RATE_COMPUTE_METHOD3,
      SHARP_RATE_COMPUTE_METHOD4,
    } = SHARP_RATE_COMPUTE_METHOD_DATA;
    return (
      <div className={styles.infoContainer}>
        <div className={styles.infoSummary}>
          <div className={styles.name}>{SUMMARY}</div>
          <p className={styles.summary}>
            {SHARP_RATE_SUMMARY}
          </p>
        </div>
        <div className={styles.infoComputeMethod}>
          <div className={styles.name}>{COMPUTE_METHOD}</div>
          <p className={styles.computeMethod}>
            {SHARP_RATE_COMPUTE_METHOD1}
            <Icon type="gongshi3" className={styles.formula} />
            {SHARP_RATE_COMPUTE_METHOD2}
            <Icon type="gongshi2" className={styles.formula} />
            {SHARP_RATE_COMPUTE_METHOD3}
            <Icon type="gongshi5" className={styles.formula} />
            {SHARP_RATE_COMPUTE_METHOD4}
          </p>
          <div className={styles.formulaContainer}>
            夏普比率=
            <Icon type="gongshi1" className={styles.sharpFormula} />
          </div>
        </div>
      </div>
    );
  }

  @autobind
  getTabContentComponent(activeKey) {
    let component = null;
    switch (activeKey) {
      case TabKeys.WAVERATE:
        component = this.getWaveRateComponent();
        break;
      case TabKeys.SHARP_RATE:
        component = this.getSharpRateComponent();
        break;
      default:
        component = this.getWaveRateComponent();
        break;
    }
    return component;
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：年化波动率/年化夏普比率' } })
  handleChangeActiveKey(key) {
    this.setState({ activeKey: key });
  }

  render() {
    const { activeKey } = this.state;
    const tabContentComponent = this.getTabContentComponent(activeKey);
    return (
      <div className={styles.windControlAnalysis}>
        <InfoTitle
          title={RISK_PROFIT_CONTRAST}
          isNeedTip
          modalTitle={RISK_PROFIT_CONTRAST}
        >
          <Tabs defaultActiveKey={activeKey} onChange={this.handleChangeActiveKey}>
            {
              _.map(TAB_LIST, item => (
                <TabPane tab={item.tabName} key={item.key}>
                  {tabContentComponent}
                </TabPane>
              ))
            }
          </Tabs>
        </InfoTitle>
        <InfoTitle
          title="账户回撤对比"
          isNeedTip
          modalTitle="最大回撤比率"
        >
          <div className={styles.infoContainer}>
            <div className={styles.infoSummary}>
              <div className={styles.name}>{SUMMARY}</div>
              <p className={styles.summary}>
                {RETREAT_SUMMARY}
              </p>
            </div>
            <div className={styles.infoComputeMethod}>
              <div className={styles.name}>{COMPUTE_METHOD}</div>
              <p className={styles.computeMethod}>
                {RETREAT_COMPUTE_METHOD}
              </p>
            </div>
          </div>
        </InfoTitle>
      </div>
    );
  }
}
