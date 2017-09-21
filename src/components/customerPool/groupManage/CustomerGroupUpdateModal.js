/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-09-20 18:53:52
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
// import { Link } from 'dva/router';
// import classnames from 'classnames';
// import _ from 'lodash';
import styles from './customerGroupUpdateModal.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

export default class CustomerGroupUpdateModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    wrapperClass: PropTypes.string.isRequired,
    title: PropTypes.string,
    okText: PropTypes.string.isRequired,
    cancelText: PropTypes.string,
    okType: PropTypes.string,
    onOkHandler: PropTypes.func.isRequired,
    modalContent: PropTypes.node,
  };

  static defaultProps = {
    visible: false,
    title: '',
    okType: 'primary',
    cancelText: '取消',
    modalContent: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  @autobind
  handleOk() {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  @autobind
  handleCancel() {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  render() {
    const {
      wrapperClass,
      title,
      okText,
      cancelText,
      okType,
      onOkHandler,
      modalContent,
    } = this.props;
    const { visible } = this.state;
    return (
      <div className={styles.groupUpdateWrapper}>
        <Modal
          wrapClassName={wrapperClass}
          visible={visible}
          title={title}
          onOk={onOkHandler}
          okText={okText}
          okType={okType}
          cancelText={cancelText}
          maskClosable={false}
          width={700}
          onCancel={this.handleCancel}
          closable={false}
        >
          {
            modalContent
          }
        </Modal>
      </div>
    );
  }
}
