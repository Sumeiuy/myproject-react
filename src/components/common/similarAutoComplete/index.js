/*
 * @Author: zhangjunli
 * @file SimilarAutoComplete.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import style from './style.less';

const Option = AutoComplete.Option;
let currentSelect = null; // 当前选中的对象
let presetValue = ''; // input 的预置值
 // 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: '220px',
  height: '32px',
};
export default class SimilarAutoComplete extends PureComponent {
  static propTypes = {
    // 组件名称，用于设置下拉选项id使用
    name: PropTypes.string,
    // 查询框中的placeholder
    placeholder: PropTypes.string,
    // 查询得到的数据里表
    searchList: PropTypes.array,
    // 列表展示的数据 多对应的Object中的key
    showObjKey: PropTypes.string.isRequired,
    // 数据中的key 作为react中辅助标识key
    objId: PropTypes.string,
    // 选中对象 并触发选中方法 向父组件传递一个obj（必填）
    onSelect: PropTypes.func.isRequired,
    // 在这里去触发查询搜索信息的方法并向父组件传递了string（必填）
    onSearch: PropTypes.func.isRequired,
    // 用户自定义style
    boxStyle: PropTypes.object,
    // 样式主题
    theme: PropTypes.string,
    // 是否可操作
    disable: PropTypes.bool,
    // 默认搜索框值
    defaultSearchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 下拉框的宽度
    width: PropTypes.number,
    // 下拉预置列表
    presetOptionList: PropTypes.array,
  }

  static defaultProps = {
    name: 'customerDrop',
    placeholder: '',
    value: '',
    searchList: [],
    objId: '',
    boxStyle: dropDownSelectBoxStyle,
    theme: 'theme1',
    disable: false,
    defaultSearchValue: '',
    width: 0,
    presetOptionList: [],
  }

  constructor(props) {
    super(props);
    const { defaultSearchValue, searchList, presetOptionList } = props;
    const isEmptyValue = _.isString(defaultSearchValue);
    const propsDefaultValue = isEmptyValue ? defaultSearchValue : `${defaultSearchValue}`;
    const optionListDom = this.getSearchListDom(isEmptyValue ? presetOptionList : searchList);
    // input 的预置值
    presetValue = propsDefaultValue;
    this.state = {
      // 搜索框的类型
      typeStyle: 'search',
      // 选中的值
      value: defaultSearchValue, // 输入框中的值
      // 下拉框选项列表
      optionListDom,
      // 添加id标识
      id: new Date().getTime() + parseInt(Math.random() * 1000000, 10),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { searchList: nextSearchList } = nextProps;
    const { searchList: preSearchList } = this.props;
    if (preSearchList !== nextSearchList) {
      // 更新下拉选项框列表
      this.setState({
        optionListDom: this.getSearchListDom(nextSearchList),
      });
    }
  }

  getSearchListDom(dataList) {
    const { showObjKey, objId, name } = this.props;
    const result = _.map(dataList, (item, index) => {
      if (item.isHidden) {
        return null;
      }
      const idx = !item[objId] ? `selectList|${index}` : `${name}|${item[objId]}`;
      const optionValue = item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`;
      return (
        <Option
          key={idx}
          className={style.ddsDrapMenuConItem}
          value={optionValue}
          title={optionValue}
        >
          {optionValue}
        </Option>
      );
    });
    return result;
  }

  @autobind
  handleInputValue(value) {
    // 清空input的预置值，否则，input为空时，总是会显示 预置值
    // 预置值 只显示一次
    presetValue = '';
    if (_.isEmpty(currentSelect)) {
      const { presetOptionList } = this.props;
      const { optionListDom } = this.state;
      // 记录要搜索的字段，并设置当前的状态为搜索状态
      this.setState({
        value,
        typeStyle: 'search',
        // 当输入值为空时，显示预置下拉选项
        optionListDom: _.isEmpty(value) ? this.getSearchListDom(presetOptionList) : optionListDom,
      });
    } else {
      // 下拉框中值选中时，会触发onchange方法, 即handleInputValue方法，故在此处重置选中项为null
      currentSelect = null;
    }
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  handleSelectedValue(value) {
    if (value) {
      const { searchList = [], onSelect, showObjKey, objId } = this.props;
      const selectItem = _.find(
        searchList,
        (item) => {
          const optionValue = item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`;
          return optionValue === value;
        },
      );
      // 记录当前选中的值
      currentSelect = selectItem || {};
      // 多传一个默认输入值，有些场景下需要用到
      const { value: searchValue } = this.state;
      onSelect({
        ...currentSelect,
        searchValue,
      });

      // 更新state中的值
      const currentValue = currentSelect[objId] ? `${currentSelect[showObjKey]}（${currentSelect[objId]}）` : `${currentSelect[showObjKey]}`;
      this.setState({
        value: currentValue,
        typeStyle: 'close',
      });
    }
  }

  // 触发查询搜索信息的方法
  @autobind
  handleSearch() {
    const { typeStyle, value } = this.state;
    if (typeStyle === 'search') {
      // 发起搜索
      this.props.onSearch(value);
    } else if (typeStyle === 'close') {
      // 清空输入框，并设置为搜索状态
      this.setState(
        {
          value: '',
          typeStyle: 'search',
        },
        () => {
          // 手动清空选中值，传递到组件外
          this.props.onSelect({ searchValue: '' });
        },
      );
    }
  }

  // 目前发现，清空输入框有两种行为：1，直接修改组件的属性value；2，通过调用clearValue方法
  // 直接修改组件的属性value，存在隐患，search事件的触发，有赖于搜索框的图标（放大镜是搜索，x图标是清除）
  // 清空输入框的数据，并设置为搜索状态
  // 组件外部使用，场景是，部分使用该组件时，需要对选中的值做验证（组件外部验证），验证不通过，需要清空
  @autobind
  clearValue() {
    const { presetOptionList } = this.props;
    this.setState({
      ...this.state,
      value: '',
      typeStyle: 'search',
      // 当输入值为空时，显示预置下拉选项
      optionListDom: this.getSearchListDom(presetOptionList),
    });
  }

  // 检查数据源是否为空
  @autobind
  checkListIsEmpty() {
    const { searchList } = this.props;
    const { optionListDom } = this.state;
    const hiddenSearchList = searchList.filter(item => item.isHidden);
    return _.isEmpty(optionListDom)
      || (!_.isEmpty(searchList) && hiddenSearchList.length === searchList.length);
  }

  // 渲染 disable 状态下的标签显示
  @autobind
  renderDisableContent() {
    const { disable, defaultSearchValue, theme, boxStyle } = this.props;
    const { id } = this.state;
    const ddsShowBoxClass = classnames([style.ddsShowBox]);
    const ddsShowBoxClass2 = classnames([
      style.ddsShowBox2,
      { [style.disable]: disable },
    ]);
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });
    return (
      <div className={drapDownSelectCls}>
        <div
          className={theme === 'theme1' ? ddsShowBoxClass : ddsShowBoxClass2}
          data-id={id}
          style={boxStyle || {}}
        >
          {defaultSearchValue}
        </div>
      </div>
    );
  }

  renderAutoComplete() {
    const { placeholder, boxStyle, width } = this.props;
    const { typeStyle, value, optionListDom } = this.state;

    const empty = [(
      <Option
        key={'empty'}
        disabled
        className={style.ddsDrapMenuConItem}
      >
        <span className={style.notFound}>没有发现与之匹配的结果</span>
      </Option>
    )];
    const options = this.checkListIsEmpty() ? empty : optionListDom;
    // AutoComplete组件，有value属性时，defaultValue属性就不起作用了。
    const valueProps = _.isEmpty(presetValue) ? { value } : {};
    return (
      <AutoComplete
        {...valueProps}
        className={style.complete}
        placeholder={placeholder}
        dropdownStyle={{ width: `${width}px` || boxStyle.width }}
        dropdownMatchSelectWidth={false}
        defaultActiveFirstOption={false}
        size="large"
        style={boxStyle}
        dataSource={options}
        optionLabelProp="value"
        defaultValue={presetValue}
        onChange={this.handleInputValue}
        onSelect={this.handleSelectedValue}
      >
        <Input
          suffix={
            <Icon
              type={typeStyle}
              onClick={this.handleSearch}
              className={style.searchIcon}
            />
          }
          onPressEnter={this.handleSearch}
        />
      </AutoComplete>
    );
  }

  render() {
    const { theme, disable } = this.props;
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });

    if (disable) {
      return this.renderDisableContent();
    }
    return (
      <div className={drapDownSelectCls}>
        {this.renderAutoComplete()}
      </div>
    );
  }
}
