/**
 * @Author: sunweibin
 * @Date: 2018-04-12 14:36:08
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-12 22:21:43
 * @description 投资建议弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon, message } from 'antd';
import _ from 'lodash';
import cx from 'classnames';

import CommonModal from '../biz/CommonModal';

import styles from './choiceInvestAdviceModal.less';

const { TextArea } = Input;

export default class ChoiceInvestAdviceModal extends PureComponent {

  constructor(props) {
    super(props);
    const { isUpdate, serveContent } = props;
    this.state = {
      // 投资建议标题
      title: isUpdate ? serveContent.title : '',
      // 投资建议类型
      type: '',
      // 投资建议内容
      desc: isUpdate ? serveContent.desc : '',
      // 投资建议内容获取方式， free为自由编辑，tmpl为投资建议模板
      mode: 'free',
    };
  }

  // 关闭弹出层
  @autobind
  closeModal() {
    const { modalKey, onClose } = this.props;
    onClose(modalKey);
  }

  // 检测自由编辑状态下，标题和内容是否为空
  @autobind
  checkFreeEdit() {
    const { title, desc } = this.state;
    if (_.isEmpty(title)) {
      message.error('标题不能为空');
      return false;
    }
    if (title.length > 15) {
      message.error('标题字符长度不超过15字');
      return false;
    }
    if (_.isEmpty(desc)) {
      message.error('投资建议内容不能为空');
      return false;
    }
    if (desc.length > 150) {
      message.error('标题字符长度不超过150字');
      return false;
    }
    return true;
  }

  // 点击服务内容弹出层确认按钮
  @autobind
  handleOK() {
    if (this.checkFreeEdit()) {
      const { title, desc, mode } = this.state;
      this.props.onOK({ title, desc, mode });
    }
  }

  @autobind
  handleFreeEditTitleChange(e) {
    const title = e.target.value;
    this.setState({ title });
  }

  @autobind
  handleFreeEditDescChange(e) {
    const desc = e.target.value;
    this.setState({ desc });
  }

  render() {
    const {
      modalKey,
      visible,
      wrapClassName,
    } = this.props;

    const {
      title,
      desc,
    } = this.state;

    const ctCls = cx([styles.editLine, styles.editLineTextArea]);

    return (
      <CommonModal
        title="添加服务内容"
        modalKey={modalKey}
        needBtn
        maskClosable={false}
        showCancelBtn
        size="large"
        visible={visible}
        closeModal={this.closeModal}
        okText="确认"
        onOk={this.handleOK}
        onCancel={this.closeModal}
        wrapClassName={wrapClassName}
      >
        <div className={styles.serveContentContainer}>
          <div className={styles.modalHeader}>
            <div className={styles.modeName}>手动输入</div>
            <div className={styles.modeSwitch}>模板添加</div>
          </div>
          <div className={styles.editLine}>
            <div className={styles.editCaption}>标题:</div>
            <div className={styles.editInput}>
              <Input value={title} onInput={this.handleFreeEditTitleChange} />
            </div>
          </div>
          <div className={ctCls}>
            <div className={styles.editCaption}>内容:</div>
            <div className={styles.editInput}>
              <TextArea
                className={styles.serveContent}
                value={desc}
                onInput={this.handleFreeEditDescChange}
              />
            </div>
          </div>
          <div className={styles.tips}><Icon type="exclamation-circle" /> 注：手动输入的服务内容需要经过审批才能发送到客户手机上</div>
        </div>
      </CommonModal>
    );
  }

}

ChoiceInvestAdviceModal.propTypes = {
  modalKey: PropTypes.string.isRequired,
  wrapClassName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOK: PropTypes.func.isRequired,
  serveContent: PropTypes.object,
  visible: PropTypes.bool,
  isUpdate: PropTypes.bool, // 是否编辑修改
};

ChoiceInvestAdviceModal.defaultProps = {
  visible: false,
  isUpdate: false,
  wrapClassName: 'serveContentADD',
  serveContent: {},
};
