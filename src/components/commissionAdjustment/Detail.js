/**
 * @file components/commissionAdjustment/Detail.js
 *  佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import OtherCommission from './OtherCommission';
import styles from './detail.less';

export default class Commissiondetail extends PureComponent {
  render() {
    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <h1 className={styles.bugTitle}>编号11222</h1>
          <div id="detailModule" className={styles.module}>
            <InfoTitle head="基本信息" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="子类型" value="私密客户权限分配" />
                </li>
                <li className={styles.item}>
                  <InfoItem label="备注" value="这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注" />
                </li>
              </ul>
            </div>
          </div>
          <div id="nginformation_module" className={styles.module}>
            <InfoTitle head="拟稿信息" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="拟稿人" value="南京分公司长江路营业部" />
                </li>
                <li className={styles.item}>
                  <InfoItem label="提请时间" value="2017/08/31" />
                </li>
                <li className={styles.item}>
                  <InfoItem label="状态" value="已完成" />
                </li>
              </ul>
            </div>
          </div>
          <div id="customer_module" className={styles.module}>
            <InfoTitle head="客户信息" />
            <div className={styles.modContent}>
              客户列表
            </div>
          </div>
          <div id="choosecommission" className={styles.module}>
            <InfoTitle head="佣金产品" />
            <div className={styles.modContent}>
              <ul className={styles.propertyList}>
                <li className={styles.item}>
                  <InfoItem label="目标佣金率（股基）" value="25‰" />
                </li>
                <li className={styles.item}>
                  <InfoItem label="目标产品" value="PPKD02/。。。。。" />
                </li>
              </ul>
            </div>
          </div>
          <div id="processing" className={styles.module}>
            <InfoTitle head="其他佣金费率" />
            <div className={styles.modContent}>
              <div className={styles.leftCommission}>
                <OtherCommission name="B股：" value="这里是内容" />
                <OtherCommission name="债券：" value="这里是内容" />
                <OtherCommission name="回购：" value="这里是内容" />
                <OtherCommission name="场内基金：" value="这里是内容" />
                <OtherCommission name="权证：" value="这里是内容" />
                <OtherCommission name="担保股基：" value="这里是内容" />
                <OtherCommission name="担保债券：" value="这里是内容" />
                <OtherCommission name="担保场内基金：" value="这里是内容" />
              </div>
              <div className={styles.rightCommission}>
                <OtherCommission name="担保权证：" value="这里是内容" />
                <OtherCommission name="信用股基：" value="这里是内容" />
                <OtherCommission name="信用场内基金：" value="这里是内容" />
                <OtherCommission name="港股通（净佣金）：" value="这里是内容" />
                <OtherCommission name="个股期权：" value="这里是内容" />
                <OtherCommission name="担保品大宗：" value="这里是内容" />
                <OtherCommission name="股转：" value="这里是内容" />
                <OtherCommission name="大宗交易：" value="这里是内容" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

