/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:57:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-09 14:05:55
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
};

export const defaultProps = {};
