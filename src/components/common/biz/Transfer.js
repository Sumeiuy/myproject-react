/**
 * @description 类穿梭框组件，统一样式
 * @author zhangjunli
 * Usage:
 * <Transfer
    subscribeData={array}
    unsubscribeData={array}
    subscribeColumns={array}
    unsubscribeColumns={array}
  />
 * subscribeTitle: 不必要，有默认值（‘当前订阅服务’），第一个表的title
 * unsubscribeTitle： 不必要，有默认值（‘退订服务’），第二个表的title
 * subscribeData：不必要，有默认值（空数据），第一个标的数据源
 * unsubscribeData：不必要，有默认值（空数据），第二个标的数据源
 * subscribeColumns：必要，第一表的表头定义
 * unsubscribeColumns：必要，第二个表的表头定义
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
