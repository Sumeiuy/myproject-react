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
  @autobind
  getChildren(item) {
    const childrenArr = [];
    if (item.children) {
      item.children.map(child =>
        childrenArr.push({
          title: child.name,
          dataIndex: child.key,
          key: `key${child.key}`,
          width: 100,
        }));
    }
    console.log('childrenArr', childrenArr);
    return childrenArr;
  }
  @autobind
  handleTitleClick(item) {
    const { getTableInfo, indexID } = this.props;
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
      categoryKey: indexID,
    });
  }
  // 表格标题排序箭头事件
  @autobind
  arrowHandle(e, item, type) {
    const { getTableInfo, indexID } = this.props;
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
    return toolTipTittle ? <Tooltip placement="right" title={`${record.orgModel.level2Name} - ${record.orgModel.level3Name}`}>
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
    const { getTableInfo, indexID } = this.props;
    const { orderIndicatorId, orderType } = this.state;
    this.setState({
      pageNum: page,
    });
    getTableInfo({
      pageNum: page,
      orderIndicatorId,
      orderType,
      categoryKey: indexID,
    });
  }
  @autobind
  renderContent(value, row, index) {
    const obj = {
      children: value,
      props: {},
    };
    if (index === 1) {
      obj.props.colSpan = 0;
    }
    return obj;
  }

  render() {
    // chartTableInfo使用state中的值
    const { chartTableInfo, location: { query }, level, style } = this.props;
    const { orderIndicatorId, orderType } = this.state;
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
          title: (
            <span
              className={styles.columnsTitle}
              onClick={() => { this.handleTitleClick(item); }}
            >
              {`${item.name}(${encodeURIComponent(item.unit) === encodeURIComponent('元') ? '万元' : item.unit})`}
              <span className={'ant-table-column-sorter'}>
                <span
                  className={`
                    ant-table-column-sorter-up
                    ${((query.orderIndicatorId || orderIndicatorId) === item.key && ((query.tableOrderType || orderType) !== 'desc')) ? 'on' : 'off'}
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
                    ${((query.orderIndicatorId || orderIndicatorId) === item.key && ((query.tableOrderType || orderType) !== 'asc')) ? 'on' : 'off'}
                  `}
                  title="↓"
                  onClick={(e) => {
                    this.arrowHandle(e, item, 'desc');
                  }}
                >
                  <i className={'anticon anticon-caret-down'} />
                </span>
              </span>
            </span>
          ),
          width: columnWidth[index],
          // render: this.renderContent,
          render: text => (
            <div className={styles.tdWrapperDiv}>
              {text}
            </div>
          ),
        };
        const hasChildren = item.children;
        if (hasChildren) {
          column.children = this.getChildren(item);
          column.render = this.renderContent;
        }
        return column;
      });
      const tempScope = query.scope || Number(level) + 1;
      // 匹配第一列标题文字，分公司、营业部、投顾
      let keyName = '';
      for (let i = 0; i < sortByType.length; i++) {
        if (Number(tempScope) === Number(sortByType[i].scope)) {
          keyName = sortByType[i].name;
        }
      }
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
      // 表格汇总 显示 colspan
      // arr[1].render = (text, row, index) => {
      //   if (index < 1) {
      //     return (
      //       <div className={styles.tdWrapperDiv}>
      //         {text}
      //       </div>
      //     );
      //   }
      //   return {
      //     children: <div className={styles.tdWrapperDiv}>{text}</div>,
      //     props: {
      //       colSpan: 2,
      //     },
      //   };
      // };
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
          pageSize={10}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
