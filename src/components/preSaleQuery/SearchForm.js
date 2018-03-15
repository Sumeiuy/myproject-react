/**
 * @Author: ouchangzhi
 * @Date: 2018-01-19 17:19:08
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-02-07 19:19:42
 * @description 售前适当性查询查询组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Form, Button } from 'antd';

import DropDownSelect from '../../components/common/dropdownSelect/index';

import styles from './searchForm.less';

const FormItem = Form.Item;

export default class SearchForm extends Component {
  @autobind
  reset() {
    // this.cust.clearSearchValue();
    // this.product.clearSearchValue();
    this.props.onReset();
  }

  render() {
    const {
      onSearch,
      selectedCustItem,
      custList,
      onSelectCustItem,
      onQueryCustList,
      selectedProductItem,
      productList,
      onSelectProductItem,
      onQueryProductList,
    } = this.props;
    return (
      <Form layout="inline" onSubmit={onSearch} className={styles.searchForm}>
        <FormItem label="选择客户" required className={styles.formItem}>
          <DropDownSelect
            ref={ref => this.cust = ref}
            value={selectedCustItem.custName ? `${selectedCustItem.custName}（${selectedCustItem.custNumber}）` : ''}
            placeholder="经纪客户号/客户名称"
            searchList={custList}
            showObjKey="custName"
            objId="custNumber"
            emitSelectItem={onSelectCustItem}
            emitToSearch={onQueryCustList}
            name="custList"
            boxStyle={{ width: '276px', borderRadius: '4px' }}
          />
        </FormItem>
        <FormItem label="选择产品" required className={styles.formItem}>
          <DropDownSelect
            value={
              selectedProductItem.productName ? `${selectedProductItem.productName}（${selectedProductItem.productCode}）` : ''
            }
            ref={ref => this.product = ref}
            placeholder="产品代码/产品名称"
            searchList={productList}
            showObjKey="productName"
            objId="productCode"
            emitSelectItem={onSelectProductItem}
            emitToSearch={onQueryProductList}
            name="productList"
            boxStyle={{ width: '276px', borderRadius: '4px' }}
          />
        </FormItem>
        <FormItem className={styles.formItem} colon={false} label=" ">
          <Button type="primary" htmlType="submit" className={styles.btn}>查询</Button>
          <Button className={styles.btn} onClick={this.reset}>重置</Button>
        </FormItem>
      </Form>
    );
  }
}

SearchForm.propTypes = {
  custList: PropTypes.array.isRequired,
  productList: PropTypes.array.isRequired,
  selectedCustItem: PropTypes.object.isRequired,
  selectedProductItem: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelectCustItem: PropTypes.func.isRequired,
  onQueryCustList: PropTypes.func.isRequired,
  onSelectProductItem: PropTypes.func.isRequired,
  onQueryProductList: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

