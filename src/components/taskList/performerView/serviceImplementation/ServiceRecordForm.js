/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-09 14:03:20
 * 服务记录表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'dva';

import ServiceRecordContent from '../../../common/serviceRecordContent';
import AllotEmpModal from '../../../common/commonApproverModal';
import Button from '../../../common/Button';
import confirm from '../../../common/confirm_';
import logable, { logCommon, logPV } from '../../../../decorators/logable';
import { dva } from '../../../../helper';
import { UPDATE } from '../../../../config/serviceRecord';
import { serveWay as serveWayUtil } from '../config/code';
import { MOT_RETURN_VISIT_TASK_EVENT_ID } from '../../../../config/taskList/performView';

import styles from './serviceRecordForm.less';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
   // MOT回访任务可分配人员的列表
  allotEmpList: state.performerView.allotEmpList,
   // 回访任务分配结果
  allotEmpResult: state.performerView.allotEmpResult,
});

const mapDispatchToProps = {
  // 获取MOT 回访任务人员列表
  queryAllotEmpList: effect('performerView/queryAllotEmpList', { forceFull: true }),
  // 将任务分配给选中的人员
  dispatchTaskToEmp: effect('performerView/dispatchTaskToEmp', { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ServiceRecordForm extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // 点击分配按钮选择分配的人员
      allotEmpModal: false,
    };
  }

  componentDidUpdate(prevProps) {
    // 判断当前的是否需要查询可分配人员列表接口
    const { formData: { custUuid: prevUUid } } = prevProps;
    const { formData: { eventId, isDispatchEmp, custUuid, custId } } = this.props;
    const needQueryAllotEmpList = this.isMOTReturnVistTask(eventId) && isDispatchEmp;
    if (needQueryAllotEmpList && prevUUid !== custUuid) {
      this.props.queryAllotEmpList({
        custNumber: custId,
      });
    }
  }

  @autobind
  setServiceRecordContentRef(input) {
    this.serviceRecordContentRef = input;
  }

  // 判断当前的任务是否是 MOT 回访类型任务
  // TODO 目前开发状态下暂时默认为true
  @autobind
  isMOTReturnVistTask(eventId) {
    return MOT_RETURN_VISIT_TASK_EVENT_ID === eventId;
  }

  @autobind
  doAfterAllotTask() {
    // 分配任务后，该任务就不属于当前登录人了，所以还得刷新任务列表
    const { location: { query } } = this.props;
    this.props.refreshTaskList(query);
  }

  @autobind
  handleSubmit() {
    let data = this.serviceRecordContentRef.getData();
    if (_.isEmpty(data)) return;
    const {
      addServeRecord,
      serviceRecordInfo,
      currentMotServiceRecord,
      dict,
      serviceCustId,
      isCurrentMissionPhoneCall,
    } = this.props;
    const { autoGenerateRecordInfo: { serveContentDesc = '' }, todo } = serviceRecordInfo;
    // 服务记录添加未成功时，后端返回failure, todo=update 时，入参多一个id，表示更新服务记录
    if (
      isCurrentMissionPhoneCall
      && todo === UPDATE
      && !_.isEmpty(currentMotServiceRecord.id)
      && currentMotServiceRecord.id !== 'failure'
    ) {
      data = {
        ...data,
        id: currentMotServiceRecord.id,
        serveContentDesc: `${serveContentDesc}${data.serveContentDesc}`,
      };
    }
    // 此处需要针对涨乐财富通是通过固定话术的情况下提交服务记录时候，
    // 弹出确认框然后才能进行添加服务记录
    const isZLFinsServiceWay = serveWayUtil.isZhangle(data.serveWay);
    const isByTemplate = !_.isEmpty(_.toString(_.get(data, 'zhangleServiceContentData.templateId')));
    if (isZLFinsServiceWay && isByTemplate) {
      confirm({
        content: '设置的投资建议将发送给客户，确认提交吗？',
        onOk: () => {
          addServeRecord({
            postBody: data,
            phoneCallback: this.handleCancel,
          });
        },
      });
    } else {
      // 添加服务记录
      addServeRecord({
        postBody: data,
        phoneCallback: this.handleCancel,
      });
    }

    // log日志 --- 添加服务记录
    // 服务类型
    const { serveType } = data;
    const { missionType } = dict;
    const serveTypeName = _.find(missionType, { key: serveType }).value;
    logCommon({
      type: 'Submit',
      payload: {
        name: '服务记录',
        type: serveTypeName,
        value: JSON.stringify({ ...data, serviceCustId }),
      },
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    const { isCurrentMissionPhoneCall, resetServiceRecordInfo } = this.props;
    // 打电话调起的服务记录时，取消按钮不可用
    if (!isCurrentMissionPhoneCall) {
      if (this.serviceRecordContentRef) {
        this.serviceRecordContentRef.resetField();
      }
    } else {
      // 取消打电话时自动生成服务记录时保存的数据
      resetServiceRecordInfo();
    }
  }

  @autobind
  @logPV({
    pathname: '/modal/taskCenterTaskList/executor/allotEmpModal',
    title: '执行者视图下MOT回访任务分配弹框',
  })
  handleAllotBtnClick() {
    console.warn('点击分配按钮');
    this.setState({ allotEmpModal: true });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleAllotEmpModalClose() {
    this.setState({ allotEmpModal: false });
  }

  @autobind
  handleAllotEmpModalOk(emp) {
    if (_.isEmpty(emp)) {
      confirm({ content: '请选择分配人员！' });
    } else {
      const { formData: { missionFlowId } } = this.props;
      this.setState({ allotEmpModal: false });
      this.props.dispatchTaskToEmp({
        toEmpId: emp.empNo,
        flowId: missionFlowId,
      }).then(this.doAfterAllotTask);
    }
  }

  render() {
    const {
      dict,
      isEntranceFromPerformerView,
      isFold,
      formData,
      custUuid,
      isReadOnly,
      isReject,
      deleteFileResult,
      ceFileDelete,
      queryCustFeedbackList4ZLFins,
      custFeedbackList,
      queryApprovalList,
      zhangleApprovalList,
      empInfo: { empInfo },
      statusCode,
      serviceRecordInfo,
      // 投资建议文本撞墙检测
      testWallCollision,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
      isCurrentMissionPhoneCall,
      onFormDataChange,
      // MOT 回访任务可分配的人员列表
      allotEmpList,
    } = this.props;

    const { allotEmpModal } = this.state;

    if (_.isEmpty(dict) || _.isEmpty(formData)) return null;

    const showAllocateBtn = this.isMOTReturnVistTask(formData.eventId) && formData.isDispatchEmp;

    let footNode;
    if (!isReadOnly) {
      footNode = (
        <div className={styles.operationSection}>
          {
            !isCurrentMissionPhoneCall
            && <Button className={styles.cancelBtn} onClick={this.handleCancel} >取消</Button>
          }
          {
            !showAllocateBtn ? null
            : (
              <Button className={styles.cancelBtn} onClick={this.handleAllotBtnClick} >分配</Button>
            )
          }
          <Button className={styles.submitBtn} onClick={_.debounce(this.handleSubmit, 300)} type="primary" >提交</Button>
        </div>
      );
    }
    return (
      <div className={styles.serviceRecordWrapper}>
        <div className={styles.inner}>
          <div className={styles.title}>服务记录</div>
          <div className={styles.content}>
            <ServiceRecordContent
              ref={this.setServiceRecordContentRef}
              isReadOnly={isReadOnly}
              isReject={isReject}
              dict={dict}
              empInfo={empInfo}
              isEntranceFromPerformerView={isEntranceFromPerformerView}
              formData={formData}
              isFold={isFold}
              custUuid={custUuid}
              onDeleteFile={ceFileDelete}
              deleteFileResult={deleteFileResult}
              queryCustFeedbackList4ZLFins={queryCustFeedbackList4ZLFins}
              custFeedbackList={custFeedbackList}
              zhangleApprovalList={zhangleApprovalList}
              queryApprovalList={queryApprovalList}
              flowStatusCode={statusCode}
              serviceRecordInfo={serviceRecordInfo}
              testWallCollision={testWallCollision}
              testWallCollisionStatus={testWallCollisionStatus}
              isPhoneCall={isCurrentMissionPhoneCall}
              onFormDataChange={onFormDataChange}
            />
            {footNode}
          </div>
        </div>
        {
          !allotEmpModal ? null
          : (
            <AllotEmpModal
              modalKey="executorAllotEmpModal"
              title="选择处理人"
              visible={allotEmpModal}
              approverList={allotEmpList}
              onClose={this.handleAllotEmpModalClose}
              onOk={this.handleAllotEmpModalOk}
              pagination={{
                pageSize: 5,
              }}
            />
          )
        }
      </div>
    );
  }
}

ServiceRecordForm.propTypes = {
  addServeRecord: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  dict: PropTypes.object,
  empInfo: PropTypes.object,
  // 是否是执行者视图页面
  isEntranceFromPerformerView: PropTypes.bool,
  // 表单数据
  formData: PropTypes.object,
  isFold: PropTypes.bool.isRequired,
  custUuid: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  // 是否驳回，只有在涨乐财富通的服务方式并且是自由编辑下才有
  isReject: PropTypes.bool.isRequired,
  ceFileDelete: PropTypes.func.isRequired,
  deleteFileResult: PropTypes.array.isRequired,
  getCeFileList: PropTypes.func.isRequired,
  // 涨乐财富通服务方式下的客户反馈列表以及查询方法
  queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
  custFeedbackList: PropTypes.array.isRequired,
  queryApprovalList: PropTypes.func.isRequired,
  zhangleApprovalList: PropTypes.array.isRequired,
  statusCode: PropTypes.string.isRequired,
  serviceRecordInfo: PropTypes.object.isRequired,
  currentMotServiceRecord: PropTypes.object.isRequired,
  resetServiceRecordInfo: PropTypes.func.isRequired,
  // 服务实施客户名次
  serviceCustId: PropTypes.string,
  // 投资建议文本撞墙检测
  testWallCollision: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测是否有股票代码
  testWallCollisionStatus: PropTypes.bool.isRequired,
  isCurrentMissionPhoneCall: PropTypes.bool,
  onFormDataChange: PropTypes.func,
  dispatchTaskToEmp: PropTypes.func.isRequired,
  queryAllotEmpList: PropTypes.func.isRequired,
  refreshTaskList: PropTypes.func.isRequired,
  allotEmpList: PropTypes.array.isRequired,
  allotEmpResult: PropTypes.string.isRequired,
};

ServiceRecordForm.defaultProps = {
  dict: {},
  empInfo: {},
  formData: {},
  isEntranceFromPerformerView: false,
  serviceCustId: '',
  isCurrentMissionPhoneCall: false,
  onFormDataChange: _.noop,
};
