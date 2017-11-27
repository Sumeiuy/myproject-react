/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by:   K0240008
 * @Last Modified time: 2017-11-27 13:35:57
 * 服务记录
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, DatePicker, TimePicker, Input, message } from 'antd';
import moment from 'moment';
import Uploader from '../../customerPool/taskFlow/Uploader';
import Button from '../../common/Button';
import { request } from '../../../config';
// import { helper } from '../../../utils';
import Icon from '../../common/Icon';
import styles from './serviceRecord.less';

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
  if (_.isEmpty(arr)) {
    return subObj;
  }
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
  if (_.isEmpty(arr)) {
    return subObj;
  }
  arr.forEach((obj) => {
    if (obj.children && !_.isEmpty(obj.children)) {
      subObj[obj.value] = obj.children;
    } else {
      subObj[obj.value] = EMPTY_LIST;
    }
  });
  return subObj;
}

export default class ServiceRecord extends PureComponent {
  static propTypes = {
    // 当前选中的数据
    isReadOnly: PropTypes.bool,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object,
    missionStatus: PropTypes.object,
  }

  static defaultProps = {
    dict: {},
    missionStatus: {},
    isReadOnly: false,
  }

  constructor(props) {
    super(props);
    const {
      serveWay = [{}],
      custServerTypeFeedBackDict = [{}],
    } = props.dict || {};
    // 服务类型value对应服务类型数组
    this.serviceTypeObj = generateObjOfKey(custServerTypeFeedBackDict);
    // 反馈类型数组
    const feedbackTypeArr = (custServerTypeFeedBackDict[0] || {}).children || EMPTY_LIST;
    // 反馈类型value对应反馈类型数组
    this.feedbackTypeObj = generateObjOfValue(feedbackTypeArr);
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
    } = this.state;
    const {
      addServeRecord,
    } = this.props;

    addServeRecord({
      custId: '',
      serveWay: serviceWay,
      serveType: serviceType,
      type: serviceType,
      serveTime: `${serviceDate.replace(/\//g, '-')} ${serviceTime}`,
      serveContentDesc: serviceContent,
      feedBackTime: feedbackDate.replace(/\//g, '-'),
      serveCustFeedBack: feedbackType,
      serveCustFeedBack2: feedbackTypeChild || '',
    });
    serviceContentNode.value = '';
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
    const { currentFile = {}, uploadedFileKey = '', originFileName = '' } = lastFile;
    this.setState({
      currentFile,
      uploadedFileKey,
      originFileName,
    });
  }

  render() {
    const {
      dict,
      missionStatus,
      isReadOnly,
    } = this.props;

    const {
      serviceWay,
      // serviceType,
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

    console.log('missionStatus>>>', missionStatus);

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

        <div className={styles.serveSelect}>
          <div className={styles.serveWay}>
            <div className={styles.title}>
              服务方式:
            </div>
            <div className={styles.content}>
              <Select
                value={serviceWay}
                style={width}
                onChange={this.handleServiceWay}
                disabled={isReadOnly}
              >
                {
                  (dict.serveWay || EMPTY_LIST).map(obj => (
                    <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                  ))
                }
              </Select>
            </div>
          </div>

          <div className={styles.serveStatus}>
            <div className={styles.title}>
              服务状态:
            </div>
            <div className={styles.content}>
              <Select
                value={serviceWay}
                style={width}
                onChange={this.handleServiceWay}
                disabled={isReadOnly}
              >
                {
                  (dict.serveWay || EMPTY_LIST).map(obj => (
                    <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                  ))
                }
              </Select>
            </div>
          </div>

          <div className={styles.serveTime}>
            <div className={styles.title}>
              服务时间:
            </div>
            <div className={styles.content}>
              <DatePicker
                style={width}
                allowClear={false}
                value={moment(serviceDate, dateFormat)}
                format={dateFormat}
                onChange={this.handleServiceDate}
                disabledDate={this.disabledDate}
                disabled={isReadOnly}
              />
              <TimePicker
                style={width}
                className={styles.hide}
                placeholder={'选择时间'}
                value={moment(serviceTime, timeFormat)}
                onChange={this.handleServiceTime}
                format={timeFormat}
                disabledHours={this.disabledHours}
                disabledMinutes={this.disabledMinutes}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        <div className={styles.serveRecord}>
          <div className={styles.title}>服务记录:</div>
          <div className={styles.content}>
            <TextArea
              rows={5}
              ref={ref => this.serviceContent = ref}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.custFeedbackSection}>
          <div className={styles.feedbackType}>
            <div className={styles.title}>
              客户反馈:
            </div>
            <div className={styles.content}>
              <Select
                value={feedbackType}
                style={width}
                onChange={this.handleFeedbackType}
                disabled={isReadOnly}
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
                  onChange={this.handleFeedbackTypeChild}
                  disabled={isReadOnly}
                >
                  {
                    (feedbackTypeChildArr).map(obj => (
                      <Option key={obj.key} value={obj.value}>{obj.value}</Option>
                    ))
                  }
                </Select>
              }
            </div>
          </div>

          <div className={styles.feedbackTime}>
            <div className={styles.title}>反馈时间:</div>
            <div className={styles.content}>
              <DatePicker
                style={width}
                allowClear={false}
                value={moment(feedbackDate, dateFormat)}
                format={dateFormat}
                onChange={this.handleFeedbackDate}
                disabledDate={this.disabledDate}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        <div className={styles.uploadSection}>
          {
            !isReadOnly ? <Uploader
              onOperateFile={this.handleFileUpload}
              attachModel={currentFile}
              fileKey={uploadedFileKey}
              originFileName={originFileName}
              uploadTitle={'上传附件'}
              uploadTarget={`${request.prefix}/file/khxfFileUpload`}
            /> :
            <div className={styles.uploadList}>
              <span>附件:</span>
              {
                originFileName.indexOf('csv') !== -1 ?
                  <Icon className={styles.csvIcon} type="CSV" /> :
                  <Icon className={styles.excelIcon} type="excel" />
              }
              <span>{originFileName}</span>
            </div>
        }
        </div>

        <div className={styles.operationSection}>
          <Button
            className={styles.submitBtn}
            onClick={() => { console.log('点击提交了'); }}
            type="primary"
          >
            提交</Button>
          <Button
            className={styles.cancelBtn}
            onClick={() => { console.log('点击取消了'); }}
          >取消</Button>
        </div>
      </div>
    );
  }
}
