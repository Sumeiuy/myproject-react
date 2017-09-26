import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Button from '../../components/common/Button';
import GroupTable from '../../components/customerPool/groupManage/GroupTable';
import GroupModal from '../../components/customerPool/groupManage/CustomerGroupUpdateModal';
import CustomerGroupDetail from '../../components/customerPool/groupManage/CustomerGroupDetail';
// import Search from '../../components/common/Search';
import SimpleSearch from '../../components/customerPool/groupManage/CustomerGroupListSearch';
import styles from './customerGroupManage.less';
import tableStyles from '../../components/customerPool/groupManage/groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  getGroupList: 'customerPool/getCustomerGroupList',
  getCustList: 'customerPool/getGroupCustomerList',
  getHotPossibleWds: 'customerPool/getCustomerHotPossibleWds',
  // getHistoryWdsList: 'customerPool/getCustomerHistoryWdsList',
  // clearSearchHistoryList: 'customerPool/clearCustomerSearchHistoryList',
  // saveSearchVal: 'customerPool/saveCustomerSearchVal',
};

const fetchData = (type, loading) => query => ({
  type,
  payload: query || EMPTY_OBJECT,
  loading,
});

const mapStateToProps = state => ({
  // 客户分组列表
  customerGroupList: state.customerPool.customerGroupList,
  // 一个分组下的所有客户
  customerList: state.customerPool.customerList,
  // 联想的推荐热词列表
  customerHotPossibleWordsList: state.customerPool.customerHotPossibleWordsList,
  // 历史搜索
  // customerHistoryWordsList: state.customerPool.customerHistoryWordsList,
  // 清除历史列表
  // isClearCustomerHistorySuccess: state.customerPool.isClearCustomerHistorySuccess,
  // 保存的搜索内容
  // customerSearchHistoryVal: state.customerPool.customerSearchHistoryVal,
});

