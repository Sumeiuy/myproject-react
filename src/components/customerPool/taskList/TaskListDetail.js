/**
 * @file components/commissionAdjustment/Detail.js
 *  批量佣金详情
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import InfoTitle from '../../common/InfoTitle';
import InfoItem from '../../common/infoItem';
// import OtherCommission from './OtherCommission';
// import CommonTable from '../../common/biz/CommonTable';
import ApproveList from '../../common/approveList';
import TaskListDetailInfo from './TaskListDetailInfo';
import styles from './taskListDetail.less';
import Icon from '../../common/Icon';
import Button from '../../common/Button';
import GroupTable from '../groupManage/GroupTable';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';

const data = {
  code: '0',
  msg: 'OK',
  resultData: {
    page: {
      pageNum: 1,
      pageSize: 10,
      totalCount: 10344,
      totalPage: 1035,
    },
    custInfos: [
      [
        '客户号',
        '经纪客户号',
        '客户名称',
        '客户类别',
        '客户等级',
        '总资产',
        '资金余额',
        '年累计交易净佣金',
      ],
      [
        'A000000096532676',
        '666628526955',
        '孙强军',
        '新增客户',
        '紫金理财钻石卡客户',
        '8839901.55',
        '7349.55',
        '1591.5',
      ],
      [
        'B000000000434880',
        '666800001707',
        '厦门航空投资有限公司',
        '新增客户',
        '紫金理财钻石卡客户',
        '0',
        '0',
        '119770.13',
      ],
      [
        'A000000096664995',
        '666628630182',
        '晋凤兰',
        '新增客户',
        '紫金理财钻石卡客户',
        '10000098.22',
        '98.22',
        '0',
      ],
      [
        'B000000000434268',
        '666800001045',
        '深圳冠泓基金有限公司－冠泓价值增长1号私募证券投资基金',
        '新增客户',
        '紫金理财钻石卡客户',
        '10573773.031',
        '4060935.7',
        '3019.25',
      ],
      [
        'A000000096600465',
        '666628578165',
        '苏晨',
        '新增客户',
        '紫金理财钻石卡客户',
        '5886889.76',
        '2868.76',
        '2510.96',
      ],
      [
        'B000000000432172',
        '',
        '珠海农村商业银行股份有限公司',
        '新增客户',
        '紫金理财钻石卡客户',
        '0',
        '0',
        '0',
      ],
      [
        'B000000000425673',
        '',
        '华泰紫金投资有限责任公司',
        '新增客户',
        '紫金理财钻石卡客户',
        '0',
        '0',
        '0',
      ],
      [
        'A000000096547491',
        '666628537391',
        '罗丽莲',
        '新增客户',
        '紫金理财钻石卡客户',
        '5035190.36',
        '618.36',
        '831.62',
      ],
      [
        'B000000000434551',
        '666800001312',
        '上海复旦科技园投资有限公司',
        '新增客户',
        '紫金理财钻石卡客户',
        '13709063.37',
        '319.02',
        '7854.25',
      ],
      [
        'A000000095774337',
        '',
        '王琼',
        '新增客户',
        '紫金理财钻石卡客户',
        '7670000',
        '0',
        '0',
      ],
    ],
  },
};
const COLUMN_WIDTH = 115;
const INITIAL_PAGE_SIZE = 10;
const COLUMN_HEIGHT = 36;
export default class TaskListDetail extends PureComponent {

  static propTypes = {
    // location: PropTypes.object.isRequired,
    // checkApproval: PropTypes.func.isRequired,
    // status: PropTypes.object,
  }

  static defaultProps = {
    // data: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: 1,
      curPageSize: 10,
      isShowTable: false,
    };
  }

  @autobind
  handleSeeCust() {
    console.log(111111);
    // debugger;
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

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, (item, index) => _.merge(item, { id: index }));
    }

    return [];
  }

  @autobind
  renderDataSource(column, datas) {
    const dataSource = _.map(datas, (item) => {
      const rowData = {};
      return _.merge(rowData, _.fromPairs(_.map(item, (itemData, index) => { // eslint-disable-line
        return [column[index], itemData];
      })));
    });
    return dataSource;
  }

  renderColumnTitle(columns) {
    // 随着导入表格列的变化而变化
    return _.map(columns, item => ({
      key: item,
      value: item,
    }));
  }

  render() {
    // const custList = createCustTableData(base);
    // const proList = createSubProTableData(item);
    // const bugTitle = `编号:${currentId}`;
    // const drafter = `${divisionName} - ${createdByName} (${createdByLogin})`;
    const stepName = '';
    const handleName = '';
    // 审批记录本地写死数据
    const test = [
      {
        id: '1',
        approver: '002332',
        handleName: 'jjdddd',
        handleTime: '2017-09-21 13:39:21',
        stepName: '流程发起',
        status: '同意',
        comment: '这里是审批意见，有很多的意见，说不完的意见',
      },
      {
        id: '2',
        approver: '002332',
        handleName: 'efefe',
        handleTime: '2017-09-22 13:39:21',
        stepName: '流程发起',
        status: '同意',
        comment: '这里是审批意见，有很多的意见，说不完的意见',
      },
      {
        id: '3',
        approver: '002332',
        handleName: 'aaaaa',
        handleTime: '2017-09-23 13:39:21',
        stepName: '流程发起',
        status: '同意',
        comment: '这里是审批意见，有很多的意见，说不完的意见',
      },
      {
        id: '4',
        approver: '002332',
        handleName: 'fdfdfd',
        handleTime: '2017-09-24 13:39:21',
        stepName: '流程发起',
        status: '同意',
        comment: '这里是审批意见，有很多的意见，说不完的意见',
      },
    ];
    const status = '进行中';
    const { isShowTable, curPageNum, curPageSize, totalRecordNum = 12 } = this.state;
    console.log(this.state.isShowTable);
    const columns = _.head(data.resultData.custInfos);
    const columnSize = _.size(columns);
    const scrollX = (columnSize * COLUMN_WIDTH);

    const scrollXProps = columnSize >= 6 ? {
      isFixedColumn: true,
      // 前两列固定，如果太长，后面的就滚动
      fixedColumn: [0, 1],
      // 列的总宽度加上固定列的宽度
      scrollX,
    } : null;
    const scrollY = (INITIAL_PAGE_SIZE * COLUMN_HEIGHT);
    const dataSource =
      this.addIdToDataSource(this.renderDataSource(columns, _.drop(data.resultData.custInfos)));
    const titleColumn = this.renderColumnTitle(columns);
    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.bugTitle}>任务名称：进行中</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <TaskListDetailInfo
                status={status}
              />
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="目标客户" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="客户类型" value="{drafter}" />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="客户总数" value="{created}" />
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <div className={styles.label}>
                        客户连接<span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        <Icon type="excel" className={styles.excel} />value
                        <a className={styles.seeCust} onClick={this.handleSeeCust}>查看预览</a>
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="标签描述" value="{status}" />
                  </li>
                </ul>
              </div>
            </div>
            <div id="approvalRecord" className={styles.module}>
              <InfoTitle head="审批意见" />
              <ApproveList
                data={test}
                nowStep={{
                  stepName,
                  handleName,
                }}
              />
            </div>
          </div>
        </div>
        {isShowTable ?
          <GroupModal
            // 为了每次都能打开一个新的modal
            visible={isShowTable}
            title={'客户预览'}
            okText={'提交'}
            okType={'primary'}
            onOkHandler={this.handleCloseModal}
            footer={
              <Button type="primary" size="default" onClick={this.handleCloseModal}>
                确定
            </Button>
            }
            width={700}
            modalContent={
              <GroupTable
                pageData={{
                  curPageNum,
                  curPageSize,
                  totalRecordNum,
                }}
                listData={dataSource}
                onSizeChange={this.handleShowSizeChange}
                onPageChange={this.handlePageChange}
                tableClass={styles.custListTable}
                titleColumn={titleColumn}
                // title fixed
                isFixedTitle
                // 纵向滚动
                scrollY={scrollY}
                {...scrollXProps}
                columnWidth={COLUMN_WIDTH}
                bordered
              />
            }
          /> : null
        }
      </div>
    );
  }
}

