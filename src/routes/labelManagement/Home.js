/*
 * 标签管理页面
 * @Author: WangJunJun
 * @Date: 2018-08-03 10:50:48
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-21 16:59:33
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import _ from 'lodash';
import { emp } from '../../helper';

import Button from '../../components/common/Button';
import Table from '../../components/common/commonTable';
import GroupModal from '../../components/customerPool/groupManage/CustomerGroupUpdateModal';
import CreateAndEditLabelModalContent from '../../components/labelManagement/CreateAndEditLabelModalContent';
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
import GroupToLabel from '../../components/labelManagement/groupToLabel';
import CustRange from '../../components/customerPool/list/manageFilter/CustFilter';
import effects from './effects';
import {
  INITIAL_PAGESIZE, INITIAL_CURPAGE,
  MODALTITLE_CREATELABEL, MODALTITLE_EDITLABEL,
  COLUMNS_LABELTABLE,
} from './config';
import { SOURCE_LABELMANAGEMENT } from '../../config/createTaskEntry';

const dispatch = dva.generateEffect;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const mapStateToProps = state => ({
  // 联想的推荐热词列表
  customerHotPossibleWordsList: state.customerPool.customerHotPossibleWordsList,
  // 字典信息
  dict: state.app.dict,
  // 批量导入客户信息
  batchCustList: state.customerPool.batchCustList,

  // 标签列表
  labelListInfo: state.labelManagement.labelListInfo,
  // 客户分组列表数据
  custGroupListInfo: state.labelManagement.custGroupListInfo,
  // 分组下的客户数据
  groupCustInfo: state.labelManagement.groupCustInfo,
  // 通过关键词联想出来的标签数据
  possibleLabelListInfo: state.labelManagement.possibleLabelListInfo,
  // 单个标签下的客户信息数据
  labelCustInfo: state.labelManagement.labelCustInfo,
  // 组织机构树
  custRange: state.customerPool.custRange,
});

const mapDispatchToProps = {
  // 获取热词列表
  getHotPossibleWds: dispatch(effects.getHotPossibleWds, { loading: false }),
  // 获取上传excel文件解析后的客户
  queryBatchCustList: dispatch(effects.queryBatchCustList, { loading: true, forceFull: true }),
  // 清除数据
  clearCreateTaskData: dispatch(effects.clearCreateTaskData, { loading: true, forceFull: true }),
  // 获取标签列表
  queryLabelList: dispatch(effects.queryLabelList, { loading: true }),
  // 删除单条标签
  deleteLabel: dispatch(effects.deleteLabel, { loading: true }),
  // 检查标签是否重名
  checkDuplicationName: dispatch(effects.checkDuplicationName, { loading: false }),
  // 查询客户分组列表数据
  queryCustGroupList: dispatch(effects.queryCustGroupList, { loading: true }),
  // 查询分组下的客户
  queryGroupCustList: dispatch(effects.queryGroupCustList, { loading: true }),
  // 通过关键词联想标签
  queryPossibleLabels: dispatch(effects.queryPossibleLabels, { loading: false }),
  // 清空联想标签数据
  clearPossibleLabels: dispatch(effects.clearPossibleLabels, { loading: false }),
  // 分组转标签
  group2Label: dispatch(effects.group2Label, { loading: true }),
  // 查询标签下的客户
  queryLabelCust: dispatch(effects.queryLabelCust, { loading: true }),
  // 新建编辑标签
  operateLabel: dispatch(effects.operateLabel, { loading: true }),
  // 删除标签下的客户
  deleteLabelCust: dispatch(effects.deleteLabelCust, { loading: true }),
  // 验证是否名下客户
  isSendCustsServedByEmp: dispatch(effects.isSendCustsServedByEmp, { loading: true }),
};

// 处理创建部门数据
function transformCustRange(data) {
  return [
    {
      id: '',
      level: 1,
      name: '不限',
    },
    {
      id: 'self',
      level: 1,
      name: '我的标签',
    },
    ...data,
  ];
}

let modalKeyCount = 0;

// 搜索框的样式
const searchStyle = {
  height: '30px',
  width: '200px',
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerGroupManage extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    customerHotPossibleWordsList: PropTypes.array.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
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
    // 检查标签是否重名
    checkDuplicationName: PropTypes.func.isRequired,
    // 查询分组下的客户
    queryGroupCustList: PropTypes.func.isRequired,
    // 分组下的客户列表数据
    groupCustInfo: PropTypes.object.isRequired,
    // 通过关键词联想标签
    queryPossibleLabels: PropTypes.func.isRequired,
    // 通过关键词联想出来的标签数据
    possibleLabelListInfo: PropTypes.object.isRequired,
    // 清空联想标签数据
    clearPossibleLabels: PropTypes.func.isRequired,
    // 分组转标签
    group2Label: PropTypes.func.isRequired,
    // 查询标签下的客户
    queryLabelCust: PropTypes.func.isRequired,
    // 单个标签下的客户信息数据
    labelCustInfo: PropTypes.object.isRequired,
    // 新建编辑标签信息
    operateLabel: PropTypes.func.isRequired,
    // 删除标签下的客户
    deleteLabelCust: PropTypes.func.isRequired,
    // 验证是否名下客户
    isSendCustsServedByEmp: PropTypes.func.isRequired,
    // 查询分组列表
    queryCustGroupList: PropTypes.func.isRequired,
    // 分组列表数据
    custGroupListInfo: PropTypes.object.isRequired,
    // 组织机构树
    custRange: PropTypes.array.isRequired,
  };

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 是否显示新建编辑标签模态框
      visible: false,
      modalKey: `groupModalKey${modalKeyCount}`,
      canEditDetail: true,
      // 分组名称
      name: '',
      // 分组描述
      description: '',
      id: '',
      record: {},
      // 分组转标签模态框
      isShowGroupToLabelModal: false,
      // 默认弹出的新建标签的模态框
      isCreateLabel: true,
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
      orgId = '',
      curPageNum = INITIAL_CURPAGE,
      curPageSize = INITIAL_PAGESIZE,
    } = query;
    this.props.queryLabelList({
      currentPage: curPageNum,
      pageSize: curPageSize,
      labelNameLike: keyWord,
      countFlag,
      orgId,
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

  // 查看标签
  @autobind
  @logPV({ pathname: '/modal/createAndEditLabelModalContent', title: '查看标签' })
  handleEditLabel(record, type) {
    const { id } = record;
    const { queryLabelCust } = this.props;
    const canEdit = type !== '标签名称'; // 是否可以编辑标签
    this.showLabelDetailModal(record, false, canEdit);
    // 获取标签下的客户列表
    queryLabelCust({
      labelId: id,
      pageNum: 1,
      pageSize: 10,
    });
  }

  // 删除客户分组
  @autobind
  deleteCustomerGroup({ id, labelFlagCode }) {
    this.props.deleteLabel({ labelId: id, labelFlag: labelFlagCode })
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
      name: '客户标签列表',
    },
  })
  createTask(record = {}) {
    const { id, labelName, custCount } = record;
    if (custCount <= 0) {
      message.error('该标签下没有客户，不能发起任务');
      return;
    }
    // 验证标签内的客户是否名下客户
    this.props.isSendCustsServedByEmp({ signedLabelId: id }).then(({ resultData }) => {
      if (!resultData || !resultData.sendCustsServedByPostn) {
        message.warn('标签客户包含非自己名下的客户，不能发起任务');
        return;
      }
      // 发起任务之前，清除数据
      this.props.clearCreateTaskData(SOURCE_LABELMANAGEMENT);

      this.handleOpenTab({
        signedLabelId: id,
        labelName,
        count: custCount,
        source: SOURCE_LABELMANAGEMENT,
      }, '自建任务', 'RCT_FSP_CREATE_TASK_FROM_LABELMANAGEMENT');
    });
  }

  @autobind
  handleOpenTab(obj, title, id) {
    const firstUrl = '/customerPool/createTaskFromLabelManagement';
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
  @logable({
    type: 'ViewItem',
    payload: {
      name: '客户标签列表',
    },
  })
  handleDeleteBtnClick(record = {}) {
    // 当前删除行记录数据
    confirm({
      onOk: () => this.deleteCustomerGroup(record),
      onCancel: _.noop,
      content: record.custCount && '删除标签将同时清除被标记客户的对应标签，确定要删除吗？',
    });
  }

  /**
   * 打开编辑或者新建标签详情记录modal
   * @param {*} record 当前记录
   */
  @autobind
  @logPV({ pathname: '/modal/createNewLabel', title: '新建标签' })
  showLabelDetailModal(record = {}, isCreateLabel = true, canEdit = false) {
    const { labelName = '', labelDesc = '', id = '', labelTypeId } = record;
    this.setState({
      visible: true,
      modalKey: `groupModalKey${modalKeyCount++}`,
      // 只可以修改【我的标签】的标签名称和描述，管理标签不可以修改标签名称和描述
      canEditDetail: canEdit && labelTypeId && labelTypeId === '0',
      name: labelName,
      description: labelDesc,
      id,
      isCreateLabel,
      canEdit,
      record,
    });
  }

  // 显示新建标签模态框
  @autobind
  @logPV({ pathname: '/modal/createAndEditLabelModalContent', title: '新建标签' })
  showCreateLabelModal() {
    this.showLabelDetailModal({}, true, true);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCloseModal() {
    const { custIds } = this.detailRef.getData();
    if (!_.isEmpty(custIds)) {
      const content = !this.state.isCreateLabel
        ? '客户已添加成功，如需取消添加的客户请在列表中删除'
        : '在新增模式下，添加客户需要提交才能生效，确认取消？';
      confirm({
        content,
        onOk: () => { this.toggleCreateAndEditLabelModalVisible(false); },
        onCancel: _.noop,
      });
    } else {
      this.toggleCreateAndEditLabelModalVisible(false);
    }
  }

  /**
   * 根据搜索框输入值搜索标签
   * @param {*} value 搜索值
   */
  @autobind
  @checkSpecialCharacter
  @logable({
    type: 'Click',
    payload: {
      name: '关键词搜索标签',
      value: '$args[0]',
    },
  })
  handleSearchLabel(value) {
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
      const { custIds } = this.detailRef.getData();
      e.persist();
      const form = this.detailRef.getForm();
      form.validateFields((err, values) => {
        if (!err) {
          // 校验标签重名
          this.props.checkDuplicationName({
            labelName: values.name,
            labelFlag: '1',
          }).then((duplicationName) => {
            // 新建模式下校验重名
            if (duplicationName) {
              form.setFields({
                name: {
                  value: values.name,
                  errors: [new Error('该标签已存在，请重新输入')],
                },
              });
              return;
            }
            const { name = '', description } = values;
            this.submitFormContent(name, description, custIds);
            // log日志
            const formValues = {
              ...values,
              custIds,
            };
            logCommon({
              type: 'Submit',
              payload: {
                name: values.name,
                type: '新建',
                number: custIds.length,
                value: JSON.stringify(formValues),
              },
            });
          });
        }
      });
    }
  }

  @autobind
  submitFormContent(name, description, custIds) {
    const { operateLabel } = this.props;
    const postBody = {
      request: {
        labelName: name,
        labelDesc: description,
        custIds: _.isEmpty(custIds) ? null : custIds,
        excludeCustIdList: null,
        orgId: emp.getOrgId(),
      },
    };
    // 新增标签
    operateLabel(postBody).then((res) => {
      if (res.resultData === 'success') {
        message.success('新建标签成功');
        this.handleComparedGetLabelList();
      }
    });
    // 关闭弹窗
    this.toggleCreateAndEditLabelModalVisible(false);
  }

  // 在新建、编辑或者分组转标签成功时
  // 进行多次提交的时候，url的参数在push时没有改变不请求
  // 需要单独发一个请求
  @autobind
  handleComparedGetLabelList() {
    const {
      location: {
        pathname,
        query: {
          curPageNum = INITIAL_CURPAGE,
          keyWord = '',
          curPageSize = INITIAL_PAGESIZE,
        },
      },
    } = this.props;
    if (curPageNum === INITIAL_CURPAGE && curPageSize === INITIAL_PAGESIZE && keyWord === '') {
      this.getLabelList({
        curPageNum: INITIAL_CURPAGE,
        curPageSize: INITIAL_PAGESIZE,
      });
    } else {
      this.context.push({
        pathname,
      });
    }
  }

  /**
   * 更新标签的信息，包括标签的名称、描述、客户
   * 调用接口
   * @param {*object} param0
   *   data: 标签信息
   *   isNeedQueryLabelCust：是否需要去重新查询标签下的客户
   *   callback：更新标签成功后回调
   */
  @autobind
  handleUpdateLabel({ data, isNeedQueryLabelCust = true }) {
    const { custIds, name, description } = data;
    const { id } = this.state;
    const { operateLabel, queryLabelCust } = this.props;
    // log日志
    const formValues = {
      name,
      description,
      id,
      custIds,
    };
    logCommon({
      type: 'Submit',
      payload: {
        name,
        type: '编辑',
        number: custIds.length,
        value: JSON.stringify(formValues),
      },
    });
    return operateLabel({
      request: {
        labelIds: [id],
        labelName: name,
        labelDesc: description,
        custIds: _.isEmpty(custIds) ? null : custIds,
        excludeCustIdList: null,
        orgId: emp.getOrgId(),
      },
    }).then((res) => {
      if (res.resultData === 'success') {
        message.success('更新标签成功');
        this.handleComparedGetLabelList();
        if (isNeedQueryLabelCust) {
          queryLabelCust({
            pageNum: INITIAL_CURPAGE,
            pageSize: INITIAL_PAGESIZE,
            labelId: id,
          });
        }
      }
    });
  }

  // 创建部门change事件
  @autobind
  handleCustRange({ orgId }) {
    const {
      location: { pathname, query },
    } = this.props;
    this.context.replace({
      pathname,
      query: {
        ...query,
        orgId,
        curPageNum: INITIAL_CURPAGE,
      },
    });
  }

  @autobind
  customerGroupDetailRef(ref) {
    if (ref) {
      this.detailRef = ref;
    }
  }

  // 显示隐藏分组转标签模态框
  @autobind
  toggleGroupToLabelModalVisible(bool) {
    this.setState({
      isShowGroupToLabelModal: bool,
    });
  }

  // 显示分组转标签的模态框
  @autobind
  @logPV({ pathname: '/modal/groupToLabel', title: '分组转标签' })
  showGroupToLabelModal() {
    this.toggleGroupToLabelModalVisible(true);
  }

  // 显示隐藏新建编辑标签模态框
  @autobind
  toggleCreateAndEditLabelModalVisible(bool) {
    this.setState({
      visible: bool,
    });
  }

  renderActionSource() {
    return [{
      key: 'delete',
      type: <Icon type="shanchu" className={styles.deleteIcon} />,
      handler: this.handleDeleteBtnClick,
    },
    {
      key: 'edit',
      type: <i className={`icon iconfont icon-shenqing ${styles.editIcon}`} />,
      handler: this.handleEditLabel,
    },
    {
      key: 'launchTask',
      type: (
        <span>
          <Icon type="faqirenwu" className={styles.launchTaskIcon} />
          发起任务
        </span>
      ),
      handler: this.createTask,
    }];
  }

  // 新建标签显示[取消]、[提交]按钮，编辑标签显示[确定]按钮
  @autobind
  renderModalFooter() {
    if (this.state.isCreateLabel) {
      return (
        <div className={styles.operationBtnSection}>
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
            onClick={_.debounce(this.handleSubmit, 250)}
          >
            提交
          </Button>
        </div>
      );
    }
    return (
      <div className={styles.operationBtnSection}>
        <Button
          className={styles.submit}
          type="primary"
          onClick={this.handleCloseModal}
        >
          确定
        </Button>
      </div>
    );
  }

  render() {
    const {
      customerHotPossibleWordsList = EMPTY_LIST,
      dict,
      location,
      queryBatchCustList,
      batchCustList,
      custRange,
      labelListInfo,
      location: { query: { keyWord, orgId } },
      checkDuplicationName,
      queryCustGroupList,
      custGroupListInfo,
      queryGroupCustList,
      groupCustInfo,
      queryPossibleLabels,
      possibleLabelListInfo,
      clearPossibleLabels,
      group2Label,
      queryLabelCust,
      labelCustInfo = EMPTY_OBJECT,
      deleteLabelCust,
     } = this.props;

    const {
      visible,
      modalKey,
      canEditDetail,
      name,
      description,
      id,
      isShowGroupToLabelModal,
      isCreateLabel,
      record,
      canEdit,
    } = this.state;

    const {
      labelList = EMPTY_LIST,
      totalRecordNum,
      curPageNum,
      curPageSize,
    } = labelListInfo;


    // 风险等级字典信息
    const { custRiskBearing } = dict;

    // 构造operation
    const actionSource = this.renderActionSource();

    let  modalTitle = isCreateLabel ?  MODALTITLE_CREATELABEL : MODALTITLE_EDITLABEL;

    if(!isCreateLabel && !canEdit) {
      modalTitle = '标签信息';
    }

    return (
      <div className={styles.groupPanelContainer}>
        <div className={styles.title}>标签管理</div>
        <div className={styles.operationRow}>
          <div className={styles.leftSection}>
            <SimpleSearch
              defaultValue={keyWord}
              onSearch={this.handleSearchLabel}
              placeholder="标签名称"
              searchStyle={searchStyle}
              isNeedBtn
            />
            <div className={styles.custRange}>
              <CustRange
                filterName="创建部门"
                defaultFirst
                orgId={orgId}
                custRange={transformCustRange(custRange)}
                updateQueryState={this.handleCustRange}
              />
            </div>
          </div>
          <div className={styles.rightSection}>
            <Button
              type="primary"
              className={styles.transformBtn}
              onClick={this.showGroupToLabelModal}
            >
              分组转标签
            </Button>
            <Button
              type="primary"
              className={styles.addBtn}
              onClick={this.showCreateLabelModal}
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
            }}
            listData={labelList}
            onPageChange={this.handlePageChange}
            tableClass={`${tableStyles.groupTable} ${styles.labelList}`}
            titleColumn={COLUMNS_LABELTABLE}
            actionSource={actionSource}
            columnWidth={['16%', '37%', '17%', '10%', '20%']}
            clickableColumnCallbackList={[this.handleEditLabel]}
            clickableColumnIndexList={[1]}
            actionClass={styles.actionSource}
            isCustomerDelete
          />
        </div>
        {
          visible && <GroupModal
            wrapperClass={styles.groupModalContainer}
            // 为了每次都能打开一个新的modal
            key={modalKey}
            visible={visible}
            title={modalTitle}
            footer={this.renderModalFooter()}
            closable
            onCancel={this.handleCloseModal}
            modalContent={
              <CreateAndEditLabelModalContent
                wrappedComponentRef={this.customerGroupDetailRef}
                deleteLabelCust={deleteLabelCust}
                custRiskBearing={custRiskBearing}
                canEditDetail={canEditDetail}
                customerHotPossibleWordsList={customerHotPossibleWordsList}
                getHotPossibleWds={this.queryHotPossibleWds}
                customerList={labelCustInfo}
                getGroupCustomerList={queryLabelCust}
                detailData={{ name, description, id, record }}
                location={location}
                onUpdateLabel={this.handleUpdateLabel}
                queryBatchCustList={queryBatchCustList}
                batchCustList={batchCustList}
                checkDuplicationName={checkDuplicationName}
                isCreateLabel={isCreateLabel}
                onComparedGetLabelList={this.handleComparedGetLabelList}
                createTask={this.createTask}
                title={modalTitle}
              />
            }
          />
        }
        {isShowGroupToLabelModal && <GroupToLabel
          location={location}
          visible={isShowGroupToLabelModal}
          toggleGroupToLabelModalVisible={this.toggleGroupToLabelModalVisible}
          queryCustGroupList={queryCustGroupList}
          custGroupListInfo={custGroupListInfo}
          queryGroupCustList={queryGroupCustList}
          groupCustInfo={groupCustInfo}
          queryPossibleLabels={queryPossibleLabels}
          possibleLabelListInfo={possibleLabelListInfo}
          clearPossibleLabels={clearPossibleLabels}
          group2Label={group2Label}
          onComparedGetLabelList={this.handleComparedGetLabelList}
        />}
      </div>
    );
  }
}

