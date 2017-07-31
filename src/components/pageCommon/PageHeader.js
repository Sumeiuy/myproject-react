/**
 * @fileOverview components/pageCommon/PageHeader.js
 * @author sunweibin
 * @description 用于业绩页面头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Row } from 'antd';

import CustRange from './CustRange2';
import BoardSelect from './BoardSelect';
import { fspContainer } from '../../config';
import DurationSelect from './DurationSelect';
import { getCssStyle } from '../../utils/helper';
// 选择项字典
import styles from './PageHeader.less';

const fsp = document.querySelector(fspContainer.container);
const showBtn = document.querySelector(fspContainer.showBtn);
const hideBtn = document.querySelector(fspContainer.hideBtn);
const contentWrapper = document.getElementById('workspace-content');

export default class PageHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    collectBoardSelect: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    collectDurationSelect: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    visibleBoards: PropTypes.array,
    preView: PropTypes.bool,
    reportName: PropTypes.string,
    orgId: PropTypes.string,
  }

  static defaultProps = {
    custRange: [],
    visibleBoards: [],
    preView: false,
    reportName: '',
    orgId: '',
  }
  constructor(props) {
    super(props);
    this.state = {
      top: fsp ? '55px' : 0,
      left: fsp ? '248px' : 0,
    };
  }

  componentDidMount() {
    // 如果在 FSP 里，则添加监听事件
    if (fsp) {
      this.addEventListenerClick();
    }
  }

  // 监听 FSP 侧边栏显示隐藏按钮点击事件
  @autobind
  addEventListenerClick() {
    showBtn.addEventListener('click', this.toggleLeft, false);
    hideBtn.addEventListener('click', this.toggleLeft, false);
  }
  // 检测到 FSP 侧边栏显示隐藏按钮点击事件后，根据项目的容器改变 left 值
  @autobind
  toggleLeft() {
    this.setState({
      left: getCssStyle(contentWrapper, 'left'),
    });
  }
  render() {
    const {
      preView,
      reportName,
      replace,
      push,
      custRange,
      location,
      visibleBoards,
      updateQueryState,
      orgId,
      collectBoardSelect,
      collectCustRange,
      collectDurationSelect,
    } = this.props;
    const { top, left } = this.state;
    return (
      <div>
        <div
          style={{
            position: 'fixed',
            zIndex: 30,
            right: 0,
            top,
            left,
          }}
        >
          <div className="reportHeader">
            <Row type="flex" justify="start" align="middle">
              <div className="reportName">
                {/* 需要针对预览页面做调整 */}
                {
                  preView
                  ?
                  (
                    <div className="preView">
                      {reportName}
                    </div>
                  )
                  :
                  (
                    <BoardSelect
                      location={location}
                      push={push}
                      replace={replace}
                      visibleBoards={visibleBoards}
                      collectData={collectBoardSelect}
                    />
                  )
                }
              </div>
              <div className={styles.reportHeaderRight}>
                <DurationSelect
                  location={location}
                  replace={replace}
                  updateQueryState={updateQueryState}
                  collectData={collectDurationSelect}
                />
                <div className={styles.vSplit} />
                {/* 营业地址选择项 */}
                <CustRange
                  custRange={custRange}
                  location={location}
                  replace={replace}
                  updateQueryState={updateQueryState}
                  orgId={orgId}
                  collectData={collectCustRange}
                />
              </div>
            </Row>
          </div>
        </div>
        <div style={{ height: '40px' }} />
      </div>
    );
  }
}
