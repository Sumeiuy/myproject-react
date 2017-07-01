/**
 * @description 看版编辑页面没有保存数据，就返回提示Modal
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Modal, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';

export default class BackConfirmModal extends PureComponent {
  static propTypes = {
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      modalVisible: visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    const { visible: preVisible } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        modalVisible: visible,
      });
    }
  }

  @autobind
  closeCreateModal() {
    const { modalKey, closeModal } = this.props;
    closeModal(modalKey);
  }

  @autobind
  confirmCreateModal() {
    // 隐藏Modal
    this.closeCreateModal();
  }

  render() {
    const { modalVisible } = this.state;
    const { modalCaption } = this.props;
    return (
      <Modal
        title={modalCaption}
        visible={modalVisible}
        closeable
        onCancel={this.closeCreateModal}
        maskClosable={false}
        wrapClassName={styles.boardManageModal}
        footer={[
          <Button key="back" size="large" onClick={this.closeCreateModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.confirmCreateModal}>
            确认
          </Button>,
        ]}
      >
        <div className={styles.modalPureTips}>您编辑的信息尚未保存，确认直接返回？</div>
      </Modal>
    );
  }
}
