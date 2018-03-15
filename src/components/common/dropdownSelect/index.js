/*
 * @Author: shenxuxiang
 * @file dropdownSelect.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import style from './style.less';

const Option = AutoComplete.Option;
let currentSelect = null;

export default class DropdownSelect extends PureComponent {
  static propTypes = {
    // 组件名称
    name: PropTypes.string,
    // 查询框中的placeholder
    placeholder: PropTypes.string,
    // 所选取的值
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 查询得到的数据里表
    searchList: PropTypes.array,
    // 列表展示的数据 多对应的Object中的key
    showObjKey: PropTypes.string.isRequired,
    // 数据中的key 作为react中辅助标识key
    objId: PropTypes.string,
    // 选中对象 并触发选中方法 向父组件传递一个obj（必填）
    emitSelectItem: PropTypes.func.isRequired,
    // 在这里去触发查询搜索信息的方法并向父组件传递了string（必填）
    emitToSearch: PropTypes.func.isRequired,
    // 用户自定义style
    boxStyle: PropTypes.object,
    // 样式主题
    theme: PropTypes.string,
    // 是否可操作
    disable: PropTypes.bool,
    // 默认搜索框值
    defaultSearchValue: PropTypes.string,
    // 下拉框的宽度
    width: PropTypes.string,
  }

  static defaultProps = {
    name: 'customerDrop',
    placeholder: '',
    value: '',
    searchList: [],
    objId: '',
    boxStyle: {},
    theme: 'theme1',
    disable: false,
    defaultSearchValue: '',
    width: '300px',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 搜索框的类型
      typeStyle: 'search',
      // 选中的值
      value: props.value,
      // 添加id标识
      id: new Date().getTime() + parseInt(Math.random() * 1000000, 10),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value: nextValue } = nextProps;
    const { value: preValue } = this.props;
    if (preValue !== nextValue) {
      this.setState({
        value: nextValue,
      });
    }
  }

  get getSearchListDom() {
    const { searchList = [], showObjKey, objId, name } = this.props;
    const result = searchList.map((item, index) => {
      if (item.isHidden) {
        return null;
      }
      const idx = !item[objId] ? `selectList|${index}` : `${name}|${item[objId]}`;
      return (
        <Option
          key={idx}
          className={style.ddsDrapMenuConItem}
          title={item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`}
        >
          {item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`}
        </Option>
      );
    });
    return result;
  }

  @autobind
  handleInputValue(value) {
    if (_.isEmpty(currentSelect)) {
      this.setState({
        value,
        typeStyle: 'search',
      });
    } else {
      // 下拉框中值选中时，会触发onchange方法, 即handleInputValue方法，故在此处重新职位null
      currentSelect = null;
    }
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  handleSelectedValue(value) {
    if (value) {
      const { searchList = [], emitSelectItem, showObjKey, objId } = this.props;
      const valueArr = value.split('|');
      let selectItem = {};
      if (_.first(valueArr) === 'selectList') {
        selectItem = searchList[parseInt(_.last(valueArr), 10)];
      } else {
        selectItem = _.filter(searchList, item => item[objId] === _.last(valueArr))[0];
      }
      // 记录当前选中的值
      currentSelect = selectItem;
      // 多传一个默认输入值，有些场景下需要用到
      const { value: searchValue } = this.state;
      emitSelectItem({
        ...selectItem,
        searchValue,
      });
      this.setState({
        value: selectItem[objId] ? `${selectItem[showObjKey]}（${selectItem[objId]}）` : `${selectItem[showObjKey]}`,
        typeStyle: 'close',
      });
    }
  }

  @autobind
  clearValue() {
    this.setState({
      ...this.state,
      value: '',
      typeStyle: 'search',
    });
  }

  @autobind
  toSearch() {
    // 在这里去触发查询搜索信息的方法
    const { typeStyle, value } = this.state;
    if (typeStyle === 'search') {
      this.props.emitToSearch(value);
    } else if (typeStyle === 'close') {
      this.setState({
        value: '',
        typeStyle: 'search',
      });
    }
  }

  @autobind
  checkListIsEmpty() {
    const { searchList } = this.props;
    return _.isEmpty(searchList)
      || (searchList.filter(item => item.isHidden).length === searchList.length);
  }

  render() {
    const { theme, disable, defaultSearchValue, placeholder, width, boxStyle } = this.props;
    const ddsShowBoxClass = classnames([style.ddsShowBox]);
    const ddsShowBoxClass2 = classnames([
      style.ddsShowBox2,
      { [style.disable]: disable },
    ]);
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });
    const empty = [(
      <Option
        key={'empty'}
        className={style.ddsDrapMenuConItem}
      >
        <span className={style.notFound}>没有发现与之匹配的结果</span>
      </Option>
    )];
    const options = this.checkListIsEmpty() ? empty : this.getSearchListDom;
    if (disable) {
      return (
        <div className={drapDownSelectCls}>
          <div
            className={theme === 'theme1' ? ddsShowBoxClass : ddsShowBoxClass2}
            data-id={this.state.id}
            style={boxStyle || {}}
          >
            {this.state.value}
          </div>
        </div>
      );
    }
    const dropdownStyle = {
      width: (_.isEmpty(boxStyle) || _.isEmpty(boxStyle.width)) ? width : boxStyle.width,
    };
    return (
      <div className={drapDownSelectCls}>
        <AutoComplete
          placeholder={placeholder}
          dropdownStyle={dropdownStyle}
          dropdownMatchSelectWidth={false}
          defaultActiveFirstOption={false}
          size="large"
          style={boxStyle || {}}
          dataSource={options}
          optionLabelProp="text"
          defaultValue={defaultSearchValue}
          onChange={this.handleInputValue}
          onSelect={this.handleSelectedValue}
          value={this.state.value}
        >
          <Input
            suffix={
              <Icon
                type={this.state.typeStyle}
                onClick={this.toSearch}
                className={style.searchIcon}
              />
            }
            onPressEnter={this.toSearch}
          />
        </AutoComplete>
      </div>
    );
  }
}
