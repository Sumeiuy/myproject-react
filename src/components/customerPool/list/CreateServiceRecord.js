/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Modal, Select, DatePicker, TimePicker, Input, message } from 'antd';
import moment from 'moment';
import Uploader from '../taskFlow/Uploader';
import { fspContainer, request } from '../../../config';
import Clickable from '../../../components/common/Clickable';
import { helper } from '../../../utils';
import Loading from '../../../layouts/Loading';
import styles from './createServiceRecord.less';

const { Option } = Select;
const { TextArea } = Input;

// 日期组件的显示格式
const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm';
const width = { width: 142 };

// 服务内容字数限制
const MAX_LENGTH = 100;

const EMPTY_LIST = [];

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// {key:1, children: [{key: 11}]} 转成 {1: [{key: 11}]}
function generateObjOfKey(arr) {
  const subObj = {};
  arr.forEach((obj) => {
    if (obj.children && !_.isEmpty(obj.children)) {
      subObj[obj.key] = obj.children;
    } else {
      subObj[obj.key] = EMPTY_LIST;
    }
  });
  return subObj;
}

// {value:2, children: [{key: 222}]} 转成 {2: [{key: 222}]}
function generateObjOfValue(arr) {
  const subObj = {};
  arr.forEach((obj) => {
    if (obj.children && !_.isEmpty(obj.children)) {
      subObj[obj.value] = obj.children;
    } else {
      subObj[obj.value] = EMPTY_LIST;
    }
  });
  return subObj;
}

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
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    id: '',
    name: '',
    isShow: false,
    loading: false,
  }

  constructor(props) {
    super(props);
    const {
      serveWay = [{}],
      custServerTypeFeedBackDict = [{}],
    } = props.dict;
    // 服务类型value对应服务类型数组
    this.serviceTypeObj = generateObjOfKey(custServerTypeFeedBackDict);
    // 反馈类型数组
    const feedbackTypeArr = (custServerTypeFeedBackDict[0] || {}).children || EMPTY_LIST;
    // 反馈类型value对应反馈类型数组
    this.feedbackTypeObj = generateObjOfValue(feedbackTypeArr) || EMPTY_LIST;
    // 反馈子类型数组
    const feedbackTypeChildArr = (feedbackTypeArr[0] || {}).children || EMPTY_LIST;
    // 当前日期的时间戳
    const currentDate = new Date().getTime();
    const serviceType = (custServerTypeFeedBackDict[0] || {}).key || '';
    const feedbackType = (feedbackTypeArr[0] || {}).value || '';
    const feedbackTypeChild = (feedbackTypeChildArr[0] || {}).value || '';
    this.state = {
      serviceWay: (serveWay[0] || {}).key,
      serviceType,
      serviceDate: moment(currentDate).format(dateFormat),
      serviceTime: moment(currentDate).format(timeFormat),
      feedbackDate: moment(currentDate).format(dateFormat),
      feedbackType,
      feedbackTypeChild,
      feedbackTypeArr,
      feedbackTypeChildArr,
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      onToggleServiceRecordModal,
      loading,
    } = this.props;
    // 添加成功
    if (loading && !nextProps.loading && nextProps.addServeRecordSuccess === true) {
      onToggleServiceRecordModal(false);
      message.success('添加服务记录成功');
      // 提交成功后，刷新360视图中的服务记录iframe
      const iframe = document.querySelector(fspContainer.view360Iframe);
      if (iframe) {
        const iframeHash = iframe.contentWindow.location.hash;
        const newIframeHash = iframeHash.replace(/[&\?]?_k=[^&]+/g, ''); // eslint-disable-line
        const obj = helper.getQuery(newIframeHash);
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
    const serviceContentNode = this.serviceContent.textAreaRef;
    const serviceContent = _.trim(serviceContentNode.value);
    if (!serviceContent) {
      message.error('请输入此次服务的内容');
      return;
    }
    if (serviceContent.length > MAX_LENGTH) {
      message.error(`服务的内容字数不能超过${MAX_LENGTH}`);
      return;
    }
    const {
      serviceWay,
      serviceType,
      serviceDate,
      serviceTime,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      custUuid,
    } = this.state;
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
    serviceContentNode.value = '';
  }

  // 关闭弹窗
  @autobind
  handleCancel() {
    const { onToggleServiceRecordModal, handleCloseClick } = this.props;
    // 手动上传日志
    handleCloseClick();
    onToggleServiceRecordModal(false);
  }

  // 保存选中的服务方式的值
  @autobind
  handleServiceWay(value) {
    this.setState({
      serviceWay: value,
    });
  }

  // 保存服务类型的值
  @autobind
  handleServiceType(value) {
    const feedbackTypeArr = this.serviceTypeObj[value];
    const feedbackType = (feedbackTypeArr[0] || {}).value;
    const feedbackTypeChildArr = (feedbackTypeArr[0] || {}).children || EMPTY_LIST;
    const feedbackTypeChild = (feedbackTypeChildArr[0] || {}).value;
    this.setState({
      serviceType: value,
      feedbackType,
      feedbackTypeArr,
      feedbackTypeChild,
      feedbackTypeChildArr,
    });
  }

  // 保存服务日期的值
  @autobind
  handleServiceDate(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      serviceDate: moment(selectedDate).format(dateFormat),
      // serviceTime: moment().format(timeFormat),
    });
  }

  // 保存服务时间时分的值
  @autobind
  handleServiceTime(time, timeString) {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    this.setState({
      serviceTime: timeString || `${h}:${m}`,
    });
  }

  // 保存反馈时间的值
  @autobind
  handleFeedbackDate(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      feedbackDate: moment(selectedDate).format(dateFormat),
    });
  }

  // 保存反馈类型的值
  @autobind
  handleFeedbackType(value) {
    const { feedbackTypeArr } = this.state;
    this.feedbackTypeObj = generateObjOfValue(feedbackTypeArr);
    const curFeedbackTypeArr = this.feedbackTypeObj[value];
    this.setState({
      feedbackType: value,
      feedbackTypeChild: _.isEmpty(curFeedbackTypeArr) ? '' : curFeedbackTypeArr[0].value,
      feedbackTypeChildArr: curFeedbackTypeArr,
    });
  }

  // 保存反馈子类型的值
  @autobind
  handleFeedbackTypeChild(value) {
    this.setState({
      feedbackTypeChild: value,
    });
  }

  disabledDate(current) {
    if (current) {
      return current.valueOf() > moment().subtract(0, 'days');
    }
    return true;
  }

  @autobind
  disabledHours() {
    const { serviceDate } = this.state;
    const currentTimeStamp = moment(serviceDate).format('x');
    const hours = range(0, 24);
    const d = new Date();
    if (currentTimeStamp < moment(moment().format('YYYY/MM/DD')).format('x')) {
      return [];
    }
    return hours.slice(d.getHours() + 1);
  }

  @autobind
  disabledMinutes(h) {
    const d = new Date();
    const m = range(0, 60);
    const { serviceDate } = this.state;
    const currentTimeStamp = moment(serviceDate).format('x');
    if (currentTimeStamp < moment(moment().format('YYYY/MM/DD')).format('x')) {
      return [];
    }
    if (h === d.getHours()) {
      return m.slice(d.getMinutes() + 1);
    } else if (h < d.getHours()) {
      return [];
    }
    return m;
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
    } = this.props;
    const {
      serviceWay,
      serviceType,
      serviceTime,
      serviceDate,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      feedbackTypeArr,
      feedbackTypeChildArr,
      currentFile,
      uploadedFileKey,
      originFileName,
    } = this.state;

    if (!dict) {
      return null;
    }
    const title = (
      <p className={styles.title}>
        创建服务记录:
        <span>&nbsp;{name}/{id}</span>
      </p>
    );
    const footer = (
      <div className={styles.customFooter}>
        <Clickable
          onClick={this.handleCancel}
          eventName="/click/createServiceRecord/cancel"
        >
          <a className={styles.cancelBtn}>取消</a>
        </Clickable>
        <Clickable
          onClick={this.handleSubmit}
          eventName="/click/createServiceRecord/submit"
        >
          <a className={styles.submitBtn}>提交</a>
        </Clickable>
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
              <p className={styles.categoryTitle}>服务信息</p>
              <div className={styles.row}>
                <i className={styles.dot}>*</i>
                <span className={styles.lable}>服务方式：</span>
                <Select
                  value={serviceWay}
                  style={width}
                  onChange={this.handleServiceWay}
                >
                  {
                    (dict.serveWay || EMPTY_LIST).map(obj => (
                      <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                    ))
                  }
                </Select>
              </div>
              <div className={styles.row}>
                <i className={styles.dot}>*</i>
                <span className={styles.lable}>服务时间：</span>
                <DatePicker
                  style={width}
                  allowClear={false}
                  value={moment(serviceDate, dateFormat)}
                  format={dateFormat}
                  onChange={this.handleServiceDate}
                  disabledDate={this.disabledDate}
                />
                <TimePicker
                  style={width}
                  className={`${styles.ml34} ${styles.hide}`}
                  placeholder={'选择时间'}
                  value={moment(serviceTime, timeFormat)}
                  onChange={this.handleServiceTime}
                  format={timeFormat}
                  disabledHours={this.disabledHours}
                  disabledMinutes={this.disabledMinutes}
                />
              </div>
              <div className={styles.row}>
                <i className={styles.dot}>*</i>
                <span className={styles.lable}>服务类型：</span>
                <Select
                  value={serviceType}
                  style={width}
                  onChange={this.handleServiceType}
                >
                  {
                    (dict.custServerTypeFeedBackDict || EMPTY_LIST).map(obj => (
                      <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                    ))
                  }
                </Select>
              </div>
              <div className={styles.row}>
                <i className={styles.dot}>*</i>
                <span className={styles.lable}>服务内容：</span>
                <TextArea
                  rows={5}
                  ref={ref => this.serviceContent = ref}
                />
              </div>
              <hr className={styles.line} />
              <p className={styles.categoryTitle}>客户反馈</p>
              <div className={styles.row}>
                <i className={styles.dot}>*</i>
                <span className={styles.lable}>反馈类型：</span>
                <Select
                  value={feedbackType}
                  style={width}
                  onChange={this.handleFeedbackType}
                >
                  {
                    (feedbackTypeArr).map(obj => (
                      <Option key={obj.key} value={obj.value}>{obj.value}</Option>
                    ))
                  }
                </Select>
                {
                  _.isEmpty(feedbackTypeChildArr) ? null :
                  <Select
                    value={feedbackTypeChild}
                    style={width}
                    className={styles.ml34}
                    onChange={this.handleFeedbackTypeChild}
                  >
                    {
                      (feedbackTypeChildArr).map(obj => (
                        <Option key={obj.key} value={obj.value}>{obj.value}</Option>
                      ))
                    }
                  </Select>
                }
              </div>
              <div className={styles.row}>
                <i className={styles.dot}>*</i>
                <span className={styles.lable}>反馈时间：</span>
                <DatePicker
                  style={width}
                  allowClear={false}
                  value={moment(feedbackDate, dateFormat)}
                  format={dateFormat}
                  onChange={this.handleFeedbackDate}
                  disabledDate={this.disabledDate}
                />
              </div>
              <div className={styles.divider} />
              <p className={styles.categoryTitle}>附件</p>
              <div className={styles.row}>
                <div className={styles.uploadSection}>
                  <Uploader
                    ref={ref => (this.uploadElem = ref)}
                    onOperateFile={this.handleFileUpload}
                    attachModel={currentFile}
                    fileKey={uploadedFileKey}
                    originFileName={originFileName}
                    uploadTitle={'上传附件'}
                    upData={{
                      empId: helper.getEmpId(),
                      // 第一次上传没有，如果曾经返回过，则必须传
                      attachment: '',
                    }}
                    uploadTarget={`${request.prefix}/file/ceFileUpload`}
                    isSupportUploadMultiple
                    custUuid={custUuid}
                    onDeleteFile={this.handleDeleteFile}
                  />
                </div>
              </div>
            </div>
            :
            <Loading loading={loading} />
        }
      </Modal>
    );
  }
}
