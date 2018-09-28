/*
 * 服务实施列表显示容器
 * @Author: WangJunJun
 * @Date: 2018-09-11 16:14:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-25 17:23:04
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import _ from 'lodash';
import { dom } from '../../../../helper';

import styles from './listWrapper.less';

export default class ListWrapper extends PureComponent {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    size: PropTypes.number,
    children: PropTypes.node,
  }

  static defaultProps = {
    wrapperClassName: '',
    size: 1,
    children: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      wrapperWidth: 0,
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ wrapperWidth: this.getWrapperWidth() });
  }

  // 获取外层容器的宽度
  @autobind
  getWrapperWidth() {
    return dom.getRect(this.wrapperRef.current, 'width');
  }

  render() {
    const { size, children, wrapperClassName } = this.props;
    // 有时候算出来的值会不是很合适，导致放置所有的列表项的时候回出现溢出的现象，
    // 所以这边多扣除 30px 是的在所有情况下均显示正常，不换行
    const listItemWidth = Math.floor((this.state.wrapperWidth -30) / size);
    const cls = cx(
      styles.list,
      {
        [wrapperClassName]: wrapperClassName,
      },
    );
    return (
      <div className={cls} ref={this.wrapperRef}>
        {
          React.Children.map(children, child => (
            <div
              className={styles.item}
              style={{ width: `${listItemWidth}px` }}
            >
              {child}
            </div>
          ))
        }
      </div>
    );
  }
}
