/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-24 10:40:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import cx from 'classnames';
import { Select, DatePicker, Radio, Form } from 'antd';
import moment from 'moment';
import Uploader from '../../common/uploader';
import ServeRecord from './ServeRecord_';
import ServeContent from './ServeContent_';
import ZLFeedback from './ZhanglecaifutongFeedback_';
import ServiceWaySelect from './ServiceWaySelect_';
import ServeRecordReadOnly from './ServeRecordReadonly';
import CascadeFeedbackSelect from './CascadeFeedbackSelect';

import { request } from '../../../config';
import { emp } from '../../../helper';
import { serveWay as serveWayUtil } from '../../taskList/performerView/config/code';
import { flow } from '../../taskList/performerView/config';
import logable from '../../../decorators/logable';
import {
  errorFeedback,
  serveStatusRadioGroupMap,
  getServeWayByCodeOrName,
  defaultFeedback,
  defaultFeedbackOption,
} from './utils';

import styles from './index.less';

const { Option } = Select;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;

// 后端传递过来以及需要入参的日期格式,
const DATE_FORMAT_END = 'YYYY-MM-DD';
const DATE_FORMAT_FULL_END = 'YYYY-MM-DD HH:mm';
// 界面上显示的日期格式
const DATE_FORMAT_SHOW = 'YYYY年MM月DD日';
// 界面显示的完整时间格式
// const DATE_FORMAT_FULL = `${DATE_FORMAT_SHOW} HH:mm`;
// 日期组件使用的通用配置
const dateCommonProps = {
  allowClear: false,
  format: DATE_FORMAT_SHOW,
  defaultValue: moment(),
};

// 查询涨乐财富通的审批人需要的btnId固定值
const ZL_QUREY_APPROVAL_BTN_ID = '200000';
// 涨乐财富通服务方式下，服务状态 完成的Code
const SERVICE_STATUS_COMPLETE_CODE = '30';

// 服务记录内容最大长度
const serviceContentMaxLength = 1000;

