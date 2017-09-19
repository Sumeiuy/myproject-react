/**
 * @file components/commissionAdjustment/ProductsDropBox.js
 *  新建批量佣金调整目标产品下拉框
 * @author baojiajia
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import _ from 'lodash';
import styles from './ProductsDropBox.less';

const Option = AutoComplete.Option;
const dataSource = [
  {
    id: '1-34Z1T0D-1',
    prodCode: 'PPWT40',
    prodName: '通道佣金专用（万分之1.5）',
    prodCommision: '0.15',
  },
  {
    id: '1-34Z1T0D-2',
    prodCode: 'PPWT41',
    prodName: '通道佣金专用（万分之1.6）',
    prodCommision: '0.16',
  },
];


export default class ProductsDropdownBox extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      iconType: 'search',
      value: '',
    };
  }

  // 根据用户输入过滤目标产品
  @autobind
  handleSearchFilterOptions(inputValue, option) {
    const optionArray = option.props.children;
    return !!_.find(optionArray, item => item.props.children.indexOf(inputValue) !== -1);
  }

  // 获取到value值后隐藏icon
  @autobind
  changeInputbox(value) {
    if (value) {
      this.setState({
        iconType: 'close',
        value,
      });
    } else {
      this.setState({
        value: '',
        iconType: 'search',
      });
    }
  }
  @autobind
  clearValue() {
    this.setState({
      value: '',
      iconType: 'search',
    });
  }
  render() {
    const { iconType, value } = this.state;
    const options = dataSource.map(opt => (
      <Option key={opt.id} value={opt.prodName}>
        <span className={styles.prodcom}>{`${opt.prodCommision}‰`}</span>
        <span className={styles.prodname}>{opt.prodName}</span>
        <span className={styles.prodcode}>{opt.prodCode}</span>
      </Option>
    ));
    return (
      <div className={styles.dropdownbox}>
        <AutoComplete
          className={styles.searchbox}
          dropdownClassName={styles.searchdropdown}
          dropdownStyle={{ width: 343 }}
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ width: '100%' }}
          dataSource={options}
          onChange={this.changeInputbox}
          optionLabelProp="value"
          filterOption={this.handleSearchFilterOptions}
          value={value}
        >
          <Input
            suffix={
              <Icon
                type={iconType}
                onClick={this.clearValue}
                className={styles.searchicon}
              />
            }
          />
        </AutoComplete>
      </div>
    );
  }
}

