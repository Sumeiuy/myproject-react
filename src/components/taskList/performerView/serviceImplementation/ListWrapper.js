/*
 * 服务实施列表显示容器
 * @Author: WangJunJun
 * @Date: 2018-09-11 16:14:31
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-16 18:16:30
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import cx from 'classnames';
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
    // 根据不同的size选择给列表项添加不同的宽度class
    const listItemWidth = `width${size}`;
    const cls = cx(
      styles.list,
      {
        [wrapperClassName]: wrapperClassName,
      },
    );
    const listItemCls = cx([
      styles.item,
      styles[listItemWidth],
    ]);
    return (
      <div className={cls} ref={this.wrapperRef}>
        {
          React.Children.map(children, child => (
            <div className={listItemCls}>
              {child}
            </div>
          ))
        }
      </div>
    );
  }
}
