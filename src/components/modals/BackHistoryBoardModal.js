/**
 * @description 浏览器回退历史对比看板的Modal
 * @author hongguangqing
 */
import React, { PropTypes, PureComponent } from 'react';
import { Button, Modal, Form } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';

const create = Form.create;

@create()
export default class DeleteHistoryBoardModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    modalCaption: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
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
  closeDeleteModal() {
    const { closeModal, modalKey } = this.props;
    // 隐藏Modal
    closeModal(modalKey);
  }

  @autobind
  confirmDeleteModal() {
    this.closeDeleteModal();
  }

  render() {
    const { modalCaption } = this.props;
    const { modalVisible } = this.state;

    const backBoard = classnames({
      [styles.boardManageModal]: true,
      backBoard: true,
    });
    return (
      <Modal
        visible={modalVisible}
        title={modalCaption}
        closeable
        onCancel={this.closeDeleteModal}
        wrapClassName={backBoard}
        maskClosable={false}
        footer={[
          <Button key="back" size="large" onClick={this.closeDeleteModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.confirmDeleteModal}>
            确认
          </Button>,
        ]}
      >
        <div className={styles.modalDelTips}>
          <span>您重新挑选的指标看板尚未保存，确认直接返回？</span>
        </div>
      </Modal>
    );
  }
}
