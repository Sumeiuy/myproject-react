/*
 * @Author: sunweibin
 * @Date: 2018-11-09 10:03:37
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-15 09:34:08
 * @description 理财平台与产品中心对接的一些函数以及配置项
 */
import { openFspIframeTab } from './controlPane';
import { url as urlHelper } from '../helper';
import _ from 'lodash';

// 产品中心详情页面-关于不同类型的的产品详情页面路径配置
const PRODUCT_DETAIL_CONFIG = {
  PA100000: {
    title: '私募产品',
    id: 'FSP_PRIVATE_PRD_TAB',
    pathname: '/fsp/productCenter/privateFund',
  },
  PA050000: {
    title: '公募产品',
    id: 'FSP_PUBLIC_FUND_TAB',
    pathname: '/fsp/productCenter/publicFund',
  },
  PA070000: {
    title: '紫金产品',
    id: 'FSP_PRD_PURPLE_GOLD_PROD',
    pathname: '/fsp/productCenter/finance',
  },
  PA090000: {
    title: '收益凭证',
    id: 'FSP_PRD_REVENCE_VOUCHER',
    pathname: '/fsp/productCenter/receipt',
  },
};

// 跳转到具体产品的产品详情页面
export const jumpToProductDetailPage = (data, routerAction) => {
   // type: 产品大类ID, code：具体的产品代码
   const { type, code } = data;
   const param = PRODUCT_DETAIL_CONFIG[type];
   if (_.isEmpty(param)) {
    console.warn('目前产品只有私募产品、公募产品、资金产品、收益凭证四类产品可以跳转');
    return;
   }
   const pathname = param.pathname;
   const path = '/htsc-product-base/htsc-prdt-web/index.html/?_#/productDetailPage';
   const query = { prdtId: code };
   const url = `${path}?${urlHelper.stringify(query)}`;
   openFspIframeTab({
     routerAction,
     url,
     pathname,
     param,
     state: {
       url,
     }
   });
};
