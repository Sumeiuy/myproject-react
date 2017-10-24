/**
 * @file list/CreateCollapse.js
 *  折叠
 * @author xuxiaoqin
 */

import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Collapse } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import ServiceRecordContent from './ServiceRecordContent';
import styles from './createCollapse.less';

const EMPTY_LIST = [];
const Panel = Collapse.Panel;

export default class CreateCollapse extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    executeTypes: PropTypes.array.isRequired,
    serveWay: PropTypes.array.isRequired,
  };

  static defaultProps = {
    data: EMPTY_LIST,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentActiveIndex: ['0'],
    };
  }

  /**
   * 处理collapse change事件
   * @param {*} currentKey 当前key
   */
  @autobind
  handleCollapseChange(currentKey) {
    this.setState({
      currentActiveIndex: currentKey,
    });
  }

  /**
  * 分割时间，同一天的保留一个年月日，其余都是时分秒
  * 不同一天，保留年月日时分秒
  */
  separateDate(serviceTime) {
    if (_.isEmpty(serviceTime)) {
      return null;
    }

    const serviceTimeCollection = _.map(serviceTime, item => item.serveTime);

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

  // /**
  //  * 格式化服务渠道
  //  * @param {*} serveChannel 服务渠道
  //  */
  // formatServeStrategy(serveChannel) {
  //   const { serveWay } = this.props;
  //   const item = _.find(serveWay, i => i.key === serveChannel);
  //   if (item) {
  //     return item.value;
  //   }
  //   return serveChannel;
  // }

  renderHeaderLeft(item) {
    if (_.isEmpty(item)) {
      return null;
    }

    if (!_.isEmpty(item.taskType)) {
      if (item.taskType.indexOf('MOT') !== -1) {
        // MOT任务
        return (
          <div
            className={styles.headerLeft}
            title={`${item.taskName || '--'}：${item.serveRecord || '--'}`}
          >
            {item.taskName || '--'}：{item.serveRecord || '--'}
          </div>
        );
      } else if (item.taskType.indexOf('MOT') === -1 && item.taskType.indexOf('OCRM') !== -1) {
        // 不是MOT任务，但是是从OCRM来的
        return (
          <div
            className={styles.headerLeft}
            title={`${item.taskType || '--'}：${item.serveRecord || '--'}`}
          >
            {item.taskType || '--'}：{item.serveRecord || '--'}
          </div>
        );
      }

      return (
        <div
          className={styles.headerLeft}
        >
          -- ： --
      </div>
      );
    }

    return (
      <div
        className={styles.headerLeft}
      >
        -- ：--
      </div>
    );
  }

  renderHeaderRight(item, currentActiveIndex, index) {
    if (_.isEmpty(item)) {
      return null;
    }

    if (!_.isEmpty(item.taskType) && item.taskType.indexOf('MOT System') !== -1) {
      // 从MOT系统来，没有活动方式
      return (
        <div className={styles.headerRight}>
          <span>{this.renderServiceRecordSource(item)}</span>
          <div
            className={
              classnames({
                [styles.upIcon]: _.includes(currentActiveIndex, String(index)),
                [styles.downIcon]: !_.includes(currentActiveIndex, String(index)),
              })
            }
          />
        </div>
      );
    }

    return (
      <div className={styles.headerRight}>
        {/* 来源 */}
        <span>{this.renderServiceRecordSource(item)}</span>
        <span> - </span>
        {/* 活动方式 */}
        <span className={styles.activityType}>{item.activityType || '--'}</span>
        <div
          className={
            classnames({
              [styles.upIcon]: _.includes(currentActiveIndex, String(index)),
              [styles.downIcon]: !_.includes(currentActiveIndex, String(index)),
            })
          }
        />
      </div>
    );
  }

  renderServiceRecordSource(item) {
    // 来源
    if (_.isEmpty(item)) {
      return '--';
    }
    if (!_.isEmpty(item.taskType) && item.taskType.indexOf('MOT') !== -1) {
      return 'MOT任务';
    } else if (!_.isEmpty(item.serveChannel) && item.serveChannel.indexOf('经理') !== -1) {
      return '自建任务';
    }

    return (item.serveChannel === '短信' || item.serveChannel === '短信新') ? '短信' : (item.serveChannel || '--');
  }

  renderPanel(serveTime) {
    const { data, executeTypes } = this.props;
    const { currentActiveIndex } = this.state;

    if (_.isEmpty(data)) {
      return null;
    }

    return (
      <div className={styles.panelContainer}>
        <Collapse
          /* 只打开一个panel */
          accordion
          className={styles.serviceCollapse}
          defaultActiveKey={['0']}
          onChange={this.handleCollapseChange}
        >
          {
            _.map(data, (item, index) =>
              <Panel
                header={
                  <div className={styles.headerContainer}>
                    <div>
                      {
                        !_.isEmpty(serveTime) ?
                          <div
                            className={styles.serviceTime}
                            key={`${serveTime[index].yearTime}${serveTime[index].dayTime}`}
                          >
                            <div className={styles.yearTime}>{serveTime[index].yearTime || ''}</div>
                            <div
                              className={
                                classnames({
                                  [styles.activeTime]: _.includes(currentActiveIndex,
                                    String(index)),
                                  [styles.dayTime]: !_.includes(currentActiveIndex,
                                    String(index)),
                                  [styles.onlyDayTime]: _.isEmpty(serveTime[index].yearTime),
                                })
                              }
                            >
                              {serveTime[index].dayTime || ''}
                            </div>
                          </div> : null
                      }
                      <div className={styles.leftAnchor}>
                        <span
                          className={
                            classnames({
                              [styles.hidden]: !_.includes(currentActiveIndex, String(index)),
                              [styles.visible]: _.includes(currentActiveIndex, String(index)),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.collapsePanel}>
                      {
                        this.renderHeaderLeft(item)
                      }
                      {
                        this.renderHeaderRight(item, currentActiveIndex, index)
                      }
                    </div>
                  </div>
                }
                className={styles.panelHeader}
                key={index}
              >
                <ServiceRecordContent
                  executeTypes={executeTypes}
                  item={item}
                />
              </Panel>,
            )
          }
        </Collapse>
      </div>
    );
  }

  render() {
    const {
      data = EMPTY_LIST,
     } = this.props;

    if (_.isEmpty(data)) {
      return (
        <div className={styles.noServiceRecord}>无服务记录</div>
      );
    }

    // 左边服务时间字段
    const serveTimeCollection = _.filter(data, item => !_.isEmpty(item.serveTime)) || EMPTY_LIST;

    const serveTime = this.separateDate(serveTimeCollection);

    return (
      <div className={styles.collapseContainer}>
        {
          this.renderPanel(serveTime)
        }
      </div>
    );
  }
}
