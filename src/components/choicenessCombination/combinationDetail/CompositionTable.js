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

import { time, number } from '../../../helper';
import { detailTitleList, formatStr, overlayStyle } from '../config';
import styles from './compositionTable.less';

// 字符串常量，用于 table columns 对应列的 key 匹配来 render
// 理由字符串
const KEY_REASON = 'reason';
// 时间字符串
const KEY_TIME = 'callInTime';
// 证券名称字符串
const KEY_NAME = 'name';
// 行业字符串
const KEY_INDUSTRY = 'industry';
// 分类字符串
const KEY_CATEGORY = 'category';
// 累计涨幅
const KEY_INCREASE = 'increase';
// 浮动收益率
const KEY_FLOATRATERETURN = 'floatRateReturn';
// 空对象
const EMPTY_OBJECT = {};

export default class CompositionTable extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  @autobind
  getColumnsTitle(columns) {
    const newColumns = [...columns];
    // 原因列
    const reasonColumn = _.find(newColumns, o => o.key === KEY_REASON) || EMPTY_OBJECT;
    reasonColumn.render = text => this.renderPopover(text);
    // 时间列
    const timeColumn = _.find(newColumns, o => o.key === KEY_TIME) || EMPTY_OBJECT;
    timeColumn.render = text => (<div>{time.format(text, formatStr)}</div>);
    // 股票、基金名称列
    const nameColumn = _.find(newColumns, o => o.key === KEY_NAME) || EMPTY_OBJECT;
    nameColumn.render = text => this.renderNumberOrText(text);
    // 行业
    const industryColumn = _.find(newColumns, o => o.key === KEY_INDUSTRY) || EMPTY_OBJECT;
    industryColumn.render = text => this.renderNumberOrText(text);
    // 分类
    const categoryColumn = _.find(newColumns, o => o.key === KEY_CATEGORY) || EMPTY_OBJECT;
    categoryColumn.render = text => this.renderNumberOrText(text);
    // 累计涨幅
    const increaseColumn = _.find(newColumns, o => o.key === KEY_INCREASE) || EMPTY_OBJECT;
    increaseColumn.render = text => this.renderNumberOrText(text, 'number');
    // 浮动收益率
    const floatColumn = _.find(newColumns, o => o.key === KEY_FLOATRATERETURN) || EMPTY_OBJECT;
    floatColumn.render = text => this.renderNumberOrText(text, 'number');
    return newColumns;
  }

  // 与零作比较，大于 0 则加上 + 符号
  @autobind
  compareWithZero(value) {
    return value > 0 ? `+${value}` : value;
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
        <div className={styles.oneLineEllipsis}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '暂无';
    }
    return reactElement;
  }

  // 渲染文字或数字
  @autobind
  renderNumberOrText(text, type = '') {
    return (<div className={styles.oneLineEllipsis} title={text}>
      {
        _.isEmpty(type)
        ?
          text
        :
          this.compareWithZero(number.toFixed(text))
      }
    </div>);
  }

  render() {
    const { data } = this.props;
    if (_.isEmpty(data)) {
      return null;
    }
    const tableType = data[0].composeCategory;
    let columns = detailTitleList[tableType];
    columns = this.getColumnsTitle(columns);
    const allWidth = _.sumBy(columns, 'width');
    return (
      <div className={styles.table}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: allWidth, y: 316 }}
          rowKey="code"
        />
      </div>
    );
  }
}
