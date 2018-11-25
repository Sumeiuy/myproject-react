/*
 * @Author: zhufeiyang
 * @Date: 2018-11-19 11:11:19
 * @Last Modified by: zhufeiyang
 * @Last Modified time: 2018-11-22 16:14:50
 * @description 新版360服务记录
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Collapse, Icon } from 'antd';
import classnames from 'classnames';
import logable from '../../decorators/logable';
import ServiceRecordContent from './ServiceRecordContent';
import IfTableWrap from '../common/IfTableWrap';

import styles from './serviceLogList.less';

const Panel = Collapse.Panel;

export default class ServiceLogList extends PureComponent {
  static propsType = {
    serviceLogList: PropTypes.array,
    filesList: PropTypes.array,
    executeTypes: PropTypes.array.isRequired,
    getCeFileList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    serviceLogList: [],
    filesList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '',
    };
  }

  // 将 [{}, {}, {}, {}]转换为 [{ date: 2018-11-18, logList: []}]
  // 数据按日期进行分组
  getserviceLogMap() {
    let serviceLogMap = [];
    const { serviceLogList } = this.props;
    _.each(serviceLogList, item => {
      if(item) {
        const currentLog = _.find(serviceLogMap, log => log.date === item.feedbackTime);
        if(currentLog) {
          currentLog.logList = _.concat(currentLog.logList, item);
        } else {
          serviceLogMap = _.concat(serviceLogMap, {
            date: item.feedbackTime,
            logList: [item],
          });
        }
      }
    });
    return serviceLogMap;
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '折叠面板' } })
  handleCollapseChange(key) {
    const { serviceLogList, getCeFileList } = this.props;
    const { activeKey } = this.state;
    if(!key || activeKey === key) { // 折叠当前的服务记录面板
      this.setState({
        activeKey: 'close',
      });
    } else {
      // 找到当前key对应的服务记录
      const currentServiceLog = _.find(serviceLogList, log => log.id === key);
      if(currentServiceLog) {
        const { uuid } = currentServiceLog;
        if (!_.isEmpty(uuid)) {
          getCeFileList({ attachment: uuid });
        }
      } else {
        console.error('没有找到对应的服务记录');
      }
      this.setState({
        activeKey: key,
      });
    }
  }

  renderTimeHeader(time) {
    // 转化显示的时间格式
    const timeFormat = time.replace(/\//g, '-');
    return (
      <div className={styles.timeHeader}>{timeFormat}</div>
    );
  }

  renderHeaderLeft(item) {
    if (_.isEmpty(item)) {
      return null;
    }

    if (!_.isEmpty(item.subtypeCd) && item.subtypeCd.indexOf('MOT服务记录') === -1) {
      // 不是MOT任务，但是是从OCRM来的
      return (
        <span
          className={styles.headerLeft}
          title={`${item.subtypeCd || ''}：${item.serveRecord || ''}`}
        >
          {_.isEmpty(item.subtypeCd) ? '' : `${item.subtypeCd}：`}{item.serveRecord || ''}
        </span>
      );
    }
    // MOT服务记录
    // MOT系统来的，短信、呼叫中心
    return (
      <span
        className={styles.headerLeft}
        title={`${item.taskName || ''}：${item.serveRecord || ''}`}
      >
        {_.isEmpty(item.taskName) ? '' : `${item.taskName}：`}{item.serveRecord || ''}
      </span>
    );
  }

  renderHeaderRight(item, defaultActiveKey) {
    const { activeKey } = this.state;
    if (_.isEmpty(item)) {
      return null;
    }

    if (_.isEmpty(item.subtypeCd)) {
      // 从MOT系统来，没有活动方式
      return (
        <span>{item.serveChannel || '--'}</span>
      );
    }

    let type = 'down';

    if(!activeKey) {
      type = defaultActiveKey === item.id ? 'up' : 'down';
    } else {
      type = activeKey === item.id ? 'up' : 'down';
    }

    const iconCls = classnames({
      [styles.icon]: true,
      [styles.disable]: _.isEmpty(item.actor),
    });

    return (
      <span className={styles.headerRight}>
        {item.serveOrigin}
        <Icon className={iconCls} type={type} />
      </span>
    );
  }

  renderTimePane(item, defaultActiveKey) {
    const {executeTypes, filesList } = this.props;
    // 获取时分秒
    const currentTime = item.serveTime.split(' ')[1];
    const header = (
      <div className={styles.panelHeader}>
        <span className={styles.timeLabel}>{currentTime}</span>
        <span className={styles.headerLeft}>{this.renderHeaderLeft(item)}</span>
        <span className={styles.headerRight}>{this.renderHeaderRight(item, defaultActiveKey)}</span>
      </div>
    );

    return (
      <Panel
        showArrow={false}
        key={item.id}
        header={header}
        className={styles.serviceContentPane}
        // 如果没有实施者字段，则认为该服务记录没有实质内容，隐藏该服务记录
        disabled={_.isEmpty(item.actor)}
      >
        <ServiceRecordContent
          executeTypes={executeTypes}
          item={item}
          filesList={filesList}
        />
      </Panel>
    );
  }

  renderServiceLog(item, defaultActiveKey) {
    const { activeKey } = this.state;
    return (
      <Panel
        disabled
        showArrow={false}
        key={item.date}
        header={item.date}
        className={styles.serviceLogPane}
      >
        <Collapse
          bordered={false}
          activeKey={activeKey || defaultActiveKey}
          onChange={this.handleCollapseChange}
          accordion
        >
          {
            _.map(item.logList, item => this.renderTimePane(item, defaultActiveKey))
          }
        </Collapse>
      </Panel>
    );
  }

  renderServiceLogList() {
    const { serviceLogList } = this.props;
    // 对服务记录按天进行分组，这个本来该后端干的
    const serviceLogMap = this.getserviceLogMap();
    // 初始以天为分组的面板全部打开
    const activeLogList = _.map(serviceLogMap, item => item.date);
    // 初始需要打开的次级Collapse key
    const defaultActiveKey = serviceLogList && serviceLogList[0] && serviceLogList[0].id;
    return (
      <Collapse
        bordered={false}
        activeKey={activeLogList}
        className={styles.serviceLog}
      >
        {
          _.map(serviceLogMap, item => this.renderServiceLog(item, defaultActiveKey))
        }
      </Collapse>
    );
  }

  render() {
    const { serviceLogList } = this.props;
    return (
      <div className={styles.serviceLogList}>
        <IfTableWrap
          isRender={!_.isEmpty(serviceLogList)}
          text="暂无服务记录"
        >
          {this.renderServiceLogList()}
        </IfTableWrap>
      </div>
    );
  }
}
