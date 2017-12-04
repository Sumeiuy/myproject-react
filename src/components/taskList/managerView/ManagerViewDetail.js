/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-04 16:43:20
 * 管理者视图详情
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { Row, Col } from 'antd';
import BasicInfo from '../common/BasicInfo';
import MissionDescription from './MissionDescription';
import styles from './managerViewDetail.less';

const EMPTY_OBJECT = {};

export default class ManagerViewDetail extends PureComponent {

  static propTypes = {
    // 视图是否处于折叠状态
    isFold: PropTypes.bool,
    // 基本信息
    basicInfo: PropTypes.object,
  }

  static defaultProps = {
    isFold: false,
    basicInfo: EMPTY_OBJECT,
  }

  render() {
    const {
      isFold,
      basicInfo = EMPTY_OBJECT,
    } = this.props;

    const {
      missionId,
      missionName,
      missionStatusName,
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
      custSource,
      custTotal,
      custSourceDescription,
    } = basicInfo;

    return (
      <div className={styles.managerViewDetail}>
        <div className={styles.titleSection}>
          <div className={styles.taskTitle}>
            {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          </div>
        </div>
        <div className={styles.basicInfoSection}>
          <BasicInfo
            // 有效期开始时间
            triggerTime={triggerTime}
            // 有效期结束时间
            endTime={endTime}
            // 任务目标
            missionTarget={missionTarget}
            // 服务策略
            servicePolicy={servicePolicy}
            // 父容器宽度变化,默认宽度窄
            isFold={isFold}
            // 客户来源
            custSource={custSource}
            // 客户总数
            custTotal={custTotal}
            // 客户来源说明
            custSourceDescription={custSourceDescription}
          />
        </div>
        <div className={styles.descriptionSection}>
          <MissionDescription missionDescription={''} />
        </div>
        <div className={styles.missionImplementationSection}>
          这是任务实施简报区域
        </div>
        <div className={styles.missionFeedbackSection}>
          这是任务反馈区域
        </div>
      </div>
    );
  }
}
