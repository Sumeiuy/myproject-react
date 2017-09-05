/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';

import styles from './createServiceRecord.less';

export default class CreateServiceRecord extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  @autobind
  handleSubmit() {

  }

  @autobind
  handleCancel() {

  }


  render() {
    return (
      <Modal
        title={<p className={styles.title}>创建服务记录: <span>张三/0203332</span></p>}
        visible={this.state.visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText="提交"
        cancelText="取消"
      >
        <p>Bla bla ...</p>
      </Modal>
    );
  }
}
