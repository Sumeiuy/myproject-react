/**
 * @fileOverview components/history/IndicatorOverviewHeader.js
 * @author hongguangqing
 * @description 用于历史对比头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import _ from 'lodash';
import Icon from '../common/Icon';
import { CreateHistoryBoardModal, DeleteHistoryBoardModal } from '../modals';
import { fspContainer } from '../../config';

// 选择项字典
import styles from './indicatorOverviewHeader.less';

// 投顾绩效历史对比的borderId
const TYPE_LSDB_TGJX = '3';
// 经营业绩历史对比的boardId
const TYPE_LSDB_JYYJ = '4';
const fsp = document.querySelector(fspContainer.container);

export default class IndicatorOverviewHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    createBoardConfirm: PropTypes.func.isRequired,
    deleteBoardConfirm: PropTypes.func.isRequired,
    updateBoardConfirm: PropTypes.func.isRequired,
    ownerOrgId: PropTypes.string.isRequired,
    orgId: PropTypes.string.isRequired,
    selectKeys: PropTypes.array.isRequired,
    createLoading: PropTypes.bool.isRequired,
    operateData: PropTypes.object.isRequired,
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      createHistoryBoardModal: false,
      deleteHistoryBoardModal: false,
      saveHistoryBoardModal: false,
    };
  }

  componentDidMount() {
    const { history } = this.context;
    this.removeHistoryListener = history.listenBefore(
      () => {
        if (!_.isEmpty(this.props.selectKeys)) {
          if (fsp) {
            window.$confirm = window.confirm;
            window.confirm = function (...argus) {
              window.confirm = window.$confirm;
              return window._confirm.apply(null, argus); // eslint-disable-line
            };
            return '您重新挑选的指标看板尚未保存，确认直接返回？';
          }
          return '您重新挑选的指标看板尚未保存，确认直接返回？';
        }
        return null;
      },
    );
  }

  componentWillUnmount() {
    if (this.removeHistoryListener) {
      this.removeHistoryListener();
    }
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
      location: { query: { boardId, boardType } },
      updateBoardConfirm,
      ownerOrgId,
      selectKeys,
    } = this.props;
    // TODO 调用更新(保存)历史看板接口
    if (boardType === 'TYPE_LSDB_TGJX') {
      updateBoardConfirm({
        ownerOrgId,
        boardId,
        boardType,
        coreIndicator: selectKeys,
        investContrastIndicator: ['tgNum', 'tgInNum'],
        custContrastIndicator: ['custNum', 'currSignCustNum'],
      });
    } else {
      updateBoardConfirm({
        ownerOrgId,
        boardId,
        boardType,
        coreIndicator: selectKeys,
        investContrastIndicator: ['custNum'],
        custContrastIndicator: ['totCustNum', 'pCustNum', 'oCustNum', 'oNewCustNum', 'oNewPrdtCustNum', 'InminorCustNum'],
      });
    }
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
      createLoading,
      operateData,
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
      createLoading,
      operateData,
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
            <Icon type="save_blue" />
            保存
          </Button>
          <Button
            ghost
            onClick={this.createHistoryBoardHandle}
            className={createBtnClass}
          >
            <Icon type="save_blue" />
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
            <Icon type="shanchu" />
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
