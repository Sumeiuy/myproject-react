/*
 * @Author: WangJunJun
 * @Date: 2018-08-03 10:50:48
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-03 21:45:59
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { message } from 'antd';
import _ from 'lodash';

import Button from '../../components/common/Button';
import Table from '../../components/common/commonTable';
import GroupModal from '../../components/customerPool/groupManage/CustomerGroupUpdateModal';
import CustomerGroupDetail from '../../components/customerPool/groupManage/CustomerGroupDetail';
import SimpleSearch from '../../components/customerPool/groupManage/CustomerGroupListSearch';
import { checkSpecialCharacter } from '../../decorators/checkSpecialCharacter';
import { openRctTab } from '../../utils';
import { url as urlHelper, dva } from '../../helper';
import confirm from '../../components/common/confirm_';
import withRouter from '../../decorators/withRouter';
import Icon from '../../components/common/Icon';
import styles from './home.less';
import tableStyles from '../../components/common/commonTable/index.less';
import logable, { logPV, logCommon } from '../../decorators/logable';
import effects from './effects';
import { INITIAL_PAGESIZE, INITIAL_CURPAGE } from './config';
import { SOURCE_LABELMANAGEMENT } from '../../config/createTaskEntry';

const dispatch = dva.generateEffect;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const mapStateToProps = state => ({
  // 客户分组列表
  customerGroupList: state.customerPool.customerGroupList,
  // 一个分组下的所有客户
  groupCustomerList: state.customerPool.groupCustomerList,
  // 联想的推荐热词列表
  customerHotPossibleWordsList: state.customerPool.customerHotPossibleWordsList,
  // 更新分组信息成功与否
  operateGroupResult: state.customerPool.operateGroupResult,
  // 字典信息
  dict: state.app.dict,
  // 删除分组结果
  deleteGroupResult: state.customerPool.deleteGroupResult,
  // 删除分组下客户结果
  deleteCustomerFromGroupResult: state.customerPool.deleteCustomerFromGroupResult,
  // 批量导入客户信息
  batchCustList: state.customerPool.batchCustList,

  // 标签列表
  labelListInfo: state.labelManagement.labelListInfo,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取分组客户列表
  getGroupCustomerList: dispatch(effects.getCustList, { loading: true, forceFull: true }),
  // 获取热词列表
  getHotPossibleWds: dispatch(effects.getHotPossibleWds, { loading: true, forceFull: true }),
  // 新增、编辑客户分组
  operateGroup: dispatch(effects.operateGroup, { loading: true, forceFull: true }),
  // 删除分组
  deleteGroup: dispatch(effects.deleteGroup, { loading: true, forceFull: true }),
  // 删除分组下客户
  deleteCustomerFromGroup: dispatch(
    effects.deleteCustomerFromGroup,
    { loading: true, forceFull: true },
  ),
  // 获取上传excel文件解析后的客户
  queryBatchCustList: dispatch(effects.queryBatchCustList, { loading: true, forceFull: true }),
  // 清除数据
  clearCreateTaskData: dispatch(effects.clearCreateTaskData, { loading: true, forceFull: true }),

  // 获取标签列表
  queryLabelList: dispatch(effects.queryLabelList, { loading: true }),
  // 删除单条标签
  deleteLabel: dispatch(effects.deleteLabel, { loading: true }),
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
    getGroupCustomerList: PropTypes.func.isRequired,
    groupCustomerList: PropTypes.object.isRequired,
    customerHotPossibleWordsList: PropTypes.array.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    operateGroupResult: PropTypes.string.isRequired,
    operateGroup: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    deleteGroupResult: PropTypes.string.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    deleteCustomerFromGroupResult: PropTypes.object.isRequired,
    deleteCustomerFromGroup: PropTypes.func.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    // 批量导入客户信息
    queryBatchCustList: PropTypes.func.isRequired,
    batchCustList: PropTypes.object.isRequired,

    // 获取标签列表
    queryLabelList: PropTypes.func.isRequired,
    // 标签列表
    labelListInfo: PropTypes.object.isRequired,
    // 删除单条标签
    deleteLabel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    customerGroupList: EMPTY_OBJECT,
  };

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 控制显示更新分组弹出层
      visible: false,
      modalKey: `groupModalKey${modalKeyCount}`,
      canEditDetail: true,
      // 分组名称
      name: '',
      // 分组描述
      description: '',
      modalTitle: '新建用户分组',
      groupId: '',
      record: {},
    };
  }

  componentDidMount() {
    const { location: { query } } = this.props;
    // 查询标签列表数据
    this.getLabelList(query);
  }

  componentDidUpdate(prevProps) {
    const { location: { query } } = this.props;
    const { location: { query: prevQuery } } = prevProps;
    if (query !== prevQuery) {
      // 查询标签列表数据
      this.getLabelList(query);
    }
  }

  componentWillUnmount() {
    this.setState({
      visible: false, // 控制显示更新分组弹出层
    });
  }

  /**
   * 根据url中的参数查询标签列表数据
   * @param {*} query url中测参数
   * @param {*} countFlag 传Y时表示需要查询客户数，传N不需要查询客户数
   */
  @autobind
  getLabelList(query = {}, countFlag = 'Y') {
    const {
      keyWord = '',
      curPageNum = INITIAL_CURPAGE,
      curPageSize = INITIAL_PAGESIZE,
    } = query;
    this.props.queryLabelList({
      currentPage: curPageNum,
      pageSize: curPageSize,
      labelNameLike: keyWord,
      countFlag,
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
      // 后台需要传，不传报错，对前端没啥意义
      type: '06',
    });
  }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, pathname } } = this.props;
    // 替换当前页码和分页条目
    this.context.replace({
      pathname,
      query: {
        ...query,
        curPageNum: nextPage,
        curPageSize: currentPageSize,
      },
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { location: { query, pathname } } = this.props;
    // 替换当前页码和分页条目
    this.context.replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: changedPageSize,
      },
    });
  }

  // 编辑客户分组
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '编辑客户分组',
    },
  })
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
      pageSize: 10,
    });
  }

  // 删除客户分组
  @autobind
  deleteCustomerGroup({ id }) {
    this.props.deleteLabel({ labelId: id })
      .then(({ resultData }) => {
        if (resultData === 'success') {
          message.success('标签删除成功');
          // 删除成功后，根据url中的参数重新获取标签列表
          const { location: { query } } = this.props;
          this.getLabelList(query);
          return;
        }
        message.warning('标签删除失败');
      });
  }

  // 发起任务
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '发起任务',
    },
  })
  lanuchTask(record) {
    console.log('launch task');
    const { id, labelName, countNum } = record;
    if (countNum <= 0) {
      message.error('该标签下没有客户，不能发起任务');
      return;
    }
    // 发起任务之前，清除数据
    this.props.clearCreateTaskData(SOURCE_LABELMANAGEMENT);

    this.handleOpenTab({
      labelId: id,
      labelName,
      count: countNum,
      source: SOURCE_LABELMANAGEMENT,
    }, '自建任务', 'RCT_FSP_CREATE_TASK_FROM_LABELMANAGEMENT');
  }

  @autobind
  handleOpenTab(obj, title, id) {
    const firstUrl = '/customerPool/createTask';
    const url = `${firstUrl}?${urlHelper.stringify(obj)}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id, // tab的id
      title, // tab标题
    };
    openRctTab({
      routerAction: this.context.push,
      url,
      param,
      pathname: firstUrl,
      query: obj,
    });
  }

  @autobind
  handleGroupListSearch(value) {
    console.log('search', value);
  }

  @autobind
  handleConfirmTipCancel() {
    console.log('cancel');
  }

  @autobind
  handleConfirmTipOk() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleNewModelConfirmTipCancel() {
    console.log('cancel');
  }

  @autobind
  handleNewModelConfirmTipOk() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '删除客户分组',
    },
  })
  handleDeleteBtnClick(record) {
    // 当前删除行记录数据
    confirm({
      onOk: () => this.deleteCustomerGroup(record),
      onCancel: _.noop,
    });
  }

  /**
   * 打开编辑或者新建分组详情记录modal
   * @param {*} record 当前记录
   */
  @autobind
  @logPV({ pathname: '/modal/createGroupDetailRecord', title: '编辑或者新建分组详情记录' })
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
  @logable({
    type: 'ViewItem',
    payload: {
      name: '客户分组管理',
    },
  })
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
      pageSize: 10,
    });
  }

  @autobind
  handleUpdateGroup() {
    console.log('show add group detail modal');
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCloseModal() {
    const { groupId, includeCustIdList } = this.detailRef.getData();
    if (groupId) {
      // 编辑模式下
      if (!_.isEmpty(includeCustIdList)) {
        // 存在custIdList,在取消的时候提示
        confirm({
          content: '客户已添加成功，如需取消添加的客户请在列表中删除',
          onOk: this.handleConfirmTipOk,
          onCancel: this.handleConfirmTipCancel,
        });
      } else {
        this.setState({
          visible: false,
        });
      }
    } else if (!_.isEmpty(includeCustIdList)) {
      confirm({
        content: '在新增模式下，添加客户需要提交才能生效，确认取消？',
        onOk: this.handleNewModelConfirmTipOk,
        onCancel: this.handleNewModelConfirmTipCancel,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  @autobind
  handleSubmitCloseModal() {
    this.setState({
      visible: false,
    });
  }

  /**
   * 根据搜索框输入值搜索分组
   * @param {*} value 搜索值
   */
  @autobind
  @checkSpecialCharacter
  @logable({
    type: 'Click',
    payload: {
      name: '搜索我的客户分组',
      value: '$args[0]',
    },
  })
  handleSearchGroup(value) {
    const {
      location: { pathname, query },
    } = this.props;
    this.context.replace({
      pathname,
      query: {
        ...query,
        keyWord: value,
        curPageNum: INITIAL_CURPAGE,
      },
    });
  }

  @autobind
  handleSubmit(e) {
    if (this.detailRef) {
      const { groupId, includeCustIdList } = this.detailRef.getData();

      e.persist();
      this.detailRef.getForm().validateFields((err, values) => {
        if (!err) {
          const { name = '', description } = values;
          this.submitFormContent(name, description, groupId, includeCustIdList);
          // log日志 --- 新建客户分组
          const type = groupId ? '编辑' : '新建';
          const formValues = {
            ...values,
            groupId,
            includeCustIdList,
          };
          logCommon({
            type: 'Submit',
            payload: {
              name: values.name,
              type,
              number: includeCustIdList.length,
              value: JSON.stringify(formValues),
            },
          });
        } else {
          message.error('请输入分组名称');
        }
      });
    }
  }

  @autobind
  @checkSpecialCharacter
  submitFormContent(name, description, groupId, includeCustIdList) {
    const { operateGroup, location: { query: { curPageNum, curPageSize, keyWord } } } = this.props;
    const postBody = {
      request: {
        groupName: name,
        groupDesc: description,
        includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
        excludeCustIdList: null,
      },
      keyWord,
      pageNum: curPageNum,
      pageSize: curPageSize,
    };
    if (groupId) {
      // 编辑分组
      operateGroup(_.merge(postBody, {
        request: {
          groupId,
        },
      }));
    } else {
      // 新增分组
      operateGroup(postBody);
    }
    // 关闭弹窗
    this.handleSubmitCloseModal();
  }

  /**
   * 添加客户到已经存在的分组中
   * 调用接口
   * @param {*object} param0 添加分组对象
   */
  @autobind
  addCustomerToExistedGroup({ includeCustIdList, name, description }) {
    const { groupId } = this.state;
    const { operateGroup, location: { query: { keyWord } } } = this.props;
    operateGroup({
      request: {
        groupId,
        groupName: name,
        groupDesc: description,
        includeCustIdList: _.isEmpty(includeCustIdList) ? null : includeCustIdList,
        excludeCustIdList: null,
      },
      keyWord,
    });
  }

  @autobind
  customerGroupDetailRef(ref) {
    this.detailRef = ref;
  }

  @autobind
  deleteCustomerFromGroup(param) {
    const { deleteCustomerFromGroup,
      location: { query: { curPageNum, curPageSize, keyWord } },
    } = this.props;
    deleteCustomerFromGroup({
      ...param,
      curPageNum,
      curPageSize,
      keyWord,
    });
  }

  renderActionSource() {
    return [{
      type: <Icon type="shanchu" />,
      handler: this.handleDeleteBtnClick,
    },
    {
      type: '发起任务',
      handler: this.lanuchTask,
    }];
  }

  renderColumnTitle() {
    return [{
      key: 'labelTypeName',
      value: '标签类型',
    },
    {
      key: 'labelName',
      value: '标签名称',
    },
    {
      key: 'labelDesc',
      value: '标签描述',
    },
    {
      key: 'countNum',
      value: '客户数',
    },
    {
      key: 'createdTime',
      value: '创建时间',
    },
    {
      key: 'action',
      value: '操作',
    }];
  }

  handleEditLabel(record, value) {
    console.log('record, value : ', record, value);
  }

  render() {
    const {
      // customerGroupList = EMPTY_OBJECT,
      groupCustomerList = EMPTY_OBJECT,
      customerHotPossibleWordsList = EMPTY_LIST,
      getGroupCustomerList,
      operateGroup,
      operateGroupResult,
      dict,
      deleteCustomerFromGroupResult,
      location,
      replace,
      queryBatchCustList,
      batchCustList,

      labelListInfo,
      location: { query: { keyWord } },
     } = this.props;

    const {
      visible,
      modalKey,
      canEditDetail,
      name,
      description,
      modalTitle,
      groupId,
    } = this.state;

    const {
      labelList = EMPTY_LIST,
      totalRecordNum,
      curPageNum,
      curPageSize,
    } = labelListInfo;


    // 风险等级字典信息
    const { custRiskBearing } = dict;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 构造operation
    const actionSource = this.renderActionSource();

    return (
      <div className={styles.groupPanelContainer}>
        <div className={styles.title}>标签管理</div>
        <div className={styles.operationRow}>
          <div className={styles.leftSection}>
            <SimpleSearch
              defaultValue={keyWord}
              onSearch={this.handleSearchGroup}
              placeholder="标签名"
              searchStyle={{
                height: '30px',
                width: '200px',
              }}
            />
          </div>
          <div className={styles.rightSection}>
            <Button
              type="primary"
              className={styles.transformBtn}
              onClick={this.showGroupDetailModal}
            >
              分组转标签
            </Button>
            <Button
              type="primary"
              className={styles.addBtn}
              onClick={this.showGroupDetailModal}
            >
              + 新建
            </Button>
          </div>
        </div>
        <div className={styles.groupTableContainer}>
          <Table
            pageData={{
              curPageNum,
              curPageSize,
              totalRecordNum,
              showSizeChanger: true,
              onShowSizeChange: this.handleShowSizeChange,
            }}
            listData={labelList}
            onSizeChange={this.handleShowSizeChange}
            onPageChange={this.handlePageChange}
            tableClass={tableStyles.groupTable}
            titleColumn={titleColumn}
            actionSource={actionSource}
            columnWidth={['10%', '10%', '30%', '15%', '15%', '20%']}
            clickableColumnCallbackList={[this.handleEditLabel]}
            clickableColumnIndexList={[2]}
          />
        </div>
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
              footer={<div className={styles.operationBtnSection}>
                <Button
                  className={styles.cancel}
                  onClick={this.handleCloseModal}
                >
                  取消
                </Button>
                <Button
                  htmlType="submit"
                  className={styles.submit}
                  type="primary"
                  // 加入节流函数
                  onClick={_.debounce(this.handleSubmit, 250)}
                >
                  提交
                </Button>
              </div>}
              modalContent={
                <CustomerGroupDetail
                  wrappedComponentRef={this.customerGroupDetailRef}
                  deleteCustomerFromGroupResult={deleteCustomerFromGroupResult}
                  deleteCustomerFromGroup={this.deleteCustomerFromGroup}
                  custRiskBearing={custRiskBearing}
                  canEditDetail={canEditDetail}
                  customerHotPossibleWordsList={customerHotPossibleWordsList}
                  getHotPossibleWds={this.queryHotPossibleWds}
                  customerList={groupCustomerList}
                  getGroupCustomerList={getGroupCustomerList}
                  operateGroup={operateGroup}
                  operateGroupResult={operateGroupResult}
                  detailData={{
                    name,
                    description,
                    groupId,
                  }}
                  location={location}
                  replace={replace}
                  onAddCustomerToGroup={this.addCustomerToExistedGroup}
                  queryBatchCustList={queryBatchCustList}
                  batchCustList={batchCustList}
                />
              }
              onOkHandler={this.handleUpdateGroup}
            /> : null
        }
      </div>
    );
  }
}

