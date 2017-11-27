/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-27 14:17:17
 * 服务记录表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { autobind } from 'core-decorators';
import ServiceRecordContent from '../../common/serviceRecordContent';
import Button from '../../common/Button';
import styles from './serviceRecordForm.less';

export default class ServiceRecordForm extends PureComponent {
  static propTypes = {
    isReadOnly: PropTypes.bool.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object,
    // 是否是执行者视图页面
    isEntranceFromPerformerView: PropTypes.bool,
    // 表单数据
    formData: PropTypes.object,
    // 服务类型
    serviceType: PropTypes.string,
    currentSelectedCust: PropTypes.object.isRequired,
    isFold: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    dict: {},
    formData: {},
    serviceType: '',
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
      uploadedFileKey,
      serviceContent,
    } = this.serviceRecordContentRef.getData();

    if (!serviceContent) {
      message.error('请输入此次服务的内容');
      return;
    }

    if (serviceContent.length > 100) {
      message.error(`服务的内容字数不能超过${100}`);
      return;
    }

    const { addServeRecord, isEntranceFromPerformerView } = this.props;

    let postBody = {
      // 经纪客户号
      custId: '',
      serveWay: serviceWay,
      serveType: serviceType,
      type: serviceType,
      serveTime: `${serviceDate.replace(/\//g, '-')} ${serviceTime}`,
      serveContentDesc: serviceContent,
      feedBackTime: feedbackDate.replace(/\//g, '-'),
      serveCustFeedBack: feedbackType,
      serveCustFeedBack2: feedbackTypeChild || '',
      // 从客户列表带过来
      custUuid: '',
    };

    if (uploadedFileKey) {
      postBody = {
        ...postBody,
        file: uploadedFileKey,
      };
    } else if (isEntranceFromPerformerView) {
      postBody = {
        ...postBody,
        serviceStatus,
      };
    }

    addServeRecord(postBody);
  }

  @autobind
  handleCancel() {
    this.serviceRecordContentRef.resetField();
  }

  render() {
    const {
      dict,
      isReadOnly,
      isEntranceFromPerformerView,
      currentSelectedCust,
      isFold,
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
            静态文本
          </div>
        </div>

        <ServiceRecordContent
          ref={ref => (this.serviceRecordContentRef = ref)}
          isReadOnly={isReadOnly}
          dict={dict}
          // 是否是执行者视图页面
          isEntranceFromPerformerView={isEntranceFromPerformerView}
          // 表单数据
          formData={{}}
          // 服务类型
          serviceType={''}
          currentSelectedCust={currentSelectedCust}
          isFold={isFold}
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
