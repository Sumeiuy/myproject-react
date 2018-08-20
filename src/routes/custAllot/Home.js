/**
 * @Description: 分公司客户分配
 * @Author: Liujianshu
 * @Date: 2018-05-23 09:59:21
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-07 16:59:46
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import CreateModal from '../../components/custAllot/CreateModal';
import AddCustModal from '../../components/custAllot/AddCustModal';
import AddManageModal from '../../components/custAllot/AddManageModal';
import TableDialog from '../../components/common/biz/TableDialog';

import BottonGroup from '../../components/permission/BottonGroup';
import CustAllotList from '../../components/common/appList';
import ApplyItem from '../../components/common/appList/ApplyItem';
import Detail from '../../components/custAllot/Detail';
import commonConfirm from '../../components/common/confirm_';
import config from '../../components/custAllot/config';
import { dva, emp, permission, convert, time } from '../../helper';
import seibelHelper from '../../helper/page/seibel';
import logable, { logPV, logCommon } from '../../decorators/logable';

const dispatch = dva.generateEffect;

const {
  titleList: { approvalColumns },
  ruleTypeArray,
  // custAllot,
  custAllot: { status, pageType },
  subType,
  clearDataArray,
  basicFilters,
  moreFilters,
  moreFilterData,
} = config;

// 登陆人的组织 ID
const empOrgId = emp.getOrgId();
// 登陆人的职位 ID
const empPstnId = emp.getPstnId();
// 新建弹窗的 key 值
const createModalKey = 'createModal';
// 服务经理弹窗
const manageModalKey = 'manageModal';
// 客户弹窗
const custModalKey = 'custModal';
// 审批人弹窗
const approverModalKey = 'approverModal';
// 取消按钮的值
const BTN_CANCLE_VALUE = 'cancel';

const effects = {
  // 获取左侧列表
  getList: 'app/getSeibleList',
  // 获取详情
  queryDetailInfo: 'custAllot/queryDetailInfo',
  // 获取下一步按钮以及审批人
  queryButtonList: 'custAllot/queryButtonList',
  // 查询客户列表
  queryCustList: 'custAllot/queryCustList',
  // 查询服务经理列表
  queryManageList: 'custAllot/queryManageList',
  // 批量添加客户或者服务经理、删除、清空
  updateList: 'custAllot/updateList',
  // 查询已经添加的客户，弹窗与详情中用到
  queryAddedCustList: 'custAllot/queryAddedCustList',
  // 查询已经添加的客户
  queryAddedManageList: 'custAllot/queryAddedManageList',
  // 提交客户分配
  saveChange: 'custAllot/saveChange',
  // 清除数据
  clearData: 'custAllot/clearData',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 组织机构树
  custRangeList: state.customerPool.custRange,
  // 左侧列表数据
  list: state.app.seibleList,
  // 右侧详情数据
  detailInfo: state.custAllot.detailInfo,
  // 获取按钮列表和下一步审批人
  buttonData: state.custAllot.buttonData,
  // 客户列表
  custData: state.custAllot.custData,
  // 服务经理列表
  manageData: state.custAllot.manageData,
  // 详情页已添加的客户列表
  detailAddedCustData: state.custAllot.detailAddedCustData,
  // 已添加的客户列表
  addedCustData: state.custAllot.addedCustData,
  // 已添加的服务经理列表
  addedManageData: state.custAllot.addedManageData,
  // 上传后更新的批次数据
  updateData: state.custAllot.updateData,
  saveChangeData: state.custAllot.saveChangeData,
});


const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: dispatch(effects.getList, { loading: true, forceFull: true }),
  // 获取详情
  queryDetailInfo: dispatch(effects.queryDetailInfo, { loading: true, forceFull: true }),
  // 获取按钮列表和下一步审批人
  queryButtonList: dispatch(effects.queryButtonList, { loading: true, forceFull: true }),
  // 查询客户列表
  queryCustList: dispatch(effects.queryCustList, { loading: true, forceFull: true }),
  // 查询服务经理列表
  queryManageList: dispatch(effects.queryManageList, { loading: true, forceFull: true }),
  // 批量添加客户或者服务经理、删除、清空
  updateList: dispatch(effects.updateList, { loading: true, forceFull: true }),
  // 查询已经添加的客户，弹窗与详情中用到
  queryAddedCustList: dispatch(effects.queryAddedCustList, { loading: true, forceFull: true }),
  // 查询已经添加的服务经理
  queryAddedManageList: dispatch(effects.queryAddedManageList, { loading: true, forceFull: true }),
  // 提交客户分配
  saveChange: dispatch(effects.saveChange, { loading: true, forceFull: true }),
  // 清除搜索数据
  clearData: dispatch(effects.clearData, { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class CustAllot extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 组织机构树
    custRangeList: PropTypes.array.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    queryDetailInfo: PropTypes.func.isRequired,
    detailAddedCustData: PropTypes.object.isRequired,
    // 按钮以及下一步审批人列表
    buttonData: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 客户列表
    custData: PropTypes.object.isRequired,
    queryCustList: PropTypes.func.isRequired,
    // 服务经理
    manageData: PropTypes.object.isRequired,
    queryManageList: PropTypes.func.isRequired,
    // 添加、删除、清空客户
    updateList: PropTypes.func.isRequired,
    updateData: PropTypes.object.isRequired,
    // 已添加的客户
    addedCustData: PropTypes.object.isRequired,
    queryAddedCustList: PropTypes.func.isRequired,
    // 已添加的服务经理
    addedManageData: PropTypes.object.isRequired,
    queryAddedManageList: PropTypes.func.isRequired,
    // 提交数据
    saveChange: PropTypes.func.isRequired,
    saveChangeData: PropTypes.object.isRequired,
    // 清除搜索数据
    clearData: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      createModal: false,
      custModal: false,
      manageModal: false,
      approverModal: false,
      // 审批人
      flowAuditors: [],
      ruleType: ruleTypeArray[0].value,
    };
  }

  componentDidMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    this.queryAppList(query, pageNum, pageSize);
  }

  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const {
      location: { query },
    } = this.props;
    const otherQuery = _.omit(query, ['currentId']);
    const otherPrevQuery = _.omit(prevQuery, ['currentId']);
    // query和prevQuery，不等时需要重新获取列表，但是首次进入页面获取列表在componentDidMount中调用过，所以不需要重复获取列表
    if (!_.isEqual(otherQuery, otherPrevQuery) && !_.isEmpty(prevQuery)) {
      const { pageNum, pageSize } = query;
      this.queryAppList(query, pageNum, pageSize);
    }
  }

  componentWillUnmount() {
    const { clearData } = this.props;
    clearData(clearDataArray[1]);
  }

  // 获取右侧详情
  @autobind
  getRightDetail() {
    const {
      replace,
      list,
      location: { pathname, query, query: { currentId } },
      queryDetailInfo,
    } = this.props;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { pageNum, pageSize } = list.page;
      let item = list.resultData[0];
      let itemIndex = _.findIndex(list.resultData, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.filter(list.resultData, o => String(o.id) === String(currentId))[0];
      } else {
        // 不存在currentId
        replace({
          pathname,
          query: {
            ...query,
            currentId: item.id,
            pageNum,
            pageSize,
          },
        });
        itemIndex = 0;
      }
      this.setState({
        activeRowIndex: itemIndex,
      });
      queryDetailInfo({ flowId: item.flowId, orgId: empOrgId, pageNum: 1, pageSize: 7 });
    }
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    getList({ ...params, type: pageType, subType }).then(this.getRightDetail);
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { replace, location } = this.props;
    const { query, pathname } = location;
    // 清空掉消息提醒页面带过来的 id
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        ...obj,
        id: '',
        appId: '',
      },
    });
  }

  // 判断当前登录用户部门是否是分公司
  @autobind
  checkUserIsFiliale() {
    const { custRangeList } = this.props;
    let isFiliale = true;
    if (!_.isEmpty(custRangeList)) {
      if (!emp.isFiliale(custRangeList, emp.getOrgId())) {
        isFiliale = false;
      }
    }
    return isFiliale;
  }

  // 是否显示创建按钮
  @autobind
  showCreateBtn() {
    return permission.hasKHFPGPermission() && this.checkUserIsFiliale();
  }

  // 打开弹窗
  @autobind
  @logPV({ pathname: '/modal/addCustAllot', title: '新建分公司客户分配批量添加弹窗' })
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭分公司客户分配弹框' } })
  closeModal(obj) {
    const { clearData } = this.props;
    const { modalKey, isNeedConfirm = true, clearDataType = '' } = obj;
    const { ruleType } = this.state;
    // 如果是关闭新建窗口，分配规则恢复默认值，其他窗口则不设置
    const newRuleType = modalKey === createModalKey ? ruleTypeArray[0].value : ruleType;
    // 关闭模态框
    if (isNeedConfirm) {
      commonConfirm({
        shortCut: 'close',
        onOk: () => this.setState({
          [modalKey]: false,
          ruleType: newRuleType,
        }, () => clearData(clearDataType)),
      });
    } else {
      this.setState({
        [modalKey]: false,
        ruleType: newRuleType,
      }, () => clearData(clearDataType));
    }
  }

  // 打开新建申请的弹出框
  @autobind
  @logPV({ pathname: '/modal/createCustAllotProtocol', title: '新建分公司客户分配' })
  openCreateModalBoard() {
    this.setState({
      createModal: true,
    });
  }

  // 切换页码
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '左侧列表分页' } })
  handlePageNumberChange(nextPage, currentPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
        pageSize: currentPageSize,
      },
    });
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '分公司客户分配左侧列表项',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleListRowClick(record, index) {
    const { id, flowId } = record;
    const {
      replace,
      location: { pathname, query, query: { currentId } },
      queryDetailInfo,
    } = this.props;
    if (currentId === String(id)) return;
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ activeRowIndex: index });
    queryDetailInfo({ flowId, orgId: empOrgId, pageSize: 7, pageNum: 1 });
  }


  // 更新客户或者服务经理接口
  @autobind
  updateCustOrEmp(payload, pageData) {
    const { updateList, queryAddedCustList, queryAddedManageList } = this.props;
    updateList(payload).then(() => {
      const { updateData } = this.props;
      const queryPayload = {
        id: updateData.appId,
        positionId: empPstnId,
        orgId: empOrgId,
        pageNum: 1,
        pageSize: 5,
      };
      // 从客户弹窗过来请求已添加的客户，否则请求已添加的服务经理
      const isCust = pageData.modalKey === 'custModal';
      const queryFunction = isCust ? queryAddedCustList : queryAddedManageList;
      queryFunction(queryPayload).then(() => {
        this.closeModal(pageData);

        if (!isCust) {
          const { addedManageData: { page } } = this.props;
          // 只有一位服务经理时，隐藏分配规则
          if (page.totalRecordNum <= 1) {
            this.handleRuleTypePropsChange(ruleTypeArray[0].value);
          }
        }
      });
    });
  }

  // 提交，点击后选择审批人
  @autobind
  handleSubmit(btnItem) {
    if (btnItem.operate === BTN_CANCLE_VALUE) {
      this.closeModal({
        modalKey: createModalKey,
        isNeedConfirm: true,
        clearDataType: clearDataArray[1],
      });
      logCommon({
        type: 'ButtonClick',
        payload: {
          name: '关闭分公司客户分配弹框',
        },
      });
      return;
    }
    const { addedCustData, addedManageData } = this.props;
    if (_.isEmpty(addedCustData)) {
      message.error('请添加客户');
      return;
    }
    if (_.isEmpty(addedManageData)) {
      message.error('请添加服务经理');
      return;
    }
    const { page: { totalRecordNum: custTotal } } = addedCustData;
    const { page: { totalRecordNum: manageTotal } } = addedManageData;
    if (custTotal <= 0) {
      message.error('请添加客户');
      return;
    }
    if (manageTotal <= 0) {
      message.error('请添加服务经理');
      return;
    }
    if (custTotal < manageTotal) {
      message.error('所选客户数量必须大于或者等于所选服务经理数量');
      return;
    }
    const { saveChange, updateData } = this.props;
    const { ruleType } = this.state;
    const payload = {
      id: updateData.appId,
      ruleType: manageTotal === 1 ? '' : ruleType,
      TGConfirm: false,
      positionId: empPstnId,
      orgId: empOrgId,
      auditors: '',
      groupName: '',
      approverIdea: '',
    };
    saveChange(payload).then(() => {
      const { saveChangeData } = this.props;
      // 提交没有问题
      if (saveChangeData.errorCode === '0') {
        this.setState({
          flowAuditors: btnItem.flowAuditors,
          approverModal: true,
        });
      } else {
        commonConfirm({
          shortCut: 'hasTouGu',
          onOk: () => {
            this.setState({
              flowAuditors: btnItem.flowAuditors,
              approverModal: true,
            });
          },
        });
      }
    });
    logCommon({
      type: 'Submit',
      payload: {
        title: '分公司客户分配提交',
        value: JSON.stringify({ ...payload }),
        name: '分公司客户分配提交',
      },
    });
  }

  // 提交成功之后的回调处理
  @autobind
  handleSuccessCallback() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;

    Modal.success({
      title: '提示',
      content: '提交成功，后台正在进行数据处理！若数据校验失败，可在首页通知提醒中查看失败原因。',
      onOk: () => {
        // 关闭审批人弹窗
        this.closeModal({
          modalKey: approverModalKey,
          isNeedConfirm: false,
          clearDataType: clearDataArray[1],
        });
        // 关闭新建弹窗
        this.closeModal({
          modalKey: createModalKey,
          isNeedConfirm: false,
          clearDataType: clearDataArray[1],
        });
        this.queryAppList({ ...query, id: '', appId: '' }, pageNum, pageSize);
      },
    });
  }

  @autobind
  handleRuleTypePropsChange(value = '') {
    this.setState({
      ruleType: value,
    });
  }

  // 选完审批人后的提交
  @autobind
  handleApproverModalOK(auth) {
    const { saveChange, updateData, addedManageData } = this.props;
    const { page: { totalRecordNum: manageTotal } } = addedManageData;
    const { flowAuditors, ruleType } = this.state;
    const payload = {
      id: updateData.appId,
      ruleType: manageTotal === 1 ? '' : ruleType,
      TGConfirm: true,
      positionId: empPstnId,
      orgId: empOrgId,
      auditors: auth.login,
      groupName: flowAuditors.nextGroupName,
      approverIdea: '',
    };
    saveChange(payload).then(this.handleSuccessCallback());
    logCommon({
      type: 'Submit',
      payload: {
        title: '选择审批人后分公司客户分配提交',
        value: JSON.stringify({ ...payload }),
        name: '选择审批人后分公司客户分配提交',
      },
    });
  }

  @autobind
  showSecondLineInfo() {
    return '';
  }

  @autobind
  showThirdLineInfo(data) {
    return time.format(data.createTime || '');
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    const { status: statusData } = record;
    const statusTags = [convert.getStatusByCode(statusData)];
    return (
      <ApplyItem
        key={record.id}
        data={record}
        index={index}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        pageName="custAllot"
        iconType="kehu1"
        subTypeName="分公司客户分配"
        statusTags={statusTags}
        showSecondLineInfo={this.showSecondLineInfo}
        showThirdLineInfo={this.showThirdLineInfo}
      />
    );
  }

  render() {
    const {
      dict,
      replace,
      location,
      empInfo,
      custRangeList,
      list,
      detailInfo,
      // 下一步按钮审批人数据以及接口
      buttonData,
      queryButtonList,
      // 客户列表与接口
      custData,
      queryCustList,
      // 已添加客户列表与接口
      detailAddedCustData,
      addedCustData,
      queryAddedCustList,
      // 服务经理列表与接口
      manageData,
      queryManageList,
      // 已添加服务经理列表与接口
      addedManageData,
      queryAddedManageList,
      // 提交走流程
      saveChange,
      // 添加客户或服务经理后提交事件
      updateList,
      updateData,
      clearData,
    } = this.props;
    const {
      createModal,
      custModal,
      manageModal,
      approverModal,
      flowAuditors,
      ruleType,
    } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="custAllotPage"
        pageType={pageType}
        stateOptions={status}
        empInfo={empInfo}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        isShowCreateBtn={this.showCreateBtn}
        basicFilters={basicFilters}
        moreFilters={moreFilters}
        moreFilterData={moreFilterData}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
    };

    // 左侧列表
    const leftPanel = (
      <CustAllotList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    // 右侧详情
    const rightPanel = (
      <Detail
        location={location}
        data={detailInfo}
        dict={dict}
        queryAddedCustList={queryAddedCustList}
        addedCustData={detailAddedCustData}
      />
    );


    const newButtonData = { ...buttonData };
    if (!_.isEmpty(newButtonData.flowButtons)) {
      const operateArray = _.map(newButtonData.flowButtons, 'operate');
      if (!_.includes(operateArray, BTN_CANCLE_VALUE)) {
        newButtonData.flowButtons.push({
          ...newButtonData.flowButtons[0],
          btnName: '取消',
          operate: 'cancel',
          flowBtnId: -1,
        });
      }
    }
    // 新建弹窗按钮
    const selfBtnGroup = (<BottonGroup
      list={newButtonData}
      onEmitEvent={this.handleSubmit}
    />);


    // 审批人弹窗
    const approvalProps = {
      visible: approverModal,
      onOk: this.handleApproverModalOK,
      onCancel: () => { this.setState({ approverModal: false }); },
      dataSource: flowAuditors,
      columns: approvalColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'approverModal',
      rowKey: 'login',
      searchShow: false,
    };

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="custAllotList"
        />
        {
          createModal
          ? <CreateModal
            dict={dict}
            modalKey={createModalKey}
            custModalKey={custModalKey}
            manageModalKey={manageModalKey}
            visible={createModal}
            location={location}
            empInfo={empInfo}
            custRangeList={custRangeList}
            ruleType={ruleType}
            handleRuleTypePropsChange={this.handleRuleTypePropsChange}
            custData={custData}
            queryCustList={queryCustList}
            addedCustData={addedCustData}
            queryAddedCustList={queryAddedCustList}
            manageData={manageData}
            queryManageList={queryManageList}
            addedManageData={addedManageData}
            queryAddedManageList={queryAddedManageList}
            selfBtnGroup={selfBtnGroup}
            queryButtonList={queryButtonList}
            queryAppList={this.queryAppList}
            showModal={this.showModal}
            closeModal={this.closeModal}
            saveChange={saveChange}
            updateList={updateList}
            updateData={updateData}
            clearData={clearData}
            sendRequest={this.updateCustOrEmp}
          />
          : null
        }
        {
          custModal
          ? <AddCustModal
            modalKey={custModalKey}
            visible={custModal}
            custRangeList={custRangeList}
            data={custData}
            addedCustData={addedCustData}
            queryList={queryCustList}
            closeModal={this.closeModal}
            sendRequest={this.updateCustOrEmp}
            updateData={updateData}
          />
          : null
        }
        {
          manageModal
          ? <AddManageModal
            modalKey={manageModalKey}
            visible={manageModal}
            custRangeList={custRangeList}
            data={manageData}
            queryList={queryManageList}
            closeModal={this.closeModal}
            sendRequest={this.updateCustOrEmp}
            handleRuleTypePropsChange={this.handleRuleTypePropsChange}
            updateData={updateData}
          />
          : null
        }
        {
          approverModal ? <TableDialog {...approvalProps} /> : null
        }
      </div>
    );
  }
}
