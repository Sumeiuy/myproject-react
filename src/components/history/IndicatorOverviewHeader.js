/**
 * @fileOverview components/pageCommon/PageHeader.js
 * @author sunweibin
 * @description 用于业绩页面头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Icon, Button, message } from 'antd';
import { CreateHistoryBoardModal, DeleteHistoryBoardModal } from '../../components/modals';
// import Icon from '../common/Icon';

// 选择项字典
import styles from './indicatorOverviewHeader.less';

export default class PageHeader extends PureComponent {
  static PropTypes = {
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      createHistoryBoardModal: false,
      deleteHistoryBoardModal: false,
      saveHistoryBoardModal: false,
    };
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  @autobind
  openModal(modal) {
    this.setState({
      [modal]: true,
    });
  }

  @autobind
  createHistoryBoardHandle() {
    this.openModal('createHistoryBoardModal');
  }

  @autobind
  deleteHistoryBoardHandle() {
    this.openModal('deleteHistoryBoardModal');
  }

  @autobind
  saveHistoryBoardHandle() {
    message.success('保存成功', 3);
  }

  render() {
    const { createHistoryBoardModal, deleteHistoryBoardModal } = this.state;
    // 创建（另存为）共同配置项
    const createHistoryBMProps = {
      modalKey: 'createHistoryBoardModal',
      modalCaption: '提示',
      visible: createHistoryBoardModal,
      closeModal: this.closeModal,
    };
    // 删除共同配置项
    const deleteHistoryBMProps = {
      modalKey: 'deleteHistoryBoardModal',
      modalCaption: '提示',
      visible: deleteHistoryBoardModal,
      closeModal: this.closeModal,
    };

    return (
      <div className={styles.indicatorOverviewHeader}>
        <div className={styles.analyticalCaption}>核心指标</div>
        <div className={styles.overviewHeaderRight}>
          <Button
            type="primary"
            ghost
            onClick={this.saveHistoryBoardHandle}
          >
            <Icon type="delete" />
            保存
          </Button>
          <Button
            ghost
            onClick={this.createHistoryBoardHandle}
          >
            <Icon type="delete" />
            另存为
          </Button>
          <CreateHistoryBoardModal
            {...createHistoryBMProps}
          />
          <Button
            ghost
            onClick={this.deleteHistoryBoardHandle}
          >
            <Icon type="delete" />
            删除
          </Button>
          <DeleteHistoryBoardModal
            {...deleteHistoryBMProps}
          />
        </div>
      </div>
    );
  }
}
