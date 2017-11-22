/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的基本信息
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import LabelInfo from './LabelInfo';

import styles from './basicInfo.less';

export default class BasicInfo extends PureComponent {

  static propTypes = {
    // 有效期
    validPeriod: PropTypes.string.isRequired,
    // 任务目标时间
    taskTargetTime: PropTypes.string.isRequired,
    // 任务目标标题
    taskTargetTitle: PropTypes.string.isRequired,
    // 服务策略
    servicePolicy: PropTypes.string.isRequired,
    // 是否有问卷调查
    hasSurvey: PropTypes.bool.isRequired,
  }

  render() {
    console.log('BasicInfo>>>', this.props);
    return (
      <div className={styles.basicInfo}>
        <LabelInfo value="基本信息" />
        <div className={styles.basicInfoContent}>
          <Row>
            <Col span={12}>
              XX
            </Col>
            <Col span={12}>
              XX
            </Col>
          </Row>
        </div>
        BasicInfo
      </div>
    );
  }
}
