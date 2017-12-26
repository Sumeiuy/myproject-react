/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:06:59
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2017-12-26 14:10:59
 * @description 此处存放与系统登录人相关的公用方法
 */
import qs from 'query-string';
import _ from 'lodash';
import duty from './config/duty';

const emp = {
  /**
   * 获取登录的ID 002332
   * @param {null}
   * @returns {String}
   */
  getId() {
    // 临时 ID
    const tempId = '002332'; // '001423''002727','002332' '001206' '001410';
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
    let orgId = 'ZZ001041';
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
   * 根据传入的部门id和组织机构数数组返回部门id对应的对象
   * @author XuWenKang
   * @returns {Object}
   */
  getOrgDataByOrgId(arr, id) {
    const data = _.find(arr, (item) => {
      if (item.id === id) {
        return item;
      }
      return this.getOrgDataByOrgId(item.children, id);
    });
    if (data) {
      return (data.id === id) ? data : this.getOrgDataByOrgId(data.children, id);
    }
    return data;
  },

  /**
   * 判断当前登录人部门是否是分公司
   * @author XuWenKang
   * @returns {Boolean}
   */
  isFiliale(arr, id) {
    const orgData = this.getOrgDataByOrgId(arr, id);
    return orgData.level === duty.bm_fgs;
  },
};

export default emp;
