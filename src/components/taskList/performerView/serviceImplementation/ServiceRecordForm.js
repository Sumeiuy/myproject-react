/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-24 18:41:25
 * 服务记录表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import ServiceRecordContent from '../../../common/serviceRecordContent';
import Button from '../../../common/Button';
import confirm from '../../../common/confirm_';
import styles from './serviceRecordForm.less';
import logable, { logCommon } from '../../../../decorators/logable';
import { UPDATE } from '../../../../config/serviceRecord';
import { serveWay as serveWayUtil } from '../config/code';

export default class ServiceRecordForm extends PureComponent {

  @autobind
  setServiceRecordContentRef(input) {
    this.serviceRecordContentRef = input;
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
    console.warn('data: ', data);
    console.warn('isZLFinsServiceWay: ', isZLFinsServiceWay);
    console.warn('isByTemplate: ', isByTemplate);
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
    } = this.props;

    if (_.isEmpty(dict) || _.isEmpty(formData)) return null;

    let footNode;
    if (!isReadOnly) {
      footNode = (
        <div className={styles.operationSection}>
          {
            !isCurrentMissionPhoneCall
            && <Button className={styles.cancelBtn} onClick={this.handleCancel} >取消</Button>
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
              // 是否是执行者视图页面
              isEntranceFromPerformerView={isEntranceFromPerformerView}
              // 表单数据
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
      </div>
    );
  }
}

ServiceRecordForm.propTypes = {
  addServeRecord: PropTypes.func.isRequired,
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
