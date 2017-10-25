/*
 * @fileOverview config/pageConfig.js
 * @author sunweibin
 * @description 用于设置合作合约、佣金调整、私密客户的page Type
 * 以及各个子类型和状态配置项
 *
 * 现阶段子类型(subType)与状态(status)不做联动
 *
*/

const pageConfig = {
  // 权限分配
  permission: {
    pageName: '权限申请',
    pageType: '01', // 查询列表接口中的type值
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '私密客户设置',
        value: '0103',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ], // 状态
      },
      {
        show: true,
        label: '私密客户取消',
        value: '0102',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '私密客户交易信息权限分配',
        value: '0101',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
    ], // 子类型
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
  },
  // 佣金调整
  commission: {
    pageName: '佣金调整',
    pageType: '02',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '佣金调整',
        value: '0201',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
          {
            show: true,
            label: '佣金待处理',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '批量佣金调整',
        value: '0202',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '资讯订阅',
        value: '0203',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '资讯退订',
        value: '0204',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
        ],
      },
    ],
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
  },
  // 合作合约
  contract: {
    pageName: '合作合约',
    pageType: '03',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '受限股解禁',
        value: '0301',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
    ],
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
    operationList: [
      {
        show: true,
        label: '订购',
        value: '1',
      }, {
        show: true,
        label: '退订',
        value: '2',
      },
    ],
    titleList: [
      {
        dataIndex: 'termsDisplayName',
        key: 'termsDisplayName',
        title: '条款名称',
      },
      {
        dataIndex: 'paraDisplayName',
        key: 'paraDisplayName',
        title: '明细参数',
      },
      {
        dataIndex: 'paraVal',
        key: 'paraVal',
        title: '值',
        width: 40,
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '合作部门',
      },
    ],
  },
  // 进行佣金调整子类型比对需要用到的数据
  comsubs: {
    noSelected: '', // 用户未选择子类型的情况
    single: '0201', // 单佣金调整
    batch: '0202', // 批量佣金调整
    subscribe: '0203', // 资讯订阅
    unsubscribe: '0204', // 资讯退订
  },
};

export default pageConfig;
