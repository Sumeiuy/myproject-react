/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Pagination, Form } from 'antd';

import Select from '../../common/Select';
import LabelInfo from '../common/LabelInfo';
import BasicInfo from '../common/BasicInfo';
import ServiceImplementation from './ServiceImplementation';
import EmptyTargetCust from './EmptyTargetCust';
import QuestionnaireSurvey from './QuestionnaireSurvey';

import styles from './performerViewDetail.less';

const PAGE_SIZE = 8;
const PAGE_NO = 1;
const create = Form.create;

@create()
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
    deleteFileResult: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isFold: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  // 查询目标客户的列表和
  @autobind
  queryTargetCustInfo(obj) {
    const {
      currentId,
      queryTargetCust,
      getCustDetail,
    } = this.props;
    queryTargetCust({
      ...obj,
      missionId: currentId,
    }).then(() => getCustDetail({ missionId: currentId }));
  }

  @autobind
  handlePageChange(pageNo) {
    const {
      parameter: {
        targetCustomerPageSize = PAGE_SIZE,
      targetCustomerState,
      },
      changeParameter,
    } = this.props;
    changeParameter({
      targetCustomerPageNo: pageNo,
      targetCustId: '',
    });
    this.queryTargetCustInfo({
      state: targetCustomerState,
      pageSize: targetCustomerPageSize,
      pageNum: pageNo,
    });
  }

  @autobind
  handleStateChange(key, v) {
    const {
      changeParameter,
    } = this.props;
    changeParameter({
      [key]: v,
      targetCustomerPageSize: PAGE_SIZE,
      targetCustomerPageNo: PAGE_NO,
      targetCustId: '',
    });
    this.queryTargetCustInfo({
      state: v,
      pageSize: PAGE_SIZE,
      pageNum: PAGE_NO,
    });
  }

  @autobind
  showModal() {
    console.log(1111);
    this.setState({
      visible: true,
    });
  }

  @autobind
  handleOk() {
    let isErr = false;
    console.log('===>', this.questionForm);
    this.props.form.validateFields((err, values) => {
      console.log('err--->', err);
      console.log('values--->', values);
      if (!_.isEmpty(err)) {
        isErr = true;
      }
    });
    this.setState({
      visible: isErr,
    });
  }

  @autobind
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleCheckboxChange(key, value) {
    console.log(key, '==>', value);
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
      form,
    } = this.props;
    const { visible } = this.state;
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
    const stateData = serveStatus.map(o => ({
      value: o.key,
      label: o.value,
      show: true,
    }));
    stateData.unshift({
      value: '',
      label: '所有客户',
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
                onChange={this.handlePageChange}
                defaultPageSize={PAGE_SIZE}
              />
            </div>
          </div>
          {
            _.isEmpty(list) ?
              <EmptyTargetCust /> :
              <ServiceImplementation {...this.props} list={list} />
          }
        </div>
        <QuestionnaireSurvey
          ref={ref => this.questionForm = ref}
          form={form}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          onChange={this.handleCheckboxChange}
        />
      </div>
    );
  }
}
