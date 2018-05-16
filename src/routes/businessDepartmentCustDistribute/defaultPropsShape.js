/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:57:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-16 18:41:32
 * @description 营业部非投顾签约客户分配的Props的类型检测以及默认类型
 */

import PropTypes from 'prop-types';

export const propsShape = {
  location: PropTypes.object.isRequired,
  // 左侧营业部非投顾签约客户分配申请列表
  list: PropTypes.object.isRequired,
  // 获取左侧营业部非投顾签约客户分配申请列表的api
  getList: PropTypes.func.isRequired,
  // 右侧营业部非投顾签约客户申请的详情
  detailInfo: PropTypes.object.isRequired,
  // 右侧获取营业部非投顾签约客户申请的详情api
  getDetail: PropTypes.func.isRequired,
  // 新建页面服务经理列表
  empList: PropTypes.array.isRequired,
  // 新建页面获取服务经理列表api
  getEmpList: PropTypes.func.isRequired,
  // 通过Excel表格上传的客户列表数据
  custListInExcel: PropTypes.array.isRequired,
  // 获取通过Excel表格上传的客户列表 api
  getCustListInExcel: PropTypes.func.isRequired,
  // 筛选条件过后的客户列表数据
  custListByFilter: PropTypes.object.isRequired,
  // 获取筛选条件后的客户列表 api
  filterCustList: PropTypes.func.isRequired,
  // 根据关键字查询客户
  queryDistributeCust: PropTypes.func.isRequired,
  // 根据关键字查询服务经理
  queryDistributeEmp: PropTypes.func.isRequired,
  // 根据关键字查询开发经理
  queryDistributeDevEmp: PropTypes.func.isRequired,
  // 根据关键字获取的客户列表
  custListByQuery: PropTypes.array.isRequired,
  // 根据关键字获取的服务经理列表
  empListByQuery: PropTypes.array.isRequired,
  // 根据关键字获取的开发经理列表
  devEmpListByQuery: PropTypes.array.isRequired,
};

export const defaultProps = {};
