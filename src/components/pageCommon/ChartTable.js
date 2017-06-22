/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-25 18:20:35
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Table, Pagination, Popover } from 'antd';
import _ from 'lodash';

import { optionsMap } from '../../config';
import styles from './ChartTable.less';

// 按类别排序
const sortByType = optionsMap.sortByType;
const revert = { asc: 'desc', desc: 'asc' };

export default class ChartTable extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string,
    chartTableInfo: PropTypes.object,
    style: PropTypes.object,
    sourceData: PropTypes.array,
    data: PropTypes.object,
    getTableInfo: PropTypes.func,
    replace: PropTypes.func.isRequired,
    scope: PropTypes.number.isRequired,
    indexID: PropTypes.string,
  }

  static defaultProps = {
    location: {},
    style: {},
    level: '',
    indexID: '',
    chartTableInfo: {},
    sourceData: [],
    data: {},
    getTableInfo: () => {},
    repalce: () => {},
  }
  constructor(props) {
    super(props);
    this.state = {
      bordered: true,
      loading: false,
      pagination: false,
      sortedInfo: null,
      // url 中会存放的值
      orderIndicatorId: '',
      orderType: '',
      pageNum: 1,
      pageSize: 10,
    };
  }

  // 分页事件
  @autobind
  handlePaginationChange(page, pageSize) {
    const { replace, location: { query, pathname }, getTableInfo, indexID } = this.props;
    const { orderIndicatorId, orderType } = this.state;
    if (pathname.indexOf('invest') > -1) {
      replace({
        pathname,
        query: {
          ...query,
          page,
          pageSize,
        },
      });
    } else {
      this.setState({
        pageNum: page,
      });
      getTableInfo({
        pageNum: page,
        orderIndicatorId,
        orderType,
        indicatorId: indexID,
      });
    }
  }

  @autobind
  unitChange(arr) {
    let value;
    const newArr = arr.map((item) => {
      const itemValue = Number(item.value);
      switch (item.unit) {
        case '%':
          value = Number.parseFloat((itemValue * 100).toFixed(2));
          break;
        case '\u2030':
          value = Number.parseFloat((itemValue * 1000).toFixed(2));
          break;
        case '元':
          value = `${Number.parseFloat((itemValue / 10000).toFixed(2))}`;
          break;
        default:
          value = Number.parseFloat(itemValue.toFixed(2));
          break;
      }
      return {
        [item.key]: value,
      };
    });
    return newArr;
  }

  @autobind
  handleTitleClick(item) {
    const { replace, location: { query, pathname }, getTableInfo, indexID } = this.props;
    const { orderIndicatorId, orderType, pageNum } = this.state;
    let tableOrderType;
    if (pathname.indexOf('invest') > -1) {
      if (query.orderIndicatorId === item.key) {
        tableOrderType = revert[query.tableOrderType] || 'desc';
      } else {
        tableOrderType = 'asc';
      }
      replace({
        pathname,
        query: {
          ...query,
          orderIndicatorId: item.key || '',
          tableOrderType,
        },
      });
    } else {
      if (orderIndicatorId === item.key) {
        tableOrderType = revert[orderType] || 'desc';
      } else {
        tableOrderType = 'asc';
      }
      this.setState({
        orderIndicatorId: item.key,
        orderType: tableOrderType,
      });
      getTableInfo({
        orderIndicatorId: item.key,
        orderType: tableOrderType,
        pageNum,
        indicatorId: indexID,
      });
    }
  }
  // 表格标题排序箭头事件
  @autobind
  arrowHandle(e, item, type) {
    const { replace, location: { query, pathname }, getTableInfo, indexID } = this.props;
    const { pageNum } = this.state;
    e.stopPropagation();
    if (pathname.indexOf('invest') > -1) {
      replace({
        pathname,
        query: {
          ...query,
          orderIndicatorId: item.key || '',
          tableOrderType: type,
        },
      });
    } else {
      this.setState({
        orderIndicatorId: item.key,
        orderType: type,
      });
      getTableInfo({
        orderIndicatorId: item.key,
        orderType: type,
        pageNum,
        indicatorId: indexID,
      });
    }
  }
  // 表格第一列 tooltip 处理事件
  @autobind
  toolTipHandle(record) {
    let toolTipTittle;
    if (record.orgModel) {
      if (record.level === '3') {
        toolTipTittle = (<div>
          <p>{record.orgModel.level2Name}</p><p>{record.orgModel.level3Name}</p>
        </div>);
      } else if (record.level === '4') {
        toolTipTittle = (<div>
          <p>{record.orgModel.level2Name} - {record.orgModel.level3Name}</p>
          <p>{record.orgModel.level4Name}</p>
        </div>);
      } else {
        toolTipTittle = '';
      }
    } else {
      toolTipTittle = '';
    }
    return toolTipTittle ? <Popover placement="right" content={toolTipTittle} trigger="hover">
      <div className={styles.tdWrapperDiv}>
        {record.city}
      </div>
    </Popover>
    :
    <div className={styles.tdWrapperDiv}>{record.city}</div>;
    // return toolTipTittle ? <Tooltip placement="right" title={toolTipTittle}>
    //   <div className={styles.tdWrapperDiv}>
    //     {record.city}
    //   </div>
    // </Tooltip>
    // :
    // <div className={styles.tdWrapperDiv}>{record.city}</div>;
  }

  render() {
    // chartTableInfo使用state中的值
    const { chartTableInfo, style, scope } = this.props;
    const columns = chartTableInfo.titleList;
    const data = chartTableInfo.indicatorSummuryRecordDtos;
    const temp = [];
    let arr = [];
    let allWidth = '';
    if (data && data.length) {
      data.map((item, index) => {
        const testArr = this.unitChange(item.indicatorDataList);
        const { id, level: itemLevel, name, orgModel = {} } = item;
        return temp.push(Object.assign(
          { key: index, city: name, level: itemLevel, id, orgModel }, ...testArr,
        ));
      });
      arr = columns.map((item) => {
        const tempName = `${item.name}(${encodeURIComponent(item.unit) === encodeURIComponent('元') ? '万元' : item.unit})`;
        const column = {
          dataIndex: item.key,
          title: this.getTitleHtml(item),
          render: text => (
            <div className={styles.tdWrapperDiv}>
              {text}
            </div>
          ),
        };
        // 如果表格标题超过 9 个，则每个设置对应的宽度
        if (columns.length > 9) {
          column.width = (tempName.length * 16) + 20;
        }
        // 如果表格标题包含 children，则给每个 child 设置排序事件
        const hasChildren = item.children;
        if (hasChildren) {
          column.children = this.getChildren(item);
          column.title = `${item.name}(${encodeURIComponent(item.unit) === encodeURIComponent('元') ? '万元' : item.unit})`;
        }
        return column;
      });
      allWidth = _.sumBy(arr, 'width');
      allWidth = allWidth > 900 ? allWidth : '100%';
    }
    // 匹配第一列标题文字，分公司、营业部、投顾
    // sortByType 初始的 scope 为 2，所以减去两个前面对象，得出最后与实际 scope 相等的索引
    const keyName = sortByType[Number(scope) - 2].name;
    arr.unshift({
      title: keyName,
      dataIndex: 'city',
      key: 'city',
      width: 170,
      fixed: 'left',
      render: (text, record) => (
        this.toolTipHandle(record)
      ),
    });
    return (
      <div className={styles.tableDiv} style={style}>
        <Table
          {...this.state}
          columns={arr}
          dataSource={temp}
          onChange={this.handleChange}
          scroll={{ x: allWidth }}
        />
        <Pagination
          defaultCurrent={1}
          current={chartTableInfo.curPageNum || 1}
          total={chartTableInfo.totalCnt || 1}
          pageSize={10}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
