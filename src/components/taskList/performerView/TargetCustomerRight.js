/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Modal } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './targetCustomerRight.less';
import { fspContainer } from '../../../config';
import TipsInfo from './TipsInfo';
import Collapse from '../../customerPool/list/CreateCollapse';

export default class TargetCustomerRight extends PureComponent {
  static propTypes = {
    isFold: PropTypes.bool.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    itemData: PropTypes.object,
    serveWay: PropTypes.array,
    executeTypes: PropTypes.array,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
  }
  static defaultProps = {
    itemData: {},
    serveWay: {},
    executeTypes: {},
    serviceRecordData: {},
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
    const { getServiceRecord } = this.props;
    this.setState({
      visible: true,
    });
    getServiceRecord({}); // 应传 custId
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
    const cont = '--';
    if (_.isEmpty(value)) {
      return cont;
    }
    return value;
  }


  render() {
    const {
      isFold,
      itemData,
      handleCollapseClick,
      executeTypes,
      serveWay,
      serviceRecordData,
    } = this.props;
    const { visible } = this.state;

    const firSpan = isFold ? 12 : 24;
    const sendSpan = isFold ? 16 : 24;
    const thrSpan = isFold ? 8 : 24;
    console.log(firSpan);

    const suspendedLayer = (
      <div className={`${styles.nameTips}`}>
        <h6><span>工号：</span><span>{this.handleEmpty(itemData.empId)}</span></h6>
        <h6><span>联系电话：</span><span>{this.handleEmpty(itemData.empContactPhone)}</span></h6>
        <h6><span>所在营业部：</span><span>{this.handleEmpty(itemData.empDepartment)}</span></h6>
      </div>
    );
    const phoneNum = (
      <div className={`${styles.nameTips}`}>
        <h6><span>办公电话：</span><span>{this.handleEmpty(itemData.officePhone)}</span></h6>
        <h6><span>住宅电话电话：</span><span>{this.handleEmpty(itemData.homePhone)}</span></h6>
        <h6><span>手机号码：</span><span>{this.handleEmpty(itemData.cellPhone)}</span></h6>
      </div>
    );
    const inFoPerfectRate = (
      <div className={`${styles.nameTips}`}>
        <h6><span>手机号码：</span><span>不完善</span></h6>
        <h6><span>联系地址：</span><span>完善</span></h6>
        <h6><span>电子邮箱：</span><span>完善</span></h6>
        <h6><span>风险偏好：</span><span>完善</span></h6>
      </div>
    );
    return (
      <div className={styles.box}>
        <div className={styles.titles}>
          <Row>
            <Col span={12}><h3 className={styles.custNames}>客户名称</h3></Col>
            <Col span={12}>
              <h5 className={styles.custNamesCont}>
                <span>{this.handleEmpty(itemData.custId)}</span>|
                <span>{this.handleEmpty(itemData.genderValue)}</span>|
                <span>{this.handleEmpty(itemData.age)}岁</span>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col span={firSpan}>
              <h5
                className={classnames({
                  [styles.phoneLeft]: isFold === true,
                  [styles.phone]: isFold === false,
                })}
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
            <Col span={firSpan}>
              <h5
                className={classnames({
                  [styles.phoneRight]: isFold === true,
                  [styles.phone]: isFold === false,
                })}
              >
                <span>联系电话：</span><span>{this.handleEmpty(itemData.contactPhone)}</span>
                {
                  _.isEmpty(itemData.contactPhone) ?
                    null :
                    <TipsInfo
                      title={phoneNum}
                    />
                }
              </h5>
            </Col>
          </Row>
        </div>
        <div className={styles.asset}>
          <Row>
            <Col span={sendSpan}>
              <h5
                className={classnames({
                  [styles.peopleTwo]: isFold === true,
                  [styles.people]: isFold === false,
                })}
              >
                <span>总资产：</span><span>{this.handleEmpty(itemData.assets)}万元</span>
                <span className={styles.wordTips}>峰值和最近收益</span>
              </h5>
            </Col>
            <Col span={thrSpan}>
              <h5
                className={classnames({
                  [styles.peopleThr]: isFold === true,
                  [styles.people]: isFold === false,
                })}
              ><span>股基佣金率额：</span><span>{this.handleEmpty(itemData.commissionRate)}%</span></h5>
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
                <span>{this.handleEmpty(itemData.openAssets)}万元</span>
                <em className={styles.emStyle}>/</em><span>99.5%</span>
              </h5>
            </Col>
            <Col span={thrSpan}>
              <h5
                className={classnames({
                  [styles.peopleThr]: isFold === true,
                  [styles.people]: isFold === false,
                })}
              ><span>沪深归集率：</span><span>{this.handleEmpty(itemData.hsRate)}%</span></h5>
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
                <span>{this.handleEmpty(itemData.availablBalance)}万元</span>
                <em className={styles.emStyle}>/</em><span>0.5%</span>
              </h5>
            </Col>
            <Col span={thrSpan}>
              <h5
                className={classnames({
                  [styles.peopleThr]: isFold === true,
                  [styles.people]: isFold === false,
                })}
              >
                <span>信息完备率：</span><span>75%</span>
                <TipsInfo
                  title={inFoPerfectRate}
                />
              </h5>
            </Col>
          </Row>
        </div>
        <div className={styles.asset}>
          <Row>
            <Col span={12}>
              <h5
                className={classnames({
                  [styles.peopleFour]: isFold === true,
                  [styles.people]: isFold === false,
                })}
              ><span>已开通业务：</span><span>{this.handleEmpty(itemData.openedBusiness)}</span></h5>
            </Col>
          </Row>
          <Row className={styles.lastCol}>
            <Col span={12}>
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
            <Col span={14}>
              <h5 className={styles.people}>
                <span>最近服务时间：</span>
                <span>（{this.handleEmpty(itemData.recentServiceTime)}）
                  {this.handleEmpty(itemData.missionTitle)} -
                   {this.handleEmpty(itemData.missionTitle)}</span>
              </h5>
            </Col>
            <Col span={10}>
              <h5 className={styles.seeMore}><a onClick={this.showModal}>查看更多</a></h5>
            </Col>
          </Row>
        </div>
        <Modal
          title="最近服务记录"
          visible={visible}
          width={700}
          mask={false}
          footer={null}
          maskClosable={false}
          onCancel={this.handleCancel}
        >
          <Collapse
            data={serviceRecordData}
            executeTypes={executeTypes}
            serveWay={serveWay}
            handleCollapseClick={handleCollapseClick}
          />
        </Modal>
      </div>
    );
  }
}
