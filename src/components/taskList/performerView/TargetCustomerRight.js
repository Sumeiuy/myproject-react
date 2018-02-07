/**
 * @fileOverview components/customerPool/TargetCustomerRight.js
 * @author zhushengnan
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, Affix } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import contains from 'rc-util/lib/Dom/contains';

import styles from './targetCustomerRight.less';
import { fspContainer } from '../../../config';
import TipsInfo from './TipsInfo';
import Collapse from '../../customerPool/list/CreateCollapse';
import SixMonthEarnings from '../../customerPool/list/SixMonthEarnings';
import { formatAsset } from './formatNum';

// 信息的完备，用于判断
const COMPLETION = '完备';
const NOTCOMPLETION = '不完备';

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
// const ORG_CODE = 'org';
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
  }
  static defaultProps = {
    itemData: {},
    serveWay: {},
    executeTypes: {},
    serviceRecordData: {},
    filesList: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

  @autobind
  showModal() {
    const { itemData = {}, getServiceRecord } = this.props;
    this.setState({
      visible: true,
    });
    getServiceRecord({ custId: itemData.custId }); // 应传 custId
  }

  @autobind
  handleOk() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleCancel() {
    this.setState({
      visible: false,
    });
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

  // 联系电话的浮层信息
  renderPhoneNumTips(itemData = {}) {
    const {
      contactDetail = [],
      custNature = '',
    } = itemData;
    if (_.isEmpty(contactDetail)) {
      return null;
    }
    let content = '';
    if (custNature === PER_CODE) {
      content = (
        <div className={`${styles.nameTips}`}>
          {
            contactDetail.map(obj => (
              <div key={obj.cellPhone}>
                <h6><span>办公电话：</span><span>{this.handleEmpty(obj.officePhone)}</span></h6>
                <h6><span>住宅电话：</span><span>{this.handleEmpty(obj.homePhone)}</span></h6>
                <h6><span>手机号码：</span><span>{this.handleEmpty(obj.cellPhone)}</span></h6>
              </div>
            ))
          }
        </div>
      );
    } else {
      content = (
        <div className={`${styles.nameTips}`}>
          {
            contactDetail.map(obj => (
              <div key={obj.cellPhone}>
                <h5 className={styles.callName}>{this.handleEmpty(obj.name)}</h5>
                <h6><span>办公电话：</span><span>{this.handleEmpty(obj.officePhone)}</span></h6>
                <h6><span>住宅电话：</span><span>{this.handleEmpty(obj.homePhone)}</span></h6>
                <h6><span>手机号码：</span><span>{this.handleEmpty(obj.cellPhone)}</span></h6>
              </div>
            ))
          }
        </div>
      );
    }
    return (<TipsInfo
      title={content}
    />);
  }

  render() {
    const {
      isFold,
      itemData,
      handleCollapseClick,
      executeTypes,
      serveWay,
      serviceRecordData,
      getCustIncome,
      monthlyProfits,
      custIncomeReqState,
      getCeFileList,
      filesList,
    } = this.props;
    const { visible } = this.state;
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
    // 总资产不为0时进行计算
    // 持仓金额不为null或0时，持仓金额占余额的百分比openAssetsPercentNode，否则不展示百分比
    // 可用余额不为null或0时，可用余额占余额的百分比availablBalancePercentNode，否则不展示百分比
    let openAssetsPercentNode = '';
    let availablBalancePercentNode = '';
    if (Number(itemData.assets)) {
      const openAssetsRate = itemData.openAssets / itemData.assets;
      openAssetsPercentNode = itemData.openAssets ?
        <span>({openAssetsRate * 100}%)</span>
        :
        null;
      availablBalancePercentNode = itemData.availablBalance ?
        <span>({(1 - openAssetsRate) * 100}%)</span>
        :
        null;
    }
    // 信息完备率
    const infoCompletionRate = itemData.infoCompletionRate ?
      `${Number(itemData.infoCompletionRate) * 100}%` : '--';
    return (
      <div className={styles.box} ref={ref => this.container = ref}>
        <Affix target={() => getStickyTarget(this.container)}>
          <div className={styles.titles}>
            <Row>
              <Col span={7}>
                <h3 className={styles.custNames} title={itemData.custName}>
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
              <Col span={12}>
                <h5
                  className={styles.phoneLeft}
                >
                  <span>介绍人：</span><span>{this.handleEmpty(itemData.empName)}</span>
                  {
                    _.isEmpty(itemData.empName) ?
                      null :
                      <TipsInfo
                        title={suspendedLayer}
                      />
                  }
                </h5>
              </Col>
              {
                itemData.contactPhone ?
                  <Col span={12}>
                    <h5
                      className={styles.phoneRight}
                    >
                      <span>联系电话：</span><span>{this.handleEmpty(itemData.contactPhone)}</span>
                      {this.renderPhoneNumTips(itemData)}
                    </h5>
                  </Col> : null
              }
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
                  <span>总资产：</span><span>{this.handleAssets(itemData.assets)}</span>
                  {_.isEmpty(itemData.assets) ?
                    null :
                    <span className={styles.wordTips}>
                      <SixMonthEarnings
                        listItem={itemData}
                        monthlyProfits={monthlyProfits}
                        custIncomeReqState={custIncomeReqState}
                        getCustIncome={getCustIncome}
                        formatAsset={formatAsset}
                        displayText="峰值和最近收益"
                      />
                    </span>
                  }
                </h5>
              </Col>
              <Col span={thrSpan}>
                <h5
                  className={classnames({
                    [styles.peopleThr]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                ><span>股基佣金率额：</span><span>{miniFee}</span></h5>
              </Col>
            </Row>
            <Row>
              <Col span={sendSpan}>
                <h5
                  className={classnames({
                    [styles.peopleTwo]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <span>持仓资产：</span>
                  <span>{this.handleAssets(itemData.openAssets)}</span>
                  {openAssetsPercentNode}
                </h5>
              </Col>
              <Col span={thrSpan}>
                <h5
                  className={classnames({
                    [styles.peopleThr]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                ><span>沪深归集率：</span><span>{hsRate}</span></h5>
              </Col>
            </Row>
            <Row className={styles.lastCol}>
              <Col span={sendSpan}>
                <h5
                  className={classnames({
                    [styles.peopleTwo]: isFold === true,
                    [styles.people]: isFold === false,
                  })}
                >
                  <span>可用余额：</span>
                  <span>{this.handleAssets(itemData.availablBalance)}</span>
                  {availablBalancePercentNode}
                </h5>
              </Col>
              <Col span={thrSpan}>
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
            <Row>
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
                  <span className={styles.fl}>最近服务时间：</span>
                  <span className={`${styles.ml105} ${styles.block}`}>（{this.handleEmpty(itemData.recentServiceTime)}）
                    {this.handleEmpty(itemData.missionType)} -
                    {this.handleEmpty(itemData.missionTitle)}</span>
                </h5>
              </Col>
              <Col span={isFold ? 10 : 24}>
                <h5 className={styles.seeMore}><a onClick={this.showModal}>查看更多</a></h5>
              </Col>
            </Row>
          </div>
        </div>
        <Modal
          title="最近服务记录"
          visible={visible}
          width={900}
          mask={false}
          footer={null}
          maskClosable={false}
          onCancel={this.handleCancel}
          className={styles.moreServices}
        >
          <Collapse
            data={serviceRecordData[itemData.custId]}
            executeTypes={executeTypes}
            serveWay={serveWay}
            handleCollapseClick={handleCollapseClick}
            getCeFileList={getCeFileList}
            filesList={filesList}
          />
        </Modal>
      </div>
    );
  }
}
