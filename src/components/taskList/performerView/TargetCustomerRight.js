/**
 * @fileOverview components/customerPool/TargetCustomerRight.js
 * @author zhushengnan
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Affix } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import contains from 'rc-util/lib/Dom/contains';

import styles from './targetCustomerRight.less';
import { fspContainer } from '../../../config';
import { openFspTab } from '../../../utils';
import TipsInfo from './TipsInfo';
import SixMonthEarnings from '../../customerPool/list/SixMonthEarnings';
import { formatAsset } from './formatNum';
import logable from '../../../decorators/logable';
// import Phone from '../../common/phone';
import Icon from '../../common/Icon';
import { date } from '../../../helper';
import ContactInfoPopover from '../../common/contactInfoPopover/ContactInfoPopover';
import Mask from '../../common/mask';

// 信息的完备，用于判断
const COMPLETION = '完备';
const NOTCOMPLETION = '不完备';

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';

const PHONE = 'phone';

// 产品机构对应的code码
// const PROD_CODE = 'prod';

// 这个是防止页面里有多个class重复，所以做个判断，必须包含当前节点
// 如果找不到无脑取第一个就行
const getStickyTarget = (currentNode) => {
  const containers = document.querySelectorAll('.sticky-container');
  return (currentNode && _.find(
    containers,
    element => contains(element, currentNode),
  )) || containers[0];
};
// 任务状态为未处理、处理中、已驳回时可打电话
const CALLABLE_LIST = ['10', '20', '60'];

export default class TargetCustomerRight extends PureComponent {
  static propTypes = {
    isFold: PropTypes.bool.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    itemData: PropTypes.object,
    serveWay: PropTypes.array,
    executeTypes: PropTypes.array,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    addServeRecord: PropTypes.func.isRequired,
    motCustfeedBackDict: PropTypes.array.isRequired,
    currentMissionFlowId: PropTypes.string.isRequired,
    currentId: PropTypes.string.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    currentCustomer: PropTypes.object.isRequired,
    taskTypeCode: PropTypes.string.isRequired,
    currentMotServiceRecord: PropTypes.object.isRequired,
  }
  static defaultProps = {
    itemData: {},
    serveWay: {},
    executeTypes: {},
    serviceRecordData: {},
    filesList: [],
  };

  static contextTypes = {
    push: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.endTime = '';
    this.startTime = '';
    this.state = { showMask: false };
  }

  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

  /**
   * 获取tab的配置
   * @param {*string} id tab的id
   * @param {*string} title tab的标题
   * @param {*array} activeSubTab 子级tab
   * @param {*boolean} forceRefresh 是否需要强制刷新
   */
  @autobind
  get360FspTabConfig(activeSubTab = []) {
    return {
      id: 'FSP_360VIEW_M_TAB',
      title: '客户360视图-客户信息',
      forceRefresh: true,
      activeSubTab,
      // 服务记录搜索
      serviceRecordKeyword: '',
      // 服务渠道
      serviceRecordChannel: '',
    };
  }

  @autobind
  openFsp360TabAction({ param, itemData }) {
    const { custNature, custId, rowId, ptyId } = itemData;
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

  @autobind
  @logable({ type: 'Click', payload: { name: '查看更多' } })
  handleSeeMoreClick(itemData) {
    const param = this.get360FspTabConfig(['服务记录']);
    this.openFsp360TabAction({ itemData, param });
  }

  handleEmpty(value) {
    if (value && !_.isEmpty(value)) {
      return value;
    }
    return '--';
  }

  // 根据资产的值返回对应的格式化值和单位串起来的字符串
  handleAssets(value) {
    let newValue = '0';
    let unit = '元';
    if (!_.isEmpty(value)) {
      const obj = formatAsset(value);
      newValue = obj.value;
      unit = obj.unit;
    }
    return `${newValue}${unit}`;
  }

  /**
   * 跳转到客户360
   * @param {*object} itemData 每一个客户的数据
   */
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '客户名',
      value: '$args[0].custName',
    },
  })
  handleCustNameClick(itemData) {
    const param = this.get360FspTabConfig();
    this.openFsp360TabAction({ itemData, param });
  }

  /**
   * 通话结束后要创建一条服务记录，并弹出服务记录框
   */
  @autobind
  handlePhoneEnd() {
    // 点击挂电话隐藏蒙层
    this.setState({ showMask: false });
    // 没有成功发起通话
    if (!moment.isMoment(this.startTime)) {
      return;
    }
    this.endTime = moment();
    const {
      itemData,
      addServeRecord,
      motCustfeedBackDict,
      currentMissionFlowId,
      currentId,
      toggleServiceRecordModal,
      taskTypeCode,
    } = this.props;
    const {
      custId,
      custName,
    } = itemData;
    const [firstServiceType = {}] = motCustfeedBackDict;
    const { key: firstServiceTypeKey, children = [] } = firstServiceType;
    const [firstFeedback = {}] = children;
    const phoneDuration = date.calculateDuration(
      this.startTime.valueOf(),
      this.endTime.valueOf(),
    );
    const serviceContentDesc = `${this.startTime.format('HH:mm:ss')}给客户发起语音通话，时长${phoneDuration}。`;
    let payload = {
      // 任务流水id
      missionFlowId: currentMissionFlowId,
      // 任务id
      missionId: currentId,
      // 经济客户号
      custId,
      // 服务方式
      serveWay: 'HTSC Phone',
      // 任务类型，1：MOT  2：自建
      taskType: `${+taskTypeCode + 1}`,
      // 服务状态
      flowStatus: '30',
      // 同serveType
      type: firstServiceTypeKey,
      // 服务类型，即任务类型
      serveType: firstServiceTypeKey,
      // 客户反馈一级
      serveCustFeedBack: firstFeedback.key,
      // 服务记录内容
      serveContentDesc: serviceContentDesc,
      // 服务时间
      serveTime: this.endTime.format('YYYY-MM-DD HH:mm'),
      // 反馈时间
      feedBackTime: moment().format('YYYY-MM-DD'),
    };
    // 客户反馈的二级
    if (firstFeedback.children) {
      payload = {
        ...payload,
        serveCustFeedBack2: firstFeedback.children[0].key,
      };
    }
    // 添加服务记录表单共用，把打电话自动生成的默认数据保存到prevRecordInfo
    const saveRecordData = () => {
      toggleServiceRecordModal({
        id: currentMissionFlowId,
        name: custName,
        flag: false,
        caller: PHONE,
        autoGenerateRecordInfo: payload,
      });
    };
    addServeRecord({
      postBody: payload,
      callbackOfPhone: saveRecordData,
      noHint: true,
      callId: this.callId,
    });
  }

  // 通话开始
  @autobind
  handlePhoneConnected(data) {
    this.startTime = moment();
    this.callId = data.uuid;
  }

  // 点击号码打电话时显示蒙层
  @autobind
  handlePhoneClick() {
    this.setState({ showMask: true });
  }

  /**
   * 联系方式渲染
   */
  @autobind
  renderContactInfo() {
    const { itemData, currentCustomer } = this.props;
    const { custNature, perCustomerContactInfo, orgCustomerContactInfoList, custName } = itemData;
    // 任务状态为未处理、处理中、已驳回时可打电话
    const canCall = _.includes(CALLABLE_LIST, currentCustomer.missionStatusCode);
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
      <Col span={16}>
        <ContactInfoPopover
          custType={custNature}
          name={encodeURIComponent(custName)}
          personalContactInfo={perContactInfo}
          orgCustomerContactInfoList={orgCustomerContactInfoList}
          handlePhoneEnd={this.handlePhoneEnd}
          handlePhoneConnected={this.handlePhoneConnected}
          handlePhoneClick={this.handlePhoneClick}
          disablePhone={!canCall}
          placement={'topRight'}
          getPopupContainer={() => this.container}
        >
          <div className={styles.phoneRight}>
            <Icon type="lianxifangshi1" className={styles.phoneRightIcon} />
            <span className={styles.phoneRightText}>联系方式</span>
          </div>
        </ContactInfoPopover>
      </Col>
    );
  }

  render() {
    const {
      isFold,
      itemData,
      getCustIncome,
      monthlyProfits,
      custIncomeReqState,
    } = this.props;

    const { showMask } = this.state;

    const sendSpan = isFold ? 15 : 24;
    const thrSpan = isFold ? 9 : 24;
    const suspendedLayer = (
      <div className={`${styles.nameTips}`}>
        <h6><span>工号：</span><span>{this.handleEmpty(itemData.empId)}</span></h6>
        <h6><span>联系电话：</span><span>{this.handleEmpty(itemData.empContactPhone)}</span></h6>
        <h6><span>所在营业部：</span><span>{this.handleEmpty(itemData.empDepartment)}</span></h6>
      </div>
    );
    const inFoPerfectRate = (
      <div className={`${styles.nameTips}`}>
        <h6><span>手机号码：</span>
          <span
            className={classnames({
              [styles.perfectRate]: itemData.cellPhoneCR === COMPLETION,
              [styles.noPerfectRate]: itemData.cellPhoneCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(itemData.cellPhoneCR)}</span>
        </h6>
        <h6><span>联系地址：</span>
          <span
            className={classnames({
              [styles.perfectRate]: itemData.contactAddressCR === COMPLETION,
              [styles.noPerfectRate]: itemData.contactAddressCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(itemData.contactAddressCR)}</span>
        </h6>
        <h6><span>电子邮箱：</span>
          <span
            className={classnames({
              [styles.perfectRate]: itemData.emailCR === COMPLETION,
              [styles.noPerfectRate]: itemData.emailCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(itemData.emailCR)}</span>
        </h6>
        <h6><span>风险偏好：</span>
          <span
            className={classnames({
              [styles.perfectRate]: itemData.riskPreferenceCR === COMPLETION,
              [styles.noPerfectRate]: itemData.riskPreferenceCR === NOTCOMPLETION,
            })}
          >{this.handleEmpty(itemData.riskPreferenceCR)}</span>
        </h6>
      </div>
    );
    // 佣金率
    let miniFee = '--';
    if (!_.isEmpty(itemData.commissionRate)) {
      const commissionRate = Number(itemData.commissionRate);
      miniFee = commissionRate < 0 ?
        commissionRate :
        `${(commissionRate * 1000).toFixed(2)}‰`;
    }
    // 归集率
    let hsRate = '--';
    if (!_.isEmpty(itemData.hsRate)) {
      const newHsRate = Number(itemData.hsRate);
      hsRate = newHsRate < 0 ?
        Number(newHsRate.toFixed(2)) :
        `${Number((newHsRate * 100).toFixed(2))}%`;
    }
    // 信息完备率
    const infoCompletionRate = itemData.infoCompletionRate ?
      `${Number(itemData.infoCompletionRate) * 100}%` : '--';
    const introducerName = this.handleEmpty(itemData.empName);
    return (
      <div className={styles.box} ref={ref => this.container = ref}>
        <Affix target={() => getStickyTarget(this.container)}>
          <div className={styles.titles}>
            <Row>
              <Col span={7}>
                <h3
                  className={styles.custNames}
                  title={itemData.custName}
                  onClick={() => this.handleCustNameClick(itemData)}
                >
                  {itemData.custName}
                </h3>
              </Col>
              <Col span={17}>
                {
                  itemData.custNature === 'per' ?
                    <h5 className={styles.custNamesCont}>
                      <span>{this.handleEmpty(itemData.custId)}</span>|
                      <span>{this.handleEmpty(itemData.genderValue)}</span>|
                      <span>{this.handleEmpty(String(itemData.age))}岁</span>
                    </h5>
                    :
                    <h5 className={styles.custNamesCont}>
                      <span>{this.handleEmpty(itemData.custId)}</span>
                    </h5>
                }
              </Col>
            </Row>
            <Row className={styles.mt3}>
              <Col span={8}>
                <h5
                  className={styles.phoneLeft}
                >
                  <span>介绍人：</span>
                  <span title={introducerName}>
                    {introducerName}
                  </span>
                  {
                    _.isEmpty(itemData.empName) ?
                      null :
                      <TipsInfo
                        title={suspendedLayer}
                      />
                  }
                </h5>
              </Col>
              {this.renderContactInfo()}
            </Row>
          </div>
        </Affix>
        <div className={styles.description}>
          <div className={styles.asset}>
            <Row>
              <Col span={sendSpan}>
                <h5
                  className={classnames({
                    [styles.peopleTwo]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <div className={styles.title}>
                    <div>总资产：</div>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.value}>{this.handleAssets(itemData.assets)}</div>
                    {!_.isEmpty(itemData.assets) ?
                      <div className={styles.wordTips}>
                        <SixMonthEarnings
                          listItem={itemData}
                          monthlyProfits={monthlyProfits}
                          custIncomeReqState={custIncomeReqState}
                          getCustIncome={getCustIncome}
                          formatAsset={formatAsset}
                          displayText="峰值和最近收益"
                        />
                      </div> : null
                    }
                  </div>
                </h5>
                <h5
                  className={classnames({
                    [styles.peopleTwo]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <div className={styles.openAssets}>
                    <div className={styles.left}>持仓市值：</div>
                    <div className={styles.right}>
                      （含信用）
                    </div>
                  </div>
                  <div className={styles.content}>
                    {this.handleAssets(itemData.openAssets)}
                  </div>
                </h5>
                <h5
                  className={classnames({
                    [styles.peopleTwo]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <span>可用余额：</span>
                  <span>{this.handleAssets(itemData.availablBalance)}</span>
                </h5>
              </Col>
              <Col span={thrSpan}>
                <h5
                  className={classnames({
                    [styles.peopleThr]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <span>股基佣金率：</span>
                  <span>{miniFee}</span>
                </h5>
                <h5
                  className={classnames({
                    [styles.peopleThr]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <span>沪深归集率：</span>
                  <span>{hsRate}</span>
                </h5>
                <h5
                  className={classnames({
                    [styles.peopleThr]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <span>信息完备率：</span><span>{infoCompletionRate}</span>
                  <TipsInfo
                    title={inFoPerfectRate}
                  />
                </h5>
              </Col>
            </Row>
          </div>
          <div className={styles.asset}>
            <Row className={styles.borderTop}>
              <Col span={24}>
                <h5
                  className={classnames({
                    [styles.peopleFour]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                ><span>已开通业务：</span><span>{this.handleEmpty(itemData.openedBusiness)}</span></h5>
              </Col>
            </Row>
            <Row className={styles.lastCol}>
              <Col span={24}>
                <h5
                  className={classnames({
                    [styles.peopleFour]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                ><span>可开通业务：</span><span>{this.handleEmpty(itemData.openBusiness)}</span></h5>
              </Col>
            </Row>
          </div>
          <div className={styles.service}>
            <Row>
              <Col span={isFold ? 14 : 24}>
                <h5 className={styles.people}>
                  <span className={styles.fl}>最近一次服务：</span>
                  <span className={`${styles.ml105} ${styles.block}`}>（{this.handleEmpty(itemData.recentServiceTime)}）
                    {this.handleEmpty(itemData.missionType)} -
                    {this.handleEmpty(itemData.missionTitle)}</span>
                </h5>
              </Col>
              <Col span={isFold ? 10 : 24}>
                <h5 className={styles.seeMore}>
                  <a onClick={() => this.handleSeeMoreClick(itemData)}> 查看更多</a>
                </h5>
              </Col>
            </Row>
          </div>
        </div>
        <Mask visible={showMask} />
      </div>
    );
  }
}
