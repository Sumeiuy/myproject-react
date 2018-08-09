/*
 * @Author: WangJunJun
 * @Date: 2018-08-06 21:15:03
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-08 23:27:16
 */

//  添加客户的方式
export const config = {
  customerAddType: [
    {
      show: true,
      label: '单客户添加',
      value: 'single',
    },
    {
      show: true,
      label: '批量客户导入',
      value: 'multi',
    },
  ],
};

// 分组的表格列数据
export const custGroupColumns = [{
  key: 'groupName',
  value: '分组名称',
},
{
  key: 'xComments',
  value: '分组描述',
},
{
  key: 'relatCust',
  value: '客户数',
}];

// 分组下客户列表的表格列数据
export const groupCustColumns = [{
  key: 'custName',
  value: '姓名',
},
{
  key: 'brokerNumber',
  value: '经纪客户号',
},
{
  key: 'levelName',
  value: '客户等级',
},
{
  key: 'riskLevelName',
  value: '风险等级',
}];

// 构造标签下列表的表头
export const labelCustColumns = [{
  key: 'custName',
  value: '姓名',
},
{
  key: 'brokerNumber',
  value: '经济客户号',
},
{
  key: 'levelName',
  value: '客户等级',
},
{
  key: 'riskLevelName',
  value: '风险等级',
},
{
  key: 'action',
  value: '操作',
}];

// 标签名称可输入字符的正则
export const LABEL_NAME_REG = /^[#&\-_@%A-Za-z0-9\u4e00-\u9fa5]+$/;