const mapDispatchToProps = {
  // 获取客户分组列表
  getCustomerGroupList: fetchData(effects.getGroupList, true),
  // 获取分组客户列表
  getGroupCustomerList: fetchData(effects.getCustList, true),
  // 获取热词列表
  getHotPossibleWds: fetchData(effects.getHotPossibleWds, false),
  // 获取搜索记录列表
  // getHistoryWdsList: fetchData(effects.getHistoryWdsList, false),
  // 清除搜索记录
  // clearSearchHistoryList: fetchData(effects.clearSearchHistoryList, false),
  // 保存搜索关键字
  // saveSearchVal: fetchData(effects.saveSearchVal, false),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

let modalKeyCount = 0;

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerGroupManage extends PureComponent {
  static propTypes = {
    customerGroupList: PropTypes.object,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getCustomerGroupList: PropTypes.func.isRequired,
    getGroupCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.object.isRequired,
    customerHotPossibleWordsList: PropTypes.array.isRequired,
    // customerHistoryWordsList: PropTypes.array.isRequired,
    // isClearCustomerHistorySuccess: PropTypes.bool.isRequired,
    // customerSearchHistoryVal: PropTypes.string.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    // getHistoryWdsList: PropTypes.func.isRequired,
    // clearSearchHistoryList: PropTypes.func.isRequired,
    // saveSearchVal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    customerGroupList: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 控制显示更新分组弹出层
      modalKey: `groupModalKey${modalKeyCount}`,
      canEditDetail: true,
      name: '', // 分组名称
      description: '', // 分组描述
      modalTitle: '新建用户分组',
    };
  }

  componentWillMount() {
    const {
      getCustomerGroupList,
      getGroupCustomerList,
    } = this.props;
    // 获取客户分组列表
    getCustomerGroupList({
      pageNum: 0,
      pageSize: 10,
    });
    // 获取分组客户列表
    getGroupCustomerList({
      curPageNum: 1,
      pageSize: 5,
    });
  }

  componentDidMount() {
    const { replace, location: { query, pathname } } = this.props;
    // 初始化，url上加上页码，页目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: 10,
      },
    });
  }

  componentWillUnmount() {
    this.setState({
      visible: false, // 控制显示更新分组弹出层
    });
  }

  // // 获取联想数据
  // @autobind
  // queryHotPossibleWds() {
  //   const { getHotPossibleWds } = this.props;
  //   getHotPossibleWds();
  // }

  // // 获取历史搜索
  // @autobind
  // queryHistoryWdsList() {
  //   const { getHistoryWdsList } = this.props;
  //   getHistoryWdsList();
  // }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { getCustomerGroupList } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: nextPage,
        curPageSize: currentPageSize,
      },
    });
    getCustomerGroupList({
      pageNum: nextPage - 1,
      pageSize: currentPageSize,
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { getCustomerGroupList } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: changedPageSize,
      },
    });
    getCustomerGroupList({
      pageNum: currentPageNum - 1,
      pageSize: changedPageSize,
    });
  }

  // 编辑客户分组
  @autobind
  editCustomerGroup(record) {
    console.log('edit customer group list');
    this.handleAddGroup(record);
    this.setState({
      canEditDetail: true,
      modalTitle: '编辑用户分组',
    });
  }

  // 删除客户分组
  @autobind
  deleteCustomerGroup() {
    console.log('delete customer group list');
  }

  // 发起任务
  @autobind
  lanuchTask() {
    console.log('launch task');
  }

  @autobind
  handleGroupListSearch(value) {
    console.log('search', value);
  }

  /**
   * 打开编辑或者新建分组详情记录modal
   * @param {*} record 当前记录
   */
  @autobind
  handleAddGroup(record) {
    console.log('add customer group');
    const { groupName, xComments } = record;
    this.setState({
      visible: true,
      modalKey: `groupModalKey${modalKeyCount++}`,
      canEditDetail: true,
      name: groupName,
      description: xComments,
      modalTitle: '新建用户分组',
    });
  }

  @autobind
  handleShowGroupDetail(record) {
    console.log('show add group detail modal');
    this.handleAddGroup(record);
    this.setState({
      canEditDetail: false,
      modalTitle: '查看用户分组',
    });
  }

  @autobind
  handleUpdateGroup() {
    console.log('show add group detail modal');
  }

  @autobind
  handleCloseModal() {
    this.setState({
      visible: false,
    });
  }

  /**
   * 根据搜索框输入值搜索分组
   * @param {*} value 搜索值
   */
  @autobind
  handleSearchGroup(value) {
    console.log('search value', value);
    const { getCustomerGroupList, location: { query: { curPageNum, curPageSize } } } = this.props;
    getCustomerGroupList({
      keyWord: value,
      pageNum: curPageNum,
      pageSize: curPageSize,
    });
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.groupId }));
    }

    return [];
  }

  renderActionSource() {
    return [{
      type: '编辑',
      handler: this.editCustomerGroup,
    },
    {
      type: '删除',
      handler: this.deleteCustomerGroup,
    },
    {
      type: '发起任务',
      handler: this.lanuchTask,
    }];
  }

  renderColumnTitle() {
    // createLogin:"1-P9LJ",
    // createdTm:"2017-09-19 00:00:00",
    // groupId:"1-432KUCI",
    // groupName:"96",
    // relatCust:1,
    // xComments:null,
    return [{
      key: 'groupName',
      value: '分组名称',
    },
    {
      key: 'xComments',
      value: '描述',
    },
    {
      key: 'relatCust',
      value: '用户数',
    },
    {
      key: 'createdTm',
      value: '创建时间',
    },
    {
      key: 'action',
      value: '操作',
    }];
  }

  render() {
    const {
      customerGroupList = EMPTY_OBJECT,
      location: { query: { curPageNum, curPageSize } },
      customerList = EMPTY_OBJECT,
      customerHotPossibleWordsList = EMPTY_LIST,
      getHotPossibleWds,
     } = this.props;

    const { visible, modalKey, canEditDetail, name, description, modalTitle } = this.state;

    const {
      resultData = EMPTY_LIST,
      page = EMPTY_OBJECT,
    } = customerGroupList || EMPTY_OBJECT;

    const { totalRecordNum } = page;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 构造operation
    const actionSource = this.renderActionSource();

    const dataSource = this.addIdToDataSource(resultData);

    return (
      <div className={styles.groupPanelContainer}>
        <div className={styles.title}>我的客户分组</div>
        <div className={styles.operationRow}>
          <div className={styles.leftSection}>
            <SimpleSearch
              onSearch={this.handleSearchGroup}
            />
          </div>
          <div className={styles.rightSection}>
            <Button
              onClick={this.handleAddGroup}
              type="primary"
              className={styles.addBtn}
            >
              新增
            </Button>
          </div>
        </div>
        <GroupTable
          pageData={{
            curPageNum,
            curPageSize,
            totalRecordNum,
          }}
          listData={dataSource}
          onSizeChange={this.handleShowSizeChange}
          onPageChange={this.handlePageChange}
          tableClass={
            classnames({
              [tableStyles.groupTable]: true,
            })
          }
          titleColumn={titleColumn}
          actionSource={actionSource}
          isFirstColumnLink
          firstColumnHandler={this.handleShowGroupDetail}
        />
        {
          visible ?
            <GroupModal
              wrapperClass={
                classnames({
                  [styles.groupModalContainer]: true,
                })
              }
              // 为了每次都能打开一个新的modal
              key={modalKey}
              visible={visible}
              title={modalTitle}
              okText={'提交'}
              cancelText={'取消'}
              okType={'primary'}
              onCancelHandler={this.handleCloseModal}
              footer={null}
              modalContent={
                <CustomerGroupDetail
                  canEditDetail={canEditDetail}
                  customerHotPossibleWordsList={customerHotPossibleWordsList}
                  getHotPossibleWds={getHotPossibleWds}
                  customerList={customerList}
                  onCloseModal={this.handleCloseModal}
                  detailData={{
                    name,
                    description,
                  }}
                />
              }
              onOkHandler={this.handleUpdateGroup}
            /> : null
        }
      </div>
    );
  }
}
