/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-23 17:18:14
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, DatePicker, TimePicker, Input, Radio } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import Uploader from '../../customerPool/taskFlow/Uploader';
import { request } from '../../../config';
// import { helper } from '../../../utils';
import Icon from '../../common/Icon';
import styles from './serviceRecordContent.less';

const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

// 日期组件的显示格式
const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm';
const width = { width: 142 };

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

export default class ServiceRecordContent extends PureComponent {
  static propTypes = {
    isReadOnly: PropTypes.bool.isRequired,
    dict: PropTypes.object,
    // 是否是执行者视图页面
    isEntranceFromPerformerView: PropTypes.bool,
    // 表单数据
    formData: PropTypes.object,
    // 服务类型
    serviceType: PropTypes.string,
  }

  static defaultProps = {
    dict: {},
    formData: {},
    serviceType: '',
    isEntranceFromPerformerView: false,
  }

  constructor(props) {
    super(props);
    const {
      // 服务方式字典
      serveWay = [{}],
      custServerTypeFeedBackDict = [{}],
      // 服务状态字典
      serveStatus = [{}],
    } = props.dict || {};
    const { isEntranceFromPerformerView, formData, isReadOnly, serviceType } = props;
    // 服务类型value对应服务类型数组
    this.serviceTypeObj = generateObjOfKey(custServerTypeFeedBackDict);
    let formObject = {};

    if (isEntranceFromPerformerView) {
      const {
        feedbackType = '',
        feedbackTypeArr = [],
        feedbackTypeChild = '',
        feedbackTypeChildArr = [],
      } = this.handleServiceType(serviceType);

      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfValue(feedbackTypeArr);

      // 执行者视图
      if (isReadOnly) {
        // 只读状态
        const {
          // 服务时间（日期）
          serviceDate,
          // 服务时间（时分秒）
          serviceTime,
          // 反馈时间
          feedbackDate,
          // 服务状态
          serviceStatus,
          // 服务方式
          serviceWay,
          // 服务记录内容
          serviceContent,
        } = formData;

        formObject = {
          // 服务类型，页面上隐藏该字段
          serviceType,
          // 客户反馈一级
          feedbackType,
          feedbackTypeArr,
          // 客户反馈二级
          feedbackTypeChild,
          feedbackTypeChildArr,
          // 服务时间（日期）
          serviceDate,
          // 服务时间（时分秒）
          serviceTime,
          // 反馈时间
          feedbackDate,
          // 服务状态
          serviceStatus,
          // 服务方式
          serviceWay,
          serviceContent,
        };
      } else {
        // 当前日期的时间戳
        const currentDate = new Date().getTime();

        formObject = {
          // 服务类型，页面上隐藏该字段
          serviceType,
          // 客户反馈一级
          feedbackType,
          feedbackTypeArr,
          // 客户反馈二级
          feedbackTypeChild,
          feedbackTypeChildArr,
          // 服务时间（日期）
          serviceDate: moment(currentDate).format(dateFormat),
          // 服务时间（时分秒）
          serviceTime: moment(currentDate).format(timeFormat),
          // 反馈时间
          feedbackDate: moment(currentDate).format(dateFormat),
          // 服务状态
          serviceStatus: (serveStatus[0] || {}).key,
          // 服务方式
          serviceWay: (serveWay[0] || {}).key,
          serviceContent: '',
        };
      }
    } else {
      // 客户列表添加服务记录
      // 反馈类型数组
      const feedbackTypeArr = (custServerTypeFeedBackDict[0] || {}).children || EMPTY_LIST;
      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfValue(feedbackTypeArr);
      // 反馈子类型数组
      const feedbackTypeChildArr = (feedbackTypeArr[0] || {}).children || EMPTY_LIST;
      // 当前日期的时间戳
      const currentDate = new Date().getTime();
      const serveType = (custServerTypeFeedBackDict[0] || {}).key || '';
      const feedbackType = (feedbackTypeArr[0] || {}).value || '';
      const feedbackTypeChild = (feedbackTypeChildArr[0] || {}).value || '';

      formObject = {
        serviceContent: '',
        feedbackType,
        feedbackTypeChild,
        feedbackTypeArr,
        feedbackTypeChildArr,
        serviceType: serveType,
        serviceWay: (serveWay[0] || {}).key,
        serviceDate: moment(currentDate).format(dateFormat),
        serviceTime: moment(currentDate).format(timeFormat),
        feedbackDate: moment(currentDate).format(dateFormat),
      };
    }

    this.state = {
      ...formObject,
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
      originFormData: formObject,
    };
  }

  // 服务状态change事件
  @autobind
  onRadioChange(e) {
    this.setState({
      serviceStatus: e.target.value,
    });
  }

  // 提供所有数据
  @autobind
  getData() {
    const serviceContentNode = this.serviceContent.textAreaRef;
    const serviceContent = _.trim(serviceContentNode.value);

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
    } = this.state;

    return {
      serviceContent,
      serviceWay,
      serviceType,
      serviceDate,
      serviceTime,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      serviceStatus,
      uploadedFileKey,
    };
  }

  @autobind
  resetField() {
    const { originFormData } = this.state;
    this.setState({
      ...this.state,
      ...originFormData,
    });
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
    if (_.isEmpty(value)) {
      return {};
    }
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
    return {
      feedbackType,
      feedbackTypeArr,
      feedbackTypeChild,
      feedbackTypeChildArr,
    };
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
      isReadOnly,
      isEntranceFromPerformerView,
    } = this.props;

    const {
      serviceWay,
      serviceStatus = 'handling',
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

    return (
      <div className={styles.serviceRecordContent}>
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

          {/* 服务状态，执行者试图下显示，客户列表下隐藏 */}
          {
            isEntranceFromPerformerView ?
              <div className={styles.serveStatus}>
                <div className={styles.title}>
                  服务状态:
                </div>
                <div className={styles.content}>
                  <RadioGroup
                    onChange={this.onRadioChange}
                    value={serviceStatus}
                  >
                    <Radio value={'handling'}>处理中</Radio>
                    <Radio value={'completed'}>已完成</Radio>
                  </RadioGroup>
                </div>
              </div> : null
          }

          {/* 服务类型，执行者试图下隐藏，客户列表下显示 */}
          <div
            className={
              classnames({
                [styles.hidden]: isEntranceFromPerformerView,
                [styles.serveType]: true,
              })
            }
          >
            <div className={styles.title}>
              服务类型:
            </div>
            <div className={styles.content}>
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
                className={styles.hidden}
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
      </div>
    );
  }
}
