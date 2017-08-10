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
import { Col, Row, message } from 'antd';
import _ from 'lodash';

import { getEmpId, getCssStyle } from '../../utils/helper';
import BoardSelect from '../../components/pageCommon/BoardSelect';
import BoardItem from '../../components/pageCommon/BoardItem';
import { CreateBoardModal, DeleteBoardModal, PublishConfirmModal } from '../../components/modals';
import ImgAdd from '../../../static/images/bg_add.png';
import ImgTGJX from '../../../static/images/bg_tgjx.png';

import { fspContainer } from '../../config';

import styles from './Home.less';


const fsp = document.querySelector(fspContainer.container);
const showBtn = document.querySelector(fspContainer.showBtn);
const hideBtn = document.querySelector(fspContainer.hideBtn);
const contentWrapper = document.getElementById('workspace-content');
const marginWidth = fspContainer.marginWidth;
const marginLeftWidth = fspContainer.marginLeftWidth;

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  visibleBoards: state.manage.visibleBoards,
  editableBoards: state.manage.editableBoards,
  visibleRanges: state.manage.visibleRanges,
  newVisibleBoards: state.manage.newVisibleBoards,
  createLoading: state.manage.createLoading,
  deleteLoading: state.manage.deleteLoading,
  publishLoading: state.manage.publishLoading,
  message: state.manage.message,
  distinct: state.manage.message,
  operateData: state.manage.operateData,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getInitial: fectchDataFunction(true, 'manage/getAllInfo'),
  createBoard: fectchDataFunction(true, 'manage/createBoard'),
  deleteBoard: fectchDataFunction(true, 'manage/deleteBoard'),
  publishBoard: fectchDataFunction(true, 'manage/publishBoard'),
  checkName: fectchDataFunction(false, 'manage/duplicateBoard'),
  collectData: fectchDataFunction(false, 'report/collectData'),
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
    checkName: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    visibleBoards: PropTypes.array,
    editableBoards: PropTypes.array,
    visibleRanges: PropTypes.array,
    newVisibleBoards: PropTypes.array,
    createLoading: PropTypes.bool,
    deleteLoading: PropTypes.bool,
    publishLoading: PropTypes.bool,
    message: PropTypes.string,
    operateData: PropTypes.object,
    globalLoading: PropTypes.bool,
    distinct: PropTypes.bool,
  }

  static defaultProps = {
    globalLoading: false,
    createLoading: false,
    publishLoading: false,
    deleteLoading: false,
    distinct: false,
    message: '',
    operateData: {},
    visibleBoards: [],
    newVisibleBoards: [],
    editableBoards: [],
    visibleRanges: [],
    collectData: () => {},
  }

  constructor(props) {
    super(props);
    let contentWidth;
    let scrollX;
    let leftWidth;
    if (fsp) {
      contentWidth = getCssStyle(contentWrapper, 'width');
      scrollX = window.scrollX;
      leftWidth = parseInt(getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    }
    this.state = {
      width: fsp ? `${parseInt(contentWidth, 10) - marginWidth}px` : '100%',
      top: fsp ? '55px' : 0,
      left: fsp ? `${leftWidth - scrollX}px` : 0,
      createBoardModal: false,
      deleteBoardModal: false,
      publishConfirmModal: false,
    };
  }

  componentWillMount() {
    const empId = getEmpId();
    this.props.getInitial({ empId });
  }

  componentDidMount() {
    this.didMountAddEventListener();
  }

  componentWillReceiveProps(nextProps) {
    const { createLoading: preCL, deleteLoading: preDL, publishLoading: prePL } = this.props;
    const { push, operateData, createLoading, deleteLoading, publishLoading } = nextProps;
    if (preCL && !createLoading) {
      // 创建完成后，需要跳转到Edit
      const { id, ownerOrgId, boardType } = operateData;
      push(`/boardEdit?boardId=${id}&orgId=${ownerOrgId}&boardType=${boardType}`);
    }
    if (preDL && !deleteLoading) {
      // 删除成功
      message.success('删除成功');
    }
    if (!publishLoading && prePL) {
      message.success('发布成功');
      const { id } = operateData;
      push(`/report?boardId=${id}`);
    }
  }
  componentWillUnmount() {
    if (fsp) {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onWindowResize);
      showBtn.removeEventListener('click', this.toggleLeft);
      hideBtn.removeEventListener('click', this.toggleLeft);
    }
  }
  // resize 事件
  @autobind
  onWindowResize() {
    const contentWidth = getCssStyle(contentWrapper, 'width');
    this.setState({
      width: fsp ? `${parseInt(contentWidth, 10) - marginWidth}px` : '100%',
    });
  }
  // 监听页面滚动事件，设置头部的 left 值
  @autobind
  onScroll() {
    const scrollX = window.scrollX;
    const leftWidth = parseInt(getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    this.setState({
      left: leftWidth - scrollX,
    });
  }
  // didmount 时添加监听事件
  @autobind
  didMountAddEventListener() {
    // 如果在 FSP 里，则添加监听事件
    if (fsp) {
      this.onWindowResize();
      this.addEventListenerClick();
      window.addEventListener('scroll', this.onScroll, false);
      window.addEventListener('resize', this.onWindowResize, false);
      const leftWidth = parseInt(getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
      this.setState({
        left: leftWidth,
      });
    }
  }
  // 监听 FSP 侧边栏显示隐藏按钮点击事件
  @autobind
  addEventListenerClick() {
    showBtn.addEventListener('click', this.toggleLeft, false);
    hideBtn.addEventListener('click', this.toggleLeft, false);
  }
  @autobind
  toggleLeft() {
    const leftWidth = parseInt(getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    this.onWindowResize();
    this.setState({
      left: leftWidth,
    });
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

  @autobind
  createBoardConfirm(board) {
    this.props.createBoard(board);
  }

  // 删除看板
  @autobind
  deleteBoardHandle(board) {
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
    const { location, replace, push, collectData, checkName } = this.props;
    const {
      visibleRanges,
      visibleBoards,
      newVisibleBoards,
      editableBoards,
      distinct,
      operateData,
    } = this.props;
    // 做容错处理
    if (_.isEmpty(visibleRanges)) {
      return null;
    }
    if (_.isEmpty(visibleBoards)) {
      return null;
    }
    // 创建共同配置项
    const createBMProps = {
      modalKey: 'createBoardModal',
      modalCaption: '创建绩效看板',
      visible: createBoardModal,
      closeModal: this.closeModal,
      level: visibleRanges[0].level || '3',
      allOptions: visibleRanges,
      confirm: this.createBoardConfirm,
      checkName,
      distinct,
      operateData,
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

    const { top, left, width } = this.state;
    return (
      <div className="page-invest content-inner">
        <div>
          <div
            style={{
              position: 'fixed',
              zIndex: 30,
              width,
              top,
              left,
            }}
          >
            <div className="reportHeader">
              <Row type="flex" justify="start" align="middle">
                <div className="reportName">
                  <BoardSelect
                    location={location}
                    push={push}
                    replace={replace}
                    visibleBoards={visibleBoards}
                    newVisibleBoards={newVisibleBoards}
                    collectData={collectData}
                  />
                </div>
              </Row>
            </div>
          </div>
          <div style={{ height: '40px' }} />
        </div>
        <div className={styles.boardList}>
          <Row gutter={19}>
            <Col span={8} className={styles.test}>
              <a
                className={styles.boardItem}
                onClick={this.createBoardHandle}
              >
                <div className={styles.boardAdd}>
                  <img src={ImgAdd} alt="" />
                  <h3>创建看板</h3>
                </div>
                <div className={styles.boardImg}>
                  <img src={ImgTGJX} alt="" />
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
                    visibleRanges={visibleRanges}
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

