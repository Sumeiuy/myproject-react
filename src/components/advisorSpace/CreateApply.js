/*
 * @Author: zhangjun
 * @Date: 2018-09-13 15:08:18
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-20 10:43:19
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
import logable, { logCommon } from '../../decorators/logable';

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
      // 判断AdvisorSpaceForm页面是新建申请 'CREATE' 还是 确认信息 'CONFIRM'
      action: 'CREATE',
      formData: {},
      // 校验结果
      validateResult: true,
      // 判断当前页面是否是新建申请页面，true：新建申请页面，false：确认页面，默认： true
      isCreateApply: true,
      // 智慧前厅校验错误状态
      isShowRoomStatusError: false,
      // 时间段校验错误状态
      isShowPeriodStatusError: false,
      // 参与人校验错误状态
      isShowParticipantStatusError: false,
      participantStatusErrorMessage: '',
    };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCloseModalConfirm() {
    this.props.onClose('isShowCreateModal');
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
    const { formData } = this.state;
    const {
      participant,
      roomNo,
      defaultRange,
    } = obj;
    this.setState({
      formData: {
        ...formData,
        ...obj,
      }
    });
    // 智慧前厅不为空，则重置错误状态
    if (!_.isEmpty(roomNo)) {
      this.resetRoomErrorProps();
    }
    // 预订时间段不为空，则重置错误状态
    if (!_.isEmpty(defaultRange)) {
      this.resetPeriodErrorProps();
    }
    // 参与人不为空，则重置错误状态
    if (!_.isEmpty(participant)) {
      this.resetParticipantErrorProps();
    }
  }

  @autobind
  setAdvisorSpaceFormRef(form) {
    this.advisorSpaceForm = form;
  }

  // 智慧前厅校验填完值后重置错误状态和错误提示
  @autobind
  resetRoomErrorProps() {
    this.setState({ isShowRoomStatusError: false });
  }

  // 时间段校验填完值后重置错误状态和错误提示
  @autobind
  resetPeriodErrorProps() {
    this.setState({ isShowPeriodStatusError: false });
  }

  // 参与人校验填完值后重置错误状态和错误提示
  @autobind
  resetParticipantErrorProps() {
    this.setState({
      isShowParticipantStatusError: false,
      participantStatusErrorMessage: '',
    });
  }

  // 点击提交
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubmit() {
    const { validateFields } = this.advisorSpaceForm.getForm();
    this.isValidateError = false;
    validateFields((err, values) => {
      this.validateData();
      if (this.isValidateError) {
        return;
      }
      if(!err) {
        const { theme, remark } = values;
        const { formData } = this.state;
        this.setState({
          formData: {
            ...formData,
            theme,
            remark,
          },
          isCreateApply: false,
        });
      }
    });
  }

  // 校验数据
  @autobind
  validateData() {
    const { formData: { roomNo, startTime, endTime, participant, outerPersonFlag } } = this.state;
    if(_.isEmpty(roomNo)) {
      this.setState({isShowRoomStatusError: true});
      this.isValidateError = true;
    }
    if(_.isEmpty(startTime) || _.isEmpty(endTime)) {
      this.setState({isShowPeriodStatusError: true});
      this.isValidateError = true;
    }
    if(_.isEmpty(participant)) {
      this.setState({
        isShowParticipantStatusError: true,
        participantStatusErrorMessage: '请输入参与人',
      });
      this.isValidateError = true;
    } else if (outerPersonFlag && participant.participantName.trim().length > 20) {
      this.setState({
        isShowParticipantStatusError: true,
        participantStatusErrorMessage: '最多20个字符',
      });
      this.isValidateError = true;
    }
  }

  // 返回修改
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '返回修改' } })
  handleEdit() {
    this.setState({
      action: 'UPDATE',
      isCreateApply: true,
    });
  }

  // 点击确定
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleConfirm() {
    let params = _.pick(this.state.formData, ['orderDate', 'startTime', 'endTime', 'roomNo', 'roomName', 'siteCode', 'siteName', 'theme', 'remark']);
    const {
      formData: {
        outerPersonFlag,
        participant,
      }
    } = this.state;
    // 组织机构，内部客户取接口返回的组织机构代码和名称，外部客户取所属营业部的代码和名称
    if (outerPersonFlag) {
      params = {
        ...params,
        ...participant,
        orgCode: emp.getOrgId(),
        outerPersonFlag: 'Y',
      };
    } else {
      params = {
        ...params,
        ...participant,
        outerPersonFlag: 'N',
      };
    }
    this.props.submitApply(params).then(() => {
      logCommon({
        type: 'Submit',
        payload: {
          name: '投顾空间申请新建提交',
          vlaue: JSON.stringify(params),
        },
      });
      this.doCloseModalAfterSubmit();
    });
  }

  @autobind
  doCloseModalAfterSubmit() {
    const { submitResult: { applyId } } = this.props;
      if (applyId) {
        this.props.onClose('isShowCreateModal', true);
      }
  }

  @autobind
  getModalTitle() {
    return this.state.isCreateApply ? '新建投顾空间申请' : '确认信息';
  }

  @autobind
  getModalSize() {
    return this.state.isCreateApply ? 'large' : 'normal';
  }

  @autobind
  getSelfBtnGroup() {
    return this.state.isCreateApply ?
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
      );
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
      participantStatusErrorMessage,
      isCreateApply,
      action,
      formData,
    } = this.state;
    const selfBtnGroup = this.getSelfBtnGroup();
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
              action={action}
              formData={formData}
              wrappedComponentRef={this.setAdvisorSpaceFormRef}
              createRoomData={createRoomData}
              getRoomList={getRoomList}
              onChange={this.handleChange}
              participantData={participantData}
              getParticipantList={getParticipantList}
              isShowRoomStatusError={isShowRoomStatusError}
              isShowPeriodStatusError={isShowPeriodStatusError}
              isShowParticipantStatusError={isShowParticipantStatusError}
              participantStatusErrorMessage={participantStatusErrorMessage}
            />
          :
            <ConfirmForm
              formData={formData}
            />
        }
      </CommonModal>
    );
  }
}
