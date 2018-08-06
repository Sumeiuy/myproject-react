/**
 * @Author: sunweibin
 * @Date: 2018-05-08 13:50:40
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-17 17:43:42
 * @description 营业部非投顾签约客户分配首页
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import { propsShape, defaultProps } from './defaultPropsShape';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import CommissionHeader from '../../components/common/biz/ConnectedSeibelHeader';
import CommissionList from '../../components/common/appList';
import ApplyItem from '../../components/businessDepartmentCustDistribute/ApplyItem';
import NotTGCustDistributeApplyDetail from '../../components/businessDepartmentCustDistribute/NotTGCustDistributeApplyDetail';
import CreateDistributeApplyBoard from '../../components/businessDepartmentCustDistribute/CreateDistributeApplyBoard';
import { logPV } from '../../decorators/logable';
import { permission } from '../../helper';
import config from './config';
import utils from './utils';

@withRouter
@Barable
export default class Home extends PureComponent {
  static contextTypes = {
    replace: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 新建营业部非投顾掐约客户分配申请的弹出层
      createApplyModalShow: false,
      // 当前选中的列表项的索引
      activeRowIndex: 0,
    };
  }

  componentDidMount() {
    const { location: { query } } = this.props;
    this.queryList(query);
  }

  @autobind
  getRightDetail() {
    const { replace } = this.context;
    const { list, location: { pathname, query, query: { currentId } } } = this.props;
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
      // TODO 此处后期需要根据定义的接口修改相应的参数
      this.props.getDetail({ flowId: item.flowId });
    }
  }

  @autobind
  getDetailComponenet() {
    // 返回详情组件，目前只有一类,
    const {
      location: { query: { currentId = '' } },
      detailInfo,
    } = this.props;
    return (
      <NotTGCustDistributeApplyDetail
        currentId={currentId}
        data={detailInfo}
      />
    );
  }

  @autobind
  queryList(query) {
    // TODO 此处需要将 type 修改为真实的值
    const stickQuery = { pageNum: 1, pageSize: 10, type: '07' };
    const fixedQuery = utils.fixQuery(query);
    this.props.getList({ ...stickQuery, ...fixedQuery }).then(this.getRightDetail);
  }

  // 点击右上角新建按钮，打开新建营业部非投顾掐约客户分配申请的弹出层
  @autobind
  @logPV({ pathname: '/modal/businessDepartmentCustDistributeApply', title: '新建营业部非投顾掐约客户分配申请' })
  handleCreateApplyBtnClick() {
    this.setState({
      createApplyModalShow: true,
    });
  }

  @autobind
  handleApplyBoardClose() {
    this.setState({
      createApplyModalShow: false,
    });
  }

  @autobind
  handleApplyBoardSubmit(query) {
    this.props.createDistributeApply(query).then(() => {
      const { createResult } = this.props;
      if (createResult) {
        message.success('创建客户分配申请成功');
        this.queryList();
      } else {
        message.error('创建客户分配申请失败');
      }
    });
  }

  // 处理投顾进行筛选后，进行查询列表
  @autobind
  handleHeaderFilter(param) {
    const { location: { query, pathname } } = this.props;
    const newQuery = { ...query, pageNum: 1, ...param };
    this.context.replace({
      pathname,
      query: newQuery,
    });
    this.queryList(newQuery);
  }

  @autobind
  handleShowCreateBtn() {
    // 如果有 HTSC 开发-营业部执行岗 职责，则显示新建按钮
    return true || permission.hasKFYYBZXGPermission();
  }

  @autobind
  handlePageNumberChange(pageNum, pageSize) {
    const { location: { query, pathname } } = this.props;
    this.context.replace({
      pathname,
      query: { ...query, pageNum, pageSize },
    });
    this.queryList({ ...query, pageNum, pageSize });
  }

  @autobind
  handleListRowClick(record, index) {
    const { id, flowId } = record;
    const {
      location: { pathname, query, query: { currentId } },
    } = this.props;

    if (currentId === String(id)) return;

    this.context.replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ activeRowIndex: index });
    // TODO 此处后期需要根据定义的接口修改相应的参数
    this.props.getDetail({ flowId });
  }

  // 渲染左侧列表每一行
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    return (
      <ApplyItem
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="businessDepartmentCustDistribute"
        type="kehu1"
        pageData={config}
      />
    );
  }

  render() {
    const { replace } = this.context;
    const {
      location,
      list,
      empList,
      custListInExcel,
      custListByFilter,
      custListByQuery,
      empListByQuery,
      devEmpListByQuery,
      approvalList,
    } = this.props;
    const { createApplyModalShow } = this.state;
    const isEmpty = _.isEmpty(list.resultData);

    const topPanel = (
      <CommissionHeader
        location={location}
        replace={replace}
        page="businessDepartmentCustDistribute"
        pageType={config.pageType}
        needSubType={false}
        stateOptions={config.status}
        creatSeibelModal={this.handleCreateApplyBtnClick}
        filterCallback={this.handleHeaderFilter}
        isShowCreateBtn={this.handleShowCreateBtn}
      />
    );

    // 左侧列表组件机器分页器配置项
    // 生成页码器，此页码器配置项与Antd的一致
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: page.pageNum,
      total: page.totalCount,
      pageSize: page.pageSize,
      onChange: this.handlePageNumberChange,
    };
    const leftPanel = (
      <CommissionList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    // 后期根据不同的参数获取不同的组件,在此方法内修改
    const rightPanel = this.getDetailComponenet();

    // 将所有的新建页面需要用到的 api 接口封装成 callbacks 对象，
    // 以便后期扩展，防止页面组件传递过多的 props，
    const callbacks = {
      // 新建页面的获取服务经理列表 api
      getEmpList: this.props.getEmpList,
      // 新建页面的获取Excel表格中的客户列表
      getCustListInExcel: this.props.getCustListInExcel,
      // 新建页面筛选客户列表
      filterCustList: this.props.filterCustList,
      // 根据关键字查询客户 api
      queryDistributeCust: this.props.queryDistributeCust,
      // 根据关键字查询服务经理 api
      queryDistributeEmp: this.props.queryDistributeEmp,
      // 根据关键字查询开发经理 api
      queryDistributeDevEmp: this.props.queryDistributeDevEmp,
      // 查询审批人 api
      getApprovals: this.props.getApprovals,
    };

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftWidth={400}
        />
        {
          !createApplyModalShow ? null
          : (
            <CreateDistributeApplyBoard
              visible={createApplyModalShow}
              modalKey="CreateDistributeApplyBoard"
              onClose={this.handleApplyBoardClose}
              onSubmit={this.handleApplyBoardSubmit}
              callbacks={callbacks}
              empList={empList}
              custListInExcel={custListInExcel}
              custListByFilter={custListByFilter}
              custListByQuery={custListByQuery}
              empListByQuery={empListByQuery}
              devEmpListByQuery={devEmpListByQuery}
              approvalList={approvalList}
            />
          )
        }
      </div>
    );
  }
}

Home.propTypes = propsShape;
Home.defaultProps = defaultProps;
