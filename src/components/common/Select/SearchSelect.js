/**
 * @file components/common/Select/SearchSelect.js
 *  带搜索icon的select和添加按钮
 *  根据客户input中输入的值将所选中的对象传给添加按钮进行进一步处理
 * @author baojiajia
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete, Button } from 'antd';
import styles from './searchSelect.less';

const Option = AutoComplete.Option;

export default class SearchSelect extends PureComponent {

  static propTypes = {
    labelName: PropTypes.string.isRequired,
    dataSource: PropTypes.array.isRequired,
    onAddCustomer: PropTypes.func.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    width: PropTypes.string,
  }

  static defaultProps = {
    width: '300px',
  }

  constructor(props) {
    super(props);
    this.state = {
      selectItem: {},
      inputValue: '',
      proValue: '',
    };
  }

   @autobind
  onChange(value) {
    this.setState({
      inputValue: value,
      proValue: value,
    });
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  setSelectValue(value, option) {
    this.setState({
      selectItem: this.props.dataSource[option.props.index],
    });
  }

  // 把对应的数组值传入外部接口
  @autobind
  handleAddBtnClick() {
    this.props.onAddCustomer(this.state.selectItem);
    this.setState({
      proValue: '',
    });
  }

  @autobind
  changeDataSource() {
    this.props.onChangeValue(this.state.inputValue);
  }


  render() {
    const { labelName, dataSource, width } = this.props;
    const { proValue } = this.state;
    const newDataSource = dataSource.map(item => ({ key: item.cusId, ...item }));
    const options = newDataSource.map(opt => (
      <Option key={opt.cusId} value={opt.cusId} text={opt.custName}>
        <span className={styles.prodValue}>{opt.custName}</span>
      </Option>
    ));
    return (
      <div className={styles.selectSearchBox}>
        <span className={styles.labelName}>{`${labelName}：`}</span>
        <AutoComplete
          className={styles.searchBox}
          dropdownClassName={styles.searchDropDown}
          dropdownStyle={{ width }}
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ width }}
          dataSource={options}
          optionLabelProp="text"
          onChange={this.onChange}
          value={proValue}
          onSelect={this.setSelectValue}
        >
          <Input
            suffix={
              <Icon
                type="search"
                onClick={this.changeDataSource}
                className={styles.searchIcon}
              />
            }
          />
        </AutoComplete>
        <Button className={styles.addButton} onClick={this.handleAddBtnClick}>添加</Button>
      </div>
    );
  }
}
