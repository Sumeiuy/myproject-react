/**
 * @file components/commissionAdjustment/ProductsDropBox.js
 *  新建批量佣金调整目标产品下拉框
 * @author baojiajia
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Icon, Input, AutoComplete } from 'antd';
import classnames from 'classnames';
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
      displaySearchIcon: false,
    };
  }

  // 根据用户输入过滤目标产品
  @autobind
  handleSearchFilterOptions(inputValue, option) {
    let canBeShown = false;
    const optionArray = option.props.children;
    for (let i = 0; i < optionArray.length; i++) {
      if (optionArray[i].props.children.indexOf(inputValue) !== -1) {
        canBeShown = true;
        break;
      }
    }
    return canBeShown;
  }

  // 获取到value值后隐藏icon
  @autobind
  changeInputbox(value) {
    if (value !== '') {
      this.setState({
        displaySearchIcon: true,
      });
    } else if (value === '') {
      if (value !== '') {
        this.setState({
          displaySearchIcon: false,
        });
      }
    }
  }
  render() {
    const { displaySearchIcon } = this.state;
    const searchIconClass = classnames({
      [styles.searchicon]: true,
      [styles.searchicondisplay]: displaySearchIcon,
    });
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
          allowClear
          onChange={this.changeInputbox}
          optionLabelProp="value"
          filterOption={this.handleSearchFilterOptions}
        >
          <Input suffix={<Icon type="search" className={searchIconClass} />} />
        </AutoComplete>
      </div>
    );
  }
}

