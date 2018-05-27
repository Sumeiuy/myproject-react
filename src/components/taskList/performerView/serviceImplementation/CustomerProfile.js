/*
 * @Description: 客户的基本信息
 * @Author: WangJunjun
 * @Date: 2018-05-27 15:30:44
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-27 15:41:04
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Icon from '../../../common/Icon';
import { openFspTab } from '../../../../utils';
import ContactInfoPopover from '../../../common/contactInfoPopover/ContactInfoPopover';
import styles from './customerProfile.less';

import { riskLevelConfig, PER_CODE, ORG_CODE, CALLABLE_LIST } from './config';

import iconDiamond from '../img/iconDiamond.png';
import iconWhiteGold from '../img/iconWhiteGold.png';
import iconGold from '../img/iconGold.png';
import iconSliver from '../img/iconSliver.png';
import iconMoney from '../img/iconMoney.png';

// 客户等级的图片源
const rankImgSrcConfig = {
  // 钻石
  805010: iconDiamond,
  // 白金
  805015: iconWhiteGold,
  // 金卡
  805020: iconGold,
  // 银卡
  805025: iconSliver,
  // 理财
  805030: iconMoney,
};

export default class CustomerProfile extends React.PureComponent {

  static propTypes = {
    targetCustDetail: PropTypes.object.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func,
  }

  @autobind
  openFsp360TabAction(param) {
    const { targetCustDetail = {} } = this.props;
    const { custNature, custId, rowId, ptyId } = targetCustDetail;
    const type = (!custNature || custNature === PER_CODE) ? PER_CODE : ORG_CODE;
    const url = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}`;
    const pathname = '/customerCenter/fspcustomerDetail';
    openFspTab({
      routerAction: this.context.push,
      url,
      pathname,
      param,
      state: {
        url,
      },
    });
  }

  // 点击客户名称进入360视图
  @autobind
  handleCustNameClick() {
    const param = {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-客户信息',
      forceRefresh: true,
      activeSubTab: [],
      // 服务记录搜索
      serviceRecordKeyword: '',
      // 服务渠道
      serviceRecordChannel: '',
    };
    this.openFsp360TabAction(param);
  }

  /**
   * 联系方式渲染
   */
  @autobind
  renderContactInfo() {
    const { targetCustDetail = {} } = this.props;
    const {
      custNature, perCustomerContactInfo, orgCustomerContactInfoList,
      custName, missionStatusCode = '10',
    } = targetCustDetail;
    // 任务状态为未处理、处理中、已驳回时可打电话
    const canCall = _.includes(CALLABLE_LIST, missionStatusCode);
    // 联系方式为空判断
    const isEmpty = (
      custNature === PER_CODE &&
      (
        _.isEmpty(perCustomerContactInfo) ||
        (_.isEmpty(perCustomerContactInfo.homeTels)
          && _.isEmpty(perCustomerContactInfo.cellPhones)
          && _.isEmpty(perCustomerContactInfo.workTels)
          && _.isEmpty(perCustomerContactInfo.otherTels))
      )
    ) ||
      (custNature === ORG_CODE && _.isEmpty(orgCustomerContactInfoList));
    if (isEmpty) {
      return null;
    }
    const perContactInfo = _.pick(perCustomerContactInfo, ['cellPhones', 'homeTels', 'workTels', 'otherTels']);
    return (
      <ContactInfoPopover
        custType={custNature}
        name={encodeURIComponent(custName)}
        personalContactInfo={perContactInfo}
        orgCustomerContactInfoList={orgCustomerContactInfoList}
        handlePhoneEnd={this.handlePhoneEnd}
        handlePhoneConnected={this.handlePhoneConnected}
        handlePhoneClick={this.handlePhoneClick}
        disablePhone={!canCall}
        placement="top"
      >
        <span className={styles.contact}>
          <Icon type="dianhua" className={styles.icon} />联系方式
        </span>
      </ContactInfoPopover>
    );
  }

  render() {
    const { targetCustDetail = {} } = this.props;
    const {
      custName, isAllocate, isHighWorth, custId, genderValue, age,
        riskLevelCode, isSign, levelCode, custNature,
    } = targetCustDetail;
    return (
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.col}>
            <p className={styles.item}>
              <span
                className={styles.clickable}
                onClick={this.handleCustNameClick}
              >
                {custName}
              </span>
              {isAllocate === '0' && '(未分配)'}
            </p>
            <p className={styles.item}>
              {isHighWorth && <span className={styles.highWorth}>高</span>}
              {riskLevelConfig[riskLevelCode]
                && <span className={styles.riskLevel}>{riskLevelConfig[riskLevelCode]}</span>}
              {isSign && <span className={styles.sign}>签</span>}
              {rankImgSrcConfig[levelCode] && <img className={styles.rank} src={rankImgSrcConfig[levelCode]} alt="" />}
            </p>
          </div>
          <div className={styles.col}>
            <p className={`${styles.item} ${styles.textRight}`}>
              {
                custNature === 'per' ?
                  <span className={styles.basicInfo}>
                    {custId}&nbsp;|&nbsp;{age}岁&nbsp;|&nbsp;{genderValue}
                  </span>
                  : <span className={styles.basicInfo}>{custId}</span>
              }
            </p>
            <p className={`${styles.item} ${styles.textRight}`}>
              {this.renderContactInfo()}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
