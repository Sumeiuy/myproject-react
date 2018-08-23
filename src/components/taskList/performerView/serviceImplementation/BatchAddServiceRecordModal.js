/**
 * @Author: XuWenKang
 * @Description: 批量添加服务记录弹窗
 * @Date: 2018-08-17 11:31:18
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-21 09:52:18
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import CommonModal from '../../../common/biz/CommonModal';
import BatchAddServiceRecordItem from './BatchAddServiceRecordItem';
import styles from './batchAddServiceRecordModal.less';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
// 任务详情里是否选中的key值
const IS_CHECKED_KEY = 'isChecked';
// 任务详情里一级反馈的key值
const FIRST_FEEDBACK_KEY = 'serveCustFeedBack';
// 任务详情里二级反馈的key值
const SECOND_FEEDBACK_KEY = 'serveCustFeedBack2';
// 任务详情里反馈时间的key值
const FEEDBACK_TIME_KEY = 'feedBackTime';
// 任务详情里回访结果的key值
const VISIT_RESULT_KEY = 'visitResult';
// 任务详情里回访结果失败的value值
const VISIT_RESULT_FAILED_VALUE = 'Lost';
// 任务详情里失败原因的key值
const VISIT_FAILURE_DESC_KEY = 'visitFailureDesc';

export default class BatchAddServiceRecordModal extends PureComponent {
  static propTypes = {
    // 是否显示弹窗
    visible: PropTypes.bool.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    // 弹窗的key
    modalKey: PropTypes.string.isRequired,
    // 待办任务列表
    data: PropTypes.array.isRequired,
    // 数据发生变化时的回调函数
    onFormChange: PropTypes.func.isRequired,
    // 保存
    saveBatchAddServiceRecord: PropTypes.func.isRequired,
  }

  static contextTypes = {

  }

  // 根据当前选择的一级反馈code从客户数据的客户反馈列表中找出对应的一级反馈项
  @autobind
  getFirstFeedbackItem(list, code) {
    return _.filter(list, item => item.id === code)[0] || EMPTY_OBJECT;
  }

  @autobind
  getSelectedTaskList() {
    const { data = EMPTY_ARRAY } = this.props;
    return _.filter(data, item => item[IS_CHECKED_KEY]);
  }

  @autobind
  checkBatchAddRecordDataIsLegal(data) {
    // 如果是Mot回访任务
    if (data.isMotVisit) {
      // 回访结果为空校验不通过
      if (_.isEmpty(data[VISIT_RESULT_KEY])) {
        return false;
      }
      // 回访结果为失败，且 失败原因为空时，校验不通过
      if (
        data[VISIT_RESULT_KEY] === VISIT_RESULT_FAILED_VALUE &&
        _.isEmpty(data[VISIT_FAILURE_DESC_KEY])
      ) {
        return false;
      }
    }
    // 如果不是Mot回访任务
    if (!data.isMotVisit) {
      // 一级反馈选项为空，或者反馈时间为空，校验不通过
      if (!data[FIRST_FEEDBACK_KEY] || _.isEmpty(data[FEEDBACK_TIME_KEY])) {
        return false;
      }
      const firstFeedbackData =
        this.getFirstFeedbackItem(data.feedbackList, data[FIRST_FEEDBACK_KEY]);
      // 选择了一级反馈，并且该一级反馈下面有二级反馈列表时，没有选择二级反馈，校验不通过
      if (!_.isEmpty(firstFeedbackData.childList) && !data[SECOND_FEEDBACK_KEY]) {
        return false;
      }
    }
    return true;
  }

  @autobind
  handleSubmit() {
    const {
      closeModal,
      saveBatchAddServiceRecord,
    } = this.props;
    const list = this.getSelectedTaskList();
    let flag = true;
    // 如果没有选择其他代办任务，直接关闭弹窗
    if (_.isEmpty(list)) {
      closeModal();
      return;
    }
    // 如果选择了其他代办任务，对选择的代办任务进行必填校验,此处只做数据上的校验，错误信息的显示是在BatchAddServiceRecordItem组件里处理
    list.forEach((item) => {
      flag = this.checkBatchAddRecordDataIsLegal(item);
    });
    if (flag) {
      const condition = list.map(item => ({
        missionFlowId: item.flowId,
        serveCustFeedBack: item.serveCustFeedBack,
        serveCustFeedBack2: item.serveCustFeedBack2,
        feedBackTime: item.feedBackTime,
        uuid: item.uuid,
        eventType: item.eventType,
        visitResult: item.visitResult,
        visitFailureDesc: item.visitFailureDesc,
      }));
      saveBatchAddServiceRecord(condition);
    }
  }

  render() {
    const {
      visible,
      closeModal,
      modalKey,
      data = EMPTY_ARRAY,
      onFormChange,
    } = this.props;

    const selfBtnGroup = (
      <div className={styles.buttonBox}>
        <span className={styles.tips}>已关联 <em>{this.getSelectedTaskList().length}</em> 个任务</span>
        <Button
          key="submit"
          type="primary"
          size="large"
          onClick={this.handleSubmit}
        >
          确定
        </Button>
      </div>
    );

    return (
      <CommonModal
        title="同步其他待办任务"
        visible={visible}
        closeModal={closeModal}
        modalKey={modalKey}
        wrapClassName={styles.addCustModal}
        selfBtnGroup={selfBtnGroup}
        maskClosable={false}
      >
        <div className={styles.modalBox}>
          <h3 className={styles.title}>
            该客户名下还有 <span>{data.length}</span> 个待办任务，请选择需要同步服务记录的任务并填写客户反馈
          </h3>
          {
            data.map((item, index) => (
              <BatchAddServiceRecordItem
                data={item}
                key={item.flowId}
                index={index}
                onFormChange={onFormChange}
              />
            ))
          }
        </div>
      </CommonModal>
    );
  }
}
