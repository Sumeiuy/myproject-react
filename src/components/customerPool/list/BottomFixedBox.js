/**
 * @file components/customerPool/BottomFixedBox.js
 *  目标客户池列表页底部悬浮框，当列表中的数据被选中时显示
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { fspContainer } from '../../../config';
import { fspGlobal, helper } from '../../../utils';

import styles from './bottomFixedBox.less';

export default class BottomFixedBox extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    custList: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    condition: PropTypes.object.isRequired,
    selectCount: PropTypes.number.isRequired,
    mainServiceManager: PropTypes.bool,
    entertype: PropTypes.string.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    mainServiceManager: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      taskAndGroupLeftPos: '0',
    };
  }

  componentDidMount() {
    this.setTaskAndGroup();
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.updateLeftPos);
      sidebarShowBtn.addEventListener('click', this.updateLeftPos);
    }
  }

  componentDidUpdate() {
    this.setTaskAndGroup();
  }

  componentWillUnmount() {
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.updateLeftPos);
      sidebarShowBtn.removeEventListener('click', this.updateLeftPos);
    }
  }

  @autobind
  setTaskAndGroup() {
    const workspaceSidebar = document.querySelector(fspContainer.workspaceSidebar);
    if (workspaceSidebar) {
      this.setState({
        taskAndGroupLeftPos: `${workspaceSidebar.offsetWidth}px`,
      });
    }
  }

  @autobind
  updateLeftPos() {
    const workspaceSidebar = document.querySelector(fspContainer.workspaceSidebar);
    const fixedEleDom = document.querySelector('#fixedEleDom');
    if (fixedEleDom && workspaceSidebar) {
      fixedEleDom.style.left = `${workspaceSidebar.offsetWidth}px`;
    }
  }

  // 点击新建分组或者发起任务按钮
  @autobind
  handleClick(url, title, id) {
    const {
      page,
      condition,
      entertype,
      location: {
        query: {
          selectedIds,
          selectAll,
          source,
        },
        pathname,
        search,
      },
    } = this.props;
    const fr = encodeURIComponent(`${pathname}${search}`);
    if (selectedIds) {
      const selectedIdsArr = selectedIds.split(',');
      this.openByIds(
        url,
        condition,
        selectedIdsArr,
        selectedIdsArr.length,
        title,
        id,
        entertype,
        source,
        fr,
      );
    } else if (selectAll) {
      this.openByAllSelect(url, condition, page.total, title, id, entertype, source, fr);
    }
  }

  @autobind
  handleCreateTaskClick(url, title, id) {
    const { clearCreateTaskData } = this.props;
    // 发起新的任务之前，先清除数据
    clearCreateTaskData();

    this.handleClick(url, title, id);
  }

  // 单个点击选中时跳转到新建分组或者发起任务
  @autobind
  openByIds(url, condition, ids, count, title, id, entertype, source, fr) {
    const tmpArr = [];
    _(ids).forEach((item) => {
      tmpArr.push(item.split('.')[0]);
    });
    const idStr = encodeURIComponent(tmpArr.join(','));
    const name = encodeURIComponent(ids[0].split('.')[1]);
    const condt = encodeURIComponent(JSON.stringify(condition));
    const obj = {
      ids: idStr,
      count,
      entertype,
      source,
      name,
      condition: condt,
      fr,
    };
    if (document.querySelector(fspContainer.container)) {
      const newurl = `${url}?${helper.queryToString(obj)}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id,
        title,
      };
      fspGlobal.openRctTab({ url: newurl, param });
    } else {
      this.props.push({
        pathname: url,
        query: obj,
      });
    }
  }

  // 全选按钮选中时跳转到新建分组或者发起任务
  @autobind
  openByAllSelect(url, condition, count, title, id, entertype, source, fr) {
    // 全选时取整个列表的第一个数据的name属性值传给后续页面
    const name = encodeURIComponent(this.props.custList[0].name);
    const condt = encodeURIComponent(JSON.stringify(condition));
    const obj = {
      condition: condt,
      count,
      entertype,
      source,
      name,
      fr,
    };
    if (document.querySelector(fspContainer.container)) {
      const newurl = `${url}?${helper.queryToString(obj)}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id,
        title,
      };
      fspGlobal.openRctTab({ url: newurl, param });
    } else {
      this.props.push({
        pathname: url,
        query: obj,
      });
    }
  }

  // 分组只针对服务经理，也就是说：
  // 有首页指标查看权限或者服务经理筛选选的是当前登录用户时显示用户分组
  renderGroup() {
    if (this.props.mainServiceManager) {
      return (<button
        onClick={() => { this.handleClick('/customerPool/customerGroup', '新建分组', 'RCT_FSP_CUSTOMER_LIST'); }}
      >
        用户分组
      </button>);
    }
    return null;
  }

  renderCreateTaskBtn() {
    return (
      <button
        onClick={() => { this.handleCreateTaskClick('/customerPool/createTask', '发起任务', 'RCT_FSP_CUSTOMER_LIST'); }}
      >
        发起任务
      </button>
    );
  }

  @autobind
  renderText() {
    const {
      selectCount,
      mainServiceManager,
    } = this.props;
    let str = '';
    if (mainServiceManager) {
      str = '，或者把用户加入分组管理';
    }
    return (
      <p className="left">
        已选&nbsp;
        <span className="marked">{selectCount}</span>
        &nbsp;户，选择目标用户以创建自定义任务{str}
      </p>
    );
  }

  render() {
    const {
      taskAndGroupLeftPos,
    } = this.state;
    return (
      <div
        id="fixedEleDom"
        className={styles.taskAndGroup}
        style={{
          left: taskAndGroupLeftPos,
        }}
      >
        { this.renderText() }
        <div className="right">
          {this.renderGroup()}
          {this.renderCreateTaskBtn()}
        </div>
      </div>
    );
  }
}
