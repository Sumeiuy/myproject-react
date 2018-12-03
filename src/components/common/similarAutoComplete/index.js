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

import confirm from '../confirm_';
import logable from '../../../decorators/logable';

import styles from './style.less';

const Option = AutoComplete.Option;
// 下拉搜索组件样式
const defaultStyle = {
  width: '220px',
  height: '32px',
  display: 'inline-block',
};
// 下拉列表的默认展示为：1. 名字（id号）2. 名字
// 该组件仅定制了ant的AutoComplete的一小部分，对于原本拥有属性和方法，均能用

//  通过ref，调用的方法
// 1. clearValue(): 清空组件value
// 2. showErrorMsg(): 显示错误信息
// 3. hiddenErrorMsg(): 隐藏错误信息
export default class SimilarAutoComplete extends PureComponent {
  static propTypes = {
    // 原有属性（没列举的原有属性，都能用）
    onSelect: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 定制下拉选项框(用AutoComplete.Option来实现，一定要有value属性值)
    renderOptionNode: PropTypes.func,
    isImmediatelySearch: PropTypes.bool,
    optionList: PropTypes.array,
    showNameKey: PropTypes.string,
    showIdKey: PropTypes.string,
    optionKey: PropTypes.string,
    style: PropTypes.object,
    // 是否要求用户确认清除操作
    needConfirmWhenClear: PropTypes.bool,
    clearConfirmTips: PropTypes.string,
  }

  static defaultProps = {
    optionList: [], // 下拉列表数据源
    showNameKey: '', // 用于下拉列表的默认展示
    showIdKey: '',
    optionKey: '', // 相当于table的rowkey,唯一标识符
    defaultValue: '', // 初始值
    renderOptionNode: null, // 空方法
    isImmediatelySearch: false, // 是否开启即时搜索
    onChange: () => {},
    style: defaultStyle,
    needConfirmWhenClear: false,
    clearConfirmTips: '确认要清除数据吗？',
  }

  constructor(props) {
    super(props);
    const { defaultValue } = props;
    const isEmptyValue = _.isEmpty(_.trim(defaultValue));
    this.state = {
      // 输入框 右侧图标
      typeStyle: isEmptyValue ? 'search' : 'clear',
      value: defaultValue, // 初始值
      showError: '', // 显示的报错信息
    };
  }

  getOptionListDom(dataList) {
    const {
      showNameKey,
      optionKey,
      showIdKey,
      renderOptionNode,
    } = this.props;
    const result = _.map(
      dataList,
      (item, index, array) => {
        if (item.isHidden) {
          return null;
        }
        // 组件外部定制的下拉列表
        if (renderOptionNode !== null) {
          return renderOptionNode(item, index, array);
        }
        // 默认的下拉列表
        const optionValue = item[showIdKey] ? `${item[showNameKey]}（${item[showIdKey]}）` : `${item[showNameKey]}`;
        // 说明 option中 key 的取值：一般 showIdKey 对应值，也是唯一标识，故 key有两个值可选 optionKey 和 item[showIdKey]
        // 优先用 optionKey 做唯一标识
        return (
          <Option
            key={item[optionKey] || item[showIdKey]}
            value={optionValue}
            title={optionValue}
            className={styles.ddsDrapMenuConItem}
          >
            {optionValue}
          </Option>
        );
      }
    );
    return result;
  }

  // 组件内全局变量
  currentSelect = null; // 当前选中的对象

  @autobind
  handleChange(value) {
    if (!_.isEmpty(this.currentSelect)) {
      // 下拉框中值选中时，会触发onchange方法, 即handleChange方法，故在此处重置选中项为null
      this.currentSelect = null;
    } else {
      this.props.onChange(value);
    }
  }

