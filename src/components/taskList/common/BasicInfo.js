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
    // 有效期开始时间
    triggerTime: PropTypes.string,
    // 有效期结束时间
    endTime: PropTypes.string,
    // 任务目标
    missionTarget: PropTypes.string,
    // 服务策略
    servicePolicy: PropTypes.string,
    // 父容器宽度变化,默认宽度窄
    isFold: PropTypes.bool,
  }

  static defaultProps = {
    triggerTime: '',
    endTime: '',
    missionTarget: '',
    servicePolicy: '',
    isFold: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      overlayTop: 0,
    };
  }

  render() {
    const {
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
      isFold,
    } = this.props;

    const colSpanValue = isFold ? 12 : 24;
    return (
      <div className={styles.basicInfo}>
        <LabelInfo value="基本信息" />
        <div className={styles.basicInfoContent}>
          <Row className={styles.rowItem}>
            <Col span={colSpanValue} className={styles.colItem}>
              <span className={styles.label}>任务有效期:&nbsp;</span>
              <span className={styles.content}>{triggerTime || '--'}&nbsp;~&nbsp;{endTime || '--'}</span>
            </Col>
            <Col span={colSpanValue} className={styles.colItem}>
              <span className={styles.label}>任务目标:&nbsp;</span>
              <span className={styles.content}>{missionTarget || '--'}</span>
            </Col>
          </Row>
          <Row className={styles.rowItem}>
            <Col className={styles.colItem}>
              <span className={`${styles.label} ${styles.fl}`}>服务策略:&nbsp;</span>
              <p className={`${styles.content} ${styles.servicePolicy}`}>
                {servicePolicy || '--'}
              </p>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
