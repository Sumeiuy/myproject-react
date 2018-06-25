import React from 'react';
import _ from 'lodash';
import BusinessOpenedMenu from '../../../common/htFilter/bussinessOpened/';

function getBusinessOpenedFilterLabel(obj) {
  const findDateType = _.find(obj.data.dateType,
    item => item.key === obj.value[0]);
  const findBusinessType = _.find(obj.data.businessType,
    item => item.key === obj.value[1]);

  const prefix = findDateType ? findDateType.value : '';
  const postfix = findBusinessType ? findBusinessType.value : '不限';

  return (
    <span
      className="lego-formFilterValue"
      title={postfix}
    >
      <span className="lego-prefixValue">{`${prefix}${obj.filterName}:`}</span>
      <span className="lego-postfixValue">{`${postfix}`}</span>
    </span>
  );
}
export default {
  basicFilters: [
    {
      filterName: '客户性质',  // 过滤器中文名称
      filterId: 'customType', // 过滤器英文代号, 首字母小写
      type: 'single', // 过滤器类型
      dictField: 'custNature', // 过滤器数据在字典中对应的字段
    },
    {
      filterName: '客户类型',
      filterId: 'custClass',
      type: 'single',
      dictField: 'custType',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 184,
      },
    },
    {
      filterName: '风险等级',
      filterId: 'riskLvl',
      type: 'single',
      dictField: 'custRiskBearing',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 184,
      },
    },
    {
      filterName: '已开通业务',  // 过滤器中文名称
      filterId: 'rights', // 过滤器英文代号, 首字母小写
      type: 'multi', // 过滤器类型
      dictField: 'custBusinessType', // 过滤器数据在字典中对应的字段
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 195,
      },
    },
  ],
  moreFilters: [

    // 基本信息
    {
      filterName: '介绍人',
      filterId: 'devMngId',
      type: 'singleSearch',
      showSearch: true,
      placeholder: '工号或姓名',
      handleInputChange: 'handleDevMngFilterSearchChange',
      dataList: ['props', 'searchServerPersonList'],
      dataMap: ['ptyMngId', 'ptyMngName'],
      needItemObj: true,
      useLabelInValue: true,
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 250,
      },
    },
    {
      filterName: '年龄范围',
      filterId: 'birthDt',
      type: 'date',
    },

    // 服务
    {
      filterName: '最近一次服务',
      filterId: 'lastServDt',
      type: 'lastServiceDate',
    },
    {
      filterName: '订购组合',
      filterId: 'primaryKeyJxgrps',
      type: 'singleSearch',
      showSearch: true,
      placeholder: '产品代码或名称',
      handleInputChange: 'handleJxGroupProductSearchChange',
      dataList: ['props', 'jxGroupProductList'],
      dataMap: ['prodId', 'prodName'],
      needItemObj: true,
      useLabelInValue: true,
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 250,
      },
    },

    // 客户属性
    {
      filterName: '新增高端产品户',
      filterId: 'highPrdtDt',
      type: 'date',
    },
    {
      filterName: '新增产品户',
      filterId: 'buyProdDt',
      type: 'date',
    },
    {
      filterName: '新增高净值',
      filterId: 'gjzDt',
      type: 'date',
    },
    {
      filterName: '签约客户',
      filterId: 'tgSignDate',
      type: 'date',
    },
    {
      filterName: '新增有效户',
      filterId: 'validDt',
      type: 'date',
    },
    {
      filterName: '信息完备率',  // 过滤器中文名称
      filterId: 'completedRate', // 过滤器英文代号, 首字母小写
      type: 'multi', // 过滤器类型
      dictField: 'completenessRateList', // 过滤器数据在字典中对应的字段
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 195,
      },
    },
    {
      filterName: '可开通业务',
      filterId: 'unrights',
      type: 'multi',
      dictField: 'custUnrightBusinessType',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 195,
      },
    },
    {
      filterName: '开通业务',
      filterId: 'businessOpened',
      type: 'form',
      menuComponent: BusinessOpenedMenu,
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 274,
      },
      data: {
        dateType: [
          { key: '518003', value: '本月' },
          { key: '518004', value: '本季' },
          { key: '518005', value: '本年' },
        ],
        businessType: [
          // 原因是大数据不支持不限，但以后可能支持,如以后支持，添加即可
          /*  { key: 'all', value: '不限' }, */
          { key: 'ttfCust', value: '天天发' },
          { key: 'shHkCust', value: '沪港通' },
          { key: 'szHkCust', value: '深港通' },
          { key: 'rzrqCust', value: '融资融券' },
          { key: 'xsb', value: '新三板' },
          { key: 'optCust', value: '个股期权' },
          { key: 'cyb', value: '创业板' },
        ],
      },
      getFilterLabelValue: getBusinessOpenedFilterLabel,
    },
    {
      filterName: '客户等级',
      filterId: 'customerLevel',
      type: 'multi',
      dictField: 'custLevelList',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 195,
      },
    },

    // 账户属性
    {
      filterName: '开户日期',
      filterId: 'dateOpened',
      type: 'date',
    },
    {
      filterName: '账户状态',
      filterId: 'accountStatus',
      type: 'multi',
      dictField: 'accountStatusList',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 184,
      },
    },

    // 交易

    {
      filterName: '普通股基佣金率',
      filterId: 'minFee',
      type: 'range',
      unit: '‰',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '公募基金',
      filterId: 'kfBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '私募基金',
      filterId: 'smBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '紫金产品',
      filterId: 'finaBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: 'OTC',
      filterId: 'otcBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '股基交易量',
      filterId: 'gjAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '股基净佣金',
      filterId: 'gjPurRake',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '净利息收入',
      filterId: 'netIncome',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '净佣金',
      filterId: 'purRake',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '产品净手续费',
      filterId: 'saleFare',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '持仓产品',
      filterId: 'primaryKeyPrdts',
      type: 'singleSearch',
      showSearch: true,
      placeholder: '产品代码或名称',
      handleInputChange: 'handleProductFilterSearchChange',
      dataList: ['props', 'searchedProductList'],
      dataMap: ['name', 'aliasName'],
      needItemObj: true,
      useLabelInValue: true,
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 250,
      },
    },

    // 资产

    {
      filterName: '总资产',
      filterId: 'totAset',
      type: 'range',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '资金余额',
      filterId: 'cashAmt',
      type: 'range',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '普通可用资金',
      filterId: 'avlAmt',
      type: 'range',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '信用可用资金',
      filterId: 'avlAmtCrdt',
      type: 'range',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '总市值',
      filterId: 'totMktVal',
      type: 'range',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '归集率',
      filterId: 'gjlRate',
      type: 'range',
      unit: '%',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '外部市值',
      filterId: 'outMktVal',
      type: 'range',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '净转入',
      filterId: 'purFinAset',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
  ],
  moreFilterData: [
    { value: '可开通业务', key: 'unrights' },
    { value: '开通业务', key: 'businessOpened' },
    { value: '客户等级', key: 'customerLevel' },
    { value: '开户日期', key: 'dateOpened' },
    { value: '账户状态', key: 'accountStatus' },
    { value: '普通股基佣金率', key: 'minFee' },
    { value: '持仓产品', key: 'primaryKeyPrdts' },
    { value: '总资产', key: 'totAset' },
    { value: '介绍人', key: 'devMngId' },
    { value: '年龄范围', key: 'birthDt' },
    { value: '最近一次服务', key: 'lastServDt' },
    { value: '订购组合', key: 'primaryKeyJxgrps' },
    { value: '新增高端产品户', key: 'highPrdtDt' },
    { value: '新增产品户', key: 'buyProdDt' },
    { value: '新增高净值', key: 'gjzDt' },
    { value: '签约客户', key: 'tgSignDate' },
    { value: '新增有效户', key: 'validDt' },
    { value: '信息完备率', key: 'completedRate' },
    { value: '公募基金', key: 'kfBuyAmt' },
    { value: '私募基金', key: 'smBuyAmt' },
    { value: '紫金产品', key: 'finaBuyAmt' },
    { value: 'OTC', key: 'otcBuyAmt' },
    { value: '股基交易量', key: 'gjAmt' },
    { value: '股基净佣金', key: 'gjPurRake' },
    { value: '净利息收入', key: 'netIncome' },
    { value: '净佣金', key: 'purRake' },
    { value: '产品净手续费', key: 'saleFare' },
    { value: '资金余额', key: 'cashAmt' },
    { value: '普通可用资金', key: 'avlAmt' },
    { value: '信用可用资金', key: 'avlAmtCrdt' },
    { value: '总市值', key: 'totMktVal' },
    { value: '归集率', key: 'gjlRate' },
    { value: '外部市值', key: 'outMktVal' },
    { value: '净转入', key: 'purFinAset' },
  ],
  moreFilterCategories: [
    {
      type: '基本信息',
      children: [
        'devMngId',
        'birthDt',
      ],
    },
    {
      type: '服务',
      children: [
        'lastServDt',
        'primaryKeyJxgrps',
      ],
    },
    {
      type: '客户属性',
      children: [
        'unrights',
        'businessOpened',
        'customerLevel',
        'highPrdtDt',
        'buyProdDt',
        'gjzDt',
        'tgSignDate',
        'validDt',
        'completedRate',
      ],
    },
    {
      type: '账户属性',
      children: ['dateOpened', 'accountStatus'],
    },
    {
      type: '交易',
      children: [
        'minFee',
        'primaryKeyPrdts',
        'kfBuyAmt',
        'smBuyAmt',
        'finaBuyAmt',
        'otcBuyAmt',
        'gjAmt',
        'gjPurRake',
        'netIncome',
        'purRake',
        'saleFare',
      ],
    },
    {
      type: '资产',
      children: [
        'totAset',
        'cashAmt',
        'avlAmt',
        'avlAmtCrdt',
        'totMktVal',
        'gjlRate',
        'outMktVal',
        'purFinAset',
      ],
    },
  ],
};
