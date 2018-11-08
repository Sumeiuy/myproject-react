/*
 * @Author: zhangjun
 * @Date: 2018-11-08 13:46:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-08 17:33:21
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
    action,
    onCloseModal,
    onChangeFormData,
    onConfirm,
    onSetColumnFormRef,
    attachmentList,
  } = props;
  function handleCloseModal() {
    onCloseModal();
  }
  function handleChangeFormData(obj) {
    onChangeFormData(obj);
  }
  function handleConfirm() {
    onConfirm();
  }
  function setColumnFormRef(form) {
    onSetColumnFormRef(form);
  }
  return (
    <CommonModal
      title="新建内容"
      visible={visible}
      modalKey="activityColumnModal"
      closeModal={handleCloseModal}
      needBtn={false}
      className={styles.activityColumnModal}
    >
      <ColumnForm
        action={action}
        formData={formData}
        attachmentList={attachmentList}
        onChange={handleChangeFormData}
        wrappedComponentRef={setColumnFormRef}
      />
      <div className={styles.modalFooterButton}>
        <Button className={styles.cancelButton} onClick={handleCloseModal}>取消</Button>
        <Button type="primary" className={styles.submitButton} onClick={handleConfirm}>确定</Button>
      </div>
    </CommonModal>
  );
}

ColumnModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onChangeFormData: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onSetColumnFormRef: PropTypes.func.isRequired,
  attachmentList: PropTypes.array.isRequired,
};
