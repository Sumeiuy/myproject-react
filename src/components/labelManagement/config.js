/*
 * @Author: WangJunJun
 * @Date: 2018-08-06 21:15:03
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-09-10 11:15:51
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
  value: '经纪客户号',
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

// 标签描述的校验规则
export const VALIDATE_LABLENAME = [{
  required: true,
  message: '请输入标签名称',
}, {
  max: 8,
  message: '最多为8个字',
}, {
  min: 4,
  message: '最少为4个字',
}, {
  pattern: LABEL_NAME_REG,
  message: '可输入字符仅为汉字、数字、字母及合法字符(#&-_@%)',
}];

// 标签名称的校验规则
export const VALIDATE_LABLEDESC = [{
  required: true,
  message: '请输入标签描述',
}, {
  min: 10,
  message: '最少为10个字',
}, {
  max: 500,
  message: '最多为500个字',
}];
