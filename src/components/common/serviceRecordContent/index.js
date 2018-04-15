/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-15 20:30:11
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, DatePicker, Radio, Form } from 'antd';
import moment from 'moment';
import Uploader from '../../common/uploader';
import ServeRecord from './serveRecord';
import ServeContent from './serveContent';
import ZLFeedback from './zhanglecaifutongFeedback';
import ServiceWaySelect from './serviceWaySelect';
import ServeRecordReadOnly from './ServeRecordReadonly';
import CascadeFeedbackSelect from './CascadeFeedbackSelect';

import { request } from '../../../config';
import { emp } from '../../../helper';
import { serveWay as serveWayUtil } from '../../taskList/performerView/config/code';
import logable from '../../../decorators/logable';
import {
  serveWaySelectMap,
  errorFeedback,
  serveStatusRadioGroupMap,
  getServeWayCode,
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
const DATE_FORMAT_FULL = `${DATE_FORMAT_SHOW} HH:mm`;
// 日期组件使用的通用配置
const dateCommonProps = {
  allowClear: false,
  format: DATE_FORMAT_SHOW,
  defaultValue: moment(),
};

export default class ServiceRecordContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState(props);
    // 代表是否是删除操作
    this.isDeletingFile = false;
  }

  componentWillReceiveProps(nextProps) {
    // 1.切换客户需要将state重新设置，
    // 2.修改上传附件，不需要修改state
    // formData 是服务记录信息
    const { formData: prevData } = this.props;
    const { formData: nextData } = nextProps;
    // 此处由于前面组件都是新建的数据，所以需要深度比对
    if (!_.isEqual(prevData, nextData)) {
      const newState = this.initialState(nextProps);
      this.setState({ ...newState });
    }

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
  getDefaultFeedback() {
    const {
      isEntranceFromPerformerView,
      formData: { motCustfeedBackDict, isTaskFeedbackListOfNone },
    } = this.props;
    let feedback = null;
    let { serviceTypeCode } = this.props;
    // 如果从客户列表|360视图那边过来,给一个默认的服务类型
    if (!isEntranceFromPerformerView) {
      serviceTypeCode = motCustfeedBackDict[0].key;
    }
    if (!isTaskFeedbackListOfNone) {
      const feedbackMatch = _.find(motCustfeedBackDict, o => o.key === serviceTypeCode) || {};
      const feedbackList = feedbackMatch.children || [];
      feedback = feedbackList[0];
    }
    return this.fixCustomerFeedback(feedback);
  }


  // 获取默认的state
  @autobind
  getDefaultState(props) {
    const { formData: fd, isEntranceFromPerformerView } = props;
    let { serviceTypeCode } = props;
    // 默认取第一个客户反馈
    const defaultFeedback = this.getDefaultFeedback();
    // 如果从客户列表|360视图那边过来,给一个默认的服务类型
    if (!isEntranceFromPerformerView) {
      serviceTypeCode = fd.motCustfeedBackDict[0].key;
    }
    return {
      // 非涨乐财富通服务方式下 是否展示表单中的服务状态的校验错误信息提示
      isShowServeStatusError: false,
      // 非涨乐财富通服务方式下 是否展示表单中的服务记录的检验错误信息提示
      isShowServiceContentError: false,
      // 任务类型MOT任务或者自建任务的事件类型
      serviceType: serviceTypeCode,
      // 服务方式Code, 默认取map值中的第一个服务方式
      serviceWayCode: serveWaySelectMap[0].key,
      // 服务方式文本
      serviceWayText: serveWaySelectMap[0].value,
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
      custFeedback2: defaultFeedback.children.key,
      custFeedbackText: defaultFeedback.value,
      custFeedbackText2: defaultFeedback.children.value,
      // 客户反馈时间, 年月日
      custFeedbackTime: moment(),
      // 涨乐财富通服务方式下的客户反馈
      ZLCustFeedback: '暂无反馈',
      // 涨乐财富通服务方式下的客户反馈时间
      ZLCustFeedbackTime: moment(),
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
  }

  // 初始化state,因为需要更新所以所有的值全部传递过来
  @autobind
  initialState(props) {
    const { formData: fd, isReadOnly, isReject, serviceTypeCode } = props;
    // 如果非只读并且不是驳回状态，返回默认的State
    if (!isReadOnly && !isReject) {
      return this.getDefaultState(props);
    } else if (!isReadOnly && isReject) {
      // 如果是涨乐财富通服务方式下的驳回状态
      // TODO 目前先返回默认state, 后面需要将涨乐有关的值写进初始state中
      return this.getDefaultState(props);
    }
    // 此处为只读状态下的state
    // 服务类型使用taskTypeCode+1的值，MOT任务为1，自建任务值为2这个是大类
    // 由于formData里面没有服务方式的code值,所以只能通过名称匹配来获取
    const serviceWayCode = getServeWayCode(fd.serviceWayName);
    // 获取用户选择的反馈信息
    const customerFeedback = this.fixCustomerFeedback(fd.customerFeedback);
    //
    return {
      serviceType: serviceTypeCode,
      serviceWayCode,
      serviceWayText: fd.serviceWayName,
      serviceStatus: fd.serviceStatusCode,
      serviceStatusText: fd.serviceStatusName,
      serviceTime: moment(fd.serviceDate, DATE_FORMAT_END),
      serviceRecord: fd.serviceRecord,
      custFeedback: customerFeedback.key,
      custFeedback2: customerFeedback.children.key,
      custFeedbackText: customerFeedback.value,
      custFeedbackText2: customerFeedback.children.value,
      custFeedbackTime: moment(fd.feedbackDate, DATE_FORMAT_END),
      // serviceFullTime: fd.
    };
  }

  // 涨乐财富通服务方式先的服务内容Ref
  @autobind
  setServeContentRef(ref) {
    this.serveContentRef = ref;
  }

  // 提交时候，进行数据校验
  @autobind
  checkForSubmit() {
    const { isEntranceFromPerformerView } = this.props;
    const { serviceStatus, serviceRecord, isSelectZhangleFins } = this.state;
    // 1.校验服务状态，只有执行者视图页面下才需要
    let isShowServeStatusError = false;
    let isShowServiceContentError = false;
    if (isEntranceFromPerformerView) {
      isShowServeStatusError = _.isEmpty(serviceStatus);
      this.setState({ isShowServeStatusError });
      return !isShowServeStatusError;
    }
    if (!isSelectZhangleFins) {
      // 2. 在非涨乐财富通服务方式下 校验服务记录
      isShowServiceContentError = !serviceRecord || serviceRecord.length > 1000;
      this.setState({ isShowServiceContentError });
      return !isShowServiceContentError;
    }
    // 涨乐财富通下的校验
    return !_.isEmpty(this.serveContentRef.getData());
  }

  // 向组件外部提供所有数据
  @autobind
  getData() {
    if (!this.checkForSubmit()) return null;

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
      isSelectZhangleFins,
    } = this.state;

    const { formData: { custId = '', missionFlowId = '' }, custUuid } = this.props;
    // 按照DOClever定义的入参
    const data = {
      custId,
      serveWay: serviceWayCode,
      type: serviceType,
      serveType: serviceType,
      serveTime: serviceTime.format(DATE_FORMAT_FULL_END),
      serveContentDesc: serviceRecord,
      feedBackTime: custFeedbackTime.format(DATE_FORMAT_END),
      serveCustFeedBack: custFeedback,
      serveCustFeedBack2: custFeedback2,
      flowStatus: serviceStatus,
      missionFlowId,
      uuid: (!_.isEmpty(custUuid) && !_.isEmpty(currentFile)) ? custUuid : '',
    };

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

  // 清空数据，恢复默认
  @autobind
  resetField() {
    // 清除上传文件列表
    this.clearUploadedFileList();
    this.setState({
      ...this.getDefaultState(),
    });
  }

  @autobind
  clearUploadedFileList() {
    if (this.uploadElem) {
      // 清除上传文件列表
      this.uploadElem.clearUploadFile();
    }
  }

  // 如果服务方式是涨乐财富通，则需要优先查一把客户反馈列表，以及审批人列表
  @autobind
  preQueryDateForZLFins({ eventId, type }) {
    this.props.queryCustFeedbackList4ZLFins({ eventId, type });
    // 涨乐财富通服务方式下的审批人列表查询接口后端的固定值
    this.props.queryApprovalList({ btnId: '200000' });
  }

  // 保存选中的服务方式的值
  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '服务方式', value: '$args[0]' } })
  handleServiceWayChange(value) {
    this.setState({
      isSelectZhangleFins: serveWayUtil.isZhangle(value),
      serviceWayCode: value,
    });
    const { eventId, taskTypeCode, isEntranceFromPerformerView } = this.props;
    if (serveWayUtil.isZhangle(value) && isEntranceFromPerformerView) {
      const type = `${+taskTypeCode + 1}`;
      this.preQueryDateForZLFins({ eventId, type });
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
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '客户反馈级联', value: '$args[0]' } })
  handleCascadeSelectChange({ first, second }) {
    this.setState({
      custFeedback: first,
      custFeedback2: second,
    });
  }

  // 服务时间，反馈时间不能选择大于今天的日期
  @autobind
  disabledDate(current) {
    return current > moment().subtract(0, 'days');
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
      serviceRecord: value,
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
        serviceTime={serviceTime.format(DATE_FORMAT_SHOW)}
        serviceFullTime={serviceFullTime.format(DATE_FORMAT_FULL)}
        serviceRecord={serviceRecord}
        zlServiceRecord={zlServiceRecord}
        feedbackDateTime={custFeedbackTime.format(DATE_FORMAT_SHOW)}
        custFeedback={custFeedbackText}
        custFeedback2={custFeedback2Text}
        ZLCustFeedback={ZLCustFeedback}
        ZLCustFeedbackTime={ZLCustFeedbackTime.format(DATE_FORMAT_SHOW)}
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
      flowStatusCode,
    } = this.props;
    const {
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
      isSelectZhangleFins,
      ZLCustFeedback,
      ZLCustFeedbackTime,
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

    return (
      <div className={styles.serviceRecordContent}>
        <div className={styles.gridWrapper}>
          <ServiceWaySelect
            value={serviceWayCode}
            width={{ width: 142 }}
            onChange={this.handleServiceWayChange}
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
                      {
                        serveStatusRadioGroupMap.map(radio => (
                          <Radio key={radio.key} value={radio.key}>{radio.value}</Radio>
                        ))
                      }
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
                {...dateCommonProps}
                value={serviceTime}
                onChange={this.handleServiceDateChange}
                disabledDate={this.disabledDate}
                getCalendarContainer={() => this.serviceTimeRef}
                disabled={isSelectZhangleFins}
              />
            </div>
          </div>
        </div>
        {/** 此处需要针对 服务方式为 涨乐财富通时 显示服务内容 ,其他情况展示服务记录 */}
        {
          isSelectZhangleFins
          ? (
            <ServeContent
              ref={this.setServeContentRef}
              approvalList={this.props.zhangleApprovalList}
              isReject={isReject}
            />
          )
          : (
            <ServeRecord
              showError={isShowServiceContentError}
              value={serviceRecord}
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
                feedbackList={
                  isEntranceFromPerformerView
                  ? motCustfeedBackDict[0].children
                  : motCustfeedBackDict
                }
              />
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
  // 事件ID，非客户反馈中的任务事件ID
  eventId: PropTypes.string,
  serviceTypeCode: PropTypes.string,
  flowStatusCode: PropTypes.string,
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
};
