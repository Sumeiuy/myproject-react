/*
 * @Author: zhangjun
 * @Date: 2018-05-28 19:14:00
 * @Last Modified by: zhangmei
 * @Last Modified time: 2018-11-13 10:21:30
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Phone from '../components/common/phone';
import { transformCustFeecbackData } from '../components/customerPool/helper';
import logable from '../decorators/logable';
import fspGlobal from '../utils/fspGlobal';
import { date } from '../helper';

const PHONE = 'phone';
const UPDATE = 'update';

export default class PhoneWrapper extends Component {
  static propTypes = {
    // 自建任务平台的服务类型、任务反馈字典
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    getMotCustfeedBackDict: PropTypes.func.isRequired,
    // 打电话结束弹出创建任务窗口
    toggleServiceRecordModal: PropTypes.func,
    addServeRecord: PropTypes.func.isRequired,
    addCallRecord: PropTypes.func.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
  }

  static defaultProps = {
    toggleServiceRecordModal: _.noop,
  };

  constructor(props) {
    super(props);
    this.startTime = '';
    this.endTime = '';
  }

  // 电话挂断和继续回调函数
  @autobind
  phoneCallback(data) {
    const { type } = data;
    if (type === 'connected') {
      this.handlePhoneConnected(data);
    }
    if (type === 'end') {
      this.handlePhoneEnd(data);
    }
  }

  // 点击电话号码打电话
  @autobind
  @logable({
    type: 'Click',
    payload: { name: '点击号码拨打电话' }
  })
  handleClickPhone() {
    this.startTime = '';
    // 获取打完电话发服务记录时需要的字典信息
    return this.props.getMotCustfeedBackDict({
      pageNum: 1,
      pageSize: 10000,
      type: 2
    });
  }

  // 电话接通方法
  @autobind
  handlePhoneConnected(data) {
    this.startTime = moment();
    this.callId = data.uuid;
  }

  /**
   * 通话的uuid关联服务记录
   */
  @autobind
  saveServiceRecordAndPhoneRelation() {
    const { currentCommonServiceRecord = {} } = this.props;
    if (this.callId) {
      this.props.addCallRecord({
        uuid: this.callId,
        projectId: currentCommonServiceRecord.id,
      });
    }
  }

  // 电话挂断方法
  @autobind
  handlePhoneEnd(data) {
    // 没有成功发起通话
    if (!moment.isMoment(this.startTime)) {
      return;
    }
    this.endTime = moment();
    const phoneDuration = date.calculateDuration(
      this.startTime.valueOf(),
      this.endTime.valueOf(),
    );
    const {
      motSelfBuiltFeedbackList,
      addServeRecord,
      toggleServiceRecordModal,
    } = this.props;
    const list = transformCustFeecbackData(motSelfBuiltFeedbackList);
    const [firstServiceType = {}] = list;
    const { key: firstServiceTypeKey, children = [] } = firstServiceType;
    const [firstFeedback = {}] = children;
    const serviceContentDesc = `${this.startTime.format('HH:mm:ss')}给客户发起语音通话，时长${phoneDuration}。`;
    let payload = {
      ...data,
      // 服务方式
      serveWay: 'HTSC Phone',
      // 任务类型，1：MOT  2：自建
      taskType: '2',
      // 同serveType
      type: firstServiceTypeKey,
      // 服务类型
      serveType: firstServiceTypeKey,
      // 客户反馈一级
      serveCustFeedBack: firstFeedback.key,
      // 服务记录内容
      serveContentDesc: serviceContentDesc,
      // 服务时间
      serveTime: this.endTime.format('YYYY-MM-DD HH:mm'),
      // 反馈时间
      feedBackTime: moment().format('YYYY-MM-DD'),
      // 添加成功后需要显示message提示
      noHints: true,
    };
    // 客户反馈的二级
    if (firstFeedback.children) {
      payload = {
        ...payload,
        serveCustFeedBack2: firstFeedback.children[0].key,
      };
    }
    fspGlobal.phoneCallback();
    // 获取fsp项目360视图中的经济客户号和客户名称
    const { custId, custName } = window.custInfo;
    payload = {
      ...payload,
      custId,
    };
    addServeRecord(payload).then(() => {
      // 关联通话和服务记录
      this.saveServiceRecordAndPhoneRelation();
      // 显示添加服务记录弹窗，todo=update表示更新服务记录
      toggleServiceRecordModal({
        id: custId,
        name: custName,
        flag: true,
        caller: PHONE,
        autoGenerateRecordInfo: payload,
        todo: UPDATE,
      });
    });
  }

  render() {
    return (
      <div className="phoneWrapper">
        <Phone
          headless
          onEnd={this.phoneCallback}
          onConnected={this.phoneCallback}
          onClick={this.handleClickPhone}
        />
      </div>
    );
  }
}
