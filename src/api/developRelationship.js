/**
 * 开发关系认定模块的接口
 */

export default function developRelationship(api) {
  return {
    // 获取详情信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/biz/developRelationship/queryDevelopRelationshipDetail', query),
  };
}
