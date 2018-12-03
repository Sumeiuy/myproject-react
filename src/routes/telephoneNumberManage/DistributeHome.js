/**
 * @Author: hongguangqing
 * @Descripter: 投顾手机分配状态页面
 * @Date: 2018-04-17 16:49:00
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-27 10:20:41
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Table from '../../components/common/commonTable';
import DistributeHeader from '../../components/telephoneNumberManage/DistributeHeader';
import config from '../../components/telephoneNumberManage/config';
import withRouter from '../../decorators/withRouter';
import { dva } from '../../helper';
import styles from './distributeHome.less';

const EMPTY_OBJECT = {};
const effect = dva.generateEffect;
const { telephoneNumDistribute: { pageType } } = config;
// 状态默认值为已分配
const DISTRIBUT_EDEFAULT_VALUE = 'Y';
const effects = {
  // 服务经理列表
  queryEmpList: 'telephoneNumberManage/queryEmpList',
  // 部门机构树
  getCustRange: 'telephoneNumberManage/getCustRange',
  // 获取投顾手机分配页面表格数据
  queryAdvisorBindList: 'telephoneNumberManage/queryAdvisorBindList',
};
const mapStateToProps = state => ({
  empList: state.telephoneNumberManage.empList,
  custRange: state.telephoneNumberManage.custRange,
  advisorBindListData: state.telephoneNumberManage.advisorBindListData,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  queryEmpList: effect(effects.queryEmpList, { loading: false }),
  getCustRange: effect(effects.getCustRange, { forceFull: true }),
  queryAdvisorBindList: effect(effects.queryAdvisorBindList, { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class DistributeHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 获取服务经理信息
    empList: PropTypes.array.isRequired,
    queryEmpList: PropTypes.func.isRequired,
    // 获取部门信息
    custRange: PropTypes.array.isRequired,
    getCustRange: PropTypes.func.isRequired,
    // 获取投顾手机分配页面表格数据
    advisorBindListData: PropTypes.object.isRequired,
    queryAdvisorBindList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // 先获取部门，然后根据部门数据数组中的第一个部门id去获取表格数据
    // 此时是获取该登录人所有岗位最大权限的列表数据
    this.props.getCustRange({
      type: pageType,
    }).then(() => {
      const { location, replace, custRange } = this.props;
      const { pathname, query } = location;
      const newQuery = {
        ...query,
        pageNum: 1,
        pageSize: 10,
        isBinding: DISTRIBUT_EDEFAULT_VALUE,
        orgId: custRange[0].id,
      };
      replace({
        pathname,
        query: newQuery,
      });
      this.getAdvisorBindList(newQuery);
    });
  }

  // 请求表格数据
  @autobind
  getAdvisorBindList(query) {
    const { queryAdvisorBindList } = this.props;
    // 默认筛选条件
    queryAdvisorBindList({ ...query });
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将筛选的值写入Url
    const { replace, location } = this.props;
    const { query, pathname } = location;
    const newQuery = { ...query, pageNum: 1, ...obj };
    replace({
      pathname,
      query: newQuery,
    });
    // 2.调用queryTgBindList接口
    this.getAdvisorBindList(newQuery);
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
      },
    });
    this.getAdvisorBindList({ ...query, pageNum: nextPage, pageSize: currentPageSize });
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  @autobind
  HandleDataSource(listData) {
    const { location: { query: { isBinding } } } = this.props;
    if (!_.isEmpty(listData)) {
      // 未分配时候不管后端给不给电话号码，手机串号，sim卡号，统一为显示--
      // isBinding为N代表未分配
      if (isBinding === 'N') {
        return _.map(listData, (item, index) => ({
          ...item,
          id: `${item.empId}-${index}`,
          phoneNumber: '--',
          imsi: '--',
          sim: '--',
          sim2: '--',
          modifyTime: '--',
        }));
      }
      return _.map(listData, (item, index) => ({
        ...item,
        id: `${item.empId}-${index}`,
      }));
    }
    return [];
  }

  /**
 * 渲染服务经理的姓名和工号在一列
 * @param {*object} record 当前行记录
 */
  @autobind
  renderManagerNameId(record = EMPTY_OBJECT) {
    const { empName, empId } = record;
    return (
      <span>
        {empName}
（
        {empId}
）
      </span>
    );
  }

  /**
 * 渲染每一列数据
 */
  @autobind
  renderColumn() {
    const titleColumn = [
      {
        key: 'empId',
        value: '服务经理',
        render: this.renderManagerNameId,
      },
      {
        key: 'superOrgName',
        value: '所属分公司',
      },
      {
        key: 'orgName',
        value: '所属营业部',
      },
      {
        key: 'phoneNumber',
        value: '电话号码',
      },
      {
        key: 'imsi',
        value: '手机串号',
      },
      {
        key: 'sim',
        value: 'SIM卡号1',
      },
      {
        key: 'sim2',
        value: 'SIM卡号2',
      },
      {
        key: 'modifyTime',
        value: '办结时间',
      },
    ];
    return titleColumn;
  }

  render() {
    const {
      location,
      location: { query: { pageNum = 1, pageSize = 10 } },
      replace,
      empList,
      queryEmpList,
      custRange,
      getCustRange,
      advisorBindListData,
    } = this.props;
    const { advisorBindList, page } = advisorBindListData;
    // 处理dataSource
    const newAdvisorBindList = this.HandleDataSource(advisorBindList);
    return (
      <div className={styles.distributeHomeBox}>
        <DistributeHeader
          location={location}
          replace={replace}
          empList={empList}
          queryEmpList={queryEmpList}
          custRange={custRange}
          getCustRange={getCustRange}
          filterCallback={this.handleHeaderFilter}
        />
        <Table
          pageData={{
            curPageNum: pageNum,
            curPageSize: pageSize,
            totalRecordNum: !_.isEmpty(page) ? page.totalRecordNum : 0,
          }}
          listData={newAdvisorBindList}
          onPageChange={this.handlePageNumberChange}
          tableClass={styles.advisorBindListTable}
          titleColumn={this.renderColumn()}
          columnWidth={['125px', '110px', '185px', '130px', '170px', '200px', '200px', '180px']}
          emptyListDataNeedEmptyRow
          // 分页器class
          paginationClass={styles.advisorBindListPagination}
          isFixedColumn
          scrollX={1300}
        />
      </div>
    );
  }
}
