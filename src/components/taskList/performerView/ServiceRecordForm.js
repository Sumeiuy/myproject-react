/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-30 13:52:04
 * 服务记录表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
// import _ from 'lodash';
import { autobind } from 'core-decorators';
import ServiceRecordContent from '../../common/serviceRecordContent';
import Button from '../../common/Button';
import styles from './serviceRecordForm.less';

export default class ServiceRecordForm extends PureComponent {
  static propTypes = {
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object,
    // 是否是执行者视图页面
    isEntranceFromPerformerView: PropTypes.bool,
    // 表单数据
    formData: PropTypes.object,
    isFold: PropTypes.bool.isRequired,
    custUuid: PropTypes.string.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    addMotServeRecordSuccess: PropTypes.bool.isRequired,
    reloadTargetCustInfo: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    // attachmentRecord: PropTypes.string.isRequired,
  }

  static defaultProps = {
    dict: {},
    formData: {},
    isEntranceFromPerformerView: false,
  }

  @autobind
  handleSubmit() {
    const {
      serviceWay,
      serviceType,
      serviceDate,
      serviceTime,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      serviceStatus,
      serviceContent,
      custUuid,
    } = this.serviceRecordContentRef.getData();

    const {
      formData: { custId = '', missionFlowId = '' },
      addServeRecord,
    } = this.props;
    if (!serviceContent) {
      message.error('请输入此次服务的内容');
      return;
    }

    if (serviceContent.length > 100) {
      message.error('服务的内容字数不能超过100');
      return;
    }
    const postBody = {
      // 经纪客户号
      custId,
      serveWay: serviceWay,
      serveType: serviceType,
      type: serviceType,
      serveTime: `${serviceDate.replace(/\//g, '-')} ${serviceTime}`,
      serveContentDesc: serviceContent,
      feedBackTime: feedbackDate.replace(/\//g, '-'),
      serveCustFeedBack: feedbackType,
      serveCustFeedBack2: feedbackTypeChild || '',
      missionFlowId,
      flowStatus: serviceStatus,
      uuid: custUuid,
    };

    // 添加服务记录
    addServeRecord(postBody);
  }

  @autobind
  handleCancel() {
    this.serviceRecordContentRef.resetField();
  }

  @autobind
  handleDeleteFile(params) {
    const { ceFileDelete } = this.props;
    ceFileDelete({ ...params });
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
      deleteFileResult,
    } = this.props;

    if (!dict) {
      return null;
    }
    return (
      <div className={styles.serviceRecordWrapper}>
        <div className={styles.title}>
          服务记录
        </div>
        <div className={styles.serveTip}>
          <div className={styles.title}>
            服务提示:
          </div>
          <div className={styles.content}>
            {serviceTips || '--'}
          </div>
        </div>

        <ServiceRecordContent
          ref={ref => (this.serviceRecordContentRef = ref)}
          isReadOnly={isReadOnly}
          dict={dict}
          // 是否是执行者视图页面
          isEntranceFromPerformerView={isEntranceFromPerformerView}
          // 表单数据
          formData={formData}
          isFold={isFold}
          custUuid={custUuid}
          onDeleteFile={this.handleDeleteFile}
          deleteFileResult={deleteFileResult}
        />

        {
          !isReadOnly ?
            <div className={styles.operationSection}>
              <Button
                className={styles.submitBtn}
                onClick={this.handleSubmit}
                type="primary"
              >
                提交</Button>
              <Button
                className={styles.cancelBtn}
                onClick={this.handleCancel}
              >取消</Button>
            </div> : null
        }
      </div>
    );
  }
}
