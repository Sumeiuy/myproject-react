/*
 * @Author: wangyikai
 * @Date: 2018-11-19 16:27:30
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-28 14:52:51
 */
import React from 'react';
import _ from 'lodash';
import Icon from '../common/Icon';
import styles from './businessHand.less';

const config = {
  // 已开通业务
  openBusinessColumns: [
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      className: 'firstStyle',
    },
    {
      title: '开通日期',
      dataIndex: 'openDate',
      key: 'openDate',
      className: 'publicStyle',
    },
    {
      title: '开通时达标资产(万元)',
      dataIndex: 'standardAssets',
      key: 'standardAssets',
      align: 'right',
      className: 'rightStyle',
    },
    {
      title: '风险等级',
      dataIndex: 'riskGrade',
      key: 'riskGrade',
      className: 'publicStyle',
    },
    {
      title: '全市场首次交易日期',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      className: 'publicStyle',
    },
    {
      title: '黑名单',
      dataIndex: 'blackList',
      key: 'blackList',
      className: 'publicStyle',
    },
    {
      title: '双录文件',
      dataIndex: 'recordFile',
      key: 'recordFile',
      className: 'rightStyle',
      render: (text) => {
        if (!_.isEmpty(text)) {
          return (<Icon type="chakanshipin" className={styles.businessHandlIcon} />);
        }
        return null;
      }
    },
  ],
  // 未开通业务
  notOpenBusinessColumns: [
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      className: 'firstStyle',
    },
    {
      title: '是否具备开通条件',
      dataIndex: 'openConditions',
      key: 'openConditions',
      className: 'maxStyle',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      className: 'lastStyle',
    }
  ],
  operationColumns: [
    {
      title: '序号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      className: 'firstStyle',
    },
    {
      title: '条件指标',
      dataIndex: 'conditionIndex',
      key: 'conditionIndex',
      className: 'firstStyle',
    },
    {
      title: '要求描述',
      dataIndex: 'requireDescription',
      key: 'requireDescription',
      className: 'firstStyle',
    },
    {
      title: '是否满足',
      dataIndex: 'isItSatisfied',
      key: 'isItSatisfied',
      className: 'firstStyle',
    },
    {
      title: '当前值',
      dataIndex: 'currentValue',
      key: 'currentValue',
      className: 'firstStyle',
    },
  ]
};
export default config;
export const {
  openBusinessColumns,
  notOpenBusinessColumns,
  operationColumns
} = config;
