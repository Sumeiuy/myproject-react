/*
 * @Description: 公用的表格组件
 * @Author: LiuJianShu
 * @Date: 2017-09-19 14:27:39
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-25 16:28:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-09 10:34:28
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Switch } from 'antd';
import _ from 'lodash';
import cx from 'classnames';
import Icon from '../Icon';
import styles from './commonTable.less';

export default class CommonTable extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    titleList: PropTypes.array.isRequired,
    operation: PropTypes.object,
    pagination: PropTypes.object,
    scroll: PropTypes.object,
    rowKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    align: PropTypes.string,
    // 自带分页器的位置, 默认为left
    pagePosition: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    operation: null,
    pagination: {},
    scroll: {},
    rowKey: '',
    align: 'center',
    pagePosition: 'left',
  }

  render() {
    const {
      pagePosition, scroll, data,
      operation, titleList, rowKey, align,
      ...resetProps
    } = this.props;
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
            operation.column.render = (text, record, index) => {
              const key = operation.operateKey || 'key';
              const checkedRadio = operation.column.radio;
              const isFunc = _.isFunction(checkedRadio);
              return (
                <span>
                  <Radio
                    key={`radio-${record[key]}`}
                    checked={isFunc ? checkedRadio(record, index) : index === checkedRadio}
                    onClick={() => operation.operate(record, index)}
                  />
                </span>
              );
            };
            if (operation.column.align === 'right') {
              newTitleList = [...newTitleList, operation.column];
            } else {
              newTitleList = [operation.column, ...newTitleList];
            }
            break;
          case 'switch':
            operation.column.render = (text, record, index) => {
              console.log(record);
              return (
                <span>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    onChange={checked => operation.operate(checked, record, index)}
                    checked={!!record.checked}
                    defaultChecked
                  />
                </span>
              );
            };
            newTitleList = [...newTitleList, operation.column];
            break;
          default:
            break;
        }
      }
    }
    const newData = _.map(
      data,
      (item, index) => {
        const newRowKey = rowKey || index;
        return {
          ...item,
          key: item.key || newRowKey,
        };
      },
    );
    // 给每列数据加上对齐方式，默认居中
    const columns = newTitleList.map(item => ({ ...item, align }));
    const wrapCls = cx({
      [styles.commonTable]: true,
      [styles.pageAtRight]: pagePosition === 'right',
    });
    return (
      <div className={wrapCls}>
        <Table
          {...resetProps}
          scroll={scroll}
          pagination={_.isEmpty(this.props.pagination) ? false : this.props.pagination}
          dataSource={newData}
          columns={columns}
          rowKey={rowKey || ''}
        />
      </div>
    );
  }
}
