/**
 * @description 过程确认框，统一样式
 * @author zhangjunli
 * Usage:
 * <ProcessConfirm visible={bool} />
 * visible：必需的，用于控制弹框是否显示
 * onOk：有默认值（空函数），按钮的回调事件
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
    onOk: PropTypes.func,
    okText: PropTypes.string,
    contentTitle: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.object,
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    onOk: () => {},
    okText: '确认',
    contentTitle: '流程发送成功!',
    title: '系统提示',
    content: {},
  }

  constructor(props) {
    super(props);
    const { visible } = this.props;
    this.state = {
      visible,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({
      visible,
    });
  }

  @autobind
  handleOk() {
    const { onOk } = this.props;
    this.setState({
      visible: false,
    }, onOk());
  }

  @autobind
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {
      title,
      contentTitle,
      content,
      okText,
    } = this.props;
    const {
      visible,
    } = this.state;

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
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
