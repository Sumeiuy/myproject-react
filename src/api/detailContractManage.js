/**
 * @Description: 合约管理-协议-接口
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-21 15:57:25
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-21 16:32:02
 */

export default function detailContractManage(api) {
  return {
    // 获取协议列表
    queryProtocolList: query => api.post('/groovynoauth/fsp/cust/contract/queryProtocolList', query),
    // 查询用户信息用以判断是否显示投顾签约按钮
    queryLoginInfo: query => api.post('/groovynoauth/fsp/cust/contract/queryEmpHasInvestContract', query),
    // 查询是否通过前置条件
    queryPassPrecondition: query => api.post('/groovynoauth/fsp/cust/contract/queryPassPrecondition', query),
    // 提交终止操作
    submitProtocol: query => api.post('/groovynoauth/fsp/cust/contract/submitProtocol', query),
    // 删除操作
    deleteProtocol: query => api.post('/groovynoauth/fsp/cust/contract/deleteProtocol', query),
    // 查询合同列表
    queryAgreementList: query => api.post('/groovynoauth/fsp/cust/contract/queryAgreementList', query),
  };
}
