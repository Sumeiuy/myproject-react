/**
 * @file customerPool/CreateTaskSuccess.js
 *  目标客户池-自建任务提交返回
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import ReactDOM from 'react-dom';
import styles from './createTaskSuccess.less';
import imgSrc from '../../../../static/images/createTask_success.png';
import { fspGlobal } from '../../../utils';
import Button from '../../common/Button';

let successSetInterval;
let COUNT = 10;
export default class CreateTaskSuccess extends PureComponent {
  static propTypes = {
    successType: PropTypes.bool,
    push: PropTypes.func.isRequired,
    closeTab: PropTypes.func.isRequired,
  }

  static defaultProps = {
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
      if (taskSuccessBox) {
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
  goToIndex() {
    const { closeTab, push, location: { state } } = this.props;
    const url = '/customerPool';
    const param = {
      id: 'tab-home',
      title: '首页',
    };
    if (document.querySelector(fspContainer.container)) {
      fspGlobal.openRctTab({ url, param });
      closeTab();
    } else {
      push({
        pathname: url,
        query: _.omit(state, 'noScrollTop'),
      });
    }
  }

  @autobind
  goToTask() {
    const { push, state } = this.props;
    const url = '/mot/selfbuildTask/selfBuildTaskMain';
    const param = {
      id: 'FSP_MOT_SELFBUILT_TASK',
      closable: true,
      forceRefresh: true,
      title: '自建任务管理'
    }
    fspGlobal.openFspTab({ url, param })
    closeTab();
  }

  @autobind
  handleMovTime() {
    this.setState({
      changeTime: COUNT--,
    }, () => {
      if (COUNT < 0) {
        console.log('页面关闭');
        this.goToIndex();
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
              <p>创建任务请求已提交至后台，后台需要一些时间处理，您可以在“任务中心 → <a onClick={this.goToTask}>任务管理</a>”中查看处理状态。</p>
              <p>页面会在 <b>{changeTime}</b> 秒内自动关闭</p>
            </div>
            <div className={styles.taskSuccess_btn}>
              <Button type="primary" onClick={this.goToIndex}>
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
