/**
 * @file components/commissionAdjustment/Detail.js
 *  佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import './detail.less';

export default class Commissiondetail extends PureComponent {
  render() {
    return (
      <div className="detail_box">
        <div className="inner">
          <h1 className="bugtitle">编号11222</h1>
          <div className="row_box">
            <Row>
              <Col span="24">
                <div id="detail_module" className="module">
                  <div className="mod_header">
                    <h2 className="toogle_title">基本信息</h2>
                  </div>
                  <div className="mod_content">
                    <ul className="property_list clearfix">
                      <li className="item">
                        <div className="wrap value_word">
                          <strong className="name">标题：</strong>
                          <span className="value">标题要长长长长长长</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">子类型：</strong>
                          <span className="value">私密客户权限分配</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap value_word">
                          <strong className="name">客户：</strong>
                          <span className="value">
                            张三 123456
                          </span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap value_word">
                          <strong className="name">备注：</strong>
                          <span className="value">
                            这里是备注备注备注
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div id="nginformation_module" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">拟稿信息</h2>
            </div>
            <div className="mod_content">
              <ul className="property_list clearfix">
                <li className="item">
                  <div className="wrap value_word">
                    <strong className="name">拟稿人：</strong>
                    <span className="value">南京分公司长江路营业部-李四（0016533333）</span>
                  </div>
                </li>
                <li className="item">
                  <div className="wrap">
                    <strong className="name">提请时间：</strong>
                    <span className="value">2017/08/31</span>
                  </div>
                </li>
                <li className="item">
                  <div className="wrap value_word">
                    <strong className="name">状态：</strong>
                    <span className="value">
                     已完成
                    </span>
                  </div>
                </li>
              </ul>
              { /* <div className="btn_dv">
                <Button type="primary" onClick={this.showModal}>{messageBtnValue}</Button>
              </div> */ }
            </div>
          </div>
          <div id="customer_module" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">客户信息：</h2>
            </div>
            <div className="mod_content">
              客户列表
            </div>
          </div>
          <div id="choosecommission" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">佣金产品选择：</h2>
            </div>
            <div className="mod_content">
              <li className="item">
                <div className="wrap">
                  <strong className="name">目标佣金率（股基）：</strong>
                  <span className="value">25‰</span>
                </div>
              </li>
              <li className="item">
                <div className="wrap">
                  <strong className="name">目标产品：</strong>
                  <span className="value">PPKD02/。。。。。</span>
                </div>
              </li>
            </div>
          </div>
          <div id="processing" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">其他佣金费率：</h2>
            </div>
            <div className="mod_content">
              <ul className="property_list clearfix">
                <li className="item">
                  <div className="wrap value_word">
                    <strong className="name">B股：</strong>
                    <span className="value">内容</span>
                  </div>
                </li>
                <li className="item item-right">
                  <div className="wrap value_word">
                    <strong className="name">担保权证</strong>
                    <span className="value tiem-orient">内容</span>
                  </div>
                </li>
                <li className="item">
                  <div className="wrap value_word">
                    <strong className="name">债券：</strong>
                    <span className="value">内容</span>
                  </div>
                </li>
                <li className="item item-right">
                  <div className="wrap value_word">
                    <strong className="name">信用顾基：</strong>
                    <span className="value tiem-orient">内容</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

