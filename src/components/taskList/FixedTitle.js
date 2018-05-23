import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Icon from '../common/Icon';

import styles from './fixedTitle.less';

const SORT_DESC = 'desc';
const SORT_ASC = 'asc';

const NOOP = _.noop;

export default class FixedTitle extends PureComponent {
  static propTypes = {
    // 排序文本
    content: PropTypes.string.isRequired,
    // 默认排序方向
    sortDirection: PropTypes.string,
    // 排序事件发生
    onSortChange: PropTypes.func,
    // 排序key值，传给后台
    sortKey: PropTypes.string.isRequired,
  };

  static defaultProps = {
    sortDirection: SORT_DESC,
    onSortChange: NOOP,
  };

  static getDerivedStateFromProps(nextProps) {
    const { sortKey } = this.props;
    const { sortKey: nextSortKey, sortDirection } = nextProps;
    if (sortKey !== nextSortKey) {
      this.setState({
        sortDirection,
        isSortDesc: sortDirection === SORT_DESC,
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否是降序，默认是降序
      isSortDesc: true,
      // 排序方向
      sortDirection: props.sortDirection,
    };
  }

  /**
   * 排序事件
   */
  @autobind
  handleSort() {
    const { onSortChange, sortKey } = this.props;
    const { isSortDesc } = this.state;
    this.setState({
      isSortDesc: !isSortDesc,
      sortDirection: isSortDesc ? SORT_ASC : SORT_DESC,
    }, () => {
      onSortChange({
        sortKey,
        sortType: this.state.sortDirection,
      });
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

  render() {
    // 默认降序排序
    const { content } = this.props;

    const { sortDirection } = this.state;

    return (
      <div className={styles.content}>
        <div className={styles.left}>
          服务内容
        </div>
        <div className={styles.right} onClick={this.handleSort}>
          <span>{content}</span>
          <Icon
            className={styles.icon}
            type={this.renderSortDirection(sortDirection)}
          />
        </div>
      </div>
    );
  }
}

