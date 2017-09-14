import React, { PropTypes, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Collapse } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import styles from './modalCollapse.less';
// import emptyImg from '../../../../static/images/empty.png';

const EMPTY_LIST = [];
const Panel = Collapse.Panel;

export default class ModalCollapse extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    anchorAction: PropTypes.array,
    onCollapseChange: PropTypes.func.isRequired,
    isPanel1Open: PropTypes.bool.isRequired,
    isPanel2Open: PropTypes.bool.isRequired,
    isPanel3Open: PropTypes.bool.isRequired,
    isPanel4Open: PropTypes.bool.isRequired,
    isPanel5Open: PropTypes.bool.isRequired,
    setDefaultLeftGuide: PropTypes.func.isRequired,
    isFirstLoad: PropTypes.bool,
  };

  static defaultProps = {
    data: EMPTY_LIST,
    anchorAction: EMPTY_LIST,
    isFirstLoad: true,
  };

  componentDidMount() {
    const { setDefaultLeftGuide } = this.props;
    const panelDOM = ReactDOM.findDOMNode(document.getElementById('panelHeader1')); // eslint-disable-line
    // 当再次打开时，panelDOM已经存在，可以直接设置默认leftGuide
    if (panelDOM) {
      setDefaultLeftGuide({ isCollapseAll: false });
    }
  }

  componentDidUpdate() {
    const { setDefaultLeftGuide, isFirstLoad } = this.props;
    const panelDOM = ReactDOM.findDOMNode(document.getElementById('panelHeader1')); // eslint-disable-line
    if (panelDOM && isFirstLoad) {
      setDefaultLeftGuide({ isCollapseAll: false });
    }
  }

  @autobind
  getEveryPanelOpen(index) {
    const {
      isPanel1Open,
      isPanel2Open,
      isPanel3Open,
      isPanel4Open,
      isPanel5Open,
     } = this.props;

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
  constructLeftServiceTimeSection(timeArray) {
    const { anchorAction } = this.props;

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
    const { anchorAction } = this.props;
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
    return _.map(dataSource, (item) => {
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
      anchorAction,
      onCollapseChange,
      data = EMPTY_LIST,
     } = this.props;

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
        onChange={onCollapseChange}
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
