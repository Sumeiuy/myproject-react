/**
 * @Author: zhangjun
 * @Date: 2018-07-09 09:58:54
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-09-19 10:44:17
 * @description 投顾空间申请首页
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import SplitPanel from '../../components/common/splitPanel/CutScreen';
import Header from '../../components/advisorSpace/Header';
import Detail from '../../components/advisorSpace/Detail';
import ApplyList from '../../components/common/appList';
import ApplyItem from '../../components/common/appList/ApplyItem';
import CreateApply from '../../components/advisorSpace/CreateApply';
import { dva } from '../../helper';
import withRouter from '../../decorators/withRouter';
import { getStatusTagProps } from '../../components/advisorSpace/config';
import seibelHelper from '../../helper/page/seibel';
import logable from '../../decorators/logable';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  empInfo: state.app.empInfo,
  // 申请单列表
  applictionList: state.advisorSpace.applictionList,
  // 右侧详情
  detailInfo: state.advisorSpace.detailInfo,
  // 智慧前厅列表
  roomData: state.advisorSpace.roomData,
  // 新建时智慧前厅列表
  createRoomData: state.advisorSpace.createRoomData,
  // 新建提交结果
  submitResult: state.advisorSpace.submitResult,
  // 参与人列表
  participantData: state.advisorSpace.participantData,
  // 取消预订结果
  cancelReservationResult: state.advisorSpace.cancelReservationResult,
});

const mapDispatchToProps = {
  // 获取左侧列表
  getApplictionList: effect('advisorSpace/getApplictionList', { forceFull: true }),
  // 获取右侧详情
  getDetail: effect('advisorSpace/getDetail', { forceFull: true }),
  // 获取智慧前厅列表
  getRoomList: effect('advisorSpace/getRoomList', { forceFull: true }),
  // 新建提交
  submitApply: effect('advisorSpace/submitApply', { forceFull: true }),
  // 获取参与人列表
  getParticipantList: effect('advisorSpace/getParticipantList', { forceFull: true }),
  // 取消预订
  cancelReservation: effect('advisorSpace/cancelReservation', { forceFull: true }),
  // 清除Redux中的数据
  clearReduxData: effect('advisorSpace/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class AdvisorSpace extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 列表
    applictionList: PropTypes.object.isRequired,
    getApplictionList: PropTypes.func.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetail: PropTypes.func.isRequired,
    // 智慧前厅列表
    roomData: PropTypes.object.isRequired,
    getRoomList: PropTypes.func.isRequired,
    // 新建时智慧前厅列表
    createRoomData: PropTypes.object.isRequired,
    // 新建提交
    submitResult: PropTypes.object.isRequired,
    submitApply: PropTypes.func.isRequired,
    // 参与人列表
    participantData: PropTypes.object.isRequired,
    getParticipantList: PropTypes.func.isRequired,
    // 取消预订
    cancelReservationResult: PropTypes.object.isRequired,
    cancelReservation: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 是否显示新建弹窗
      isShowCreateModal: false,
    }
  }

  componentDidMount() {
    this.getAppList();
    // 获取智慧前厅列表
    this.props.getRoomList();
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

  @autobind
  getAppList() {
    const { location: { query, query: { pageNum, pageSize } } } = this.props;
    this.queryAppList(query, pageNum, pageSize);
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getApplictionList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件,
    getApplictionList( params ).then(this.getRightDetail);
  }

  // 获取右侧详情
  @autobind
  getRightDetail() {
    const {
      applictionList,
      applictionList:{
        applicationBaseInfoList,
        page,
      },
      location: {
        pathname,
        query,
        query:{
          currentId
        }
      },
    } = this.props;
    const { replace } = this.context;
    if (!_.isEmpty(applicationBaseInfoList)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { pageNum, pageSize } = page;
      let item = applicationBaseInfoList[0];
      let itemIndex = _.findIndex(applicationBaseInfoList, o => String(o.id) === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.find(applicationBaseInfoList, o => String(o.id) === currentId);
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
      this.props.getDetail({
        id: item.id,
      })
    }
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { location } = this.props;
    const { replace } = this.context;
    const { query, pathname } = location;
    // 清空掉消息提醒页面带过来的 id
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        ...obj,
      },
    });
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { location } = this.props;
    const { replace } = this.context;
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

  // 切换每一页显示条数
  @autobind
  handlePageSizeChange(currentPageNum, changedPageSize) {
    const { location } = this.props;
    const { replace } = this.context;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({ type: 'ViewItem', payload: { name: '投顾空间申请' } })
  handleListRowClick(record, index) {
    const { id } = record;
    const { location: { pathname, query, query: { currentId } } } = this.props;
    const { replace } = this.context;
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
    this.getRightDetail();
  }

  @autobind
  renderApplyItemSecondLine(data) {
    return (data.appointTime && data.appointTime.slice(0, 10)) || '无';
  }

  @autobind
  renderApplyItemThirdLine(data) {
    return data.roomName || '--';
  }

  @autobind
  handleCancelReservation(query) {
    this.props.cancelReservation(query).then(this.handleCancelReservationSuccess);
  }

  @autobind
  handleCancelReservationSuccess() {
    const { cancelReservationResult } = this.props;
    if (cancelReservationResult) {
      this.getRightDetail();
    }
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    const { statusId } = record;
    const statusTags = [getStatusTagProps(statusId)];
    return (
      <ApplyItem
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="advisorSpace"
        iconType="kehu1"
        subTypeName="投顾空间申请"
        statusTags={statusTags}
        showSecondLineInfo={this.renderApplyItemSecondLine}
        showThirdLineInfo={this.renderApplyItemThirdLine}
      />
    );
  }

  // 打开新建弹窗
  @autobind
  openCreateModalBoard() {
    this.setState({isShowCreateModal: true})
  }

  // 关闭新建弹窗
  @autobind
  handleCloseCreateModal() {
    this.setState({isShowCreateModal: false})
    this.props.clearReduxData({
      createRoomData: {},
      participantData: {},
    });
  }

  render() {
    const {
      location,
      applictionList,
      applictionList: {
        applicationBaseInfoList = [],
        page = {},
      },
      detailInfo,
      roomData,
      getRoomList,
      createRoomData,
      participantData,
      getParticipantList,
      submitResult,
      submitApply,
    } = this.props;

    const { isShowCreateModal } = this.state;

    const { empInfo } = this.context;

    const isEmpty = _.isEmpty(applictionList);

    // 头部筛选
    const topPanel = (
      <Header
        location={location}
        roomData={roomData}
        getRoomList={getRoomList}
        empInfo={empInfo}
        filterCallback={this.handleHeaderFilter}
        creatModal={this.openCreateModalBoard}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };

    // 左侧列表,此处目前是占位，由别的前端开发
    const leftPanel = (
      <ApplyList
        list={applicationBaseInfoList}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    // 右侧详情，此处目前是占位，由别的前端开发
    const rightPanel = (
      <Detail
        detailInfo={detailInfo}
        cancelReservation={this.handleCancelReservation}
      />
    );


    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="advisorSpacelist"
          leftWidth={420}
        />
        {
          isShowCreateModal ?
            <CreateApply
              onClose={this.handleCloseCreateModal}
              createRoomData={createRoomData}
              getRoomList={getRoomList}
              participantData={participantData}
              getParticipantList={getParticipantList}
              submitResult={submitResult}
              submitApply={submitApply}
            />
            : null
        }
      </div>
    );
  }
}
