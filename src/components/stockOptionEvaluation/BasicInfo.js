/*
 * @Author: zhangjun
 * @Date: 2018-06-07 23:20:12
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-07-04 14:21:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import InfoTitle from '../common/InfoTitle';
import styles from './basicInfo.less';

const EMPTY_INFO = '--';

export default class BasicInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    const {
      econNum,
      custName,
      divisionName,
      openDivName,
      idTypeName,
      idNum,
      isProfessInvsetCn,
      aAcct,
      openSys,
      custTransLvName,
      stockCustTypeName,
      reqTypeName,
      openOptMktCatgName,
      busPrcDivName,
      accptTime,
      declareBus,
    } = this.props.data;
    const custInfo = `${custName}(${econNum})`;
    return (
      <div className={styles.basicInfoBox}>
        <InfoTitle head="基本信息" />
        <div className={styles.coloumn}>
          <div className={styles.label}>
          客户
            <span className={styles.colon}>:</span>
          </div>
          <div className={styles.value}>
            {custInfo || EMPTY_INFO}
          </div>
        </div>
        <div className={styles.basicInfoWrapper}>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              所属营业部
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {divisionName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              开户营业部
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {openDivName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              证件类型
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {idTypeName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              证件号码
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {idNum || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              是否专业投资者
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {isProfessInvsetCn || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              上海A股账号
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {aAcct || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              开户系统
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {openSys || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              客户交易级别
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {custTransLvName || EMPTY_INFO}
            </div>
          </div>
        </div>
        <div className={styles.basicInfo}>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              客户类型
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {stockCustTypeName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              申请类型
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {reqTypeName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              开立期权市场类别
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {openOptMktCatgName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              业务受理营业部
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {busPrcDivName || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.coloumn}>
            <div className={styles.label}>
              受理时间
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {(accptTime && accptTime.slice(0, 10)) || EMPTY_INFO}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>
              申报事项
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              {declareBus || EMPTY_INFO}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
