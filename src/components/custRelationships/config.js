/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系申请的配置文件
 * @Date: 2018-06-08 13:32:19
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-14 09:13:23
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
      dataIndex: 'relationTypeLable',
      key: 'relationTypeLable',
      width: 120,
    },
    {
      title: '关联关系名称',
      dataIndex: 'relationNameLable',
      key: 'relationNameLable',
      width: 150,
    },
    {
      title: '关联关系子类型',
      dataIndex: 'relationSubTypeLable',
      key: 'relationSubTypeLable',
      width: 130,
    },
    {
      title: '关系人名称',
      dataIndex: 'partyName',
      key: 'partyName',
      onCell() {
        return {
          className: 'associateRelationTableCell',
        };
      },
    },
    {
      title: '关系人证件类型',
      dataIndex: 'partyIDTypeLable',
      key: 'partyIDTypeLable',
      width: 140,
    },
    {
      title: '关系人证件号码',
      dataIndex: 'partyIDNum',
      key: 'partyIDNum',
      width: 180,
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
  // 是否办理股票质押回购业务Select下拉选项
  StockRepurchaseOptions: [
    {
      value: '',
      label: '--请选择--',
    },
    {
      value: 'Y',
      label: '是',
    },
    {
      value: 'N',
      label: '否',
    },
  ],
  // 社会统一信用证号码 RegExp
  socialNumRegExp: /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/,
  // 18位身份证号码 RegExp
  eighteenIDRegExp: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  // 15位身份证号码 RegExp
  fifteenIDRegExp: /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/,
  // 其余之校验是否字母数字
  otherIDRegExp: /^[A-Za-z0-9]+$/,
  // 身份证类型Code
  IDCardTypeCode: '103100',
  // 社会统一信用证Code
  socialCardTypeCode: '103270',
  // 客户婚姻状态为已婚的Code
  marriagedCode: '108020',
  // 家庭关系Code
  familyRelationCode: '127110',
  // 夫妻类型Code
  fuqiTypeCode: '127111',
  // 普通机构-实际控制人
  realControllerTypeCode: '127151',
  // 产品客户-产品管理人
  productManagerTypeCode: '127371',
};

export default config;
