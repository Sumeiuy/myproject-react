/*
 * @Author: sunweibin
 * @Date: 2018-08-31 17:22:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-31 17:50:02
 * @descprition 临时委托组件中的辅助函数
 */
import _ from 'lodash';
import moment from 'moment';

// 判断是否填写相关数据
function hasWriteData(v) {
  return !_.isEmpty(v);
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
  const checkResult = {};
  // 1. 校验委托原因
  if (!checkDeputeReason(data.deputeReason)) {
    checkResult.deputeReason = {
      valid: false,
      msg: '委托原因内容长度范围为 10~1000',
    };
  }
  // 2. 校验受托人
  if (!checkAcceptor(data.assigneeId)) {
    checkResult.assignee = {
      valid: false,
      msg: '受托服务经理不能为空',
    };
  }
  // 3. 校验委托期限
  if (!checkPeriod(data.deputeTimeStart, data.deputeTimeEnd)) {
    checkResult.period = {
      valid: false,
      msg: '委托期限不能为空，并且开始时间必须在结束时间之前',
    };
  }

  return checkResult;
}

export {
  validateData as validateAll,
  checkDeputeReason,
  checkAcceptor,
  checkPeriod,
};
