import Signal from 'signals';

const PubSub = {
  // 当查询服务人员列表时变化时监听
  serverPersonelList: new Signal(),
  // 触发dva中的action方法 获取服务人员列表
  dispatchServerPersonelList: new Signal(),
};

export default PubSub;
