/**
 * @file components/feedback/RemarkList.js
 *  处理记录
 * @author yangquanjian
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Table } from 'antd';
import _ from 'lodash';

import styles from './remarkList.less';

const EMPTY_LIST = [];
export default class RemarkList extends PureComponent {
  static propTypes = {
    remarkList: PropTypes.array.isRequired,
    className: PropTypes.string,
    renderColumn: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    renderColumn: null,
  }

  constructor(props) {
    super(props);
    const { remarkList = EMPTY_LIST } = props;
    this.state = {
      dataSource: remarkList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { remarkList: nextList = EMPTY_LIST } = nextProps;
    const { remarkList: prevList = EMPTY_LIST } = this.props;
    if (nextList !== prevList) {
      this.setState({
        dataSource: nextList,
      });
    }
  }

  @autobind
  constructTableColumns() {
    const columns = [{
      key: 'id',
      width: '100%',
      render: (text, record) => {
        const { renderColumn } = this.props;
        // 自定义column
        if (_.isFunction(renderColumn)) {
          return renderColumn(record);
        }
        // 默认的column
        return (
          <div
            className={styles.item}
            key={record.id}
          >
            <div className={styles.wrap}>
              <div className={styles.info}>
                <span>{record.title}</span>
              </div>
              <pre className={styles.txt}>
                {record.description}
              </pre>
            </div>
          </div>
        );
      },
    }];
    return columns;
  }

  render() {
    const columns = this.constructTableColumns();
    const { className } = this.props;
    return (
      <Table
        rowKey="id"
        className={classnames(
          styles.recordList,
          { [className]: !!className },
        )}
        columns={columns}
        dataSource={this.state.dataSource}
        showHeader={false}
        pagination={false}
        bordered={false}
      />
    );
  }
}
