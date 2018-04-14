/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-14 22:07:44
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, DatePicker, Radio, Form } from 'antd';
import moment from 'moment';
import Uploader from '../../common/uploader';
import { request } from '../../../config';
import { emp } from '../../../helper';
import ServeRecord from './serveRecord';
import ServeContent from './serveContent';
import ZLFeedback from './zhanglecaifutongFeedback';
import ServiceWaySelect from './serviceWaySelect';
import logable from '../../../decorators/logable';
import { serveWay as serveWayUtil } from '../../taskList/performerView/config/code';
import { serveWaySelectMap, errorFeedback, getServeWayCode } from './utils';
import ServeRecordReadOnly from './ServeRecordReadonly';
import CascadeFeedbackSelect from './CascadeFeedbackSelect';

import styles from './index.less';

const { Option } = Select;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;

// 日期组件的格式
const dateFormat = 'YYYY/MM/DD';
// 界面上显示的日期格式
const showDateFormat = 'YYYY年MM月DD日';
// 时间格式
const timeFormat = 'HH:mm';

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
      subObj[obj.key] = [];
    }
  });
  return subObj;
}

export default class ServiceRecordContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 非涨乐财富通服务方式下 是否展示表单中的服务状态的校验错误信息提示
      isShowServeStatusError: false,
      // 非涨乐财富通服务方式下 是否展示表单中的服务记录的检验错误信息提示
      isShowServiceContentError: false,
      // 任务类型MOT任务或者自建任务的类型
      serviceType: '',
      // 服务方式Code
      serviceWayCode: '',
      // 服务方式文本
      serviceWayText: '',
      // 服务状态
      serviceStatus: '',
      // 服务状态文本
      serviceStatusText: '',
      // 服务时间 年月日,
      serviceTime: '',
      // 服务时间 完整时间 2018-04-14 17:03 'YYYY-MM-DD HH:mm'
      serviceFullTime: '',
      // 服务记录, 非涨乐财富通的服务方式下的服务记录，纯文本
      serviceRecord: '',
      // 客户反馈, 非涨乐财富通下，存在二级客户反馈的情况
      custFeedback: '',
      custFeedback2: '',
      custFeedbackText: '',
      custFeedbackText2: '',
      // 客户反馈时间, 年月日
      custFeedbackTime: '',
      // 涨乐财富通服务方式下的客户反馈
      ZLCustFeedback: '暂无反馈',
      // 涨乐财富通服务方式下的客户反馈时间
      ZLCustFeedbackTime: '',
      // 附件上传相关
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
      custUuid: '',
      attachment: '',
      // 在可编辑状态下，选择的是服务方式是否涨乐财富通
      isSelectZhangleFins: false,
      // 涨乐财富通服务方式下的服务内容的标题,类型，具体内容
      ZLServiceContentTitle: '',
      ZLServiceContentType: '',
      ZLServiceContentDesc: '',
      // 涨乐财富通服务方式下选择自由话术需要的审批人
      ZLServiceApproval: '',
      // 涨乐财富通服务方式下的投资建议模式 free|tmpl 是自由话术还是固定话术
      ZLInvestAdiceMode: 'free',
    };
    // 代表是否是删除操作
    this.isDeletingFile = false;
  }

  componentWillReceiveProps(nextProps) {
    // 1.切换客户需要将state重新设置，
    // 2.修改上传附件，不需要修改state
    // formData 是服务记录信息
    const { formData: prevData } = this.props;
    const { formData: nextData } = nextProps;
    if (prevData !== nextData) {
      const newState = this.initialState(nextProps);
      this.setState({
        ...newState,
      });
    }

    // 在删除文件的时候，不设置originFormData，不然会恢复原始数据
    // if (formData !== nextData && !this.isDeletingFile) {
    //   const formObject = this.handleInitOrUpdate(nextProps);
    //   this.setState({
    //     // ...this.state,
    //     ...formObject,
    //     originFormData: formObject,
    //   });
    // }

    // // 切换客户，错误信息重置
    // if (custUuid !== nextCustUuid) {
    //   this.setState({
    //     isShowServeStatusError: false,
    //     isShowServiceContentError: false,
    //   });
    //   // 当custUuid不一样的时候，并且是新增服务记录时，清除刚才上传的附件记录
    //   if (!isReadOnly) {
    //     this.clearUploadedFileList();
    //   }
    // }
  }

  // 初始化state,因为需要更新所以所有的值全部传递过来
  @autobind
  initialState(props) {
    const { formData: fd, taskTypeCode } = props;
    // 服务类型使用taskTypeCode+1的值，MOT任务为1，自建任务值为2
    const serviceType = `${+taskTypeCode + 1}`;
    // 由于formData里面没有服务方式的code值,所以只能通过名称匹配来获取
    const serviceWayCode = getServeWayCode(fd.serviceWayName);
    // isTaskFeedbackListOfNone如果为True表示没有返回客户反馈列表
    const customerFeedback = fd.customerFeedback;
    return {
      serviceType,
      serviceWayCode,
      serviceWayText: fd.serviceWayName,
      serviceStatus: fd.serviceStatusCode,
      serviceStatusText: fd.serviceStatusName,
      serviceTime: fd.serviceDate,
      serviceRecord: fd.serviceRecord,
      custFeedback: customerFeedback.code,
      custFeedback2: customerFeedback.children.code,
      custFeedbackText: customerFeedback.name,
      custFeedbackText2: customerFeedback.children.name,
      custFeedbackTime: fd.feedbackDate,
      // serviceFullTime: fd.
    };
  }

  // 向组件外部提供所有数据
  @autobind
  getData() {
    const { serviceStatus, serviceContent, isSelectZhangleFins } = this.state;
    const { isEntranceFromPerformerView } = this.props;
    const isShowServiceContentError = !serviceContent || serviceContent.length > 1000;
    let isShowServeStatusError = false;
    // 来自执行者视图，需要校验服务状态
    if (isEntranceFromPerformerView) {
      isShowServeStatusError = !serviceStatus;
      this.setState({
        isShowServeStatusError,
      });
    }

    // 默认都校验服务记录文本
    this.setState({
      isShowServiceContentError,
    });

    if (isShowServiceContentError || isShowServeStatusError) {
      return false;
    }

    const data = _.pick(this.state,
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
      // 当前上传的附件
      'currentFile',
    );

    if (isSelectZhangleFins) {
      // 如果选择涨乐财富通
      data.zhangleServiceContentData = this.serveContentRef.getData();
    }
    return data;
  }

  // 服务状态change事件
  @autobind
  @logable({ type: 'Click', payload: { name: '服务状态' } })
  handleRadioChange(e) {
    this.setState({
      serviceStatus: e.target.value,
      // 不显示错误信息
      isShowServeStatusError: false,
    });
  }

  @autobind
  handleInitOrUpdate(props) {
    const {
      // 服务方式字典
      serveWay = [{}],
    } = props.dict;
    const {
      isEntranceFromPerformerView,
      formData,
      isReadOnly,
      // 服务类型、客户反馈类型三级字典
      // isTaskFeedbackListOfNone如果为true，代表没有找到客户反馈二级反馈字典，则直接写死一个其他类型的feedbackList
      formData: { motCustfeedBackDict, isTaskFeedbackListOfNone },
    } = props;
    const [{ key: serviceTypeCode = '', value: serviceTypeName = '' }] = motCustfeedBackDict;
    // 服务类型value对应服务类型数组
    this.serviceTypeObj = generateObjOfKey(motCustfeedBackDict);
    let formObject = {};

    if (isEntranceFromPerformerView) {
      // 执行者视图
      const {
        feedbackType = '',
        feedbackTypeList = [],
        feedbackTypeChild = '',
        feedbackTypeChildList = [],
      } = this.getFeedbackDataByServiceType(serviceTypeCode);
      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);
      // 当前日期的时间戳
      const currentDate = new Date().getTime();

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
          serviceDate: _.isEmpty(serviceDate) ?
            moment(currentDate).format(dateFormat) : serviceDate,
          // 服务时间（时分秒）
          serviceTime: _.isEmpty(serviceTime) ?
            moment(currentDate).format(timeFormat) : serviceTime,
          // 反馈时间
          feedbackDate: _.isEmpty(feedbackDate) ?
            moment(currentDate).format(dateFormat) : feedbackDate,
          // 服务状态
          serviceStatus: `${serviceStatusCode}`,
          // 服务方式
          serviceWay,
          serviceContent,
          serviceWayCode,
          attachmentList,
        };
        // 如果找不到反馈一二级，则前端默认指定两个其它类型，类型取和后端定义的一样，
        // 不然提交接口报错
        if (isTaskFeedbackListOfNone) {
          formObject = { ...formObject, ...errorFeedback };
        } else if (!_.isEmpty(customerFeedback)) {
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
          // 新需求，不管来的是什么状态，只要能编辑，就没有默认选中的状态，
          serviceStatus: '',
          // 服务方式
          serviceWay: (serveWay[0] || {}).key,
          serviceContent: '',
        };
      }
    } else {
      // 客户列表添加服务记录
      // 反馈类型数组
      const feedbackTypeList = (motCustfeedBackDict[0] || {}).children || [];
      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);
      // 反馈子类型数组
      const feedbackTypeChildList = (feedbackTypeList[0] || {}).children || [];
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
    this.clearUploadedFileList();

    this.setState({
      // ...this.state,
      ...originFormData,
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
    });
  }

  @autobind
  clearUploadedFileList() {
    if (this.uploadElem) {
      // 清除上传文件列表
      this.uploadElem.clearUploadFile();
    }
  }

  // 保存选中的服务方式的值
  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '服务方式', value: '$args[0]' } })
  handleServiceWay(value) {
    console.warn('handleServiceWay: ', value);
    this.setState({
      isSelectZhangleFins: serveWayUtil.isZhangle(value),
      serviceWay: value,
    });
    const { eventId, taskTypeCode, isEntranceFromPerformerView } = this.props;
    if (serveWayUtil.isZhangle(value) && isEntranceFromPerformerView) {
      const type = +taskTypeCode + 1;
      // 如果是涨乐财富通服务方式，需要去查一下客户反馈列表
      this.props.queryCustFeedbackList4ZLFins({
        eventId,
        type: `${type}`,
      });
      this.props.queryApprovalList({
        btnId: '200000', // 涨乐财富通服务方式下的审批人列表查询接口后端的固定值
      });
    }
  }

  // 切换 服务类型
  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '服务类型', value: '$args[0]' } })
  handleServiceTypeSelectChange(value) {
    this.setState({
      serviceType: value,
    });
    const { isSelectZhangleFins } = this.state;
    if (isSelectZhangleFins) {
      // 查询涨乐财富通服务方式下的审批人列表
      this.props.queryApprovalList({ btnId: '200000' });
      // 查询涨乐财富通服务方式下的客户反馈列表
      this.props.queryCustFeedbackList4ZLFins({
        eventId: value,
        type: '2',
      });
    }
  }

  // 根据服务类型获取相关的客户反馈信息
  @autobind
  getFeedbackDataByServiceType(code) {
    if (_.isEmpty(code)) return {};
    const feedbackTypeList = this.serviceTypeObj[code] || [];
    const feedbackType = (feedbackTypeList[0] || {}).key || '';
    const feedbackTypeChildList = (feedbackTypeList[0] || {}).children || [];
    const feedbackTypeChild = (feedbackTypeChildList[0] || {}).key || '';

    return {
      serviceType: code,
      feedbackType,
      feedbackTypeList,
      feedbackTypeChild,
      feedbackTypeChildList,
    };
  }

  // 保存服务日期的值
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '服务日期',
      value: (instance, args) => moment(args[0]).format(dateFormat),
    },
  })
  handleServiceDate(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      serviceDate: moment(selectedDate).format(dateFormat),
    });
  }

  // 保存服务时间时分的值
  @autobind
  @logable({ type: 'CalendarSelect', payload: { name: '服务时间', value: '$args[1]' } })
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
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '反馈时间',
      value: (instance, args) => moment(args[0]).format(dateFormat),
    },
  })
  handleFeedbackDate(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      feedbackDate: moment(selectedDate).format(dateFormat),
    });
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '客户反馈级联', value: '$args[0]' } })
  handleCascadeSelectChange({ first, second }) {
    this.setState({
      custFeedback: first,
      custFeedback2: second,
    });
  }

  @autobind
  disabledDate(current) {
    if (current) {
      return current.valueOf() > moment().subtract(0, 'days');
    }
    return true;
  }

  /**
   * @param {*} result 本次上传结果
   */
  @autobind
  handleFileUpload(file) {
    // 当前上传的file
    const { currentFile = {}, uploadedFileKey = '', originFileName = '', custUuid = '', attachment } = file;
    this.setState({
      currentFile,
      uploadedFileKey,
      originFileName,
      custUuid,
      attachment,
    });
  }

  /**
   * 处理服务记录文本框输入事件
   * @param {*} e event
   */
  @autobind
  handleServiceRecordInputChange(e) {
    const value = e.target.value;
    this.setState({
      serviceContent: value,
      isShowServiceContentError: _.isEmpty(value) || value.length > 1000,
    });
  }

  @autobind
  handleDeleteFile(params) {
    // 正在删除文件
    this.isDeletingFile = true;
    const { onDeleteFile } = this.props;
    onDeleteFile({ ...params }).then(() => {
      this.isDeletingFile = false;
    });
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '附件下载' } })
  handleDownloadClick() { }

  /**
   * 设置服务方式的Ref
   */
  @autobind
  setServiceWrapRef(input) {
    this.serviceWayRef = input;
  }

  /**
   * 设置服务类型的Ref
   */
  @autobind
  setServiceTypeRef(input) {
    this.serviceTypeRef = input;
  }

  /**
   * 设置服务时间的Ref
   */
  @autobind
  setServeTimeRef(input) {
    this.serviceTimeRef = input;
  }

  /**
   * 设置非涨乐财富通服务方式下的客户反馈的ref
   */
  @autobind
  setCustFeedbackRef(input) {
    this.customerFeedbackRef = input;
  }

  /**
   * 设置非涨乐财富通服务方式下的客户反馈时间的ref
   */
  @autobind
  setFeedbackTimeRef(input) {
    this.feedbackTimeRef = input;
  }

  /**
   * 设置非涨乐财富通服务方式下的文件上传的Ref
   */
  @autobind
  setUploaderRef(input) {
    this.uploadElem = input;
  }

  @autobind
  renderServiceStatusChoice() {
    const { dict: { serveStatus = [] } } = this.props;
    return _.map(serveStatus, item =>
      // 20代表处理中 30代表完成
      (item.key === '20' || item.key === '30')
      && <Radio key={item.key} value={item.key}>{item.value}</Radio>,
    );
  }

  /**
   * 渲染服务方式 | 的下拉选项,
   */
  @autobind
  renderServiceSelectOptions(list = []) {
    return list.map(obj => (<Option key={obj.key} value={obj.key}>{obj.value}</Option>));
  }

  // 渲染完成状态的只读信息
  @autobind
  renderServeRecordReadOnly() {
    const {
      serviceWayCode,
      serviceWayText,
      serviceStatusText,
      serviceTime,
      serviceFullTime,
      serviceRecord,
      ZLServiceContentTitle,
      ZLServiceContentType,
      ZLServiceContentDesc,
      custFeedbackText,
      custFeedback2Text,
      custFeedbackTime,
      ZLCustFeedback,
      ZLCustFeedbackTime,
    } = this.state;
    const { formData: { attachmentList } } = this.props;
    const zlServiceRecord = {
      title: ZLServiceContentTitle,
      type: ZLServiceContentType,
      content: ZLServiceContentDesc,
    };
    return (
      <ServeRecordReadOnly
        isZL={serveWayUtil.isZhangle(serviceWayCode)}
        attachmentList={attachmentList}
        serviceWay={serviceWayText}
        serviceStatus={serviceStatusText}
        serviceTime={serviceTime}
        serviceFullTime={serviceFullTime}
        serviceRecord={serviceRecord}
        zlServiceRecord={zlServiceRecord}
        feedbackDateTime={custFeedbackTime}
        custFeedback={custFeedbackText}
        custFeedback2={custFeedback2Text}
        ZLCustFeedback={ZLCustFeedback}
        ZLCustFeedbackTime={ZLCustFeedbackTime}
      />
    );
  }

  render() {
    const {
      dict,
      empInfo,
      isEntranceFromPerformerView,
      isReadOnly,
      isReject,
      beforeUpload,
      custUuid,
      deleteFileResult,
      formData: { motCustfeedBackDict },
      custFeedbackList,
    } = this.props;
    console.warn('formData: ', this.props.formData);
    const {
      serviceWay,
      serviceStatus,
      serviceType,
      serviceDate,
      feedbackDate,
      currentFile,
      uploadedFileKey,
      originFileName,
      serviceContent,
      isShowServeStatusError,
      isShowServiceContentError,
    } = this.state;
    if (_.isEmpty(dict)) return null;

    // 渲染只读信息
    if (isReadOnly) {
      return this.renderServeRecordReadOnly();
    }

    // 服务时间的DatePicker组件的配置项
    const serviceDateProps = {
      allowClear: false,
      value: moment(serviceDate, showDateFormat),
      format: showDateFormat,
      onChange: this.handleServiceDate,
      disabledDate: this.disabledDate,
    };

    const feedbackTimeProps = {
      allowClear: false,
      value: moment(feedbackDate, showDateFormat),
      format: showDateFormat,
      onChange: this.handleFeedbackDate,
      disabledDate: this.disabledDate,
    };

    const serviceStatusErrorProps = isShowServeStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请选择服务状态',
    } : null;

    return (
      <div className={styles.serviceRecordContent}>
        <div className={styles.gridWrapper}>
          <ServiceWaySelect
            value={serviceWay}
            width={{ width: 142 }}
            onChange={this.handleServiceWay}
            // options={dict.serveWay}
            options={serveWaySelectMap}
            empInfo={empInfo}
          />
          {/* 执行者试图下显示 服务状态；非执行者视图下显示服务类型 */}
          {
            isEntranceFromPerformerView ?
              (<div className={styles.serveStatus}>
                <div className={styles.title}>服务状态:</div>
                <FormItem {...serviceStatusErrorProps}>
                  <div className={styles.content}>
                    <RadioGroup onChange={this.handleRadioChange} value={serviceStatus}>
                      {this.renderServiceStatusChoice()}
                    </RadioGroup>
                  </div>
                </FormItem>
              </div>)
              :
              (
                <div className={styles.serveType}>
                  <div className={styles.title}>服务类型:</div>
                  <div className={styles.content} ref={this.setServiceTypeRef}>
                    <Select
                      value={serviceType}
                      style={{ width: 142 }}
                      onChange={this.handleServiceTypeSelectChange}
                      getPopupContainer={() => this.serviceTypeRef}
                    >
                      { this.renderServiceSelectOptions(motCustfeedBackDict) }
                    </Select>
                  </div>
                </div>
              )
          }

          <div className={styles.serveTime}>
            <div className={styles.title}>服务时间:</div>
            <div className={styles.content} ref={this.setServeTimeRef}>
              <DatePicker
                style={{ width: 142 }}
                {...serviceDateProps}
                defaultValue={moment()}
                getCalendarContainer={() => this.serviceTimeRef}
                disabled={this.state.isSelectZhangleFins}
              />
            </div>
          </div>
        </div>
        {/** 此处需要针对 服务方式为 涨乐财富通时 显示服务内容 ,其他情况展示服务记录 */}
        {
          this.state.isSelectZhangleFins
          ? (
            <ServeContent
              ref={ref => this.serveContentRef = ref}
              approvalList={this.props.zhangleApprovalList}
              isReject={isReject}
            />
          )
          : (
            <ServeRecord
              showError={isShowServiceContentError}
              value={serviceContent}
              onChange={this.handleServiceRecordInputChange}
            />
          )
        }

        <div className={styles.divider} />

        {/* 涨乐财富通下显示 客户反馈可选项 */}
        {
          !this.state.isSelectZhangleFins
          ? (
            <div className={styles.custFeedbackSection}>
              <CascadeFeedbackSelect
                onChange={this.handleCascadeSelectChange}
                feedbackList={motCustfeedBackDict}
              />
              <div className={styles.feedbackTime}>
                <div className={styles.title}>反馈时间:</div>
                <div className={styles.content} ref={this.setFeedbackTimeRef}>
                  <DatePicker
                    style={{ width: 142 }}
                    {...feedbackTimeProps}
                    defaultValue={moment()}
                    getCalendarContainer={() => this.feedbackTimeRef}
                  />
                </div>
              </div>
            </div>
          )
          : (
            <ZLFeedback
              showListMode={isReadOnly}
              feedbackList={custFeedbackList}
              feedbackTime="2018年04月13日"
              feedback="不满意"
            />
          )
        }

        {/* 涨乐财富通下显示 不限上传 */}
        {
          this.state.isSelectZhangleFins ? null
          : (
            <div className={styles.uploadSection}>
              <Uploader
                ref={this.setUploaderRef}
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
              />
            </div>
          )
        }
      </div>
    );
  }
}

