/**
 * @Description: 分公司客户分配
 * @Author: Liujianshu
 * @Date: 2018-05-23 09:59:21
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-25 13:48:11
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
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

import FilialeCustTransferList from '../../components/common/appList';
import ViewListRow from '../../components/custAllot/ViewListRow';
import Detail from '../../components/custAllot/Detail';
import commonConfirm from '../../components/common/confirm_';
import { seibelConfig } from '../../config';
import { dva, emp } from '../../helper';
import seibelHelper from '../../helper/page/seibel';
import logable, { logPV } from '../../decorators/logable';

const dispatch = dva.generateEffect;
const { filialeCustTransfer, filialeCustTransfer: { pageType, status } } = seibelConfig;

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
};

const mapStateToProps = state => ({
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
  custData: state.custAllot.custLData,
  // 服务经理列表
  manageData: state.custAllot.manageData,
  // 已添加的客户列表
  addedCustData: state.custAllot.addedCustData,
  // 已添加的服务经理列表
  addedManageData: state.custAllot.addedManageData,
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
  // 提交成功后清除上一次查询的数据
  // emptyQueryData: fetchDataFunction(false, 'filialeCustTransfer/emptyQueryData'),
  // 清空批量划转的数据
  // clearMultiData: fetchDataFunction(true, 'filialeCustTransfer/clearMultiData', true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class CustAllot extends PureComponent {
  static propTypes = {
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
    // 已添加的客户
    addedCustData: PropTypes.object.isRequired,
    queryAddedCustList: PropTypes.func.isRequired,
    // 已添加的服务经理
    addedManageData: PropTypes.object.isRequired,
    queryAddedManageList: PropTypes.func.isRequired,
    // 提交数据
    saveChange: PropTypes.func.isRequired,
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
      queryDetailInfo({ flowId: item.flowId });
    }
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getList({ ...params, type: pageType }).then(this.getRightDetail);
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
    // 2.调用queryApplicationList接口，清空掉消息提醒页面带过来的 id， appId
    this.queryAppList({ ...query, ...obj, id: '', appId: '' }, 1, query.pageSize);
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


  // 打开弹窗
  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭分公司客户划转弹框' } })
  closeModal(modalKey, isNeedConfirm = true) {
    // 关闭模态框
    if (isNeedConfirm) {
      commonConfirm({
        shortCut: 'close',
        onOk: () => this.setState({
          [modalKey]: false,
        }),
        // onOk: this.clearBoardAllData,
      });
    } else {
      this.setState({
        [modalKey]: false,
      });
    }
  }

  // @autobind
  // closeModal(modalKey) {
  //   // 清除模态框组件
  //   this.setState({ [modalKey]: false });
  // }

  // 打开新建申请的弹出框
  @autobind
  @logPV({ pathname: '/modal/createProtocol', title: '新建分公司客户人工划转' })
  openCreateModalBoard() {
    this.setState({
      createModal: true,
    });
  }

  // 切换页码
  @autobind
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
    this.queryAppList(query, nextPage, currentPageSize);
  }

  // 切换每一页显示条数
  @autobind
  handlePageSizeChange(currentPageNum, changedPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
    this.queryAppList(query, 1, changedPageSize);
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '分公司客户人工划转左侧列表项',
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
    queryDetailInfo({ flowId });
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="filialeCustTransfer"
        type="kehu1"
        pageData={filialeCustTransfer}
      />
    );
  }

  render() {
    const {
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
    } = this.props;
    const { createModal, custModal, manageModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="filialeCustTransferPage"
        pageType={pageType}
        needSubType={false}
        stateOptions={status}
        empInfo={empInfo}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        checkUserIsFiliale={this.checkUserIsFiliale}
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
      onShowSizeChange: this.handlePageSizeChange,
    };

    const leftPanel = (
      <FilialeCustTransferList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <Detail
        location={location}
        data={detailInfo}
      />
    );

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="FilialeCustTransferList"
        />
        {
          createModal
          ?
            <CreateModal
              modalKey={'createModal'}
              custModalKey={'custModal'}
              manageModalKey={'manageModal'}
              visible={createModal}
              custVisible={custModal}
              manageVisible={manageModal}
              location={location}
              empInfo={empInfo}
              custRangeList={custRangeList}
              custData={custData}
              queryCustList={queryCustList}
              addedCustData={addedCustData}
              queryAddedCustList={queryAddedCustList}
              manageData={manageData}
              queryManageList={queryManageList}
              addedManageData={addedManageData}
              queryAddedManageList={queryAddedManageList}
              buttonData={buttonData}
              queryButtonList={queryButtonList}
              queryAppList={this.queryAppList}
              showModal={this.showModal}
              closeModal={this.closeModal}
              saveChange={saveChange}
            />
          :
            null
        }
        {
          custModal
          ?
            <AddCustModal
              modalKey={'custModal'}
              visible={custModal}
              data={custData}
              queryList={queryCustList}
              closeModal={this.closeModal}
            />
          :
            null
        }
        {
          manageModal
          ?
            <AddManageModal
              modalKey={'manageModal'}
              visible={manageModal}
              custRangeList={custRangeList}
              data={manageData}
              queryList={queryManageList}
              closeModal={this.closeModal}
              sendRequest={updateList}
            />
          :
            null
        }
      </div>
    );
  }
}
