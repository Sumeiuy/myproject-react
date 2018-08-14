/*
 * @Description: 客户详情
 * @Author: WangJunjun
 * @Date: 2018-05-27 15:30:06
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-09 10:42:44
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import store from 'store';
import TipsInfo from './TipsInfo';
import { formatAsset } from './formatNum';
import { COMPLETION, NOTCOMPLETION, PER_CODE, ORG_CODE } from './config';
import { openFspTab } from '../../../../utils';
import logable from '../../../../decorators/logable';
import SixMonthEarnings from '../../../customerPool/list/SixMonthEarnings';
import TextCollapse from './TextCollapse';
import styles from './customerDetail.less';


// 展开收起按钮的样式
const buttonStyle = {
  bottom: '5px',
};

// 根据资产的值返回对应的格式化值和单位串起来的字符串
const getFormatedAsset = (value) => {
  let newValue = '0';
  let unit = '元';
  if (!_.isEmpty(value)) {
    const obj = formatAsset(value);
    newValue = obj.value;
    unit = obj.unit;
  }
  return `${newValue}${unit}`;
};

// 引导第一步关联的真实DOM的
const INTRO_FIRSTSTEP = 'introFirstStep';

// 存储在本地用哪个来判断是否在执行者视图中第一次使用'展开收起'
const FIRSTUSECOLLAPSE_PERFORMERVIEW = 'GUIDE_FIRSTUSECOLLAOSE_PERFORMERVIEW';

export default class CustomerDetail extends PureComponent {
  static propTypes = {
    targetCustDetail: PropTypes.object.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    isCustIncomeRequested: PropTypes.bool,
    currentId: PropTypes.string,
    leftFoldState: PropTypes.string,
  }

  static defaultProps = {
    isCustIncomeRequested: false,
    currentId: '',
    leftFoldState: '',
  }

  static contextTypes = {
    push: PropTypes.func,
  }

  componentDidMount() {
    // 第一次在执行者试图使用'展开收起'功能,则启用引导功能
    if (!this.isFirstUseCollapse()) {
      // 解决展开折叠功能对引导功能的定位的影响
      setTimeout(this.intialGuide, 0);
      store.set(FIRSTUSECOLLAPSE_PERFORMERVIEW, 'NO');
    }
  }

  // 判断是否在执行者视图中使用'展开收起'功能
  isFirstUseCollapse() {
    return store.get(FIRSTUSECOLLAPSE_PERFORMERVIEW);
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
        <h6>
          <span>工号：</span>
          <span>{this.handleEmpty(targetCustDetail.empId)}</span>
        </h6>
        <h6>
          <span>联系电话：</span>
          <span>{this.handleEmpty(targetCustDetail.empContactPhone)}</span>
        </h6>
        <h6>
          <span>所在营业部：</span>
          <span>{this.handleEmpty(targetCustDetail.empDepartment)}</span>
        </h6>
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
  @logable({
    type: 'Click',
    payload: {
      name: '查看更多服务记录',
    },
  })
  openFsp360TabAction({ param, targetCustDetail }) {
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

  // 引导功能初始化
  intialGuide() {
    introJs().setOptions({
      showBullets: false,
      showProgress: false,
      overlayOpacity: 0,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      tooltipClass: styles.introTooltip,
      highlightClass: styles.highlightClass,
      doneLabel: '×',
    }).addStep({
      element: document.querySelector(`#${INTRO_FIRSTSTEP}`),
      intro: '点击展开可以查看介绍人、客户业务办理情况等信息。',
      position: 'top',
    }).start();
  }

  render() {
    const {
      targetCustDetail = {}, getCustIncome, monthlyProfits,
      isCustIncomeRequested, currentId, leftFoldState,
    } = this.props;
    const {
      assets, openAssets, availablBalance, openedBusiness, openBusiness,
      empName, recentServiceTime, missionType, missionTitle, missionFlowId, custId,
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
          <TextCollapse
            key={`${custId}${currentId}${missionFlowId}${leftFoldState}`}
            minHeight="58px"
            buttonStyle={buttonStyle}
            buttonId={INTRO_FIRSTSTEP}
          >
            <div className={styles.flexBox}>
              <div className={styles.item}>
                <div className={styles.itemLabel}>总资产:</div>
                <div className={styles.itemContent}>
                  {getFormatedAsset(assets)}
                  {!_.isEmpty(assets) ?
                    <div className={styles.wordTips}>
                      <SixMonthEarnings
                        listItem={targetCustDetail}
                        monthlyProfits={monthlyProfits}
                        custIncomeReqState={isCustIncomeRequested}
                        getCustIncome={getCustIncome}
                        formatAsset={formatAsset}
                        displayText="峰值和最近收益"
                      />
                    </div> : null
                  }
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemLabel}>股基佣金率:</div>
                <div className={styles.itemContent}>{miniFee}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemLabel}>持仓市值:</div>
                <div className={styles.itemContent}>{getFormatedAsset(openAssets)}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemLabel}>沪深归集率:</div>
                <div className={styles.itemContent}>{hsRate}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemLabel}>可用余额:</div>
                <div className={styles.itemContent}>{getFormatedAsset(availablBalance)}</div>
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
            </div>
            <div className={styles.row}>
              <div className={styles.moreButton} onClick={this.handleSeeMore}>查看更多服务记录</div>
            </div>
          </TextCollapse>
        </div>
      </div>
    );
  }
}
