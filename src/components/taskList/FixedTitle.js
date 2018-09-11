/**
 * @Author: xuxiaoqin
 * @Date: 2018-04-13 11:57:34
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-28 14:11:08
 * @description 每一个视图列表的头部区域，不随着列表滚动
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import store from 'store';
import Sort from '../common/sort';
import DescImg from './img/desc.png';
import AscImg from './img/asc.png';
import { EXECUTOR, SORT_DATA } from '../../routes/taskList/config';
import { logCommon } from '../../decorators/logable';
import { emp } from '../../helper';

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
    const { sortKey, sortDirection, viewType: nextViewType, sortContent } = nextProps;
    // 视图不一样的时候，update组件
    if (viewType !== nextViewType) {
      return {
        sortContent,
        sortDirection,
        sortKey,
        viewType: nextViewType,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const {
      sortKey: storedSortKey,
      sortContent: storedSortContent,
      sortDirection: storedSortDirection,
    } = this.getStoredSort() || {};
    this.state = {
      // 排序方向
      sortDirection: storedSortDirection || props.sortDirection,
      // 当前sortKey
      sortKey: storedSortKey || props.sortKey,
      // 当前视图类型
      viewType: props.viewType,
      // 排序字段的名称
      sortContent: storedSortContent || props.sortContent,
    };
  }

  componentWillUnmount() {
    // 将排序的数据信息存储到本地
    this.storeSort(this.state);
  }

  // 获取本地存储的排序
  @autobind
  getStoredSort() {
    const { viewType } = this.props;
    const storeKey = `${emp.getId()}-${viewType}-sort`;
    return store.get(storeKey);
  }

  /**
   * 排序事件
   */
  @autobind
  handleSort() {
    const { sortKey, sortContent } = this.state;
    this.setState(state => ({
      sortDirection: state.sortDirection === SORT_ASC ? SORT_DESC : SORT_ASC,
    }), () => {
      const { sortDirection } = this.state;
      this.props.onSortChange({
        sortKey,
        sortDirection,
      });
      // 发神策日志
      logCommon({
        type: 'Click',
        payload: {
          name: `${sortContent}${sortDirection === SORT_ASC ? '升序' : '降序'}`,
        },
      });
    });
  }

  @autobind
  handlExecutorSort({ sortType, sortDirection }) {
    const { name = '' } = _.find(SORT_DATA, { sortType }) || {};
    const tempObject = {
      sortKey: sortType,
      sortDirection,
      sortContent: name,
    };
    this.setState(tempObject, () => {
      this.props.onSortChange(tempObject);
      // 发神策日志
      logCommon({
        type: 'Click',
        payload: {
          name: `${name}${sortDirection === SORT_ASC ? '升序' : '降序'}`,
        },
      });
    });
  }

  // 保存当前的排序数据
  @autobind
  storeSort({
    sortKey,
    sortDirection,
    sortContent,
    viewType,
  }) {
    const storeKey = `${emp.getId()}-${viewType}-sort`;
    const storeContent = {
      sortKey,
      sortDirection,
      sortContent,
    };
    store.set(storeKey, storeContent);
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
    const { sortContent, sortDirection, viewType } = this.state;
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
    const { sortKey, sortDirection } = this.state;
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

