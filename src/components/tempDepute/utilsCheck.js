/*
 * @Author: sunweibin
 * @Date: 2018-08-31 17:22:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-01 23:42:05
 * @descprition 临时委托组件中的辅助函数
 */
import _ from 'lodash';
import moment from 'moment';

const DEPUTE_REASON_CHECK_WARINGS = '委托原因内容长度范围为 10~1000';

const ASSOGNEE_CHECK_WARNINGS = '受托服务经理不能为空';

const PERIOD_CHECK_WARNINGS = '委托期限不能为空，并且开始时间必须在结束时间之前';

const DEFAULT_CHECK_REAULT = {
  deputeReasonCheck: true,
  assigneeCheck: true,
  periodCheck: true,
};

// 判断是否填写相关数据
function hasWriteData(v) {
  return !_.isEmpty(v);
}

// 判断委托原因文本长度是否长度超过1000
function checkDeputeReasonLengthOver1000(v) {
  return v.length > 1000;
}

// 校验委托原因
function checkDeputeReason(v) {
  return hasWriteData(v) && v.length >= 10;
}
// 校验受托人
function checkAcceptor(v) {
  return hasWriteData(v);
}

// 委托期限校验
function checkPeriod(start, end) {
  return hasWriteData(start) && hasWriteData(end) && moment(start) < moment(end);
}

function validateData(data) {
  // 是否通过校验
  let valid = true;
  const checkResult = { ...DEFAULT_CHECK_REAULT };
  // 1. 校验委托原因
  if (!checkDeputeReason(data.deputeReason)) {
    valid = false;
    checkResult.deputeReasonCheck = false;
  }
  // 2. 校验受托人
  if (!checkAcceptor(data.assigneeId)) {
    valid = false;
    checkResult.assigneeCheck = false;
  }
  // 3. 校验委托期限
  if (!checkPeriod(data.deputeTimeStart, data.deputeTimeEnd)) {
    valid = false;
    checkResult.periodCheck = false;
  }

  return { checkResult, valid };
}

export {
  validateData as validateAll,
  checkDeputeReason,
  checkAcceptor,
  checkPeriod,
  checkDeputeReasonLengthOver1000,
  DEPUTE_REASON_CHECK_WARINGS,
  ASSOGNEE_CHECK_WARNINGS,
  PERIOD_CHECK_WARNINGS,
  DEFAULT_CHECK_REAULT,
};
