/**
 * @file src/components/common/Confirm/preDefinedContent.js
 * @description 确认框提示内容预定义内容
 * @author sunweibin
 */
const preDefine = {
  default: '',
  delete: '确定要删除吗？',
  edit: '直接返回后，您编辑的信息将不会被保存，确认返回？',
  close: '关闭弹框后，您编辑的信息将不会被保存，确认关闭？',
  changeproduct: '选择新的目标产品后，您之前所选择的客户会被清空!',
  wrongInput: '请输入数字!',
  custExist: '客户已经存在',
  custListMaxLength: '添加客户上限为200个',
  custRisk: '该客户没有有效的风险测评！',
  custInvestRt: '该客户投资偏好信息缺失，先请客户补齐信息！',
  custInvestTerm: '该客户投资期限信息缺失，先请客户补齐信息！',
  custPass: '该客户通过检验，可以创建申请！',
  unfinish: '当前客户存在未完成订单，请点击确认前往360视图订单流水中进行处理！',
  feedbackMaintainNotEmpty: '服务经理一级可选项名称不能为空',
  feedbackMaintainUpdate: '修改的反馈信息实时生效，会影响到已反馈的服务记录，是否确认修改？',
  feedbackMaintainDelete: '删除的信息在系统中实时生效，会影响到已关联的任务，确认要删除吗？',
  hasTouGu: '待分配客户涉及投顾名下客户，是否确认分配？',
  amountConfirm: '禁止转出金额仅适用于限制类型禁止账户留存指定金额流通资产转出，您当前并未选择该限制类型，系统将自动清除所填金额，请确认！',
};

export default preDefine;
