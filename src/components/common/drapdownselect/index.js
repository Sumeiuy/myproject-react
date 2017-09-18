import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import style from './style.less';

export default class DrapDownSelect extends PureComponent {
  static propTypes = {
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
  }

  static defaultProps = {
    placeholder: '',
    value: '',
    searchList: [],
    objId: '',
    boxStyle: {},
  }

  constructor() {
    super();
    this.state = {
      // 查询信息
      searchValue: '',
      // 下拉选框是否展示
      isSHowModal: false,
      // 选中的值
      value: '',
    };
  }

  componentWillMount() {
    this.setState({ value: this.props.value });
  }

  componentDidMount() {
    document.addEventListener('click', this.hideModal);
  }

  get getSearchListDom() {
    const { searchList, emitSelectItem, showObjKey, objId } = this.props;
    const result = searchList.map((item, index) => {
      const callBack = () => {
        emitSelectItem(item);
        this.setState({
          isSHowModal: false,
          value: item[showObjKey],
        });
      };
      const idx = (objId === '') ? `selectList-${index}` : item[objId];
      return (
        <li
          key={idx}
          className={style.ddsDrapMenuConItem}
          onClick={callBack}
        >{item[showObjKey]}</li>
      );
    });
    return result;
  }

  componentWillUnMount() {
    document.removeEventListener('click', this.hideModal);
  }

  @autobind
  showDrapDown(e) {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ isSHowModal: !this.state.isSHowModal });
  }

  @autobind
  toSearch() {
    // 在这里去触发查询搜索信息的方法
    this.props.emitToSearch(this.state.searchValue);
  }

  @autobind
  hideModal() {
    this.setState({ isSHowModal: false });
  }

  render() {
    const modalClass = classnames([style.ddsDrapMenu,
      { hide: !this.state.isSHowModal },
    ]);
    const ddsShowBoxClass = classnames([style.ddsShowBox,
      { [style.active]: this.state.isSHowModal },
    ]);
    return (
      <div
        className={style.drapDowmSelect}
      >
        <div
          onClick={this.showDrapDown}
          className={ddsShowBoxClass}
          style={this.props.boxStyle}
        >
          {this.state.value}
        </div>
        <div className={modalClass}>
          <div
            className={style.ddsDrapMenuSearch}
            onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}
          >
            <input
              type="text"
              className={style.searhInput}
              value={this.state.searchValue}
              placeholder={this.props.placeholder}
              onChange={(e) => { this.setState({ searchValue: e.target.value }); }}
            />
            <span
              className={style.searchSub}
              onClick={this.toSearch}
            >
              <Icon type="search" />
            </span>
          </div>
          <ul className={style.ddsDrapMenuCon}>
            {this.getSearchListDom}
          </ul>
        </div>
      </div>
    );
  }
}
