/* 分组转标签第一步
 * @Author: WangJunJun
 * @Date: 2018-08-06 17:42:24
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-13 14:13:20
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Table from '../../common/commonTable';
import { custGroupColumns } from '../config';
import tableStyles from '../../common/commonTable/index.less';
import styles from './firstContent.less';

export default class FirstContent extends PureComponent {
  static propTypes = {
    queryCustGroupList: PropTypes.func.isRequired,
    custGroupListInfo: PropTypes.object.isRequired,
    handleSelectGroup: PropTypes.func.isRequired,
    currentSelectRow: PropTypes.object.isRequired,
  }

  // 将列表数据项加一个id字段
  @autobind
  generateListData() {
    const {
      custGroupListInfo: {
        custGroupDTOList,
      },
    } = this.props;
    return _.map(custGroupDTOList, item => ({ ...item, id: item.groupId }));
  }

  // 点击分组名称前的单选按钮
  @autobind
  handleSingleRowSelectionChange(record) {
    this.props.handleSelectGroup(record);
  }

  // 翻页
  @autobind
  handlePageChange(pageNum, pageSize) {
    this.props.queryCustGroupList({
      pageNum,
      pageSize,
    });
  }

  render() {
    const {
      custGroupListInfo: {
        curPageNum,
        pageSize,
        totalRecordNum,
      },
      handleSelectGroup,
      currentSelectRow,
    } = this.props;
    const listData = this.generateListData();
    return (
      <div className={styles.modalContent}>
        <p className={styles.tableTitle}>请选择分组</p>
        <Table
          pageData={{
            curPageNum,
            curPageSize: pageSize,
            totalRecordNum,
          }}
          listData={listData}
          onPageChange={this.handlePageChange}
          tableClass={`${tableStyles.groupTable} ${styles.groupListTable}`}
          titleColumn={custGroupColumns}
          isFirstColumnLink
          firstColumnHandler={handleSelectGroup}
          scrollY={411}
          columnWidth={['26%', '54%', '13%']}
          isFixedTitle
          emptyListDataNeedEmptyRow
          isNeedRowSelection
          onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
          currentSelectRowKeys={[currentSelectRow.id]}
        />
      </div>
    );
  }
}
