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
// _.findIndex 方法未找到元素时返回 -1
const noResult = -1;

export default class CompositionTable extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  @autobind
  getColumnsTitle(columns) {
    let newColumns = [...columns];
    // 原因列
    const reasonIndex = _.findIndex(newColumns, o => o.key === KEY_REASON);
    // 时间列
    const timeIndex = _.findIndex(newColumns, o => o.key === KEY_TIME);
    // 股票、基金名称列
    const nameIndex = _.findIndex(newColumns, o => o.key === KEY_NAME);
    // 行业
    const industryIndex = _.findIndex(newColumns, o => o.key === KEY_INDUSTRY);
    // 分类
    const categoryIndex = _.findIndex(newColumns, o => o.key === KEY_CATEGORY);
    // 累计涨幅
    const increaseIndex = _.findIndex(newColumns, o => o.key === KEY_INCREASE);
    // 浮动收益率
    const floatratereturnIndex = _.findIndex(newColumns, o => o.key === KEY_FLOATRATERETURN);

    if (reasonIndex > noResult) {
      newColumns[reasonIndex].render = text => this.renderPopover(text);
    }
    if (timeIndex > noResult) {
      newColumns[timeIndex].render = text => (<div>{time.format(text, formatStr)}</div>);
    }
    newColumns = this.renderNumberOrText(categoryIndex, newColumns);
    newColumns = this.renderNumberOrText(nameIndex, newColumns);
    newColumns = this.renderNumberOrText(industryIndex, newColumns);
    newColumns = this.renderNumberOrText(increaseIndex, newColumns, 'number');
    newColumns = this.renderNumberOrText(floatratereturnIndex, newColumns, 'number');
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
        <div className={styles.multiLineEllipsis}>
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
  renderNumberOrText(index, array, type = '') {
    const newArray = [...array];
    if (index > noResult) {
      newArray[index].render = text => (
        <div className={styles.oneLineEllipsis} title={text}>
          {
            _.isEmpty(type)
            ?
              text
            :
              this.compareWithZero(number.toFixed(text))
          }
        </div>
      );
    }
    return newArray;
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
