/**
 * @Author: sunweibin
 * @Date: 2018-07-09 13:57:57
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-09-18 18:30:15
 * @description 线上销户详情页面
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'antd';

import DetailWrap from '../common/detailWrap';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';

import styles from './detail.less';

export default function Detail(props) {
  const {
    detailInfo,
    detailInfo: {
      id,
      oaUid,
      cancelReservationFlag,
      orderDate,
      startTime,
      endTime,
      roomName,
      theme,
      participantName,
      participantId,
      remark,
      empName,
      empId,
      orgName,
      createTime,
      statusName,
    },
  } = props;

  const isEmpty = _.isEmpty(detailInfo);

  function handleCancelReservation() {
    props.cancelReservation({ id, oaUid });
  }

  const cancelBtn = !cancelReservationFlag ? null
    :
    (
      <Button
        onClick={handleCancelReservation}
      >
        取消预定
      </Button>
    );

  // 预约时间
  const orderFullTime = `${orderDate} ${startTime}-${endTime}`;
  // 参与人
  const participant = `${participantName} (${participantId})`;
  // 拟稿人
  const emp = `${empName} (${empId}) ${orgName}`;

  return (
    <DetailWrap isEmpty={isEmpty} currentId={`${id}`} extra={cancelBtn}>
      <div className={styles.module}>
      <InfoTitle head="预定信息" />
      <div className={styles.modContent}>
        <ul className={styles.dpertyList}>
          <li className={styles.item}>
            <InfoItem label="预约时间" value={orderFullTime} width="130px" />
          </li>
          <li className={styles.item}>
            <InfoItem label="智慧前厅" value={roomName} width="130px" />
          </li>
          <li className={styles.item}>
            <InfoItem label="主题" value={theme} width="130px" />
          </li>
          <li className={styles.item}>
            <InfoItem label="参与人" value={participant} width="130px" />
          </li>
          <li className={styles.item}>
            <InfoItem label="备注" value={remark} width="130px" />
          </li>
        </ul>
      </div>
    </div>
    <div className={styles.module}>
      <InfoTitle head="拟稿信息" />
      <div className={styles.modContent}>
        <ul className={styles.dpertyList}>
          <li className={styles.item}>
            <InfoItem label="拟稿人" value={emp} width="130px" />
          </li>
          <li className={styles.item}>
            <InfoItem label="申请时间" value={createTime} width="130px" />
          </li>
          <li className={styles.item}>
            <InfoItem label="状态" value={statusName} width="130px" />
          </li>
        </ul>
      </div>
    </div>
    </DetailWrap>
  );
}

Detail.propTypes = {
  detailInfo: PropTypes.object.isRequired,
  cancelReservation: PropTypes.func.isRequired,
};
