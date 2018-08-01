/*
 * @Description: 面包屑包裹组件
 * @Author: 朱飞阳
 * @Date: 2018/7/31 18:18
 * @Last Modified by: 朱飞阳
 * @Last Modified time: 2018-07-31 10:56:40
 */

import React from 'react';
import CustomerList from './CustomerList';
import NewCustomerList from './CustomerList__';
import { env } from '../../helper';

export default function CustomerListWrapper(props) {
  return env.isGrayFlag() ?
    <NewCustomerList {...props} /> :
    <CustomerList {...props} />;
}
