/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请新建页面
 * @Date: 2018-06-08 13:10:33
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-08 13:59:17
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import CommonModal from '../common/biz/CommonModal';
import commonConfirm from '../common/confirm_';

export default class CreateApply extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
    };
  }

  // 关闭新建弹框
  @autobind
  closeModal() {
    // 关闭模态框
    commonConfirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    this.setState({
      isShowModal: false,
    });
  }

  @autobind
  afterClose() {
    this.props.onCloseModal('isShowCreateModal');
  }


  render() {
    const {
      isShowModal,
    } = this.state;

    return (
      <CommonModal
        title="新建公务手机申请"
        visible={isShowModal}
        closeModal={this.closeModal}
        afterClose={this.afterClose}
        size="large"
        modalKey="myModal"
      >
        123
      </CommonModal>
    );
  }
}
