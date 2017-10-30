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
  // 通道类型协议
  channelsTypeProtocol: {
    pageName: '通道类型协议',
    pageType: '04',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '高速通道类协议',
        value: '0401',
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
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
          }, {
            show: true,
            label: '协议退订',
            value: '2',
          }, {
            show: true,
            label: '协议续订',
            value: '3',
          },
        ],
      },
      {
        show: true,
        label: '紫金快车道协议',
        value: '0402',
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
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
          }, {
            show: true,
            label: '协议退订',
            value: '2',
          }, {
            show: true,
            label: '协议续订',
            value: '3',
          }, {
            show: true,
            label: '新增或删除下挂客户',
            value: '4',
          },
        ],
      },
      {
        show: true,
        label: '套利软件',
        value: '0403',
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
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
          },
        ],
      },
      {
        show: true,
        label: '期权软件',
        value: '0404',
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
        operationList: [
          {
            show: true,
            label: '协议订购',
            value: '1',
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
    operateType: [
      {
        show: true,
        label: '协议订购',
        value: '1',
      },
      {
        show: true,
        label: '协议退订',
        value: '2',
      },
      {
        show: true,
        label: '协议续订',
        value: '3',
      },
      {
        show: true,
        label: '新增或删除下挂客户',
        value: '4',
      },
    ],
    businessType: [
      {
        show: true,
        label: '开通权限',
        value: '1',
      }, {
        show: true,
        label: '开通软件',
        value: '2',
      }, {
        show: true,
        label: '开通软件+权限',
        value: '3',
      }, {
        show: true,
        label: '软件续用',
        value: '4',
      }, {
        show: true,
        label: '套利软件',
        value: '5',
      },
    ],
    protocolProductTitleList: [
      {
        dataIndex: 'termsDisplayName',
        key: 'termsDisplayName',
        title: '产品代码',
      },
      {
        dataIndex: 'paraDisplayName',
        key: 'paraDisplayName',
        title: '产品名称',
      },
      {
        dataIndex: 'paraVal',
        key: 'paraVal',
        title: '产品类型',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '子类型',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '风险是否匹配',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '期限是否匹配',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '投资品种是否匹配',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '签署确认书类型',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '价格',
      },
    ],
    protocolClauseTitleList: [
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
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '前提条件',
      },
      {
        dataIndex: 'divName',
        key: 'divName',
        title: '未来承诺',
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
