/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-22 13:39:31
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerGroupUpdateModal.less';

export default class CustomerGroupUpdateModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    wrapperClass: PropTypes.string,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    okType: PropTypes.string,
    onOkHandler: PropTypes.func,
    modalContent: PropTypes.node,
    onCancelHandler: PropTypes.func,
    footer: PropTypes.node,
    modalStyle: PropTypes.object,
    modalWidth: PropTypes.number,
    closable: PropTypes.bool,
  };

  static defaultProps = {
    wrapperClass: '',
    visible: false,
    title: '',
    okType: 'primary',
    cancelText: '取消',
    modalContent: null,
    onCancelHandler: () => { },
    footer: null,
    modalStyle: {},
    modalWidth: 700,
    onOkHandler: () => { },
    okText: '',
    closable: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.props;
    const { visible: nextVisible } = nextProps;
    if (visible !== nextVisible) {
      this.setState({
        visible: nextVisible,
      });
    }
  }

  @autobind
  handleCancel() {
    const { visible } = this.state;
    const { onCancelHandler } = this.props;
    this.setState({
      visible: !visible,
    });
    onCancelHandler();
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
      modalStyle,
      modalWidth,
      footer,
      closable,
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
          width={modalWidth}
          onCancel={this.handleCancel}
          closable={closable}
          footer={footer}
          style={modalStyle}
        >
          {
            modalContent
          }
        </Modal>
      </div>
    );
  }
}
