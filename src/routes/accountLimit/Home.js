/**
 * @Description: 账户限制管理首页
 * @Author: Liujianshu
 * @Date: 2018-07-31 14:46:25
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-03 14:09:09
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
import CreateModal from '../../components/accountLimit/CreateModal';
import CustAllotList from '../../components/common/appList';
import ApplyItem from '../../components/common/appList/ApplyItem';
import Detail from '../../components/accountLimit/Detail';
import commonConfirm from '../../components/common/confirm_';
import config from '../../components/accountLimit/config';
import { permission, env, dva, emp, convert, time } from '../../helper';
import seibelHelper from '../../helper/page/seibel';
import logable, { logPV } from '../../decorators/logable';

const dispatch = dva.generateEffect;

const {
  statusArray,
  pageName,
  pageValue,
  pageType,
  operateTypeArray,
  relieveCode,  // 限制解除的 value
  basicFilters,
  moreFilters,
  moreFilterData,
} = config;

// 登陆人的组织 ID
const empOrgId = emp.getOrgId();
// const empOrgId = 'ZZ001041051';
// 新建弹窗的 key 值
const createModalKey = 'createModal';

const effects = {
  // 获取左侧列表
  getList: 'app/getSeibleList',
  // 获取详情
  queryDetailInfo: 'accountLimit/queryDetailInfo',
  // 获取下一步按钮以及审批人
  queryButtonList: 'accountLimit/queryButtonList',
  // 查询客户列表
  queryCustList: 'accountLimit/queryCustList',
  // 查询限制类型
  queryLimtList: 'accountLimit/queryLimtList',
  // 提交客户分配
  saveChange: 'accountLimit/saveChange',
  // 清除数据
  clearData: 'accountLimit/clearData',
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
  detailInfo: state.accountLimit.detailInfo,
  // 获取按钮列表和下一步审批人
  buttonData: state.accountLimit.buttonData,
  // 查询客户列表
  searchCustData: state.accountLimit.searchCustData,
  // 已添加客户列表
  addedCustData: state.accountLimit.addedCustData,
  // 限制类型列表
  limitList: state.accountLimit.limitList,
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
  // 查询限制类型列表
  queryLimtList: dispatch(effects.queryLimtList, { loading: true, forceFull: true }),
  // 提交客户分配
  saveChange: dispatch(effects.saveChange, { loading: true, forceFull: true }),
  // 清除搜索数据
  clearData: dispatch(effects.clearData, { loading: false }),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class AccountLimitHome extends PureComponent {
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
    // 按钮以及下一步审批人列表
    buttonData: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 客户列表
    searchCustData: PropTypes.array.isRequired,
    addedCustData: PropTypes.array.isRequired,
    queryCustList: PropTypes.func.isRequired,
    // 查询限制类型列表
    limitList: PropTypes.array.isRequired,
    queryLimtList: PropTypes.func.isRequired,
    // 提交数据
    saveChange: PropTypes.func.isRequired,
    // 清除数据
    clearData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      createModal: false,
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
      const { page: { pageNum = 1, pageSize = 10 }, resultData } = list;
      let item = resultData[0];
      let itemIndex = _.findIndex(resultData, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = resultData[itemIndex];
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
      queryDetailInfo({
        flowId: item.flowId,
        orgId: empOrgId,
        pageNum: 1,
        pageSize: 7,
      });
    }
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    getList({ ...params, type: pageType }).then(this.getRightDetail);
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { business2 = '', ...restObj } = obj;
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
    this.queryAppList({ ...query, ...restObj, id: '', appId: '', business2: '', subType: business2 }, 1, query.pageSize);
  }

  // 判断当前登录权限
  @autobind
  showCreateBtn() {
    const { custRangeList } = this.props;
    let show = true;
    if (!_.isEmpty(custRangeList)) {
      // HTSC 综合服务-营业部执行岗、HTSC 限制性账户审批岗
      show = permission.hasZHFWYYBZXGPermission() && permission.hasXZXZHSPGPermission();
    }
    // 本地显示新建按钮， FSP 环境下不显示
    show = !env.isInFsp();
    return show;
  }

  // 关闭弹窗
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭账户限制管理弹框' } })
  closeModal(obj) {
    const { modalKey, isNeedConfirm = true } = obj;
    // 关闭模态框
    if (isNeedConfirm) {
      commonConfirm({
        shortCut: 'close',
        onOk: () => this.setState({
          [modalKey]: false,
        }),
      });
    } else {
      this.setState({
        [modalKey]: false,
      });
    }
  }

  // 打开新建申请的弹出框
  @autobind
  @logPV({ pathname: '/modal/createAccountLimitModal', title: '新建账户限制管理' })
  openCreateModalBoard() {
    this.setState({
      createModal: true,
    });
  }

  // 左侧列表分页
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
    this.queryAppList(query, nextPage, currentPageSize);
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '账户限制管理左侧列表项',
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
    if (currentId === String(id)) {
      return;
    }
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ activeRowIndex: index });
    queryDetailInfo({
      flowId,
      orgId: empOrgId,
      pageSize: 7,
      pageNum: 1,
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
    const { status: statusData, subType } = record;
    const statusTags = [convert.getStatusByCode(statusData)];
    const filterOperate = _.filter(operateTypeArray, o => o.value === subType);
    const operateTypeName = filterOperate[0].label || '';
    // 限制解除时为字体加上其他颜色
    const otherStyle = subType === relieveCode
    ? {
      color: '#dc8f4c',
    }
    : null;
    return (
      <ApplyItem
        key={record.id}
        data={record}
        index={index}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        pageName={pageName}
        iconType="kehu1"
        typeName={operateTypeName}
        typeNameStyle={otherStyle}
        subTypeName={pageName}
        statusTags={statusTags}
        showSecondLineInfo={this.showSecondLineInfo}
        showThirdLineInfo={this.showThirdLineInfo}
      />
    );
  }

  render() {
    const {
      dict,
      location,
      empInfo,
      custRangeList,
      list,
      detailInfo,
      // 下一步按钮审批人数据以及接口
      buttonData,
      queryButtonList,
      // 客户列表与接口
      searchCustData,
      addedCustData,
      queryCustList,
      // 限制类型
      limitList,
      queryLimtList,
      // 提交走流程
      saveChange,
      clearData,
    } = this.props;

    const {
      createModal,
    } = this.state;
    const isEmpty = _.isEmpty(list.resultData);

        // 操作类型增加全部
    const operateAllOptions = [
      {
        show: true,
        label: '全部',
        value: '',
      },
      ...operateTypeArray,
    ];


    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        page={pageValue}
        pageType={pageType}
        stateOptions={statusArray}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        operateOptions={operateAllOptions}
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
      />
    );

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="departmentCustAllotList"
        />
        {
          createModal
          ? <CreateModal
            dict={dict}
            modalKey={createModalKey}
            visible={createModal}
            location={location}
            empInfo={empInfo}
            custRangeList={custRangeList}
            searchCustData={searchCustData}
            addedCustData={addedCustData}
            queryCustList={queryCustList}
            limitList={limitList}
            queryLimtList={queryLimtList}
            buttonData={buttonData}
            queryButtonList={queryButtonList}
            queryAppList={this.queryAppList}
            closeModal={this.closeModal}
            saveChange={saveChange}
            clearData={clearData}
          />
          : null
        }
      </div>
    );
  }
}
