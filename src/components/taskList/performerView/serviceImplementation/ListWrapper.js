/*
 * 服务实施列表显示容器
 * @Author: WangJunJun
 * @Date: 2018-09-11 16:14:31
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-09-11 18:19:57
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
    const listItemWidth = Math.floor(this.state.wrapperWidth / size);
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
