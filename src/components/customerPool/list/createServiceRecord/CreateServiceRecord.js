/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, message } from 'antd';
import _ from 'lodash';
import { fspContainer } from '../../../../config/index';
import { url } from '../../../../helper/index';
import logable, { logCommon } from '../../../../decorators/logable';
import ServiceRecordContent from '../../../common/serviceRecordContent';
import confirm from '../../../common/confirm_';
import Loading from '../../../../layouts/Loading';
import { UPDATE } from '../../../../config/serviceRecord';
import { serveWay as serveWayUtil } from '../../../taskList/performerView/config/code';
import styles from './createServiceRecord.less';

/**
 * 将数组对象中的id和name转成对应的key和value
 * @param {*} arr 原数组
 * eg: [{ id: 1, name: '11', childList: [] }] 转成 [{ key: 1, value: '11', children: [] }]
 */
function transformCustFeecbackData(arr = []) {
  return arr.map((item) => {
    const obj = {
      key: String(item.id),
      value: item.name || item.parentClassName,
    };
    if (item.feedbackList && item.feedbackList.length) {
      obj.children = transformCustFeecbackData(item.feedbackList);
    }
    if (item.childList && item.childList.length) {
      obj.children = transformCustFeecbackData(item.childList);
    }
    return obj;
  });
}

// 任务类型配置项，因为
const TASK_TYPE_CODES = {
  MOT_TASK: '0', // 表示MOT任务
  SELF_TASK: '1', // 表示自建任务
};

export default class CreateServiceRecord extends PureComponent {

  static propTypes = {
    onToggleServiceRecordModal: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string,
    ceFileDelete: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    taskFeedbackList: PropTypes.array.isRequired,
    queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
    queryApprovalList: PropTypes.func.isRequired,
    custFeedbackList: PropTypes.array.isRequired,
    zhangleApprovalList: PropTypes.array.isRequired,
    resetServiceRecordInfo: PropTypes.func.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
    // 投资建议文本撞墙检测
    testWallCollision: PropTypes.func.isRequired,
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionStatus: PropTypes.bool.isRequired,
    isPhoneCall: PropTypes.bool,
  }

  static defaultProps = {
    loading: false,
    custUuid: '',
    isPhoneCall: false,
  }

  componentWillReceiveProps(nextProps) {
    const {
      loading,
    } = this.props;
    const {
      currentCommonServiceRecord: { id },
    } = nextProps;
    // 添加未成功时，后端返回failure
    if (loading && !nextProps.loading && !_.isEmpty(id) && id !== 'failure') {
      // 提交成功后，刷新360视图中的服务记录iframe
      const iframe = document.querySelector(fspContainer.view360Iframe);
      if (iframe) {
        const iframeHash = iframe.contentWindow.location.hash;
        const newIframeHash = iframeHash.replace(/[&?]?_k=[^&]+/g, '');
        const obj = url.parse(newIframeHash);
        obj.s = Date.now();
        iframe.contentWindow.location.hash = Object.keys(obj).map(
          key => (`${key}=${obj[key]}`),
        ).join('&');
      }
    }
  }

