import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Collapse } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import styles from './modalCollapse.less';

// const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const Panel = Collapse.Panel;

export default class ModalCollapse extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    activeKey: PropTypes.string,
    anchorAction: PropTypes.array,
    onCollapseChange: PropTypes.func.isRequired,
    isPanel1Open: PropTypes.bool.isRequired,
    isPanel2Open: PropTypes.bool.isRequired,
    isPanel3Open: PropTypes.bool.isRequired,
    isPanel4Open: PropTypes.bool.isRequired,
    isPanel5Open: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    data: EMPTY_LIST,
    activeKey: '1',
    anchorAction: EMPTY_LIST,
  };

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
    // const timeArray = [
    //   '2017/07/28 15:55:46',
    //   '2017/07/28 15:55:46',
    //   '2017/07/29 15:55:46',
    //   '2017/07/30 15:55:46',
    //   '2017/07/30 15:55:46',
    // ];
    const serviceTimeCollection = this.separateDate(timeArray);

    if (_.isEmpty(anchorAction)) {
      return null;
    }
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
    // "taskName": "新规_新股上市提醒",
    // "taskDesc": "新股上市提醒，新股上市提醒...",
    // "taskType": "MOT任务",
    // "handlerType": "Mission",
    // "handlerTimeLimit": "2017/07/20-2017/07/23",
    // "actor": "李四",
    // "custFeedback": "继续持有继续持有",
    // "feedbackTime": "2017/09/08",
    // "serveStatus": null,
    // "workResult": "预约下次",
    // "serveChannel": null,
    // "serveStrategy": null,
    // "serveRecord": "沟通顺畅",
    // "activityContent": null

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
                  <span className={styles.distance}>-</span>
                  <span>电话</span>
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
                <div className={styles.taskNameSection}>
                  <span>任务名</span>
                  <span>{item.taskName || '--'}</span>
                </div>
                <div className={styles.taskContent}>
                  <span>任务描述</span>
                  <span>{item.taskDesc || '--'}</span>
                </div>
                <div className={styles.taskType}>
                  <span>任务类型</span>
                  <span>{item.taskType || '--'}</span>
                </div>
                <div className={styles.excuteType}>
                  <span>执行方式</span>
                  <span>{item.handlerType || '--'}</span>
                </div>
                <div className={styles.handleTime}>
                  <span>处理期限</span>
                  <span>{item.handlerTimeLimit || '--'}</span>
                </div>
              </div>
              <div className={styles.rightSection}>
                <div className={styles.actionOwner}>
                  <span>实施者</span>
                  <span>{item.actor || '--'}</span>
                </div>
                <div className={styles.serviceRecord}>
                  <span>服务记录</span>
                  <span>{item.serveRecord || '--'}</span>
                </div>
                <div className={styles.custFeedback}>
                  <span>客户反馈</span>
                  <span>{item.custFeedback || '--'}</span>
                </div>
                <div className={styles.feedbackTime}>
                  <span>反馈时间</span>
                  <span>{item.feedbackTime || '--'}</span>
                </div>
                <div className={styles.result}>
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
              <div className={styles.headerLeft}>{item.taskName || '--'}：{item.serveStrategy || '--'}</div>
              <div className={styles.headerRight}>
                <span>{item.serveChannel || '--'}</span>
                <span className={styles.distance}>-</span>
                <span>电话</span>
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
              <div className={styles.typeP}>
                <span>类型</span>
                <span>{item.handlerType || '--'}</span>
              </div>
              <div className={styles.actionContentP}>
                <span>活动内容</span>
                <span>{item.activityContent || '--'}</span>
              </div>
              <div className={styles.actionOwnerP}>
                <span>实施者</span>
                <span>{item.actor || '--'}</span>
              </div>
              <div className={styles.serviceRecordP}>
                <span>服务记录</span>
                <span>{item.serveRecord || '--'}</span>
              </div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.custFeedbackP}>
                <span>客户反馈</span>
                <span>{item.custFeedback || '--'}</span>
              </div>
              <div className={styles.feedbackTimeP}>
                <span>反馈时间</span>
                <span>{item.feedbackTime || '--'}</span>
              </div>
              <div className={styles.resultP}>
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
      activeKey,
      anchorAction,
      onCollapseChange,
      data = EMPTY_LIST,
     } = this.props;

    if (!data) {
      return null;
    }

    const feedbackTimeArray = _.map(data, item => item.feedbackTime);

    const PanelDOM = this.constructPanel(data);

    return (
      <Collapse
        className={styles.serviceCollapse}
        defaultActiveKey={activeKey}
        onChange={onCollapseChange}
      >
        {
          !_.isEmpty(anchorAction) ?
            <div className={styles.leftAnchor}>
              <div className={styles.serviceTimeSection}>
                {
                  this.constructLeftServiceTimeSection(feedbackTimeArray)
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
