/**
 * @file components/commissionAdjustment/Detail.js
 *  佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import classnames from 'classnames';
import styles from './detail.less';

export default class Commissiondetail extends PureComponent {
  render() {
     const leftItem = classnames({
      [styles.itemleft]: true,
      [styles.item]: true,
    });
     const rightItem = classnames({
      [styles.itemright]: true,
      [styles.item]: true,
    });
    return (
      <div className={styles.detail_box}>
        <div className={styles.inner}>
          <h1 className={styles.bugtitle}>编号11222</h1>
           <div id="detail_module" className={styles.module}>
                  <div className={styles.mod_header}>
                    <h2 className={styles.toogle_title}>基本信息</h2>
                  </div>
                  <div className={styles.mod_content}>
                    <ul className={styles.property_list}>
                      <li className={styles.item}>
                        <div className={styles.wrap}>
                          <span className={styles.itemname}>子类型：</span>
                          <span className={styles.itemvalue}>私密客户权限分配</span>
                        </div>
                      </li>
                      <li className={styles.item}>
                        <div className={styles.wrap}>
                          <span className={styles.itemname}>备注：</span>
                          <span className={styles.itemvalue}>
                            这里是备注备注备注
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
          <div id="nginformation_module" className={styles.module}>
            <div className={styles.mod_header}>
              <h2 className={styles.toogle_title}>拟稿信息</h2>
            </div>
            <div className={styles.mod_content}>
              <ul className={styles.property_list}>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <span className={styles.itemname}>拟稿人：</span>
                    <span className={styles.itemvalue}>南京分公司长江路营业部-李四（0016533333）</span>
                  </div>
                </li>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <span className={styles.itemname}>提请时间：</span>
                    <span className={styles.itemvalue}>2017/08/31</span>
                  </div>
                </li>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <span className={styles.itemname}>状态：</span>
                    <span className={styles.itemvalue}>
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
          <div id="customer_module" className={styles.module}>
            <div className={styles.mod_header}>
              <h2 className={styles.toogle_title}>客户信息：</h2>
            </div>
            <div className={styles.mod_content}>
              客户列表
            </div>
          </div>
          <div id="choosecommission" className={styles.module}>
            <div className={styles.mod_header}>
              <h2 className={styles.toogle_title}>佣金产品选择：</h2>
            </div>
            <div className={styles.mod_content}>
            <ul className={styles.property_list}>
              <li className={styles.item}>
                <div className={styles.wrap}>
                  <span className={styles.itemname}>目标佣金率（股基）：</span>
                  <span className={styles.itemvalue}>25‰</span>
                </div>
              </li>
              <li className={styles.item}>
                <div className={styles.wrap}>
                  <span className={styles.itemname}>目标产品：</span>
                  <span className={styles.itemvalue}>PPKD02/。。。。。</span>
                </div>
              </li>
              </ul>
            </div>
          </div>
          <div id="processing" className={styles.module}>
            <div className={styles.mod_header}>
              <h2 className={styles.toogle_title}>其他佣金费率：</h2>
            </div>
            <div className={styles.mod_content}>
              <ul className={styles.property_list}>
                <li className={leftItem}>
                  <div className={styles.wrap}>
                    <span className={styles.itemname}>B股：</span>
                    <span className={styles.itemvalue}>内容</span>
                  </div>
                </li>
                <li className={rightItem}>
                  <div className={styles.wrap}>
                    <span className={styles.itemname}>担保权证</span>
                    <span className={styles.itemvalue}>内容</span>
                  </div>
                </li>
                <li className={leftItem}>
                  <div className={styles.wrap}>
                    <span className={styles.itemname}>债券：</span>
                    <span className={styles.itemvalue}>内容</span>
                  </div>
                </li>
                <li className={rightItem}>
                  <div className={styles.wrap}>
                    <span className={styles.itemname}>信用顾基：</span>
                    <span className={styles.itemvalue}>内容</span>
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

