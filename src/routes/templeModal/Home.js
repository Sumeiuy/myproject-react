/**
 * @description 用于展示各种Modal
 */

import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { autobind } from 'core-decorators';

import { VisibleRangeAll } from './VisibleRange';
import CreateBoardModal from '../../components/modals/CreateBoardModal';
import BackConfirmModal from '../../components/modals/BackConfirmModal';
import PublishConfirmModal from '../../components/modals/PublishConfirmModal';
import DeleteBoardModal from '../../components/modals/DeleteBoardModal';
import SearchModal from '../../components/common/biz/SearchModal';
import ProcessConfirm from '../../components/common/biz/ProcessConfirm';
import Transfer from '../../components/common/biz/Transfer';
import {
  confirmData,
  employeeData,
  employeeColumns,
  subscribelData,
  unsubcribeData,
  productColumns,
} from './MockTableData';

const visibleRange = VisibleRangeAll;

export default class TemplModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      createBoardModal: false,
      backConfirmModal: false,
      publishConfirmModal: false,
      deleteBoardModal: false,
      confirmModal: false,
    };
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  @autobind
  openCreateModal() {
    this.setState({
      createBoardModal: true,
    });
  }

  @autobind
  openBackConfirmModal() {
    this.setState({
      backConfirmModal: true,
    });
  }

  @autobind
  openPublishConfirmModal() {
    this.setState({
      publishConfirmModal: true,
    });
  }

  @autobind
  openDeleteBoardModal() {
    this.setState({
      deleteBoardModal: true,
    });
  }

  @autobind
  openConfirmClick() {
    this.setState({
      confirmModal: true,
    });
  }

  @autobind
  handleOk(data) {
    console.log(data);
  }

  @autobind
  handleSearch(keyword) {
    console.log(keyword);
  }

  @autobind
  handleChange(subscribelArray, unsubcribeArray, selected) {
    console.log(subscribelArray, unsubcribeArray, selected);
  }

  render() {
    const {
      createBoardModal,
      backConfirmModal,
      publishConfirmModal,
      deleteBoardModal,
      confirmModal,
    } = this.state;

    const createBMProps = {
      modalKey: 'createBoardModal',
      modalCaption: '创建绩效看板',
      visible: createBoardModal,
      closeModal: this.closeModal,
      level: '1',
      allOptions: visibleRange,
      confirm: this.openCreateModal,
      ownerOrgId: '1',
      operateData: {},
      createLoading: false,
    };

    const backConfirmMProps = {
      modalKey: 'backConfirmModal',
      modalCaption: '提示',
      visible: backConfirmModal,
      closeModal: this.closeModal,
      confirm: this.openBackConfirmModal,
    };

    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
      confirm: this.openPublishConfirmModal,
    };

    const deleteBoardMProps = {
      modalKey: 'deleteBoardModal',
      modalCaption: '提示',
      modalName: '分公司经营业绩看板',
      visible: deleteBoardModal,
      closeModal: this.closeModal,
      confirm: this.openDeleteBoardModal,
    };

    const searchProps = {
      onOk: this.handleOk,
      dataSource: employeeData,
      columns: employeeColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      onSearch: this.handleSearch,
    };

    const confirmProps = {
      visible: confirmModal,
      content: confirmData,
      modalKey: 'confirmModal',
      onOk: this.closeModal,
    };

    const transferProps = {
      subscribeData: subscribelData,
      unsubscribeData: unsubcribeData,
      subscribeColumns: productColumns,
      unsubscribeColumns: productColumns,
      onChange: this.handleChange,
    };

    return (
      <div>
        <Button onClick={this.openCreateModal}>创建</Button>
        <CreateBoardModal {...createBMProps} />
        <Button onClick={this.openBackConfirmModal}>Back</Button>
        <BackConfirmModal {...backConfirmMProps} />
        <Button onClick={this.openPublishConfirmModal}>发布</Button>
        <PublishConfirmModal {...publishConfirmMProps} />
        <Button onClick={this.openDeleteBoardModal}>删除</Button>
        <DeleteBoardModal {...deleteBoardMProps} />
        <br />
        <br />
        <SearchModal {...searchProps} />
        <br />
        <Button onClick={this.openConfirmClick}>show confirm弹框</Button>
        <ProcessConfirm {...confirmProps} />
        <br />
        <br />
        <Transfer {...transferProps} />
      </div>
    );
  }
}
