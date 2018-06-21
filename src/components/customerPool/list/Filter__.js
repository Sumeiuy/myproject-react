/**
 * @file components/customerPool/Filter.js
 *  客户池-客户列表筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import store from 'store';

import {
  SearchInput,
  NormalTag,
} from 'lego-react-filter/src';

import HtFilter, { TagFilter } from '../../common/htFilter';
import BusinessOpenedMenu from '../../common/htFilter/bussinessOpened/';
import { url, check } from '../../../helper';
import { seperator } from '../../../config';

import styles from './filter__.less';

const TAG_SIGN = 'TAG_SIGN';

const MORE_FILTER_STORAGE = 'MORE_FILTER_STORAGE';

const FILTER_SELECT_FROM_MOREFILTER = 'FILTER_SELECT_FROM_MOREFILTER';

const MORE_FILTER_TYPE = {
  more: 1,
  tag: 2,
};

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

// 初始化组件时，更新本地缓存
function UpdateLocalStorage(currentValue, moreFilterOpenedList) {
  let labelFilters = [];
  // 如果是瞄准镜标签下钻过来，清除瞄准镜标签子标签缓存
  if (!currentValue[TAG_SIGN]) {
    const labelList = [].concat(currentValue.primaryKeyLabels).filter(value => value);
    _.each(labelList, key => store.remove(key));
    if (!_.isEmpty(labelList)) {
      labelFilters = _.map(labelList, label => ({
        type: MORE_FILTER_TYPE.tag,
        key: label,
      }));
    }
    // 清除非固定过滤组件的打开记录缓存
    store.remove(MORE_FILTER_STORAGE);

    const moreFilters = _.map(moreFilterOpenedList, filter => ({
      type: MORE_FILTER_TYPE.more,
      key: filter,
    }));

    store.set(MORE_FILTER_STORAGE, _.compact([].concat(labelFilters, moreFilters)));
  }
}

// 客户标签组件交互时，更新本地缓存
function updateLocalLabelStorage(labels, key) {
  let nextMoreFilterListOpened = [];
  const moreFilterListOpened = store.get(MORE_FILTER_STORAGE);
  if (key === 'clearAll') {
    nextMoreFilterListOpened =
      _.filter(moreFilterListOpened, obj => obj.type === MORE_FILTER_TYPE.more);
  } else {
    const isChecked = _.some(labels, item => item === key);
    if (isChecked) {
      nextMoreFilterListOpened = _.concat(moreFilterListOpened, {
        type: MORE_FILTER_TYPE.tag,
        key,
      });
    } else {
      nextMoreFilterListOpened = _.filter(moreFilterListOpened, obj => obj.key !== key);
    }
  }

  store.set(MORE_FILTER_STORAGE, _.compact(nextMoreFilterListOpened));
}

// 点击清除时更新本地缓存
function updateLocalFilterStorage(key) {
  const moreFilterListOpened = store.get(MORE_FILTER_STORAGE);
  const nextMoreFilterListOpened = _.filter(moreFilterListOpened, obj => obj.key !== key);
  store.set(MORE_FILTER_STORAGE, _.compact(nextMoreFilterListOpened));
}

// 更多组件交互时，更新本地缓存
function updateLocalMoreFilterStorage(item) {
  let nextMoreFilterListOpened = [];
  const moreFilterListOpened = store.get(MORE_FILTER_STORAGE);

  if (item.key === 'clearAll') {
    nextMoreFilterListOpened =
      _.filter(moreFilterListOpened, obj => obj.type !== MORE_FILTER_TYPE.more);
  } else if (item.isDeleteFilterFromLocation) {
    nextMoreFilterListOpened = _.filter(moreFilterListOpened, obj => obj.key !== item.id);
  } else {
    nextMoreFilterListOpened = _.concat(moreFilterListOpened, {
      type: MORE_FILTER_TYPE.more,
      key: item.id,
    });
  }
  store.set(MORE_FILTER_STORAGE, _.compact(nextMoreFilterListOpened));
}

// 默认必须要显示的过滤器
const basicFilters = [
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
];

// 需要在更多里选择展示与否的过滤器
const moreFilters = [

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
];

// 更多按钮的菜单数据
const moreFilterData = [
  { value: '已开通业务', key: 'rights' },
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
];

const moreFilterCategories = [
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
      'rights',
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
];

export default class Filter extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    queryProduct: PropTypes.func.isRequired,
    clearProductData: PropTypes.func.isRequired,
    searchedProductList: PropTypes.array,
    clearJxGroupProductData: PropTypes.func.isRequired,
    queryJxGroupProduct: PropTypes.func.isRequired,
    jxGroupProductList: PropTypes.array,
    tagList: PropTypes.array,
    filtersOfAllSightingTelescope: PropTypes.array.isRequired,
    searchServerPersonList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    searchedProductList: [],
    tagList: [],
  }

  static contextTypes = {
    getSearchServerPersonList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { location } = props;
    const {
      filters = '',
    } = location.query;

    const currentValue = url.transfromFilterValFromUrl(filters);
    const moreFilterOpenedList = this.getMoreFilterOpenKeys(currentValue);
    UpdateLocalStorage(currentValue, moreFilterOpenedList);
    this.labelFilterVisible = false;
  }

  // 获取更多按钮里面需要打开的过滤器id
  @autobind
  getMoreFilterOpenKeys(currentValue) {
    return moreFilters
      .filter(
      item => _.some(_.keysIn(currentValue), key => key === item.filterId))
      .map(item => item.filterId);
  }

  // 获取对应filter的onChange函数
  @autobind
  getFilterOnChange(filter) {
    if (filter.filterId === 'devMngId') {
      return this.handleDevMngIdFilterChange;
    }
    if (filter.filterId === 'primaryKeyJxgrps') {
      return this.handleJxGroupProductChange;
    }
    switch (filter.type) {
      case 'single':
        return this.handleSingleFilterChange;
      case 'singleSearch':
        return this.handleSingleSearchFilterChange;
      case 'multi':
        return this.handleMultiFilterChange;
      case 'range':
        return this.handleRangeFilterChange;
      case 'form':
        return this.handleFormFilterChange;
      case 'date':
        return this.handleDateFilterChange;
      case 'lastServiceDate':
        return this.handleLastServiceDateChange;
      case 'amountRangeSelect':
        return this.handleAmountRangeSelectChange;
      default:
        return this.handleSingleFilterChange;
    }
  }

  @autobind
  getFilterOnClose(filter) {
    const onCloseFn = () => this.handleCloseFilter({ name: filter.filterId });
    return onCloseFn;
  }

  @autobind
  getFilterData(dict, filter) {
    if (filter.dataList) {
      return this[filter.dataList[0]][filter.dataList[1]];
    } else if (filter.dictField) {
      return dict[filter.dictField];
    }
    return filter.data;
  }

  // 区分是否是从更多里面打开filter，从而控制filter菜单的默认打开
  selectFilterIdFromMore = '';
  labelFilter = '';

  @autobind
  handleSingleFilterChange(obj) {
    this.props.onFilterChange({
      name: obj.id,
      value: obj.value,
    });
  }

  @autobind
  handleSingleSearchFilterChange({ id, value }) {
    const renderValue = _.join([value.name, value.aliasName], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  handleProductFilterSearchChange(value) {
    const emptyData = [];
    if (!_.isEmpty(value)) {
      this.props.queryProduct({
        keyword: value,
      });
    } else {
      this.props.clearProductData(emptyData);
    }
  }

  @autobind
  handleDevMngIdFilterChange({ id, value }) {
    const renderValue = _.join([value.ptyMngId, value.ptyMngName], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  handleDevMngFilterSearchChange(value) {
    if (!_.isEmpty(value)) {
      this.context.getSearchServerPersonList(value);
    }
  }

  @autobind
  handleJxGroupProductChange({ id, value }) {
    const renderValue = _.join([value.prodId, value.prodName], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  handleJxGroupProductSearchChange(value) {
    const emptyData = [];
    if (!_.isEmpty(value)) {
      this.props.queryJxGroupProduct({
        keyword: value,
      });
    } else {
      this.props.clearJxGroupProductData(emptyData);
    }
  }

  @autobind
  handleLastServiceDateChange({ id, value }) {
    const renderValue = _.join([value.date, value.radioValue], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  handleAmountRangeSelectChange({ id, value }) {
    const renderValue =
      _.join([value.dateType, value.min, value.max], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  handleMultiFilterChange(obj) {
    const value = _.join(obj.value, seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: obj.id,
      value,
    });
  }

  @autobind
  handleRangeFilterChange(obj) {
    const value = _.join(obj.value, seperator.filterValueSeperator);

    this.props.onFilterChange({
      name: obj.id,
      value,
    });
  }

  @autobind
  handleFormFilterChange(obj) {
    const valueArray = [];
    valueArray.push(obj.value.dateType);
    valueArray.push(obj.value.businessType);
    const value = valueArray.join(seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: obj.id,
      value,
    });
  }

  @autobind
  handleDateFilterChange(obj) {
    const value = _.join(obj.value, seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: obj.name,
      value,
    });
  }

  @autobind
  handleLabelChange(obj, key) {
    updateLocalLabelStorage(obj.value, key);
    this.labelFilter = key;
    store.remove(key);
    const value = _.join(obj.value, seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: obj.id,
      value,
    });
  }

  @autobind
  handleNormalfiterClose(id, labels) {
    const labelList = [].concat(labels);
    const value = _.join(_.filter(labelList, item => item !== id), seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: 'primaryKeyLabels',
      value,
    });

    updateLocalFilterStorage(id);

    store.remove(id);
  }

  @autobind
  handleTagfilterChange(value) {
    const { id } = value;
    store.remove(id);
    store.set(id, value.value);
    this.props.onFilterChange({
      name: TAG_SIGN,
      value: _.random(1, 1000000),
    });
  }

  @autobind
  handleMoreFilterChange(obj) {
    updateLocalMoreFilterStorage(obj);
    if (obj.key === 'clearAll') {
      this.props.onFilterChange({
        name: obj.id,
        value: obj.value,
        clearAllMoreFilters: true,
      });
    } else {
      this.selectFilterIdFromMore = obj.id;
      this.props.onFilterChange({
        name: obj.id,
        value: obj.value,
      }, obj.isDeleteFilterFromLocation);

      if (!obj.isDeleteFilterFromLocation) {
        store.set(FILTER_SELECT_FROM_MOREFILTER, true);
      }
    }
  }

  @autobind
  handleCloseFilter({ name }) {
    updateLocalFilterStorage(name);
    this.props.onFilterChange({
      name,
      value: '',
    }, true); // true表示从loaction上面删除该filter字段
  }

  @autobind
  findFiltersOfLabel(filter, filtersOfAllSightingTelescope) {
    const filterObj = _.find(filtersOfAllSightingTelescope, item => item.key === filter.id);
    if (filterObj && filterObj.list) {
      return filterObj.list.filterList;
    }

    return null;
  }

  @autobind
  splitLabelList(label, filters) {
    const { tagList } = this.props;
    const labelList = [].concat(label).filter(value => value);
    const normalTag = _.filter(labelList, key => !check.isSightingTelescope(key));
    const tagFilters = _.filter(
      labelList, (key) => {
        if (check.isSightingTelescope(key)) {
          const filter = _.find(filters, item => item.key === key);
          if (!filter) {
            return false;
          } else if (_.isEmpty(filter.list)) {
            normalTag.push(key);
            return false;
          }
          return true;
        }
        return false;
      });

    const normalTagList = _.map(normalTag, tag => _.find(tagList, item => item.id === tag));
    const tagFilterList = _.map(tagFilters, tag => _.find(tagList, item => item.id === tag));

    return {
      normalTagList,
      tagFilterList,
    };
  }

  @autobind
  renderMoreFilter(obj, moreFilterList, splitLabelList, currentValue) {
    let renderItem;
    if (obj.type === MORE_FILTER_TYPE.more) {
      renderItem = _.find(moreFilterList, filter => filter.filterId === obj.key);
      return renderItem ?
        (
          <HtFilter
            key={renderItem.filterId}
            className={styles.filter}
            value={currentValue[renderItem.filterId]}
            data={this.getFilterData(this.props.dict, renderItem)}
            onChange={this.getFilterOnChange(renderItem)}
            onInputChange={this[renderItem.handleInputChange]}
            onClose={this.getFilterOnClose(renderItem)}
            isCloseable
            defaultVisible={renderItem.filterId === this.selectFilterIdFromMore}
            {...renderItem}
          />
        ) : null;
    }

    renderItem = _.find(splitLabelList.normalTagList, filter => filter.id === obj.key);

    if (renderItem) {
      return (
        <NormalTag
          className={styles.filter}
          key={renderItem.id}
          filterName={renderItem.name}
          filterId={renderItem.id}
          onClose={
            () =>
              this.handleNormalfiterClose(renderItem.id, currentValue.primaryKeyLabels)
          }
        />
      );
    }

    renderItem = _.find(splitLabelList.tagFilterList, filter => filter.id === obj.key);

    let tagfilters;

    if (renderItem) {
      tagfilters = this.findFiltersOfLabel(renderItem, this.props.filtersOfAllSightingTelescope);
    }

    return tagfilters && renderItem ? (
      <TagFilter
        className={styles.filter}
        key={renderItem.id}
        filterName={renderItem.name}
        filterId={renderItem.id}
        defaultVisible={this.labelFilterVisible && renderItem.id === this.labelFilter}
        value={store.get(renderItem.id) || []}
        data={tagfilters}
        onChange={this.handleTagfilterChange}
        onClose={
          () =>
            this.handleNormalfiterClose(renderItem.id, currentValue.primaryKeyLabels)
        }
      />) : null;
  }

  @autobind
  renderMoreFilters(selectedKeys, currentValue) {
    const { filtersOfAllSightingTelescope } = this.props;
    // 按照是否有子标签分类渲染
    const splitLabelList =
      this.splitLabelList(currentValue.primaryKeyLabels, filtersOfAllSightingTelescope);

    const moreFilterListOpened = store.get(MORE_FILTER_STORAGE);

    const filters = (
      <div className={styles.moreFilter}>
        {
          _.map(moreFilterListOpened,
            obj => this.renderMoreFilter(obj, moreFilters, splitLabelList, currentValue))
        }
      </div>
    );

    // 每次渲染完还原该值
    this.selectFilterIdFromMore = '';
    this.labelFilterVisible = true;

    return filters;
  }

  render() {
    const { dict, location } = this.props;
    const {
      filters = '',
    } = location.query;

    const currentValue = url.transfromFilterValFromUrl(filters);
    const keyword = currentValue.searchText;

    const selectedKeys = this.getMoreFilterOpenKeys(currentValue);

    return (
      <div className={styles.filterContainer}>
        <div className={styles.normalFilter}>
          {
            <SearchInput
              className={styles.filter}
              iconStyle={{ top: 13, right: 13 }}
              defaultValue={keyword}
              placeholder="搜索关键字"
            />
          }
          {
            basicFilters.map(filter => (
              <HtFilter
                key={filter.filterId}
                className={styles.filter}
                value={currentValue[filter.filterId]}
                data={dict[filter.dictField]}
                onChange={this.getFilterOnChange(filter)}
                {...filter}
              />
            ))
          }
          {
            !_.isEmpty(this.props.tagList) ?
              <HtFilter
                type="multiSearch"
                className={styles.filterfixRight}
                filterName="标签条件"
                filterId="primaryKeyLabels"
                value={currentValue.primaryKeyLabels}
                data={this.props.tagList}
                dataMap={['id', 'name']}
                dropdownStyle={{
                  maxHeight: 324,
                  overflowY: 'auto',
                  width: 210,
                }}
                onChange={this.handleLabelChange}
                iconMore
                disableTitle
                isMoreButton
              /> : null
          }
          <HtFilter
            type="moreSearch"
            filterName="更多条件"
            className={styles.filterfixEnd}
            value={selectedKeys}
            dropdownStyle={{
              position: 'relactive',
              maxHeight: 324,
              overflowY: 'auto',
              width: 210,
              zIndex: 10,
            }}
            data={moreFilterData}
            dataCategories={moreFilterCategories}
            onChange={this.handleMoreFilterChange}
          />
        </div>
        {this.renderMoreFilters(selectedKeys, currentValue)}
      </div>
    );
  }
}
