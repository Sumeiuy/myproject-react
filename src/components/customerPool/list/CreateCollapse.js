/**
 * @file list/CreateCollapse.js
 *  折叠
 * @author xuxiaoqin
 */

import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Collapse, Steps } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import ServiceRecordContent from './ServiceRecordContent';
import styles from './createCollapse.less';

const EMPTY_LIST = [];
const Panel = Collapse.Panel;
const Step = Steps.Step;

export default class CreateCollapse extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
  };

  static defaultProps = {
    data: EMPTY_LIST,
  };

  constructor(props) {
    super(props);
    this.isClosePanel = {};
    this.state = {
      currentActiveIndex: [{
        key: 0,
      }],
      currentStep: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    const { data: nextData = EMPTY_LIST } = nextProps;
    if (data !== nextData) {
      _.forEach(nextData, (item, index) => {
        if (index === 0) {
          this.isClosePanel[`key${index}`] = false;
        } else {
          this.isClosePanel[`key${index}`] = true;
        }
      });
    }
    this.setState({
      isClosePanel: this.isClosePanel,
    });
  }

  /**
   * 处理collapse change事件
   * @param {*} currentKey 当前key
   */
  @autobind
  handleCollapseChange(currentKey, index) {
    if (currentKey.length === 1) {
      // 关闭状态
      this.setState({
        currentStep: -1,
        isClosePanel: {
          ...this.state.isClosePanel,
          [`key${index}`]: true,
        },
      });
    } else {
      // 打开状态
      this.setState({
        currentStep: index,
        isClosePanel: {
          ...this.state.isClosePanel,
          [`key${index}`]: false,
        },
      });
    }
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
    const { data } = this.props;
    const { currentStep, isClosePanel } = this.state;
    if (_.isEmpty(data)) {
      return null;
    }

    return (
      <div className={styles.panelContainer}>
        <Steps
          current={currentStep}
          direction={'vertical'}
          className={styles.stepCollection}
          ref={ref => (this.stepElem = ref)}
        >
          {
            _.map(data, (item, index) =>
              <Step
                progressDot
                size="small"
                title={this.renderServeTime(serveTime, index)}
                key={item.id}
                className={styles.stepItem}
                description={
                  <div>
                    <Collapse
                      className={styles.serviceCollapse}
                      defaultActiveKey={'1'}
                      onChange={currentKey => this.handleCollapseChange(currentKey, index)}
                    >
                      <Panel
                        header={
                          <div className={styles.headerContainer}>
                            {
                              item.handlerTyp === 'Mission' ?
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
                                    [styles.upIcon]: !isClosePanel[`key${index}`],
                                    [styles.downIcon]: isClosePanel[`key${index}`],
                                  })
                                }
                              />
                            </div>
                          </div>
                        }
                        className={styles.panelHeader}
                      >
                        <ServiceRecordContent
                          item={item}
                          styles={styles}
                          type={item.handlerType}
                        />
                      </Panel>
                    </Collapse>
                  </div>
                }
              />,
            )
          }
        </Steps>
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
