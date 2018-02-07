/**
 * @Author: ouchangzhi
 * @Date: 2018-01-19 17:19:08
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-02-06 20:32:24
 * @description 售前适当性查询查询组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';

import DropDownSelect from '../../components/common/dropdownSelect/index';

import styles from './searchForm.less';

const FormItem = Form.Item;

export default function SearchForm(props) {
  return (
    <Form layout="inline" onSubmit={props.onSearch} className={styles.searchForm}>
      <FormItem label="选择客户" required className={styles.formItem}>
        <DropDownSelect
          value={props.selectedCustItem.custName ? `${props.selectedCustItem.custName}（${props.selectedCustItem.custNumber}）` : ''}
          placeholder="经纪客户号/客户名称"
          searchList={props.custList}
          showObjKey="custName"
          objId="custNumber"
          emitSelectItem={props.onSelectCustItem}
          emitToSearch={props.onQueryCustList}
          name="custList"
          boxStyle={{ width: '276px', border: '1px solid #e9e9e9', borderRadius: '4px' }}
        />
      </FormItem>
      <FormItem label="选择产品" required className={styles.formItem}>
        <DropDownSelect
          value={
            props.selectedProductItem.productName ? `${props.selectedProductItem.productName}（${props.selectedProductItem.productCode}）` : ''
          }
          placeholder="产品代码/产品名称"
          searchList={props.productList}
          showObjKey="productName"
          objId="productCode"
          emitSelectItem={props.onSelectProductItem}
          emitToSearch={props.onQueryProductList}
          name="productList"
          boxStyle={{ width: '276px', border: '1px solid #e9e9e9', borderRadius: '4px' }}
        />
      </FormItem>
      <FormItem className={styles.formItem} colon={false} label=" ">
        <Button type="primary" htmlType="submit" className={styles.btn}>查询</Button>
        <Button className={styles.btn} onClick={props.onReset}>重置</Button>
      </FormItem>
    </Form>
  );
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

