import Signal from 'signals';

const PubSub = {
  // 查询服务人员列表
  serverPersonelList: new Signal(),
  // 触发dva中的dispatchServerPersonelList方法
  dispatchServerPersonelList: new Signal(),
};

export default PubSub;
