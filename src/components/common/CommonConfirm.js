import React, { PropTypes, Component } from 'react';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';

import styles from './commonConfirm.less';

export default class CommonDialog extends Component {
  static propTypes = {
    onOk: PropTypes.func,
    okText: PropTypes.string,
    contentTitle: PropTypes,
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
