/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-27 16:11:03
 * 确认提示框，用于删除提示与表单返回提示，传入type
 * type === delete，删除提示
 * type ==== edit，表单返回提示
 */
import { Modal } from 'antd';

const confirm = Modal.confirm;

export default function (params) {
  const { type, onOkHandler, onCancelHandler, content } = params;
  let finalContent = '';
  switch (type) {
    case 'delete':
      finalContent = '确定要删除吗？';
      break;
    case 'edit':
      finalContent = '直接返回后，您编辑的信息将不会被保存，确认返回？';
      break;
    case 'close':
      finalContent = '关闭弹框后，您编辑的信息将不会被保存，确认关闭？';
      break;
    default:
      finalContent = content;
  }

  confirm({
    title: '系统提示',
    content: finalContent,
    okText: '确认',
    okType: type === 'delete' ? 'danger' : 'primary',
    cancelText: '取消',
    onOk() {
      onOkHandler();
    },
    onCancel() {
      onCancelHandler();
    },
  });
}
