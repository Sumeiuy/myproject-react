/**
 *@file

 *@author zhuyanwen

 * */
import React, { PureComponent } from 'react';
import { withRouter } from 'dva/router';
import { Row, Col, Radio } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerRow.less';
import iconsigned from '../../../static/images/icon-signed.png';
import iconschart from '../../../static/images/icon-chart.png';
import iconavator from '../../../static/images/icon-avator.png';
import iconMoney from '../../../static/images/icon-money.png';
import iconClose from '../../../static/images/icon-close.png';
import iconOpen from '../../../static/images/icon-open.png';

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
      <div className={styles.customerContent}>
        <Row type="flex" className={styles.custoemrRow}>
          <Col span={3} className="avator">
            <div className="select-icon"><Radio /></div>
            <div>
              <img className="avator-image" src={iconavator} alt="avator" />
              <div className="avator-text">个人客户</div>
              <div className="avator-icon-money">
                <img className="icon-money-image" src={iconMoney} alt="icon-money" />
              </div>
            </div>
          </Col>
          <Col span={21} className="customerInfo">
            <div className="customer-basic-info">
              <div className="customer-basic-info-a">
                <div className="item-a">
                  <span>张三丰</span>
                  <span>020048849</span>
                  <span>男/46岁</span>
                </div>
                <div className="item-b">
                  <span>服务经理：</span><span>李四</span>
                  <span>南京证券营业部券营业部券营业部</span>
                </div>
              </div>
              <div className="customer-basic-info-b">
                <img className="icon-singned" src={iconsigned} alt="标签" title="标签" />
                <div className="tag-a">高净值</div>
                <div className="tag-b">稳健</div>
              </div>
              <div className="customer-basic-info-c">
                <div className="item-a">
                  <span className="assets-text">总资产：</span>
                  <sapn className="assets-num">328.5</sapn>
                  <span className="assets-text">万元</span>
                  <img className="iconschart" src={iconschart} alt="chart" />
                </div>
                <div className="item-b">
                  <span>佣金率：</span>
                  <span>25‰</span>
                </div>
              </div>
            </div>
            <div className="customer-other-info">
              <div className="collapse-item">
                <span style={this.state.showStyle}><a onClick={() => this.handleCollapse('open')}><span className="item-a">展开</span><img src={iconOpen} alt="open" /></a></span>
                <span style={this.state.hideStyle}><a onClick={() => this.handleCollapse('close')}><span className="item-a">收起</span><img src={iconClose} alt="open" /></a></span>
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
        <Row type="flex" className={styles.custoemrRow}>
          <Col span={3} className="avator">
            <div className="select-icon"><Radio /></div>
            <div>
              <img className="avator-image" src={iconavator} alt="avator" />
              <div className="avator-text">个人客户</div>
              <div className="avator-icon-money">
                <img className="icon-money-image" src={iconMoney} alt="icon-money" />
              </div>
            </div>
          </Col>
          <Col span={21} className="customerInfo">
            <div className="customer-basic-info">
              <div className="customer-basic-info-a">
                <div className="item-a">
                  <span>张三丰</span>
                  <span>020048849</span>
                  <span>男/46岁</span>
                </div>
                <div className="item-b">
                  <span>服务经理：</span><span>李四</span>
                  <span>南京证券营业部券营业部券营业部</span>
                </div>
              </div>
              <div className="customer-basic-info-b">
                <img className="icon-singned" src={iconsigned} alt="标签" title="标签" />
                <div className="tag-a">高净值</div>
                <div className="tag-b">稳健</div>
              </div>
              <div className="customer-basic-info-c">
                <div className="item-a">
                  <span className="assets-text">总资产：</span>
                  <sapn className="assets-num">328.5</sapn>
                  <span className="assets-text">万元</span>
                  <img className="iconschart" src={iconschart} alt="chart" />
                </div>
                <div className="item-b">
                  <span>佣金率：</span>
                  <span>25‰</span>
                </div>
              </div>
            </div>
            <div className="customer-other-info">
              <div className="collapse-item">
                <span style={this.state.showStyle}><a onClick={() => this.handleCollapse('open')}><span className="item-a">展开</span><img src={iconOpen} alt="open" /></a></span>
                <span style={this.state.hideStyle}><a onClick={() => this.handleCollapse('close')}><span className="item-a">收起</span><img src={iconClose} alt="open" /></a></span>
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
        <Row type="flex" className={styles.custoemrRow}>
          <Col span={3} className="avator">
            <div className="select-icon"><Radio /></div>
            <div>
              <img className="avator-image" src={iconavator} alt="avator" />
              <div className="avator-text">个人客户</div>
              <div className="avator-icon-money">
                <img className="icon-money-image" src={iconMoney} alt="icon-money" />
              </div>
            </div>
          </Col>
          <Col span={21} className="customerInfo">
            <div className="customer-basic-info">
              <div className="customer-basic-info-a">
                <div className="item-a">
                  <span>张三丰</span>
                  <span>020048849</span>
                  <span>男/46岁</span>
                </div>
                <div className="item-b">
                  <span>服务经理：</span><span>李四</span>
                  <span>南京证券营业部券营业部券营业部</span>
                </div>
              </div>
              <div className="customer-basic-info-b">
                <img className="icon-singned" src={iconsigned} alt="标签" title="标签" />
                <div className="tag-a">高净值</div>
                <div className="tag-b">稳健</div>
              </div>
              <div className="customer-basic-info-c">
                <div className="item-a">
                  <span className="assets-text">总资产：</span>
                  <sapn className="assets-num">328.5</sapn>
                  <span className="assets-text">万元</span>
                  <img className="iconschart" src={iconschart} alt="chart" />
                </div>
                <div className="item-b">
                  <span>佣金率：</span>
                  <span>25‰</span>
                </div>
              </div>
            </div>
            <div className="customer-other-info">
              <div className="collapse-item">
                <span style={this.state.showStyle}><a onClick={() => this.handleCollapse('open')}><span className="item-a">展开</span><img src={iconOpen} alt="open" /></a></span>
                <span style={this.state.hideStyle}><a onClick={() => this.handleCollapse('close')}><span className="item-a">收起</span><img src={iconClose} alt="open" /></a></span>
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
        <Row type="flex" className={styles.custoemrRow}>
          <Col span={3} className="avator">
            <div className="select-icon"><Radio /></div>
            <div>
              <img className="avator-image" src={iconavator} alt="avator" />
              <div className="avator-text">个人客户</div>
              <div className="avator-icon-money">
                <img className="icon-money-image" src={iconMoney} alt="icon-money" />
              </div>
            </div>
          </Col>
          <Col span={21} className="customerInfo">
            <div className="customer-basic-info">
              <div className="customer-basic-info-a">
                <div className="item-a">
                  <span>张三丰</span>
                  <span>020048849</span>
                  <span>男/46岁</span>
                </div>
                <div className="item-b">
                  <span>服务经理：</span><span>李四</span>
                  <span>南京证券营业部券营业部券营业部</span>
                </div>
              </div>
              <div className="customer-basic-info-b">
                <img className="icon-singned" src={iconsigned} alt="标签" title="标签" />
                <div className="tag-a">高净值</div>
                <div className="tag-b">稳健</div>
              </div>
              <div className="customer-basic-info-c">
                <div className="item-a">
                  <span className="assets-text">总资产：</span>
                  <sapn className="assets-num">328.5</sapn>
                  <span className="assets-text">万元</span>
                  <img className="iconschart" src={iconschart} alt="chart" />
                </div>
                <div className="item-b">
                  <span>佣金率：</span>
                  <span>25‰</span>
                </div>
              </div>
            </div>
            <div className="customer-other-info">
              <div className="collapse-item">
                <span style={this.state.showStyle}><a onClick={() => this.handleCollapse('open')}><span className="item-a">展开</span><img src={iconOpen} alt="open" /></a></span>
                <span style={this.state.hideStyle}><a onClick={() => this.handleCollapse('close')}><span className="item-a">收起</span><img src={iconClose} alt="open" /></a></span>
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

      </div>
    );
  }
}
