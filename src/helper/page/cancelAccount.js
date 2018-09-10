/**
 * @Author: sunweibin
 * @Date: 2018-07-13 16:50:40
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-18 13:33:10
 * @description 线上销户数据校验
 */
import _ from 'lodash';

// 投资品种中的其他品种的 key
const INVEST_OTHER_VAR_KEY = 'churnInvestmentOther';
// 流失原因中的其他原因的 key
const LOST_REASON_OTHER_KEY = 'churnOther';
// 流失去向-转户
const LOST_DIRECTION_TRANSFER = 'churnTransfer';
// 流失去向-投资其他
const LOST_DIRECTION_INVEST = 'investOther';


// 判断是否填写相关数据
function hasWriteData(v) {
  return !_.isEmpty(v);
}
// 是否选择了投资品种的其他品种
function hasSelectOtherVar(list) {
  return !_.isEmpty(_.find(list, item => item.key === INVEST_OTHER_VAR_KEY));
}
// 是否选择了流失原因中的其他原因
function hasSelectOtherReason(list) {
  return !_.isEmpty(_.find(list, item => item.key === LOST_REASON_OTHER_KEY));
}

// 判断是否选择了投资品种
function hasSelectInvestVars(vars) {
  if (vars.length > 1) {
    return true;
  }
  return vars.length === 1 && vars[0] !== '';
}

// 判断是否选择了流失原因
function hasSelectLostReason(v) {
  if (v.length > 1) {
    return true;
  }
  return v.length === 1 && v[0] !== '';
}


function validateSubmitData(state) {
  // 1. 判断是否选择用户
  if (!hasWriteData(state.cust)) {
    return {
      msg: '客户不能为空',
      valid: false,
    };
  }

  // 2. 判断是否选择流失去向
  const { lostDirection } = state;
  if (!hasWriteData(lostDirection)) {
    return {
      msg: '前选择流失去向',
      valid: false,
    };
  }

  // 3. 判断如果流失去向是 转户，则判断证券营业部是否为空
  if (lostDirection === LOST_DIRECTION_TRANSFER && !hasWriteData(state.stockExchange)) {
    return {
      msg: '请填写证券营业部名称',
      valid: false,
    };
  }

  // 4. 判断如果流失去向是 转户，则判断证券营业部名称字符长度
  if (lostDirection === LOST_DIRECTION_TRANSFER && state.stockExchange.length > 100) {
    return {
      msg: '转户证券营业部名称长度不得超过100个字符',
      valid: false,
    };
  }

  // 5. 判断如果流失去向是 投资其他，则判断投资品种有无填写
  if (lostDirection === LOST_DIRECTION_INVEST && !hasSelectInvestVars(state.investVars)) {
    return {
      msg: '请选择投资品种',
      valid: false,
    };
  }

  // 6. 判断如果流失去向是 投资其他，则投资品种中含有其他品种
  // 则必须填写其他品种详细
  if (lostDirection === LOST_DIRECTION_INVEST
    && hasSelectOtherVar(state.investVars)
    && !hasWriteData(state.otherVarDetail)
  ) {
    return {
      msg: '选择了其他投资品种，需要填写详细投资品种',
      valid: false,
    };
  }

  // 7. 判断如果流失去向是 投资其他，则投资品种中含有其他品种
  // 则必须填写其他品种详细字符串长度
  if (lostDirection === LOST_DIRECTION_INVEST
    && hasSelectOtherVar(state.investVars)
    && state.otherVarDetail.length > 255
  ) {
    return {
      msg: '选择了其他投资品种，填写的详细投资品种字符长度不得超过255个字符',
      valid: false,
    };
  }

  // 8. 判断流失原因是否选择
  const { lostReason } = state;
  if (!hasSelectLostReason(lostReason)) {
    return {
      msg: '请选择流失原因',
      valid: false,
    };
  }
  // 9. 如果流失原因中含有其他原因，则需要判断是否填写详细原因
  if (hasSelectOtherReason(lostReason) && !hasWriteData(state.otherReasonDetail)) {
    return {
      msg: '选择了其他流失原因，需要填写详细原因',
      valid: false,
    };
  }

  // 10. 流失详细原因字符串长度
  if (hasSelectOtherReason(lostReason) && state.otherReasonDetail.length > 255) {
    return {
      msg: '选择了其他流失原因，填写的详细原因不得超过255个字符',
      valid: false,
    };
  }

  return {
    msg: '验证通过',
    valid: true,
  };
}

const exported = {
  validateData: validateSubmitData,
};

export default exported;
export { validateSubmitData as validateData };
