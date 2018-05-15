/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:57:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-15 16:52:36
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
};

export const defaultProps = {};
