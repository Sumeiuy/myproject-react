/**
 * @Author: sunweibin
 * @Date: 2018-05-08 10:17:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-18 15:12:18
 * @description 营业部非投顾签约客户分配的API
 */

export default function cust(api) {
  return {
    // 获取右侧签约客户分配详情
    getAppDetail: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/queryApplicationDetail', query),
    // 根据客户名称或者经纪客户号查询客户列表
    queryCustList: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/queryCustList', query),
    // 线上销户新建的下拉框字典
    queryDict: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/closeAccountOnlineTypeMap', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList2', query),
    // 手动推送销户
    pushCancelAccount: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/pushCancelAccount', query),
    // 下一步按钮和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/queryNextStepInfo', query),
    // 保存接口
    saveApplication: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/saveCloseAccountOnlineApply', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/biz/closeaccountonline/doApprove', query),
  };
}
