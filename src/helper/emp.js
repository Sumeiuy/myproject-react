/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:06:59
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-11 17:30:22
 * @description 此处存放与系统登录人相关的公用方法
 */
import qs from 'query-string';
import _ from 'lodash';
import duty from './config/duty';

/**
* 根据传入的部门id和组织机构数数组返回部门id对应的对象
* @author XuWenKang
* @returns {Object}
*/
/* eslint-disable */
// 函数互相调用在eslint中总会报 函数定义层级的问题所以禁用eslint
function findOrgDataByOrgId(list, id) {
  for (let i = 0, len = list.length; i < len; i++) {
    const found = findNode(list[i], id);
    if (found) {
      return found;
    }
  }
}

function findNode(node, id) {
  if (node.id === id) {
    return node;
  }
  if (node.children) {
    return findOrgDataByOrgId(node.children, id);
  }
  return null;
}
/* eslint-disable */

const emp = {
  /**
   * 初始化页面后将用户信息保存到相关的变量中去
   * @param {Object} empInfo 用户信息
   */
  setEmpInfo(loginInfo) {
    const { empId, postId, orgId, occDivnNum, postnId, empNum } = loginInfo;
    window.curUserCode = empId || empNum;
    window.curOrgCode = orgId || occDivnNum;
    window.forReactPosition = {
      postnId: postId || postnId,
      orgId: orgId || occDivnNum,
    };
  },
  /**
   * 获取登录的ID 002332
   * @param {null}
   * @returns {String}
   */
  getId() {
    // 临时 ID
    const tempId = '001750'; // '001423''002727','002332' '001206' '001410';
    const nativeQuery = qs.parse(window.location.search);
    const empId = window.curUserCode || nativeQuery.empId || tempId;
    return empId;
  },
  /**
   * 获取登录人当前组件的ZZ编号
   * @author sunweibin
   * @returns {String|null}
   */
  getOrgId() {
    // 临时id
    let orgId = 'ZZ001041051'; // 南京长江路证券营业部
    if (!_.isEmpty(window.forReactPosition)) {
      orgId = window.forReactPosition.orgId;
    }
    return orgId;
  },

  /**
   * 获取登录人当前的职位信息
   * @author sunweibin
   * @returns {String|null} 职位信息
   */
  getPstnId() {
    let pstnId = null;
    if (!_.isEmpty(window.forReactPosition)) {
      pstnId = window.forReactPosition.pstnId;
    }
    return pstnId;
  },

  /**
   * 判断当前登录人部门是否是分公司
   * @author XuWenKang
   * @returns {Boolean}
   */
  isFiliale(arr, id) {
    const orgData = findOrgDataByOrgId(arr, id);
    return (!_.isEmpty(orgData) && orgData.level === duty.bm_fgs);
  },
};

export default emp;
