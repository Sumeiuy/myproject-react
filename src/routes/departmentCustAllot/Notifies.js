/**
 * @Description: 分公司客户分配消息提醒页面
 * @Author: Liujianshu
 * @Date: 2018-05-25 13:55:42
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-07-18 17:34:18
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import Barable from '../../decorators/selfBar';
import fspPatch from '../../decorators/fspPatch';
import withRouter from '../../decorators/withRouter';
import { dva, emp } from '../../helper';
import config from '../../components/departmentCustAllot/config';
import styles from './notifies.less';

const dispatch = dva.generateEffect;

// 登陆人的组织 ID
const empOrgId = emp.getOrgId();
// 登陆人的职位 ID
const empPstnId = emp.getPstnId();

// 表格标题
const { titleList: { notifiCust }, allotType } = config;
const PAGE_SIZE = 20;
const KEY_CUSTNAME = 'custName';

const effects = {
  // 获取数据
  queryAddedCustList: 'departmentCustAllot/queryAddedCustList',
};

const mapStateToProps = state => ({
  // 数据
  addedCustData: state.departmentCustAllot.addedCustData,
});

const mapDispatchToProps = {
  // 获取数据
  queryAddedCustList: dispatch(effects.queryAddedCustList, { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
@fspPatch()
export default class DepartmentCustAllotNotifies extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    addedCustData: PropTypes.object.isRequired,
    queryAddedCustList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      location: {
        query: {
          appId,
        },
      },
      queryAddedCustList,
    } = this.props;
    const payload = {
      id: appId,
      pageNum: 1,
      pageSize: PAGE_SIZE,
      orgId: empOrgId,
      positionId: empPstnId,
      pageType: 'success',
      type: allotType,
    };
    queryAddedCustList(payload);
  }

  // 生成表格标题列表
  @autobind
  getColumnsTitle() {
    const newTitleList = [...notifiCust];
    const custNameColumn = _.find(newTitleList, o => o.key === KEY_CUSTNAME);
    custNameColumn.render = (text, record) => (
      <div>{text}({record.custId})</div>
    );
    return newTitleList;
  }

  // 分页
  @autobind
  pageChangeHandle(page, pageSize) {
    const {
      location: {
        query: {
          appId,
        },
      },
      queryAddedCustList,
    } = this.props;
    const payload = {
      id: appId,
      pageNum: page,
      pageSize,
      orgId: empOrgId,
      positionId: empPstnId,
      pageType: 'success',
      type: allotType,
    };
    queryAddedCustList(payload);
  }

  render() {
    const { addedCustData: { list = [], page = {} } } = this.props;
    const tableTitleList = this.getColumnsTitle();
    // 分页
    const paginationOption = {
      current: page.curPageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: PAGE_SIZE,
      onChange: this.pageChangeHandle,
    };
    return (
      <div className={styles.notifiesWrapper}>
        <div className={styles.success}>
          <h2>通知提醒</h2>
          <h3 className={styles.title}>有以下客户划入您名下！</h3>
          <CommonTable
            data={list}
            titleList={tableTitleList}
          />
          <Pagination {...paginationOption} />
        </div>
      </div>
    );
  }
}
