/**
 * @file components/commissionAdjustment/ProductsDropBox.js
 *  新建批量佣金调整目标产品下拉框
 * @author baojiajia
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import _ from 'lodash';
import styles from './productsDropBox1.less';

const Option = AutoComplete.Option;

export default class ProductsDropdownBox extends PureComponent {

  static propTypes = {
    productList: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    productList: [],
  }

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
  selectProduct(value) {
    this.props.onSelect(value);
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
    const { productList } = this.props;
    const options = productList.map(opt => (
      <Option key={opt.id} value={opt.id}>
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
          onSelect={this.selectProduct}
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

