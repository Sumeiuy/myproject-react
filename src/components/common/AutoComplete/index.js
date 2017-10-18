/**
 * @file components/common/autoComplete/index.js
 *  带搜索icon的select
 *  根据客户input中输入的值将所选中的对象传给添加按钮进行进一步处理
 * @author baojiajia
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { AutoComplete, Modal } from 'antd';
import styles from './index.less';

const Option = AutoComplete.Option;
const confirm = Modal.confirm;

export default class SearchSelect extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onSelectValue: PropTypes.func.isRequired,
    width: PropTypes.string,
    defaultInput: PropTypes.string,
  }

  static defaultProps = {
    width: '300px',
    defaultInput: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      selectItem: {},
      inputValue: '',
      inputTimeout: '',
    };
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  setSelectValue(value, option) {
    const selectItem = this.props.dataSource[option.props.index];
    this.props.onSelectValue(selectItem);
  }

  @autobind
  clearInput() {
    this.setState({
      inputValue: '',
    });
  }

  @autobind
  handlerSearch(value) {
    let { timeout } = this.state;
    if (timeout !== '') {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => this.validateInput(value), 600);
    this.setState({
      inputValue: value,
      timeout,
    });
  }

  @autobind
  validateInput(value) {
    this.setState({
      timeout: '',
    });
    const clearValue = this.clearInput;
    if (isNaN(value) || value <= 0.15) {
      confirm({
        title: '错误',
        content: '请输入数字,并且不低于0.15',
        onOk() {
          clearValue();
        },
        onCancel() {
          clearValue();
        },
      });
    } else {
      this.props.onChangeValue(value);
    }
  }


  render() {
    const { dataSource, width, defaultInput } = this.props;
    const { inputValue } = this.state;
    const newDataSource = dataSource.map(item => ({ key: item.id, ...item }));
    const options = newDataSource.map(opt => (
      <Option key={opt.id} value={opt.codeValue} text={opt.codeValue}>
        <span className={styles.prodValue}>{opt.codeValue}</span>
      </Option>
    ));
    return (
      <div className={styles.selectSearchBox}>
        <AutoComplete
          className={styles.searchBox}
          dropdownClassName={styles.searchDropDown}
          dropdownStyle={{ width }}
          dropdownMatchSelectWidth={false}
          placeholder={defaultInput}
          style={{ width }}
          dataSource={options}
          optionLabelProp="text"
          value={inputValue}
          onSelect={this.setSelectValue}
          onSearch={this.handlerSearch}
        />
      </div>
    );
  }
}
