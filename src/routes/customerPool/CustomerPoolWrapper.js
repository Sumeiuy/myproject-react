/*
 * @Description: 新版客户池首页
 * @Author: 朱飞阳
 * @Date: 2018/7/31 18:18
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-12 15:23:25
 */

import React from 'react';
import CustomerPool from './Home';
import NewCustomerPool from '../newHome/Home';

export default function CustomerListWrapper(props) {
  return  /newIndex/.test(window.location.pathname) ?
    <NewCustomerPool {...props} /> :
    <CustomerPool {...props} />;
}
