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
import { NormalTag } from 'lego-react-filter/src';


import logable from '../../../decorators/logable';
import HtFilter, { TagFilter } from '../../common/htFilter';
import { url, check } from '../../../helper';
import { seperator } from '../../../config';

import {
  basicFilters,
  moreFilterData,
  moreFilterCategories,
  moreFilters,
} from './config/filterConfig';

import styles from './filter__.less';

const TAG_SIGN = 'TAG_SIGN';

const MORE_FILTER_TYPE = {
  more: 1,
  tag: 2,
};

// 初始化组件时，更新本地缓存
function UpdateLocalStorage(currentValue, moreFilterOpenedList, hashString) {
  let labelFilters = [];
  // 如果是瞄准镜标签下钻过来，清除瞄准镜标签子标签缓存
  if (!currentValue[TAG_SIGN]) {
    const labelList = [].concat(currentValue.primaryKeyLabels).filter(value => value);
    _.each(labelList, key => store.remove(`${key}_${hashString}`));
    if (!_.isEmpty(labelList)) {
      labelFilters = _.map(labelList, label => ({
        type: MORE_FILTER_TYPE.tag,
        key: label,
      }));
    }
    // 清除非固定过滤组件的打开记录缓存
    store.remove(`MORE_FILTER_STORAGE_${hashString}`);

    const moreFiltersList = _.map(moreFilterOpenedList, filter => ({
      type: MORE_FILTER_TYPE.more,
      key: filter,
    }));

    store.set(`MORE_FILTER_STORAGE_${hashString}`, _.compact([].concat(labelFilters, moreFiltersList)));
  }
}

// 客户标签组件交互时，更新本地缓存
function updateLocalLabelStorage(labels, key, hashString) {
  let nextMoreFilterListOpened = [];
  const moreFilterListOpened = store.get(`MORE_FILTER_STORAGE_${hashString}`);
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

  store.set(`MORE_FILTER_STORAGE_${hashString}`, _.compact(nextMoreFilterListOpened));
}

// 点击清除时更新本地缓存
function updateLocalFilterStorage(key, hashString) {
  const moreFilterListOpened = store.get(`MORE_FILTER_STORAGE_${hashString}`);
  const nextMoreFilterListOpened = _.filter(moreFilterListOpened, obj => obj.key !== key);
  store.set(`MORE_FILTER_STORAGE_${hashString}`, _.compact(nextMoreFilterListOpened));
}

// 更多组件交互时，更新本地缓存
function updateLocalMoreFilterStorage(item, hashString) {
  let nextMoreFilterListOpened = [];
  const moreFilterListOpened = store.get(`MORE_FILTER_STORAGE_${hashString}`);

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
  store.set(`MORE_FILTER_STORAGE_${hashString}`, _.compact(nextMoreFilterListOpened));
}

