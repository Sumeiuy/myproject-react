import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Button from '../../components/common/Button';
import GroupTable from '../../components/customerPool/groupManage/GroupTable';
import GroupModal from '../../components/customerPool/groupManage/CustomerGroupUpdateModal';
import CustomerGroupDetail from '../../components/customerPool/groupManage/CustomerGroupDetail';
import Search from '../../components/common/Search';
import styles from './customerGroupManage.less';
import tableStyles from '../../components/customerPool/groupManage/groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  getGroupList: 'customerPool/getCustomerGroupList',
  getCustList: 'customerPool/getGroupCustomerList',
  getHotPossibleWds: 'customerPool/getCustomerHotPossibleWds',
  getHistoryWdsList: 'customerPool/getCustomerHistoryWdsList',
  clearSearchHistoryList: 'customerPool/clearCustomerSearchHistoryList',
  saveSearchVal: 'customerPool/saveCustomerSearchVal',
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
  customerHistoryWordsList: state.customerPool.customerHistoryWordsList,
  // 清除历史列表
  isClearCustomerHistorySuccess: state.customerPool.isClearCustomerHistorySuccess,
  // 保存的搜索内容
  customerSearchHistoryVal: state.customerPool.customerSearchHistoryVal,
});

const mapDispatchToProps = {
  // 获取客户分组列表
  getCustomerGroupList: fetchData(effects.getGroupList, true),
  // 获取分组客户列表
  getGroupCustomerList: fetchData(effects.getCustList, true),
  // 获取热词列表
  getHotPossibleWds: fetchData(effects.getHotPossibleWds, false),
  // 获取搜索记录列表
  getHistoryWdsList: fetchData(effects.getHistoryWdsList, false),
  // 清除搜索记录
  clearSearchHistoryList: fetchData(effects.clearSearchHistoryList, false),
  // 保存搜索关键字
  saveSearchVal: fetchData(effects.saveSearchVal, false),
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
    customerHistoryWordsList: PropTypes.array.isRequired,
    isClearCustomerHistorySuccess: PropTypes.bool.isRequired,
    customerSearchHistoryVal: PropTypes.string.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    getHistoryWdsList: PropTypes.func.isRequired,
    clearSearchHistoryList: PropTypes.func.isRequired,
    saveSearchVal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    customerGroupList: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 控制显示更新分组弹出层
      modalKey: `groupModalKey${modalKeyCount}`,
    };
  }

  componentWillMount() {
    const {
      getCustomerGroupList,
      getGroupCustomerList,
      getHistoryWdsList,
      getHotPossibleWds,
      } = this.props;
    // 获取客户分组列表
    getCustomerGroupList({
      curPageNum: 1,
      pageSize: 10,
    });
    // 获取分组客户列表
    getGroupCustomerList({
      curPageNum: 1,
      pageSize: 5,
    });
    // 历史搜索记录
    getHistoryWdsList({});
    // 热词搜索
    getHotPossibleWds({});
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

  // componentWillReceiveProps(nextProps) {
  // const {
  //   replace,
  //   location: { query, query: { curPageNum }, pathname },
  // } = this.props;
  // const { customerGroupList: nextCustomerGroupList = EMPTY_OBJECT } = nextProps;
  // const { page: nextPage = EMPTY_OBJECT } = nextCustomerGroupList;
  // const { curPageNum: nextPageNum = 1, pageSize } = nextPage;
  // // 初始化，url上加上页码，页目
  // if (nextPageNum === 1 && _.isEmpty(curPageNum)) {
  //   replace({
  //     pathname,
  //     query: {
  //       ...query,
  //       curPageNum: nextPageNum,
  //       curPageSize: pageSize,
  //     },
  //   });
  // }
  // }

  // 获取联想数据
  @autobind
  queryHotPossibleWds() {
    const { getHotPossibleWds } = this.props;
    getHotPossibleWds({});
  }

  // 获取历史搜索
  @autobind
  queryHistoryWdsList() {
    const { getHistoryWdsList } = this.props;
    getHistoryWdsList({
    });
  }

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
      curPageNum: nextPage,
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
      curPageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  @autobind
  // 编辑客户分组
  editCustomerGroup() {
    console.log('edit customer group list');
  }

  @autobind
  // 删除客户分组
  deleteCustomerGroup() {
    console.log('delete customer group list');
  }

  @autobind
  // 发起任务
  lanuchTask() {
    console.log('launch task');
  }

  @autobind
  handleGroupListSearch(value) {
    console.log('search', value);
  }

  @autobind
  handleAddGroup() {
    console.log('add customer group');
    this.setState({
      visible: true,
      modalKey: `groupModalKey${modalKeyCount++}`,
    });
  }

  @autobind
  handleShowGroupDetail() {
    console.log('show add group detail modal');
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

  @autobind
  handleSearchGroup({ value }) {
    console.log('search value', value);
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
    return [{
      key: 'name',
      value: '分组名称',
    },
    {
      key: 'description',
      value: '描述',
    },
    {
      key: 'userCount',
      value: '用户数',
    },
    {
      key: 'createTime',
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
      customerHistoryWordsList = EMPTY_LIST,
      isClearCustomerHistorySuccess = false,
      customerSearchHistoryVal = '',
      getHotPossibleWds,
      getHistoryWdsList,
      clearSearchHistoryList,
      saveSearchVal,
     } = this.props;

    const { visible, modalKey } = this.state;

    const {
      resultData = EMPTY_LIST,
      page = EMPTY_OBJECT,
    } = customerGroupList || EMPTY_OBJECT;

    const { totalRecordNum = 10, curPageNum: pageNum, pageSize } = page;

    // const { totalRecordNum: custListTotalRecordNum = 5,
    //   curPageNum: custListPageNum,
    //   pageSize: custListPageSize,
    // } = customerListPageData;

    const currentPageNum = curPageNum || pageNum;
    const currentPageSize = curPageSize || pageSize;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 构造operation
    const actionSource = this.renderActionSource();

    return (
      <div className={styles.groupPanelContainer}>
        <div className={styles.title}>我的客户分组</div>
        <div className={styles.operationRow}>
          <div className={styles.leftSection}>
            <span className={styles.groupName}>分组名称：</span>
            <Search
              // 请求联想关键词
              queryPossibleWords={getHotPossibleWds}
              // 请求历史搜索数据
              queryHistoryWdsList={getHistoryWdsList}
              // 联想出来的数据
              possibleWordsData={customerHotPossibleWordsList}
              // 历史单词列表数据
              historySearchWordsList={customerHistoryWordsList}
              // 清除搜索历史是否成功
              clearSuccess={isClearCustomerHistorySuccess}
              // 清除搜索历史请求
              clearHistorySearchList={clearSearchHistoryList}
              // 搜索历史值
              searchHistoryVal={customerSearchHistoryVal}
              // 保存搜索的value
              saveSearchVal={saveSearchVal}
              // 是否需要搜索大图标
              isNeedLgSearch={false}
              // 搜索className
              searchWrapperClass={styles.customerGroupSearch}
              // 是否需要历史搜索功能
              isNeedRememberHistory
              // 搜索按钮功能
              onSearchClick={this.handleSearchGroup}
              // 点击option某一项
              onOptionClick={() => { }}
              // placeholder
              placeholder={'请输入分组名称'}
              // 搜索框style
              searchStyle={{
                height: '30px',
                width: '250px',
              }}
            />
          </div>
          <div className={styles.rightSection} onClick={this.handleAddGroup}>
            <Button
              type="primary"
              className={styles.addBtn}
            >
              新增
            </Button>
          </div>
        </div>
        <GroupTable
          pageData={{
            curPageNum: currentPageNum,
            curPageSize: currentPageSize,
            totalRecordNum,
          }}
          listData={resultData}
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
              title={'新建用户分组'}
              okText={'提交'}
              cancelText={'取消'}
              okType={'primary'}
              onCancelHandler={this.handleCloseModal}
              footer={null}
              modalContent={
                <CustomerGroupDetail
                  customerHotPossibleWordsList={customerHotPossibleWordsList}
                  customerHistoryWordsList={customerHistoryWordsList}
                  isClearCustomerHistorySuccess={isClearCustomerHistorySuccess}
                  customerSearchHistoryVal={customerSearchHistoryVal}
                  getHotPossibleWds={getHotPossibleWds}
                  getHistoryWdsList={getHistoryWdsList}
                  clearSearchHistoryList={clearSearchHistoryList}
                  saveSearchVal={saveSearchVal}
                  customerList={customerList}
                  onCloseModal={this.handleCloseModal}
                  detailData={{
                    name: '21321321321',
                    description: '2321321dsddwqeqw',
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
