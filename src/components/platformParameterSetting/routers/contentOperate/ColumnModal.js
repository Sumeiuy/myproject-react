/*
 * @Author: zhangjun
 * @Date: 2018-11-08 13:46:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-14 21:37:57
 */
import React from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../../../common/biz/CommonModal';
import ColumnForm from './ColumnForm';

import styles from './columnModal.less';

const ColumnModal = React.forwardRef((props, ref) => {
  const {
    visible,
    formData,
    onCloseModal,
    onChangeFormData,
    onConfirm,
    attachmentList,
    isShowAttachmentStatusError,
    attachmentStatusErrorMessage,
    action,
    onFalseDelete,
  } = props;
  function isCreateColumn() {
    // action 判断当前是新建 'CREATE' 还是 修改'UPDATE'
    return action === 'CREATE';
  }
  // 表单数据变化
  function handleChangeFormData(obj) {
    onChangeFormData(obj);
  }
  // 栏目弹框标题
  const columnTitle = isCreateColumn() ? '新建内容' : '编辑内容';
  return (
    <CommonModal
      title={columnTitle}
      visible={visible}
      modalKey="activityColumnModal"
      closeModal={onCloseModal}
      className={styles.activityColumnModal}
      onOk={onConfirm}
      showCancelBtn={false}
    >
      {
        visible
          ? (
            <ColumnForm
              formData={formData}
              attachmentList={attachmentList}
              isShowAttachmentStatusError={isShowAttachmentStatusError}
              attachmentStatusErrorMessage={attachmentStatusErrorMessage}
              onChange={handleChangeFormData}
              onFalseDelete={onFalseDelete}
              action={action}
              ref={ref}
            />
          )
          : null
      }

    </CommonModal>
  );
});

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
  // 编辑状态附件列表
  attachmentList: PropTypes.array.isRequired,
  // 附件校验错误状态
  isShowAttachmentStatusError: PropTypes.bool.isRequired,
  // 附件校验错误信息
  attachmentStatusErrorMessage: PropTypes.string.isRequired,
  // 判断此组件用于新建页面还是修改页面，'CREATE'或者'UPDATE'
  action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
  // 假删除方法
  onFalseDelete: PropTypes.func.isRequired,
};

export default ColumnModal;
