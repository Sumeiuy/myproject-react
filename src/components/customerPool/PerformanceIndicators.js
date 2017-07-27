/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import Icon from '../../components/common/Icon';
import CustomerService from './CustomerService';
import ProductSales from './ProductSales';
import Income from './Income';
import styles from './performanceIndicators.less';

export default class PerformanceIndicators extends PureComponent {

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  render() {
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={styles.title}>
            <span className={styles.name}>绩效指标</span>
            <div className={styles.timeBox}>
              <Icon type="renyuan" />
              <Select
                style={{ width: 120 }}
                placeholder="我的客户"
                onChange={this.handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled">Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
              <i className={styles.bd} />
              <Icon type="renyuan" />
              <Select
                style={{ width: 120 }}
                defaultValue="本月"
                onChange={this.handleChange}
              >
                <Option value="本月">本月</Option>
                <Option value="本季">本季</Option>
                <Option value="本年">本年</Option>
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
                        客户总数：<span>346</span>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <ul>
                        <li>
                          <p>-4 <span>人</span></p>
                          <div>净新增有效户</div>
                        </li>
                        <li>
                          <p>-157 <span>人</span></p>
                          <div>净新增非零售客户</div>
                        </li>
                        <li>
                          <p>-4 <span>人</span></p>
                          <div>净新增高端产品户</div>
                        </li>
                        <li>
                          <p>-42 <span>人</span></p>
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
                          <p>4 <span>人</span></p>
                          <div>涨乐财富通</div>
                        </li>
                        <li>
                          <p>157 <span>人</span></p>
                          <div>天天发</div>
                        </li>
                        <li>
                          <p>4 <span>人</span></p>
                          <div>融资融券</div>
                        </li>
                        <li>
                          <p>42 <span>人</span></p>
                          <div>港股通</div>
                        </li>
                        <li>
                          <p>42 <span>人</span></p>
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
                          <p>0.64 <span>万</span></p>
                          <div>净新增客户资产</div>
                        </li>
                        <li>
                          <p>34.08 <span>万</span></p>
                          <div>累计基础交易量</div>
                        </li>
                        <li>
                          <p>34.23 <span>万</span></p>
                          <div>累计综合交易量</div>
                        </li>
                        <li>
                          <p>0.05 <span>万</span></p>
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
                      <ProductSales />
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
                      <CustomerService />
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
