import Signal from 'signals';

const PubSub = {
  // 当异步获取到服务人员列表数据时
  serverPersonelList: new Signal(),
  // 当异步获取到子类型数据时
  childTypeList: new Signal(),
  // 当异步获取到客户列表数据时
  customerList: new Signal(),
  // 触发dva中的action方法 获取服务人员列表
  dispatchServerPersonelList: new Signal(),
  // 触发dav中的 action方法 获取子类型
  dispatchChildTypeList: new Signal(),
  // 触发dav中的 action方法 获取 客户列表
  dispatchCustomerList: new Signal(),
};

export default PubSub;
