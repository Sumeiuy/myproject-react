/*
 * @Description: 面包屑包裹组件
 * @Author: 朱飞阳
 * @Date: 2018/7/31 18:18
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-01 18:27:08
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
