/**
 * @Description: 组合构成-表格
 * @Author: Liujianshu
 * @Date: 2018-05-10 09:38:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 09:23:24
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Popover } from 'antd';
import { autobind } from 'core-decorators';
// import _ from 'lodash';

import config from '../config';
import styles from './compositionTable.less';

const { detailTitleList } = config;
export default class CompositionTable extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 时间默认值
      time: '',
    };
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
      reactElement = '调入理由：暂无';
    }
    return reactElement;
  }

  render() {
    const { data } = this.props;
    const columns = detailTitleList.mnspzh;
    columns[columns.length - 1].render = text => this.renderPopover(text);
    return (
      <div className={styles.table}>
        <Table
          columns={detailTitleList.mnspzh}
          dataSource={data}
          pagination={false}
          scroll={{ y: 316 }}
          rowKey="code"
        />
      </div>
    );
  }
}
