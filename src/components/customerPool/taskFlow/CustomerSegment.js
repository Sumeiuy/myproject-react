/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 13:43:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-11 17:53:35
 * 客户细分组件
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import GroupTable from '../groupManage/GroupTable';

import tableStyles from '../groupManage/groupTable.less';
// import CustRange from '../common/CustRange';
import Button from '../../common/Button';
import styles from './customerSegment.less';

const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

const Option = Select.Option;

const indicator = [
  {
    key: '客户性质',
    value: '客户性质',
  },
  {
    key: '选择指标',
    value: '选择指标',
  },
  {
    key: '总资产',
    value: '总资产',
  },
];

const type = [
  {
    key: '1',
    value: '且',
  },
  {
    key: '2',
    value: '或',
  },
];

export default class CustomerSegment extends PureComponent {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: 1,
      curPageSize: 10,
      // mock数据
      dataSource: [
        {
          custName: '1-5TTJ-3900',
          custId: '118000119822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '118000119822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '118000119822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '118000119822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '118000119822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
      ],
      totalRecordNum: 5,
      isShowTable: false,
    };
  }

  @autobind
  showMatchCustomerTable() {
    this.setState({
      isShowTable: true,
    });
  }

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.custId }));
    }

    return [];
  }

  handleTabChange(key) {
    console.log(key);
  }

  handleChange(value) {
    console.log(value);
  }

  renderOneGroupIndicatorSection() {
    return (
      <div className={styles.customerSegmentSection}>
        <div className={styles.conditionSection}>{type[0].value}</div>
        <div className={styles.conditionSection} />
        {this.renderOneSection()}
      </div>
    );
  }

  /**
   * 渲染指标列
   */
  renderOneSection() {
    return _.map(indicator, () =>
      <div className={styles.conditionSection}>
        <div className={styles.selectCondition}>
          <Select
            style={{ width: 60 }}
            defaultValue={1}
            onChange={this.handleChange}
            className={styles.indicator}
          >
            <Option key={1} value={1}>{1}</Option>
            <Option key={2} value={2}>{2}</Option>
            <Option key={3} value={3}>{3}</Option>
          </Select>
        </div>
        <div className={styles.selectCondition}>
          <Select
            style={{ width: 60 }}
            defaultValue={2}
            onChange={this.handleChange}
            className={styles.condition}
          >
            <Option key={1} value={1}>{1}</Option>
            <Option key={2} value={2}>{2}</Option>
            <Option key={3} value={3}>{3}</Option>
          </Select>
        </div>
        <div className={styles.selectCondition}>
          <Select
            style={{ width: 60 }}
            mode="multiple"
            defaultValue={['3']}
            onChange={this.handleChange}
            className={styles.value}
          >
            <Option key={1} value={1}>{1}</Option>
            <Option key={2} value={2}>{2}</Option>
            <Option key={3} value={3}>{3}</Option>
          </Select>
        </div>
        <div className={styles.delete}>
          <Icon type="close" className={styles.deleteIcon} />
        </div>
      </div>);
  }

  renderColumnTitle() {
    // "custName":"1-5TTJ-3900",
    // "custId":"118000119822",
    // "levelName":"钻石",
    // "riskLevelName":"稳定"
    return [
      {
        key: 'custName',
        value: '客户名称',
      },
      {
        key: 'custManager',
        value: '服务经理',
      },
      {
        key: 'custDepartment',
        value: '所在营业部',
      },
      {
        key: 'custId',
        value: '经济客户号',
      },
      {
        key: 'levelName',
        value: '客户等级',
      },
      {
        key: 'riskLevelName',
        value: '风险等级',
      },
      {
        key: 'totalAsset',
        value: '总资产',
      },
      {
        key: 'rate',
        value: '沪深归集率',
      }];
  }

  render() {
    const {
      curPageNum = 1,
      curPageSize = 10,
      dataSource = EMPTY_LIST,
      totalRecordNum,
      isShowTable,
    } = this.state;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <div className={styles.customerSegmentContainer}>
        {this.renderOneGroupIndicatorSection()}
        <div className={styles.overviewBtnSection}>
          <Button className={styles.overviewBtn} type="default" onClick={this.showMatchCustomerTable}>预览</Button>
        </div>
        <div className={styles.tableSection}>
          <div className={styles.title}>共匹配到<span>2346</span>客户</div>
          {
            isShowTable ?
              <GroupTable
                pageData={{
                  curPageNum,
                  curPageSize,
                  totalRecordNum,
                }}
                listData={newDataSource}
                onSizeChange={this.handleShowSizeChange}
                onPageChange={this.handlePageChange}
                tableClass={
                  classnames({
                    [tableStyles.groupTable]: true,
                    [styles.custListTable]: true,
                  })
                }
                titleColumn={titleColumn}
                isFixedColumn
                // 前三列固定，如果太长，后面的就滚动
                fixedColumn={[0, 1, 2]}
                // 列的总宽度加上固定列的宽度
                scrollX={1440}
                columnWidth={120}
                isFirstColumnLink={false}
                bordered
              /> : null
          }
        </div>
      </div>
    );
  }
}
