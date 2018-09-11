/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-09-07 13:38:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerGroupUpdateModal.less';
import logable from '../../../decorators/logable';

const NOOP = _.noop;
const EMPTY_OBJECT = {};
export default class CustomerGroupUpdateModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    wrapperClass: PropTypes.string,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    okType: PropTypes.string,
    onOk: PropTypes.func,
    modalContent: PropTypes.node,
    onCancel: PropTypes.func,
    footer: PropTypes.node,
    modalStyle: PropTypes.object,
    modalWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    closable: PropTypes.bool,
    // 拿到包裹的modal
    wrappedComponentRef: PropTypes.func,
    bodyStyle: PropTypes.object,
  };

  static defaultProps = {
    wrapperClass: '',
    visible: false,
    title: '',
    okType: 'primary',
    cancelText: '取消',
    modalContent: null,
    onCancel: NOOP,
    footer: null,
    modalStyle: EMPTY_OBJECT,
    modalWidth: 700,
    onOk: NOOP,
    okText: '',
    closable: false,
    wrappedComponentRef: NOOP,
    bodyStyle: EMPTY_OBJECT,
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
  @logable({ type: 'ButtonClick', payload: { name: '$props.cancelText' } })
  handleCancel() {
    this.props.onCancel();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.okText' } })
  handleOk() {
    this.props.onOk();
  }

  render() {
    const {
      wrapperClass,
      title,
      okText,
      cancelText,
      okType,
      modalContent,
      modalStyle,
      modalWidth,
      footer,
      closable,
      wrappedComponentRef,
      bodyStyle,
    } = this.props;
    const { visible } = this.state;
    const modalNode = (
      <Modal
        wrapClassName={wrapperClass}
        visible={visible}
        title={title}
        onOk={this.handleOk}
        okText={okText}
        okType={okType}
        cancelText={cancelText}
        maskClosable={false}
        width={modalWidth}
        onCancel={this.handleCancel}
        closable={closable}
        footer={footer}
        style={modalStyle}
        bodyStyle={bodyStyle}
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
