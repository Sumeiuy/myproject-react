/**
 * 批量佣金接口
 */

export default function commission(api) {
  return {
    // 批量佣金目标产品接口
    queryProduct: query => api.post('/groovynoauth/fsp/biz/chgcommission/queryProduct', query),
  };
}
