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
  }

  handleItemClick = (item) => {
    let returnItem = item;
    if (this.props.showSearch) {
      returnItem = {
        key: item.name,
        value: item.aliasName,
      };
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
      });
    }
    this.props.onInputChange(e.target.value);
  }

  handleClickIcon = () => {
    this.setState({
      inputValue: '',
      isShowCloseIcon: false,
    });
  }

  renderSingleWithSearch = (value) => {
    const renderItems = [];

    if (_.isArray(value) && value[1] !== '不限') {
      renderItems.push({
        name: '',
        aliasName: '不限',
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
            onPressEnter={this.props.onPressEnter}
            autoFocus
          />
          {this.state.isShowCloseIcon ?
            <span
              className={`${styles.closeIcon} ht-iconfont ht-icon-guanbi1`}
              onClick={this.handleClickIcon}
            /> :
            <span className={`${styles.sousuoIcon} ht-iconfont ht-icon-sousuo`} />
          }
        </div>
        {
          renderItems.length !== 0 ?
            <div className={styles.currentValue}>
              {
                _.map(renderItems, (item, index) => (
                  <li
                    title={item.aliasName}
                    key={index}
                    onClick={() => this.handleItemClick(item)}
                  >
                    {item.aliasName}
                  </li>
                ))
              }
            </div> : null
        }
        {
          this.props.optionList && this.props.optionList.length !== 0 ?
            _.map(this.props.optionList, (item, index) => (
              <li
                key={index}
                title={item.aliasName}
                className={value[0] === item.name ? styles.activeItem : ''}
                onClick={() => this.handleItemClick(item)}
              >
                {item.aliasName}
              </li>
            )) :
            <li
              key="noContent"
              className={styles.noContent}
            >
              请搜索更多结果
            </li>
        }
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
