/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-07 15:31:52
 * 服务记录表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import ForgeryRichText from '../../common/ForgeryRichText';
import ServiceRecordContent from '../../common/serviceRecordContent';
import Button from '../../common/Button';
import styles from './serviceRecordForm.less';
import logable from '../../../decorators/logable';

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
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubmit() {
    const data = this.serviceRecordContentRef.getData();
    if (_.isEmpty(data)) return;

    // 添加服务记录
    this.props.addServeRecord(data, this.handleCancel);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    if (this.serviceRecordContentRef) {
      this.serviceRecordContentRef.resetField();
    }
  }

  render() {
    const {
      dict,
      isEntranceFromPerformerView,
      isFold,
      formData,
      formData: { serviceTips },
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
      // 投资建议文本撞墙检测
      testWallCollision,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
    } = this.props;

    if (_.isEmpty(dict) || _.isEmpty(formData)) return null;

    return (
      <div className={styles.serviceRecordWrapper}>
        <div className={styles.title}>服务记录</div>
        <div className={styles.serveTip}>
          <div className={styles.title}>任务提示:</div>
          {/**
           * 不要去掉dangerouslySetInnerHTML，瞄准镜标签作为变量塞入任务提示，返回时可能带有<br/>
           * 标签，需要格式化展示出来
           */}
          <div className={styles.content}>
            <ForgeryRichText text={serviceTips} />
          </div>
        </div>

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
          testWallCollision={testWallCollision}
          testWallCollisionStatus={testWallCollisionStatus}
        />

        {
          !isReadOnly ?
            <div className={styles.operationSection}>
              <Button className={styles.submitBtn} onClick={_.debounce(this.handleSubmit, 300)} type="primary" >提交</Button>
              <Button className={styles.cancelBtn} onClick={this.handleCancel} >取消</Button>
            </div> : null
        }
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
  addMotServeRecordSuccess: PropTypes.bool.isRequired,
  getCeFileList: PropTypes.func.isRequired,
  // 涨乐财富通服务方式下的客户反馈列表以及查询方法
  queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
  custFeedbackList: PropTypes.array.isRequired,
  queryApprovalList: PropTypes.func.isRequired,
  zhangleApprovalList: PropTypes.array.isRequired,
  statusCode: PropTypes.string.isRequired,
  // 投资建议文本撞墙检测
  testWallCollision: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测是否有股票代码
  testWallCollisionStatus: PropTypes.bool.isRequired,
};
