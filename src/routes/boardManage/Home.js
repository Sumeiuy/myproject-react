/*
 * @Author: LiuJianShu
 * @Date: 2017-06-23 13:30:03
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-07-01 21:15:46
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { Col, Row } from 'antd';

import { getEmpId } from '../../utils/helper';
import BoardSelect from '../../components/pageCommon/BoardSelect';
import BoardItem from '../../components/pageCommon/BoardItem';
import { CreateBoardModal, DeleteBoardModal, PublishConfirmModal } from '../../components/modals';

import styles from './Home.less';

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  visibleBoards: state.manage.visibleBoards,
  editableBoards: state.manage.editableBoards,
  visibleRanges: state.manage.visibleRanges,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getInitial: fectchDataFunction(true, 'manage/getAllInfo'),
  createBoard: fectchDataFunction(true, 'manage/createBoard'),
  deleteBoard: fectchDataFunction(true, 'manage/deleteBoard'),
  publishBoard: fectchDataFunction(true, 'manage/publishBoard'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BoardManageHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getInitial: PropTypes.func.isRequired,
    createBoard: PropTypes.func.isRequired,
    deleteBoard: PropTypes.func.isRequired,
    publishBoard: PropTypes.func.isRequired,
    visibleBoards: PropTypes.array,
    editableBoards: PropTypes.array,
    visibleRanges: PropTypes.array,
    globalLoading: PropTypes.bool,
  }

  static defaultProps = {
    globalLoading: false,
    visibleBoards: [],
    editableBoards: [],
    visibleRanges: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      createBoardModal: false,
      deleteBoardModal: false,
      publishConfirmModal: false,
    };
  }

  componentWillMount() {
    const empId = getEmpId();
    this.props.getInitial({ empId });
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
  createBoardHandle() {
    this.openModal('createBoardModal');
  }

  // 删除看板
  @autobind
  deleteBoardHandle(board) {
    console.log('deleteBoardHandle', board);
    this.setState({
      delBoard: board,
      delBoardName: board.name,
    },
    () => {
      this.openModal('deleteBoardModal');
    });
  }

  // 确认删除Board
  @autobind
  deleteBoardConfirm() {
    const { delBoard: { orgId, boardId } } = this.state;
    this.props.deleteBoard({ orgId, boardId });
  }

  // 发布看板
  @autobind
  publishBoardHandle(board) {
    console.log('publishBoardHandle', board);
    this.setState({
      publishBoard: board,
    },
    () => {
      this.openModal('publishConfirmModal');
    });
  }

  @autobind
  publishBoardCofirm() {
    const { publishBoard } = this.state;
    this.props.publishBoard({
      ...publishBoard,
      isPublished: 'Y',
    });
  }

  render() {
    const {
      createBoardModal,
      deleteBoardModal,
      publishConfirmModal,
    } = this.state;
    const { location, replace, push, createBoard } = this.props;
    const { visibleRanges, visibleBoards, editableBoards } = this.props;
    // 做容错处理
    if (!visibleRanges || !visibleRanges.length) {
      return null;
    }
    if (!visibleBoards || !visibleBoards.length) {
      return null;
    }
    if (!editableBoards || !editableBoards.length) {
      return null;
    }
    // 创建共同配置项
    const createBMProps = {
      modalKey: 'createBoardModal',
      modalCaption: '创建绩效看板',
      visible: createBoardModal,
      closeModal: this.closeModal,
      level: visibleRanges[0].level,
      allOptions: visibleRanges,
      confirm: createBoard,
      ownerOrgId: visibleRanges[0].id,
    };
    // 删除共同配置项
    const deleteBMProps = {
      modalKey: 'deleteBoardModal',
      modalCaption: '提示',
      visible: deleteBoardModal,
      closeModal: this.closeModal,
      confirm: this.deleteBoardConfirm,
    };
    // 发布共同配置项
    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
      confirm: this.publishBoardCofirm,
    };

    return (
      <div className="page-invest content-inner">
        <div className="reportHeader">
          <Row type="flex" justify="start" align="middle">
            <div className="reportName">
              <BoardSelect
                location={location}
                push={push}
                replace={replace}
                visibleBoards={visibleBoards}
              />
            </div>
          </Row>
        </div>
        <div className={styles.boardList}>
          <Row gutter={19}>
            <Col span={8} className={styles.test}>
              <a
                className={styles.boardItem}
                onClick={this.createBoardHandle}
              >
                <div className={styles.boardAdd}>
                  <img src="/static/images/bg_add.png" alt="" />
                  <h3>创建看板</h3>
                </div>
                <div className={styles.boardImg}>
                  <img src="/static/images/bg_tgjx.png" alt="" />
                </div>
                <div className={styles.boardTitle} />
              </a>
            </Col>
            {
              editableBoards.map(item => (
                <Col span={8} key={item.id}>
                  {/* 此处需要传递相关方法 */}
                  <BoardItem
                    boardData={item}
                    delete={this.deleteBoardHandle}
                    publish={this.publishBoardHandle}
                    push={push}
                  />
                </Col>
              ))
            }
          </Row>
        </div>
        <CreateBoardModal {...createBMProps} />
        <DeleteBoardModal {...deleteBMProps} boardName={this.state.delBoardName} />
        <PublishConfirmModal {...publishConfirmMProps} />
      </div>
    );
  }
}

