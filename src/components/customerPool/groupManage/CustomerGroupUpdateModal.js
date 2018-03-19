/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-19 13:35:32
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerGroupUpdateModal.less';

const NOOP = _.noop;
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
    // 拿到包裹的modal
    wrappedComponentRef: PropTypes.func,
  };

  static defaultProps = {
    wrapperClass: '',
    visible: false,
    title: '',
    okType: 'primary',
    cancelText: '取消',
    modalContent: null,
    onCancelHandler: NOOP,
    footer: null,
    modalStyle: {},
    modalWidth: 700,
    onOkHandler: NOOP,
    okText: '',
    closable: false,
    wrappedComponentRef: NOOP,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible: nextVisible } = nextProps;
    this.setState({
      visible: nextVisible,
    });
  }

  @autobind
  getInstance() {
    return this.modalInstance;
  }

  @autobind
  setInstance(ref) {
    this.modalInstance = ref;
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
      wrappedComponentRef,
    } = this.props;
    const { visible } = this.state;
    const modalNode = (
      <Modal
        wrappedComponentRef={this.setInstance}
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
    );

    return (
      <div
        className={styles.groupUpdateWrapper}
        ref={wrappedComponentRef}
      >
        {modalNode}
      </div>
    );
  }
}
