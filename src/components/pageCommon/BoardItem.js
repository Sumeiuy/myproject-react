/*
 * @Author: LiuJianShu
 * @Date: 2017-06-26 17:00:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-06-27 09:52:08
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';

import styles from './BoardItem.less';

export default class BoardItem extends PureComponent {

  static propTypes = {
    boardData: PropTypes.object.isRequired,
    delete: PropTypes.func.isRequired,
    publish: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  // 鼠标移入事件
  @autobind
  mouseEnterHandle() {
    this.setState({
      hover: !this.state.hover,
    });
  }
  // 鼠标移除事件
  @autobind
  mouseLeaveHandle() {
    this.setState({
      hover: !this.state.hover,
    });
  }
  // 发布按钮点击事件
  @autobind
  publishHandle() {
    const { publish, boardData: { boardStatus, id, ownerOrgId } } = this.props;
    const hover = this.state.hover;
    if (hover && (boardStatus === 'UNRELEASE')) {
      publish({
        ownerOrgId,
        boardId: id,
      });
    }
  }
  // 进入编辑页面
  @autobind
  editBoardHandle() {
    const { id, ownerOrgId } = this.props.boardData;
    this.props.push(`/boardEdit?boardId=${id}&orgId=${ownerOrgId}`);
  }
  @autobind
  deleteBoardHandle() {
    const { id, ownerOrgId, name } = this.props.boardData;
    this.props.delete({
      orgId: ownerOrgId,
      boardId: id,
      name,
    });
  }
  render() {
    // 获取看板信息数据
    const {
      name,
      boardTypeDesc,
      boardStatus,
      createTime,
      updateTime,
      orgItemDtos,
    } = this.props.boardData;
    const hover = this.state.hover;
    const seeAllow = orgItemDtos.map(o => o.name).join('/');
    let publish = '';
    let statusText = '';
    if (boardStatus === 'RELEASE') {
      publish = 'boardStatusPublish';
      statusText = '已发布';
    } else {
      publish = 'boardStatusUnPublish';
      statusText = hover ? '发布' : '未发布';
    }

    return (
      <a
        className={styles.boardItem}
        onMouseEnter={this.mouseEnterHandle}
        onMouseLeave={this.mouseLeaveHandle}
      >
        <div className={styles.boardImg}>
          <img src="/static/images/bg_tgyj.png" alt="" />
          <div className={styles[publish]} onClick={this.publishHandle}>
            {statusText}
          </div>
          <div className={styles.boardInfo}>
            <div className={styles.text}>可见范围：{seeAllow}</div>
            <div className={styles.text}>修改时间：{updateTime || createTime}</div>
          </div>
          <div style={{ display: hover ? 'block' : 'none' }} >
            <div className={styles.boardBtnGroup}>
              <span onClick={this.editBoardHandle}>编辑</span>
              <span onClick={this.deleteBoardHandle}>删除</span>
            </div>
          </div>
        </div>
        <div className={styles.boardTitle}>
          <div className={styles.title}>{name}</div>
          <div className={styles.type}>{boardTypeDesc}</div>
        </div>
      </a>
    );
  }
}
