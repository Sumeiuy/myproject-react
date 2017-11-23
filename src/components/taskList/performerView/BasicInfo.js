/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的基本信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import LabelInfo from './LabelInfo';

import styles from './basicInfo.less';

export default class BasicInfo extends PureComponent {

  static propTypes = {
    // 有效期
    validPeriod: PropTypes.string,
    // 任务目标
    taskTarget: PropTypes.string,
    // 服务策略
    servicePolicy: PropTypes.string,
    // 父容器宽度变化,默认宽度窄
    isWide: PropTypes.bool,
  }

  static defaultProps = {
    validPeriod: '',
    taskTarget: '',
    servicePolicy: '',
    isWide: false,
  }

  render() {
    const {
      validPeriod,
      taskTarget,
      servicePolicy,
      isWide,
    } = this.props;
    const colSpanValue = isWide ? 12 : 24;
    return (
      <div className={styles.basicInfo}>
        <LabelInfo value="基本信息" />
        <div className={styles.basicInfoContent}>
          <Row className={styles.rowItem}>
            <Col span={colSpanValue} className={styles.colItem}>
              <span className={styles.label}>任务有效期:&nbsp;</span>
              <span className={styles.content}>{validPeriod}</span>
            </Col>
            <Col span={colSpanValue} className={styles.colItem}>
              <span className={styles.label}>任务目标:&nbsp;</span>
              <span className={styles.content}>{taskTarget}</span>
            </Col>
          </Row>
          <Row className={styles.rowItem}>
            <Col className={styles.colItem}>
              <span className={`${styles.label} ${styles.fl}`}>服务策略:&nbsp;</span>
              <p className={`${styles.content} ${styles.servicePolicy}`}>
                {servicePolicy}
              </p>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
