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

  renderServeTime(serveTime, index) {
    if (!_.isEmpty(serveTime) && !_.isEmpty(serveTime[index])) {
      return `${serveTime[index].yearTime || ''} ${serveTime[index].dayTime || ''}`;
    }
    return '';
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
                      <div
                        className={styles.serviceTime}
                        key={`${serveTime[index].yearTime}${serveTime[index].dayTime}`}
                      >
                        <div className={styles.yearTime}>{serveTime[index].yearTime || ''}</div>
                        <div
                          className={
                            classnames({
                              [styles.activeTime]: _.includes(currentActiveIndex, String(index)),
                              [styles.dayTime]: !_.includes(currentActiveIndex, String(index)),
                              [styles.onlyDayTime]: _.isEmpty(serveTime[index].yearTime),
                            })
                          }
                        >
                          {serveTime[index].dayTime || ''}
                        </div>
                      </div>
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
                        item.taskType.indexOf('MOT') !== -1 ?
                          <div className={styles.headerLeft}>
                            {item.taskName || '--'}：{item.serveStrategy || '--'}
                          </div> :
                          <div className={styles.headerLeft}>
                            {item.taskType || '--'}：{item.activityContent || '--'}
                          </div>
                      }
                      <div className={styles.headerRight}>
                        <span>{item.serveChannel || '--'}</span>
                        <span className={styles.serviceStatus}>{item.serveStatus || '--'}</span>
                        <div
                          className={
                            classnames({
                              [styles.upIcon]: _.includes(currentActiveIndex, String(index)),
                              [styles.downIcon]: !_.includes(currentActiveIndex, String(index)),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                }
                className={styles.panelHeader}
                key={index}
              >
                <ServiceRecordContent
                  executeTypes={executeTypes}
                  item={item}
                  type={item.taskType}
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
