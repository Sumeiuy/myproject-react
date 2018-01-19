/**
 * @fileOverview components/taskList/performerView/ServiceImplementation.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的服务实施模块
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import TargetCustomer from './TargetCustomer';
import ServiceRecordForm from './ServiceRecordForm';

// 客户任务所处未开始和处理中时服务记录可编辑
// 处理中 20
// 未开始  10
// 此处code码待修改
const EDITABLE = ['10', '20'];

// 目标客户的任务状态
// 处理中 20
// 完成   30
const missionStatusList = [
  { id: 20, name: '处理中' },
  { id: 30, name: '完成' },
];


/**
 * 将数组对象中的id和name转成对应的key和value
 * @param {*} arr 原数组
 * eg: [{ id: 1, name: '11', childList: [] }] 转成 [{ key: 1, value: '11', children: [] }]
 */
function transformCustFeecbackData(arr = []) {
  return _.map(arr, (item) => {
    const obj = {
      key: String(item.id),
      value: item.name,
    };
    if (item.childList && item.childList.length) {
      obj.children = transformCustFeecbackData(item.childList);
    }
    return obj;
  });
}

export default class ServiceImplementation extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { list } = this.props;
    const {
      list: nextList,
    } = nextProps;
    if (nextList !== list) {
      this.setState({
        list: nextList,
      });
    }
  }

  @autobind
  addServiceRecord(postBody) {
    const {
      addServeRecord,
      reloadTargetCustInfo,
    } = this.props;
    // 执行提交服务记录的接口
    addServeRecord(postBody)
      .then(() => {
        if (this.props.addMotServeRecordSuccess) {
          // 服务记录添加成功后重新获取目标客户列表的信息
          reloadTargetCustInfo(() => this.updateList(postBody));
          // this.updateList(postBody);
          message.success('添加服务记录成功');
        }
      });
  }

  // 更新组件state的list信息
  @autobind
  updateList({ custId, flowStatus }) {
    const { list } = this.state;
    const newList = _.map(list, (item) => {
      if (item.custId === custId) {
        const { name } = _.find(missionStatusList, o => o.id === +flowStatus);
        return {
          ...item,
          missionStatusCode: flowStatus,
          missionStatusValue: name,
        };
      }
      return item;
    });
    this.setState({
      list: newList,
    });
  }

  render() {
    const {
      list,
    } = this.state;
    const {
      currentId,
      dict,
      // addServeRecord,
      isFold,
      // list,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      monthlyProfits,
      custIncomeReqState,
      targetCustDetail,
      changeParameter,
      parameter: {
        targetCustId = '',
      },
      queryCustUuid,
      custUuid,
      getCustDetail,
      serviceTypeCode,
      serviceTypeName,
      ceFileDelete,
      getCeFileList,
      filesList,
      deleteFileResult,
      taskFeedbackList,
      addMotServeRecordSuccess,
      reloadTargetCustInfo,
      attachmentList,
    } = this.props;
    // 获取当前选中的数据的custId
    const currentCustId = targetCustId || (list[0] || {}).custId;
    // if (targetCustomerState) {

    // }
    const currentCustomer = _.find(list, o => o.custId === currentCustId);
    let serviceStatusName = '';
    let serviceStatusCode = '';
    let missionFlowId = '';
    if (currentCustomer) {
      serviceStatusCode = currentCustomer.missionStatusCode;
      serviceStatusName = currentCustomer.missionStatusValue;
      missionFlowId = currentCustomer.missionFlowId;
    }

    // 处理中 和 未开始 时表单可编辑
    const isReadOnly = !_.includes(EDITABLE, serviceStatusCode);
    const {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      // attachmentRecord,
      custId,
    } = targetCustDetail;
    // 按照添加服务记录需要的服务类型和任务反馈联动的数据结构来构造数据
    const motCustfeedBackDict = [{
      key: String(serviceTypeCode),
      value: serviceTypeName,
      children: transformCustFeecbackData(taskFeedbackList),
    }];
    // 服务记录的props
    const serviceReocrd = {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceStatusName,
      serviceStatusCode,
      taskFeedbackList,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      custId,
      custUuid,
      missionFlowId,
      motCustfeedBackDict,
      attachmentList,
    };
    return (
      <div>
        <TargetCustomer
          list={list}
          currentId={currentId}
          isFold={isFold}
          currentCustId={currentCustId}
          handleCollapseClick={handleCollapseClick}
          dict={dict}
          getServiceRecord={getServiceRecord}
          serviceRecordData={serviceRecordData}
          getCustIncome={getCustIncome}
          custIncomeReqState={custIncomeReqState}
          monthlyProfits={monthlyProfits}
          targetCustDetail={targetCustDetail}
          changeParameter={changeParameter}
          queryCustUuid={queryCustUuid}
          getCustDetail={getCustDetail}
          getCeFileList={getCeFileList}
          filesList={filesList}
        />
        {
          !_.isEmpty(taskFeedbackList)
            && !_.isEmpty(motCustfeedBackDict)
            ? <ServiceRecordForm
              dict={dict}
              addServeRecord={this.addServiceRecord}
              isReadOnly={isReadOnly}
              isEntranceFromPerformerView
              isFold={isFold}
              queryCustUuid={queryCustUuid}
              custUuid={custUuid}
              formData={serviceReocrd}
              ceFileDelete={ceFileDelete}
              deleteFileResult={deleteFileResult}
              addMotServeRecordSuccess={addMotServeRecordSuccess}
              reloadTargetCustInfo={reloadTargetCustInfo}
              getCeFileList={getCeFileList}
            /> : null
        }
      </div>
    );
  }
}

ServiceImplementation.propTypes = {
  currentId: PropTypes.string.isRequired,
  addServeRecord: PropTypes.func.isRequired,
  dict: PropTypes.object,
  isFold: PropTypes.bool,
  list: PropTypes.array.isRequired,
  handleCollapseClick: PropTypes.func.isRequired,
  getServiceRecord: PropTypes.func.isRequired,
  serviceRecordData: PropTypes.object,
  getCustIncome: PropTypes.func.isRequired,
  monthlyProfits: PropTypes.object.isRequired,
  custIncomeReqState: PropTypes.bool,
  targetCustDetail: PropTypes.object.isRequired,
  parameter: PropTypes.object.isRequired,
  changeParameter: PropTypes.func.isRequired,
  queryCustUuid: PropTypes.func.isRequired,
  custUuid: PropTypes.string.isRequired,
  getCustDetail: PropTypes.func.isRequired,
  serviceTypeCode: PropTypes.string.isRequired,
  serviceTypeName: PropTypes.string.isRequired,
  ceFileDelete: PropTypes.func.isRequired,
  getCeFileList: PropTypes.func.isRequired,
  filesList: PropTypes.array,
  deleteFileResult: PropTypes.array,
  taskFeedbackList: PropTypes.array.isRequired,
  addMotServeRecordSuccess: PropTypes.bool.isRequired,
  reloadTargetCustInfo: PropTypes.func.isRequired,
  attachmentList: PropTypes.array.isRequired,
};

ServiceImplementation.defaultProps = {
  dict: {},
  isFold: false,
  serviceRecordData: {},
  custIncomeReqState: false,
  filesList: [],
  deleteFileResult: [],
};
