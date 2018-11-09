/*
 * @Author: zhangjun
 * @Date: 2018-11-08 13:46:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-09 10:48:34
 */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../common/Button';
import CommonModal from '../../../common/biz/CommonModal';
import ColumnForm from './ColumnForm';

import styles from './columnModal.less';

export default function ColumnModal(props) {
  const {
    visible,
    formData,
    onCloseModal,
    onChangeFormData,
    onConfirm,
    onSetColumnFormRef,
    attachmentList,
    isShowAttachmentStatusError,
    attachmentStatusErrorMessage,
  } = props;
  // 表单数据变化
  function handleChangeFormData(obj) {
    onChangeFormData(obj);
  }
  // 设置form组件引用
  function setColumnFormRef(form) {
    onSetColumnFormRef(form);
  }
  return (
    <CommonModal
      title="新建内容"
      visible={visible}
      modalKey="activityColumnModal"
      closeModal={onCloseModal}
      needBtn={false}
      className={styles.activityColumnModal}
    >
      <ColumnForm
        formData={formData}
        attachmentList={attachmentList}
        isShowAttachmentStatusError={isShowAttachmentStatusError}
        attachmentStatusErrorMessage={attachmentStatusErrorMessage}
        onChange={handleChangeFormData}
        ref={setColumnFormRef}
      />
      <div className={styles.modalFooterButton}>
        <Button className={styles.cancelButton} onClick={onCloseModal}>取消</Button>
        <Button type="primary" className={styles.submitButton} onClick={onConfirm}>确定</Button>
      </div>
    </CommonModal>
  );
}

ColumnModal.propTypes = {
  // 弹窗是否可见
  visible: PropTypes.bool.isRequired,
  // 表单数据
  formData: PropTypes.object.isRequired,
  // 关闭弹窗
  onCloseModal: PropTypes.func.isRequired,
  // 表单数据变化回调
  onChangeFormData: PropTypes.func.isRequired,
  // 确定按钮回调
  onConfirm: PropTypes.func.isRequired,
  // 设置form组件引用
  onSetColumnFormRef: PropTypes.func.isRequired,
  // 编辑状态附件列表
  attachmentList: PropTypes.array.isRequired,
  // 附件校验错误状态
  isShowAttachmentStatusError: PropTypes.bool.isRequired,
  // 附件校验错误信息
  attachmentStatusErrorMessage: PropTypes.string.isRequired,
};
