/**
 *@file customerPool/CustomerGrouplist
 *客户分组列表
 *@author zhuyanwen
 * */
import React, { PureComponent, PropTypes } from 'react';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import GroupTable from '../groupManage/GroupTable';
import './customerGrouplist.less';
import tableStyles from '../groupManage/groupTable.less';

const renderColumnTitle = () => [
  {
    key: 'groupName',
    value: '分组名称',
  },
  {
    key: 'xComments',
    value: '分组描述',
  },
  {
    key: 'createdTm',
    value: '创建时间',
  },
];
export default class CustomerGrouplist extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    onRowSelectionChange: PropTypes.func.isRequired,
    onSingleRowSelectionChange: PropTypes.func.isRequired,
    currentSelectRowKeys: PropTypes.array.isRequired,
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.groupId }));
    }

    return [];
  }

  render() {
    const {
      data,
      onRowSelectionChange,
      onSingleRowSelectionChange,
      currentSelectRowKeys,
      page,
      onSizeChange,
      onPageChange,
    } = this.props;

    const {
      totalRecordNum,
      curPageNum,
      curPageSize,
    } = page;

    // 构造表格头部
    const titleColumn = renderColumnTitle();

    const dataSource = this.addIdToDataSource(data);

    return (
      <GroupTable
        pageData={{
          curPageNum,
          curPageSize,
          totalRecordNum,
        }}
        listData={dataSource}
        onSizeChange={onSizeChange}
        onPageChange={onPageChange}
        tableClass={
          classnames({
            [tableStyles.groupTable]: true,
          })
        }
        titleColumn={titleColumn}
        columnWidth={['35%', '35%', '20%']}
        isNeedRowSelection
        onSingleRowSelectionChange={onSingleRowSelectionChange}
        onRowSelectionChange={onRowSelectionChange}
        currentSelectRowKeys={currentSelectRowKeys}
      />
    );
  }

}
