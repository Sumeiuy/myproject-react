/**
 * @Author: zhangjun
 * @Date: 2018-07-09 09:58:54
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-18 11:05:47
 * @description 投顾空间申请首页
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import SplitPanel from '../../components/common/splitPanel/CutScreen';
import Header from '../../components/advisorSpace/Header';
import CreateApply from '../../components/advisorSpace/CreateApply';
import ConfirmForm from '../../components/advisorSpace/ConfirmForm';
import { dva } from '../../helper';
import withRouter from '../../decorators/withRouter';
import seibelHelper from '../../helper/page/seibel';

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
      // 是否显示新建弹窗
      isShowCreateModal: false,
    }
  }

  componentDidMount() {
    this.getAppList();
    // 获取智慧前厅列表
    this.props.getRoomList();
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
    getApplictionList({ ...params });
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

    const isEmpty = _.isEmpty(applictionList.resultData);
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

    // 左侧列表,此处目前是占位，由别的前端开发
    const leftPanel = (
      <div>leftPanel</div>
    );

    // 右侧详情，此处目前是占位，由别的前端开发
    const rightPanel = (
      <div>rightPanel</div>
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
