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
import { fspContainer } from '../../config';
import { fspGlobal } from '../../utils';
import Confirm from '../../components/common/Confirm';
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
  operateGroup: 'customerPool/operateGroup',
  deleteGroup: 'customerPool/deleteGroup',
  deleteCustomerFromGroup: 'customerPool/deleteCustomerFromGroup',
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
  groupCustomerList: state.customerPool.groupCustomerList,
  // 联想的推荐热词列表
  customerHotPossibleWordsList: state.customerPool.customerHotPossibleWordsList,
  // 历史搜索
  // customerHistoryWordsList: state.customerPool.customerHistoryWordsList,
  // 清除历史列表
  // isClearCustomerHistorySuccess: state.customerPool.isClearCustomerHistorySuccess,
  // 保存的搜索内容
  // customerSearchHistoryVal: state.customerPool.customerSearchHistoryVal,
  // 更新分组信息成功与否
  operateGroupResult: state.customerPool.operateGroupResult,
  // 字典信息
  dict: state.app.dict,
  // 删除分组结果
  deleteGroupResult: state.customerPool.deleteGroupResult,
  // 删除分组下客户结果
  deleteCustomerFromGroupResult: state.customerPool.deleteCustomerFromGroupResult,
});

const mapDispatchToProps = {
  // 获取客户分组列表
  getCustomerGroupList: fetchData(effects.getGroupList, true),
  // 获取分组客户列表
  getGroupCustomerList: fetchData(effects.getCustList, false),
  // 获取热词列表
  getHotPossibleWds: fetchData(effects.getHotPossibleWds, false),
  // 获取搜索记录列表
  // getHistoryWdsList: fetchData(effects.getHistoryWdsList, false),
  // 清除搜索记录
  // clearSearchHistoryList: fetchData(effects.clearSearchHistoryList, false),
  // 保存搜索关键字
  // saveSearchVal: fetchData(effects.saveSearchVal, false),
  // 新增、编辑客户分组
  operateGroup: fetchData(effects.operateGroup, true),
  // 删除分组
  deleteGroup: fetchData(effects.deleteGroup, true),
  // 删除分组下客户
  deleteCustomerFromGroup: fetchData(effects.deleteCustomerFromGroup, true),
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
    groupCustomerList: PropTypes.object.isRequired,
    customerHotPossibleWordsList: PropTypes.array.isRequired,
    // customerHistoryWordsList: PropTypes.array.isRequired,
    // isClearCustomerHistorySuccess: PropTypes.bool.isRequired,
    // customerSearchHistoryVal: PropTypes.string.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    // getHistoryWdsList: PropTypes.func.isRequired,
    // clearSearchHistoryList: PropTypes.func.isRequired,
    // saveSearchVal: PropTypes.func.isRequired,
    operateGroupResult: PropTypes.string.isRequired,
    operateGroup: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    deleteGroupResult: PropTypes.string.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    deleteCustomerFromGroupResult: PropTypes.object.isRequired,
    deleteCustomerFromGroup: PropTypes.func.isRequired,
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
      groupId: '',
      record: {},
      isShowDeleteConfirm: false,
    };
  }

  componentWillMount() {
    const {
      getCustomerGroupList,
    } = this.props;
    // 获取客户分组列表
    getCustomerGroupList({
      pageNum: 1,
      pageSize: 10,
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

  // 获取联想数据
  @autobind
  queryHotPossibleWds({ keyword }) {
    const { getHotPossibleWds } = this.props;
    getHotPossibleWds({
      keyword, // 搜索关键字（客户号或客户名字）
      pageNum: 1,
      pageSize: 10,
    });
  }

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
      pageNum: nextPage,
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
      pageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  // 编辑客户分组
  @autobind
  editCustomerGroup(record) {
    console.log('edit customer group list');
    const { groupId } = record;
    const { getGroupCustomerList } = this.props;
    this.showGroupDetailModal(record);
    this.setState({
      canEditDetail: true,
      modalTitle: '编辑用户分组',
    });
    // 获取分组下的客户列表
    getGroupCustomerList({
      groupId,
      pageNum: 1,
      pageSize: 5,
    });
  }

  // 删除客户分组
  @autobind
  deleteCustomerGroup() {
    console.log('delete customer group list');
    const { record } = this.state;
    const { groupId } = record;
    const { deleteGroup } = this.props;
    deleteGroup({
      groupId,
    });
  }

  // 发起任务
  @autobind
  lanuchTask(record) {
    console.log('launch task');
    const { groupId } = record;
    this.handleOpenTab({
      groupId,
      enterType: 'custGroupList',
    }, '自建任务', 'RCT_FSP_CREATE_TASK');
  }

  @autobind
  handleOpenTab(obj, titles, ids) {
    const { groupId } = obj;
    const { push } = this.props;
    const firstUrl = '/customerPool/createTask';
    if (document.querySelector(fspContainer.container)) {
      const url = `${firstUrl}?groupId=${groupId}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id: ids, // tab的id
        title: titles, // tab标题
      };
      fspGlobal.openRctTab({ url, param }); // 打开react tab
    } else {
      push({
        pathname: firstUrl,
        query: obj,
      });
    }
  }

  @autobind
  handleGroupListSearch(value) {
    console.log('search', value);
  }

  @autobind
  handleConfirmOk() {
    this.deleteCustomerGroup();
    this.setState({
      isShowDeleteConfirm: false,
    });
  }

  @autobind
  handleConfirmCancel() {
    this.setState({
      isShowDeleteConfirm: false,
    });
  }

  @autobind
  handleDeleteBtnClick(record) {
    this.setState({
      // 当前删除行记录数据
      record,
      isShowDeleteConfirm: true,
    });
  }

  /**
   * 打开编辑或者新建分组详情记录modal
   * @param {*} record 当前记录
   */
  @autobind
  showGroupDetailModal(record = {}) {
    console.log('add customer group');
    const { groupName = '', xComments = '', groupId = '' } = record;
    this.setState({
      visible: true,
      modalKey: `groupModalKey${modalKeyCount++}`,
      canEditDetail: true,
      name: groupName,
      description: xComments,
      // 默认是新建用户分组
      modalTitle: '新建用户分组',
      groupId,
    });
  }

  @autobind
  handleShowGroupDetail(record) {
    console.log('show add group detail modal');
    const { groupId } = record;
    const { getGroupCustomerList } = this.props;
    this.showGroupDetailModal(record);
    this.setState({
      canEditDetail: false,
      modalTitle: '查看用户分组',
    });
    // 获取分组下的客户列表
    getGroupCustomerList({
      groupId,
      pageNum: 1,
      pageSize: 5,
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
      pageNum: Number(curPageNum),
      pageSize: Number(curPageSize),
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
      handler: this.handleDeleteBtnClick,
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
      groupCustomerList = EMPTY_OBJECT,
      customerHotPossibleWordsList = EMPTY_LIST,
      getGroupCustomerList,
      operateGroup,
      operateGroupResult,
      dict,
      deleteCustomerFromGroup,
      deleteCustomerFromGroupResult,
     } = this.props;

    const {
      visible,
      modalKey,
      canEditDetail,
      name,
      description,
      modalTitle,
      groupId,
      isShowDeleteConfirm,
    } = this.state;

    const {
      resultData = EMPTY_LIST,
      page = EMPTY_OBJECT,
    } = customerGroupList || EMPTY_OBJECT;

    const { totalRecordNum } = page;

    // 风险等级字典信息
    const { custRiskBearing } = dict;

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
              onClick={this.showGroupDetailModal}
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
                  deleteCustomerFromGroupResult={deleteCustomerFromGroupResult}
                  deleteCustomerFromGroup={deleteCustomerFromGroup}
                  custRiskBearing={custRiskBearing}
                  canEditDetail={canEditDetail}
                  customerHotPossibleWordsList={customerHotPossibleWordsList}
                  getHotPossibleWds={this.queryHotPossibleWds}
                  customerList={groupCustomerList}
                  onCloseModal={this.handleCloseModal}
                  getGroupCustomerList={getGroupCustomerList}
                  operateGroup={operateGroup}
                  operateGroupResult={operateGroupResult}
                  detailData={{
                    name,
                    description,
                    groupId,
                  }}
                />
              }
              onOkHandler={this.handleUpdateGroup}
            /> : null
        }
        {
          isShowDeleteConfirm ?
            <Confirm
              type={'delete'}
              onCancelHandler={this.handleConfirmCancel}
              onOkHandler={this.handleConfirmOk}
            /> : null
        }
      </div>
    );
  }
}
