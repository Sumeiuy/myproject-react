/**
 * @Author: hongguangqing
 * @Date: 2018-03-01 14:25:34
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-07-31 17:38:32
 */
/*
 * @Description: 服务经理主职位设置的配置文件
 * @Author: hongguangqing
 * @Date: 2018-03-01 13:43:38
 */

import React from 'react';
import { serviceManager, status, drafter, department, approver } from '../../config/busApplyFilters';

const config = {
  // 服务经理主职位设置
  mainPosition: {
    pageName: '服务经理主职位设置',
    pageType: '08', // 查询列表接口中的type值
    status: [
      {
        show: true,
        label: '不限',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '驳回',
        value: '04',
      },
    ],
    titleList: [
      {
        dataIndex: 'position',
        key: 'position',
        title: '职位',
        render: (text, record) => (
          <span className="mainPosition">
            <span>
              {
                record.primary === true ? <span className="mainIcon">主</span> : null
              }
              <span>{record.position}</span>
            </span>
          </span>
        ),
      },
      {
        dataIndex: 'department',
        key: 'department',
        title: '部门',
      },
    ],
    approvalColumns: [
      {
        title: '工号',
        dataIndex: 'login',
        key: 'login',
        align: 'center',
      }, {
        title: '姓名',
        dataIndex: 'empName',
        key: 'empName',
        align: 'center',
      }, {
        title: '所属营业部',
        dataIndex: 'occupation',
        key: 'occupation',
        align: 'center',
      },
    ],
    basicFilters: [
      serviceManager,
      status,
      drafter,
      department,
    ],
    moreFilters: [
      approver,
    ],
    moreFilterData: [
      { value: '审批人', key: 'approvalId' },
    ],
  },
};

export default config;
