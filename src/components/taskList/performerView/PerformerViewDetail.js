/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Pagination } from 'antd';

import Select from '../../common/Select';
import LabelInfo from './LabelInfo';
import BasicInfo from './BasicInfo';
import ServiceImplementation from './ServiceImplementation';
import EmptyTargetCust from './EmptyTargetCust';

import styles from './performerViewDetail.less';

const PAGE_SIZE = 8;
const PAGE_NO = 1;

// 指定每页可以显示多少条
const pageSizeOptions = ['8', '16', '32'];

export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    basicInfo: PropTypes.object.isRequired,
    isFold: PropTypes.bool,
    dict: PropTypes.object.isRequired,
    parameter: PropTypes.object.isRequired,
    currentId: PropTypes.string.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    targetCustList: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isFold: true,
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

  render() {
    const {
      basicInfo,
      isFold,
      dict,
      targetCustList,
      parameter: {
        targetCustomerPageNo,
        targetCustomerPageSize,
        targetCustomerState = '',
      },
    } = this.props;
    const {
      missionId,
      missionName,
      missionStatusName,
      hasSurvey,
      ...otherProps
    } = basicInfo;
    const { list, page } = targetCustList;
    const { serveStatus } = dict;
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
    const curPageNo = targetCustomerPageNo || page.pageNum;
    const curPageSize = targetCustomerPageSize || page.pageSize;

    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          {hasSurvey ? <a className={styles.survey}>任务问卷调查</a> : null}
        </p>
        <BasicInfo
          isFold={isFold}
          {...otherProps}
        />
        <div className={styles.serviceImplementation}>
          <LabelInfo value="服务实施" />
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
                defaultPageSize={PAGE_SIZE}
                pageSizeOptions={pageSizeOptions}
              />
            </div>
          </div>
          {
            _.isEmpty(list) ?
              <EmptyTargetCust /> :
              <ServiceImplementation {...this.props} list={list} />
          }
        </div>
      </div>
    );
  }
}
