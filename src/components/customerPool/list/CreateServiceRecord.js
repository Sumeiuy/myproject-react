/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';
import _ from 'lodash';
import { fspContainer } from '../../../config';
import { url } from '../../../helper';
import logable from '../../../decorators/logable';
import ServiceRecordContent from '../../common/serviceRecordContent';
import Loading from '../../../layouts/Loading';
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
    id: PropTypes.string,
    name: PropTypes.string,
    isShow: PropTypes.bool,
    onToggleServiceRecordModal: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    currentCommonServiceRecord: PropTypes.bool.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string,
    ceFileDelete: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    taskFeedbackList: PropTypes.array.isRequired,
    queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
    queryApprovalList: PropTypes.func.isRequired,
    custFeedbackList: PropTypes.array.isRequired,
    zhangleApprovalList: PropTypes.array.isRequired,
    caller: PropTypes.string.isRequired,
    prevRecordInfo: PropTypes.object.isRequired,
    resetCaller: PropTypes.func.isRequired,
  }

  static defaultProps = {
    id: '',
    name: '',
    isShow: false,
    loading: false,
    custUuid: '',
  }

  componentDidMount() {
    // 只要改组件初次加载完成，就请求一遍custUuid
    this.props.queryCustUuid();
  }

  componentWillReceiveProps(nextProps) {
    const {
      loading,
    } = this.props;
    const {
      currentCommonServiceRecord: { id = null },
    } = nextProps;
    // 添加成功
    if (loading && !nextProps.loading && !_.isEmpty(id)) {
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
  @logable({ type: 'Click', payload: { name: '提交' } })
  handleSubmit() {
    const data = this.serviceRecordContentRef.getData();
    if (_.isEmpty(data)) return;
    const {
      id: custId,
      addServeRecord,
      resetCaller,
      caller,
      currentCommonServiceRecord: { id },
    } = this.props;
    const payload = caller !== 'phone' ? { ...data, custId } : { ...data, custId, id };
    addServeRecord(payload);
    resetCaller();
  }

  // 关闭弹窗
  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCancel() {
    const { onToggleServiceRecordModal, handleCloseClick, caller } = this.props;
    // 手动上传日志
    handleCloseClick();
    // 打电话调起的弹窗，不能直接手动关闭弹窗，只能提交服务记录进行关闭
    if (caller !== 'phone') {
      onToggleServiceRecordModal(false);
    }
  }

  @autobind
  handleDeleteFile(params) {
    const { ceFileDelete } = this.props;
    ceFileDelete({ ...params });
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
      isShow,
      dict,
      empInfo,
      loading,
      name,
      id,
      custUuid,
      deleteFileResult,
      taskFeedbackList,
      queryCustFeedbackList4ZLFins,
      queryApprovalList,
      custFeedbackList,
      zhangleApprovalList,
      caller,
      prevRecordInfo,
    } = this.props;
    // 此处需要新增一个对 taskFeedbackList为空的判断
    if (_.isEmpty(taskFeedbackList)) return null;

    const title = (
      <p className={styles.title}>
        创建服务记录:
        <span>&nbsp;{name}/{id}</span>
      </p>
    );

    const footer = caller !== 'phone' ? (
      <div className={styles.customFooter}>
        <a className={styles.cancelBtn} onClick={this.handleCancel}>取消</a>
        <a className={styles.submitBtn} onClick={this.handleSubmit}>提交</a>
      </div>
    ) : (<div className={styles.customFooter}>
      <a className={styles.submitBtn} onClick={this.handleSubmit}>提交</a>
    </div>);

    // 从客户列表进入创建服务记录的均是自建任务
    const serviceReocrd = {
      taskTypeCode: TASK_TYPE_CODES.SELF_TASK,
      motCustfeedBackDict: transformCustFeecbackData(taskFeedbackList),
    };

    return (
      <Modal
        width={688}
        className={styles.serviceRecord}
        title={title}
        visible={isShow}
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
                caller={caller}
                prevRecordInfo={prevRecordInfo}
              />
            </div>
            :
            <Loading loading={loading} />
        }
      </Modal>
    );
  }
}
