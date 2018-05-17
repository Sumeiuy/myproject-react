import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input } from 'antd';
import styles from './singleFilterMenu.less';

export default class SingleFilterMenu extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
    data: PropTypes.array.isRequired, // Menu显示的数据源， [{label:,value: }]
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({label, value})
    placeholder: PropTypes.string.isRequired,
    showSearch: PropTypes.bool.isRequired,
    onPressEnter: PropTypes.func.isRequired,
    onInputChange: PropTypes.func,
    optionList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    onInputChange: () => {},
  }

  state = {
    inputValue: '',
    isShowCloseIcon: false,
    optionList: this.props.optionList,
  }

  componentWillReceiveProps(nextProps) {
    const { optionList } = nextProps;
    this.setState({
      optionList,
    });
  }
  getLabelValue = (item) => {
    if (item.name) {
      return `${item.aliasName}(${item.name})`;
    }
    return `${item.aliasName}`;
  }

  handleItemClick = (item) => {
    let returnItem = item;
    if (this.props.showSearch) {
      if (item.aliasName === '清除选择的内容') {
        returnItem.aliasName = '不限';
      }
      returnItem = {
        key: returnItem.name,
        value: returnItem.aliasName,
      };
      this.setState({
        inputValue: '',
        isShowCloseIcon: false,
      });
    }
    this.props.onChange({
      ...returnItem,
    }, {
      inVisible: true,
    });
  }

  handleInputChange = (e) => {
    if (e.target.value) {
      this.setState({
        inputValue: e.target.value,
        isShowCloseIcon: true,
      });
    } else {
      this.setState({
        inputValue: '',
        isShowCloseIcon: false,
        optionList: [],
      });
    }
    this.props.onInputChange(e.target.value);
  }

  handleClickCloseIcon = () => {
    this.setState({
      inputValue: '',
      isShowCloseIcon: false,
      optionList: [],
    });
  }

  renderSingleWithSearch = (value) => {
    const renderItems = [];

    const shouldRenderOptionList = this.state.optionList &&
      this.state.optionList.length !== 0 &&
      this.state.inputValue;

    if (_.isArray(value) && value[1] !== '不限') {
      renderItems.push({
        name: '',
        aliasName: '清除选择的内容',
      });
      renderItems.push({
        name: value[0],
        aliasName: value[1],
      });
    }


    return (
      <div>
        <div className={styles.inputWrapper}>
          <Input
            value={this.state.inputValue}
            className={styles.input}
            placeholder={this.props.placeholder}
            onChange={this.handleInputChange}
            onPressEnter={this.handleInputChange}
            autoFocus
          />
          {this.state.isShowCloseIcon ?
            <span
              className={`${styles.closeIcon} ht-iconfont ht-icon-guanbi1`}
              onClick={this.handleClickCloseIcon}
            /> :
            <span className={`${styles.sousuoIcon} ht-iconfont ht-icon-sousuo`} />
          }
        </div>
        <div className={styles.optionList}>
          {
            renderItems.length !== 0 ?
              <div className={styles.currentValue}>
                {
                  _.map(renderItems, (item, index) => (
                    <li
                      className={
                        item.name === '' ? styles.cleanSelect : styles.searchListItem
                      }
                      title={this.getLabelValue(item)}
                      key={index}
                      onClick={() => this.handleItemClick(item)}
                    >
                      {this.getLabelValue(item)}
                    </li>
                  ))
                }
              </div> : null
          }
          {
            shouldRenderOptionList ?
              _.map(this.state.optionList, (item, index) => (
                <li
                  key={index}
                  title={this.getLabelValue(item)}
                  className={value[0] === item.name ? styles.activeItem : styles.searchListItem}
                  onClick={() => this.handleItemClick(item)}
                >
                  {this.getLabelValue(item)}
                </li>
              )) :
              <li
                key="noContent"
                className={styles.noContent}
              >
                请搜索更多结果
            </li>
          }
        </div>
      </div>);
  }

  render() {
    const { value, data } = this.props;
    return (
      <ul className={styles.singleFilterMenu}>
        {
          this.props.showSearch ?
            this.renderSingleWithSearch(value) :
            _.map(data, item => (
              <li
                key={item.key}
                title={item.value}
                className={value === item.key ? styles.activeItem : ''}
                onClick={() => this.handleItemClick(item)}
              >
                {item.value}
              </li>
            ))
        }
      </ul>
    );
  }
}
