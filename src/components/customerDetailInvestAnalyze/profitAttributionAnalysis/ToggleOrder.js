/*
 * @Author: zuoguangzu
 * @Date: 2018-12-07 17:14:55
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-09 22:34:16
 * @description 切换排序方式
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './toggleOrder.less';
import downIcon from '../../../../static/svg/asc.svg';
import upIcon from '../../../../static/svg/desc.svg';

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

  @autobind
  orderToggle() {
    const { isUp } = this.state;
    const { onOrderChange } = this.props;
    this.setState({
      isUp: !isUp,
    });
    const orderType = isUp ? '01' : '02';
    onOrderChange(orderType);
  }

  render() {
    const { isUp } = this.state;
    return (
      <div onClick={this.orderToggle} className={styles.order}>
        <span>{isUp ? UP_TEXT : DOWN_TEXT}</span>
        <img className={styles.orderIcon} src={isUp ? upIcon : downIcon} alt="排序方向" />
      </div>
    );
  }
}
