/**
 * @Author: sunweibin
 * @Date: 2018-07-09 13:57:57
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-09-18 16:01:08
 * @description 线上销户详情页面
 */
import React from 'react';
import PropTypes from 'prop-types';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import styles from './detail.less';


export default function Detail(props) {
  const { detailInfo } = props;
  return (
    <div className={styles.investmentDetail}>
      <div className={styles.inner}>
        <div className={styles.title}>
          <span className={styles.titleNum}>编号{detailInfo.id}</span>
          <span className={styles.titleBtn}>取消预定</span>
        </div>
        <div className={`${styles.module} ${styles.module2}`}>
          <InfoTitle head="预定信息"/>
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem width="70px" label="预约时间" value={detailInfo.createTime}/>
              </li>
              <li className={styles.item}>
                <InfoItem width="70px" label="智慧前厅" value={detailInfo.rooName}/>
              </li>
              <li className={styles.item}>
                <InfoItem width="70px" label="主题" value={detailInfo.theme}/>
              </li>
              <li className={styles.item}>
                <InfoItem width="70px" label="参与人" value={`${detailInfo.participantName} (${detailInfo.participantId})`}/>
              </li>
              <li className={styles.item}>
                <InfoItem width="70px" label="备注" value={detailInfo.remark}/>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="拟稿信息"/>
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem width="70px" label="拟稿人" value={`${detailInfo.empName} (${detailInfo.empId}) ${detailInfo.orgName}`}/>
              </li>
              <li className={styles.item}>
                <InfoItem width="70px" label="申请时间" value={detailInfo.orderDate}/>
              </li>
              <li className={styles.item}>
                <InfoItem width="70px" label="状态" value={detailInfo.statusName}/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

Detail.propTypes = {
  detailInfo: PropTypes.object.isRequired,
};
