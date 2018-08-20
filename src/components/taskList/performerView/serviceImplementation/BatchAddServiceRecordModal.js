/**
 * @Author: XuWenKang
 * @Description: 批量添加服务记录弹窗
 * @Date: 2018-08-17 11:31:18
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-20 13:20:11
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
// 任务详情里是否选中的key值
const IS_CHECKED_KEY = 'isChecked';
// 任务详情里一级反馈的key值
const FIRST_FEEDBACK_KEY = 'serveCustFeedBack';
// 任务详情里二级反馈的key值
const SECOND_FEEDBACK_KEY = 'serveCustFeedBack2';
// 任务详情里反馈时间的key值
const FEEDBACK_TIME_KEY = 'feedBackTime';

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

  @autobind
  getSelectedTaskList() {
    const { data = EMPTY_ARRAY } = this.props;
    return _.filter(data, item => item[IS_CHECKED_KEY]);
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
      if (
          !item[FIRST_FEEDBACK_KEY] ||
          !item[SECOND_FEEDBACK_KEY] ||
          _.isEmpty(item[FEEDBACK_TIME_KEY])
        ) {
        flag = false;
      }
    });
    if (flag) {
      const condition = list.map(item => ({
        missionFlowId: item.flowId,
        serveCustFeedBack: item.serveCustFeedBack,
        serveCustFeedBack2: item.serveCustFeedBack2,
        feedBackTime: item.feedBackTime,
        uuid: item.uuid,
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
