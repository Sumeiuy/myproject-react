/**
 * @Author: sunweibin
 * @Date: 2018-04-12 14:36:08
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-08 14:31:06
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
      // 内容错误提示信息
      descErrorInfo: '',
    };
    // 投资建议标题
    this.title = '';
    // 投资建议内容
    this.desc = '';
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

  // 获取投资建议文本标题和内容
  @autobind
  getInvestAdviceFreeModeData(title, desc) {
    this.title = title;
    this.desc = desc;
  }

  @autobind
  checkWallCollisionStatus() {
    if (this.props.testWallCollisionStatus) {
      this.setState({
        descErrorInfo: '推荐的产品未通过合规撞墙检测，请修改投资建议',
        validateContent: true,
      });
      return false;
    }
    return true;
  }

  // 点击服务内容弹出层确认按钮
  @autobind
  handleOK() {
    const { mode } = this.state;
    if (mode === 'free' && this.freeModeRef.checkData()) {
      const title = this.title;
      const desc = this.desc;
      const params = {
        content: desc,
      };
      this.props.testWallCollision(params).then(() => {
        if (this.checkWallCollisionStatus()) {
          this.props.onOK({ title, desc, mode });
        }
      });
    }
  }

  render() {
    const {
      modalKey,
      visible,
      wrapClassName,
      serveContent,
      isUpdate,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
    } = this.props;

    const { validateContent, validateTitle, descErrorInfo } = this.state;

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
            descErrorInfo={descErrorInfo}
            testWallCollisionStatus={testWallCollisionStatus}
            onGetInvestAdviceFreeModeData={(title, desc) =>
              this.getInvestAdviceFreeModeData(title, desc)}
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
  // 投资建议文本撞墙检测
  testWallCollision: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测是否有股票代码
  testWallCollisionStatus: PropTypes.bool.isRequired,
};

ChoiceInvestAdviceModal.defaultProps = {
  visible: false,
  isUpdate: false,
  wrapClassName: 'serveContentADD',
  serveContent: {},
};
