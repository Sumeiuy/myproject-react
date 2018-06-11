/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请新建页面
 * @Date: 2018-06-08 13:10:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-11 18:08:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import FinanceCustRelationshipForm from './FinanceCustRelationshipForm';
import CommonModal from '../common/biz/CommonModal';
import commonConfirm from '../common/confirm_';

export default class CreateApply extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    // 获取客户详情
    getCustDetail: PropTypes.func.isRequired,
    custDetail: PropTypes.object.isRequired,
    // 获取可申请客户列表
    queryCustList: PropTypes.func.isRequired,
    custList: PropTypes.object.isRequired,
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

  @autobind
  handleModalClose() {
    // 关闭新建申请弹出层的时候，弹出提示是否
    commonConfirm({
      shortCut: 'close',
      onOk: this.handleCloseModalConfim,
    });
  }

  @autobind
  handleCloseModalConfim() {
    this.props.onCloseModal('isShowCreateModal');
  }

  @autobind
  handleModalConfirmClick() {
    console.warn('点击提交按钮');
    // TODO 此处需要增加选择审批人的操作
    this.props.onSubmit({});
  }

  render() {
    const {
      custDetail,
      custList,
      getCustDetail,
      queryCustList,
    } = this.props;
    const {
      isShowModal,
    } = this.state;

    return (
      <CommonModal
        size="large"
        modalKey="myModal"
        title="客户关联关系信息申请"
        visible={isShowModal}
        onCancel={this.handleModalClose}
        closeModal={this.handleModalClose}
        onOk={this.handleModalConfirmClick}
      >
        <FinanceCustRelationshipForm
          action="CREATE"
          custDetail={custDetail}
          custList={custList}
          getCustDetail={getCustDetail}
          queryCustList={queryCustList}
        />
      </CommonModal>
    );
  }
}
