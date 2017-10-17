import React, { PureComponent, PropTypes } from 'react';
import { Table } from 'antd';

export default class RecordList extends PureComponent {

  static propTypes = {
    data: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
  }

  render() {
    const {
      data,
      // page,
    } = this.props;
    const columns = [
      {
        title: '事件',
        dataIndex: 'eventName',
        key: 'eventName',
      },
      {
        title: '客户姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '经纪号',
        dataIndex: 'custId',
        key: 'custId',
      },
      {
        title: '服务渠道',
        dataIndex: 'serverChannel',
        key: 'serverChannel',
      },
      {
        title: '服务记录',
        dataIndex: 'serverRecord',
        key: 'serverRecord',
      },
      {
        title: '实施者',
        dataIndex: 'actCreatedBy',
        key: 'actCreatedBy',
      },
      {
        title: '服务时间',
        dataIndex: 'serverDate',
        key: 'serverDate',
      },
      {
        title: '客户反馈',
        dataIndex: 'callBack',
        key: 'callBack',
      },
      {
        title: '反馈时间',
        dataIndex: 'xFeedBackDate',
        key: 'xFeedBackDate',
      },
      {
        title: '工作结果',
        dataIndex: 'ant',
        key: 'ant',
      },
      {
        title: '服务状态',
        dataIndex: 'asStatus',
        key: 'asStatus',
      },
      {
        title: '营业部',
        dataIndex: 'orgName',
        key: 'orgName',
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={data}
      />
    );
  }
}
