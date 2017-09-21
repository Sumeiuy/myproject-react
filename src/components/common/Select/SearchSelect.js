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

export default class ProductsDropdownBox extends PureComponent {

  static propTypes = {
    labelName: PropTypes.string.isRequired,
    dataSource: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    addSelectValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    width: PropTypes.string,
  }

  static defaultProps = {
    dataSource: [
      {
        key: '1-34Z1T0D-1',
        name: '通道佣金专用（万分之1.5）',
      },
      {
        key: '1-34Z1T0D-2',
        name: '通道佣金专用（万分之1.6）',
      },
    ],
    value: '',
    width: '300',
  }

  constructor(props) {
    super(props);
    this.state = {
      selectItem: {},
    };
  }

  // 根据用户选中的option的value值获取对应的数组值
  @autobind
  setSelectValue(value) {
    this.setState({
      selectItem: this.props.dataSource[value],
    });
  }

  // 把对应的数组值传入外部接口
  @autobind
  handleAddBtnClick() {
    this.props.addSelectValue(this.state.selectItem);
  }

  render() {
    const { labelName, onChange, dataSource, value, width } = this.props;
    const options = dataSource.map((opt, index) => (
      <Option key={opt.id} value={`${index}`}>
        <span className={styles.prodvalue}>{opt.name}</span>
      </Option>
    ));
    return (
      <div className={styles.selectSearchBox}>
        <span className={styles.labelName}>{`${labelName}：`}</span>
        <AutoComplete
          className={styles.searchbox}
          dropdownClassName={styles.searchdropdown}
          dropdownStyle={{ width }}
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ width }}
          dataSource={options}
          onChange={onChange}
          onSelect={this.setSelectValue}
          optionLabelProp="value"
          value={value}
        >
          <Input
            suffix={
              <Icon
                type="search"
                className={styles.searchicon}
              />
            }
          />
        </AutoComplete>
        <Button onClick={this.handleAddBtnClick}>添加</Button>
      </div>
    );
  }
}
