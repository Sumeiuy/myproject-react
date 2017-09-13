/**
 * @description 过程确认框，统一样式
 * @author zhangjunli
 * Usage:
 * <ProcessConfirm
 *  visible={bool}
 *  onOk={func}
 *  modalKey={string}
 * />
 * visible：必需的，用于控制弹框是否显示
 * onOk：必须，按钮的回调事件
 * modalKey： 必须，容器组件用来控制modal出现和隐藏的key
 * okText：有默认值（确认），按钮的title
 * contentTitle： 有默认值（流程发送成功），弹框内容的title
 * title： 有默认值（系统提示），弹框的title
 * content：有默认值（空对象），弹框的内容的value
 */
import React, { PropTypes, Component } from 'react';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';

import styles from './processConfirm.less';

export default class ProcessConfirm extends Component {
  static propTypes = {
    okText: PropTypes.string,
    contentTitle: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.object,
    onOk: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    modalKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    okText: '确认',
    contentTitle: '流程发送成功!',
    title: '系统提示',
    content: {},
  }

  @autobind
  handleOk() {
    const { onOk, modalKey } = this.props;
    onOk(modalKey);
  }

  render() {
    const {
      title,
      contentTitle,
      content,
      okText,
      visible,
    } = this.props;

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleOk}
        okText={okText}
        wrapClassName={styles.modalContainer}
      >
        <div className={styles.contentTitle}>{contentTitle}</div>
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.key}>待审批人</div>
            <div className={styles.value}>{content.currentApprover}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.key}>待审意见</div>
            <div className={styles.value}>{content.advice}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.key}>审送对象</div>
            <div className={styles.value}>{content.nextApprover}</div>
          </div>
        </div>
      </Modal>
    );
  }
}
