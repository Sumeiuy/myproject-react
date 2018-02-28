/*
 * @Description: 设置主职位页面的配置项
 * @Author: LiuJianShu
 * @Date: 2017-12-21 17:02:36
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-02-28 10:03:25
 */
const mainPostnConfig = {
  pageName: '分公司客户人工划转',
  pageType: '08', // 查询列表接口中的type值
  status: [
    {
      show: true,
      label: '全部',
      value: '',
    },
    {
      show: true,
      label: '处理中',
      value: '01',
    },
    {
      show: true,
      label: '完成',
      value: '02',
    },
    {
      show: true,
      label: '终止',
      value: '03',
    },
    {
      show: true,
      label: '驳回',
      value: '04',
    },
  ],
  titleList: [
    {
      dataIndex: 'position',
      key: 'position',
      title: '职位',
    },
    {
      dataIndex: 'department',
      key: 'department',
      title: '部门',
    },
  ],
  approvalColumns: [
    {
      title: '工号',
      dataIndex: 'login',
      key: 'login',
    }, {
      title: '姓名',
      dataIndex: 'empName',
      key: 'empName',
    }, {
      title: '所属营业部',
      dataIndex: 'occupation',
      key: 'occupation',
    },
  ],
  container: '#container',
  content: '#content',
};

export default mainPostnConfig;
