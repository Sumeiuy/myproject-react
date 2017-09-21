/*
 * @fileOverview config/pageConfig.js
 * @author sunweibin
 * @description 用于设置合作合约、佣金调整、私密客户的page Type
 * 以及各个子类型和状态配置项
*/

const pageConfig = {
  // 权限分配
  permission: {
    pageType: '1', // 查询列表接口中的type值
    subType: [
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
  },
  // 佣金调整
  commission: {
    pageType: '2',
    subType: [
      {
        show: true,
        label: '佣金调整',
        value: '',
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
        value: '',
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
        value: '',
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
        value: '',
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
  },
  // 合作合约
  contract: {
    pageType: '3',
    subType: [
      {
        show: true,
        label: '限售股解禁',
        value: '',
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
  },
};

export default pageConfig;
