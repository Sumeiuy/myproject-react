/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Modal, Row, Col, Select } from 'antd';

import Icon from '../../common/Icon';

import styles from './createServiceRecord.less';

const { Option } = Select;

export default class CreateServiceRecord extends PureComponent {

  static propTypes = {
    isShow: PropTypes.bool,
    empInfo: PropTypes.object.isRequired,
    hideCreateServiceRecord: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isShow: false,
  }

  @autobind
  handleSubmit() {

  }

  @autobind
  handleCancel() {
    const { hideCreateServiceRecord } = this.props;
    hideCreateServiceRecord();
  }

  @autobind
  handleChange() {

  }


  render() {
    const {
      isShow,
      empInfo,
    } = this.props;
    const title = (
      <p className={styles.title}>
        创建服务记录:
        <span>&nbsp;{empInfo.empName}/{empInfo.empNum}</span>
      </p>
    );
    return (
      <Modal
        zIndex={3}
        width={688}
        className={styles.serviceRecord}
        title={title}
        visible={isShow}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText="提交"
        cancelText="取消"
      >
        <p>请选择一项服务方式</p>
        <Row className={styles.serviceWay} type="flex" justify="space-between">
          <Col className="serviceWayItem active">
            <span><Icon type="dianhua" /></span>
            <p>电话</p>
          </Col>
          <Col className="serviceWayItem">
            <span><Icon type="youjian" /></span>
            <p>邮件</p>
          </Col>
          <Col className="serviceWayItem">
            <span><Icon type="duanxin" /></span>
            <p>短信</p>
          </Col>
          <Col className="serviceWayItem">
            <span><Icon type="weixin" /></span>
            <p>微信</p>
          </Col>
          <Col className="serviceWayItem">
            <span><Icon type="beizi" /></span>
            <p>面谈</p>
          </Col>
          <Col className="serviceWayItem">
            <span><Icon type="other" /></span>
            <p>其他</p>
          </Col>
        </Row>
        <Row className={styles.serviceTypeAndTime} type="flex" justify="space-between">
          <Col>
            <span className="label">服务类型</span>
            <Select defaultValue="lucy" style={{ width: 192 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>Disabled</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          <Col>
            <span className="label">服务时间</span>
          </Col>
        </Row>
      </Modal>
    );
  }
}
