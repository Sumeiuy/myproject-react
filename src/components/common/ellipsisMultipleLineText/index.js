/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-13 13:57:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-31 09:46:33
 * 多行文本打点组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Icon from '../Icon';

import { dom as DOMHelper } from '../../../helper';
import logable from '../../../decorators/logable';

import styles from './index.less';

const ORIGIN_MAX_CONTENT_HEIGHT = '100%';

export default class EllipsisMultipleLineText extends PureComponent {
  static propTypes = {
    // 子元素
    children: PropTypes.node.isRequired,
    // 第几行开始打点
    line: PropTypes.number,
  }

  static defaultProps = {
    // 默认第五行开始打点
    line: 5,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否展示更多按钮
      isShowMore: false,
      // 默认是折叠
      isFold: true,
      // 默认的文本区域最大高度
      maxContentHeight: ORIGIN_MAX_CONTENT_HEIGHT,
      // 记住默认文本区域最大高度，为了在后面恢复
      originMaxContentHeight: ORIGIN_MAX_CONTENT_HEIGHT,
    };
  }

  componentDidMount() {
    this.setContentHeight();
  }

  @autobind
  setContentHeight() {
    if (this.mainElem) {
      const { line } = this.props;
      const contentLineHeight = this.getDOMLineHeight(this.mainElem);
      const contentHeight = this.getDOMHeight(this.mainElem);
      const maxContentHeight = contentLineHeight * line;
      // 内容区域的高度大于行高*打点行数
      if (contentHeight > maxContentHeight) {
        this.setState({
          // 是否展示展开按钮
          isShowMore: true,
          // 当前省略的高度
          maxContentHeight,
          // 如果可以展开，那么需要将原始高度设置成当前省略之后的高度
          originMaxContentHeight: maxContentHeight,
        });
      } else {
        this.setState({
          isShowMore: false,
          maxContentHeight: ORIGIN_MAX_CONTENT_HEIGHT,
          originMaxContentHeight: ORIGIN_MAX_CONTENT_HEIGHT,
        });
      }
    }
  }

  /**
   * 获取dom的高度
   * @param {*node} dom dom对象
   */
  @autobind
  getDOMHeight(dom) {
    return parseInt(DOMHelper.getCssStyle(dom, 'height'), 10);
  }

  /**
   * 获取dom的行高
   * @param {*node} dom dom对象
   */
  @autobind
  getDOMLineHeight(dom) {
    return parseInt(DOMHelper.getCssStyle(dom, 'line-height'), 10);
  }

  /**
   * 获取内容区域引用
   * @param {*node} input 当前引用
   */
  @autobind
  saveRef(input) {
    return this.mainElem = input;
  }

  /**
   * 展开
   */
  @autobind
  @logable({ type: 'Click', payload: { name: '展开' } })
  handleUnfoldContent() {
    this.setState({
      isFold: false,
      maxContentHeight: ORIGIN_MAX_CONTENT_HEIGHT,
    });
  }

  /**
   * 收起
   */
  @autobind
  @logable({ type: 'Click', payload: { name: '收起' } })
  handleCollapseContent() {
    const { originMaxContentHeight } = this.state;
    this.setState({
      isFold: true,
      maxContentHeight: originMaxContentHeight,
    });
  }

  render() {
    const { children } = this.props;
    const { isShowMore, isFold, maxContentHeight } = this.state;
    return (
      <div className={styles.content}>
        <div
          className={
            classnames({
              [styles.main]: true,
              [styles.ellipsis]: isShowMore && isFold,
            })
          }
          style={{
            maxHeight: maxContentHeight,
          }}
          ref={this.saveRef}
        >
          {children}
        </div>
        <div
          className={classnames({
            [styles.unfoldWrapper]: isShowMore && isFold,
            [styles.none]: !isShowMore || !isFold,
          })}
          onClick={this.handleUnfoldContent}
        >
          <span className={styles.title}>展开</span>
          <Icon type="zhankai1" className={styles.unfold} />
        </div>
        <div
          className={classnames({
            [styles.collapseWrapper]: isShowMore && !isFold,
            [styles.none]: !isShowMore || isFold,
          })}
          onClick={this.handleCollapseContent}
        >
          <span className={styles.title}>收起</span>
          <Icon type="shouqi2" className={styles.collapse} />
        </div>
      </div>
    );
  }
}
