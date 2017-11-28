/*
 * @Description: 公用的表格组件
 * @Author: LiuJianShu
 * @Date: 2017-09-19 14:27:39
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-04 15:29:18
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio } from 'antd';
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
    const newTitleList = _.cloneDeep(titleList);
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
        newTitleList.push(operation.column);
      } else {
        switch (columnKey) {
          case 'delete':
            operation.column.render = (text, record, index) => (
              <span key={`delete-${record.key}`}>
                <Icon type="shanchu" onClick={() => operation.operate(record, index)} />
              </span>
            );
            newTitleList.push(operation.column);
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
            newTitleList.push(operation.column);
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
            newTitleList.unshift(operation.column);
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
