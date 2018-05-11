/**
 * @Author: sunweibin
 * @Date: 2018-05-08 10:17:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-10 17:06:50
 * @description 营业部非投顾签约客户分配的API
 */

export default function cust(api) {
  return {
    // 获取右侧签约客户分配详情
    getAppDetail: query => api.post('/groovynoauth/fsp/cust/manager/queryCustDistributionDetail', query),
    // 上传批量导入客户列表数据的Excel
    uploadBatchCustByExcel: query => api.post('/groovynoauth/fsp/cust/manager/batchUploadCustByExcel', query),
  };
}
