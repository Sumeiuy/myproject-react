/**
 *@file customerPool/customerGroup
 * 客户分组功能
 *@author zhuyanwen
* */
import React, { PureComponent, PropTypes } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Tabs, Input, Row, Col, Button, message } from 'antd';
import styles from './customerGroup.less';
import CustomerGrouplist from '../../components/customerPool/group/CustomerGrouplist';
import AddNewGroup from '../../components/customerPool/group/AddNewGroup';
import AddCusSuccess from '../../components/customerPool/group/AddCusSuccess';
import helper from '../../utils/helper';


const CUR_PAGE = 0; // 默认当前页
const CUR_PAGESIZE = 10; // 默认页大小
const TabPane = Tabs.TabPane;
let groupId = '';
const mapStateToProps = state => ({
  cusgroupList: state.customerPool.cusgroupList,
  cusgroupPage: state.customerPool.cusgroupPage,
  cusGroupSaveResult: state.customerPool.cusGroupSaveResult,
  cusGroupSaveMessage: state.customerPool.cusGroupSaveMessage,
  resultgroupId: state.customerPool.resultgroupId,

});
const mapDispatchToProps = {
  replace: routerRedux.replace,
  goBack: routerRedux.goBack,
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
};
const columns = [
  {
    title: '分组名称',
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: '分组描述',
    dataIndex: 'xComments',
    key: 'xComments',
    render: item =>
      <div className="groupDescription">
        <div className="showtext">{item}</div>
        <div className="hiddentext">
          <div>{item}</div>
        </div>
      </div>,
  },
  {
    title: '创建时间',
    dataIndex: 'createdTm',
    key: 'createdTm',
  },
];
/* 列表checkbox按钮 */
const rowSelection = {
  type: 'radio',
  onChange: (selectedRowKeys, selectedRows) => {
    groupId = selectedRows[0].groupId;
  },
};
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
    goBack: PropTypes.func.isRequired,
    addCustomerToGroup: PropTypes.func.isRequired,
    cusGroupSaveResult: PropTypes.string,
    resultgroupId: PropTypes.string,

  }
  constructor(props) {
    super(props);
    this.state = {
      controlGroupPane: '',
      controlCusSuccess: '',
      cusgroupId: '',
    };
  }

  componentWillMount() {
/* 获取客户分组列表 */
    this.getCustomerGroup();
    /* 初始化classname,首次渲染显示分组tab,隐藏分组成功组件 */
    this.state.controlGroupPane = classnames({
      [styles.customerGroup]: true,
      [styles.hiddencustomerGroup]: false,
    });
    this.state.controlCusSuccess = classnames({
      [styles.showsaveSuccessTab]: false,
      [styles.hiddensaveSuccessTab]: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    // 根据分组结果，重新渲染组件
    const { cusGroupSaveResult, resultgroupId } = nextProps;
    const controlGroupPane = classnames({
      [styles.customerGroup]: cusGroupSaveResult !== 'success',
      [styles.hiddencustomerGroup]: cusGroupSaveResult === 'success',
    });
    const controlCusSuccess = classnames({
      [styles.showsaveSuccessTab]: cusGroupSaveResult === 'success',
      [styles.hiddensaveSuccessTab]: cusGroupSaveResult !== 'success',
    });
    this.setState({
      controlGroupPane,
      controlCusSuccess,
      cusgroupId: resultgroupId,
    });
  }

  @autobind
  getCustomerGroup(value = null) {
    const { location: { query } } = this.props;
    const param = {
        // 必传，页大小
      pageNum: query.curPageNum || CUR_PAGE,
      pageSize: query.pageSize || CUR_PAGESIZE,
      empId: helper.getEmpId(),
      keyWord: value,
    };
    this.props.getCustomerGroupList(param);
  }
  /**
   * 页码改变事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页
   */
  @autobind
  handlePageChange(page) {
    const { location: { query, pathname }, replace } = this.props;
   // 替换当前页码和分页条目
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
        pageSize: size,
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
        KeyWord: value,
      },
    });
    this.getCustomerGroup(value);
  }
/*  添加到已有分组 */
  @autobind
  handleSubmit() {
      /* groupId不为空，表示已经选中了分组 */
    if (groupId !== '') {
        /* 获取所选目标分组客户：ids表示选择客户，condition表示全选,将筛选条件传入后台。 */
      const param = {};
      const { location: { query } } = this.props;
      if (query.ids) {
        const ids = decodeURIComponent(query.ids).split(',');
        param.custList = ids;
      } else if (query.condition) {
        const condition = JSON.parse(decodeURIComponent(query.condition));
        param.searchReq = condition;
      }
      param.groupId = groupId;
      param.empId = helper.getEmpId();
      this.props.addCustomerToGroup({ ...param });
    } else {
      message.error('请选择分组');
    }
  }
  /* 添加到新建分组 */
  @autobind
  handleNewGroupSubmit(value) {
    const param = {};
    const { location: { query } } = this.props;
    if (query.ids) {
      const ids = decodeURIComponent(query.ids).split(',');
      param.custList = ids;
    } else if (query.condition) {
      const condition = JSON.parse(decodeURIComponent(query.condition));
      param.searchReq = condition;
    }
    param.empId = helper.getEmpId();
    Object.assign(param, value);
    this.props.createCustGroup({ ...param });
  }
  @autobind
  /* 退回 */
  goback() {
    this.props.goBack();
  }
  render() {
    const { cusgroupList, cusgroupPage, location: { query } } = this.props;
    const count = query.count;
    return (
      <div>
        <div className={this.state.controlGroupPane}>
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
                    data={cusgroupList}
                    columns={columns}
                    cusgroupPage={cusgroupPage}
                    onPageChange={this.handlePageChange}
                    onSizeChange={this.handleSizeChange}
                    rowSelection={rowSelection}
                  />
                </Row>
                <Row className={styles.BtnContent}>
                  <Button onClick={() => this.goback()}>取消</Button>
                  <Button onClick={() => this.handleSubmit()} type="primary">保存</Button>
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
                    onSubmit={this.handleNewGroupSubmit}
                  />
                  <Row className={styles.BtnContent} />
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div className={this.state.controlCusSuccess} >
          <AddCusSuccess goback={this.goback} groupId={this.state.cusgroupId} />
        </div>
      </div>
    );
  }
}
