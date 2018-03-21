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

import AutoComplete from '../../components/common/similarAutoComplete/index';

import styles from './searchForm.less';

const FormItem = Form.Item;

export default class SearchForm extends Component {
  @autobind
  reset() {
    this.cust.clearValue();
    this.product.clearValue();
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
      // form 表单的onSubmit，和 子组件 AutoComplete的 enter方法冲突了。
      // 将onSubmit方法，放到表单的button内，否则在AutoComplete内，点击enter，触发的是form的onSubmit方法
      <Form layout="inline" className={styles.searchForm}>
        <FormItem label="选择客户" required className={styles.formItem}>
          <AutoComplete
            ref={ref => this.cust = ref}
            defaultSearchValue={selectedCustItem.custName ? `${selectedCustItem.custName}（${selectedCustItem.custNumber}）` : ''}
            placeholder="经纪客户号/客户名称"
            searchList={custList}
            showObjKey="custName"
            objId="custNumber"
            onSelect={onSelectCustItem}
            onSearch={onQueryCustList}
            name="custList"
            boxStyle={{ width: '276px', borderRadius: '4px' }}
          />
        </FormItem>
        <FormItem label="选择产品" required className={styles.formItem}>
          <AutoComplete
            defaultSearchValue={
              selectedProductItem.productName ? `${selectedProductItem.productName}（${selectedProductItem.productCode}）` : ''
            }
            ref={ref => this.product = ref}
            placeholder="产品代码/产品名称"
            searchList={productList}
            showObjKey="productName"
            objId="productCode"
            onSelect={onSelectProductItem}
            onSearch={onQueryProductList}
            name="productList"
            boxStyle={{ width: '276px', borderRadius: '4px' }}
          />
        </FormItem>
        <FormItem className={styles.formItem} colon={false} label=" ">
          <Button
            type="primary"
            className={styles.btn}
            onClick={onSearch}
          >
            查询
          </Button>
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

