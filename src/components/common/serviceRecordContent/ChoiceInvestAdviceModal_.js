/**
 * @Author: sunweibin
 * @Date: 2018-04-12 14:36:08
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-19 11:14:26
 * @description 投资建议弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import CommonModal from '../biz/CommonModal';
import ChoiceInvestAdviceFreeMode from './ChoiceInvestAdviceFreeMode';

import styles from './choiceInvestAdviceModal.less';

export default class ChoiceInvestAdviceModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // 投资建议内容获取方式， free为自由编辑，tmpl为投资建议模板
      mode: 'free',
      // 自由话术模式下，需要验证标题是否符合要求,如果为true则显示提示信息
      validateTitle: false,
      // 自由话术模式下，需要验证内容是否符合要求,如果为true则显示提示信息
      validateContent: false,
    };
  }

  @autobind
  setChoiceInvestAdviceFreeModeRef(input) {
    this.freeModeRef = input;
  }

  // 关闭弹出层
  @autobind
  closeModal() {
    const { modalKey, onClose } = this.props;
    onClose(modalKey);
  }

  // 点击服务内容弹出层确认按钮
  @autobind
  handleOK() {
    const { mode } = this.state;
    if (mode === 'free' && this.freeModeRef.checkData()) {
      const { title, desc } = this.freeModeRef.getData();
      this.props.onOK({ title, desc, mode });
    }
  }

  render() {
    const {
      modalKey,
      visible,
      wrapClassName,
      serveContent,
      isUpdate,
    } = this.props;

    const { validateContent, validateTitle } = this.state;

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
          <ChoiceInvestAdviceFreeMode
            ref={this.setChoiceInvestAdviceFreeModeRef}
            isUpdate={isUpdate}
            serveContent={serveContent}
            validateContent={validateContent}
            validateTitle={validateTitle}
          />
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
