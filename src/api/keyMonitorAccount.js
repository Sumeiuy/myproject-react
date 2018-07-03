/**
 * @Author: sunweibin
 * @Date: 2018-06-19 16:26:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-19 17:15:26
 * @description 重点监控账户 Api
 */

export default function feebback(api) {
  return {
    // 重点监控账户列表
    getAccountList: query => api.post('/groovynoauth/fsp/cust/blacklist/queryKeyMonitorCustList', query),
  };
}
