/*
 * @Description: 客户的基本信息
 * @Author: WangJunjun
 * @Date: 2018-05-27 15:30:44
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-21 17:30:09
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import moment from 'moment';

import ContactInfoPopover from '../contactInfoPopover/ContactInfoPopover';
import { transformCustFeecbackData } from '../../customerPool/helper';
import Mask from '../mask';
import { date } from '../../../helper';
import { UPDATE } from '../../../config/serviceRecord';
import logable from '../../../decorators/logable';

import { PER_CODE, ORG_CODE, PHONE } from '../../taskList/performerView/serviceImplementation/config';

export default class ConnectCustomer extends React.PureComponent {

  static propTypes = {
    targetCustDetail: PropTypes.object,
    addServeRecord: PropTypes.func,
    motSelfBuiltFeedbackList: PropTypes.array,
    toggleServiceRecordModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    addServeRecord: _.noop,
    targetCustDetail: {},
    motSelfBuiltFeedbackList: [],
  }

  static contextTypes = {
    push: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.endTime = '';
    this.startTime = '';
    this.state = { showMask: false };
  }

  /**
   * 通话结束后要创建一条服务记录，并弹出服务记录框
   */
  @autobind
  handlePhoneEnd(data = {}) {
    // 点击挂电话隐藏蒙层
    this.setState({ showMask: false });
    // 没有成功发起通话
    if (!moment.isMoment(this.startTime)) {
      return;
    }
    this.endTime = moment();
    const {
      addServeRecord,
      motSelfBuiltFeedbackList,
      toggleServiceRecordModal,
    } = this.props;
    const list = transformCustFeecbackData(motSelfBuiltFeedbackList);
    const [firstServiceType = {}] = list;
    const { key: firstServiceTypeKey, children = [] } = firstServiceType;
    const [firstFeedback = {}] = children;
    const phoneDuration = date.calculateDuration(
      this.startTime.valueOf(),
      this.endTime.valueOf(),
    );
    const serviceContentDesc = `${this.startTime.format('HH:mm:ss')}给客户发起语音通话，时长${phoneDuration}。`;
    const { custId, custName } = data.userData || {};
    let payload = {
      custId,
      // 服务方式
      serveWay: 'HTSC Phone',
      // 任务类型，1：MOT  2：自建
      taskType: 2,
      // 服务状态
      flowStatus: '30',
      // 同serveType
      type: firstServiceTypeKey,
      // 服务类型，即任务类型
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
    // 添加服务记录表单共用，把打电话自动生成的默认数据保存到prevRecordInfo
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

  // 通话开始
  @autobind
  handlePhoneConnected(data) {
    this.startTime = moment();
    this.callId = data.uuid;
  }

  // 点击号码打电话时显示蒙层
  @autobind
  handlePhoneClick() {
    this.setState({ showMask: true });
  }

  // 点击号码打电话时显示蒙层时关闭蒙层
  @autobind
  @logable({ type: 'Click', payload: { name: '关闭蒙层' } })
  handleMaskClick() {
    this.setState({ showMask: false });
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

  /**
   * 联系方式渲染
   */
  @autobind
  renderContactInfo() {
    const { targetCustDetail = {} } = this.props;
    const {
      custId,
      name,
      custNature,
      perCustomerContactInfo, orgCustomerContactInfoList,
    } = targetCustDetail;
    // 联系方式为空判断
    const isEmpty = (
      custNature === PER_CODE &&
      (
        _.isEmpty(perCustomerContactInfo) ||
        (_.isEmpty(perCustomerContactInfo.homeTels)
          && _.isEmpty(perCustomerContactInfo.cellPhones)
          && _.isEmpty(perCustomerContactInfo.workTels)
          && _.isEmpty(perCustomerContactInfo.otherTels))
      )
    ) ||
      (custNature === ORG_CODE && _.isEmpty(orgCustomerContactInfoList));
    if (isEmpty) {
      return null;
    }
    const perContactInfo = _.pick(perCustomerContactInfo, ['cellPhones', 'homeTels', 'workTels', 'otherTels']);
    const userData = { custId, custName: name };
    return (
      <ContactInfoPopover
        custType={custNature || ''}
        name={encodeURIComponent(name)}
        personalContactInfo={perContactInfo}
        orgCustomerContactInfoList={orgCustomerContactInfoList}
        handlePhoneEnd={this.handlePhoneEnd}
        handlePhoneConnected={this.handlePhoneConnected}
        handlePhoneClick={this.handlePhoneClick}
        userData={userData}
        placement="topRight"
      >
        {this.props.children}
      </ContactInfoPopover>
    );
  }

  render() {
    const { showMask } = this.state;
    return (
      <div style={{display: 'inline-block'}}>
        {this.renderContactInfo()}
        <Mask visible={showMask} onClick={this.handleMaskClick} />
      </div>
    );
  }
}
