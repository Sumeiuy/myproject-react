/**
 * @Author: xuxiaoqin
 * @Date: 2018-04-13 11:57:34
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-07-19 15:00:26
 * @description 每一个视图列表的头部区域，不随着列表滚动
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Sort from '../common/sort';
import DescImg from './img/desc.png';
import AscImg from './img/asc.png';
import { EXECUTOR, SORT_DATA } from '../../routes/taskList/config';

import styles from './fixedTitle.less';

const SORT_DESC = 'desc';
const SORT_ASC = 'asc';

const NOOP = _.noop;

export default class FixedTitle extends PureComponent {
  static propTypes = {
    // 右侧排序文本
    sortContent: PropTypes.string.isRequired,
    // 默认排序方向
    sortDirection: PropTypes.string,
    // 排序事件发生
    onSortChange: PropTypes.func,
    // 排序key值，传给后台
    sortKey: PropTypes.string.isRequired,
    // 视图类型
    viewType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    sortDirection: SORT_DESC,
    onSortChange: NOOP,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { viewType } = prevState;
    const { sortKey, sortDirection, viewType: nextViewType } = nextProps;
    // 视图不一样的时候，update组件
    if (viewType !== nextViewType) {
      return {
        sortDirection,
        sortKey,
        viewType: nextViewType,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // 排序方向
      sortDirection: props.sortDirection,
      // 当前sortKey
      sortKey: props.sortKey,
      // 当前视图类型
      viewType: props.viewType,
    };
  }

  /**
   * 排序事件
   */
  @autobind
  handleSort() {
    const { onSortChange, sortKey } = this.props;
    const { sortDirection } = this.state;
    this.setState({
      sortDirection: sortDirection === SORT_ASC ? SORT_DESC : SORT_ASC,
    }, () => {
      onSortChange({
        sortKey,
        sortDirection: this.state.sortDirection,
      });
    });
  }

  @autobind
  handlExecutorSort({ sortType, sortDirection }) {
    this.props.onSortChange({
      sortKey: sortType,
      sortDirection,
    });
  }

  /**
   * 渲染排序的下拉箭头
   */
  renderSortDirection(sortDirection) {
    let sortIconType = 'jiangxu';
    if (sortDirection === SORT_ASC) {
      sortIconType = 'shengxu';
    }
    return sortIconType;
  }

  /**
   * 渲染排序图片
   * @param {*string} sortDirection 排序方向
   */
  renderSortImage(sortDirection) {
    let sortImage = DescImg;
    if (sortDirection === SORT_ASC) {
      sortImage = AscImg;
    }

    return sortImage;
  }

  @autobind
  renderSortContent() {
    // 默认降序排序
    const { sortContent } = this.props;
    const { sortDirection, viewType } = this.state;
    // 执行者视图
    if (viewType === EXECUTOR) {
      return this.renderExecutorSort();
    }
    return (
      <div className={styles.right} onClick={this.handleSort}>
        <span>{sortContent}</span>
        <img
          src={
            this.renderSortImage(sortDirection)
          }
          alt={this.renderSortDirection(sortDirection)}
          className={styles.img}
        />
      </div>
    );
  }

  // 执行者试图排序单独处理，用公用的排序组件
  @autobind
  renderExecutorSort() {
    const { sortKey, sortDirection } = this.props;
    const value = { sortType: sortKey, sortDirection };
    return (
      <Sort
        wrapClassName={styles.sort}
        data={SORT_DATA}
        value={value}
        onChange={this.handlExecutorSort}
      />
    );
  }

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.left}>
          服务内容
        </div>
        {this.renderSortContent()}
      </div>
    );
  }
}

