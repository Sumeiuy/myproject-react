/**
 * @file invest/CustRangeForList.js
 *  客户范围组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Pagination, Checkbox } from 'antd';

import { fspContainer } from '../../config';
import { fspGlobal } from '../../utils';
import NoData from './NoData';
import CustomerRow from './CustomerRow';

import styles from './customerLists.less';

export default class CustomerLists extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    custList: PropTypes.array.isRequired,
    curPageNum: PropTypes.string,
    pageSize: PropTypes.string,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    q: PropTypes.string,
    source: PropTypes.string.isRequired,
    monthlyProfits: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    isAllSelect: PropTypes.bool.isRequired,
    selectedIds: PropTypes.array.isRequired,
    saveIsAllSelect: PropTypes.func.isRequired,
    saveSelectedIds: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageSize: null,
    curPageNum: null,
    q: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      taskAndGroupLeftPos: '0',
    };
  }

  componentDidMount() {
    this.setTaskAndGroup();
    const sidebarHideBtn = document.getElementById(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.getElementById(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.updateLeftPos);
      sidebarShowBtn.addEventListener('click', this.updateLeftPos);
    }
  }

  componentDidUpdate() {
    this.setTaskAndGroup();
  }

  componentWillUnmount() {
    const sidebarHideBtn = document.getElementById(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.getElementById(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.updateLeftPos);
      sidebarShowBtn.removeEventListener('click', this.updateLeftPos);
    }
  }

  @autobind
  setTaskAndGroup() {
    const workspaceSidebar = document.getElementById(fspContainer.workspaceSidebar);
    if (workspaceSidebar) {
      this.setState({
        taskAndGroupLeftPos: `${workspaceSidebar.offsetWidth}px`,
      });
    }
  }

  updateLeftPos() {
    const workspaceSidebar = document.getElementById(fspContainer.workspaceSidebar);
    const fixedEleDom = document.getElementById('fixedEleDom');
    if (fixedEleDom && workspaceSidebar) {
      fixedEleDom.style.left = `${workspaceSidebar.offsetWidth}px`;
    }
  }

  @autobind
  handleSingleSelect(id) {
    const { selectedIds, saveSelectedIds } = this.props;
    if (_.includes(selectedIds, id)) {
      saveSelectedIds(selectedIds.filter(v => v !== id));
    } else {
      saveSelectedIds([...selectedIds, id]);
    }
  }

  @autobind
  selectAll(e) {
    const isAllSelect = e.target.checked;
    const { saveIsAllSelect, saveSelectedIds, selectedIds } = this.props;
    saveIsAllSelect(isAllSelect);
    const newSelectedIds = !isAllSelect ? selectedIds : [];
    saveSelectedIds(newSelectedIds);
  }

  @autobind
  handleClick(url, title, id) {
    // debugger
    const {
      page,
      isAllSelect,
      selectedIds,
      location: { query },
    } = this.props;
    const selectCount = isAllSelect ? page.total : selectedIds.length;
    if (!_.isEmpty(selectedIds)) {
      this.openByIds(url, selectedIds, selectCount, title, id);
    } else if (isAllSelect) {
      this.openByAllSelect(url, query, selectCount, title, id);
    }
  }

  @autobind
  openByIds(url, ids, count, title, id) {
    // debugger
    if (document.querySelector(fspContainer.container)) {
      const newurl = `${url}?ids=${encodeURIComponent(ids.join(','))}&count=${count}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id, // 'FSP_SERACH',
        title, // '搜索目标客户',
      };
      fspGlobal.openRctTab({ url: newurl, param });
    } else {
      this.props.push({
        pathname: url,
        query: {
          ids: encodeURIComponent(ids.join(',')),
          count,
        },
      });
    }
  }

  @autobind
  openByAllSelect(url, query, count, title, id) {
    if (document.querySelector(fspContainer.container)) {
      const newurl = `${url}?condition=${encodeURIComponent(JSON.stringify(query))}&count=${count}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id, // 'FSP_SERACH',
        title, // '搜索目标客户',
      };
      fspGlobal.openRctTab({ url: newurl, param });
    } else {
      this.props.push({
        pathname: url,
        query: {
          condition: encodeURIComponent(JSON.stringify(query)),
          count,
        },
      });
    }
  }

  // 分组只针对服务经理，也就是说：
  // 1、搜素、标签客户池列表：客户列表是“我的客户”时可以添加用户分组
  // 2、业务办理客户池：默认是只显示自己负责客户的，所以可以添加用户分组
  // 3、业绩目标客户池：客户列表是“我的客户”时可以添加用户分组
  renderGroup() {
    const { source, location: { query: { orgId } } } = this.props;
    if ((source === 'search' || source === 'tag') && orgId) {
      return orgId === 'msm' ?
        <button
          onClick={() => { this.handleClick('/customerPool/customerGroup', '新建分组', 'FSP_GROUP'); }}
        >
          用户分组
        </button>
        :
        '';
    }
    if (source === 'business') {
      return (<button
        onClick={() => { this.handleClick('/customerPool/customerGroup', '新建分组', 'FSP_GROUP'); }}
      >
          用户分组
        </button>);
    }
    return null;
  }

  render() {
    const {
      taskAndGroupLeftPos,
    } = this.state;
    const {
      q,
      page,
      custList,
      curPageNum,
      pageSize,
      onPageChange,
      onSizeChange,
      getCustIncome,
      monthlyProfits,
      location,
      selectedIds,
      isAllSelect,
    } = this.props;
    if (!custList.length) {
      return <div className="list-box"><NoData /></div>;
    }
    // current: 默认第一页
    // pageSize: 默认每页大小10
    // curTotal: 当前列表数据总数
    let current = 1;
    let pagesize = 10;
    let curTotal = 0;
    if (curPageNum) {
      current = Number(curPageNum);
    } else {
      current = Number(page.pageNo);
    }
    if (pageSize) {
      pagesize = Number(pageSize);
    } else {
      pagesize = Number(page.pageSize);
    }
    if (page.total) {
      curTotal = Number(page.total);
    }
    // 是否显示底部的发起任务和分组，全选或者有选中数据时才显示
    const isShow = (!_.isEmpty(selectedIds) || isAllSelect) ? 'block' : 'none';
    // 已选中的条数：选择全选显示所有数据量，非全选显示选中的条数
    const selectCount = isAllSelect ? page.total : selectedIds.length;
    return (
      <div className="list-box">
        <div className={styles.selectAllBox}>
          <div className="selectAll">
            <Checkbox
              checked={isAllSelect}
              onChange={this.selectAll}
            >
              全选
            </Checkbox>
            <span className="hint">自动选择所有符合条件的客户</span>
          </div>
        </div>
        <div className="list-wrapper">
          {
            custList.map(
              item => <CustomerRow
                location={location}
                getCustIncome={getCustIncome}
                monthlyProfits={monthlyProfits}
                listItem={item}
                q={q}
                isAllSelect={isAllSelect}
                selectedIds={selectedIds}
                onChange={this.handleSingleSelect}
                key={`${item.empId}-${item.custId}-${item.idNum}-${item.telephone}-${item.asset}`}
              />,
            )
          }
        </div>
        <div className="list-pagination">
          <Pagination
            current={current}
            total={curTotal}
            pageSize={pagesize}
            onChange={onPageChange}
            size="small"
            showSizeChanger
            showTotal={total => `共${total}项`}
            onShowSizeChange={onSizeChange}
          />
          <Checkbox
            checked={isAllSelect}
            onChange={this.selectAll}
            className={styles.selectAllTwo}
          >
            全选
          </Checkbox>
        </div>
        <div
          id="fixedEleDom"
          className={styles.taskAndGroup}
          style={{
            left: taskAndGroupLeftPos,
            display: isShow,
          }}
        >
          <p className="left">
            已选&nbsp;
            <span className="mark">{selectCount}</span>
            &nbsp;户，选择目标用户以创建自定义任务，或者把用户加入分组管理
          </p>
          <div className="right">
            {this.renderGroup()}
            <button
              onClick={() => { this.handleClick('/customerPool/createTask', '发起任务', 'RCT_FSP_TASK'); }}
            >
              发起任务
            </button>
          </div>
        </div>
      </div>
    );
  }
}
