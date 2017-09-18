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
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';
import styles from './transfer.less';

const actionColumns = (type, handleAction) => {
  function handleClick(item) {
    if (_.isFunction(handleAction)) {
      handleAction(item);
    }
  }
  return {
    title: '操作',
    key: 'action',
    render: item => (
      <Icon
        type={type === 'subscribe' ? 'shanchu' : 'new'}
        className={styles.closeIcon}
        onClick={() => { handleClick(item); }}
      />
    ),
  };
};

export default class Transfer extends Component {
  static propTypes = {
    subscribeTitle: PropTypes.string,
    unsubscribeTitle: PropTypes.string,
    subscribeData: PropTypes.array,
    unsubscribeData: PropTypes.array,
    onChange: PropTypes.func,
    subscribeColumns: PropTypes.array.isRequired,
    unsubscribeColumns: PropTypes.array.isRequired,
  }

  static defaultProps = {
    subscribeData: [],
    unsubscribeData: [],
    unsubscribeTitle: '退订服务',
    subscribeTitle: '当前订阅服务',
    onChange: () => {},
  }

  constructor(props) {
    super(props);
    const {
      subscribeData,
      unsubscribeData,
      subscribeColumns,
      unsubscribeColumns,
    } = this.props;

    this.state = {
      subscribelArray: subscribeData,
      unsubcribeArray: unsubscribeData,
      subscribeColumns: [
        ...subscribeColumns,
        actionColumns('subscribe', this.handleUnsubscribe),
      ],
      unsubscribeColumns: [
        ...unsubscribeColumns,
        actionColumns('unsubscribe', this.handleSubscribe),
      ],
    };
  }

  @autobind
  handleUnsubscribe(selected) {
    const { onChange } = this.props;
    const { unsubcribeArray, subscribelArray } = this.state;
    const newSubscribelArray = _.filter(
      subscribelArray,
      item => item.key !== selected.key,
    );
    const newUnsubcribeArray = [selected, ...unsubcribeArray];
    this.setState({
      subscribelArray: newSubscribelArray,
      unsubcribeArray: newUnsubcribeArray,
    }, onChange(newSubscribelArray, newUnsubcribeArray, selected));
  }

  @autobind
  handleSubscribe(selected) {
    const { onChange } = this.props;
    const { subscribelArray, unsubcribeArray } = this.state;
    const newUnsubcribeArray = _.filter(
      unsubcribeArray,
      item => item.key !== selected.key,
    );
    const newSubcribeArray = [selected, ...subscribelArray];
    this.setState({
      subscribelArray: newSubcribeArray,
      unsubcribeArray: newUnsubcribeArray,
    }, onChange(newSubcribeArray, newUnsubcribeArray, selected));
  }

  render() {
    const {
      subscribeTitle,
      unsubscribeTitle,
    } = this.props;
    const {
      subscribelArray,
      unsubcribeArray,
      subscribeColumns,
      unsubscribeColumns,
    } = this.state;
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
            dataSource={subscribelArray}
            pagination={paginationProps}
          />
        </div>
        <div>
          <div className={styles.titleLabel}>{unsubscribeTitle}</div>
          <Table
            rowKey="subscribeId"
            columns={unsubscribeColumns}
            dataSource={unsubcribeArray}
            pagination={paginationProps}
          />
        </div>
      </div>
    );
  }
}
