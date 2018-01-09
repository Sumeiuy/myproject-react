/**
 * @Author: sunweibin
 * @Date: 2017-11-10 10:12:18
 * @Last Modified by: zhushengnan
 * @Last Modified time: 2017-12-25 16:46:56
 * @description 分割组件
 * 此组件中
 * 当左侧列表组件折叠起来后，右侧详情的isFold属性将会变成true,
 * 并且在详情的外部容器组件上会多一个isCSListFold的CSS类
 * 当左侧列表组件展开起来后，右侧详情的isFold属性将会变成false,
 * 并且在详情的外部容器组件上没有isCSListFold的CSS类
 * 修改高度，用vh和flex布局，不用计算高度问题
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import { Icon } from 'antd';
import { env } from '../../../helper';

import '../../../css/react-split-pane-master.less';
import styles from './fspCutScreen.less';
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
    this.initPanel();
  }

  componentDidUpdate() {
    this.initPanel();
  }

 // 设置元素的style样式值，默认设置其height的值
 @autobind
  setElementStyle(e, v, p = 'width') {
    if (e) {
      e.style[p] = v;
    }
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


  // 左侧列表区域
  @autobind
  leftPanelRef(input) {
    this.leftSection = input;
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
        <div className={styles.header}>
          {topPanel}
        </div>
        <div className={noDataClass}>
          <div className={styles.nodataBlock}>
            <img src={nodatapng} alt="nodata" />
            <div className={styles.nodataText}>暂无数据</div>
          </div>
        </div>
        <div className={hasDataClass}>
          <div className={styles.cutScreenBd}>
            <div className={styles.listScreen} ref={this.leftPanelRef}>{leftPanel}</div>
            <div className={styles.stretch} ref={this.stretchRef}>
              <Icon type={stretchIcon} onClick={this.handleStretchIconClick} />
            </div>
            <div className={hasFoldCls}>
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
