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

const visibleRange = VisibleRangeAll;

export default class TemplModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      createBoardModal: false,
      backConfirmModal: false,
      publishConfirmModal: false,
      deleteBoardModal: false,
    };
  }

  // @autobind
  // openModal(modal) {
  //   this.setState({
  //     [modal]: true,
  //   });
  // }

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

  render() {
    const {
      createBoardModal,
      backConfirmModal,
      publishConfirmModal,
      deleteBoardModal,
    } = this.state;

    const createBMProps = {
      modalKey: 'createBoardModal',
      modalCaption: '创建绩效看板',
      visible: createBoardModal,
      closeModal: this.closeModal,
      level: '1',
      allOptions: visibleRange,
    };

    const backConfirmMProps = {
      modalKey: 'backConfirmModal',
      modalCaption: '提示',
      visible: backConfirmModal,
      closeModal: this.closeModal,
    };

    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
    };

    const deleteBoardMProps = {
      modalKey: 'deleteBoardModal',
      modalCaption: '提示',
      modalName: '分公司经营业绩看板',
      visible: deleteBoardModal,
      closeModal: this.closeModal,
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
      </div>
    );
  }
}
