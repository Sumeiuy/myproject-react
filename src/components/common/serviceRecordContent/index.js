/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-08 20:39:47
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, DatePicker, TimePicker, Input, Radio } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import Uploader from '../../common/uploader';
import { request } from '../../../config';
import { emp, getIconType } from '../../../helper';
import Icon from '../../common/Icon';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

// 日期组件的格式
const dateFormat = 'YYYY/MM/DD';
// 界面上显示的日期格式
const showDateFormat = 'YYYY年MM月DD日';

const timeFormat = 'HH:mm';
// 当天时间
const CURRENT_DATE = moment(new Date(), dateFormat);
const width = { width: 142 };

const EMPTY_LIST = [];

const NO_HREF = 'javascript:void(0);'; // eslint-disable-line

/**
 * 服务状态转化map
 * 字典中服务状态有4中，分别是：
 * {key: "10", value: "未开始"}
 * {key: "20", value: "处理中"}
 * {key: "30", value: "完成"}
 * {key: "40", value: "结果达标"}
 * 页面中展示'处理中'和'完成'
 * 任务状态 未开始 ，页面展示处理中，传给后端的key为 '20'
 * 任务状态 结果达标 ，页面展示完成，传给后端的key为 '30'
 */
const serviceStateMap = {
  10: '20',
  20: '20',
  30: '30',
  40: '30',
};

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// {key:1, children: [{key: 11}]} 转成 {1: [{key: 11}]}
function generateObjOfKey(list) {
  const subObj = {};
  if (_.isEmpty(list)) {
    return subObj;
  }
  list.forEach((obj) => {
    if (obj.children && !_.isEmpty(obj.children)) {
      subObj[obj.key] = obj.children;
    } else {
      subObj[obj.key] = EMPTY_LIST;
    }
  });
  return subObj;
}

export default class ServiceRecordContent extends PureComponent {
  static propTypes = {
    dict: PropTypes.object,
    // 是否是执行者视图页面
    isEntranceFromPerformerView: PropTypes.bool,
    // 表单数据
    formData: PropTypes.object,
    isFold: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    beforeUpload: PropTypes.func,
    custUuid: PropTypes.string,
    onDeleteFile: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
  }

  static defaultProps = {
    dict: {},
    formData: {},
    isEntranceFromPerformerView: false,
    isFold: false,
    isReadOnly: false,
    beforeUpload: () => { },
    isUploadFileManually: true,
    custUuid: '',
  }

