/*
 * @Author: WangJunJun
 * @Date: 2018-08-03 13:14:10
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-09 17:46:31
 */

 // 标签列表默认数据的页码和一页大小
export const INITIAL_PAGESIZE = 10;
export const INITIAL_CURPAGE = 1;

export const MODALTITLE_CREATELABEL = '新建标签';

export const MODALTITLE_EDITLABEL = '编辑标签';

// 构造标签列表的表头
export const COLUMNS_LABELTABLE = [
{
  key: 'labelName',
  value: '标签名称',
},
{
  key: 'labelDesc',
  value: '标签描述',
},
{
  key: 'createdOrgId',
  value: '创建部门',
},
{
  key: 'custCount',
  value: '客户数',
},
{
  key: 'action',
  value: '操作',
}];
