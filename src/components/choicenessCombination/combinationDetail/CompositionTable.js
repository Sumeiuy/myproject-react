/**
 * @Description: 组合构成-表格
 * @Author: Liujianshu
 * @Date: 2018-05-10 09:38:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 15:47:39
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Popover } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import config from '../config';
import styles from './compositionTable.less';

const { detailTitleList } = config;
export default class CompositionTable extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  // 设置单元格的 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (value) {
      reactElement = (<Popover
        placement="bottomLeft"
        content={value}
        trigger="hover"
        overlayStyle={{
          width: '240px',
          padding: '10px',
          wordBreak: 'break-all',
        }}
      >
        <div>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '暂无';
    }
    return reactElement;
  }

  render() {
    const { data } = this.props;
    if (_.isEmpty(data)) {
      return null;
    }
    const tableType = data[0].composeCategory;
    const columns = detailTitleList[tableType];
    columns[columns.length - 1].render = text => this.renderPopover(text);
    return (
      <div className={styles.table}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 316 }}
          rowKey="code"
        />
      </div>
    );
  }
}
