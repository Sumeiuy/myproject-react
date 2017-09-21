/**
 * @file customerPool/CreateTaskSuccess.js
 *  目标客户池-自建任务提交返回
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Button } from 'antd';
import { autobind } from 'core-decorators';
import ReactDOM from 'react-dom';
import styles from './createTaskSuccess.less';
import imgSrc from '../../../../static/images/createTask_success.png';

let successSetInterval;
let COUNT = 10;
export default class CreateTaskSuccess extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    successType: PropTypes.bool,
  }

  static defaultProps = {
    data: {},
    successType: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      changeTime: COUNT,
    };
  }

  componentDidMount() {
    /* eslint-disable */
    const UTBContentElem = ReactDOM.findDOMNode(document.getElementById('UTBContent'));
    const docElemHeight = document.documentElement.clientHeight;
    const taskSuccessBox = ReactDOM.findDOMNode(document.getElementById('taskSuccessBox'));// eslint-disable-line
    if (UTBContentElem) {
      taskSuccessBox.style.height = (docElemHeight - 55 - 60) + 'px';
    } else {
      if(taskSuccessBox) {
        taskSuccessBox.style.height = (docElemHeight - 40) + 'px';
      }
    }
    this.handleShowSuccess(this.props);
  }

  componentWillReceiveProps(nextProps) {
  }

  @autobind
  handleShowSuccess(props) {
    const { successType } = props;
    if (successType) {
      successSetInterval = setInterval(this.handleMovTime, 1000);
    }
  }
  @autobind
  /* 关闭当前页 */
  closeTab() {
      fspGlobal.closeRctTabById('RCT_FSP_TASK');
  }
  @autobind
  handleMovTime() {
    this.setState({
      changeTime: COUNT--,
    }, () => {
      if (COUNT < 0){
        console.log('页面关闭');
        this.closeTab();
        clearInterval(successSetInterval);
      }
    });    
  }

  render() {
    const { changeTime } = this.state;
    return (
      <div className={styles.taskSuccessBox}>
        <div className={styles.success_inner} id="taskSuccessBox">
          <div className={styles.taskSuccess_content}>
            <div className={styles.taskSuccess_imgbox}>
              <img src={imgSrc} alt="自建任务返回图标" />
            </div>
            <div className={styles.taskSuccess_msg}>
              <p>提交成功！</p>
              <p>创建任务请求已提交至后台，后台需要一些时间处理，您可以在“任务中心 → <a>任务管理</a>”中查看处理状态。</p>
              <p>页面会在 <b>{changeTime}</b> 秒内自动关闭</p>
            </div>
            <div className={styles.taskSuccess_btn}>
              <Button type="primary" >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