ServiceRecordContent.propTypes = {
  // 用户基本信息
  empInfo: PropTypes.object,
  dict: PropTypes.object,
  // 是否是执行者视图页面
  isEntranceFromPerformerView: PropTypes.bool,
  // 服务记录数据（包含服务记录，以及涨乐财富通下的服务内容）
  formData: PropTypes.object,
  // 左侧列表是否展开
  isFold: PropTypes.bool,
  // 只读模式
  isReadOnly: PropTypes.bool,
  // 是否 涨乐财富通 被驳回状态
  isReject: PropTypes.bool,
  beforeUpload: PropTypes.func,
  // 用于上传附件的客户唯一ID，每次切换客户，需要重写获取
  custUuid: PropTypes.string,
  onDeleteFile: PropTypes.func.isRequired,
  deleteFileResult: PropTypes.array.isRequired,
  // 查询涨乐财富通服务方式下的客户反馈列表以及查询方法
  queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
  custFeedbackList: PropTypes.array.isRequired,
  // 查询涨乐财富通服务方式下的审批人列表以及查询方法
  queryApprovalList: PropTypes.func.isRequired,
  zhangleApprovalList: PropTypes.array.isRequired,
  // 自建任务|MOT任务 ： 1|0
  taskTypeCode: PropTypes.string,
  // 客户反馈类型ID
  eventId: PropTypes.string,
};

ServiceRecordContent.defaultProps = {
  dict: {},
  empInfo: {},
  formData: {},
  isEntranceFromPerformerView: false,
  isFold: false,
  isReadOnly: false,
  isReject: false,
  beforeUpload: () => { },
  isUploadFileManually: true,
  custUuid: '',
  taskTypeCode: '',
  eventId: '',
};
