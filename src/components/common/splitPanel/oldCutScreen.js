/**
 * @Author: sunweibin
 * @Date: 2017-11-10 10:12:18
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-08 14:18:30
 * @description 分割组件
 * 此组件中
 * 当左侧列表组件折叠起来后，右侧详情的isFold属性将会变成true,
 * 并且在详情的外部容器组件上会多一个isCSListFold的CSS类
 * 当左侧列表组件展开起来后，右侧详情的isFold属性将会变成false,
 * 并且在详情的外部容器组件上没有isCSListFold的CSS类
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Resize from 'element-resize-detector';
import { Icon } from 'antd';

import splitConfig from './config';
import { env } from '../../../helper';

import '../../../css/react-split-pane-master.less';
import styles from './SplitPanel.less';
import nodatapng from './nodata.png';

export default class CutScreen extends PureComponent {
  static propTypes = {
    topPanel: PropTypes.element.isRequired,
    leftPanel: PropTypes.element.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    rightPanel: PropTypes.element,
    leftListClassName: PropTypes.string,
    leftWidth: PropTypes.number,
  }

  static defaultProps = {
    leftListClassName: 'pageCommonList',
    rightPanel: null,
    leftWidth: 520,
  }

  constructor(props) {
    super(props);
    this.state = {
      stretchIcon: 'caret-left',
      isFold: false, // 判断左侧列表组件是否折叠起来
    };
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
    this.initPanel();
    this.setDocumentScroll();
  }

  componentDidUpdate() {
    this.initPanel();
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
    this.setDocumentScroll();
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
    // 次变量用来判断是否在FSP系统中
    let viewHeight = document.documentElement.clientHeight;
    if (env.isIE()) {
      viewHeight -= 10;
    }
    // 因为页面在开发过程中并不存在于FSP系统中，而在生产环境下是需要将本页面嵌入到FSP系统中
    // 需要给改容器设置高度，以防止页面出现滚动
    const pageContainer = document.querySelector(splitConfig.container);
    const pageContent = document.querySelector(splitConfig.content);
    // 分割区域整体
    const panelWrapper = this.panelWrapper;
    // 左侧列表区域
    const leftPanelElm = this.leftSection;
    // 右侧详情区域
    const rightPanelElm = this.rightSection;
    // 因为左侧列表区域只滚动不包括分页器的区域，所以需要设置分页区域上面列表区域的大小
    // 左侧使用ant的table组件
    const listWrapper = leftPanelElm.querySelector('.ant-table');
    // 分割区域竖条，现在新需求中修改为三角
    const splitBarElm = this.stretch;
    // 此为头部面板的高度固定值为58px
    const topPanelHeight = this.topPanel.getBoundingClientRect().height;
    // 分页器区域所占高度
    const paginationHeight = 54;
    // 头部面板距离分割区域的高度
    const topDistance = 20;
    // 分割面板距离浏览器底部的高度
    const bottomDistance = 20;
    // FSP头部Tab的高度
    const fspTabHeight = 55;

    // 设置系统容器高度
    let pch = viewHeight;
    if (env.isInFsp()) {
      pch = viewHeight - fspTabHeight;
    }
    this.setElementStyle(pageContainer, `${pch}px`);
    this.setElementStyle(pageContent, '100%');
    // 设置分割面板的高度
    const pwh = pch - topPanelHeight;
    this.setElementStyle(panelWrapper, `${pwh}px`);
    // 设置左右分割区域的高度
    if (leftPanelElm && rightPanelElm) {
      this.setElementStyle(this.splitPanel, 'auto');
      const sectionHeight = pwh - topDistance - bottomDistance;
      this.setElementStyle(splitBarElm, `${sectionHeight}px`);
      this.setElementStyle(splitBarElm, `${sectionHeight}px`, 'lineHeight');
      this.setElementStyle(leftPanelElm, `${sectionHeight}px`);
      this.setElementStyle(rightPanelElm, `${sectionHeight}px`);
      // 并且设置左侧列表的高度
      if (listWrapper) {
        const listHeight = `${sectionHeight - paginationHeight}px`;
        this.setElementStyle(listWrapper, listHeight);
        this.setElementStyle(listWrapper, 'auto', 'overflow');
      }
    }
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
    const { leftWidth } = this.props;
    let leftSectionWidth = leftWidth;
    if (env.isIE()) {
      leftSectionWidth += 20;
    } else if (env.isFirefox()) {
      leftSectionWidth += 10;
    }
    this.setElementStyle(this.leftSection, `${leftSectionWidth}px`, 'width');
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

  @autobind
  shrinkList() {
    this.setState({
      stretchIcon: 'caret-right',
      isFold: true,
    });
    this.setElementStyle(this.leftSection, 'none', 'display');
  }

  @autobind
  growList() {
    this.setState({
      stretchIcon: 'caret-left',
      isFold: false,
    });
    this.setElementStyle(this.leftSection, 'block', 'display');
  }

  // 展开伸缩列表
  @autobind
  handleStretchIconClick() {
    const { stretchIcon } = this.state;
    if (stretchIcon === 'caret-left') {
      // 收缩列表
      this.shrinkList();
    } else {
      // 展开列表
      this.growList();
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
    const { stretchIcon, isFold } = this.state;
    const noDataClass = classnames({
      [styles.hide]: !isEmpty,
      [styles.noData]: true,
    });
    const hasDataClass = classnames({
      [styles.hide]: isEmpty,
      [styles.panelBd]: true,
    });
    const hasFoldCls = classnames({
      [styles.detailScreen]: true,
      isCSListFold: isFold,
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
              <Icon type={stretchIcon} onClick={this.handleStretchIconClick} />
            </div>
            <div className={hasFoldCls} ref={this.rightPanelRef}>
              {
                _.isEmpty(rightPanel) ? null
                : (
                  <rightPanel.type {...rightPanel.props} isFold={isFold} />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
