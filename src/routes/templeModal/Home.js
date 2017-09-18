/**
 * @description 用于展示各种Modal
 */

import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { autobind } from 'core-decorators';

import Icon from '../../components/common/Icon';
import { VisibleRangeAll } from './VisibleRange';
import CreateBoardModal from '../../components/modals/CreateBoardModal';
import BackConfirmModal from '../../components/modals/BackConfirmModal';
import PublishConfirmModal from '../../components/modals/PublishConfirmModal';
import DeleteBoardModal from '../../components/modals/DeleteBoardModal';
import SearchModal from '../../components/common/biz/SearchModal';
import ProcessConfirm from '../../components/common/biz/ProcessConfirm';
import Transfer from '../../components/common/biz/Transfer';
import CommonUpload from '../../components/common/biz/CommonUpload';
import CommonModal from '../../components/common/biz/Modal';
import InfoItem from '../../components/common/infoItem';


import {
  confirmData,
  employeeData,
  employeeColumns,
  subscribelData,
  unsubcribeData,
  productColumns,
} from './MockTableData';
import styles from './home.less';

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
      commonModal: false,
    };
  }

  @autobind
  onOk() {
    this.setState({
      commonModal: false,
    });
  }

  @autobind
  onCancel() {
    this.setState({
      commonModal: false,
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

  @autobind
  showModal() {
    this.setState({
      commonModal: true,
    });
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  @autobind
  renderSelectedElem(selected, removeFunc) {
    return (
      <div className={styles.result}>
        <div className={styles.nameLabel}>{selected.name}</div>
        <div className={styles.custIdLabel}>{selected.id}</div>
        <div className={styles.iconDiv}>
          <Icon
            type="close"
            className={styles.closeIcon}
            onClick={removeFunc}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      createBoardModal,
      backConfirmModal,
      publishConfirmModal,
      deleteBoardModal,
      confirmModal,
      commonModal,
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
      renderSelected: this.renderSelectedElem,
      idKey: 'id',
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

    const uploadProps = {
      fileList: [{
        name: '测试.jpg',
        size: 1024000,
        lastModified: 1501926296785,
      }],
    };

    const commonModalProps = {
      title: '这是一个弹出层',
      onOk: this.onOk,
      onCancel: this.onCancel,
      visible: commonModal,
      size: 'normal',
      children: 'tanchuang',
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
        <CommonUpload {...uploadProps} />
        <Button onClick={this.showModal}>打开公用弹窗</Button>
        <ProcessConfirm {...confirmProps} />
        <br />
        <br />
        <Transfer {...transferProps} />
        <CommonModal {...commonModalProps} />
        <br />
        <InfoItem label="备注" value="这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值" />
      </div>
    );
  }
}