export default class ServiceRecordContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState(props);
    // 代表是否是删除操作
    this.isDeletingFile = false;
  }

  componentWillReceiveProps(nextProps) {
    // 1.切换客户需要将state重新设置，
    // 2.修改上传附件，不需要修改state
    // formData 是服务记录信息
    const { formData: prevData, custUuid: prevUUID } = this.props;
    const { formData: nextData, custUuid: nextUUID, isReadOnly } = nextProps;
    // 此处由于前面组件都是新建的数据，所以需要深度比对
    if (!_.isEqual(prevData, nextData)) {
      const newState = this.initialState(nextProps);
      this.setState({ ...newState });
    }

    // 切换客户，错误信息重置
    if (prevUUID !== nextUUID) {
      this.setState({
        isShowServeStatusError: false,
        isShowServiceContentError: false,
      });
      // 当custUuid不一样的时候，并且是新增服务记录时，清除刚才上传的附件记录
      if (!isReadOnly) {
        this.clearUploadedFileList();
      }
    }
  }

  // 设置非涨乐财富通服务方式下的文件上传的Ref
  @autobind
  setUploaderRef(input) {
    this.uploadElem = input;
  }

  // 设置服务类型的Ref
  @autobind
  setServiceTypeRef(input) {
    this.serviceTypeRef = input;
  }

  // 设置服务时间的Ref
  @autobind
  setServeTimeRef(input) {
    this.serviceTimeRef = input;
  }

  // 设置非涨乐财富通服务方式下的客户反馈时间的ref
  @autobind
  setFeedbackTimeRef(input) {
    this.feedbackTimeRef = input;
  }

  // 根据服务类型获取相关的客户反馈信息
  @autobind
  getFeedbackDataByServiceType(code) {
    if (_.isEmpty(code)) {
      return {};
    }
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

  // 将客户反馈的实际值转化数据结构，使用key和value,保持一致
  @autobind
  convertFeedback(feedback) {
    let tempChildFeedback = {};
    if (!_.isEmpty(feedback.children) && _.isArray(feedback.children)) {
      tempChildFeedback = this.fixDefaultChildFeedback(feedback.children[0]);
    } else if (!_.isEmpty(feedback.children) && _.isObject(feedback.children)) {
      tempChildFeedback = this.fixDefaultChildFeedback(feedback.children);
    }
    return {
      ...this.fixDefaultChildFeedback(feedback),
      children: tempChildFeedback,
    };
  }

  // 根据服务类型serviceTypeCode找到相关的feedbackList
  @autobind
  findFeedbackListByServiceTypeCode(code, props) {
    const { formData: { motCustfeedBackDict } } = props;
    const feedbackMatch = _.find(motCustfeedBackDict, o => o.key === code) || {};
    const feedbackList = feedbackMatch.children || [];
    return feedbackList;
  }

  // 修正默认二级反馈
  @autobind
  fixDefaultChildFeedback(childFeedback) {
    const hasCode = _.has(childFeedback, 'code');
    const hasKey = _.has(childFeedback, 'key');
    if (hasCode && !hasKey) {
      return {
        key: `${childFeedback.code}`,
        value: childFeedback.name,
      };
    }
    return childFeedback;
  }

  // 1.在原先的代码逻辑中，
  // 如果客户反馈为undefined，则需要给它一个容错处理的feedback
  @autobind
  fixCustomerFeedback(customerFeedback) {
    if (_.isEmpty(customerFeedback)) {
      return errorFeedback;
    }
    return this.convertFeedback(customerFeedback);
  }

  // 在非涨乐财富通服务方式下 获取默认的客户反馈
  @autobind
  getDefaultFeedback(props) {
    const {
      isEntranceFromPerformerView,
      formData: { motCustfeedBackDict },
    } = props;
    let { serviceTypeCode } = props.formData;
    // 如果从客户列表|360视图那边过来,给一个默认的服务类型
    if (!isEntranceFromPerformerView) {
      serviceTypeCode = motCustfeedBackDict[0].key;
    }
    // 通过服务类型找到反馈，并默认取第一个
    const feedbackList = this.findFeedbackListByServiceTypeCode(serviceTypeCode, props);
    const feedback = feedbackList[0];
    return this.fixCustomerFeedback(feedback);
  }

  // 获取默认的state
  @autobind
  getDefaultState(props) {
    const {
      formData: fd,
      isEntranceFromPerformerView,
      isReject,
      dict: { serveWay },
    } = props;
    let { serviceTypeCode } = fd;
    // 不是只读状态下，也就是新增状态下，默认客户反馈只展示一级，并且给一个默认值：请选择
    if (!isEntranceFromPerformerView) {
      serviceTypeCode = fd.motCustfeedBackDict[0].key;
    }
    return {
      // 涨乐财富通服务方式下，是否被驳回状态
      isReject,
      // 事件ID，客户反馈中mot任务的事件ID
      eventId: fd.eventId,
      // 任务类型Code,
      taskTypeCode: fd.taskTypeCode,
      // 非涨乐财富通服务方式下 是否展示表单中的服务状态的校验错误信息提示
      isShowServeStatusError: false,
      // 非涨乐财富通服务方式下 是否展示表单中的服务记录的检验错误信息提示
      isShowServiceContentError: false,
      // 任务类型MOT任务或者自建任务的事件类型
      serviceType: serviceTypeCode,
      // 服务方式Code, 默认取map值中的第一个服务方式
      serviceWayCode: serveWay[0].key,
      // 服务方式文本
      serviceWayText: serveWay[0].value,
      // 是否禁用服务状态Radio
      statusDisabled: false,
      // 服务状态
      serviceStatus: '',
      // 服务状态文本
      serviceStatusText: '',
      // 服务时间 年月日,
      serviceTime: moment(),
      // 服务时间 完整时间 2018-04-14 17:03 'YYYY-MM-DD HH:mm'
      serviceFullTime: moment(),
      // 服务记录, 非涨乐财富通的服务方式下的服务记录，纯文本
      serviceRecord: '',
      // 客户反馈, 非涨乐财富通下，存在二级客户反馈的情况
      custFeedback: defaultFeedback.key,
      custFeedback2: defaultFeedback.children && defaultFeedback.children.key,
      custFeedbackText: defaultFeedback.value,
      custFeedbackText2: defaultFeedback.children && defaultFeedback.children.value,
      // 客户反馈时间, 年月日
      custFeedbackTime: moment(),
      // 涨乐财富通服务方式下的客户反馈
      ZLCustFeedback: '暂无反馈',
      // 涨乐财富通服务方式下的客户反馈时间
      ZLCustFeedbackTime: moment(),
      // 涨乐财富通下的反馈状态
      zlcftMsgStatus: fd.zlcftMsgStatus,
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
      ZLServiceContentTime: moment(),
      // 涨乐财富通服务方式下选择自由话术需要的审批人
      ZLServiceApproval: '',
      // 涨乐财富通服务方式下的投资建议模式 free|tmpl 是自由话术还是固定话术
      ZLInvestAdiceMode: 'free',
    };
  }

  // 初始化state,因为需要更新所以所有的值全部传递过来
  @autobind
  initialState(props) {
    const { formData: fd, isReadOnly, isReject } = props;
    // 服务类型使用taskTypeCode+1的值，MOT任务为1，自建任务值为2这个是大类
    // 由于formData里面没有服务方式的code值,所以只能通过名称匹配来获取
    // 针对后端传值 有可能是 serviceWayName 也有可能是serviceWayCode
    const serviceWay = getServeWayByCodeOrName(fd.serviceWayName || fd.serviceWayCode);
    const serviceWayCode = serviceWay.key;
    // 如果是涨乐财富通服务方式下的驳回和审核中的状态 提取服务内容
    const zlSC = {};
    if (
      serveWayUtil.isZhangle(serviceWayCode)
      &&
      (flow.isApproval(fd.serviceStatusCode) || flow.isReject(fd.serviceStatusCode))
    ) {
      // 只有涨乐财富通下才需要提取
      // 此处需要做下容错处理，因为渲染的时候可能fd.serviceContent还未取到值
      const { title = '', taskType = '', content = '' } = fd.serviceContent || {};
      zlSC.ZLServiceContentTitle = title;
      zlSC.ZLServiceContentType = taskType;
      zlSC.ZLServiceContentDesc = content;
      // 因为 涨乐财富通服务方式在自由话术下，需要等到通过审批之后
      // 才会有serviceTime，所以此处需要对time进行空字符串的容错处理
      // 目前审核与驳回都不会有时间这个字段了
      zlSC.ZLServiceContentTime = '';
    }

    // 如果是涨乐财富通服务方式下的完成状态，提取服务内容
    if (
      serveWayUtil.isZhangle(serviceWayCode)
      && flow.isComplete(fd.serviceStatusCode)
    ) {
      // 此处确认后，在完成状态，不单独显示标题，类型，所有的东西显示到内容
      zlSC.ZLServiceContentTitle = '';
      zlSC.ZLServiceContentType = '';
      zlSC.ZLServiceContentDesc = fd.serviceRecord;
    }

    // 如果非只读并且不是驳回状态，返回默认的State
    if (!isReadOnly && !isReject) {
      return this.getDefaultState(props);
    } else if (!isReadOnly && isReject) {
      // 如果是涨乐财富通服务方式下的驳回状态
      // 目前先返回默认state, 后面需要将涨乐有关的值写进初始state中
      const rejectState = {
        serviceWayCode,
        isSelectZhangleFins: true,
        serviceStatus: SERVICE_STATUS_COMPLETE_CODE,
        statusDisabled: true,
      };
      return { ...this.getDefaultState(props), ...rejectState, ...zlSC };
    }
    // 以下为只读状态下的state
    // 获取用户选择的反馈信息
    const customerFeedback = this.fixCustomerFeedback(fd.customerFeedback);
    // 获取涨乐财富通的客户反馈信息
    // 因为涨乐财富通与普通服务方式使用同一个字段来显示客户反馈信息
    // 涨乐财富通需要显示二级反馈文本
    const ZLCustFeedbackText = _.get(fd.customerFeedback, 'children.name') || '暂无反馈';
    return {
      // 涨乐财富通服务方式下，是否被驳回状态
      isReject,
      // 事件ID，客户反馈中mot任务的事件ID
      eventId: fd.eventId,
      // 任务类型Code,
      taskTypeCode: fd.taskTypeCode,
      // 任务类型MOT任务或者自建任务的事件类型
      serviceType: fd.serviceTypeCode,
      serviceWayCode,
      serviceWayText: serviceWay.value,
      serviceStatus: fd.serviceStatusCode,
      serviceStatusText: fd.serviceStatusName,
      serviceTime: moment(fd.serviceDate, DATE_FORMAT_END),
      serviceRecord: fd.serviceRecord,
      custFeedback: customerFeedback.key,
      custFeedback2: customerFeedback.children.key,
      custFeedbackText: customerFeedback.value,
      custFeedbackText2: customerFeedback.children.value,
      custFeedbackTime: moment(fd.feedbackDate, DATE_FORMAT_END),
      isSelectZhangleFins: serveWayUtil.isZhangle(serviceWayCode),
      ZLCustFeedback: ZLCustFeedbackText,
      isShowErrorCustFeedback: false,
      isShowServeStatusError: false,
      isShowServiceContentError: false,
      ...zlSC,
      zlcftMsgStatus: fd.zlcftMsgStatus,
    };
  }

  // 涨乐财富通服务方式先的服务内容Ref
  @autobind
  setServeContentRef(ref) {
    this.serveContentRef = ref;
  }

  /**
   * 改变当前表单错误的状态
   * @param {*object} state 当前状态
   */
  @autobind
  toggleFormContentErrorState(state) {
    this.setState({
      ...state,
    });
  }

  // 针对选择的服务方式，非涨乐财富通下的检测
  @autobind
  checkNotZLFins() {
    const { isPhoneCall } = this.props;
    const { serviceRecord } = this.state;
    // 校验服务状态
    const isShowServeStatusError = this.checkServiceStatus();
    // 校验服务记录
    const isShowServiceContentError = !serviceRecord
      || serviceRecord.length > serviceContentMaxLength;
    // 校验客户反馈
    const isShowErrorCustFeedback = this.checkCustFeedbackError();
    // 默认是校验结果正确
    let hasError = false;

    // 打完电话后不需要校验 服务状态 是否已经选择,校验服务记录内容和客户反馈一二级
    if (isPhoneCall) {
      hasError = isShowErrorCustFeedback || isShowServiceContentError;
    } else {
      hasError = isShowErrorCustFeedback || isShowServiceContentError || isShowServeStatusError;
    }

    return {
      hasError,
      errorState: {
        isShowServeStatusError,
        isShowErrorCustFeedback,
        isShowServiceContentError,
      },
    };
  }

  /**
   * 校验执行者视图下面的服务状态
   */
  @autobind
  checkServiceStatus() {
    const { isEntranceFromPerformerView } = this.props;
    const { serviceStatus } = this.state;
    // 在执行者视图中校验 服务状态 是否已经选择
    if (isEntranceFromPerformerView) {
      return _.isEmpty(serviceStatus);
    }
    return false;
  }

  // 针对选的服务方式，是涨乐财富通的检测
  @autobind
  checkZLFins() {
    // 校验服务内容
    const isShowServiceContentError = this.serveContentRef.checkData();
    // 校验服务状态
    const isShowServeStatusError = this.checkServiceStatus();
    const hasError = isShowServeStatusError || !isShowServiceContentError;

    return {
      hasError,
      errorState: {
        isShowServeStatusError,
        isShowServiceContentError,
      },
    };
  }

  /**
   * 校验客户反馈
   */
  @autobind
  checkCustFeedbackError() {
    const { custFeedback, custFeedback2 } = this.state;
    // 如果客户反馈一级或者二级没有勾选，提示错误
    if (custFeedback === defaultFeedbackOption ||
      custFeedback2 === defaultFeedbackOption) {
      return true;
    }
    return false;
  }

  // 提交时候，进行数据校验
  @autobind
  checkFormError() {
    const { isSelectZhangleFins } = this.state;
    if (isSelectZhangleFins) {
      return this.checkZLFins();
    }
    return this.checkNotZLFins();
  }

  // 向组件外部提供所有数据
  @autobind
  getData() {
    // 有错，直接返回，设置错误状态
    const { hasError, errorState } = this.checkFormError();
    if (hasError) {
      this.toggleFormContentErrorState(errorState);
      return null;
    }

    const {
      // 服务类型
      serviceType,
      // 服务方式
      serviceWayCode,
      // 服务状态
      serviceStatus,
      // 服务日期
      serviceTime,
      // 服务记录
      serviceRecord,
      // 客户反馈1级
      custFeedback,
      // 客户反馈2级
      custFeedback2,
      // 反馈时间
      custFeedbackTime,
      // 附件
      currentFile,
      // 是否选择涨乐财富通
      isSelectZhangleFins,
      // MOT任务，自建任务
      taskTypeCode,
    } = this.state;

    const {
      formData: { custId = '', missionFlowId = '', missionId = '' },
      custUuid,
    } = this.props;
    // 按照DOClever定义的入参
    const data = {
      custId,
      serveWay: serviceWayCode,
      type: serviceType,
      serveType: serviceType,
      serveTime: serviceTime.format(DATE_FORMAT_FULL_END),
      serveContentDesc: serviceRecord,
      feedBackTime: custFeedbackTime.format(DATE_FORMAT_END),
      serveCustFeedBack: custFeedback === defaultFeedbackOption ? '' : custFeedback,
      serveCustFeedBack2: custFeedback2 === defaultFeedbackOption ? '' : custFeedback2,
      flowStatus: serviceStatus,
      missionFlowId,
      missionId,
      taskType: `${+taskTypeCode + 1}`,
      uuid: (!_.isEmpty(custUuid) && !_.isEmpty(currentFile)) ? custUuid : '',
    };

    if (isSelectZhangleFins) {
      // 如果选择涨乐财富通
      const zlData = this.serveContentRef.getData();
      // 由于之前的非涨乐财富通的服务方式在变更流水状态是由前端来修改文字达到的效果
      // 然而，目前的需求中，针对涨乐财富通的服务方式，新增了 审核中 以及 驳回 两个状态，、
      // 需要针对涨乐财富通的服务方式进行特殊处理
      data.zlApprovalCode = flow.getFlowCodeByName('审核中');
      data.zhangleServiceContentData = _.omit(zlData, ['mode']);
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
    // 调用了此方法说明表单的数据发生了变化
    this.props.onFormDataChange();
  }

  // 清空数据，恢复默认
  @autobind
  resetField() {
    // 清除上传文件列表
    this.clearUploadedFileList();
    this.setState({
      ...this.getDefaultState(this.props),
      // 客户反馈的报错是自定义的，不是通过FormItem定义的，需要手动清除
      isShowErrorCustFeedback: false,
    });
  }

  @autobind
  clearUploadedFileList() {
    if (this.uploadElem) {
      // 清除上传文件列表
      this.uploadElem.clearUploadFile();
    }
  }

  // 查询自建任务或者MOT任务下的用于展示给涨乐财富通服务方式的客户反馈列表
  @autobind
  getZLCustFeedbackList() {
    const { eventId, taskTypeCode, serviceType } = this.state;
    const type = `${+taskTypeCode + 1}`;
    // TODO 如果是mot任务 eventId参数需要使用 eventId
    // 如果是自建任务 需要使用serviceTypeCode
    // type 值为2的时候，该任务是自建任务
    const eventIdParam = type === '2' ? serviceType : eventId;
    this.props.queryCustFeedbackList4ZLFins({ eventId: eventIdParam, type });
  }

  // 如果服务方式是涨乐财富通，则需要优先查一把客户反馈列表，以及审批人列表
  @autobind
  preQueryDateForZLFins() {
    this.getZLCustFeedbackList();
    // 涨乐财富通服务方式下的审批人列表查询接口后端的固定值
    this.props.queryApprovalList({ btnId: ZL_QUREY_APPROVAL_BTN_ID });
  }

  // 保存选中的服务方式的值
  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '服务方式', value: '$args[0]' } })
  handleServiceWayChange(value) {
    // 此处需要新增在 驳回后 修改的状态下，切换下需要将之前的驳回后的内容清空
    // 此处需要增加一个当用户选择的服务方式为 涨乐财富通 时，服务状态为完成，并且不能切换
    const { isReject } = this.state;
    // 判断之前的流水状态是否是  被驳回
    if (isReject) {
      this.setState({
        isSelectZhangleFins: serveWayUtil.isZhangle(value),
        serviceWayCode: value,
        isReject: false,
        ZLServiceContentTitle: '',
        ZLServiceContentType: '',
        ZLServiceContentDesc: '',
        ZLServiceContentTime: moment(),
      });
    } else {
      this.setState({
        isSelectZhangleFins: serveWayUtil.isZhangle(value),
        serviceWayCode: value,
      });
    }
    if (serveWayUtil.isZhangle(value)) {
      this.setState({
        serviceStatus: SERVICE_STATUS_COMPLETE_CODE,
        statusDisabled: true,
        isShowServeStatusError: false,
      });
      this.preQueryDateForZLFins();
    } else {
      this.setState({
        serviceStatus: '',
        statusDisabled: false,
      });
    }
    // 调用了此方法说明表单的数据发生了变化
    this.props.onFormDataChange();
  }

  // 切换 服务类型
  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '服务类型', value: '$args[0]' } })
  handleServiceTypeSelectChange(value) {
    // 此处需要将相关的客户反馈列表
    const feedbackList = this.findFeedbackListByServiceTypeCode(value, this.props);
    const feedback = this.fixCustomerFeedback(feedbackList[0]);
    this.setState({
      serviceType: value,
      custFeedback: feedback.key,
      custFeedback2: feedback.children.key,
      custFeedbackText: feedback.value,
      custFeedbackText2: feedback.children.value,
    });
    const { isSelectZhangleFins } = this.state;
    if (isSelectZhangleFins) {
      // 查询涨乐财富通服务方式下的审批人列表
      this.props.queryApprovalList({ btnId: ZL_QUREY_APPROVAL_BTN_ID });
      // 查询涨乐财富通服务方式下的客户反馈列表
      this.props.queryCustFeedbackList4ZLFins({
        eventId: value,
        type: '2',
      });
    }
  }

  // 切换服务时间
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '服务日期',
      value: (instance, args) => moment(args[0]).format(DATE_FORMAT_END),
    },
  })
  handleServiceDateChange(date) {
    this.setState({ serviceTime: date });
    // 调用了此方法说明表单数据发生了变化
    this.props.onFormDataChange();
  }

  // 切换客户反馈时间
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '反馈时间',
      value: (instance, args) => moment(args[0]).format(DATE_FORMAT_END),
    },
  })
  handleFeedbackDateChange(date) {
    this.setState({ custFeedbackTime: date });
    // 调用了此方法说明表单数据发生了变化
    this.props.onFormDataChange();
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '客户反馈级联', value: '$args[0]' } })
  handleCascadeSelectChange({ first, second }) {
    this.setState({
      custFeedback: first,
      custFeedback2: second,
      isShowErrorCustFeedback: false,
    });
    // 调用了此方法说明表单数据发生了变化
    this.props.onFormDataChange();
  }

  // 服务时间，反馈时间不能选择大于今天的日期
  @autobind
  disabledDate(current) {
    return current > moment().subtract(0, 'days');
  }

  /**
   * @param {*} file 本次上传结果
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
      serviceRecord: value,
      isShowServiceContentError: _.isEmpty(value) || value.length > serviceContentMaxLength,
    });
    // 调用了此方法说明表单的数据发生了变化
    this.props.onFormDataChange();
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
      serviceStatus,
      serviceStatusText,
      serviceTime,
      serviceRecord,
      ZLServiceContentTitle,
      ZLServiceContentType,
      ZLServiceContentDesc,
      custFeedbackText,
      custFeedbackText2,
      custFeedbackTime,
      ZLCustFeedback,
      zlcftMsgStatus,
    } = this.state;
    const { formData: { attachmentList }, custFeedbackList } = this.props;
    const zlServiceRecord = {
      title: ZLServiceContentTitle,
      type: ZLServiceContentType,
      content: ZLServiceContentDesc,
    };
    // 存在一种情况就是MOT任务已经完结，但是流水还没有开始，导致Seibel那边没有返回相应的服务时间
    // 所以需要针对无反馈时间和服务时间的情况下，做特殊显示处理，显示成空字符
    // 在只读状态下，涨乐财富通，不会再提供反馈时间了，所以不再需要ZLCustFeedbackTime
    // 针对 serviceTime,在做一个是否moment对象的判断
    const isMomentAboutServiceTime = moment.isMoment(serviceTime);
    const isMomentAboutFeedbackTime = moment.isMoment(custFeedbackTime);
    const serviceTimeText = isMomentAboutServiceTime ? serviceTime.format(DATE_FORMAT_SHOW) : '';
    const feedbackTimeText = isMomentAboutFeedbackTime ? custFeedbackTime.format(DATE_FORMAT_SHOW) : '';

    return (
      <ServeRecordReadOnly
        isZL={serveWayUtil.isZhangle(serviceWayCode)}
        attachmentList={attachmentList}
        serviceWay={serviceWayText}
        serviceStatus={serviceStatusText}
        serviceStatusCode={serviceStatus}
        serviceTime={serviceTimeText}
        serviceRecord={serviceRecord}
        zlServiceRecord={zlServiceRecord}
        feedbackDateTime={feedbackTimeText}
        custFeedback={custFeedbackText}
        custFeedback2={custFeedbackText2}
        ZLCustFeedback={ZLCustFeedback}
        ZLCustFeedbackList={custFeedbackList}
        ZLFeedbackStatus={zlcftMsgStatus || 'NULL'}
      />
    );
  }

  render() {
    const {
      dict,
      dict: { serveWay },
      empInfo,
      isEntranceFromPerformerView,
      isReadOnly,
      beforeUpload,
      custUuid,
      deleteFileResult,
      formData: { motCustfeedBackDict },
      custFeedbackList,
      flowStatusCode,
      serviceRecordInfo,
      // 投资建议文本撞墙检测
      testWallCollision,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
      isPhoneCall,
      onFormDataChange,
    } = this.props;
    const {
      isReject,
      serviceWayCode,
      serviceStatus,
      serviceType,
      serviceTime,
      custFeedbackTime,
      currentFile,
      uploadedFileKey,
      originFileName,
      serviceRecord,
      isShowServeStatusError,
      isShowServiceContentError,
      isShowErrorCustFeedback,
      isSelectZhangleFins,
      ZLCustFeedback,
      ZLCustFeedbackTime,
      custFeedback,
      custFeedback2,
      ZLServiceContentTitle,
      ZLServiceContentType,
      ZLServiceContentDesc,
      statusDisabled,
    } = this.state;
    if (_.isEmpty(dict) || _.isEmpty(empInfo)) return null;

    // 渲染只读信息
    if (isReadOnly) {
      return this.renderServeRecordReadOnly();
    }

    // 服务状态单选按钮验证
    const serviceStatusErrorProps = isShowServeStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请选择服务状态',
    } : null;

    // 根据serviceTypeCode获取级联的客户反馈列表
    let cascadeFeedbackList = (motCustfeedBackDict[0] || {}).children || [];
    if (!isEntranceFromPerformerView) {
      // 如果是从360视图|客户列表页面进入
      cascadeFeedbackList = this.findFeedbackListByServiceTypeCode(serviceType, this.props);
    }
    // 级联客户反馈列表选项的value
    const cascadeSelectValue = {
      first: custFeedback,
      second: custFeedback2,
    };

    // 用于在被驳回后，需要展示的数据
    const zlRejectRecord = {
      title: ZLServiceContentTitle,
      type: ZLServiceContentType,
      desc: ZLServiceContentDesc,
    };

    const { autoGenerateRecordInfo = {} } = serviceRecordInfo;

    return (
      <div
        className={cx(
          styles.serviceRecordContent,
          { [styles.performerServiceRecord]: isEntranceFromPerformerView },
        )}
      >
        <div className={styles.gridWrapper}>
          <ServiceWaySelect
            value={serviceWayCode}
            width={{ width: 142 }}
            onChange={this.handleServiceWayChange}
            options={serveWay}
            empInfo={empInfo}
            serviceRecordInfo={serviceRecordInfo}
            isPhoneCall={isPhoneCall}
          />
          {/* 执行者试图下显示 服务状态；非执行者视图下显示服务类型 */}
          {
            isEntranceFromPerformerView ?
              (<div className={styles.serveStatus}>
                <div className={styles.title}>服务状态:</div>
                {/* 打电话调的服务记录切服务状态码为30时，显示‘完成’ */}
                {
                  isPhoneCall
                  && autoGenerateRecordInfo.flowStatus === SERVICE_STATUS_COMPLETE_CODE ?
                    <div className={styles.content}>完成</div> :
                    <FormItem {...serviceStatusErrorProps}>
                      <div className={styles.content}>
                        <RadioGroup
                          onChange={this.handleRadioChange}
                          value={serviceStatus}
                          disabled={statusDisabled}
                        >
                          {
                            serveStatusRadioGroupMap.map(radio => (
                              <Radio key={radio.key} value={radio.key}>{radio.value}</Radio>
                            ))
                          }
                        </RadioGroup>
                      </div>
                    </FormItem>
                }
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
                      {this.renderServiceSelectOptions(motCustfeedBackDict)}
                    </Select>
                  </div>
                </div>
              )
          }

          <div className={styles.serveTime}>
            <div className={styles.title}>服务时间:</div>
            <div className={styles.content} ref={this.setServeTimeRef}>
              {
                isPhoneCall ?
                  autoGenerateRecordInfo.serveTime :
                  <DatePicker
                    style={{ width: 142 }}
                    {...dateCommonProps}
                    value={serviceTime}
                    onChange={this.handleServiceDateChange}
                    disabledDate={this.disabledDate}
                    getCalendarContainer={() => this.serviceTimeRef}
                    disabled={isSelectZhangleFins}
                  />
              }
            </div>
          </div>
        </div>
        {/** 此处需要针对 服务方式为 涨乐财富通时 显示服务内容 ,其他情况展示服务记录 */}
        {
          isSelectZhangleFins
            ? (
              <ServeContent
                ref={this.setServeContentRef}
                eventId={this.props.formData.eventId}
                serviceTypeCode={this.props.formData.serviceTypeCode}
                custId={this.props.formData.custId}
                taskType={this.props.formData.taskTypeCode}
                approvalList={this.props.zhangleApprovalList}
                isReject={isReject}
                serveContent={zlRejectRecord}
                testWallCollision={testWallCollision}
                testWallCollisionStatus={testWallCollisionStatus}
                onFormDataChange={onFormDataChange}
              />
            )
            : (
              <ServeRecord
                showError={isShowServiceContentError}
                value={serviceRecord}
                onChange={this.handleServiceRecordInputChange}
                serviceRecordInfo={serviceRecordInfo}
                isPhoneCall={isPhoneCall}
                onFormDataChange={onFormDataChange}
              />
            )
        }

        <div className={styles.divider} />

        {/* 涨乐财富通下显示 客户反馈可选项 */}
        {
          !this.state.isSelectZhangleFins
            ? (
              <div className={styles.custFeedbackSection}>
                <div className={styles.left}>
                  <CascadeFeedbackSelect
                    value={cascadeSelectValue}
                    onChange={this.handleCascadeSelectChange}
                    dataSource={cascadeFeedbackList}
                  />
                  {isShowErrorCustFeedback ?
                    <div className={styles.error}>请选择客户反馈</div> : null}
                </div>
                <div className={styles.feedbackTime}>
                  <div className={styles.title}>反馈时间:</div>
                  <div className={styles.content} ref={this.setFeedbackTimeRef}>
                    <DatePicker
                      style={{ width: 142 }}
                      {...dateCommonProps}
                      onChange={this.handleFeedbackDateChange}
                      value={custFeedbackTime}
                      disabledDate={this.disabledDate}
                      getCalendarContainer={() => this.feedbackTimeRef}
                    />
                  </div>
                </div>
              </div>
            )
            : (
              <ZLFeedback
                flowStatusCode={flowStatusCode}
                feedbackList={custFeedbackList}
                feedbackTime={ZLCustFeedbackTime.format(DATE_FORMAT_SHOW)}
                feedback={ZLCustFeedback}
                onFormDataChange={onFormDataChange}
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
                  onUploadDataChange={onFormDataChange}
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
  // 事件ID，非客户反馈中的任务事件ID
  eventId: PropTypes.string,
  serviceTypeCode: PropTypes.string,
  flowStatusCode: PropTypes.string,
  serviceRecordInfo: PropTypes.object.isRequired,
  // 投资建议文本撞墙检测
  testWallCollision: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测是否有股票代码
  testWallCollisionStatus: PropTypes.bool.isRequired,
  // 是否由打电话调起的添加服务记录
  isPhoneCall: PropTypes.bool,
  onFormDataChange: PropTypes.func,
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
  serviceTypeCode: '',
  flowStatusCode: '',
  isPhoneCall: false,
  onFormDataChange: _.noop,
};
