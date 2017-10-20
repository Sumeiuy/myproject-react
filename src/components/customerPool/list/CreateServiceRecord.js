/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Modal, Select, DatePicker, TimePicker, Input, message } from 'antd';
import moment from 'moment';

import Loading from '../../../layouts/Loading';
import { helper } from '../../../utils';

import styles from './createServiceRecord.less';

const { Option } = Select;
const { TextArea } = Input;

// const d = new Date();
// 日期组件的显示格式
const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm';
// 当前日期的时间戳
// const currentDate = d.getTime();
// formatCurrentTime: 20:20   formatCurrentDate: 2017/12/12
// let formatCurrentDate = moment(currentDate).format(dateFormat);
// let formatCurrentTime = moment(currentDate).format(timeFormat);
const width = { width: 142 };
// 根据服务方式的key来记录对应的iconname
// const SERVICE_ICON = {
//   'HTSC Phone': 'dianhua',
//   'HTSC Email': 'youjian',
//   'HTSC SMS': 'duanxin',
//   wx: 'weixin',
//   Interview: 'beizi',
//   'HTSC Other': 'other',
// };

// 服务内容和反馈内容字数限制
const MAX_LENGTH = 1000;

const EMPTY_LIST = [];

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function generateSubType(arr) {
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
      serviceTypeTree = [{}],
      custFeedBackDict = [{}],
    } = props.dict;
    // 服务子类型
    this.subServiceType = generateSubType(serviceTypeTree);
    // 反馈子类型
    this.subFeedBackType = generateSubType(custFeedBackDict);
    // 当前日期的时间戳
    const currentDate = new Date().getTime();
    this.state = {
      serviceWay: !_.isEmpty(serveWay) && serveWay[0].key,
      serviceType: serviceTypeTree[0].key,
      serviceTypeChild: (this.subServiceType[serviceTypeTree[0].key][0] || {}).key,
      serviceTypeChildArr: this.subServiceType[serviceTypeTree[0].key],
      serviceDate: moment(currentDate).format(dateFormat),
      serviceTime: moment(currentDate).format(timeFormat),
      feedbackDate: moment(currentDate).format(dateFormat),
      feedbackType: custFeedBackDict[0].key,
      feedbackTypeChild: (this.subFeedBackType[custFeedBackDict[0].key][0] || {}).value,
      feedbackTypeChildArr: this.subFeedBackType[custFeedBackDict[0].key],
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
    if (helper.getStrLen(serviceContent) > MAX_LENGTH) {
      message.error(`服务的内容字数不能超过${MAX_LENGTH}`);
      return;
    }
    const {
      serviceWay,
      serviceType,
      serviceTypeChild,
      serviceDate,
      serviceTime,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
    } = this.state;
    const {
      id,
      addServeRecord,
    } = this.props;
    addServeRecord({
      custId: id,
      serveWay: serviceWay,
      serveType: serviceType,
      type: serviceTypeChild,
      serveTime: `${serviceDate.replace(/\//g, '-')} ${serviceTime}`,
      serveContentDesc: serviceContent,
      feedBackTime: feedbackDate.replace(/\//g, '-'),
      serveFeedBack: feedbackType,
      serveFeedBack2: feedbackTypeChild,
    });
    serviceContentNode.value = '';
  }

  // 关闭弹窗
  @autobind
  handleCancel() {
    const { onToggleServiceRecordModal } = this.props;
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
    this.setState({
      serviceType: value,
      serviceTypeChild: this.subServiceType[value][0].key,
      serviceTypeChildArr: this.subServiceType[value],
    });
  }

  // 保存服务子类型的值
  @autobind
  handleServiceTypeChild(value) {
    this.setState({
      serviceTypeChild: value,
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
    this.setState({
      feedbackType: value,
      feedbackTypeChild: this.subFeedBackType[value][0].value,
      feedbackTypeChildArr: this.subFeedBackType[value],
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

  render() {
    const {
      isShow,
      dict,
      loading,
      name,
      id,
    } = this.props;
    const {
      serviceWay,
      serviceType,
      serviceTime,
      serviceDate,
      feedbackDate,
      serviceTypeChildArr,
      serviceTypeChild,
      feedbackType,
      feedbackTypeChild,
      feedbackTypeChildArr,
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
        <a className={styles.cancelBtn} onClick={this.handleCancel}>取消</a>
        <a className={styles.submitBtn} onClick={this.handleSubmit}>提交</a>
      </div>
    );
    console.log('eeee', this.state);
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
                <span className={styles.lable}>服务渠道：</span>
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
                  className={styles.ml34}
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
                    (dict.serviceTypeTree || EMPTY_LIST).map(obj => (
                      <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                    ))
                  }
                </Select>
                <Select
                  style={width}
                  className={styles.ml34}
                  value={serviceTypeChild}
                  onChange={this.handleServiceTypeChild}
                >
                  {
                    (serviceTypeChildArr || EMPTY_LIST).map(obj => (
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
                    (dict.custFeedBackDict || EMPTY_LIST).map(obj => (
                      <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                    ))
                  }
                </Select>
                <Select
                  style={width}
                  className={styles.ml34}
                  value={feedbackTypeChild}
                  onChange={this.handleFeedbackTypeChild}
                >
                  {
                    (feedbackTypeChildArr || EMPTY_LIST).map(obj => (
                      <Option key={obj.key} value={obj.value}>{obj.value}</Option>
                    ))
                  }
                </Select>
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
            </div>
            :
            <Loading loading={loading} />
        }

      </Modal>
    );
  }
}
