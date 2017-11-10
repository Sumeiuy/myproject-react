/**
 * @Author: sunweibin
 * @Date: 2017-11-10 10:12:18
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-10 13:43:39
 * @description 分割组件
 */

import React, { PureComponent, PropTypes } from 'react';
// import SplitPane from 'react-split-pane';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Resize from 'element-resize-detector';
import { Icon } from 'antd';

import splitConfig from './config';
// import { getEnv } from '../../../utils/helper';

import '../../../css/react-split-pane-master.less';
import styles from './SplitPanel.less';
import nodatapng from './nodata.png';

// const BROWSER = getEnv();

export default class CutScreen extends PureComponent {
  static propTypes = {
    topPanel: PropTypes.element.isRequired,
    leftPanel: PropTypes.element.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    rightPanel: PropTypes.element,
    leftListClassName: PropTypes.string,
    leftWidth: PropTypes.string,
  }

  static defaultProps = {
    leftListClassName: 'pageCommonList',
    rightPanel: null,
    leftWidth: '512px',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 初始化当前系统
    this.UTBContentElem = document.querySelector(splitConfig.utb);
    // 将系统的Margin设置为0;
    this.setUTBContentMargin(0, 0, 0);
    // 监听window.onResize事件
    this.registerWindowResize();
    // 监听头部TopPanel的高度变化
    this.registerTopHeightListen();
  }


  componentWillUnmount() {
    // 重置外层容器样式,防止影响其他界面
    this.setUTBContentMargin('10px', '30px', '10px');
    this.resetContainerStyle();
    this.cancelWindowResize();
    this.cancelTopHeightListen();
  }

  // Resize事件
  @autobind
  onResizeChange() {

  }

  // 设置系统容器的局部样式
  @autobind
  setUTBContentMargin(top, right, bottom) {
    const utb = this.UTBContentElem;
    if (utb) {
      utb.style.marginTop = top;
      utb.style.marginRight = right;
      utb.style.marginBottom = bottom;
    }
  }

  // 设置元素的style样式值，默认设置其height的值
  @autobind
  setElementStyle(e, v, p = 'height') {
    if (e) {
      e.style[p] = v;
    }
  }

  // 设置分割区域的滚动
  @autobind
  setDocumentScroll() {

  }

  // 重置系统容器样式
  @autobind
  resetContainerStyle() {
    let containerElem;
    if (this.UTBContentElem) {
      containerElem = this.UTBContentElem.querySelector(splitConfig.container);
    } else {
      containerElem = document.querySelector(splitConfig.container);
    }
    containerElem.style.height = 'auto';
  }

  // 初始化的时候，设置各自的宽度
  @autobind
  initPanel() {

  }

  // 监听TopPanel的Height的变化
  @autobind
  registerTopHeightListen() {
    const fnResize = _.debounce(this.setDocumentScroll, 250, {
      leading: true,
      trailing: true,
    });
    const resize = Resize({
      strategy: 'scroll',
    });
    resize.listenTo(this.topPanel, fnResize);
    this.topResize = resize;
    this.topResizeFn = fnResize;
  }

  // 注销对头部的监听
  @autobind
  cancelTopHeightListen() {
    if (this.topResize && this.topResize.uninstall) {
      this.topResize.uninstall(this.topPanel);
    }
    if (this.topResizeFn && this.topResizeFn.cancel) {
      this.topResizeFn.cancel();
    }
  }

  // 注册window的resize事件
  @autobind
  registerWindowResize() {
    window.addEventListener('resize', this.onResizeChange, false);
  }
  // 注销window的resize事件
  @autobind
  cancelWindowResize() {
    window.removeEventListener('resize', this.onResizeChange, false);
  }

  // 头部面板
  @autobind
  splitTPRef(input) {
    this.topPanel = input;
  }

  // 分割区域整体
  @autobind
  panelBdRef(input) {
    this.panelWrapper = input;
  }

  // 左侧列表区域
  @autobind
  leftPanelRef(input) {
    this.leftSection = input;
  }
  // 右侧详情区域
  @autobind
  rightPanelRef(input) {
    this.rightSection = input;
  }

  // 伸缩区域
  @autobind
  stretchRef(input) {
    this.stretch = input;
  }

  render() {
    const {
      topPanel,
      leftPanel,
      rightPanel,
      isEmpty,
    } = this.props;

    const noDataClass = classnames({
      [styles.hide]: !isEmpty,
      [styles.noData]: true,
    });
    const hasDataClass = classnames({
      [styles.hide]: isEmpty,
      [styles.panelBd]: true,
    });

    return (
      <div className={styles.splitPanel}>
        <div className={styles.header} ref={this.splitTPRef}>
          {topPanel}
        </div>
        <div className={noDataClass}>
          <div className={styles.nodataBlock}>
            <img src={nodatapng} alt="nodata" />
            <div className={styles.nodataText}>暂无数据</div>
          </div>
        </div>
        <div className={hasDataClass} ref={this.panelBdRef}>
          <div className={styles.cutScreenBd}>
            <div className={styles.listScreen} ref={this.leftPanelRef}>{leftPanel}</div>
            <div className={styles.stretch} ref={this.stretchRef}>
              <Icon type="caret-left" />
            </div>
            <div className={styles.detailScreen} ref={this.rightPanelRef}>{rightPanel}</div>
          </div>
        </div>
      </div>
    );
  }
}
