/**
 * @file list/ModalCollapse.js
 *  折叠
 * @author xuxiaoqin
 */

import React, { PropTypes, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Collapse } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import styles from './modalCollapse.less';

const EMPTY_LIST = [];
const Panel = Collapse.Panel;

export default class ModalCollapse extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    isFirstLoad: PropTypes.bool,
    onResetFirstLoad: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: EMPTY_LIST,
    isFirstLoad: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorAction: EMPTY_LIST,
      isPanel1Open: true,
      isPanel2Open: false,
      isPanel3Open: false,
      isPanel4Open: false,
      isPanel5Open: false,
    };
  }

  componentDidMount() {
    // 当再次打开时，panelDOM已经存在，可以直接设置默认leftGuide
    if (this.panelHeader1) {
      this.resetLeftGuide({ isCollapseAll: false });
    }
  }

  componentDidUpdate() {
    const { isFirstLoad } = this.props;
    if (this.panelHeader1) {
      if (isFirstLoad) {
        this.resetLeftGuide({ isCollapseAll: false });
      }
    }
  }

  @autobind
  getDOM(index) {
    /* eslint-disable */
    switch (index) {
      case '1':
        return ReactDOM.findDOMNode(this.panelHeader1);
      case '2':
        return ReactDOM.findDOMNode(this.panelHeader2);
      case '3':
        return ReactDOM.findDOMNode(this.panelHeader3);
      case '4':
        return ReactDOM.findDOMNode(this.panelHeader4);
      default:
        return ReactDOM.findDOMNode(this.panelHeader1);
    }
    /* eslint-enable */
  }

  @autobind
  getEveryPanelOpen(index) {
    const {
      isPanel1Open,
      isPanel2Open,
      isPanel3Open,
      isPanel4Open,
      isPanel5Open,
     } = this.state;

    switch (index) {
      case 1:
        return isPanel1Open;
      case 2:
        return isPanel2Open;
      case 3:
        return isPanel3Open;
      case 4:
        return isPanel4Open;
      case 5:
        return isPanel5Open;
      default:
        return isPanel1Open;
    }
  }

  @autobind
  getRefPanel(ref, index) {
    if (ref) {
      switch (index) {
        case 0:
          return this.panelHeader1 = ref;
        case 1:
          return this.panelHeader2 = ref;
        case 2:
          return this.panelHeader3 = ref;
        case 3:
          return this.panelHeader4 = ref;
        case 4:
          return this.panelHeader5 = ref;
        default:
          return this.panelHeader1 = ref;
      }
    }
    return null;
  }

  /**
 * 处理collapse change事件
 * @param {*} currentKey 当前key
 */
  @autobind
  handleCollapseChange(currentKey) {
    // 只得到当前激活的panel key
    const { originPanelHeight } = this.state;
    const margin = 10;
    let panel1Height;
    let panel2Height;
    let panel3Height;
    let panel4Height;

    let isPanel1Open = false;
    let isPanel2Open = false;
    let isPanel3Open = false;
    let isPanel4Open = false;
    let isPanel5Open = false;

    if (_.isEmpty(currentKey)) {
      // 当前所有panel全部收起
      this.resetLeftGuide({ isCollapseAll: true });
    } else {
      // 当前激活的包含一个panel,
      // 设置其余四个panel
      setTimeout(() => {
        isPanel1Open = _.includes(currentKey, '1');
        isPanel2Open = _.includes(currentKey, '2');
        isPanel3Open = _.includes(currentKey, '3');
        isPanel4Open = _.includes(currentKey, '4');
        isPanel5Open = _.includes(currentKey, '5');

        panel1Height = isPanel1Open ? this.getDOM('1').clientHeight : originPanelHeight;
        panel2Height = isPanel2Open ? this.getDOM('2').clientHeight : originPanelHeight;
        panel3Height = isPanel3Open ? this.getDOM('3').clientHeight : originPanelHeight;
        panel4Height = isPanel4Open ? this.getDOM('4').clientHeight : originPanelHeight;

        this.setState({
          anchorAction: [
            {
              top: 15,
              status: isPanel1Open ? 1 : 0,
            },
            {
              top: panel1Height +
              (margin * 1) +
              (originPanelHeight / 2),
              status: isPanel2Open ? 1 : 0,
            },
            {
              top: panel2Height +
              panel1Height +
              (margin * 2) +
              (originPanelHeight / 2),
              status: isPanel3Open ? 1 : 0,
            },
            {
              top: panel3Height +
              panel2Height +
              panel1Height +
              (margin * 3) +
              (originPanelHeight / 2),
              status: isPanel4Open ? 1 : 0,
            },
            {
              top: panel4Height +
              panel3Height +
              panel2Height +
              panel1Height +
              (margin * 4) +
              (originPanelHeight / 2),
              status: isPanel5Open ? 1 : 0,
            },
          ],
          isPanel1Open,
          isPanel2Open,
          isPanel3Open,
          isPanel4Open,
          isPanel5Open,
        });
      }, 250);
    }
  }

  @autobind
  resetLeftGuide({ isCollapseAll }) {
    // 收起来之后，panel高度一样
    // const panelDOM1 = ReactDOM.findDOMNode(document.getElementById('panelHeader1'));
    // const panelDOM2 = ReactDOM.findDOMNode(document.getElementById('panelHeader2'));
    const panelDOM1 = this.panelHeader1;
    const panelDOM2 = this.panelHeader2;
    const margin = 10;
    let panel1Height;
    let panel2Height;
    if (panelDOM1) {
      panel1Height = ReactDOM.findDOMNode(panelDOM1).clientHeight; // eslint-disable-line
    }
    if (panelDOM2) {
      panel2Height = ReactDOM.findDOMNode(panelDOM2).clientHeight; // eslint-disable-line
    }
    const { originPanelHeight } = this.state;
    const { onResetFirstLoad } = this.props;

    if (isCollapseAll) {
      // 全部收起
      this.setState({
        // 1代表激活，0代表收起
        anchorAction: [
          {
            top: 15,
            status: 0,
          },
          {
            top: (originPanelHeight * 1) + (margin * 1) + (originPanelHeight / 2),
            status: 0,
          },
          {
            top: (originPanelHeight * 2) + (margin * 2) + (originPanelHeight / 2),
            status: 0,
          },
          {
            top: (originPanelHeight * 3) + (margin * 3) + (originPanelHeight / 2),
            status: 0,
          },
          {
            top: (originPanelHeight * 4) + (margin * 4) + (originPanelHeight / 2),
            status: 0,
          },
        ],
        // 重置panel打开状态
        isPanel1Open: false,
        isPanel2Open: false,
        isPanel3Open: false,
        isPanel4Open: false,
        isPanel5Open: false,
      });
    } else {
      // 收起其余的，保留第一个展开
      this.setState({
        // 1代表激活，0代表收起
        anchorAction: [
          {
            top: 15,
            status: 1,
          },
          {
            top: (panel1Height * 1) + (margin * 1) + (panel2Height / 2),
            status: 0,
          },
          {
            top: panel2Height + panel1Height + (margin * 2) + (panel2Height / 2),
            status: 0,
          },
          {
            top: (panel2Height * 2) + panel1Height + (margin * 3) + (panel2Height / 2),
            status: 0,
          },
          {
            top: (panel2Height * 3) + panel1Height + (margin * 4) + (panel2Height / 2),
            status: 0,
          },
        ],
        originPanelHeight: panel2Height,
        firstPanelHeight: panel1Height,
      });
      // 重置firstLoad
      onResetFirstLoad();
    }
  }

  @autobind
  constructLeftServiceTimeSection(timeArray) {
    const { anchorAction } = this.state;

    if (_.isEmpty(anchorAction) || _.isEmpty(timeArray)) {
      return null;
    }
    const serviceTimeCollection = this.separateDate(timeArray);
    return _.map(anchorAction, (item, index) =>
      <div
        style={{
          top: serviceTimeCollection[index].yearTime ? item.top - 20 : item.top - 10,
          left: serviceTimeCollection[index].yearTime ? -95 : -80,
        }}
        className={styles.serviceTime}
        key={`ServiceTime${item.top}`}
      >
        <div className={styles.yearTime}>{serviceTimeCollection[index].yearTime || ''}</div>
        <div
          className={
            classnames({
              [styles.activeTime]: item.status === 1, // panel激活
              [styles.dayTime]: true,
            })
          }
        >{serviceTimeCollection[index].dayTime || ''}</div>
      </div>,
    );
  }

  /**
  * 分割时间，同一天的保留一个年月日，其余都是时分秒
  * 不同一天，保留年月日时分秒
  */
  separateDate(serviceTimeCollection) {
    let currentDate = moment(serviceTimeCollection[0]).date();
    const newDate = [{
      yearTime: serviceTimeCollection[0].substring(0, 10),
      dayTime: serviceTimeCollection[0].substring(11),
    }];
    let tempDate;
    _.forEach(serviceTimeCollection, (item, index) => {
      if (index !== 0) {
        tempDate = moment(item).date();
        if (tempDate === currentDate) {
          newDate.push({
            yearTime: '',
            dayTime: item.length > 10 ? item.substring(11) : '',
          });
        } else {
          currentDate = tempDate;
          newDate.push({
            yearTime: item.substring(0, 10),
            dayTime: item.length > 10 ? item.substring(11) : '',
          });
        }
      }
    });

    return newDate;
  }

  @autobind
  constructAnchor() {
    const { anchorAction } = this.state;
    if (_.isEmpty(anchorAction)) {
      return null;
    }

    return _.map(anchorAction, item =>
      <span
        style={{
          top: item.top,
        }}
        key={`AnchorFlag${item.top}`}
        className={
          classnames({
            [styles.hidden]: item.status === 0,
            [styles.visible]: item.status === 1,
          })
        }
      />,
    );
  }

  constructPanel(dataSource) {
    if (_.isEmpty(dataSource)) {
      return null;
    }

    let count = 0;
    return _.map(dataSource, (item, index) => {
      if (item.handlerType === 'Mission') {
        count++;
        return (
          <Panel
            header={
              <div className={styles.headerContainer}>
                <div className={styles.headerLeft}>{item.taskName || '--'}：{item.serveStrategy || '--'}</div>
                <div className={styles.headerRight}>
                  <span>{item.serveChannel || '--'}</span>
                  {/*
                  <span className={styles.distance}>-</span>
                  <span>电话</span>
                  */}
                  <span className={styles.serviceStatus}>{item.serveStatus || '--'}</span>
                  <div
                    className={
                      classnames({
                        [styles.upIcon]: this.getEveryPanelOpen(count),
                        [styles.downIcon]: !this.getEveryPanelOpen(count),
                      })
                    }
                  />
                </div>
              </div>
            }
            key={count}
            className={styles.panelHeader}
            id={`panelHeader${count}`}
            ref={ref => this.getRefPanel(ref, index)}
          >
            <div className={styles.serviceContainer} id="serviceContainer">
              <div className={styles.leftSection}>
                <div className={styles.leftModule}>
                  <span>任务名</span>
                  <span>{item.taskName || '--'}</span>
                </div>
                <div className={styles.leftModule}>
                  <span>任务描述</span>
                  <span>{item.taskDesc || '--'}</span>
                </div>
                <div className={styles.leftModule}>
                  <span>任务类型</span>
                  <span>{item.taskType || '--'}</span>
                </div>
                <div className={styles.leftModule}>
                  <span>执行方式</span>
                  <span>{item.handlerType || '--'}</span>
                </div>
                <div className={styles.leftModule}>
                  <span>处理期限</span>
                  <span>{item.handlerTimeLimit || '--'}</span>
                </div>
              </div>
              <div className={styles.rightSection}>
                <div className={styles.rightModule}>
                  <span>实施者</span>
                  <span>{item.actor || '--'}</span>
                </div>
                <div className={styles.rightModule}>
                  <span>服务记录</span>
                  <span>{item.serveRecord || '--'}</span>
                </div>
                <div className={styles.rightModule}>
                  <span>客户反馈</span>
                  <span>{item.custFeedback || '--'}</span>
                </div>
                <div className={styles.rightModule}>
                  <span>反馈时间</span>
                  <span>{item.feedbackTime || '--'}</span>
                </div>
                <div className={styles.rightModule}>
                  <span>反馈结果</span>
                  <span>{item.workResult || '--'}</span>
                </div>
              </div>
            </div>
          </Panel>
        );
      }

      count++;
      return (
        <Panel
          header={
            <div className={styles.headerContainer}>
              <div className={styles.headerLeft}>{item.taskType || '--'}：{item.activityContent || '--'}</div>
              <div className={styles.headerRight}>
                <span>{item.serveChannel || '--'}</span>
                {/*
                <span className={styles.distance}>-</span>
                <span>电话</span>
                */}
                <span className={styles.serviceStatus}>{item.serveStatus || '--'}</span>
                <div
                  className={
                    classnames({
                      [styles.upIcon]: this.getEveryPanelOpen(count),
                      [styles.downIcon]: !this.getEveryPanelOpen(count),
                    })
                  }
                />
              </div>
            </div>
          }
          key={count}
          className={styles.panelHeader}
          id={`panelHeader${count}`}
        >
          <div className={styles.serviceContainer} id="serviceContainer">
            <div className={styles.leftSection}>
              <div className={styles.leftModule}>
                <span>类型</span>
                <span>{item.handlerType || '--'}</span>
              </div>
              <div className={styles.leftModule}>
                <span>活动内容</span>
                <span>{item.activityContent || '--'}</span>
              </div>
              <div className={styles.leftModule}>
                <span>实施者</span>
                <span>{item.actor || '--'}</span>
              </div>
              <div className={styles.leftModule}>
                <span>服务记录</span>
                <span>{item.serveRecord || '--'}</span>
              </div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.rightModule}>
                <span>客户反馈</span>
                <span>{item.custFeedback || '--'}</span>
              </div>
              <div className={styles.rightModule}>
                <span>反馈时间</span>
                <span>{item.feedbackTime || '--'}</span>
              </div>
              <div className={styles.rightModule}>
                <span>反馈结果</span>
                <span>{item.workResult || '--'}</span>
              </div>
            </div>
          </div>
        </Panel>
      );
    });
  }

  render() {
    const {
      data = EMPTY_LIST,
     } = this.props;

    const { anchorAction } = this.state;

    if (_.isEmpty(data)) {
      return (
        <div>
          <div className={styles.nodata}>
            <div className={styles.imgData} />
          </div>
          <div className={styles.noInfo}>没有相关服务记录</div>
        </div>
      );
    }

    // 左边服务时间字段
    const serveTimeCollection = _.filter(data, item => !_.isEmpty(item.serveTime)) || EMPTY_LIST;

    const PanelDOM = this.constructPanel(data);

    return (
      <Collapse
        className={styles.serviceCollapse}
        defaultActiveKey={'1'}
        onChange={this.handleCollapseChange}
      >
        {
          !_.isEmpty(anchorAction) ?
            <div className={styles.leftAnchor}>
              <div className={styles.serviceTimeSection}>
                {
                  this.constructLeftServiceTimeSection(serveTimeCollection)
                }
              </div>
              {
                this.constructAnchor()
              }
            </div>
            : null
        }
        {PanelDOM}
      </Collapse>
    );
  }
}
