/**
 * @file components/fullChannelServiceRecord/Filter.js
 *  全渠道服务记录筛选区
 * @author wangjunjun
 */
import React, { PropTypes } from 'react';
import { SingleFilter } from '../common/filter';

import styles from './filter.less';

const Filter = (props) => {
  const {
    dict,
    location,
  } = props;
  const {
    serviceChannel,
    serviceStatus,
    taskSource,
  } = location.query;
  const serviceChannelProps = {
    value: serviceChannel || '',
    filterLabel: '服务渠道',
    filter: 'serviceChannel',
    filterField: dict.serveChannel,
    onChange: props.onFilter,
  };
  const serviceStatusProps = {
    value: serviceStatus || '',
    filterLabel: '服务状态',
    filter: 'serviceStatus',
    filterField: dict.serveStatus,
    onChange: props.onFilter,
  };
  const taskSourceProps = {
    value: taskSource || '',
    filterLabel: '服务来源',
    filter: 'taskSource',
    filterField: dict.taskSource,
    onChange: props.onFilter,
  };
  return (
    <div className={styles.filter}>
      <SingleFilter {...serviceChannelProps} />
      <SingleFilter {...serviceStatusProps} />
      <SingleFilter {...taskSourceProps} />
    </div>
  );
};

Filter.propTypes = {
  dict: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default Filter;
