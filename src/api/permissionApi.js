/**
 * 权限申请模块的接口
 */
import apiCreator from '../utils/apiCreator';

const api = apiCreator();

const permissionApi = {

  // 暴露api上的几个底层方法: get / post
  ...api,


};

export default permissionApi;
