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

// 投顾绩效历史对比的borderId
const TYPE_LSDB_TGJX = '3';
// 经营业绩历史对比的boardId
const TYPE_LSDB_JYYJ = '4';

export default class IndicatorOverviewHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    createBoardConfirm: PropTypes.func.isRequired,
    deleteBoardConfirm: PropTypes.func.isRequired,
    updateBoardConfirm: PropTypes.func.isRequired,
    ownerOrgId: PropTypes.string.isRequired,
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
    const {
      location: { query: { boardId } },
      updateBoardConfirm,
      ownerOrgId,
      selectKeys,
    } = this.props;
    // TODO 调用更新(保存)历史看板接口
    updateBoardConfirm({
      ownerOrgId,
      boardId,
      coreIndicator: selectKeys,
      investContrastIndicator: ['tgInNum'],
      custContrastIndicator: ['custNum'],
    });
  }

  render() {
    const { createHistoryBoardModal, deleteHistoryBoardModal } = this.state;
    const {
      location: { query: { boardId, boardType } },
      createBoardConfirm,
      deleteBoardConfirm,
      ownerOrgId,
      orgId,
      selectKeys,
    } = this.props;
    // 创建（另存为）共同配置项
    const createHistoryBMProps = {
      modalKey: 'createHistoryBoardModal',
      modalCaption: '提示',
      visible: createHistoryBoardModal,
      closeModal: this.closeModal,
      createBoardConfirm,
      ownerOrgId,
      boardId,
      boardType,
      selectKeys,
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
      boardType,
    };
    console.warn('this.props.selectKeys', this.props.selectKeys);
    const deleteBtnClass = classnames({
      [styles.deleteBtnUnshowClass]: boardId === TYPE_LSDB_TGJX || boardId === TYPE_LSDB_JYYJ,
    });
    const createBtnClass = classnames({
      [styles.createBtnUnshowClass]: _.isEmpty(this.props.selectKeys),
    });
    const updateBtnClass = classnames({
      [styles.updateBtnUnshowClass]: boardId === TYPE_LSDB_TGJX ||
                                     boardId === TYPE_LSDB_JYYJ ||
                                     (_.isEmpty(this.props.selectKeys) &&
                                     boardId !== TYPE_LSDB_TGJX &&
                                     boardId !== TYPE_LSDB_JYYJ),
    });

    return (
      <div className={styles.indicatorOverviewHeader}>
        <div className={styles.analyticalCaption}>核心指标</div>
        <div className={styles.overviewHeaderRight}>
          <Button
            type="primary"
            ghost
            onClick={this.saveHistoryBoardHandle}
            className={updateBtnClass}
          >
            <Icon type="delete" />
            保存
          </Button>
          <Button
            ghost
            onClick={this.createHistoryBoardHandle}
            className={createBtnClass}
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
