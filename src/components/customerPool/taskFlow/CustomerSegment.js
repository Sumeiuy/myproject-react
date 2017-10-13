/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 13:43:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-13 17:24:20
 * 客户细分组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import GroupTable from '../groupManage/GroupTable';
import Upload from './Upload';
import tableStyles from '../groupManage/groupTable.less';
import styles from './customerSegment.less';

const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

export default class CustomerSegment extends PureComponent {
  static propTypes = {
    attachModelList: PropTypes.array,
  };

  static defaultProps = {
    attachModelList: EMPTY_LIST,
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
          custId: '1180001198232',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '1180001196822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '1180001119822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '11800011qq9822',
          levelName: '钻石',
          riskLevelName: '稳定',
          rate: 0.11,
          totalAsset: 100023121,
          custManager: '张三',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3900',
          custId: '1180001ww19822',
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

  // 上传直接提交
  @autobind
  handleFileUpload(file, type) {
    let fileStatus = {};
    const { uploadedFileKey } = file;
    if (type === 'ADD') {
      fileStatus = {
        uploadedFiles: [file],
      };
    } else if (type === 'DELETE') {
      fileStatus = {
        deletedFiles: [file],
      };
    }

    // 已经上传的file key
    // 用来预览客户列表时，用
    this.setState({
      uploadedFileKey,
    });

    console.log(fileStatus);
    // 可能需要发请求去拿列表数据或者删除刚才上传的文件
    // TODO
  }

  renderColumnTitle() {
    // "custName":"1-5TTJ-3900",
    // "custId":"118000119822",
    // "levelName":"钻石",
    // "riskLevelName":"稳定"

    // 随着导入表格列的变化而变化
    // TODO
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

    const { attachModelList } = this.props;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <div className={styles.customerSegmentContainer}>
        <div className={styles.uploadSection}>
          <Upload
            onOperateFile={this.handleFileUpload}
            attachModelList={attachModelList}
            onHandleOverview={this.showMatchCustomerTable}
          />
        </div>
        <div className={styles.tableSection}>
          {
            isShowTable ?
              <div className={styles.title}>共匹配到<span>2346</span>客户</div> : null
          }
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
