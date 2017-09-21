/**
 * @file components/fullChannelServiceRecord/Filter.js
 *  全渠道服务记录筛选区
 * @author wangjunjun
 */
import React, { PureComponent, PropTypes } from 'react';
import { SingleFilter } from '../common/filter';

import styles from './filter.less';

export default class Filter extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      dict,
      location,
    } = this.props;
    const {
      serviceChannel,
      serviceStatus,
      serviceSource,
    } = location.query;
    const serviceChannelProps = {
      value: serviceChannel || '',
      filterLabel: '服务渠道',
      filter: 'serviceChannel',
      filterField: dict.custNature,
      onChange: this.props.onFilter,
    };
    const serviceStatusProps = {
      value: serviceStatus || '',
      filterLabel: '服务状态',
      filter: 'serviceStatus',
      filterField: dict.custBusinessType,
      onChange: this.props.onFilter,
    };
    const serviceSourceProps = {
      value: serviceSource || '',
      filterLabel: '服务来源',
      filter: 'serviceSource',
      filterField: dict.custRiskBearing,
      onChange: this.props.onFilter,
    };
    return (
      <div className={styles.filter}>
        <SingleFilter {...serviceChannelProps} />
        <SingleFilter {...serviceStatusProps} />
        <SingleFilter {...serviceSourceProps} />
      </div>
    );
  }
}
