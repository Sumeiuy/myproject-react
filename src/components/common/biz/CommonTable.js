/*
 * @Description: 公用的表格组件
 * @Author: LiuJianShu
 * @Date: 2017-09-19 14:27:39
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-01-02 15:56:42
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Switch } from 'antd';
import _ from 'lodash';
import Icon from '../Icon';
import styles from './commonTable.less';

export default class CommonTable extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    titleList: PropTypes.array.isRequired,
    operation: PropTypes.object,
    pagination: PropTypes.object,
    scroll: PropTypes.object,
  }

  static defaultProps = {
    data: [],
    operation: null,
    pagination: {},
    scroll: {},
  }

  render() {
    const { scroll, data, operation, titleList, ...resetProps } = this.props;
    let newTitleList = [...titleList];
    if (!_.isEmpty(operation)) {
      const columnKey = operation.column.key;
      if (_.isArray(columnKey)) {
        operation.column.render = (text, record, index) => (
          <span className="operateGroup">
            {
              columnKey.map(item => (
                <span key={`${item.key}-${record.key}`}>
                  <Icon type={item.key} onClick={() => item.operate(record, index)} />
                </span>
              ))
            }
          </span>
        );
        newTitleList = [...newTitleList, operation.column];
      } else {
        switch (columnKey) {
          case 'delete':
            operation.column.render = (text, record, index) => (
              <span key={`delete-${record.key}`}>
                <Icon type="shanchu" onClick={() => operation.operate(record, index)} />
              </span>
            );
            newTitleList = [...newTitleList, operation.column];
            break;
          case 'view':
            operation.column.render = (text, record, index) => (
              <span
                key={`view-${record.key}`}
                className={styles.viewlink}
                onClick={() => operation.operate(record, index)}
              >
                查看
              </span>
            );
            newTitleList = [...newTitleList, operation.column];
            break;
          case 'radio':
            operation.column.render = (text, record, index) => (
              <span>
                <Radio
                  key={`radio-${record.key}`}
                  checked={index === operation.column.radio}
                  onClick={() => operation.operate(record, index)}
                />
              </span>
            );
            if (operation.column.align === 'right') {
              newTitleList = [...newTitleList, operation.column];
            } else {
              newTitleList = [operation.column, ...newTitleList];
            }
            break;
          case 'switch':
            operation.column.render = (text, record, index) => (
              <span>
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={checked => operation.operate(checked, record, index)}
                  checked={!!record.checked}
                />
              </span>
            );
            newTitleList = [...newTitleList, operation.column];
            break;
          default:
            break;
        }
      }
    }
    return (
      <div className={styles.commonTable}>
        <Table
          {...resetProps}
          scroll={scroll}
          pagination={_.isEmpty(this.props.pagination) ? false : this.props.pagination}
          dataSource={data}
          columns={newTitleList}
        />
      </div>
    );
  }
}
