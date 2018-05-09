/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:53:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-09 13:29:08
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
});

const mapDispatchToProps = {
  // 获取左侧营业部非投顾签约客户分配申请列表的api
  getList: effect('app/getSeibleList'),
  // 获取右侧的营业部非投顾签约客户分配申请的详情
  getDetail: effect('custDistribute/getApplyDetail'),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
