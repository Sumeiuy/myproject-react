/**
 * @file components/customerPool/Filter.js
 *  客户池-客户列表筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import styles from './filter.less';

import HtFilter, {
  Input,
  MoreFilter,
} from '../../common/htFilter';

import BusinessOpenedMenu from '../../common/htFilter/bussinessOpened/';

// 从搜索、联想词、标签、已开通业务过来的
/* const SEARCH_TAG_FILTER = [
  'search', 'tag', 'association', 'business', 'custIndicator',
  'numOfCustOpened', 'sightingTelescope', 'external',
]; */

// 数据转化
// [{itemCode: '1', itemDesc: 'fg'}] => [{key: '1', value: 'fg'}]
/* const transformData = list => _.map(list, item => _.mapKeys(item, (value, key) => {
  if (key === 'itemCode') {
    return 'key';
  }
  if (key === 'itemDesc') {
    return 'value';
  }
  return key;
})); */

function getBusinessOpenedFilterLabel(obj) {
  const findDateType = _.find(obj.data.dateType,
    item => item.key === obj.value[0]);
  const findBusinessType = _.find(obj.data.businessType,
    item => item.key === obj.value[1]);

  const prefix = findDateType ? findDateType.value : '';
  const postfix = findBusinessType ? findBusinessType.value : '不限';

  return (
    <span
      className="formFilterValue"
      title={postfix}
    >
      <span className="prefixValue">{`${prefix}${obj.filterName}:`}</span>
      <span className="postfixValue">{`${postfix}`}</span>
    </span>
  );
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
  {
    filterName: '客户标签',
    filterId: 'primaryKeyLabels',
    type: 'multi',
    dropdownStyle: {
      maxHeight: 324,
      overflowY: 'auto',
      width: 184,
    },
    showSearch: true,
    disabled: true,
  },
];

// 需要在更多里选择展示与否的过滤器,配置顺序需要与更多菜单一致
const moreFilters = [

  // 客户属性
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
        { key: 'optCust', value: '股票期权' },
        { key: 'cyb', value: '创业板' },
      ],
    },
    getFilterValue: getBusinessOpenedFilterLabel,
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
    filterName: '持仓产品',
    filterId: 'primaryKeyPrdts',
    type: 'singleSearch',
    showSearch: true,
    placeholder: '产品代码或名称',
    handleInputChange: 'handleProductFilterSearchChange',
    optionListProp: ['props', 'searchedProductList'],
    isReturnItems: true,
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
];

// 更多按钮的菜单数据，配置顺序需要与上面的一致
const moreFilterData = [
  {
    value: '客户属性',
    children: [
      { value: '已开通业务', key: 'rights' },
      { value: '可开通业务', key: 'unrights' },
      { value: '开通业务', key: 'businessOpened' },
      { value: '客户等级', key: 'customerLevel' },
    ],
  },
  {
    value: '账户属性',
    children: [
      { value: '开户日期', key: 'dateOpened' },
      { value: '账户状态', key: 'accountStatus' },
    ],
  },
  {
    value: '交易',
    children: [
      { value: '普通股基佣金率', key: 'minFee' },
      { value: '持仓产品', key: 'primaryKeyPrdts' },
    ],
  },
  {
    value: '资产',
    children: [
      { value: '总资产', key: 'totAset' },
    ],
  },
];

// 将url上面的filter编码解析为对象
function transfromFilterValFromUrl(filters) {
  // 处理由‘|’分隔的多个过滤器
  const filtersArray = filters ? filters.split('|') : [];

  return _.reduce(filtersArray, (result, value) => {
    const [name, code] = value.split('.');
    let filterValue = code;

    // 如果是多选，需要继续处理','分割的多选值
    if (code.indexOf(',') > -1) {
      filterValue = code.split(',');
    }

    // 如果对应的过滤器是普通股基佣金率
    result[name] = filterValue; // eslint-disable-line
    return result;
  }, {});
}


