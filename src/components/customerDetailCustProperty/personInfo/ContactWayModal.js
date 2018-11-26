/*
 * @Author: sunweibin
 * @Date: 2018-11-26 13:58:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-26 16:42:33
 * @description 联系方式弹框-个人客户联系方式修改
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Switch } from 'antd';
import _ from 'lodash';

import Table from '../../common/table';
import IFNoData from '../common/IfNoData';
import logable from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import {
  PHONE_COLUMNS,
} from './config';

import styles from './contactWayModal.less';

export default class ContactWayModal extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 关闭弹窗
    onClose: PropTypes.func.isRequired,
    // 个人客户联系方式数据
    data: PropTypes.object.isRequired,
    // 查询个人客户联系方式数据的接口
    queryPersonalContactWay: PropTypes.func.isRequired,
    // 改变个人客户联系方式中的请勿发短信、请勿打电话
    changePhoneInfo: PropTypes.func.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    const { prevProps } = prevState;
    if (data !== prevProps) {
      return {
        prevProps: data,
        noMessage: _.get(data, 'noMessage'),
        noCall: _.get(data, 'noCall'),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      prevProps: props,
      // 请勿发短信
      noMessage: false,
      // 请勿打电话
      noCall: false,
    };
  }

  @autobind
  changeSwitch() {
    const {
      location: {
        query: { custId },
      }
    } = this.props;
    const { noMessage, noCall } = this.state;
    this.props.changePhoneInfo({
      noMessage,
      noCall,
      custId,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '请勿发短信',
      value: '$args[0]'
    },
  })
  handleNoMessageSwitchChange(noMessage) {
    this.setState({ noMessage }, this.changeSwitch);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '请勿打电话',
      value: '$args[0]'
    },
  })
  handleNocallSwitchChange(noCall) {
    this.setState({ noCall }, this.changeSwitch);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' }
  })
  handleContactWayClose() {
    this.props.onClose();
  }

  render() {
    const { data } = this.props;
    const { noMessage, noCall } = this.state;
    // 有无电话信息数据
    const hasNoPhoneInfo = _.isEmpty(data.tellphoneInfo);

    return (
      <Modal
        visible
        modalKey="personalContactWayModal"
        size="large"
        title="联系方式"
        needBtn={false}
        closeModal={this.handleContactWayClose}
      >
        <div className={styles.contactWayWrap}>
          <div className={styles.addContactWay}>
            <Button type="primary" icon="plus">添加联系方式</Button>
          </div>
          <div className={styles.block}>
            <div className={styles.header}>电话信息</div>
            <div className={styles.switchArea}>
              <span className={styles.switchBox}>
                请勿发短信
                <Switch
                  className={styles.switch}
                  checked={noMessage}
                  size="small"
                  onChange={this.handleNoMessageSwitchChange}
                />
              </span>
              <span className={styles.switchBox}>
                请勿打电话
                <Switch
                  className={styles.switch}
                  checked={noCall}
                  size="small"
                  onChange={this.handleNocallSwitchChange}
                />
              </span>
            </div>
            <div className={styles.tableInfo}>
              <IFNoData title="地址信息" isRender={hasNoPhoneInfo}>
                <Table
                  columns={PHONE_COLUMNS}
                  pagination={false}
                  dataSource={data.tellphoneInfo}
                />
              </IFNoData>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.header}>地址信息</div>
          </div>
          <div className={styles.block}>
            <div className={styles.header}>其他信息</div>
          </div>
        </div>
      </Modal>
    );
  }
}
