/**
 * @Author: hongguangqing
 * @Descripter: 投顾手机分配状态页面
 * @Date: 2018-04-17 16:49:00
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-18 09:27:31
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
// import { Icon } from 'antd';
import _ from 'lodash';
import Table from '../../components/common/commonTable';
import DistributeHeader from '../../components/telephoneNumberManage/DistributeHeader';
import withRouter from '../../decorators/withRouter';
import { dva } from '../../helper';
import seibelHelper from '../../helper/page/seibel';
import styles from './distributeHome.less';

const EMPTY_OBJECT = {};
const dispatch = dva.generateEffect;
const effects = {
  // 服务经理列表
  queryEmpList: 'telephoneNumberManage/queryEmpList',
  // 部门机构树
  getCustRange: 'telephoneNumberManage/getCustRange',
  // 获取投顾手机分配页面表格数据
  queryTgBindTableList: 'telephoneNumberManage/queryTgBindTableList',
};
const mapStateToProps = state => ({
  empList: state.telephoneNumberManage.empList,
  custRange: state.telephoneNumberManage.custRange,
  tgBindTableList: state.telephoneNumberManage.tgBindTableList,
});

const mapDisPatchToProps = {
  replace: routerRedux.replace,
  queryEmpList: dispatch(effects.queryEmpList, { loading: false }),
  getCustRange: dispatch(effects.getCustRange, { loading: false }),
  queryTgBindTableList: dispatch(effects.queryTgBindTableList, { loading: false }),
};

@connect(mapStateToProps, mapDisPatchToProps)
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
    tgBindTableList: PropTypes.object.isRequired,
    queryTgBindTableList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: 1,
    };
  }

  componentWillMount() {
    const { location: { query, query: { pageNum } } } = this.props;
    this.getTgBindTableList(query, pageNum, 10);
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { replace, location } = this.props;
    const { query, pathname } = location;
    // 清空掉消息提醒页面带过来的 id
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
    // 2.调用queryTgBindList接口
    this.getTgBindTableList({ ...query, ...obj }, 1, 10);
  }

  // 请求表格数据
  @autobind
  getTgBindTableList(query, pageNum = 1, pageSize = 10) {
    const { queryTgBindTableList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    queryTgBindTableList({ ...params, type: '01' });
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
        pageSize: currentPageSize,
      },
    });
    this.getTgBindTableList(query, nextPage, currentPageSize);
  }

    /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  @autobind
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, (item, index) => _.merge(item, { id: index }),
      );
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
      <span>{empName}（{empId}）</span>
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
        key: 'ismi',
        value: '手机串号',
      },
      {
        key: 'sim',
        value: 'sim卡号',
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
      tgBindTableList,
    } = this.props;
    const { tgBindList, page } = tgBindTableList;
    // 添加id到dataSource
    const newTgBindList = this.addIdToDataSource(tgBindList);
    console.warn('tgBindTableList', tgBindTableList);
    console.warn('newTgBindList', newTgBindList);
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
          listData={newTgBindList}
          onSizeChange={this.handlePageSizeChange}
          tableClass={styles.tbBindListTable}
          titleColumn={this.renderColumn()}
          columnWidth={['15%', '12%', '16%', '16%', '16%', '25%']}
          emptyListDataNeedEmptyRow
        />
      </div>
    );
  }
}
