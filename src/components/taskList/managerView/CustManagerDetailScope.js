/*
 * @Author: xuxiaoqin
 * @Date: 2018-04-09 21:41:03
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-05-05 18:45:02
 * 服务经理维度任务统计
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

import { Dropdown, Menu } from 'antd';
import Table from '../../common/commonTable';
import antdStyles from '../../../css/antd.less';
import styles from './custManagerDetailScope.less';
import { ORG_LEVEL1, ORG_LEVEL2 } from '../../../config/orgTreeLevel';
import {
  EMP_MANAGER_SCOPE,
  EMP_DEPARTMENT_SCOPE,
  EMP_COMPANY_SCOPE,
  ALL_EMP_SCOPE_ITEM,
  EMP_COMPANY_COLUMN_FOR_FIRST,
  EMP_COMPANY_COLUMN_FOR_LAST,
  EMP_DEPARTMENT_COLUMN_FOR_FIRST,
  EMP_DEPARTMENT_COLUMN_FOR_LAST,
} from '../../../config/managerViewCustManagerScope';
import { getCurrentScopeByOrgLevel, getCurrentScopeByOrgId } from './helper';


const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const NOOP = _.noop;

// 初始化分页条目
const INITIAL_PAGE_SIZE = 5;
// 初始化页码
const INITIAL_PAGE_NUM = 1;

const Item = Menu.Item;

export default class CustManagerDetailScope extends PureComponent {

  static propTypes = {
    detailData: PropTypes.object,
    // 当前组织机构层级
    currentOrgLevel: PropTypes.string,
    // 是否处于折叠状态
    isFold: PropTypes.bool,
    getCustManagerScope: PropTypes.func,
    // 当前可供筛选的维度
    currentScopeList: PropTypes.array,
    // 当前任务id
    currentId: PropTypes.string,
    // 组织机构
    custRange: PropTypes.array,
    // 机构orgId
    orgId: PropTypes.string,
  }

  static defaultProps = {
    detailData: EMPTY_OBJECT,
    currentOrgLevel: '',
    isFold: false,
    getCustManagerScope: NOOP,
    currentScopeList: EMPTY_LIST,
    currentId: '',
    custRange: EMPTY_LIST,
    orgId: '',
  }

  constructor(props) {
    super(props);
    const { custRange, orgId } = props;
    this.state = {
      // 当前选择的维度
      // 页面从无到有的过程中，orgId不一定是初始化的orgId，需要将外部传入的orgId传入进行
      // 比对，得出当前维度
      currentSelectScope: getCurrentScopeByOrgId({ custRange, orgId }),
      dataSource: EMPTY_LIST,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentOrgLevel,
      currentId,
      detailData: { list = EMPTY_LIST },
    } = this.props;
    const {
      currentOrgLevel: nextOrgLevel,
      currentId: nextMssnId,
      custRange,
      detailData: { list: nextList = EMPTY_LIST },
    } = nextProps;
    // 当组织机构树发生变化
    // 设置默认维度
    if (currentOrgLevel !== nextOrgLevel) {
      this.setState({
        currentSelectScope: getCurrentScopeByOrgLevel(nextOrgLevel),
      });
    }
    // 当任务切换
    // 设置默认维度
    // 任务id切换了，orgId肯定恢复原始了，不需要将外部的orgId传入getCurrentScopeByOrgId
    if (currentId !== nextMssnId) {
      this.setState({
        currentSelectScope: getCurrentScopeByOrgId({ custRange }),
      });
    }
    // 用来处理列改变的时候，primaryKey会为空的情况，所以将数据源用内部状态控制
    if (list !== nextList) {
      this.setState({
        dataSource: this.addIdToDataSource(nextList),
      });
    }
  }

  @autobind
  getFilterPopupContainer() {
    return this.filterElem;
  }

  /**
   * 获取列表的主键，根据不同的维度，主键不一样
   */
  @autobind
  getPrimaryKey(item) {
    const { currentSelectScope } = this.state;
    let id = `${item.mssnId}-${item.login}-${item.custDepartmentCode}`;
    if (currentSelectScope === EMP_COMPANY_SCOPE) {
      id = `${item.mssnId}-${item.empCompanyCode}`;
    } else if (currentSelectScope === EMP_DEPARTMENT_SCOPE) {
      id = `${item.mssnId}-${item.empDepartmentCode}`;
    }

    return id;
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    return _.map(listData, item => ({
      ...item,
      id: this.getPrimaryKey(item),
    }));
  }

  /**
   * 切换分页
   * @param {*number} pageNum 当前分页
   * @param {*number} pageSize 当前页码
   */
  @autobind
  handlePageChange(pageNum, pageSize) {
    const { getCustManagerScope } = this.props;
    const { currentSelectScope } = this.state;
    getCustManagerScope({
      pageNum,
      pageSize,
      enterType: currentSelectScope,
    });
  }

  /**
   * 选中一个维度，触发回调，请求当前维度的信息
   */
  @autobind
  handleSelectMenuItem({ key }) {
    this.setState({
      currentSelectScope: key,
    }, () => {
      // 为了防止数据回来了，但是scope还没更新，导致getPrimaryKey出现问题
      this.props.getCustManagerScope({
        // 当前维度
        enterType: key,
      });
    });
  }

  /**
   * 设置当前filter对应的element
   * @param {*node} input 当前element
   */
  @autobind
  saveFilterRef(input) {
    this.filterElem = input;
  }

  /**
   * 渲染服务经理的姓名和工号在一列
   * @param {*object} record 当前行记录
   */
  @autobind
  renderManagerNameId(record = EMPTY_OBJECT) {
    const { empName, login } = record;
    return (
      <span>{empName || '--'}（{login || '--'}）</span>
    );
  }

  /**
   * 渲染各个种类的客户总数和比例
   * @param {*object} record 当前行记录
   */
  @autobind
  renderEveryCust(custTotal, everyCust) {
    const percent = ((everyCust / custTotal) * 100).toFixed(0);

    return (
      <span>{everyCust}（{percent}%）</span>
    );
  }

  /**
   * Menu的子选项
   */
  @autobind
  renderFilterOption() {
    const { currentScopeList } = this.props;
    return _.map(currentScopeList, item => <Item key={item.key}>{item.value}</Item>);
  }

  /**
   * 渲染表头
   */
  @autobind
  renderTableTitle() {
    const { currentSelectScope } = this.state;

    return (
      <div className={styles.titleSection}>
        <div className={`${styles.tableTitle} tableTitle`}>明细进度</div>
        <div
          className={styles.scopeSelect}
          ref={this.saveFilterRef}
        >
          <Dropdown
            // dropdown的trigger需要数组
            trigger={['click']}
            overlay={
              <Menu
                onClick={this.handleSelectMenuItem}
                selectedKeys={[currentSelectScope || EMP_MANAGER_SCOPE]}
              >
                {this.renderFilterOption()}
              </Menu>
            }
            placement="bottomRight"
            getPopupContainer={this.getFilterPopupContainer}
          >
            <div>
              <span className={styles.title}>查看维度：</span>
              <span className={styles.currentSelectScope}>
                {_.filter(ALL_EMP_SCOPE_ITEM, item =>
                  item.key === (currentSelectScope || EMP_MANAGER_SCOPE))[0].value}
              </span>
              <span
                className="ant-select-arrow"
                unselectable="unselectable"
              >
                <b />
              </span>
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }

  /**
   * 渲染列的数据，在省略打点的时候，悬浮的title内容，因为有可能一列展示两列内容
   * 所以需要自定义，不需要自定义的时候，Table的column直接展示当前内容
   * @param {*object} record 当前行记录
   */
  @autobind
  renderCoulmnTitleTooltip(record = EMPTY_OBJECT) {
    const { empName, login } = record;
    return `${empName}（${login}）`;
  }

  /**
   * 渲染第一列
   * 如果选择了服务经理，第一列展示服务经理，
   * 如果选择了分公司，第一列展示分公司
   * 如果选择了营业部，第一列展示营业部
   */
  renderFirstCoulmn() {
    const { currentSelectScope } = this.state;
    if (currentSelectScope === EMP_COMPANY_SCOPE) {
      return [EMP_COMPANY_COLUMN_FOR_FIRST];
    } else if (currentSelectScope === EMP_DEPARTMENT_SCOPE) {
      return [EMP_DEPARTMENT_COLUMN_FOR_FIRST];
    }

    // 默认展示服务经理列
    return [{
      key: 'login',
      value: '服务经理',
      render: this.renderManagerNameId,
      renderTitle: this.renderCoulmnTitleTooltip,
    }];
  }

  /**
   * 渲染表格最后两列
   */
  renderLastTwoColumn() {
    const { currentSelectScope } = this.state;
    const { currentOrgLevel } = this.props;
    if (currentSelectScope === EMP_MANAGER_SCOPE) {
      // 服务经理维度，最后两列，根据层级，展示分公司或营业部
      if (currentOrgLevel === ORG_LEVEL1) {
        return [EMP_COMPANY_COLUMN_FOR_LAST, EMP_DEPARTMENT_COLUMN_FOR_LAST];
      } else if (currentOrgLevel === ORG_LEVEL2) {
        return [EMP_DEPARTMENT_COLUMN_FOR_LAST];
      }
    }

    // 分公司维度，
    // 营业部维度
    return EMPTY_LIST;
  }

  /**
   * 渲染每一列数据
   */
  @autobind
  renderColumn() {
    const columnTitle = [
      ...this.renderFirstCoulmn(),
      {
        key: 'flowNum',
        value: '客户总数',
      },
      {
        key: 'servFlowNum',
        value: '已服务客户',
        render: ({ flowNum, servFlowNum: everyCust }) =>
          this.renderEveryCust(flowNum, everyCust),
      },
      {
        key: 'doneFlowNum',
        value: '已完成客户',
        render: ({ flowNum, doneFlowNum: everyCust }) =>
          this.renderEveryCust(flowNum, everyCust),
      },
      {
        key: 'traceFlowNum',
        value: '结果达标客户',
        render: ({ flowNum, traceFlowNum: everyCust }) =>
          this.renderEveryCust(flowNum, everyCust),
      },
      ...this.renderLastTwoColumn(),
    ];

    return columnTitle;
  }

  /**
   * 渲染每一列的宽度
   */
  @autobind
  renderColumnWidth() {
    const { isFold, currentOrgLevel } = this.props;
    let columnWidth = [];
    let columnWidthTotal = 0;

    if (isFold) {
      columnWidthTotal = 870;
      // 列的总宽度870px
      // 处于折叠状态，每一列的宽度需要增加
      columnWidth = ['150px', '180px', '180px', '180px', '180px'];
      if (currentOrgLevel === ORG_LEVEL1) {
        // 多展示两列数据
        columnWidth = [...columnWidth, '180px', '180px'];
        columnWidthTotal = 1230;
      } else if (currentOrgLevel === ORG_LEVEL2) {
        // 多展示一列数据
        columnWidth = [...columnWidth, '180px'];
        columnWidthTotal = 1050;
      }
    } else {
      columnWidthTotal = 630;
      // 处于展开状态,
      // 列的总宽度630px
      columnWidth = ['150px', '120px', '120px', '120px', '120px'];
      if (currentOrgLevel === ORG_LEVEL1) {
        // 多展示两列数据
        columnWidth = [...columnWidth, '120px', '180px'];
        columnWidthTotal = 930;
      } else if (currentOrgLevel === ORG_LEVEL2) {
        // 多展示一列数据
        columnWidth = [...columnWidth, '180px'];
        columnWidthTotal = 810;
      }
    }

    return {
      columnWidth,
      columnWidthTotal,
    };
  }

  render() {
    const { detailData = EMPTY_OBJECT, isFold } = this.props;
    const { dataSource } = this.state;
    const { page = EMPTY_OBJECT } = detailData;
    const { pageNum, pageSize, totalCount } = page;
    const {
      columnWidth,
      columnWidthTotal,
    } = this.renderColumnWidth();

    return (
      <div className={styles.container}>
        <Table
          pageData={{
            curPageNum: pageNum || INITIAL_PAGE_NUM,
            curPageSize: pageSize || INITIAL_PAGE_SIZE,
            totalRecordNum: totalCount,
          }}
          listData={dataSource}
          onPageChange={this.handlePageChange}
          tableClass={
            classnames({
              [styles.custManagerScopeTable]: true,
              // 展开的样式
              [styles.notFoldedScope]: !isFold,
              // 折叠的样式
              [styles.foldedScope]: isFold,
              [antdStyles.tableHasBetweenSpace]: true,
            })
          }
          columnWidth={columnWidth}
          titleColumn={this.renderColumn()}
          // 分页器样式
          paginationClass="selfPagination"
          needPagination
          isFixedColumn
          // 横向滚动，固定服务经理列
          fixedColumn={[0]}
          // 列的总宽度加上固定列的宽度
          scrollX={columnWidthTotal}
          title={this.renderTableTitle}
          emptyListDataNeedEmptyRow
        />
      </div>
    );
  }
}
