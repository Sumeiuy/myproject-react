/*
 * @Author: zuoguangzu
 * @Date: 2018-12-07 17:14:55
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-10 14:50:50
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
    handleOrderChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isUp: true,
    };
  }

  @autobind
  toggleOrder() {
    const { isUp } = this.state;
    const { handleOrderChange } = this.props;
    this.setState({
      isUp: !isUp,
    });
    // 排序（01：升序；02：降序）
    const orderType = isUp ? '01' : '02';
    handleOrderChange(orderType);
  }

  render() {
    const { isUp } = this.state;
    return (
      <div onClick={this.toggleOrder} className={styles.order}>
        <span>{isUp ? UP_TEXT : DOWN_TEXT}</span>
        <img className={styles.orderIcon} src={isUp ? upIcon : downIcon} alt="排序方向" />
      </div>
    );
  }
}
