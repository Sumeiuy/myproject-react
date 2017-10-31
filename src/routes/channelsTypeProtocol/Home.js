/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-31 18:12:45
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
  channelsTypeProtocol: { pageType, subType, operationList, status },
} = seibelConfig;
// 新建/编辑弹窗按钮，暂时写死在前端
const FLOW_BUTTONS = {
  flowButtons: [
    {
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
  // 查询右侧详情
  protocolDetail: state.channelsTypeProtocol.protocolDetail,
  protocolDetailLoading: state.loading.effects['channelsTypeProtocol/getProtocolDetail'],
  // 审批记录
  flowHistory: state.contract.flowHistory,
  // 登陆人信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
  // 获取右侧详情
  getProtocolDetail: fetchDataFunction(true, 'channelsTypeProtocol/getProtocolDetail'),
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
    // 查询右侧详情
    protocolDetail: PropTypes.object.isRequired,
    getProtocolDetail: PropTypes.func.isRequired,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 审批记录
    flowHistory: PropTypes.array,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 新建合作合约弹窗状态
      addFormModal: false,
      // 是否有修改的权限
      hasEditPermission: false,
      // 弹窗底部按钮数据
      footerBtnData: EMPTY_OBJECT,
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
      this.setState({
        addFormModal: false,
        editFormModal: false,
      });
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
  toSearchCust(value) {
    const { getCustomerList } = this.props;
    getCustomerList({
      keyword: value,
      type: pageType,
    });
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
    console.warn('item', btnItem);
    // TODO-设定好相应的值传过去，注意 operation
    const formData = this.EditFormComponent.getData();
    console.log('formData', formData);
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      customerList,
      protocolDetail,
      flowHistory,
      empInfo,
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
      custList: customerList,
      // 查询客户
      onSearchCutList: this.toSearchCust,
      // 查询协议模板
      onSearchProtocolTemplate: () => {},
      // 协议模板列表
      protocolTemplateList: [],
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
