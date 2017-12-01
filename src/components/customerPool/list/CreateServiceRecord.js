/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, message } from 'antd';
import { fspContainer } from '../../../config';
import { url } from '../../../helper';
import ServiceRecordContent from '../../common/serviceRecordContent';
import Loading from '../../../layouts/Loading';
import styles from './createServiceRecord.less';

const MAX_LENGTH = 100;

export default class CreateServiceRecord extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    isShow: PropTypes.bool,
    onToggleServiceRecordModal: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    addServeRecordSuccess: PropTypes.bool.isRequired,
    dict: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string,
    ceFileDelete: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
  }

  static defaultProps = {
    id: '',
    name: '',
    isShow: false,
    loading: false,
    custUuid: '',
  }

  componentDidMount() {
    this.props.queryCustUuid();
  }

  componentWillReceiveProps(nextProps) {
    const {
      onToggleServiceRecordModal,
      loading,
    } = this.props;
    // 添加成功
    if (loading && !nextProps.loading && nextProps.addServeRecordSuccess === true) {
      // this.serviceRecordContentRef.resetField();
      onToggleServiceRecordModal(false);
      message.success('添加服务记录成功');
      // 提交成功后，刷新360视图中的服务记录iframe
      const iframe = document.querySelector(fspContainer.view360Iframe);
      if (iframe) {
        const iframeHash = iframe.contentWindow.location.hash;
        const newIframeHash = iframeHash.replace(/[&\?]?_k=[^&]+/g, ''); // eslint-disable-line
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
    const {
      serviceWay,
      serviceType,
      serviceDate,
      serviceTime,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      // serviceStatus,
      // uploadedFileKey,
      serviceContent,
      custUuid,
    } = this.serviceRecordContentRef.getData();

    if (!serviceContent) {
      message.error('请输入此次服务的内容');
      return;
    }
    if (serviceContent.length > MAX_LENGTH) {
      message.error(`服务的内容字数不能超过${MAX_LENGTH}`);
      return;
    }

    const {
      id,
      addServeRecord,
    } = this.props;

    addServeRecord({
      custId: id,
      serveWay: serviceWay,
      serveType: serviceType,
      type: serviceType,
      serveTime: `${serviceDate.replace(/\//g, '-')} ${serviceTime}`,
      serveContentDesc: serviceContent,
      feedBackTime: feedbackDate.replace(/\//g, '-'),
      serveCustFeedBack: feedbackType,
      serveCustFeedBack2: feedbackTypeChild || '',
      uuid: custUuid,
    });
  }

  // 关闭弹窗
  @autobind
  handleCancel() {
    const { onToggleServiceRecordModal, handleCloseClick } = this.props;
    // 手动上传日志
    handleCloseClick();
    onToggleServiceRecordModal(false);
  }

  @autobind
  handleDeleteFile(params) {
    const { ceFileDelete } = this.props;
    ceFileDelete({ ...params });
  }

  render() {
    const {
      isShow,
      dict,
      loading,
      name,
      id,
      custUuid,
      deleteFileResult,
    } = this.props;

    const title = (
      <p className={styles.title}>
        创建服务记录:
        <span>&nbsp;{name}/{id}</span>
      </p>
    );

    const footer = (
      <div className={styles.customFooter}>
        <a className={styles.cancelBtn} onClick={this.handleCancel}>取消</a>
        <a className={styles.submitBtn} onClick={this.handleSubmit}>提交</a>
      </div>
    );

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
                custUuid={custUuid}
                onDeleteFile={this.handleDeleteFile}
                deleteFileResult={deleteFileResult}
              />
            </div>
            :
            <Loading loading={loading} />
        }
      </Modal>
    );
  }
}
