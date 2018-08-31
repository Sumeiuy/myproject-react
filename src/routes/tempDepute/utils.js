/*
 * @Author: sunweibin
 * @Date: 2018-08-30 14:59:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-30 18:47:34
 * @description 临时委托任务的辅助函数
 */

// 临时委托任务查询列表的默认参数以及默认值
const LIST_API_DEFAULT_QUERY = {
  // 状态
  status: '',
  // 拟稿人ID
  drafterId: '',
  // 审批人ID
  approvalId: '',
  // 申请开始时间
  applyTimeStart: null,
  // 申请结束时间
  applyTimeEnd: null,
  // 页码
  pageNum: 1,
  // 每页条数
  pageSize: 10,
};

// 根据传入的请求参数与默认参数进行合并生成最终的列表接口请求参数
export const composeQuery = (query) => {
  const { pageNum, pageSize } = query;
  // 因为从 location 上取回来的页码器是String，作为借口参数需要转化为 Number
  return {
    ...LIST_API_DEFAULT_QUERY,
    ...query,
    pageNum: parseInt(pageNum || 1, 10),
    pageSize: parseInt(pageSize || 10, 10),
  };
};
