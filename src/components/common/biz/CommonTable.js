/*
 * @Description: 公用的表格组件
 * @Author: LiuJianShu
 * @Date: 2017-09-19 14:27:39
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-26 09:26:08
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio } from 'antd';
import Icon from '../Icon';
import styles from './commonTable.less';

export default class CommonTable extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    titleList: PropTypes.array.isRequired,
    operation: PropTypes.object,
    pagination: PropTypes.object,
    scroll: PropTypes.object,
  }

  static defaultProps = {
    operation: null,
    pagination: {},
    scroll: {},
  }

  render() {
    const { scroll, data, titleList, operation } = this.props;
    if (operation) {
      switch (operation.column.key) {
        case 'delete':
          operation.column.render = (text, record, index) => (
            <span>
              <Icon type="close" onClick={() => operation.operate(record, index)} />
            </span>
          );
          titleList.push(operation.column);
          break;
        case 'view':
          operation.column.render = (text, record, index) => (
            <span
              className={styles.viewlink}
              onClick={() => operation.operate(record, index)}
            >
              查看
            </span>
          );
          titleList.push(operation.column);
          break;
        case 'radio':
          operation.column.render = (text, record, index) => (
            <span>
              <Radio
                checked={index === operation.column.radio}
                onClick={() => operation.operate(record, index)}
              />
            </span>
          );
          titleList.unshift(operation.column);
          break;
        default:
          break;
      }
    }

    return (
      <div className={styles.commonTable}>
        <Table
          scroll={scroll}
          pagination={this.props.pagination}
          dataSource={data}
          columns={titleList}
        />
      </div>
    );
  }
}
