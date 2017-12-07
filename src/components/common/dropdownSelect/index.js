/*
 * @Author: shenxuxiang
 * @file dropdownSelect.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Dropdown, Input } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import { constants } from '../../../config';
import style from './style.less';

const Search = Input.Search;

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
  }

  constructor(props) {
    super(props);
    this.state = {
      // 查询信息
      searchValue: '',
      // 下拉选框是否展示
      isSHowModal: false,
      // 选中的值
      value: props.value,
      // 添加id标识
      id: new Date().getTime() + parseInt(Math.random() * 1000000, 10),
    };
  }

  // componentWillMount() {
  //   this.setState({
  //     value: this.props.value,
  //     id: new Date().getTime() + parseInt(Math.random() * 1000000, 10),
  //   });
  // }

  componentDidMount() {
    document.addEventListener('click', this.hideModal, false);
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
    const { searchList, emitSelectItem, showObjKey, objId, name } = this.props;
    const result = searchList.map((item, index) => {
      const callBack = () => {
        emitSelectItem(item);
        this.setState({
          isSHowModal: false,
          value: item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`,
          searchValue: '',
        });
      };
      const idx = !item[objId] ? `selectList-${index}` : `${name}-${item[objId]}`;
      return (
        <li
          key={idx}
          className={style.ddsDrapMenuConItem}
          onClick={callBack}
        >
          {item[objId] ? `${item[showObjKey]}（${item[objId]}）` : `${item[showObjKey]}`}
        </li>
      );
    });
    return result;
  }

  @autobind
  clearValue() {
    this.setState({
      ...this.state,
      value: '',
    });
  }

  componentWillUnMount() {
    document.removeEventListener('click', this.hideModal, false);
  }

  @autobind
  showDrapDown() {
    this.setState({ isSHowModal: !this.state.isSHowModal });
  }

  @autobind
  toSearch(value) {
    // 在这里去触发查询搜索信息的方法
    this.props.emitToSearch(value);
  }

  @autobind
  hideModal(e) {
    // 隐藏下拉框
    const { isSHowModal } = this.state;
    if (+e.target.getAttribute('data-id') !== this.state.id && isSHowModal) {
      this.setState({ isSHowModal: false });
    }
  }

  render() {
    const { theme, disable } = this.props;
    const modalClass = classnames([style.ddsDrapMenu,
      { [style.hide]: !this.state.isSHowModal },
    ]);
    const ddsShowBoxClass = classnames([style.ddsShowBox,
      { [style.active]: this.state.isSHowModal },
    ]);
    const ddsShowBoxClass2 = classnames([
      style.ddsShowBox2,
      { [style.disable]: disable },
      { [style.active]: this.state.isSHowModal },
    ]);
    const drapDownSelectCls = classnames({
      [style.drapDowmSelect]: theme === 'theme1',
      [style.drapDowmSelect2]: theme !== 'theme1',
    });
    const menu = (
      <div
        className={drapDownSelectCls}
        onClick={this.handleMenuClick}
      >
        <div className={modalClass}>
          <div
            className={style.ddsDrapMenuSearch}
            onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}
          >
            <Search
              className={style.searhInput}
              placeholder={this.props.placeholder}
              onSearch={this.toSearch}
            />
          </div>
          {
            _.isEmpty(this.props.searchList)
            ? <span className={style.notFound}>没有发现与之匹配的结果</span>
            : null
          }
          <ul className={style.ddsDrapMenuCon}>
            {this.getSearchListDom}
          </ul>
        </div>
      </div>
    );
    if (disable) {
      return (
        <div className={drapDownSelectCls}>
          <div
            className={theme === 'theme1' ? ddsShowBoxClass : ddsShowBoxClass2}
            data-id={this.state.id}
            style={this.props.boxStyle || {}}
          >
            {this.state.value}
          </div>
        </div>
      );
    }
    return (
      <Dropdown
        overlay={menu}
        trigger={['click']}
        visible={this.state.isSHowModal}
        getPopupContainer={() => document.querySelector(constants.container)}
      >
        <div
          className={drapDownSelectCls}
        >
          <div
            onClick={this.showDrapDown}
            className={theme === 'theme1' ? ddsShowBoxClass : ddsShowBoxClass2}
            data-id={this.state.id}
            style={this.props.boxStyle || {}}
          >
            {this.state.value}
          </div>
        </div>
      </Dropdown>
    );
  }
}
