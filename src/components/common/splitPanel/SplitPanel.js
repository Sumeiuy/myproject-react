/**
 * @description 用于合约管理、权限管理、佣金调整的页面布局
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import splitConfig from './config';
import { getEnv } from '../../../utils/helper';
import '../../../css/react-split-pane-master.less';
import styles from './SplitPanel.less';
import nodatapng from './nodata.png';

const BROWSER = getEnv();


export default class SplitPanel extends PureComponent {

  static propTypes = {
    topPanel: PropTypes.element.isRequired,
    leftPanel: PropTypes.element.isRequired,
    rightPanel: PropTypes.element.isRequired,
    leftListClassName: PropTypes.string,
    isEmpty: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    leftListClassName: 'pageCommonList',
  }

  constructor(props) {
    super(props);
    this.state = {
      paneMinSize: 200,
      paneMaxSize: 600,
    };
  }

  componentWillMount() {
    // 当前系统
    this.UTBContentElem = document.querySelector(splitConfig.utb);
    if (this.UTBContentElem) {
      this.tabPanel = this.UTBContentElem.querySelector('tab-pane.active');
    }
  }

  componentDidMount() {
    const {
      fspSidebarHideBtn,
      fspSidebarShowBtn,
      splitPanel,
      leftPanel,
      rightPanel,
      defaultSize,
    } = splitConfig;

    // fsp系统中的左侧侧边栏显示/隐藏的按钮
    this.sidebarHide = document.querySelector(fspSidebarHideBtn);
    this.sidebarShow = document.querySelector(fspSidebarShowBtn);
    // 页面布局中内容区域的整体面板以及左右两个面板
    this.splitPanel = document.querySelector(splitPanel);
    this.leftPanel = document.querySelector(leftPanel);
    this.rightPanel = document.querySelector(rightPanel);
    // 因为内容区域为内滚动，而不滚动页面，所以需要设置列表和详情区域的高度
    this.setDocumentScroll();
    this.panMov(defaultSize);
    this.initPane();
    // 监听侧边栏显示/隐藏按钮
    this.registerSidebarToggle();
    window.addEventListener('resize', this.onResizeChange, false);
  }

  componentDidUpdate() {
    this.setDocumentScroll();
  }

  componentWillUnmount() {
    // 重置外层容器样式
    // 防止影响其他界面
    this.setUTBContentMargin('10px', '30px', '10px');
    this.resetContainerStyle();
    // 取消事件监听
    window.removeEventListener('resize', this.onResizeChange, false);
    this.removeListenerLeftMenu();
  }

  @autobind
  onResizeChange() {
    this.setDocumentScroll();
    this.initPane();
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

  // 当列表页面内容更新之后需要重新设置滚动条
  @autobind
  setDocumentScroll() {
    // 将系统的Margin设置为0;
    this.setUTBContentMargin(0, 0, 0);
    // 次变量用来判断是否在FSP系统中
    const utb = this.UTBContentElem;
    // 视口的高度
    const viewHeight = document.documentElement.clientHeight;
    // 因为页面在开发过程中并不存在于FSP系统中，而在生产环境下是需要将本页面嵌入到FSP系统中
    // 需要给改容器设置高度，以防止页面出现滚动
    const pageContainer = document.querySelector(splitConfig.container);
    const pageContent = document.querySelector(splitConfig.content);
    const panelWrapper = this.panelWrapper;
    const leftPanelElm = this.leftSection;
    const rightPanelElm = this.rightSection;
    // 因为左侧列表区域只滚动不包括分页器的区域，所以需要设置分页区域上面列表区域的大小
    // 左侧使用ant的table组件
    const listWrapper = leftPanelElm.querySelector('.ant-table');
    // 分割柱条元素，鼠标hover时会需要改变分割区域大小
    const splitBarElm = this.splitPanel.querySelector('.Resizer');
    // TODO 无数据的dom，后面需要更新
    // const nullElem = document.getElementById('empty');
    // const leftPanelList = document.querySelector(`.${this.props.leftListClassName}`);
    // const nullDivSectionElem = document.querySelector('.null_dv_section');

    // 此为头部面板的高度固定值为58px
    const topPanelHeight = 58;
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
    if (utb) {
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
      this.setElementStyle(splitBarElm, 'center', 'backgroundPosition');
      this.setElementStyle(splitBarElm, '0 0 auto', 'flex');
      this.setElementStyle(splitBarElm, 'auto');
      const sectionHeight = pwh - topDistance - bottomDistance;
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

  // 无数据的区域
  @autobind
  noDataRef(input) {
    this.emptyDiv = input;
  }

  // 左右分割区域的整体
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

   // 动态配置pane参数
  @autobind
  initPane() {
    const boxWidth = this.splitPanel.getBoundingClientRect().width;
    // Splitpanel的两个容器所占总宽度
    const totalWidth = boxWidth - 120;
    const paneaWidth = this.leftPanel.getBoundingClientRect().width;
    const minsize = totalWidth * 0.3;
    const maxsize = totalWidth * 0.6;
    const { paneboxWidth } = this.state;
    if (paneboxWidth !== boxWidth) {
      if (paneaWidth > maxsize) {
        this.leftPanel.style.width = `${maxsize}px`;
        this.panMov(maxsize);
      }
      this.setState({
        paneboxWidth: boxWidth,
        paneMaxSize: maxsize,
        paneMinSize: minsize,
      });
      if (paneaWidth > boxWidth * 0.5) {
        this.rightPanel.className = 'Pane vertical Pane2 allWidth';
      } else {
        this.rightPanel.className = 'Pane vertical Pane2';
      }
    }
  }

  // 重新给pan2样式赋值
  panMov(size) {
    if (BROWSER.$browser === 'Internet Explorer') {
      this.rightPanel.style.paddingLeft = `${size + 20}px`;
    }
  }

  @autobind
  registerSidebarToggle() {
    if (this.sildebarShow && this.sildebarShow) {
      this.sidebarHide.addEventListener('click', this.initPane, false);
      this.sidebarShow.addEventListener('click', this.initPane, false);
    }
  }

  // 取消左侧菜单控制按键事件监听
  @autobind
  removeListenerLeftMenu() {
    if (this.sildebarShow && this.sildebarShow) {
      this.sidebarHide.removeEventListener('click', this.initPane, false);
      this.sidebarShow.removeEventListener('click', this.initPane, false);
    }
  }

  // splitPan onChange回调函数
  @autobind
  panchange(size) {
    this.panMov(size);
    this.initPane();
    const boxWidth = this.splitPanel.getBoundingClientRect().width - 120;
    if (size > boxWidth * 0.5) {
      this.rightPanel.className = 'Pane vertical Pane2 allWidth';
    } else {
      this.rightPanel.className = 'Pane vertical Pane2';
    }
  }

  render() {
    const { paneMinSize, paneMaxSize } = this.state;
    const { topPanel, leftPanel, rightPanel, isEmpty } = this.props;
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
        <div className={styles.header}>
          {topPanel}
        </div>
        <div className={noDataClass} ref={this.noDataRef}>
          <div className={styles.nodataBlock}>
            <img src={nodatapng} alt="nodata" />
            <div className={styles.nodataText}>暂无数据</div>
          </div>
        </div>
        <div className={hasDataClass} ref={this.panelBdRef}>
          <div style={{ height: '100%', position: 'relative' }}>
            <SplitPane
              onChange={this.panchange}
              split="vertical"
              minSize={paneMinSize}
              maxSize={paneMaxSize}
              defaultSize={splitConfig.defaultSize}
              className="primary"
            >
              <div className={styles.leftPanel} ref={this.leftPanelRef}>{leftPanel}</div>
              <div className={styles.rightPanel} ref={this.rightPanelRef}>{rightPanel}</div>
            </SplitPane>
          </div>
        </div>
      </div>
    );
  }
}
