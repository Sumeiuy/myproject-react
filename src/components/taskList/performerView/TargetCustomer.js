/**
 * @fileOverview components/customerPool/TargetCustomer.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Pagination, Row, Col } from 'antd';
import _ from 'lodash';

import TargetCustomerRight from './TargetCustomerRight';
import LabelInfo from './LabelInfo';
import Select from '../../common/Select';
import TargetCustomerRow from './TargetCustomerRow';

import styles from './targetCustomer.less';

// const datas = {};

// const EMPTY_LIST = [];

const PAGE_SIZE = 8;
const PAGE_NO = 1;

// 指定每页可以显示多少条
const pageSizeOptions = ['8', '16', '32'];

export default class TargetCustomer extends PureComponent {

  static propTypes = {
    // 当前任务的id
    currentId: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    isFold: PropTypes.bool.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    dict: PropTypes.object,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
    // 列表中当前选中的数据
    currentCustId: PropTypes.string,
    targetCustDetail: PropTypes.object.isRequired,
    parameter: PropTypes.object.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
  }

  static defaultProps = {
    dict: {},
    serviceRecordData: {},
    currentCustId: '',
    filesList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  @autobind
  handleStateChange(key, v) {
    const {
      currentId,
      changeParameter,
      queryTargetCust,
      getCustDetail,
    } = this.props;
    changeParameter({
      [key]: v,
      targetCustomerPageSize: PAGE_SIZE,
      targetCustomerPageNo: PAGE_NO,
    });
    queryTargetCust({
      state: v,
      pageSize: PAGE_SIZE,
      pageNum: PAGE_NO,
      missionId: currentId,
      orgId: '',
    }).then(() => getCustDetail({ missionId: currentId }));
  }

  @autobind
  handlePageChange(pageNo) {
    const {
      parameter: {
        targetCustomerPageSize = PAGE_SIZE,
      targetCustomerState,
      },
      currentId,
      changeParameter,
      queryTargetCust,
      getCustDetail,
    } = this.props;
    changeParameter({
      targetCustomerPageNo: pageNo,
    });
    queryTargetCust({
      state: targetCustomerState,
      pageSize: targetCustomerPageSize,
      pageNum: pageNo,
      missionId: currentId,
      orgId: '',
    }).then(() => getCustDetail({ missionId: currentId }));
  }

  @autobind
  handleSizeChange(current, pageSize) {
    const {
      parameter: {
        targetCustomerState,
      },
      currentId,
      changeParameter,
      queryTargetCust,
      getCustDetail,
    } = this.props;
    changeParameter({
      targetCustomerPageSize: pageSize,
      targetCustomerPageNo: PAGE_NO,
    });
    queryTargetCust({
      state: targetCustomerState,
      pageSize,
      pageNum: PAGE_NO,
      missionId: currentId,
      orgId: '',
    }).then(() => getCustDetail({ missionId: currentId }));
  }

  // 查询客户列表项对应的详情
  @autobind
  handleRowClick({ id }) {
    const {
      currentId,
      changeParameter,
      queryCustUuid,
      getCustDetail,
    } = this.props;
    changeParameter({
      targetCustId: id,
    });
    getCustDetail({
      custId: id,
      missionId: currentId,
    });
    // 前置请求
    // 因为上传附件需要前置请求一个custUuid
    queryCustUuid();
  }

  @autobind
  renderList() {
    const {
      list,
      isFold,
      currentCustId,
    } = this.props;
    if (_.isEmpty(list)) {
      return null;
    }
    return list.map(o => <TargetCustomerRow
      key={o.custId}
      item={o}
      isFold={isFold}
      currentCustId={currentCustId}
      onClick={this.handleRowClick}
    />);
  }

  render() {
    const {
      isFold,
      dict,
      page,
      list,
      parameter: {
        targetCustomerPageNo,
        targetCustomerPageSize,
        targetCustomerState = '',
      },
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      custIncomeReqState,
      monthlyProfits,
      targetCustDetail,
      getCeFileList,
      filesList,
    } = this.props;
    if (_.isEmpty(list)) {
      return null;
    }
    const { executeTypes, serveWay, serveStatus } = dict;
    const curPageNo = targetCustomerPageNo || page.pageNum;
    const curPageSize = targetCustomerPageSize || page.pageSize;
    // 根据dict返回的数据，组合成Select组件的所需要的数据结构
    const stateData = [];
    _(serveStatus).forEach((item) => {
      stateData.push({
        value: item.key,
        label: item.value,
        show: true,
      });
    });
    stateData.unshift({
      value: '',
      label: '全部',
      show: true,
    });
    return (
      <div className={styles.targetCustomer}>
        <LabelInfo value="目标客户" />
        <div className={styles.listControl}>
          <div className={styles.stateWidget}>
            <span className={styles.label}>状态:</span>
            <Select
              name="targetCustomerState"
              value={targetCustomerState}
              data={stateData}
              onChange={this.handleStateChange}
            />
          </div>
          <div className={styles.total}>共 <span>{page.totalCount}</span> 位客户</div>
          <div className={styles.pagination}>
            <Pagination
              size="small"
              current={+curPageNo}
              total={+page.totalCount}
              pageSize={+curPageSize}
              showSizeChanger
              onChange={this.handlePageChange}
              onShowSizeChange={this.handleSizeChange}
              defaultPageSize={8}
              pageSizeOptions={pageSizeOptions}
            />
          </div>
        </div>
        <div className={styles.listBox}>
          <Row>
            <Col span={9}>
              <div className={styles.list}>
                {this.renderList()}
              </div>
            </Col>
            <Col span={15}>
              {
                !_.isEmpty(targetCustDetail) ?
                  <TargetCustomerRight
                    isFold={isFold}
                    itemData={targetCustDetail}
                    handleCollapseClick={handleCollapseClick}
                    serveWay={serveWay}
                    executeTypes={executeTypes}
                    getServiceRecord={getServiceRecord}
                    serviceRecordData={serviceRecordData}
                    getCustIncome={getCustIncome}
                    monthlyProfits={monthlyProfits}
                    custIncomeReqState={custIncomeReqState}
                    getCeFileList={getCeFileList}
                    filesList={filesList}
                  /> : null
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
