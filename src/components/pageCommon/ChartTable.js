/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-25 18:20:35
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Table, Pagination, Tooltip } from 'antd';
import _ from 'lodash';

import { optionsMap } from '../../config';
import styles from './ChartTable.less';

// 按类别排序
const sortByType = optionsMap.sortByType;
const revert = { asc: 'desc', desc: 'asc' };
// 表格标题宽度
const columnWidth = [180, 180, 180, 210, 180, 170, 170, 210, 210, 210, 180, 150];
const allWidth = _.sum(columnWidth);

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
    scope: PropTypes.string.isRequired,
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
    };
  }
  // 组合表格头部 排序 html
  @autobind
  getTitleHtml(item, flag = true) {
    const { orderIndicatorId, orderType } = this.state;
    let titleHtml = '';
    if (flag) {
      titleHtml = (<span
        className={styles.columnsTitle}
        onClick={() => { this.handleTitleClick(item); }}
      >
        {item.name}
        <span className={'ant-table-column-sorter'}>
          <span
            className={`
              ant-table-column-sorter-up
              ${(orderIndicatorId === item.key && (orderType !== 'desc')) ? 'on' : 'off'}
            `}
            title="↑"
            onClick={(e) => {
              this.arrowHandle(e, item, 'asc');
            }}
          >
            <i className={'anticon anticon-caret-up'} />
          </span>
          <span
            className={`
              ant-table-column-sorter-up
              ${(orderIndicatorId === item.key && (orderType !== 'asc')) ? 'on' : 'off'}
            `}
            title="↓"
            onClick={(e) => {
              this.arrowHandle(e, item, 'desc');
            }}
          >
            <i className={'anticon anticon-caret-down'} />
          </span>
        </span>
      </span>);
    } else {
      titleHtml = `${item.name}(${encodeURIComponent(item.unit) === encodeURIComponent('元') ? '万元' : item.unit})`;
    }
    return titleHtml;
  }
  // 获取表格头部子元素
  @autobind
  getChildren(item) {
    const childrenArr = [];
    if (item.children) {
      item.children.map(child =>
        childrenArr.push({
          title: this.getTitleHtml(child),
          dataIndex: child.key,
          key: `key${child.key}`,
          width: 150,
        }));
    }
    return childrenArr;
  }
  @autobind
  handleTitleClick(item) {
    const { getTableInfo, indexID, scope } = this.props;
    const { orderIndicatorId, orderType, pageNum } = this.state;
    let tableOrderType;
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
      scope,
      categoryKey: indexID,
    });
  }
  // 表格标题排序箭头事件
  @autobind
  arrowHandle(e, item, type) {
    const { getTableInfo, indexID, scope } = this.props;
    const { pageNum } = this.state;
    e.stopPropagation();
    this.setState({
      orderIndicatorId: item.key,
      orderType: type,
    });
    getTableInfo({
      orderIndicatorId: item.key,
      orderType: type,
      pageNum,
      scope,
      categoryKey: indexID,
    });
  }
  // 表格第一列 tooltip 处理事件
  @autobind
  toolTipHandle(record) {
    let toolTipTittle;
    if (record.orgModel) {
      if (record.level === '3') {
        toolTipTittle = record.orgModel.level2Name;
      } else if (record.level === '4') {
        toolTipTittle = `${record.orgModel.level2Name} - ${record.orgModel.level3Name}`;
      } else {
        toolTipTittle = '';
      }
    } else {
      toolTipTittle = '';
    }
    return toolTipTittle ? <Tooltip placement="right" title={toolTipTittle}>
      <div className={styles.tdWrapperDiv}>
        {record.city}
      </div>
    </Tooltip>
    :
    <div className={styles.tdWrapperDiv}>{record.city}</div>;
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
  // 分页事件
  @autobind
  handlePaginationChange(page) {
    const { getTableInfo, indexID, scope } = this.props;
    const { orderIndicatorId, orderType } = this.state;
    this.setState({
      pageNum: page,
    });
    getTableInfo({
      pageNum: page,
      orderIndicatorId,
      orderType,
      scope,
      categoryKey: indexID,
    });
  }
  @autobind
  renderContent(value, row, index) {
    const obj = {
      children: value,
      props: {},
    };
    if (index === 0) {
      obj.props.colSpan = 2;
    }
    return obj;
  }

  render() {
    // chartTableInfo使用state中的值
    const { chartTableInfo, style, scope } = this.props;
    const columns = chartTableInfo.titleList;
    const data = chartTableInfo.indicatorSummuryRecordDtos;
    const temp = [];
    let arr = [];
    if (data && data.length) {
      data.map((item, index) => {
        const testArr = this.unitChange(item.indicatorDataList);
        const { id, level: itemLevel, name, orgModel = {} } = item;
        return temp.push(Object.assign(
          { key: index, city: name, level: itemLevel, id, orgModel }, ...testArr,
        ));
      });
      arr = columns.map((item, index) => {
        const column = {
          dataIndex: item.key,
          title: this.getTitleHtml(item),
          width: columnWidth[index],
          render: text => (
            <div className={styles.tdWrapperDiv}>
              {text}
            </div>
          ),
        };
        const hasChildren = item.children;
        if (hasChildren) {
          column.children = this.getChildren(item);
          column.title = `${item.name}(${encodeURIComponent(item.unit) === encodeURIComponent('元') ? '万元' : item.unit})`;
        }
        return column;
      });
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
    }
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
          pageSize={chartTableInfo.pageSize}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
