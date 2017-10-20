/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-19 19:10:03
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import GroupTable from '../groupManage/GroupTable';
import Button from '../../common/Button';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';
import styles from './taskPreview.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

const Search = Input.Search;
const COLUMN_WIDTH = 100;

export default class TaskPreview extends PureComponent {
  static propTypes = {
    storedTaskFlowData: PropTypes.object.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowTable: false,
      curPageNum: 1,
      curPageSize: 10,
      totalRecordNum: 10,
      titleColumn: this.renderColumnTitle(),
      dataSource: [
        {
          custName: '1-5TTJ-3901230',
          custId: '1180001198232',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3902213310',
          custId: '1180001196822',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-3901230',
          custId: '1180001119822',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-39weqq00',
          custId: '11800011qq9822',
          custDepartment: '南京长江路营业部',
        },
        {
          custName: '1-5TTJ-39dsa00',
          custId: '1180001ww19822',
          custDepartment: '南京长江路营业部',
        },
      ],
    };
  }

  handleTabChange(key) {
    console.log(key);
  }

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    // const { getApprovalList } = this.props;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    // 审批人员数据
    // getApprovalList({
    //   pageNum: nextPage,
    //   pageSize: currentPageSize,
    // });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    // const { getApprovalList } = this.props;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    // 审批人员数据
    // getApprovalList({
    //   pageNum: currentPageNum,
    //   pageSize: changedPageSize,
    // });
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

  @autobind
  handleClick() {
    this.setState({
      isShowTable: true,
    });
  }

  @autobind
  handleCloseModal() {
    this.setState({
      isShowTable: false,
    });
  }

  renderColumnTitle() {
    // custName: '1-5TTJ-39dsa00',
    // custId: '1180001ww19822',
    // custDepartment: '南京长江路营业部',

    const columns = [
      {
        key: 'custId',
        value: '工号',
      },
      {
        key: 'custName',
        value: '姓名',
      },
      {
        key: 'custDepartment',
        value: '所在营业部',
      },
    ];

    return columns;
  }

  render() {
    // const {
    //   taskForm = EMPTY_OBJECT,
    //   labelCust = EMPTY_OBJECT,
    //   custSegment = EMPTY_OBJECT,
    // } = storedTaskFlowData;

    const {
      dataSource,
      isShowTable,
      curPageNum = 1,
      curPageSize = 10,
      totalRecordNum,
      titleColumn,
     } = this.state;

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <div className={styles.taskOverViewContainer}>
        <div className={styles.basicInfoSection}>
          <div className={styles.title}>基本任务信息</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.descriptionOrNameSection}>
              <div>任务名称：</div>
              <div>wewqewqewqewqewqewqewqewq</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>任务描述：</div>
              <div>123213213213213委屈二无群二无群二无群二无群二其味无穷二无群额外企鹅我去服务器服务器让我去让我去</div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>任务类型：</div>
                <div>wewqewqewqewqewqewqewqewq</div>
              </div>
              <div>
                <div>执行方式：</div>
                <div>wewqewqewqewqewqewqewqewq</div>
              </div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>触发时间：</div>
                <div>2017/08/07（一）</div>
              </div>
              <div>
                <div>截止时间：</div>
                <div>2017/08/07（一）</div>
              </div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>服务策略：</div>
              <div>wewqewqewqewqewqewqewqewq</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>任务提示：</div>
              <div>123213213213213委屈二无群二无群二无群二无群二其味无穷二无群额外企鹅我去服务器服务器让我去让我去</div>
            </div>
          </div>
        </div>

        <div className={styles.basicInfoSection}>
          <div className={styles.title}>目标客户</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.descriptionOrNameSection}>
              <div>客户来源：</div>
              <div>标签圈人</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>客户数量：</div>
              <div>12321123户</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>标签说明：</div>
              <div>123213213213213委屈二无群二无群二无群二无群二其味无穷二无群额外企鹅我去服务器服务器让我去让我去</div>
            </div>
          </div>
        </div>

        <div className={styles.selectApprover} onClick={this.handleClick}>
          <span>选择审批人：</span>
          <Search className={styles.searchSection} readOnly />
        </div>
        {
          isShowTable ?
            <GroupModal
              wrapperClass={
                classnames({
                  [styles.approvalModalContainer]: true,
                })
              }
              visible={isShowTable}
              title={'选择审批人员'}
              okText={'确定'}
              okType={'primary'}
              onOkHandler={this.handleCloseModal}
              footer={
                <div className={styles.btnSection}>
                  <Button type="default" size="default" onClick={this.handleCloseModal}>
                    取消
                </Button>
                  <Button type="primary" size="default" className={styles.confirmBtn} onClick={this.handleCloseModal}>
                    确定
                </Button>
                </div>
              }
              modalContent={
                <GroupTable
                  pageData={{
                    curPageNum,
                    curPageSize,
                    totalRecordNum,
                  }}
                  listData={newDataSource}
                  onSizeChange={this.handleShowSizeChange}
                  onPageChange={this.handlePageChange}
                  tableClass={styles.approvalListTable}
                  titleColumn={titleColumn}
                  columnWidth={COLUMN_WIDTH}
                  bordered
                />
              }
            />
            : null
        }
      </div>
    );
  }
}
