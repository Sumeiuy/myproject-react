/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-29 22:38:45
 * 服务记录表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import ServiceRecordContent from '../../../common/serviceRecordContent';
import Button from '../../../common/Button';
import styles from './serviceRecordForm.less';
import logable, { logCommon } from '../../../../decorators/logable';

const PHONE = 'phone';

export default class ServiceRecordForm extends PureComponent {
  static defaultProps = {
    dict: {},
    empInfo: {},
    formData: {},
    isEntranceFromPerformerView: false,
  }

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
    } = this.props;
    const { autoGenerateRecordInfo: { serveContentDesc = '' }, caller = '' } = serviceRecordInfo;
    // 服务记录添加未成功时，后端返回failure
    if (
      caller === PHONE &&
      !_.isEmpty(currentMotServiceRecord.id) &&
      currentMotServiceRecord.id !== 'failure'
    ) {
      data = {
        ...data,
        id: currentMotServiceRecord.id,
        serveContentDesc: `${serveContentDesc}${data.serveContentDesc}`,
      };
    }
    // 添加服务记录
    addServeRecord({
      postBody: data,
      callbackOfPhone: this.handleCancel,
    });

    // log日志 --- 添加服务记录
    // 服务类型
    const { serveType } = data;
    const { missionType } = dict;
    const serveTypeName = _.find(missionType, { key: serveType }).value;
    logCommon({
      type: 'Submit',
      payload: {
        name: serviceCustId,
        type: serveTypeName,
        value: JSON.stringify(data),
      },
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    const { serviceRecordInfo: { caller }, resetServiceRecordInfo } = this.props;
    // 打电话调起的服务记录时，取消按钮不可用
    if (caller !== PHONE) {
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
      serviceRecordInfo: { caller },
    } = this.props;

    if (_.isEmpty(dict) || _.isEmpty(formData)) return null;

    let footNode;
    if (!isReadOnly) {
      footNode = (
        <div className={styles.operationSection}>
          <Button className={styles.submitBtn} onClick={_.debounce(this.handleSubmit, 300)} type="primary" >提交</Button>
          {
            caller !== PHONE
            && <Button className={styles.cancelBtn} onClick={this.handleCancel} >取消</Button>
          }
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
};

ServiceRecordForm.defaultProps = {
  serviceCustId: '',
};
