/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系申请的配置文件
 * @Date: 2018-06-08 13:32:19
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-14 16:18:32
 */


const config = {
  custRelationships: {
    pageName: '客户关联关系信息申请',
    pageType: '10', // 查询列表接口中的type值
    statusOptions: [
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
  },
  custRelationshipColumns: [
    {
      title: '关联关系类型',
      dataIndex: 'relationTypeLabel',
      key: 'relationTypeLabel',
    },
    {
      title: '关联关系名称',
      dataIndex: 'relationNameLabel',
      key: 'relationNameLabel',
    },
    {
      title: '关联关系子类型',
      dataIndex: 'relationSubTypeLabel',
      key: 'relationSubTypeLabel',
    },
    {
      title: '关系人名称',
      dataIndex: 'partyName',
      key: 'partyName',
    },
    {
      title: '关系人证件类型',
      dataIndex: 'partyIDTypeLabel',
      key: 'partyIDTypeLabel',
    },
    {
      title: '关系人证件号码',
      dataIndex: 'partyIDNum',
      key: 'partyIDNum',
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
};

export default config;
