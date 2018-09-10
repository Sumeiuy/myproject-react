/*
 * @Description: 面包屑包裹组件
 * @Author: 朱飞阳
 * @Date: 2018/7/31 18:18
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-01 18:27:08
 */

import React from 'react';
import CustomerPool from './Home';
import NewCustomerPool from '../newHome/Home';
import { permission } from '../../helper';

export default function CustomerListWrapper(props) {
  return permission.isGrayFlag() ?
    <NewCustomerPool {...props} /> :
    <CustomerPool {...props} />;
}
