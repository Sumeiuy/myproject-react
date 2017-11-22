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
    validPeriod: PropTypes.string,
    // 任务目标
    taskTargete: PropTypes.string,
    // 服务策略
    servicePolicy: PropTypes.string,
    // 是否有问卷调查
    hasSurvey: PropTypes.bool,
  }

  static defaultProps = {
    validPeriod: '',
    taskTargete: '',
    servicePolicy: '',
    hasSurvey: false,
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
