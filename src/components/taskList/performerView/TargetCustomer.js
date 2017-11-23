/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PureComponent } from 'react';
import { Modal, Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import styles from './targetCustomer.less';
import Icon from '../../common/Icon';

import LabelInfo from './LabelInfo';

export default class TargetCustomer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  @autobind
  showModal() {
    this.setState({
      visible: true,
    });
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

  render() {
    const { visible } = this.state;
    return (
      <div className={styles.targetCustomer}>
        <LabelInfo value="目标客户" />
        <div className={styles.left}>
          表格
        </div>
        <div className={styles.right}>
          <div className={styles.titles}>
            <Row>
              <Col span={12}><h3 className={styles.custNames}>客户名称</h3></Col>
              <Col span={12}>
                <h5 className={styles.custNamesCont}>
                  <span>02004889</span>|<span>男</span>|<span>46岁</span>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <h5 className={styles.phoneLeft}><span>介绍人：</span><span>王华</span><Icon type="info-circle-o" /></h5>
              </Col>
              <Col span={12}>
                <h5 className={styles.phoneLeft}><span>联系电话：</span><span>15357890001</span></h5>
              </Col>
            </Row>
          </div>
          <div className={styles.asset}>
            <Row>
              <Col span={14}>
                <h5 className={styles.peopleTwo}><span>总资产：</span><span>2345.78万元</span><Icon type="info-circle-o" /></h5>
              </Col>
              <Col span={10}>
                <h5 className={styles.peopleThr}><span>股基佣金率额：</span><span>0.34%</span></h5>
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <h5 className={styles.peopleTwo}>
                  <span>持仓资产：</span><span>2345.78万元</span>/<span>99.5%</span>
                </h5>
              </Col>
              <Col span={10}>
                <h5 className={styles.peopleThr}><span>沪深归集率：</span><span>0.34%</span></h5>
              </Col>
            </Row>
            <Row className={styles.lastCol}>
              <Col span={12}>
                <h5 className={styles.peopleTwo}>
                  <span>可用余额：</span><span>2345.78万元</span>/<span>0.5%</span>
                </h5>
              </Col>
            </Row>
          </div>
          <div className={styles.asset}>
            <Row>
              <Col span={12}>
                <h5 className={styles.peopleFour}><span>已开通业务：</span><span>创业板、沪港通、深港通</span></h5>
              </Col>
            </Row>
            <Row className={styles.lastCol}>
              <Col span={12}>
                <h5 className={styles.peopleFour}><span>可开通业务：</span><span>融资融券</span></h5>
              </Col>
            </Row>
          </div>
          <div className={styles.service}>
            <Row>
              <Col span={14}>
                <h5 className={styles.people}>
                  <span>最近服务时间：</span>
                  <span>（2017/11/11）任务类型 - 任务标题</span>
                </h5>
              </Col>
              <Col span={10}>
                <h5 className={styles.people}><a onClick={this.showModal}>查看更多</a></h5>
              </Col>
            </Row>
          </div>
        </div>
        <Modal
          title="Basic Modal"
          visible={visible}
          width={700}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}
