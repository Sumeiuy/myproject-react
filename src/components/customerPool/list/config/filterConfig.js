import React from 'react';
import _ from 'lodash';
import { Icon, Tooltip} from 'antd';
import BusinessOpenedMenu from '../../../common/htFilter/bussinessOpened/';

import styles from './filterConfig.less';
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

// 获取投资偏好指标说明
function getIndicatorDescription() {
  const content = (
    <div>
      <p>固收类：债券、货币市场基金、债券基金等固定收益类投资品种</p>
      <p>权益类：股票、混合型基金、偏股型基金、股票型基金等权益类投资品种</p>
      <p>期货和两融：期货、融资融券</p>
      <p>复杂或高风险产品：复杂或高风险金融产品</p>
      <p>其他产品：其他产品</p>
    </div>
  );
  return(<div className={styles.investphFooterWrapper}>
    <div className={styles.explainContent}>
      <Tooltip title={content} placement="right" overlayStyle={{ maxWidth: 460 }} >
        <span className={styles.explainIcon}><Icon type="exclamation-circle" className={styles.icon}/></span>
        <span className={styles.explainText}>指标说明</span>
      </Tooltip>
    </div>
  </div>);
}

const exported = {
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
        width: 186,
      },
    },
    {
      filterName: '风险等级',
      filterId: 'riskLevels',
      type: 'multi',
      dictField: 'custRiskBearing',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 186,
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
        width: 197,
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
        width: 252,
      },
    },
    {
      filterName: '年龄范围',
      filterId: 'age',
      type: 'range',
      unit: '岁',
      onlyNumber: true,
      unitStyle: {
        right: 8,
      },
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
        width: 252,
      },
    },

    // 客户属性
    {
      filterName: '高端产品户认定日期',
      filterId: 'highPrdtDt',
      type: 'date',
    },
    {
      filterName: '产品户认定日期',
      filterId: 'buyProdDt',
      type: 'date',
    },
    {
      filterName: '高净值户认定日期',
      filterId: 'gjzDt',
      type: 'date',
    },
    {
      filterName: '签约日期',
      filterId: 'tgSignDate',
      type: 'date',
    },
    {
      filterName: '有效户生效日期',
      filterId: 'validDt',
      type: 'date',
    },
    {
      filterName: '未完备信息',  // 过滤器中文名称
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
      filterName: '投资期限',
      filterId: 'investPeriod',
      dictField: 'investPeriodDictionary', // 过滤器数据在字典中对应的字段
      type: 'multi',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 197,
      },
    },
    {
      filterName: '投资偏好',
      filterId: 'investVariety',
      dictField: 'investVarietyDictionary', // 过滤器数据在字典中对应的字段
      type: 'single',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 250
      },
      menuFooter: getIndicatorDescription(),
    },
    {
      filterName: '可开通业务',
      filterId: 'unrights',
      type: 'multi',
      dictField: 'custUnrightBusinessType',
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 197,
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
        width: 276,
      },
      dictField: ['kPIDateScopeType', 'singleBusinessTypeList'],
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
        width: 197,
      },
    },

    // 账户属性
    {
      filterName: '激活日期',
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
        width: 186,
      },
    },

    // 交易

    {
      filterName: '佣金率',
      filterId: 'minFee',
      type: 'range',
      unit: '‰',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '公募基金购买金额',
      filterId: 'kfBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '私募基金购买金额',
      filterId: 'smBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '紫金产品购买金额',
      filterId: 'finaBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: 'OTC购买金额',
      filterId: 'otcBuyAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '基础股基交易量',
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
      filterName: '净利息额',
      filterId: 'netIncome',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '净佣金额',
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
        width: 252,
      },
    },
    {
      filterName: '持仓行业',
      filterId: 'primaryKeyIndustry',
      type: 'singleWithSearch',
      placeholder: '行业名称',
      dataList: ['props', 'industryList'],
      dataMap: ['induCode', 'induName'],
      needItemObj: true,
      dropdownStyle: {
        maxHeight: 324,
        overflowY: 'auto',
        width: 252,
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
      filterName: '资金余额（含信用）',
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
      filterName: '总市值（含信用）',
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
      filterName: '净转入资产',
      filterId: 'purFinAset',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '收益',
      filterId: 'pftAmt',
      type: 'amountRangeSelect',
      unit: '元',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '收益率',
      filterId: 'maxCostRate',
      type: 'amountRangeSelect',
      unit: '%',
      unitStyle: {
        right: 8,
      },
    },
    {
      filterName: '天天发份额',
      filterId: 'ttfMktVal',
      type: 'range',
      unit: '份',
      unitStyle: {
        right: 8,
      },
    },
  ],

  moreFilterData: [
    { value: '可开通业务', key: 'unrights' },
    { value: '开通业务', key: 'businessOpened' },
    { value: '客户等级', key: 'customerLevel' },
    { value: '激活日期', key: 'dateOpened' },
    { value: '账户状态', key: 'accountStatus' },
    { value: '佣金率', key: 'minFee' },
    { value: '持仓产品', key: 'primaryKeyPrdts' },
    { value: '持仓行业', key: 'primaryKeyIndustry' },
    { value: '总资产', key: 'totAset' },
    { value: '介绍人', key: 'devMngId' },
    { value: '年龄范围', key: 'age' },
    { value: '最近一次服务', key: 'lastServDt' },
    { value: '订购组合', key: 'primaryKeyJxgrps' },
    { value: '高端产品户认定日期', key: 'highPrdtDt' },
    { value: '产品户认定日期', key: 'buyProdDt' },
    { value: '高净值户认定日期', key: 'gjzDt' },
    { value: '签约日期', key: 'tgSignDate' },
    { value: '有效户生效日期', key: 'validDt' },
    { value: '未完备信息', key: 'completedRate' },
    { value: '公募基金购买金额', key: 'kfBuyAmt' },
    { value: '私募基金购买金额', key: 'smBuyAmt' },
    { value: '紫金产品购买金额', key: 'finaBuyAmt' },
    { value: 'OTC购买金额', key: 'otcBuyAmt' },
    { value: '基础股基交易量', key: 'gjAmt' },
    { value: '股基净佣金', key: 'gjPurRake' },
    { value: '净利息额', key: 'netIncome' },
    { value: '净佣金额', key: 'purRake' },
    { value: '产品净手续费', key: 'saleFare' },
    { value: '资金余额（含信用）', key: 'cashAmt' },
    { value: '普通可用资金', key: 'avlAmt' },
    { value: '信用可用资金', key: 'avlAmtCrdt' },
    { value: '总市值（含信用）', key: 'totMktVal' },
    { value: '归集率', key: 'gjlRate' },
    { value: '外部市值', key: 'outMktVal' },
    { value: '净转入资产', key: 'purFinAset' },
    { value: '收益', key: 'pftAmt' },
    { value: '收益率', key: 'maxCostRate' },
    { value: '天天发份额', key: 'ttfMktVal' },
    { value: '投资期限', key: 'investPeriod' },
    { value: '投资偏好', key: 'investVariety' },
  ],

  moreFilterCategories: [
    {
      type: '基本信息',
      children: [
        'devMngId',
        'age',
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
        'investPeriod',
        'investVariety',
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
        'primaryKeyIndustry',
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
        'pftAmt',
        'maxCostRate',
        'ttfMktVal',
      ],
    },
  ],
};

// 客户列表页面如果url里type是以下类型之一，则把值回填到搜索框
export const custListSearchTypes = ['NAME', 'SOR_PTY_ID', 'MOBILE', 'ID_NUM', 'ALL', 'STK_ACCTS'];

export default exported;

export const {
  basicFilters,
  moreFilters,
  moreFilterData,
  moreFilterCategories,
} = exported;
