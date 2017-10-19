/*
 * @Author: zhuyanwen
 * @Date: 2017-10-09 13:25:51
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-19 17:18:55
 * @description: 客户分组功能
 */

import React, { PureComponent, PropTypes } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { Tabs, Input, Row, Col, message } from 'antd';
import Button from '../../components/common/Button';
import styles from './customerGroup.less';
import CustomerGrouplist from '../../components/customerPool/group/CustomerGrouplist';
import AddNewGroup from '../../components/customerPool/group/AddNewGroup';
import AddCusSuccess from '../../components/customerPool/group/AddCusSuccess';
import { fspGlobal, helper } from '../../utils';


const CUR_PAGE = 1; // 默认当前页 0->1, 后端入参变化
const CUR_PAGESIZE = 10; // 默认页大小
const TabPane = Tabs.TabPane;
const CUR_KEYWORD = null;
let groupId = '';
const mapStateToProps = state => ({
  cusgroupList: state.customerPool.cusgroupList,
  cusgroupPage: state.customerPool.cusgroupPage,
  cusGroupSaveResult: state.customerPool.cusGroupSaveResult,
  cusGroupSaveMessage: state.customerPool.cusGroupSaveMessage,
  resultgroupId: state.customerPool.resultgroupId,
  // 更新分组信息成功与否
  operateGroupResult: state.customerPool.operateGroupResult,
});
const mapDispatchToProps = {
  goBack: routerRedux.goBack,
  go: routerRedux.go,
  push: routerRedux.push,
  replace: routerRedux.replace,
  getCustomerGroupList: query => ({
    type: 'customerPool/customerGroupList',
    payload: query || {},
  }),
  addCustomerToGroup: query => ({
    type: 'customerPool/addCustomerToGroup',
    payload: query || {},
  }),
  createCustGroup: query => ({
    type: 'customerPool/createCustGroup',
    payload: query || {},
  }),
  // 新增、编辑客户分组
  operateGroup: query => ({
    type: 'customerPool/operateGroup',
    payload: query || {},
  }),
};
const columns = [
  {
    title: '分组名称',
    dataIndex: 'groupName',
    key: 'groupName',
    render: item => <a title={item} className="groupNames">
      {item}
    </a>,
  },
  {
    title: '分组描述',
    dataIndex: 'xComments',
    key: 'xComments',
    render: item =>
      <div className="groupDescription">
        <div className="showtext"> {item}</div>
        <div className="hiddentext">
          <div>{item}</div>
        </div>
      </div>,
  },
  {
    title: '创建时间',
    dataIndex: 'createdTm',
    key: 'createdTm',
    render: item => <a title={item} className="groupNames">
      {_.truncate(item, { length: 25, omission: '...' })}
    </a>,
  },
];
let selectGroupName = '';
let selectGroupDescription = '';
/* 列表checkbox按钮 */
const rowSelection = {
  type: 'radio',
  onChange: (selectedRowKeys, selectedRows) => {
    groupId = selectedRows[0].groupId;
    selectGroupName = selectedRows[0].groupName;
    selectGroupDescription = selectedRows[0].xComments;
  },
};
let onOff = false;
// {_.truncate(item.text, { length: 18, omission: '...' })}
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerGroup extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    cusgroupList: PropTypes.array.isRequired,
    getCustomerGroupList: PropTypes.func.isRequired,
    createCustGroup: PropTypes.func.isRequired,
    cusgroupPage: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    addCustomerToGroup: PropTypes.func.isRequired,
    cusGroupSaveResult: PropTypes.string,
    resultgroupId: PropTypes.string,
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    // 操作分组结果
    operateGroupResult: PropTypes.string.isRequired,
    // 操作分组（编辑、删除）
    operateGroup: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    /* 初始化classname,首次渲染显示分组tab,隐藏分组成功组件 */
    this.state = {
      showGroupPanel: true,
      showOperateGroupSuccess: false,
      cusgroupId: '',
      groupName: '',
    };
  }

  componentWillMount() {
    /* 获取客户分组列表 */
    this.getCustomerGroup(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // 根据分组结果，重新渲染组件
    const { cusGroupSaveResult, resultgroupId, location: { query } } = nextProps;
    const { location: { query: preQuery } } = this.props;
    this.setState({
      showGroupPanel: cusGroupSaveResult !== 'success',
      showOperateGroupSuccess: cusGroupSaveResult === 'success',
      cusgroupId: resultgroupId,
    });

    if (query !== preQuery) {
      this.getCustomerGroup({ ...nextProps });
    }
  }

  @autobind
  getCustomerGroup(props) {
    const { location: { query }, getCustomerGroupList } = props;
    console.log('props---', query.value);
    const param = {
      // 必传，页大小
      pageNum: query.curPageNum || CUR_PAGE,
      pageSize: query.pageSize || CUR_PAGESIZE,
      empId: helper.getEmpId(),
      keyWord: query.keyWord || CUR_KEYWORD,
    };
    getCustomerGroupList(param);
  }
  /**
   * 页码改变事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页
   */
  @autobind
  handlePageChange(page) {
    const { location: { query, pathname }, replace } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: page.nextPage,
        curPageSize: page.currentPageSize,
      },
    });
  }

  /**
   *
   * @param current
   * @param size
   */
  @autobind
  handleSizeChange(current, size) {
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        curPageSize: size,
        curPageNum: 1,
      },
    });
  }

  @autobind
  handleSearch(value) {
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: CUR_PAGE,
        curPageSize: CUR_PAGESIZE,
        keyWord: value,
      },
    });
  }

  /**
   * 解析query
   */
  @autobind
  parseQuery() {
    const { location: { query: { ids, condition } } } = this.props;
    let custCondition = {};
    let includeCustIdList = [];

    if (!_.isEmpty(ids)) {
      includeCustIdList = decodeURIComponent(ids).split(',');
    } else {
      custCondition = JSON.parse(decodeURIComponent(condition));
    }

    return {
      includeCustIdList,
      custCondition,
    };
  }

  /**
   * 重置成功提示
   */
  @autobind
  clearSuccessFlag() {
    this.setState({
      showOperateGroupSuccess: false,
    });
  }

  /*  添加到已有分组 */
  @autobind
  handleSubmit() {
    /* groupId不为空，表示已经选中了分组 */
    if (groupId !== '') {
      /* 获取所选目标分组客户：ids表示选择客户，condition表示全选,将筛选条件传入后台。 */
      const { addCustomerToGroup } = this.props;
      const {
        includeCustIdList,
        custCondition,
      } = this.parseQuery();
      const {
        searchTypeReq,
        paramsReqList,
        filtersReq,
        sortsReqList,
        enterType,
      } = custCondition;

      this.setState({
        groupName: selectGroupName,
      });

      // 编辑分组
      // operateGroup({
      //   groupId,
      //   groupName: selectGroupName,
      //   groupDesc: selectGroupDescription,
      //   includeCustIdList,
      //   excludeCustIdList: null,
      //   includeCustSearchReq: {
      //     orgId: null,
      //     searchTypeReq,
      //     paramsReqList,
      //     filtersReq,
      //     sortsReqList,
      //     enterType,
      //   },
      // });

      addCustomerToGroup({
        groupId,
        groupName: selectGroupName,
        groupDesc: selectGroupDescription,
        includeCustIdList,
        excludeCustIdList: null,
        includeCustSearchReq: {
          orgId: null,
          searchTypeReq,
          paramsReqList,
          filtersReq,
          sortsReqList,
          enterType,
        },
      });
    } else if (!onOff) {
      message.error('请选择分组', 2, () => {
        onOff = false;
      });
      onOff = true;
    }
  }
  /* 添加到新建分组 */
  @autobind
  handleNewGroupSubmit(value) {
    const { groupName, groupDesc } = value;
    const { createCustGroup } = this.props;
    const {
      includeCustIdList,
      custCondition,
    } = this.parseQuery();
    const {
      searchTypeReq,
      paramsReqList,
      filtersReq,
      sortsReqList,
      enterType,
    } = custCondition;
    this.setState({
      groupName,
    });
    // 新建分组
    createCustGroup({
      groupName,
      groupDesc,
      includeCustIdList,
      excludeCustIdList: null,
      includeCustSearchReq: {
        orgId: null,
        searchTypeReq,
        paramsReqList,
        filtersReq,
        sortsReqList,
        enterType,
      },
    });
  }

  @autobind
  closeTab() {
    // fspGlobal.closeRctTabById('FSP_GROUP');
    fspGlobal.closeRctTabById('RCT_FSP_CUSTOMER_LIST');
    // this.props.goBack();
  }

  render() {
    const { goBack, push, cusgroupList, cusgroupPage, location: { query, state } } = this.props;
    const { groupName, showGroupPanel, showOperateGroupSuccess } = this.state;
    const count = query.count;
    return (
      <div>
        <div
          className={
            classnames({
              [styles.customerGroup]: showGroupPanel,
              [styles.hiddencustomerGroup]: !showGroupPanel,
            })
          }
        >
          <div className={styles.text}>添加分组</div>
          <hr />
          <Tabs defaultActiveKey="addhasGroup" type="card">
            <TabPane tab="添加到已有分组" key="addhasGroup">
              <div className={styles.Grouplist}>
                <Row type="flex" justify="space-between" align="middle">
                  <Col span={12}>
                    <p className={styles.description}>已选目标客户<b>&nbsp;{count}&nbsp;</b>户</p>
                  </Col>
                  <Col span={12}>
                    <div className={styles.searchBox}>
                      <Input.Search
                        className="search-input"
                        placeholder="请输入分组名称"
                        onSearch={this.handleSearch}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="groupListRow">
                  <CustomerGrouplist
                    className="CustomerGrouplist"
                    locationPage={query}
                    data={cusgroupList}
                    columns={columns}
                    cusgroupPage={cusgroupPage}
                    onPageChange={this.handlePageChange}
                    onSizeChange={this.handleSizeChange}
                    rowSelection={rowSelection}
                  />
                </Row>
                <Row className={styles.BtnContent}>
                  <Button onClick={goBack}>取消</Button>
                  <Button onClick={this.handleSubmit} type="primary">保存</Button>
                </Row>
              </div>
            </TabPane>
            <TabPane tab="添加到新建分组" key="addNewGroup">
              <div className={styles.newGroupForm}>
                <Row type="flex" justify="space-between" align="middle">
                  <Col span={12}>
                    <p className={styles.description}>已选目标客户<b>&nbsp;{count}&nbsp;</b>户</p>
                  </Col>
                </Row>
                <Row className={styles.groupForm}>
                  <AddNewGroup
                    goBack={goBack}
                    onSubmit={this.handleNewGroupSubmit}
                  />
                  <Row className={styles.BtnContent} />
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div
          className={
            classnames({
              [styles.showsaveSuccessTab]: showOperateGroupSuccess,
              [styles.hiddensaveSuccessTab]: !showOperateGroupSuccess,
            })
          }
        >
          <AddCusSuccess
            closeTab={this.closeTab}
            groupName={groupName} groupId={this.state.cusgroupId}
            onDestroy={this.clearSuccessFlag}
            push={push}
            state={state}
          />
        </div>
      </div>
    );
  }
}