export default class Filter extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    queryProduct: PropTypes.func.isRequired,
    clearProductData: PropTypes.func.isRequired,
    clearSearchPersonList: PropTypes.func.isRequired,
    searchedProductList: PropTypes.array,
    clearJxGroupProductData: PropTypes.func.isRequired,
    queryJxGroupProduct: PropTypes.func.isRequired,
    jxGroupProductList: PropTypes.array,
    tagList: PropTypes.array,
    filtersOfAllSightingTelescope: PropTypes.array.isRequired,
    getFiltersOfSightingTelescopeSequence: PropTypes.func.isRequired,
    searchServerPersonList: PropTypes.array.isRequired,
    getSearchPersonList: PropTypes.func.isRequired,
    hashString: PropTypes.string.isRequired,
  }

  static defaultProps = {
    searchedProductList: [],
    jxGroupProductList: [],
    tagList: [],
  }

  static contextTypes = {
    getSearchServerPersonList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { location, hashString } = props;
    const {
      filters = '',
    } = location.query;

    const currentValue = url.transfromFilterValFromUrl(filters);
    const moreFilterOpenedList = this.getMoreFilterOpenKeys(currentValue);
    UpdateLocalStorage(currentValue, moreFilterOpenedList, hashString);
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
      if (filter.filterId === 'businessOpened') {
        return {
          dateType: dict[filter.dictField[0]],
          businessType: dict[filter.dictField[1]],
        };
      }
      return dict[filter.dictField];
    }
    return filter.data;
  }

  // 区分是否是从更多里面打开filter，从而控制filter菜单的默认打开
  selectFilterIdFromMore = '';
  // 区分是否从标签条件里面打开标签， 从而控制标签菜单的默认打开
  labelFilter = '';

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].name',
      value: '$args[0].value',
    },
  })
  handleSingleFilterChange(obj) {
    this.props.onFilterChange({
      name: obj.id,
      value: obj.value,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '持仓产品',
      value: '$args[0].value.aliasName',
    },
  })
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户筛选-介绍人',
      value: '$args[0].value.ptyMngName',
    },
  })
  handleDevMngIdFilterChange({ id, value }) {
    const renderValue = _.join([value.ptyMngId, value.ptyMngName], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  handleDevMngFilterSearchChange(value) {
    const emptyData = [];
    if (!_.isEmpty(value)) {
      this.props.getSearchPersonList({
        keyword: value,
        pageSize: 10,
        pageNum: 1,
      });
    } else {
      this.props.clearSearchPersonList(emptyData);
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户筛选-订购组合',
      value: '$args[0].value.prodName',
    },
  })
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户筛选-最后一次服务',
      date: '$args[0].value.date',
      radioValue: '$args[0].value.radioValue',
    },
  })
  handleLastServiceDateChange({ id, value }) {
    const renderValue = _.join([value.date, value.radioValue], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].filterName',
      dateType: '$args[0].value.dateType',
      min: '$args[0].value.min',
      max: '$args[0].value.max',
    },
  })
  handleAmountRangeSelectChange({ id, value }) {
    const renderValue =
      _.join([value.dateType, value.min, value.max], seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: id,
      value: renderValue,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].name',
      value: '$args[0].value',
    },
  })
  handleMultiFilterChange(obj) {
    const value = _.join(obj.value, seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: obj.id,
      value,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].name',
      value: '$args[0].value',
    },
  })
  handleRangeFilterChange(obj) {
    const value = _.join(obj.value, seperator.filterValueSeperator);

    this.props.onFilterChange({
      name: obj.id,
      value,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '开通业务',
      dateType: '$args[0].value.dateType',
      businessType: '$args[0].value.businessType',
    },
  })
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].filterName',
      value: '$args[0].value',
    },
  })
  handleDateFilterChange(obj) {
    const value = _.join(obj.value, seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: obj.name,
      value,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].name',
      value: '$args[0].value',
    },
  })
  handleLabelChange(obj, key) {
    const { hashString } = this.props;
    updateLocalLabelStorage(obj.value, key, hashString);
    this.labelFilter = key;
    store.remove(`${key}_${hashString}`);
    const sightingTelescopeList = this.checkPrimaryKeyLabel(obj.value);
    this.props.getFiltersOfSightingTelescopeSequence({ sightingTelescopeList });
    const value = _.join(obj.value, seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: obj.id,
      value,
    });
  }

  @autobind
  checkPrimaryKeyLabel(primaryKeyLabels) {
    const labelList = []
      .concat(primaryKeyLabels)
      .filter(item => item && check.isSightingTelescope(item));

    return labelList;
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '标签-关闭',
      value: '$args[0]',
    },
  })
  handleNormalfiterClose(id, labels) {
    const { hashString } = this.props;
    const labelList = [].concat(labels);
    const value = _.join(_.filter(labelList, item => item !== id), seperator.filterValueSeperator);
    this.props.onFilterChange({
      name: 'primaryKeyLabels',
      value,
    });
    updateLocalFilterStorage(id, hashString);

    store.remove(`${id}_${hashString}`);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].name',
      value: '',
    },
  })
  handleTagfilterChange(value) {
    const { id } = value;
    const { hashString } = this.props;
    store.remove(`${id}_${hashString}`);
    store.set(`${id}_${hashString}`, value.value);
    this.props.onFilterChange({
      name: TAG_SIGN,
      value: _.random(1, 1000000),
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户筛选-更多条件',
      value: '$args[0].id',
    },
  })
  handleMoreFilterChange(obj) {
    const { hashString } = this.props;
    updateLocalMoreFilterStorage(obj, hashString);
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
        store.set(`FILTER_SELECT_FROM_MOREFILTER_${hashString}`, true);
      }
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户筛选-关闭过滤条件',
      value: '$args[0].name',
    },
  })
  handleCloseFilter({ name }) {
    updateLocalFilterStorage(name, this.props.hashString);
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

    const normalTagList =
      _.compact(_.map(normalTag, tag => _.find(tagList, item => item.id === tag)));
    const tagFilterList =
      _.compact(_.map(tagFilters, tag => _.find(tagList, item => item.id === tag)));

    return {
      normalTagList,
      tagFilterList,
    };
  }

  @autobind
  clearSelectFilterMemory() {
    // 每次渲染完还原该值
    this.selectFilterIdFromMore = '';
    this.labelFilterVisible = true;
  }

  @autobind
  renderMoreFilter(obj, moreFilterList, splitLabelList, currentValue) {
    let renderItem;
    const { hashString } = this.props;
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
        value={store.get(`${renderItem.id}_${hashString}`) || []}
        data={tagfilters}
        onChange={this.handleTagfilterChange}
        onClose={
          () =>
            this.handleNormalfiterClose(renderItem.id, currentValue.primaryKeyLabels)
        }
      />) : null;
  }

  render() {
    const {
      dict,
      location,
      filtersOfAllSightingTelescope,
      hashString,
    } = this.props;
    const {
      filters = '',
    } = location.query;

    const currentValue = url.transfromFilterValFromUrl(filters);

    const moreFilterListOpened = store.get(`MORE_FILTER_STORAGE_${hashString}`);

    const selectedKeys = this.getMoreFilterOpenKeys(currentValue);

    // 按照是否有子标签分类渲染
    const splitLabelList =
      this.splitLabelList(currentValue.primaryKeyLabels, filtersOfAllSightingTelescope);

    return (
      <div className={styles.filterContainer}>
        <div className={styles.normalFilter}>
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
            _.map(
              moreFilterListOpened,
                obj => this.renderMoreFilter(obj, moreFilters, splitLabelList, currentValue))
          }
        </div>
        <div className={styles.moreFilterController}>
          {
            !_.isEmpty(this.props.tagList) ?
              <HtFilter
                type="multiSearch"
                className={styles.filter}
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
            className={styles.filter}
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
        {this.clearSelectFilterMemory()}
      </div>
    );
  }
}
