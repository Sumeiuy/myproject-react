/**
 * @Author: sunweibin
 * @Date: 2018-05-08 19:34:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-15 17:36:42
 * @description 营业部非投顾签约客户分配工具函数
 */

const utils = {
  // 将接口获取的客户列表数据转换成，表格所需要的数据
  createDetailCustTableData(custList = []) {
    return custList.map((item) => {
      const {
        custName, brokerNumber,
        statusText,
        empName, empId, empTgFlag,
        managerName, managerId,
        newEmpName, newEmpId, newEmpTgFlag,
      } = item;
      return {
        customer: `${custName}(${brokerNumber})`,
        status: statusText,
        empTgFlag,
        newEmpTgFlag,
        preManager: `${empName}(${empId})`,
        developManager: `${managerName}(${managerId})`,
        newManager: `${newEmpName}(${newEmpId})`,
      };
    });
  },
  // 修改当前审批步骤的数据结构
  fixCurrentApprovalData(approval = {}) {
    const { occupation = '', empName = '', empNum = '' } = approval;
    return {
      stepName: occupation,
      handleName: `${empName}(${empNum})`,
    };
  },
  // 将过滤客户以及Excel的接口返回的数据，转化为表格需要的数据
  createAddLayerCustTableDate(custList = []) {
    return custList.map((item) => {
      const {
        custName, brokerNumber,
        statusText,
        empName, empId, isTg,
        managerName, managerId,
      } = item;
      return {
        ...item,
        key: brokerNumber,
        customer: `${custName}(${brokerNumber})`,
        statusText,
        isTg,
        prevManager: `${empName}(${empId})`,
        devManager: `${managerName}(${managerId})`,
      };
    });
  },
};

export default utils;

export const {
  createDetailCustTableData,
  fixCurrentApprovalData,
  createAddLayerCustTableDate,
} = utils;
