/*
 * @Author: LiuJianShu
 * @Date: 2017-06-26 17:00:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-06-27 10:04:52
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';

import styles from './BoardItem.less';

export default class BoardItem extends PureComponent {

  static propTypes = {
    boardData: PropTypes.object.isRequired,
  }

  // static defaultProps = {
  //   location: {},
  // }
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
    const { boardData: { published } } = this.props;
    const hover = this.state.hover;
    if (hover && !published) {
      console.warn('点击了发布按钮');
    }
  }
  @autobind
  editBoardHandle() {
    console.warn('点击了编辑按钮');
  }
  @autobind
  deleteBoardHandle() {
    console.warn('点击了删除按钮');
  }
  render() {
    const { boardData: { editTime, seeAllow, status, title, type, published } } = this.props;
    const hover = this.state.hover;
    let publish = '';
    let statusText = '';
    if (published) {
      publish = 'boardStatusPublish';
      statusText = status;
    } else {
      publish = 'boardStatusUnPublish';
      statusText = hover ? '发布' : status;
    }
    const boardTypeObj = {
      jyyj: '经营业绩',
      tgjx: '投顾绩效',
    };

    return (
      <a
        className={styles.boardItem}
        onMouseEnter={this.mouseEnterHandle}
        onMouseLeave={this.mouseLeaveHandle}
      >
        <div className={styles.boardImg}>
          <img src={`/static/images/bg_${type}.png`} alt="" />
          <div className={styles[publish]} onClick={this.publishHandle}>
            {statusText}
          </div>
          <div style={{ display: hover ? 'block' : 'none' }} >
            <div className={styles.boardBtnGroup}>
              <span onClick={this.editBoardHandle}>编辑</span>
              <span onClick={this.deleteBoardHandle}>删除</span>
            </div>
            <div className={styles.boardInfo}>
              <h3>可见范围：{seeAllow.join()}</h3>
              <h3>修改时间：{editTime}</h3>
            </div>
          </div>
        </div>
        <div className={styles.boardTitle}>
          <h2>{title}</h2>
          <span>{boardTypeObj[type]}</span>
        </div>
      </a>
    );
  }
}
