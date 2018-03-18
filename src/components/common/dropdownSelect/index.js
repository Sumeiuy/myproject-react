/*
 * @Author: zhangjunli
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
let currentSelect = null; // 当前选中的对象
let isClickSearch = false; // 当点击图标搜索时，有时会先触发blur事件，再触发search事件。
 // 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: '220px',
  height: '32px',
};
export default class DropdownSelect extends PureComponent {
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
    // 所选取的值
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 下拉框的宽度
    width: PropTypes.string,
    // 是否允许宽度自适应效果
    isAutoWidth: PropTypes.bool,
    // presetData: PropTypes.array,
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
    width: '',
    isAutoWidth: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      // input框的自适应宽度
      autoWidth: '',
      // input框是否可见
      inputVisible: false,
      // 搜索框的类型
      typeStyle: 'search',
      // 选中的值
      value: props.isAutoWidth ? '' : props.value, // 输入框中的值
      lastSearchValue: props.value, // div上的显示值
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

  componentWillUnmount() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
  }

  getSearchListDom() {
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

  // 拿到autocomplelte元素，子元素通过ref，拿到为undifined
  @autobind
  saveAutoCompleteRef(ref) {
    this.autoComplete = ref;
  }

  @autobind
  handleInputValue(value) {
    if (_.isEmpty(currentSelect)) {
      // 记录要搜索的字段，并设置当前的状态为搜索状态
      this.setState({
        value,
        typeStyle: 'search',
      });
    } else {
      // 下拉框中值选中时，会触发onchange方法, 即handleInputValue方法，故在此处重置选中项为null
      currentSelect = null;
    }
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  handleSelectedValue(value) {
    // 重置标志
    isClickSearch = false;
    if (value) {
      const { searchList = [], onSelect, showObjKey, objId, isAutoWidth } = this.props;
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
      onSelect({
        ...selectItem,
        searchValue,
      });

      // 更新state中的值
      const currentValue = selectItem[objId] ? `${selectItem[showObjKey]}（${selectItem[objId]}）` : `${selectItem[showObjKey]}`;
      this.setState({
        value: isAutoWidth ? '' : currentValue,
        lastSearchValue: currentValue,
        typeStyle: isAutoWidth ? 'search' : 'close',
        inputVisible: false,
      });
    }
  }

  // 触发查询搜索信息的方法
  @autobind
  handleSearch(event, clickType) {
    // AutoComplete 组件特点：
    // 当点击搜索框的放大镜，AutoComplete若处于聚焦状态，则会失焦,反之，会聚焦
    // 当点击enter 搜索，AutoComplete若处于聚焦状态， 不会失焦
    if (clickType === 'iconClick') {
      // 标记触发点击放大镜的search事件
      isClickSearch = true;
      // 此处手动聚焦：为让点击搜索框的放大镜，AutoComplete在聚焦情况下，不会失焦
      // 找到input
      const inputElement = event.target.parentNode.parentNode.firstChild;
      // 手动聚焦
      inputElement.focus();
    }

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

  // 触发切换成AutoComplete 组件
  @autobind
  handleEditWrapperClick(event) {
    // 重置标志
    isClickSearch = false;
    // 上一个AutoComplete元素
    const preInputElem = document.querySelector(`.${style.complete} .ant-input`);
    const contentDivElemWidth = event.target.clientWidth;
    this.setState(
      {
        inputVisible: true,
        autoWidth: `${Math.max(70, (contentDivElemWidth + 26))}px`,
      },
      () => {
        // 因 AutoComplete 组件的子元素，不能通过this.autoComplete.childNodes获得，不能通过在子元素上设置ref获得，不能自动聚焦
        // 故此处通过搜索class来获得input元素，手动聚焦
        // ps：AutoComplete 的3.3.0版本，又看到 autoFocus 自动获取焦点的属性
        const inputRef = this.autoComplete.getInputElement();
        const inputElemClassName = inputRef.props.prefixCls;
        // 获得input元素
        const inputElemList = document.querySelectorAll(`.${inputElemClassName}`);
        const currentInputElem = _.find(
          inputElemList,
          item => item !== preInputElem,
        );
        // 手动聚焦
        currentInputElem.focus();
        // 手动绑定方法，如果不绑定，手动聚焦后，不触发onPressEnter方法
        currentInputElem.onPressEnter = this.toSearch;
      },
    );
  }
  // 失焦时，切换回div显示状态，已实现自适应宽度（input元素，无发根据输入的内容自适应宽度）
  @autobind
  handleBlur() {
    // 重置标志
    isClickSearch = false;
    // 自测发现，会出现点击放大镜搜索时，先触发blur事件，再触发search事件，是否显示AutoComplete组件造成错误
    // 此处设置超时，为上述情况出现时，让blur事件，放到了 search方法  后触发
    this.debounceTimeout = setTimeout(() => {
      if (!isClickSearch && this.props.isAutoWidth) {
        this.setState({
          inputVisible: false,
          value: '',
          typeStyle: 'search',
        });
      } else if (!isClickSearch && this.state.typeStyle === 'search') {
        // 当输入框失焦，若输入框的图标类型为search，则清除输入框内容，提醒用户选择下拉框中的选项
        this.setState({
          inputVisible: false,
          value: '',
        });
      }
    }, 40);
  }
  // 目前发现，清空输入框有两种行为：1，直接修改组件的属性value；2，通过调用clearValue方法
  // 直接修改组件的属性value，存在隐患，search事件的触发，有赖于搜索框的图标（放大镜是搜索，x图标是清除）
  // 清空输入框的数据，并设置为搜索状态
  // 组件外部使用，场景是，部分使用该组件时，需要对选中的值做验证（组件外部验证），验证不通过，需要清空
  @autobind
  clearValue() {
    this.setState({
      ...this.state,
      value: '',
      typeStyle: 'search',
    });
  }

  // 检查数据源是否为空
  @autobind
  checkListIsEmpty() {
    const { searchList } = this.props;
    return _.isEmpty(searchList)
      || (searchList.filter(item => item.isHidden).length === searchList.length);
  }

  // 渲染 标签
  @autobind
  renderEditContent() {
    const { lastSearchValue } = this.state;
    return (
      <div className={style.editContent} onClick={this.handleEditWrapperClick}>
        <div className={style.content}>{lastSearchValue || '--'}</div>
        <div className={style.downIcon} />
      </div>
    );
  }
  // 渲染 disable 状态下的标签显示
  @autobind
  renderDisableContent() {
    const { disable, value, theme, boxStyle } = this.props;
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
          {value}
        </div>
      </div>
    );
  }

  renderAutoComplete() {
    const { defaultSearchValue, placeholder, boxStyle, width, isAutoWidth } = this.props;
    const { value, inputVisible, typeStyle, autoWidth } = this.state;
    const autoBoxStyle = { ...boxStyle, width: autoWidth };

    const empty = [(
      <Option
        key={'empty'}
        disabled
        className={style.ddsDrapMenuConItem}
      >
        <span className={style.notFound}>没有发现与之匹配的结果</span>
      </Option>
    )];
    const options = this.checkListIsEmpty() ? empty : this.getSearchListDom();
    return (
      <AutoComplete
        className={style.complete}
        placeholder={placeholder}
        dropdownStyle={{ width: width || boxStyle.width }}
        dropdownMatchSelectWidth={false}
        defaultActiveFirstOption={false}
        size="large"
        style={isAutoWidth ? autoBoxStyle : boxStyle}
        dataSource={options}
        optionLabelProp="text"
        defaultValue={defaultSearchValue}
        onChange={this.handleInputValue}
        onSelect={this.handleSelectedValue}
        // 自测发现，外部通过修改组件属性，清空输入框的，拿到的值为' '（空格，而不是空字符串）
        // 当为' '(空格)时，手动设置为''（空字符串），已显示placeholder
        value={value === ' ' ? '' : value}
        visible={inputVisible}
        onBlur={this.handleBlur}
        ref={this.saveAutoCompleteRef}
      >
        <Input
          suffix={
            <Icon
              type={typeStyle}
              onClick={(event) => { this.handleSearch(event, 'iconClick'); }}
              className={style.searchIcon}
            />
          }
          onPressEnter={(event) => { this.handleSearch(event, 'enterClick'); }}
        />
      </AutoComplete>
    );
  }

  render() {
    const { theme, disable, isAutoWidth } = this.props;
    const { inputVisible } = this.state;
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });

    if (disable) {
      return this.renderDisableContent();
    }
    if (isAutoWidth) {
      return (
        <div className={drapDownSelectCls}>
          {
            inputVisible ? (
              this.renderAutoComplete()
            ) : (
              this.renderEditContent()
            )
          }
        </div>
      );
    }
    return (
      <div className={drapDownSelectCls}>
        {this.renderAutoComplete()}
      </div>
    );
  }
}