  // 根据用户选中的option的value值获取对应的数组值
  // 第一个参数是 AutoComplete 组件的optionLabelProp指定的key对应的值
  // 第二个参数是 该节点信息
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择客户',
      value: '$args[0]',
    },
  })
  handleSelect(value, selectItem) {
    if (value) {
      // 更新state中的值
      this.setState({
        value,
        typeStyle: 'clear',
      }, () => {
        const {
          onSelect, optionList, showIdKey, optionKey
        } = this.props;
        // 当前的选中值
        this.currentSelect = _.find(
          optionList,
          item => item[optionKey || showIdKey] === selectItem.key,
        );
        onSelect(this.currentSelect);
      });
    }
  }

  // 即时搜索
  @autobind
  handleImmediatelySearch(searchValue) {
    const { onSelect, isImmediatelySearch } = this.props;
    const { typeStyle } = this.state;
    let value = searchValue;
    // 当输入框状态为 clear，删除输入框的内容时，要清空 value
    if (typeStyle === 'clear') {
      value = '';
      onSelect({});
      this.setState({
        value,
        typeStyle: 'search',
      });
    } else {
      // 记录要搜索的字段，并设置当前的状态为搜索状态
      this.setState({
        value,
      });
    }
    // 有的搜索不支持 keyword 为空字符串，比如 售前适当性查询，会弹warn框提醒用具输入
    // 即时搜索关闭 输入框清空 时，对 空字符串的 搜索
    if (isImmediatelySearch && value !== '') {
      // 发起搜索
      const { onSearch } = this.props;
      onSearch(value);
    }
  }

  @autobind
  handleClearSelect() {
    this.setState({
      value: '',
      typeStyle: 'search',
    }, () => {
      // 手动清空选中值，传递到组件外
      this.props.onSelect({});
    });
  }

  // 触发查询搜索信息的方法
  @autobind
  @logable({ type: 'Click', payload: { name: '搜索' } })
  handleSearch(e) {
    const { typeStyle, value } = this.state;
    if (typeStyle === 'search') {
      // 发起搜索
      this.props.onSearch(value);
    } else if (typeStyle === 'clear') {
      // 清空输入框，并设置为搜索状态
      // 增加清空之前的判断
      // 清空之前询问用户是否清空数据
      if (this.props.needConfirmWhenClear) {
        // 阻止React合成事件传播
        e.stopPropagation();
        confirm({
          content: this.props.clearConfirmTips,
          onOk: this.handleClearSelect,
        });
      } else {
        this.handleClearSelect();
      }
    }
  }

  // 组件外部使用，通过ref 调用，清空 value
  @autobind
  clearValue() {
    this.setState({
      value: '',
      typeStyle: 'search',
    });
  }

  // 组件外部使用，通过ref 调用，显示错误信息
  @autobind
  showErrorMsg(msg) {
    this.setState({
      showError: msg,
    });
  }

  // 组件外部使用，通过ref 调用，隐藏错误信息
  @autobind
  hiddenErrorMsg() {
    this.setState({
      showError: '',
    });
  }

  // 检查数据源是否为空
  @autobind
  checkListIsEmpty() {
    const { optionList } = this.props;
    const hiddenSearchList = optionList.filter(item => item.isHidden);
    return _.isEmpty(optionList)
      || (hiddenSearchList.length === optionList.length);
  }

  renderAutoComplete() {
    const { style, optionList, ...otherPorps } = this.props;
    const { typeStyle, value, showError } = this.state;
    const empty = [(
      <Option
        key="empty"
        disabled
        className={styles.ddsDrapMenuConItem}
      >
        <span className={styles.notFound}>没有发现与之匹配的结果</span>
      </Option>
    )];
    const optionNode = this.checkListIsEmpty() ? empty : this.getOptionListDom(optionList);
    const inputValue = _.isString(value) ? value : `${value}`;
    const iconType = typeStyle === 'search' ? 'search' : 'close';
    const completeClassName = classnames(
      { [styles.error]: !_.isEmpty(showError) },
    );
    return (
      <AutoComplete
        {...otherPorps}
        className={completeClassName}
        defaultActiveFirstOption={false}
        size="large"
        style={{ ...defaultStyle, ...style }}
        dataSource={optionNode}
        optionLabelProp="value"
        value={inputValue}
        // 选中下拉列表框中的某项，会触发onChange方法，不触发onSearch方法
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        // 当输入框变化时，AutoComplete 组件会先调用 onSearch 方法，在调用 onChange 方法
        // 添加 onSearch 属性，可实现即时搜索
        onSearch={this.handleImmediatelySearch}
        ref={ref => this.autoCompleteComponent = ref}
      >
        <Input
          suffix={(
            <Icon
              type={iconType}
              onClick={this.handleSearch}
              className={styles.searchIcon}
            />
)}
          onPressEnter={this.handleSearch}
        />
      </AutoComplete>
    );
  }

  render() {
    const { style } = this.props;
    const { showError } = this.state;

    return (
      <div className={styles.drapDowmSelect} style={{ ...defaultStyle, ...style }}>
        {this.renderAutoComplete()}
        <div className={styles.showError} title={showError}>{showError}</div>
      </div>
    );
  }
}
