/*
 * @Author: zhangjun
 * @Date: 2018-09-13 15:08:18
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-17 16:47:47
 * @description 投顾空间新建申请
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import Button from '../common/Button';
import AdvisorSpaceForm from './AdvisorSpaceForm';
import ConfirmForm from './ConfirmForm';
import confirm from '../common/confirm_';
import { emp } from '../../helper';
import logable, { logPV, logCommon } from '../../decorators/logable';

import styles from './createApply.less';

export default class CreateApply extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    // 智慧前厅列表
    createRoomData: PropTypes.object.isRequired,
    getRoomList: PropTypes.func.isRequired,
    // 参与人列表
    participantData: PropTypes.object.isRequired,
    getParticipantList: PropTypes.func.isRequired,
    // 新建提交
    submitResult: PropTypes.object.isRequired,
    submitApply: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 判断当前是新建申请 'CREATE' 还是 确认信息 'CONFIRM'
      action: 'CREATE',
      // 预订日期
      orderDate: '',
      // 智慧前厅代码
      roomNo: '',
      // 智慧前厅名称
      roomName: '',
      // 智慧前厅区域代码
      siteCode: '',
      // 智慧前厅区域名称
      siteName: '',
      // 开始时间
      startTime: '',
      // 结束时间
      endTime: '',
      // 参与人
      participant: {},
      // 是否是外部客户，false表示不是外部客户，true表示是外部客户，默认是false
      outerPersonFlag: false,
      // 主题
      theme: '',
      // 备注
      remark: '',
      // 校验结果
      validateResult: true,
      // 智慧前厅校验错误状态
      isShowRoomStatusError: false,
      // 时间段校验错误状态
      isShowPeriodStatusError: false,
      // 参与人校验错误状态
      isShowParticipantStatusError: false,
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCloseModalConfirm() {
    this.props.onClose();
  }

  // 关闭审批弹窗
  @autobind
  handleModalClose() {
    confirm({
      shortCut: 'close',
      onOk: this.handleCloseModalConfirm,
    });
  }

  // 处理表单数据变化
  @autobind
  handleChange(obj) {
    this.setState(obj);
  }

  @autobind
  setAdvisorSpaceFormRef(form) {
    this.advisorSpaceForm = form;
  }

  // 点击提交
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubmit() {
    const { validateFields } = this.advisorSpaceForm.getForm();
    this.isValidateError = false;
    validateFields((err, values) => {
      this.validateData();
      if (this.isValidateError) return;
      if(!err) {
        const { theme, remark } = values;
        this.setState({
          theme,
          remark,
          action: 'CONFIRM',
        })
      }
    })
  }

  // 校验数据
  @autobind
  validateData() {
    const { roomNo, startTime, endTime, participant } = this.state;
    if(_.isEmpty(roomNo)) {
      this.setState({isShowRoomStatusError: true});
      this.isValidateError = true;
    }
    if(_.isEmpty(startTime) || _.isEmpty(endTime)) {
      this.setState({isShowPeriodStatusError: true});
      this.isValidateError = true;
    }
    if(_.isEmpty(participant) || _.isEmpty(endTime)) {
      this.setState({isShowParticipantStatusError: true});
      this.isValidateError = true;
    }
  }

  // 返回修改
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '返回修改' } })
  handleEdit() {
    console.warn('state', this.state);
    this.setState({action: 'CREATE'});
  }

  // 点击确定
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleConfirm() {
    let params = _.pick(this.state, ['orderDate', 'startTime', 'endTime', 'roomNo', 'roomName', 'siteCode', 'siteName', 'theme', 'remark']);
    const {
      outerPersonFlag,
      participant,
    } = this.state;
    // 组织机构，内部客户取接口返回的组织机构代码和名称，外部客户取所属营业部的代码和名称
    if (outerPersonFlag) {
      params = {
        ...params,
        orgCode: emp.getOrgId(),
        outerPersonFlag: 'Y',
      }
    } else {
      params = {
        ...params,
        ...participant,
        outerPersonFlag: 'N',
      }
    }
    this.props.submitApply(params).then((res) => {
      const { submitResult: { applyId } } = this.props;
      if (applyId) {
        this.props.onClose();
      }
    })
  }

  @autobind
  isCreateApply() {
    const { action } = this.state;
    // action 判断当前是新建申请 'CREATE' 还是 确认申请'CONFIRM'
    return action === 'CREATE';
  }

  @autobind
  getModalTitle() {
    return this.isCreateApply() ? '新建投顾空间申请' : '确认信息';
  }

  @autobind
  getModalSize() {
    return this.isCreateApply() ? 'large' : 'normal';
  }

  @autobind
  getSelfBtnGroup() {
    return this.isCreateApply() ?
      (
        <div>
          <Button className={styles.cancelButton} onClick={this.handleModalClose}>取消</Button>
          <Button type="primary" className={styles.submitButton} onClick={this.handleSubmit}>提交</Button>
        </div>
      )
      :
      (
        <div>
          <Button className={styles.cancelButton} onClick={this.handleEdit}>返回修改</Button>
          <Button type="primary" className={styles.submitButton} onClick={this.handleConfirm}>确定</Button>
        </div>
      )
  }

  render() {
    const {
      createRoomData,
      getRoomList,
      participantData,
      getParticipantList,
    } = this.props;
    const {
      isShowRoomStatusError,
      isShowPeriodStatusError,
      isShowParticipantStatusError,
    } = this.state;
    const selfBtnGroup = this.getSelfBtnGroup();
    const isCreateApply = this.isCreateApply();
    return (
      <CommonModal
        visible
        size={this.getModalSize()}
        modalKey="createAdvisorSpaceModal"
        title={this.getModalTitle()}
        maskClosable={false}
        onCancel={this.handleModalClose}
        closeModal={this.handleModalClose}
        selfBtnGroup={selfBtnGroup}
        wrapClassName={styles.createAdvisorSpaceModal}
      >
        {
          isCreateApply ?
            <AdvisorSpaceForm
              wrappedComponentRef={this.setAdvisorSpaceFormRef}
              createRoomData={createRoomData}
              getRoomList={getRoomList}
              onChange={this.handleChange}
              participantData={participantData}
              getParticipantList={getParticipantList}
              isShowRoomStatusError={isShowRoomStatusError}
              isShowPeriodStatusError={isShowPeriodStatusError}
              isShowParticipantStatusError={isShowParticipantStatusError}
            />
          :
            <ConfirmForm
              formData={this.state}
            />
        }
      </CommonModal>
    )
  }
}
