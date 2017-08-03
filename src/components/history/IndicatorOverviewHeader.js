/**
 * @fileOverview components/history/IndicatorOverviewHeader.js
 * @author hongguangqing
 * @description 用于历史对比头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Icon, Button } from 'antd';
import _ from 'lodash';
import { CreateHistoryBoardModal, DeleteHistoryBoardModal } from '../../components/modals';

// import Icon from '../common/Icon';

// 选择项字典
import styles from './indicatorOverviewHeader.less';

export default class PageHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    createBoardConfirm: PropTypes.func.isRequired,
    deleteBoardConfirm: PropTypes.func.isRequired,
    updateBoardConfirm: PropTypes.func.isRequired,
    ownerOrgId: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired,
    orgId: PropTypes.string.isRequired,
    selectKeys: PropTypes.array.isRequired,
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

  // 删除历史对比看板
  @autobind
  deleteHistoryBoardHandle() {
    this.openModal('deleteHistoryBoardModal');
  }

  @autobind
  saveHistoryBoardHandle() {
    const { updateBoardConfirm, orgId, boardId } = this.props;
    // TODO 调用更新(保存)历史看板接口
    updateBoardConfirm({
      orgId,
      boardId,
    });
  }

  render() {
    const { createHistoryBoardModal, deleteHistoryBoardModal } = this.state;
    const {
      location: { query: { boardId } },
      createBoardConfirm,
      deleteBoardConfirm,
      ownerOrgId,
      orgId,
    } = this.props;
    // 创建（另存为）共同配置项
    const createHistoryBMProps = {
      modalKey: 'createHistoryBoardModal',
      modalCaption: '提示',
      visible: createHistoryBoardModal,
      closeModal: this.closeModal,
      createBoardConfirm,
      ownerOrgId,
    };
    // 删除共同配置项
    const deleteHistoryBMProps = {
      modalKey: 'deleteHistoryBoardModal',
      modalCaption: '提示',
      visible: deleteHistoryBoardModal,
      closeModal: this.closeModal,
      deleteBoardConfirm,
      orgId,
      boardId,
    };
    console.warn('this.props.selectKeys', this.props.selectKeys);
    const deleteBtnClass = classnames({
      [styles.deleteBtnUnshowClass]: boardId === '3' || boardId === '4',
    });
    const btnUnshowClass = classnames({
      [styles.btnUnshowClass]: (_.isEmpty(this.props.selectKeys) && boardId === '3') || (_.isEmpty(this.props.selectKeys) && boardId === '4'),
    });

    return (
      <div className={styles.indicatorOverviewHeader}>
        <div className={styles.analyticalCaption}>核心指标</div>
        <div className={styles.overviewHeaderRight}>
          <Button
            type="primary"
            ghost
            onClick={this.saveHistoryBoardHandle}
            className={btnUnshowClass}
          >
            <Icon type="delete" />
            保存
          </Button>
          <Button
            ghost
            onClick={this.createHistoryBoardHandle}
            className={btnUnshowClass}
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
            className={deleteBtnClass}
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
