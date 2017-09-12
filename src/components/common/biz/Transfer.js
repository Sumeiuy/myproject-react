/**
 * @description 类穿梭框组件，统一样式
 * @author zhangjunli
 * Usage:
 */
import React, { PropTypes, Component } from 'react';
import { Table } from 'antd';

import styles from './transfer.less';

export default class Transfer extends Component {
  static propTypes = {
    subscribeTitle: PropTypes.string,
    unsubscribeTitle: PropTypes.string,
    subscribeData: PropTypes.array,
    unsubscribeData: PropTypes.array,
    subscribeColumns: PropTypes.array.isRequired,
    unsubscribeColumns: PropTypes.array.isRequired,
  }

  static defaultProps = {
    subscribeData: [],
    unsubscribeData: [],
    unsubscribeTitle: '退订服务',
    subscribeTitle: '当前订阅服务',
  }

  render() {
    const {
      subscribeTitle,
      unsubscribeTitle,
      subscribeData,
      unsubscribeData,
      subscribeColumns,
      unsubscribeColumns,
    } = this.props;
    const paginationProps = {
      defaultPageSize: 5,
      size: 'small',
    };

    return (
      <div className={styles.container}>
        <div className={styles.upContent}>
          <div className={styles.titleLabel}>{subscribeTitle}</div>
          <Table
            rowKey="subscribeId"
            columns={subscribeColumns}
            dataSource={subscribeData}
            pagination={paginationProps}
          />
        </div>
        <div>
          <div className={styles.titleLabel}>{unsubscribeTitle}</div>
          <Table
            rowKey="subscribeId"
            columns={unsubscribeColumns}
            dataSource={unsubscribeData}
            pagination={paginationProps}
          />
        </div>
      </div>
    );
  }
}
