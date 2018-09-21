/*
 * @Author: zhangjun
 * @Date: 2018-05-21 20:58:37
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-22 15:31:22
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { autobind } from 'core-decorators';
import errorPic from './img/errorPic.png';
import styles from './index.less';

export default class errorPage extends PureComponent {
  static propTypes = {
    errorId: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
  }
  static contextTypes = {
    push: PropTypes.func.isRequired,
  }
  // 返回上一页
  @autobind
  handleBackClick() {
    /* const { push } = this.context;
    push('/customerPool'); */
    window.history.back(-1);
  }
  render() {
    const { errorId } = this.props;
    const { location: { pathname } } = this.props;
    // 判断错误页面是否是首页
    const ishomePageErrorStatus = pathname === '/customerPool';
    return (
      <div className={styles.errorPage}>
        <div className={styles.container}>
          <img src={errorPic} className={styles.imgError} alt="" />
          <p className={styles.errorTips}>
            <span className={styles.tipSorry}>SORRY</span>
            <br />
            <span className={styles.tipInfo}>当前页面遇到问题，请稍后再试（{errorId}）</span>
          </p>
          {
            !ishomePageErrorStatus && <Button type="primary" ghost onClick={this.handleBackClick}>返回上一页</Button>
          }
        </div>
      </div>
    );
  }
}
