/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-02 13:58:24
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/channelsTypeProtocol/Detail';
import ChannelsTypeProtocolList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/channelsTypeProtocol/EditForm';
import BottonGroup from '../../components/permission/BottonGroup';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';

import styles from './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const {
  channelsTypeProtocol,
  channelsTypeProtocol: { pageType, subType, status },
} = seibelConfig;
// 新建/编辑弹窗按钮，暂时写死在前端
const FLOW_BUTTONS = {
  flowButtons: [
    {
      key: 'submit',
      btnName: '提交',
    },
  ],
};
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
  // 列表请求状态
  seibleListLoading: state.loading.effects['app/getSeibleList'],
  // 查询客户
  canApplyCustList: state.app.canApplyCustList,
  // 查询右侧详情
  protocolDetail: state.channelsTypeProtocol.protocolDetail,
  protocolDetailLoading: state.loading.effects['channelsTypeProtocol/getProtocolDetail'],
  // 附件
  attachmentList: state.channelsTypeProtocol.attachmentList,
  // 审批记录
  flowHistory: state.channelsTypeProtocol.flowHistory,
  // 登陆人信息
  empInfo: state.app.empInfo,
  // 操作类型列表
  operationList: state.channelsTypeProtocol.operationList,
  // 子类型列表
  subTypeList: state.channelsTypeProtocol.subTypeList,
  // 模板列表
  templateList: state.channelsTypeProtocol.templateList,
  // 模板对应协议条款列表
  protocolClauseList: state.channelsTypeProtocol.protocolClauseList,
  // 协议产品列表
  protocolProductList: state.channelsTypeProtocol.protocolProductList,
  underCustList: state.channelsTypeProtocol.queryCust,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 获取右侧详情
  getProtocolDetail: fetchDataFunction(true, 'channelsTypeProtocol/getProtocolDetail'),
  // 查询操作类型/子类型/模板列表
  queryTypeVaules: fetchDataFunction(false, 'channelsTypeProtocol/queryTypeVaules'),
  // 根据所选模板id查询模板对应协议条款
  queryChannelProtocolItem: fetchDataFunction(false, 'channelsTypeProtocol/queryChannelProtocolItem'),
  // 查询协议产品列表
  queryChannelProtocolProduct: fetchDataFunction(false, 'channelsTypeProtocol/queryChannelProtocolProduct'),
  // 保存详情
  saveProtocolData: fetchDataFunction(true, 'channelsTypeProtocol/saveProtocolData'),
  // 查询客户
  queryCust: fetchDataFunction(true, 'channelsTypeProtocol/queryCust'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class ChannelsTypeProtocol extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 查询左侧列表
    getSeibleList: PropTypes.func.isRequired,
    seibleList: PropTypes.object.isRequired,
    seibleListLoading: PropTypes.bool,
    // 查询可申请客户列表
    getCanApplyCustList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    // 查询右侧详情
    getProtocolDetail: PropTypes.func.isRequired,
    protocolDetail: PropTypes.object.isRequired,
    // 附件
    attachmentList: PropTypes.array,

    // 审批记录
    flowHistory: PropTypes.array,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
    // 查询操作类型/子类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    operationList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    templateList: PropTypes.array.isRequired,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    protocolClauseList: PropTypes.array.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    protocolProductList: PropTypes.array.isRequired,
    // 保存详情
    saveProtocolData: PropTypes.func.isRequired,
    // 下挂客户接口
    queryCust: PropTypes.func.isRequired,
    // 下挂客户列表
    underCustList: PropTypes.array,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    underCustList: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 新建编辑弹窗状态
      editFormModal: false,
      // 最终传递的数据
      payload: EMPTY_OBJECT,
    };
  }

  componentWillMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
      getSeibleList,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);

    // 默认筛选条件
    getSeibleList({
      ...params,
      type: pageType,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      seibleListLoading: prevSLL,
      location: { query: { currentId: prevCurrentId } },
    } = this.props;
    const {
      seibleList: nextSL,
      seibleListLoading: nextSLL,
      location: { query: { currentId } },
      getProtocolDetail,
    } = nextProps;

    const { location: { query: prevQuery = EMPTY_OBJECT }, getSeibleList } = this.props;
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        const params = constructSeibelPostBody(nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        );
        getSeibleList({
          ...params,
          type: pageType,
        });
      }
    }
    /* currentId变化重新请求 */
    // 获取到 seibleList,并且 seibleList 的 resultData 有数据
    if (((prevSLL && !nextSLL) && nextSL.resultData.length) ||
      (currentId && (currentId !== prevCurrentId))) {
      getProtocolDetail({
        id: currentId,
      });
      // this.setState({
      //   editFormModal: false,
      // });
    }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
          pageNum: 1,
        },
      });
    }
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  // 查询客户
  @autobind
  handleSearchCutList(param) {
    const { getCanApplyCustList } = this.props;
    getCanApplyCustList(param);
  }

  // 头部新建按钮点击事件处理程序
  @autobind
  handleCreateBtnClick() {
    console.warn('点击了新建按钮');
    this.showModal('editFormModal');
  }

  // 打开弹窗
  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  @autobind
  constructTableColumns() {
    return seibelColumns({
      pageName: 'channelsTypeProtocol',
      type: 'kehu1',
      pageData: channelsTypeProtocol,
    });
  }

  // 弹窗底部按钮事件
  @autobind
  footerBtnHandle(btnItem) {
    // 从editFormComponent组件中取出值
    const formData = this.EditFormComponent.getData();
    console.log('btnItem', btnItem);
    console.log('formData', formData);
  }

  // 最终发出接口请求
  @autobind
  sendRequest(sendPayload) {
    console.warn('sendPayload', sendPayload);
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      attachmentList,
      flowHistory,
      empInfo,
      getCanApplyCustList, // 查询可申请客户列表
      canApplyCustList, // 可申请客户列表
      queryTypeVaules, // 查询操作类型/子类型/模板列表
      operationList, // 操作类型列表
      subTypeList, // 子类型列表
      templateList, // 模板列表
      protocolDetail, // 协议详情
      queryChannelProtocolItem, // 根据所选模板id查询模板对应协议条款
      protocolClauseList, // 所选模板对应协议条款列表
      queryChannelProtocolProduct, // 查询协议产品列表
      protocolProductList, // 协议产品列表
      saveProtocolData,  // 保存详情
      underCustList,  // 下挂客户列表
      queryCust,  // 请求下挂客户接口
    } = this.props;
    const {
      editFormModal,
    } = this.state;
    const isEmpty = _.isEmpty(seibleList.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="channelsTypeProtocolPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        operateOptions={operationList}
        empInfo={empInfo}
        needOperate
      />
    );
    const leftPanel = (
      <ChannelsTypeProtocolList
        list={seibleList}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
      />
    );
    const rightPanel = (
      <Detail
        protocolDetail={protocolDetail}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
      />
    );
    const selfBtnGroup = (<BottonGroup
      list={FLOW_BUTTONS}
      onEmitEvent={this.footerBtnHandle}
    />);
    const editFormModalProps = {
      modalKey: 'editFormModal',
      title: '修改合约申请',
      closeModal: this.closeModal,
      visible: editFormModal,
      size: 'large',
      selfBtnGroup,
    };
    const editFormProps = {
      // 客户列表
      canApplyCustList,
      // 查询客户
      onSearchCutList: getCanApplyCustList,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
      // 操作类型列表
      operationList,
      // 子类型列表
      subTypeList,
      // 协议模板列表
      templateList,
      // 根据所选模板id查询模板对应协议条款
      queryChannelProtocolItem,
      // 所选模板对应协议条款列表
      protocolClauseList,
      // 协议详情 - 编辑时传入
      protocolDetail,
      // 查询协议产品列表
      queryChannelProtocolProduct,
      // 协议产品列表
      protocolProductList,
      // 保存详情
      saveProtocolData,
      // 下挂客户
      underCustList,
      // 下挂客户接口
      onQueryCust: queryCust,
    };
    return (
      <div className={styles.premissionbox} >
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="contractList"
        />
        {
          editFormModal ?
            <CommonModal {...editFormModalProps} >
              <EditForm
                {...editFormProps}
                ref={(ref) => { this.EditFormComponent = ref; }}
              />
            </CommonModal>
            :
            null
        }
      </div>
    );
  }
}
