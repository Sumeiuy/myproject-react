/*
 * @Description: 客户详情
 * @Author: WangJunjun
 * @Date: 2018-05-27 15:30:06
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-27 15:40:03
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import TipsInfo from './TipsInfo';
import { formatAsset } from './formatNum';
import { COMPLETION, NOTCOMPLETION, PER_CODE, ORG_CODE } from './config';
import { openFspTab } from '../../../../utils';
import styles from './customerDetail.less';

// 根据资产的值返回对应的格式化值和单位串起来的字符串
const handleAssets = (value) => {
  let newValue = '0';
  let unit = '元';
  if (!_.isEmpty(value)) {
    const obj = formatAsset(value);
    newValue = obj.value;
    unit = obj.unit;
  }
  return `${newValue}${unit}`;
};

export default class CustomerDetail extends PureComponent {
  static propTypes = {
    targetCustDetail: PropTypes.object.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func,
  }

  // 信息完备率
  @autobind
  getInFoPerfectRate() {
    const { targetCustDetail = {} } = this.props;
    return (
      <div className={`${styles.nameTips}`}>
        <h6><span>手机号码：</span>
          <span
            className={classnames({
              [styles.perfectRate]: targetCustDetail.cellPhoneCR === COMPLETION,
              [styles.noPerfectRate]: targetCustDetail.cellPhoneCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(targetCustDetail.cellPhoneCR)}</span>
        </h6>
        <h6><span>联系地址：</span>
          <span
            className={classnames({
              [styles.perfectRate]: targetCustDetail.contactAddressCR === COMPLETION,
              [styles.noPerfectRate]: targetCustDetail.contactAddressCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(targetCustDetail.contactAddressCR)}</span>
        </h6>
        <h6><span>电子邮箱：</span>
          <span
            className={classnames({
              [styles.perfectRate]: targetCustDetail.emailCR === COMPLETION,
              [styles.noPerfectRate]: targetCustDetail.emailCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(targetCustDetail.emailCR)}</span>
        </h6>
        <h6><span>风险偏好：</span>
          <span
            className={classnames({
              [styles.perfectRate]: targetCustDetail.riskPreferenceCR === COMPLETION,
              [styles.noPerfectRate]: targetCustDetail.riskPreferenceCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(targetCustDetail.riskPreferenceCR)}</span>
        </h6>
      </div>
    );
  }

  // 介绍人的信息
  @autobind
  getEmpInfo() {
    const { targetCustDetail = {} } = this.props;
    return (
      <div className={`${styles.nameTips}`}>
        <h6><span>工号：</span><span>{this.handleEmpty(targetCustDetail.empId)}</span></h6>
        <h6><span>联系电话：</span><span>{this.handleEmpty(targetCustDetail.empContactPhone)}</span></h6>
        <h6><span>所在营业部：</span><span>{this.handleEmpty(targetCustDetail.empDepartment)}</span></h6>
      </div>
    );
  }

  handleEmpty(value) {
    if (value && !_.isEmpty(value)) {
      return value;
    }
    return '--';
  }

  // 服务记录查看更多
  @autobind
  handleSeeMore() {
    const param = {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-客户信息',
      forceRefresh: true,
      activeSubTab: ['服务记录'],
      // 服务记录搜索
      serviceRecordKeyword: '',
      // 服务渠道
      serviceRecordChannel: '',
    };
    const { targetCustDetail = {} } = this.props;
    this.openFsp360TabAction({ targetCustDetail, param });
  }

  // 打开360视图
  @autobind
  openFsp360TabAction({ param, targetCustDetail }) {
    const { custNature, custId, rowId, ptyId } = targetCustDetail;
    const type = (!custNature || custNature === PER_CODE) ? PER_CODE : ORG_CODE;
    const url = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}`;
    const pathname = '/customerCenter/fspcustomerDetail';
    console.log('this.context.push: ', this.context.push);
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

  render() {
    const { targetCustDetail = {} } = this.props;
    const {
      assets, openAssets, availablBalance, openedBusiness, openBusiness,
      empName, recentServiceTime, missionType, missionTitle,
    } = targetCustDetail;
    // 佣金率
    let miniFee = '--';
    if (!_.isEmpty(targetCustDetail.commissionRate)) {
      const newCommissionRate = Number(targetCustDetail.commissionRate);
      miniFee = newCommissionRate < 0 ?
        newCommissionRate :
        `${(newCommissionRate * 1000).toFixed(2)}‰`;
    }
    // 归集率
    let hsRate = '--';
    if (!_.isEmpty(targetCustDetail.hsRate)) {
      const newHsRate = Number(targetCustDetail.hsRate);
      hsRate = newHsRate < 0 ?
        Number(newHsRate.toFixed(2)) :
        `${Number((newHsRate * 100).toFixed(2))}%`;
    }
    // 信息完备率
    const infoCompletionRate = targetCustDetail.infoCompletionRate ?
      `${Number(targetCustDetail.infoCompletionRate) * 100}%` : '--';
    return (
      <div className={styles.customerDetail}>
        <div className={styles.container}>
          <div className={styles.item}>
            <div className={styles.itemLabel}>总资产:</div>
            <div className={styles.itemContent}>{handleAssets(assets)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>股基佣金率:</div>
            <div className={styles.itemContent}>{miniFee}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}><p>持仓市值：</p><p>（含信用）</p></div>
            <div className={styles.itemContent}>{handleAssets(openAssets)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>沪深归集率:</div>
            <div className={styles.itemContent}>{hsRate}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>可用余额:</div>
            <div className={styles.itemContent}>{handleAssets(availablBalance)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>信息完备率:</div>
            <div className={styles.itemContent}>
              {infoCompletionRate}
              <TipsInfo
                title={this.getInFoPerfectRate()}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>已开通业务:</div>
            <div className={styles.itemContent}>{this.handleEmpty(openedBusiness)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>可开通业务:</div>
            <div className={styles.itemContent}>{this.handleEmpty(openBusiness)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>介绍人:</div>
            <div className={styles.itemContent}>
              {this.handleEmpty(empName)}
              {!_.isEmpty(empName) && <TipsInfo title={this.getEmpInfo()} />}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.item}>
              <div className={styles.itemLabel}>最近一次服务:</div>
              <div className={styles.itemContent}>
                （{this.handleEmpty(recentServiceTime)}）
                {this.handleEmpty(missionType)} -
                {this.handleEmpty(missionTitle)}
              </div>
            </div>
            <div className={styles.moreButton} onClick={this.handleSeeMore}>查看更多</div>
          </div>
        </div>
      </div>
    );
  }
}