  constructor(props) {
    super(props);
    const formData = this.handleInitOrUpdate(props);
    this.state = {
      ...formData,
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
      originFormData: formData,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { formData } = this.props;
    const { formData: nextData } = nextProps;
    if (formData !== nextData) {
      const formObject = this.handleInitOrUpdate(nextProps);
      this.setState({
        ...this.state,
        ...formObject,
        originFormData: formObject,
      });
    }
  }

  // 服务状态change事件
  @autobind
  onRadioChange(e) {
    this.setState({
      serviceStatus: e.target.value,
    });
  }

  // 向组件外部提供所有数据
  @autobind
  getData() {
    return _.pick(this.state,
      // 服务方式
      'serviceWay',
      // 服务类型
      'serviceType',
      // 服务时间
      'serviceDate',
      // 服务时间
      'serviceTime',
      // 反馈时间
      'feedbackDate',
      // 反馈类型
      'feedbackType',
      // 反馈类型
      'feedbackTypeChild',
      // 服务状态
      'serviceStatus',
      // 服务记录
      'serviceContent',
      // cust uuid
      'custUuid',
    );
  }

  @autobind
  handleInitOrUpdate(props) {
    const {
      // 服务方式字典
      serveWay = [{}],
    } = props.dict || {};
    const {
      isEntranceFromPerformerView,
      formData,
      isReadOnly,
      // 服务类型、客户反馈类型三级字典
      formData: { motCustfeedBackDict },
    } = props;
    const [{ key: serviceTypeCode = '', value: serviceTypeName = '' }] = motCustfeedBackDict;

    // 服务类型value对应服务类型数组
    this.serviceTypeObj = generateObjOfKey(motCustfeedBackDict);
    let formObject = {};

    if (isEntranceFromPerformerView) {
      const {
        feedbackType = '',
        feedbackTypeList = [],
        feedbackTypeChild = '',
        feedbackTypeChildList = [],
      } = this.handleServiceType(serviceTypeCode, false);

      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);

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
          serviceStatusCode,
          // 服务方式
          serviceWayName: serviceWay,
          // 服务方式code
          serviceWayCode,
          // 服务记录内容
          serviceRecord: serviceContent,
          // 客户反馈
          customerFeedback,
          // 附件记录
          attachmentList,
        } = formData;
        formObject = {
          // 服务类型，页面上隐藏该字段
          serviceType: serviceTypeCode,
          serviceTypeName,
          // 客户反馈一级
          feedbackType: '',
          feedbackTypeList: [],
          // 客户反馈二级
          feedbackTypeChild: '',
          feedbackTypeChildList: [],
          // 服务时间（日期）
          serviceDate,
          // 服务时间（时分秒）
          serviceTime,
          // 反馈时间
          feedbackDate,
          // 服务状态
          serviceStatus: serviceStateMap[serviceStatusCode],
          // 服务方式
          serviceWay,
          serviceContent,
          serviceWayCode,
          // customerFeedback,
          attachmentList,
        };
        if (!_.isEmpty(customerFeedback)) {
          const {
            code,
            name,
            children: {
              code: subCode,
              name: subName,
            },
          } = customerFeedback;
          formObject.feedbackType = String(code);
          formObject.feedbackTypeList = [{ key: String(code), value: name }];
          formObject.feedbackTypeChild = String(subCode);
          formObject.feedbackTypeChildList = [{ key: String(subCode), value: subName }];
        }
      } else {
        // 当前日期的时间戳
        const currentDate = new Date().getTime();

        formObject = {
          // 服务类型，页面上隐藏该字段
          serviceType: serviceTypeCode,
          // 客户反馈一级
          feedbackType,
          feedbackTypeList,
          // 客户反馈二级
          feedbackTypeChild,
          feedbackTypeChildList,
          // 服务时间（日期）
          serviceDate: moment(currentDate).format(dateFormat),
          // 服务时间（时分秒）
          serviceTime: moment(currentDate).format(timeFormat),
          // 反馈时间
          feedbackDate: moment(currentDate).format(dateFormat),
          // 服务状态
          serviceStatus: serviceStateMap[formData.serviceStatusCode],
          // 服务方式
          serviceWay: (serveWay[0] || {}).key,
          serviceContent: '',
          // serviceStatusCode,
          // serviceWayCode,
          // customerFeedback,
          // attachmentRecord,
        };
      }
    } else {
      // 客户列表添加服务记录
      // 反馈类型数组
      const feedbackTypeList = (motCustfeedBackDict[0] || {}).children || EMPTY_LIST;
      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);
      // 反馈子类型数组
      const feedbackTypeChildList = (feedbackTypeList[0] || {}).children || EMPTY_LIST;
      // 当前日期的时间戳
      const currentDate = new Date().getTime();
      const serveType = (motCustfeedBackDict[0] || {}).key || '';
      const feedbackType = (feedbackTypeList[0] || {}).key || '';
      const feedbackTypeChild = (feedbackTypeChildList[0] || {}).key || '';

      formObject = {
        serviceContent: '',
        feedbackType,
        feedbackTypeChild,
        feedbackTypeList,
        feedbackTypeChildList,
        serviceType: serveType,
        serviceWay: (serveWay[0] || {}).key,
        serviceDate: moment(currentDate).format(dateFormat),
        serviceTime: moment(currentDate).format(timeFormat),
        feedbackDate: moment(currentDate).format(dateFormat),
      };
    }

    return formObject;
  }


  @autobind
  resetField() {
    const { originFormData } = this.state;
    // 清除上传文件列表
    this.uploadElem.clearUploadFile();

    this.setState({
      ...this.state,
      ...originFormData,
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
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
  handleServiceType(value, shouldSetState = true) {
    if (_.isEmpty(value)) {
      return {};
    }
    const feedbackTypeList = this.serviceTypeObj[value] || EMPTY_LIST;
    const feedbackType = (feedbackTypeList[0] || {}).key || '';
    const feedbackTypeChildList = (feedbackTypeList[0] || {}).children || EMPTY_LIST;
    const feedbackTypeChild = (feedbackTypeChildList[0] || {}).key || '';

    if (shouldSetState) {
      this.setState({
        serviceType: value,
        feedbackType,
        feedbackTypeList,
        feedbackTypeChild,
        feedbackTypeChildList,
      });
    }

    return {
      serviceType: value,
      feedbackType,
      feedbackTypeList,
      feedbackTypeChild,
      feedbackTypeChildList,
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
    const { feedbackTypeList } = this.state;
    this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);
    const curFeedbackTypeList = this.feedbackTypeObj[value];
    this.setState({
      feedbackType: value,
      feedbackTypeChild: _.isEmpty(curFeedbackTypeList) ? '' : curFeedbackTypeList[0].key,
      feedbackTypeChildList: curFeedbackTypeList,
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
    if (currentTimeStamp < moment(moment().format(dateFormat)).format('x')) {
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
    if (currentTimeStamp < moment(moment().format(dateFormat)).format('x')) {
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
  handleFileUpload(file) {
    // 当前上传的file
    const { currentFile = {}, uploadedFileKey = '', originFileName = '', custUuid = '' } = file;
    this.setState({
      currentFile,
      uploadedFileKey,
      originFileName,
      custUuid,
    });
  }

  /**
   * 处理服务记录文本框输入事件
   * @param {*} e event
   */
  @autobind
  handleServiceRecordInputChange(e) {
    const value = e.target.value;
    if (!_.isEmpty(value) && value.length > 1000) {
      return;
    }
    this.setState({
      serviceContent: value,
    });
  }

  @autobind
  handleDeleteFile(params) {
    const { onDeleteFile } = this.props;
    onDeleteFile(params);
  }

  @autobind
  renderServiceStatusChoice() {
    const {
      dict: {
        serveStatus = [],
      },
    } = this.props;
    return _.map(serveStatus, item =>
      // 20代表处理中 30代表完成
      (item.key === '20' || item.key === '30')
      && <Radio key={item.key} value={item.key}>{item.value}</Radio>,
    );
  }

  /**
   * 只读的状态下，渲染附件信息
   */
  @autobind
  renderFileList() {
    const { attachmentList } = this.state;
    if (_.isEmpty(attachmentList)) {
      return null;
    }
    return (
      <div className={styles.uploadList}>
        {
          attachmentList.map(item => (
            <div key={item.attachId}>
              <span>附件:</span>
              <Icon className={styles.excelIcon} type={getIconType(item.name)} />
              <span>
                <a
                  href={
                    _.isEmpty(item.attachId) && _.isEmpty(item.name)
                      ? NO_HREF :
                      `${request.prefix}/file/ceFileDownload?attachId=${item.attachId}&empId=${emp.getId()}&filename=${item.name}`}
                >
                  {item.name}
                </a>
              </span>
            </div>
          ))
        }
      </div>
    );
  }

  render() {
    const {
      dict,
      isEntranceFromPerformerView,
      // isFold,
      isReadOnly,
      beforeUpload,
      custUuid,
      deleteFileResult,
      formData: { motCustfeedBackDict },
    } = this.props;
    const {
      serviceWay,
      serviceStatus,
      serviceType,
      serviceTime,
      serviceDate,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      feedbackTypeList,
      feedbackTypeChildList,
      currentFile,
      uploadedFileKey,
      originFileName,
      serviceContent,
      // attachmentRecord,
    } = this.state;
    if (!dict) {
      return null;
    }
    // const firstCol = isFold ? 8 : 24;
    // const secondCol = isFold ? { first: 16, second: 8 } : { first: 24, second: 24 };

    const serviceDateProps = {
      allowClear: false,
      value: moment(serviceDate, showDateFormat),
      format: showDateFormat,
      onChange: this.handleServiceDate,
      disabledDate: this.disabledDate,
    };

    const serviceTimeProps = {
      placeholder: '选择时间',
      value: moment(serviceTime, timeFormat),
      onChange: this.handleServiceTime,
      format: timeFormat,
      disabledHours: this.disabledHours,
      disabledMinutes: this.disabledMinutes,
    };

    const feedbackTimeProps = {
      allowClear: false,
      value: moment(feedbackDate, showDateFormat),
      format: showDateFormat,
      onChange: this.handleFeedbackDate,
      disabledDate: this.disabledDate,
    };
    const serveType = classnames({
      [styles.serveType]: true,
      [styles.hidden]: isEntranceFromPerformerView,
    });
    // feedbackTypeChildList为空或者客户反馈一级和二级的选项文字相同时不显示二级反馈选项
    let isShowSubCustomerFeedback = false;
    if (!_.isEmpty(feedbackTypeChildList)) {
      const currentCustomerFeedback = _.find(feedbackTypeList, { key: feedbackType });
      const currentSubCustomerFeedback = _.find(feedbackTypeChildList, { key: feedbackTypeChild });
      isShowSubCustomerFeedback =
        currentCustomerFeedback.value === currentSubCustomerFeedback.value;
    }
    return (
      <div className={styles.serviceRecordContent}>
        <div className={styles.gridWrapper}>
          <div className={styles.serveWay}>
            <div className={styles.title}>
              服务方式:
            </div>
            <div className={styles.content} ref={r => this.serviceWayRef = r} >
              <Select
                value={serviceWay}
                style={width}
                onChange={this.handleServiceWay}
                disabled={isReadOnly}
                getPopupContainer={() => this.serviceWayRef}
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
                    disabled={isReadOnly}
                  >
                    {this.renderServiceStatusChoice()}
                  </RadioGroup>
                </div>
              </div> : null
          }
          {/* 服务类型，执行者试图下隐藏，客户列表下显示 */}
          <div className={serveType}>
            <div className={styles.title}>
              服务类型:
            </div>
            <div className={styles.content} ref={r => this.serviceTypeRef = r}>
              <Select
                value={serviceType}
                style={width}
                onChange={this.handleChange}
                getPopupContainer={() => this.serviceTypeRef}
              >
                {
                  (motCustfeedBackDict || EMPTY_LIST).map(obj => (
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
            <div className={styles.content} ref={r => this.serviceTimeRef = r}>
              <DatePicker
                style={width}
                className={classnames({
                  [styles.disabledDate]: isReadOnly,
                })}
                {...serviceDateProps}
                defaultValue={moment(CURRENT_DATE, showDateFormat)}
                getCalendarContainer={() => this.serviceTimeRef}
              />
              <TimePicker
                style={width}
                className={styles.hidden}
                {...serviceTimeProps}
                defaultValue={moment(CURRENT_DATE, timeFormat)}
              />
            </div>
          </div>

        </div>

        <div className={styles.serveRecord}>
          <div className={styles.title}>服务记录:</div>
          <div className={styles.content}>
            <TextArea
              rows={5}
              disabled={isReadOnly}
              value={serviceContent}
              onChange={this.handleServiceRecordInputChange}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.custFeedbackSection}>
          <div className={styles.feedbackType}>
            <div className={styles.title}>
              客户反馈:
            </div>
            <div className={styles.content} ref={r => this.customerFeedbackRef = r}>
              <Select
                value={feedbackType}
                style={width}
                onChange={this.handleFeedbackType}
                disabled={isReadOnly}
                getPopupContainer={() => this.customerFeedbackRef}
              >
                {
                  (feedbackTypeList).map(obj => (
                    <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                  ))
                }
              </Select>
              {
                isShowSubCustomerFeedback ? null :
                  <Select
                    value={feedbackTypeChild}
                    style={width}
                    onChange={this.handleFeedbackTypeChild}
                    disabled={isReadOnly}
                    getPopupContainer={() => this.customerFeedbackRef}
                  >
                    {
                      (feedbackTypeChildList).map(obj => (
                        <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                      ))
                    }
                  </Select>
              }
            </div>
          </div>
          <div className={styles.feedbackTime}>
            <div className={styles.title}>反馈时间:</div>
            <div className={styles.content} ref={r => this.feedbackTimeRef = r}>
              <DatePicker
                style={width}
                className={classnames({
                  [styles.disabledDate]: isReadOnly,
                })}
                {...feedbackTimeProps}
                defaultValue={moment(CURRENT_DATE, showDateFormat)}
                getCalendarContainer={() => this.feedbackTimeRef}
              />
            </div>
          </div>
        </div>

        <div className={styles.uploadSection}>
          {
            !isReadOnly ? <Uploader
              ref={ref => (this.uploadElem = ref)}
              onOperateFile={this.handleFileUpload}
              attachModel={currentFile}
              fileKey={uploadedFileKey}
              originFileName={originFileName}
              uploadTitle={'上传附件'}
              upData={{
                empId: emp.getId(),
                // 第一次上传没有，如果曾经返回过，则必须传
                attachment: '',
              }}
              beforeUpload={beforeUpload}
              custUuid={custUuid}
              uploadTarget={`${request.prefix}/file/ceFileUpload`}
              isSupportUploadMultiple
              onDeleteFile={this.handleDeleteFile}
              deleteFileResult={deleteFileResult}
            /> : this.renderFileList()
          }
        </div>
      </div>
    );
  }
}
