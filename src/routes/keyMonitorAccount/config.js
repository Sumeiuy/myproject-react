/**
 * @Author: sunweibin
 * @Date: 2018-06-20 14:44:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-02 16:35:28
 * @description 重点监控账户的配置项
 */
import _ from 'lodash';

// 表格Columns
export const LIST_TABLE_COLUMNS = [
  {
    title: '交易所',
    key: 'exchangeType',
    dataIndex: 'exchangeType',
    width: 120,
  },
  {
    title: '名单类型',
    key: 'listType',
    dataIndex: 'listType',
    width: 200,
  },
  {
    title: '一码通号码',
    key: 'ecifId',
    dataIndex: 'ecifId',
    width: 150,
  },
  {
    title: '证券账户',
    key: 'stockAccount',
    dataIndex: 'stockAccount',
    width: 150,
  },
  {
    title: '指定交易会员/托管会员',
    key: 'memberCode',
    dataIndex: 'memberCode',
    width: 200,
  },
  {
    title: '监管措施类型',
    key: 'punishType',
    dataIndex: 'punishType',
    width: 200,
  },
  {
    title: '盘后限制起始日期',
    key: 'tradelimitBeginDate',
    dataIndex: 'tradelimitBeginDate',
    width: 150,
    render(text) {
      if (typeof text === 'string') {
        return text.substr(0, 10);
      }
      return '';
    },
  },
  {
    title: '盘后限制截止日期',
    key: 'tradelimitEndDate',
    dataIndex: 'tradelimitEndDate',
    width: 150,
    render(text) {
      if (typeof text === 'string') {
        return text.substr(0, 10);
      }
      return '';
    },
  },
  {
    title: '重点监控开始日期',
    key: 'beginDate',
    dataIndex: 'beginDate',
    width: 150,
    render(text) {
      if (typeof text === 'string') {
        return text.substr(0, 10);
      }
      return '';
    },
  },
  {
    title: '重点监控结束日期',
    key: 'endDate',
    dataIndex: 'endDate',
    width: 150,
    render(text) {
      if (typeof text === 'string') {
        return text.substr(0, 10);
      }
      return '';
    },
  },
  {
    title: '客户名称',
    key: 'clientName',
    dataIndex: 'clientName',
    width: 150,
  },
  {
    title: '是否为我司客户',
    key: 'isSelfclient',
    dataIndex: 'isSelfclient',
    width: 120,
    render(text) {
      return text === '1' ? '是' : '否';
    },
  },
  {
    title: '客户号',
    key: 'custNumber',
    dataIndex: 'custNumber',
    width: 200,
  },
  {
    title: '客户所属分公司',
    key: 'companyName',
    dataIndex: 'companyName',
    width: 200,
  },
  {
    title: '客户所属营业部',
    key: 'orgName',
    dataIndex: 'orgName',
    width: 200,
  },
  {
    title: '客户服务经理',
    key: 'managerName',
    dataIndex: 'managerName',
    width: 150,
    render(text, record) {
      if (_.isNull(text) || _.isNull(record.managerNo)) {
        return '';
      }
      return `${text}(${record.managerNo})`;
    },
  },
];
  // 下拉选项的默认选项
export const DEFAULT_OPTION = {
  key: '',
  value: '不限',
};

// 是否我司客户下拉选项
export const IS_OUR_CUST_OPTIONS = [
  {
    key: '',
    value: '',
    label: '不限',
  },
  {
    key: '1',
    value: '1',
    label: '是',
  },
  {
    key: '0',
    value: '0',
    label: '否',
  },
];