export default class Filter extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    queryProduct: PropTypes.func.isRequired,
    searchedProductList: PropTypes.array,
  }

  static defaultProps = {
    searchedProductList: [],
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
      default:
        return this.handleSingleFilterChange;
    }
  }

  @autobind
  getFilterOnClose(filter) {
    const onCloseFn = () => this.handleCloseFilter({ name: filter.filterId });
    return onCloseFn;
  }

  // 区分是否是从更多里面打开filter，从而控制filter菜单的默认打开
  selectFilterIdFromMore = '';

  @autobind
  handleSingleFilterChange(obj) {
    this.props.onFilterChange({
      ...obj,
    });
  }

  @autobind
  handleSingleSearchFilterChange({ name, value }) {
    const renderValue = _.join([value.key, value.value], ',');
    this.props.onFilterChange({
      name,
      value: renderValue,
    });
  }

  @autobind
  handleProductFilterSearchChange(value) {
    if (!_.isEmpty(value)) {
      this.props.queryProduct({
        keyword: value,
      });
    }
  }

  @autobind
  handleMultiFilterChange(obj) {
    const value = _.join(obj.value, ',');
    this.props.onFilterChange({
      name: obj.name,
      value,
    });
  }

  @autobind
  handleRangeFilterChange(obj) {
    const value = _.join(obj.value, ',');
    this.props.onFilterChange({
      name: obj.name,
      value,
    });
  }

  @autobind
  handleFormFilterChange(obj) {
    const valueArray = [];
    valueArray.push(obj.value.dateType);
    valueArray.push(obj.value.businessType);
    const value = valueArray.join(',');
    this.props.onFilterChange({
      name: obj.name,
      value,
    });
  }

  @autobind
  handleDateFilterChange(obj) {
    const value = _.join(obj.value, ',');
    this.props.onFilterChange({
      name: obj.name,
      value,
    });
  }

  @autobind
  handleMoreFilterChange(obj) {
    this.selectFilterIdFromMore = obj.name;

    // 对于开通业务，目前在更多菜单打开，需要提供默认值
    // 原因是大数据不支持不限，但以后可能支持
    // 如以后要支持，删除这段代码即可
    if (obj.name === 'businessOpened') {
      this.props.onFilterChange({
        name: obj.name,
        value: ['518003', 'ttfCust'].join(','),
      }, obj.isDeleteFilterFromLocation);
    } else {
      this.props.onFilterChange({
        name: obj.name,
        value: obj.value,
      }, obj.isDeleteFilterFromLocation);
    }
  }

  @autobind
  handleCloseFilter({ name }) {
    this.props.onFilterChange({
      name,
      value: '',
    }, true); // true表示从loaction上面删除该filter字段
  }

  /* 瞄准镜筛选
    @autobind
    renderSightingTelescopeFilter() {
      const {
        location: { query: { source, filters } },
        sightingTelescopeFilters,
      } = this.props;
      if (source !== 'sightingTelescope' ||
        _.isEmpty(sightingTelescopeFilters) || _.isEmpty(sightingTelescopeFilters.filterList)) {
        return null;
      }
      const filtersArray = filters ? filters.split('|') : [];
      return _.map(sightingTelescopeFilters.filterList, (obj) => {
        const target = _.find(filtersArray, (item) => {
          const [name] = item.split('.');
          return name === obj.filterCode;
        });
        const backfillValue = (target || '').split('.')[1] || '';
        return (<SingleFilter
          className={styles.filter}
          key={obj.filterCode}
          value={backfillValue}
          filterName={obj.filterDesc}
          filterId={obj.filterCode}
          data={transformData(obj.items)}
          onChange={this.handleSingleFilterChange}
        />);
      });
    }
  */

  @autobind
  renderMoreFilters(selectedKeys, currentValue) {
    const { dict } = this.props;
    const filters = (
      <div className="moreFilter">
        {moreFilters.map(filter => (
          (_.includes(selectedKeys, filter.filterId)) ?
            <HtFilter
              key={filter.filterId}
              className={styles.filter}
              value={currentValue[filter.filterId]}
              data={dict[filter.dictField]}
              onChange={this.getFilterOnChange(filter)}
              onInputChange={this[filter.handleInputChange]}
              optionList={
                filter.optionListProp ?
                  this[filter.optionListProp[0]][filter.optionListProp[1]] : null
              }
              onClose={this.getFilterOnClose(filter)}
              isCloseable
              defaultVisible={filter.filterId === this.selectFilterIdFromMore}
              {...filter}
            /> : null))
          }
      </div>
    );

    // 每次渲染完还原该值
    this.selectFilterIdFromMore = '';

    return filters;
  }

  render() {
    const { dict, location } = this.props;
    const {
      source,
      filters = '',
      q,
    } = location.query;

    const currentValue = transfromFilterValFromUrl(filters);

    // console.log('--------------------------------------currentValue', currentValue);

    const selectedKeys = this.getMoreFilterOpenKeys(currentValue);

    const defaultOpenKeys = moreFilterData.map(obj => obj.value);

    return (
      <div>
        <div className="normalFilter">
          {
            <Input
              className={styles.filter}
              defaultValue={source === 'serach' ? decodeURIComponent(q) : ''}
              placeholder="两融潜在客户"
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
          <MoreFilter
            className={styles.filter}
            selectedKeys={selectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            dropdownStyle={{
              position: 'relactive',
              maxHeight: 324,
              overflowY: 'auto',
              width: 184,
              zIndex: 10,
            }}
            data={moreFilterData}
            onChange={this.handleMoreFilterChange}
          />
        </div>
        {this.renderMoreFilters(selectedKeys, currentValue)}
      </div>
    );
  }
}
