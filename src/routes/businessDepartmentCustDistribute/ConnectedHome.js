/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:53:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-16 18:46:38
 * @description 营业部非投顾签约客户分配首页的connect修饰后的组件
 */

import { connect } from 'dva';

import { dva } from '../../helper';

import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 左侧营业部非投顾签约客户分配申请列表
  list: state.app.seibleList,
  // 右侧营业部非投顾签约客户申请的详情
  detailInfo: state.custDistribute.detailInfo,
  // 新建页面中服务经理
  empList: state.custDistribute.empList,
  // 通过Excel表格上传的客户列表数据
  custListInExcel: state.custDistribute.custListInExcel,
  // 筛选条件过后的客户列表数据
  custListByFilter: state.custDistribute.custListByFilter,
  // 根据关键字获取的客户列表
  custListByQuery: state.custDistribute.custListByQuery,
  // 根据关键字获取的服务经理列表
  empListByQuery: state.custDistribute.empListByQuery,
  // 根据关键字获取的开发经理列表
  devEmpListByQuery: state.custDistribute.devEmpListByQuery,
});

const mapDispatchToProps = {
  // 获取左侧营业部非投顾签约客户分配申请列表的api
  getList: effect('app/getSeibleList'),
  // 获取右侧的营业部非投顾签约客户分配申请的详情
  getDetail: effect('custDistribute/getApplyDetail'),
  // 获取新建页面中的服务经理
  getEmpList: effect('custDistribute/getEmpList', { loading: false }),
  // 获取通过Excel表格上传的客户列表
  getCustListInExcel: effect('custDistribute/getCustListInExcel'),
  // 获取筛选条件后的客户列表 api
  filterCustList: effect('custDistribute/filterCustList'),
  // 根据关键字查询客户 api
  queryDistributeCust: effect('custDistribute/queryDistributeCust'),
  // 根据关键字查询服务经理 api
  queryDistributeEmp: effect('custDistribute/queryDistributeEmp'),
  // 根据关键字查询开发经理 api
  queryDistributeDevEmp: effect('custDistribute/queryDistributeDevEmp'),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
