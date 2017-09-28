/**
 * @file components/common/Select/SelectAssembly.js
 *  带搜索icon的select和添加按钮
 *  当输入或者选中值后icon变化成关闭点击后清除input的value值
 * @author baojiajia
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import styles from './selectAssembly.less';

const Option = AutoComplete.Option;

export default class SelectAssembly extends PureComponent {

  static propTypes = {
    labelName: PropTypes.string.isRequired,
    dataSource: PropTypes.array,
    onSearchValue: PropTypes.func.isRequired,
    width: PropTypes.string,
  }

  static defaultProps = {
    dataSource: [
      {
        custId: '12345',
        custName: '张三',
        custType: '保守型',
      },
      {
        custId: '12346',
        custName: '李四',
        custType: '保守型',
      },
      {
        custId: '12347',
        custName: '王五',
        custType: '保守型',
      },
    ],
    width: '200px',
  }

  constructor(props) {
    super(props);
    this.state = {
      selectItem: {},
      inputValue: '',
      typeStyle: 'search',
    };
  }

   @autobind
  onChange(value) {
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
  onSelect(value, option) {
    if (value) {
      this.setState({
        typeStyle: 'close',
        selectItem: this.props.dataSource[option.props.index],
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
      this.props.onSearchValue(this.state.selectItem);
    } else if (this.state.typeStyle === 'close') {
      this.setState({
        inputValue: '',
        typeStyle: 'search',
      });
    }
  }


  render() {
    const { labelName, dataSource, width } = this.props;
    const { inputValue, typeStyle } = this.state;
    const options = dataSource.map(opt => (
      <Option key={opt.custId} value={`${opt.custName}（${opt.custId}） - ${opt.custType}`}>
        <span className={styles.prodValue}>{opt.custName}（{opt.custId}） - {opt.custType}</span>
      </Option>
    ));
    return (
      <div className={styles.selectSearchBox}>
        <span className={styles.labelName}>{`${labelName}：`}</span>
        <AutoComplete
          placeholder="工号/姓名"
          className={styles.searchBox}
          dropdownClassName={styles.searchDropDown}
          dropdownStyle={{ width }}
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ width }}
          dataSource={options}
          optionLabelProp="value"
          onChange={this.onChange}
          onSelect={this.onSelect}
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
