/**
 * @file customerPool/CreateTaskSuccess.js
 *  目标客户池-自建任务提交返回
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import styles from './createTaskSuccess.less';
import Clickable from '../../../components/common/Clickable';
import imgSrc from './img/createTask_success.png';
import { env } from '../../../helper';
import Button from '../../common/Button';

export default class CreateTaskSuccess extends PureComponent {
  static propTypes = {
    successType: PropTypes.bool,
    push: PropTypes.func.isRequired,
    onCloseTab: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    clearSubmitTaskFlowResult: PropTypes.func,
  }

  static defaultProps = {
    successType: false,
    clearSubmitTaskFlowResult: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      changeTime: 2,
    };
  }

  componentDidMount() {
    const docElemHeight = document.documentElement.clientHeight;
    if (env.isInFsp()) {
      this.taskSuccessBox.style.height = `${docElemHeight - 55 - 60}px`;
    } else {
      this.taskSuccessBox.style.height = `${docElemHeight - 40}px`;
    }
    this.handleShowSuccess();
  }

  componentWillUnmount() {
    const { clearSubmitTaskFlowResult } = this.props;
    clearSubmitTaskFlowResult();
    this.clearTimeInterval();
  }

  @autobind
  taskSuccessBoxRef(input) {
    this.taskSuccessBox = input;
  }

  @autobind
  handleShowSuccess() {
    const { successType } = this.props;
    if (successType) {
      this.successSetInterval = setInterval(this.handleMovTime, 1000);
    }
  }

  @autobind
  goToHome() {
    this.clearTimeInterval();
    const { onCloseTab, push, location: { state, query } } = this.props;
    if (env.isInFsp()) {
      onCloseTab();
    } else {
      push({
        pathname: '/customerPool',
        query,
        state: _.omit(state, 'noScrollTop'),
      });
    }
  }

  @autobind
  handleMovTime() {
    let { changeTime } = this.state;
    this.setState({
      changeTime: --changeTime,
    }, () => {
      if (changeTime <= 0) {
        // 跳转之前关闭interval
        this.goToHome();
      }
    });
  }

  @autobind
  clearTimeInterval() {
    // 清除interval
    clearInterval(this.successSetInterval);
    this.successSetInterval = null;
  }

  render() {
    const { changeTime } = this.state;
    return (
      <div className={styles.taskSuccessBox}>
        <div className={styles.success_inner} id="taskSuccessBox" ref={this.taskSuccessBoxRef}>
          <div className={styles.taskSuccess_content}>
            <div className={styles.taskSuccess_imgbox}>
              <img src={imgSrc} alt="自建任务返回图标" />
            </div>
            <div className={styles.taskSuccess_msg}>
              <p>提交成功！</p>
              <p>创建任务请求已提交，后台需要一些时间处理。</p>
              <p>5~10分钟后，您可以通过 任务中心-&gt; MOT任务 查看并执行该任务。</p>
              <p>页面会在 <b>{changeTime}</b> 秒内自动关闭</p>
            </div>
            <div className={styles.taskSuccess_btn}>
              <Clickable
                onClick={this.goToHome}
                eventName="/click/createTaskSuccess/backHome"
              >
                <Button type="primary">返回首页</Button>
              </Clickable>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
