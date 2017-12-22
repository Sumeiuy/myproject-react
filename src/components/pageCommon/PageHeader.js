/**
 * @fileOverview components/pageCommon/PageHeader.js
 * @author sunweibin
 * @description 用于业绩页面头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Row, Alert, Select } from 'antd';
import moment from 'moment';

import CustRange from './CustRange2';
import BoardSelect from './BoardSelect';
import { fspContainer, optionsMap, constants } from '../../config';
import DurationSelect from './DurationSelect';
import { dom } from '../../helper';
// 选择项字典
import styles from './PageHeader.less';

const Option = Select.Option;
const fsp = document.querySelector(fspContainer.container);
const showBtn = document.querySelector(fspContainer.showBtn);
const hideBtn = document.querySelector(fspContainer.hideBtn);
const contentWrapper = document.getElementById('workspace-content');
const marginWidth = fspContainer.marginWidth;
const marginLeftWidth = fspContainer.marginLeftWidth;
const summaryTypeSelect = optionsMap.summaryTypeSelect;
// 汇报关系的汇总方式
const hbgxSummaryType = constants.hbgxSummaryType;
// 时间格式化样式
const formatTxt = 'YYYYMMDD';

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
    newVisibleBoards: PropTypes.array,
    preView: PropTypes.bool,
    reportName: PropTypes.string,
    orgId: PropTypes.string,
    initialData: PropTypes.object.isRequired,
    updateOrgTreeValue: PropTypes.func.isRequired,
  }

  static defaultProps = {
    custRange: [],
    visibleBoards: [],
    newVisibleBoards: [],
    preView: false,
    reportName: '',
    orgId: '',
  }
  constructor(props) {
    super(props);
    let contentWidth;
    let scrollX;
    let leftWidth;
    if (fsp) {
      contentWidth = dom.getCssStyle(contentWrapper, 'width');
      scrollX = window.scrollX;
      leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    }
    this.state = {
      width: fsp ? `${parseInt(contentWidth, 10) - marginWidth}px` : '100%',
      top: fsp ? '55px' : 0,
      left: fsp ? `${leftWidth - scrollX}px` : 0,
      summaryTypeValue: hbgxSummaryType,
    };
  }

  componentDidMount() {
    this.didMountAddEventListener();
  }
  componentWillUnmount() {
    if (fsp) {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onWindowResize);
      showBtn.removeEventListener('click', this.toggleLeft);
      hideBtn.removeEventListener('click', this.toggleLeft);
    }
  }
  // resize 事件
  @autobind
  onWindowResize() {
    const contentWidth = dom.getCssStyle(contentWrapper, 'width');
    this.setState({
      width: fsp ? `${parseInt(contentWidth, 10) - marginWidth}px` : '100%',
    });
  }
  // 监听页面滚动事件，设置头部的 left 值
  @autobind
  onScroll() {
    const scrollX = window.scrollX;
    const leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    this.setState({
      left: leftWidth - scrollX,
    });
  }
  // didmount 时添加监听事件
  @autobind
  didMountAddEventListener() {
    // 如果在 FSP 里，则添加监听事件
    if (fsp) {
      this.onWindowResize();
      this.addEventListenerClick();
      window.addEventListener('scroll', this.onScroll, false);
      window.addEventListener('resize', this.onWindowResize, false);
      const leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
      this.setState({
        left: leftWidth,
      });
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
    const leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    this.onWindowResize();
    this.setState({
      left: leftWidth,
    });
  }

  // 汇总方式切换,按绩效视图汇总，按组织机构汇总
  @autobind
  handleSummaryTypeChange(v) {
    this.setState({ summaryTypeValue: v });
    this.props.updateOrgTreeValue(v);
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
      newVisibleBoards,
      updateQueryState,
      orgId,
      collectBoardSelect,
      collectCustRange,
      collectDurationSelect,
      initialData,
    } = this.props;
    const { top, left, width, summaryTypeValue } = this.state;
    const maxDataDt = initialData.maxDataDt;
    // 汇总方式的切换是否显示
    const summaryTypeIsShow = initialData.summaryTypeIsShow;
    // 后台返回有数据的最大时间
    const maxDataSeconds = moment(maxDataDt, formatTxt).valueOf();
    // 当前日期减1天
    const momentDataSeconds = moment().subtract(1, 'days').valueOf();
    return (
      <div>
        <div
          style={{
            position: 'fixed',
            zIndex: 30,
            width,
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
                      newVisibleBoards={newVisibleBoards}
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
                  initialData={initialData}
                  custRange={custRange}
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
                {/* 汇总方式切换 */}
                {
                  summaryTypeIsShow ?
                    <div className={styles.SummaryTypeSelect}>
                      <div className={styles.vSplit} />
                      <Select
                        style={{ width: 150 }}
                        value={summaryTypeValue}
                        onChange={this.handleSummaryTypeChange}
                      >
                        {
                          summaryTypeSelect.map((item, index) => {
                            const summaryTypeIndex = `summaryType-${index}`;
                            return (
                              <Option
                                key={summaryTypeIndex}
                                value={item.value}
                              >
                                  按{item.name}
                              </Option>
                            );
                          })
                        }
                      </Select>
                    </div>
                  :
                  null
                }
              </div>
            </Row>
            {
              maxDataSeconds < momentDataSeconds ?
                <Alert
                  message="提示"
                  description="因当前数据后台未核算完成，目前展现的是前一日的数据"
                  type="warning"
                  closable
                  showIcon
                /> :
              null
            }
          </div>
        </div>
        <div style={{ height: '40px' }} />
      </div>
    );
  }
}
