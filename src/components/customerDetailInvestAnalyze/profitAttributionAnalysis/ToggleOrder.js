/*
 * @Author: zuoguangzu
 * @Date: 2018-12-07 17:14:55
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-11 11:17:34
 * @description 切换排序方式
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './toggleOrder.less';
import downIcon from '../../../../static/svg/asc.svg';
import upIcon from '../../../../static/svg/desc.svg';
import logable from '../../../decorators/logable';

const UP_TEXT = '收益由高到低';
const DOWN_TEXT = '收益由低到高';

export default class ToggleOrder extends PureComponent {
  static propTypes = {
    onOrderChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isUp: true,
    };
  }

  // 排序切换
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '排序切换',
    },
  })
  handleToggleOrder() {
    const { isUp } = this.state;
    this.setState({
      isUp: !isUp,
    });
    // 排序（01：升序；02：降序）
    const orderType = isUp ? '01' : '02';
    this.props.onOrderChange(orderType);
  }

  render() {
    const { isUp } = this.state;
    return (
      <div onClick={this.handleToggleOrder} className={styles.order}>
        <span>{isUp ? UP_TEXT : DOWN_TEXT}</span>
        <img className={styles.orderIcon} src={isUp ? upIcon : downIcon} alt="排序方向" />
      </div>
    );
  }
}
