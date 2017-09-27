/**
 *@file customerPool/customerGroup
 * 客户分组功能
 *@author zhuyanwen
* */
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


const CUR_PAGE = 1; // 默认当前页
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
    render: item => <a title={item} className="groupNames">
      {_.truncate(item, { length: 18, omission: '...' })}
    </a>,
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
    render: item => <a title={item} className="groupNames">
      {_.truncate(item, { length: 18, omission: '...' })}
    </a>,
  },
];
let selectGroupName = '';
/* 列表checkbox按钮 */
const rowSelection = {
  type: 'radio',
  onChange: (selectedRowKeys, selectedRows) => {
    groupId = selectedRows[0].groupId;
    selectGroupName = selectedRows[0].groupName;
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
  }
  constructor(props) {
    super(props);
    this.state = {
      controlGroupPane: '',
      controlCusSuccess: '',
      cusgroupId: '',
      groupName: '',
      keyWord: null,
    };
  }

  componentWillMount() {
/* 获取客户分组列表 */
    const { keyWord } = this.state;
    this.getCustomerGroup(keyWord, this.props);
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
    const { cusGroupSaveResult, resultgroupId, location: { query } } = nextProps;
    const { location: { query: preQuery } } = this.props;
    const { keyWord } = this.state;
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
    if (query !== preQuery) {
      this.getCustomerGroup(keyWord, { nextProps });
    }
  }

  @autobind
  getCustomerGroup(value = null, props) {
    const { location: { query }, getCustomerGroupList } = props;
    const param = {
        // 必传，页大小
      pageNum: query.curPageNum || CUR_PAGE,
      pageSize: query.pageSize || CUR_PAGESIZE,
      empId: helper.getEmpId(),
      keyWord: value,
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
   // 替换当前页码和分页条目
    console.log('page, pageSize:', page);
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
        KeyWord: value,
      },
    });
    this.setState({
      keyWord: value,
    });
  }
/*  添加到已有分组 */
  @autobind
  handleSubmit() {
      /* groupId不为空，表示已经选中了分组 */
    if (groupId !== '') {
      console.info('groupId---', groupId);
        /* 获取所选目标分组客户：ids表示选择客户，condition表示全选,将筛选条件传入后台。 */
      const param = {};
      const { location: { query } } = this.props;
      if (query.ids) {
        const ids = decodeURIComponent(query.ids).split(',');
        param.custIdList = ids;
      } else if (query.condition) {
        const condition = JSON.parse(decodeURIComponent(query.condition));
        console.warn(condition);
        param.searchReq = {
          enterType: condition.enterType,
          sortsReqList: condition.sortsReqList,
        };
        param.custIdList = null;
      }
      param.groupId = groupId;
      param.empId = helper.getEmpId();
      this.setState({
        groupName: selectGroupName,
      });
      this.props.addCustomerToGroup({ ...param });
      groupId = '';
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
    const param = {};
    const { location: { query } } = this.props;
    console.log(query);
    if (query.ids) {
      const ids = decodeURIComponent(query.ids).split(',');
      param.custIdList = ids;
    } else if (query.condition) {
      const condition = JSON.parse(decodeURIComponent(query.condition));
      param.searchReq = {
        enterType: condition.enterType,
        sortsReqList: condition.sortsReqList,
      };
      param.custIdList = null;
    }
    param.empId = helper.getEmpId();
    Object.assign(param, value);
    this.setState({
      groupName: param.groupName,
    });
    this.props.createCustGroup({ ...param });
  }

  @autobind
  closeTab() {
    fspGlobal.closeRctTabById('FSP_GROUP');
  }

  render() {
    const { cusgroupList, cusgroupPage, location: { query } } = this.props;
    const { groupName } = this.state;
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
                  <Button onClick={this.closeTab}>取消</Button>
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
                    closeTab={this.closeTab}
                    onSubmit={this.handleNewGroupSubmit}
                  />
                  <Row className={styles.BtnContent} />
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div className={this.state.controlCusSuccess} >
          <AddCusSuccess
            closeTab={this.closeTab}
            groupName={groupName} groupId={this.state.cusgroupId}
          />
        </div>
      </div>
    );
  }
}
