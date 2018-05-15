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


import { time } from '../../../helper';
import config from '../config';
import styles from './compositionTable.less';

const { detailTitleList, detailTitleType, formatStr, overlayStyle } = config;
// 字符串常量，用于 table columns 对应列的 key 匹配来 render
// 理由字符串
const KEY_REASON = 'reason';
// 时间字符串
const KEY_TIME = 'callInTime';

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
        overlayStyle={overlayStyle}
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
    const reasonIndex = _.findIndex(columns, o => o.key === KEY_REASON);
    const timeIndex = _.findIndex(columns, o => o.key === KEY_TIME);
    switch (Number(tableType)) {
      case detailTitleType.MNSPZH:
        columns[reasonIndex].render = text => this.renderPopover(text);
        break;
      case detailTitleType.HYGPZH:
        columns[timeIndex].render = text => (<div>{time.format(text, formatStr)}</div>);
        columns[reasonIndex].render = text => this.renderPopover(text);
        break;
      case detailTitleType.PZLZH:
        columns[timeIndex].render = text => (<div>{time.format(text, formatStr)}</div>);
        columns[reasonIndex].render = text => this.renderPopover(text);
        break;
      case detailTitleType.ZCPZZH:
        columns[timeIndex].render = text => (<div>{time.format(text, formatStr)}</div>);
        break;
      default:
        break;
    }
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
