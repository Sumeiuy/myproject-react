/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的基本信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import LabelInfo from './LabelInfo';
import styles from './basicInfo.less';

// 暂时的来源类型，具体需要和后端定一下
const sourceType = [{
  key: 'import',
  value: '客户细分导入',
},
{
  key: 'sightLabel',
  value: '瞄准镜标签',
}];

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
    // 客户来源
    custSource: PropTypes.string,
    // 客户总数
    custTotal: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    // 客户来源说明
    custSourceDescription: PropTypes.string,
    // 预览客户明细
    onPreview: PropTypes.func,
  }

  static defaultProps = {
    triggerTime: '',
    endTime: '',
    missionTarget: '',
    servicePolicy: '',
    isFold: false,
    custSource: '',
    custTotal: '',
    custSourceDescription: '',
    onPreview: () => { },
  }

  @autobind
  handlePreview() {
    console.log('预览明细');
    const { onPreview } = this.props;
    onPreview();
  }

  render() {
    const {
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
      isFold,
      custSource,
      custSourceDescription,
      custTotal,
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
          {
            !_.isEmpty(_.find(sourceType, item => item.key === custSource)) ?
              <div>
                <Row className={styles.rowItem}>
                  <Col span={colSpanValue} className={styles.colItem}>
                    <span className={styles.label}>客户来源:&nbsp;</span>
                    <span className={styles.content}>{custSource || '--'}</span>
                  </Col>
                  <Col span={colSpanValue} className={styles.colItem}>
                    <span className={styles.label}>客户总数:&nbsp;</span>
                    <span className={styles.content}>{Number(custTotal) || 0}</span>
                    <span
                      className={styles.previewCust}
                      onClick={this.handlePreview}
                    >预览明细&gt;&gt;</span>
                  </Col>
                </Row>
                <Row className={styles.rowItem}>
                  <Col className={styles.colItem}>
                    <span className={`${styles.label} ${styles.fl}`}>客户来源说明:&nbsp;</span>
                    <p className={`${styles.content} ${styles.servicePolicy}`}>
                      {custSourceDescription || '--'}
                    </p>
                  </Col>
                </Row>
              </div> : null
          }
        </div>
      </div>
    );
  }
}