  // 提交
  @autobind
  handleSubmit() {
    const data = this.serviceRecordContentRef.getData();
    if (_.isEmpty(data)) return;
    const {
      addServeRecord,
      resetServiceRecordInfo,
      currentCommonServiceRecord: { id },
      serviceRecordInfo: {
        id: custId,
        autoGenerateRecordInfo = {},
        todo,
      },
      dict,
      isPhoneCall,
    } = this.props;
    const { serveContentDesc = '', serveTime = '', serveWay = '' } = autoGenerateRecordInfo;
    let payload = { ...data, custId };
    // 打电话成功后，服务记录添加未成功时，后端返回failure
    if (isPhoneCall) {
      payload = {
        ...payload,
        serveTime,
        serveWay,
        serveContentDesc: `${serveContentDesc}${data.serveContentDesc}`,
      };
      // todo=update 时表示更新服务记录
      if (todo === UPDATE && !_.isEmpty(id) && id !== 'failure') {
        payload = {
          ...payload,
          id,
        };
      }
    }
    addServeRecord(payload);
    // 此处需要针对涨乐财富通是通过固定话术的情况下提交服务记录时候，
    // 弹出确认框然后才能进行添加服务记录
    const isZLFinsServiceWay = serveWayUtil.isZhangle(data.serveWay);
    const isByTemplate = !_.isEmpty(_.toString(_.get(data, 'zhangleServiceContentData.templateId')));
    if (isZLFinsServiceWay && isByTemplate) {
      confirm({
        content: '设置的投资建议将发送给客户，确认提交吗？',
        onOk: () => {
          addServeRecord(payload);
        },
      });
    } else {
      // 添加服务记录
      addServeRecord(payload);
    }

    resetServiceRecordInfo();
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
        value: JSON.stringify({ ...data, custId }),
      },
    });
  }

  // 关闭弹窗
  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCancel() {
    const {
      onToggleServiceRecordModal,
      handleCloseClick,
      isPhoneCall,
    } = this.props;
    // 手动上传日志
    handleCloseClick();
    // 打电话调起的弹窗，不能直接手动关闭弹窗，只能提交服务记录进行关闭
    if (!isPhoneCall) {
      onToggleServiceRecordModal(false);
    } else {
      message.warn('请提交服务记录');
    }
  }

  @autobind
  handleDeleteFile(params) {
    const { ceFileDelete } = this.props;
    return ceFileDelete({ ...params });
  }

  /**
   * @param {*} result 本次上传结果
   */
  @autobind
  handleFileUpload(lastFile) {
    // 当前上传的file
    const { currentFile = {}, uploadedFileKey = '', originFileName = '', custUuid } = lastFile;
    this.setState({
      currentFile,
      uploadedFileKey,
      originFileName,
      custUuid,
    });
  }

  render() {
    const {
      dict,
      empInfo,
      loading,
      custUuid,
      deleteFileResult,
      taskFeedbackList,
      queryCustFeedbackList4ZLFins,
      queryApprovalList,
      custFeedbackList,
      zhangleApprovalList,
      serviceRecordInfo,
      // 投资建议文本撞墙检测
      testWallCollision,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
      isPhoneCall,
    } = this.props;
    // 此处需要新增一个对 taskFeedbackList为空的判断
    if (_.isEmpty(taskFeedbackList)) return null;

    const { id = '', name = '', modalVisible = false } = serviceRecordInfo;
    const title = (
      <p className={styles.title}>
        创建服务记录:
        <span>&nbsp;{name}/{id}</span>
      </p>
    );

    const footer = !isPhoneCall ? (
      <div className={styles.customFooter}>
        <a className={styles.cancelBtn} onClick={this.handleCancel}>取消</a>
        <a className={styles.submitBtn} onClick={this.handleSubmit}>提交</a>
      </div>
    ) : (<div className={styles.customPhoneFooter}>
      <a className={styles.submitBtn} onClick={this.handleSubmit}>提交</a>
    </div>);

    // 从客户列表进入创建服务记录的均是自建任务
    const serviceReocrd = {
      custId: id,
      taskTypeCode: TASK_TYPE_CODES.SELF_TASK,
      motCustfeedBackDict: transformCustFeecbackData(taskFeedbackList),
    };


    return (
      <Modal
        width={688}
        className={styles.serviceRecord}
        title={title}
        visible={modalVisible}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={footer}
      >
        {
          !loading ?
            <div className={styles.contentWrapper}>
              <ServiceRecordContent
                ref={ref => (this.serviceRecordContentRef = ref)}
                dict={dict}
                empInfo={empInfo}
                custUuid={custUuid}
                onDeleteFile={this.handleDeleteFile}
                deleteFileResult={deleteFileResult}
                formData={serviceReocrd}
                queryCustFeedbackList4ZLFins={queryCustFeedbackList4ZLFins}
                queryApprovalList={queryApprovalList}
                custFeedbackList={custFeedbackList}
                zhangleApprovalList={zhangleApprovalList}
                serviceRecordInfo={serviceRecordInfo}
                testWallCollision={testWallCollision}
                testWallCollisionStatus={testWallCollisionStatus}
                isPhoneCall={isPhoneCall}
              />
            </div>
            :
            <Loading loading={loading} />
        }
      </Modal>
    );
  }
}
