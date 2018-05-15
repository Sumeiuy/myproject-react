/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:53:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-15 16:51:46
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
});

const mapDispatchToProps = {
  // 获取左侧营业部非投顾签约客户分配申请列表的api
  getList: effect('app/getSeibleList'),
  // 获取右侧的营业部非投顾签约客户分配申请的详情
  getDetail: effect('custDistribute/getApplyDetail'),
  // 获取新建页面中的服务经理
  getEmpList: effect('custDistribute/getEmpList'),
  // 获取通过Excel表格上传的客户列表
  getCustListInExcel: effect('custDistribute/getCustListInExcel'),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
