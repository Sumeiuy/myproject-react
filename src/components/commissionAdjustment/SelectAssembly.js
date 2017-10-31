/**
 * @file components/common/Select/SelectAssembly.js
 *  带搜索icon的select和添加按钮
 *  当输入或者选中值后icon变化成关闭点击后清除input的value值
 * @author baojiajia
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import _ from 'lodash';

import styles from './selectAssembly.less';

const Option = AutoComplete.Option;

export default class SelectAssembly extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    onSearchValue: PropTypes.func.isRequired,
    onSelectValue: PropTypes.func.isRequired,
    width: PropTypes.string,
    ref: PropTypes.func,
  }

  static defaultProps = {
    width: '300px',
    ref: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      typeStyle: 'search',
    };
  }

  @autobind
  handleInputValue(value) {
    this.setState({
      inputValue: value,
    });
    if (value === '') {
      this.setState({
        typeStyle: 'search',
      });
    }
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  handleSelectedValue(value) {
    if (value) {
      const { dataSource, onSelectValue } = this.props;
      const item = _.filter(dataSource, o => o.id === value)[0];
      onSelectValue(item);
      this.setState({
        inputValue: `${item.custName}（${item.custEcom}） - ${item.riskLevelLabel}`,
        typeStyle: 'close',
      });
    } else {
      this.setState({
        inputValue: '',
        typeStyle: 'search',
      });
    }
  }

  @autobind
  changeDataSource() {
    if (this.state.typeStyle === 'search') {
      this.props.onSearchValue(this.state.inputValue);
    } else if (this.state.typeStyle === 'close') {
      this.setState({
        inputValue: '',
        typeStyle: 'search',
      });
    }
  }


  render() {
    const { dataSource, width } = this.props;
    const { inputValue, typeStyle } = this.state;
    const options = dataSource.map(opt => (
      <Option
        key={opt.id}
        value={opt.id}
        text={`${opt.custName}（${opt.custEcom}） - ${opt.riskLevelLabel}`}
      >
        <span className={styles.prodValue}>
          {opt.custName}（{opt.custEcom}） - {opt.riskLevelLabel}
        </span>
      </Option>
    ));
    return (
      <div className={styles.selectSearchBox}>
        <AutoComplete
          placeholder="客户号/客户姓名"
          className={styles.searchBox}
          dropdownClassName={styles.searchDropDown}
          dropdownStyle={{ width }}
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ width }}
          dataSource={options}
          optionLabelProp="text"
          onChange={this.handleInputValue}
          onSelect={this.handleSelectedValue}
          value={inputValue}
        >
          <Input
            suffix={
              <Icon
                type={typeStyle}
                onClick={this.changeDataSource}
                className={styles.searchIcon}
              />
            }
          />
        </AutoComplete>
      </div>
    );
  }
}
