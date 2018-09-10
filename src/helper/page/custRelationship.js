/**
 * @Author: sunweibin
 * @Date: 2018-06-14 20:00:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-20 09:54:44
 * @description 融资类业务提交数据时的校验函数
 */
import _ from 'lodash';

// 用到的参数关联关系数组
let relations = [];
// 客户婚姻状态为已婚的Code
const MARRIAGED_TYPE_CODE = '108020';
// 夫妻类型Code
const FUQI_TYPE_CODE = '127111';
// 普通机构-实际控制人
const REALCONTROLLER_TYPE_CODE = '127151';
// 产品客户-产品管理人
const PRODUCTMANAGER_TYPE_CODE = '127371';

// 获取关联关系中某一个关系的数量
function getCountOfSomeRelation(code) {
  const count = _.countBy(relations, ship => ship.relationSubTypeValue === code);
  return count.true;
}

// 获取个人客户的关联关系中的夫妻关联关系条数
function getMarriageRelactionCount() {
  return getCountOfSomeRelation(FUQI_TYPE_CODE);
}

// 获取普通机构客户的关联关系中的实际控制人关系的条数
function getRealControllerRelationCount() {
  return getCountOfSomeRelation(REALCONTROLLER_TYPE_CODE);
}

// 获取产品客户的关联关系中的产品管理人关系的条数
function getProduceManagerRelationCount() {
  return getCountOfSomeRelation(PRODUCTMANAGER_TYPE_CODE);
}

function hasCust(cust) {
  return !_.isEmpty(cust);
}

function hasStockRepurchase(stockRepurchase) {
  return !_.isEmpty(stockRepurchase);
}

function hasSetRelationships() {
  return !_.isEmpty(relations);
}

function hasMarriageRelation() {
  return getMarriageRelactionCount() > 0;
}


function hasOneMoreMarriageRelation() {
  return getMarriageRelactionCount() > 1;
}


function hasRealControllerRelation() {
  return getRealControllerRelationCount() > 0;
}


function hasOneMoreRealControllerRelation() {
  return getRealControllerRelationCount() > 1;
}


function hasProduceManagerRelation() {
  return getProduceManagerRelationCount() > 0;
}


function hasOneMoreProduceManagerRelation() {
  return getProduceManagerRelationCount() > 1;
}

function checkRealtionDuplicate() {
  // 同一申请单中同一类型的关系信息关系人三要素（关系人名称、关系人证件类型、关系人证件号码）不得重复
  // 首先将关联关
  const result = [];
  let resultBool = true;
  let msg = '';
  _.each(relations, (item) => {
    const {
      relationTypeValue,
      relationTypeLabel,
      partyName,
      partyIDTypeValue,
      partyIDTypeLabel,
      partyIDNum,
    } = item;
    // 将三要素合并成字符串，放入到result数组中，来判断是否已经存在该值，
    // 如果该值存在，则表示有关联关系的三要素是相同的，弹出提示框
    const threeKeyMergeStr = `${relationTypeValue}${partyName}${partyIDTypeValue}${partyIDNum}`;
    if (_.includes(result, threeKeyMergeStr)) {
      // 如果已经存在了
      msg = `${relationTypeLabel}-${partyName}-${partyIDTypeLabel}-${partyIDNum} 关联关系三要素信息填写重复！`;
      resultBool = false;
      return false;
    }
    result.push(threeKeyMergeStr);
    return true;
  });
  return {
    msg,
    valid: resultBool,
  };
}

function validateSubmitData(state) {
  const { cust: { custTypeValue, marriageValue }, stockRepurchase } = state;
  // 1 校验客户
  if (!hasCust(state.cust)) {
    return {
      msg: '客户不能为空',
      valid: false,
    };
  }
  // 2.校验是否选择了是否办理股票质押回购业务
  if (!hasStockRepurchase(stockRepurchase)) {
    return {
      msg: '请选择是否办理股票质押回购业务',
      valid: false,
    };
  }
  // 3.校验是否添加了关联关系
  if (!hasSetRelationships()) {
    return {
      msg: '关联关系不能为空',
      valid: false,
    };
  }
  // 4. 校验个人客户校验夫妻关系
  // 检测客户的婚姻状态与关联关系
  // 若所选客户的婚姻状况为“已婚”
  // 则“家庭成员”中“夫妻”类必填，且同一申请单中夫妻关系只能填写一条
  if (custTypeValue === 'per' && MARRIAGED_TYPE_CODE === marriageValue) {
    if (!hasMarriageRelation()) {
      return {
        msg: '没有维护家庭成员夫妻类关联关系！',
        valid: false,
      };
    }
    if (hasOneMoreMarriageRelation()) {
      return {
        msg: '家庭成员夫妻类关联关系超过1条！',
        valid: false,
      };
    }
  }
  // 5.校验普通机构客户，实际控制人关联关系数量
  if (custTypeValue === 'org') {
    if (!hasRealControllerRelation()) {
      return {
        msg: '没有维护实际控制人关联关系！',
        valid: false,
      };
    }
    if (hasOneMoreRealControllerRelation()) {
      return {
        msg: '实际控制人关联关系超过1条！',
        valid: false,
      };
    }
  }
  // 6.校验产品客户，产品管理人关联关系数量
  if (custTypeValue === 'prod') {
    if (!hasProduceManagerRelation()) {
      return {
        msg: '没有维护产品管理人关联关系！',
        valid: false,
      };
    }
    if (hasOneMoreProduceManagerRelation()) {
      return {
        msg: '产品管理人关联关系超过1条！',
        valid: false,
      };
    }
  }
  // 7.校验关联关系中的三要素
  return checkRealtionDuplicate();
}

const validate = (state) => {
  const { relationships } = state;
  relations = relationships;
  return validateSubmitData(state);
};

const exported = {
  validateData: validate,
};

export default exported;
export { validate as validateData };
