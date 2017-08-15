/**
 *@file

 *@author zhuyanwen

 * */
import React, { PureComponent } from 'react';
import { withRouter } from 'dva/router';
import { Row, Col, Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerRow.less';
import iconavator from '../../../static/images/icon-avator.png';
import iconMoney from '../../../static/images/icon-money.png';
import iconClose from '../../../static/images/icon-close.png';
import iconOpen from '../../../static/images/icon-open.png';
import ChartLineWidget from '../../components/customerPool/ChartLine';

const chartData = [{
  month: '1',
  assetProfit: '100000',
  assetProfitRate: '0.1',

},
{
  month: '2',
  assetProfit: '222222',
  assetProfitRate: '0.4',

},
{
  month: '3',
  assetProfit: '167899',
  assetProfitRate: '0.1',

},
{
  month: '4',
  assetProfit: '143240',
  assetProfitRate: '0.6',

},
{
  month: '5',
  assetProfit: '103430',
  assetProfitRate: '0.1',

},
{
  month: '6',
  assetProfit: '200000',
  assetProfitRate: '0.8',

},
];
const show = {
  display: 'block',
};
const hide = {
  display: 'none',
};
@withRouter
export default class CustomerRow extends PureComponent {
  static propTypes = {}
  constructor(props) {
    super(props);
    this.state = {
      showStyle: show,
      hideStyle: hide,
    };
  }
    @autobind
  handleCollapse(type) {
    if (type === 'open') {
      const prosshow = {
        display: 'none',
      };
      const proshide = {
        display: 'block',
      };
      this.setState({
        showStyle: prosshow,
        hideStyle: proshide,
      });
    } else if (type === 'close') {
      const consshow = {
        display: 'block',
      };
      const conshide = {
        display: 'none',
      };
      this.setState({
        showStyle: consshow,
        hideStyle: conshide,
      });
    }
  }
  render() {
    return (
      <Row type="flex" className={styles.custoemrRow}>
        <Col span={3} className={styles.avator}>
          <Checkbox className={styles.selectIcon} />
          <div>
            <img className={styles.avatorImage} src={iconavator} alt="avator" />
            <div className={styles.avatorText}>个人客户</div>
            <div className={styles.avatorIconMoney}>
              <img className={styles.iconMoneyImage} src={iconMoney} alt="icon-money" />
            </div>
          </div>
        </Col>
        <Col span={21} className={styles.customerInfo}>
          <div className={styles.customerBasicInfo}>
            <div className={styles.basicInfoA}>
              <div className={styles.itemA}>
                <span>张三丰</span>
                <span>020048849</span>
                <span>男/46岁</span>

              </div>
              <div className={styles.itemB}>
                <span>服务经理：</span><span>李四</span>
                <span>南京证券营业部券营业部券营业部</span>
              </div>
            </div>
            <div className={styles.basicInfoB}>

              <div className={styles.iconSingnedA}>
                <div className={styles.itemText}>签约客户</div>
              </div>
              <div className={styles.tagA}>高净值</div>
              <div className={styles.tagB}>稳健</div>
            </div>
            <div className={styles.basicInfoC}>
              <div className={styles.itemA}>
                <span className={styles.assetsText}>总资产：</span>
                <sapn className={styles.assetsNum}>328.5</sapn>
                <span className={styles.assetsText}>万元</span>
                <div className={styles.iconschart}>
                  <div className={styles.showCharts}>
                    <div className={styles.chartsContent}>
                      <ChartLineWidget chartData={chartData} />
                    </div>
                    <div className={styles.chartsText}>
                      <div><span>年最大时点资产：</span><span className={styles.numA}>1462</span>万元</div>
                      <div><span>本月收益率：</span><span className={styles.numB}>+5.6%</span></div>
                      <div><span>本月收益：<span className={styles.numB}>35,672</span>&nbsp;元</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.itemB}>
                <span>佣金率：</span>
                <span>25‰</span>
              </div>
            </div>
            <div className={styles.basicInfoD}>
              <ul className={styles.operationIcon}>
                <li><div className={styles.iconIphone} /><span>电话联系</span></li>
                <li><div className={styles.iconEmail} /><span>邮件联系</span></li>
                <li><div className={styles.iconRecordService} /><span>添加服务记录</span></li>
                <li><div className={styles.iconFocus} /><span>关注</span></li>
              </ul>
            </div>
          </div>
          <div className={styles.customerOtherInfo}>
            <div className={styles.collapseItem}>
              <span style={this.state.showStyle}><a onClick={() => this.handleCollapse('open')}><span className={styles.itemA}>展开</span><img src={iconOpen} alt="open" /></a></span>
              <span style={this.state.hideStyle}><a onClick={() => this.handleCollapse('close')}><span className={styles.itemA}>收起</span><img src={iconClose} alt="open" /></a></span>
            </div>
            <ul style={this.state.showStyle}>
              <li><span>姓名：张王者</span></li>
              <li><span>兴趣爱好：王者荣耀</span></li>
              <li><span>标签匹配：王者荣耀</span></li>
            </ul>
            <ul style={this.state.hideStyle}>
              <li><span>姓名：张王者</span></li>
              <li><span>兴趣爱好：王者荣耀</span></li>
              <li><span>标签匹配：王者荣耀</span></li>
              <li><span>姓名：张王者</span></li>
              <li><span>兴趣爱好：王者荣耀</span></li>
              <li><span>标签匹配：王者荣耀</span></li>
              <li><span>姓名：张王者</span></li>
              <li><span>兴趣爱好：王者荣耀</span></li>
              <li><span>标签匹配：王者荣耀</span></li>
            </ul>
          </div>

        </Col>
      </Row>
    );
  }
}
