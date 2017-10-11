/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2017-10-11 15:30:19
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { message } from 'antd';
import _ from 'lodash';
import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import ContractHeader from '../../components/common/biz/SeibelHeader';
import Detail from '../../components/contract/Detail';
import ContractList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/contract/EditForm';
import AddForm from '../../components/contract/AddForm';
import { seibelConfig } from '../../config';

import styles from './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 退订的类型
const unsubscribe = '2';
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const { contract, contract: { pageType, subType, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
  // 列表请求状态
  seibleListLoading: state.loading.effects['app/getSeibleList'], // 获取列表数据进程
  // 查询拟稿人
  drafterList: state.app.drafterList,
  // 查询部门
  custRange: state.app.custRange,
  // 查询客户
  customerList: state.app.customerList,
  // 查询右侧详情
  baseInfo: state.contract.baseInfo,
  // 附件列表
  attachmentList: state.contract.attachmentList,
  // 新建/修改 客户列表
  canApplyCustList: state.app.canApplyCustList,
  // 退订所选合约详情
  contractDetail: state.contract.contractDetail,
  // 合作合约编号列表
  contractNumList: state.contract.contractNumList,
  // 审批记录
  flowHistory: state.contract.flowHistory,
  // 新增合约条款-条款名称
  clauseNameList: state.contract.clauseNameList,
  // 新增合约条款-合作部门
  cooperDeparment: state.contract.cooperDeparment,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取拟稿人
  getDrafterList: fetchDataFunction(false, 'app/getDrafterList'),
  // 获取部门
  getCustRange: fetchDataFunction(false, 'app/getCustRange'),
  // 获取客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
  // 获取右侧详情
  getBaseInfo: fetchDataFunction(true, 'contract/getBaseInfo'),
  // 获取附件列表
  getAttachmentList: fetchDataFunction(true, 'contract/getAttachmentList'),
  // 获取可申请客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 查询合作合约详情
  getContractDetail: fetchDataFunction(false, 'contract/getContractDetail'),
  // 保存合作合约
  saveContractData: fetchDataFunction(true, 'contract/saveContractData'),
  // 查询合作合约编号
  getContractNumList: fetchDataFunction(false, 'contract/getContractNumList'),
  // 查询条款名称列表
  getClauseNameList: fetchDataFunction(false, 'contract/getClauseNameList'),
  // 查询合作部门
  getCooperDeparmentList: fetchDataFunction(false, 'contract/getCooperDeparmentList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Contract extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 查询左侧列表
    getSeibleList: PropTypes.func.isRequired,
    seibleList: PropTypes.object.isRequired,
    seibleListLoading: PropTypes.bool,
    // 查询拟稿人
    getDrafterList: PropTypes.func.isRequired,
    drafterList: PropTypes.array.isRequired,
    // 查询部门
    getCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 查询可申请客户列表
    getCanApplyCustList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    // 查询右侧详情
    getBaseInfo: PropTypes.func.isRequired,
    baseInfo: PropTypes.object.isRequired,
    // 附件列表
    getAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
    // 查询合作合约详情
    getContractDetail: PropTypes.func.isRequired,
    contractDetail: PropTypes.object,
    // 保存合作合约
    saveContractData: PropTypes.func.isRequired,
    // 查询合作合约编号
    getContractNumList: PropTypes.func.isRequired,
    contractNumList: PropTypes.array.isRequired,
    // 审批记录
    flowHistory: PropTypes.array,
    // 查询条款名称列表
    getClauseNameList: PropTypes.func.isRequired,
    clauseNameList: PropTypes.array.isRequired,
    // 查询合作部门
    getCooperDeparmentList: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    contractDetail: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 操作类型
      business2: '',
      createTime: '',
      isEmpty: true,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      createApprovalBoard: false,
      // 合作合约表单数据
      contractFormData: EMPTY_OBJECT,
      // 新建合作合约弹窗状态
      addFormModal: false,
      // 修改合作合约弹窗状态
      editFormModal: true,
      // 修改合作合约对象的操作类型和id
      editContractInfo: {
        operationType: '',
        id: '',
      },
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
      getCustRange,
      getCooperDeparmentList,
      getClauseNameList,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);

    getCustRange(EMPTY_OBJECT);
    // 默认筛选条件
    getSeibleList({
      ...params,
      type: pageType,
    });

    getCooperDeparmentList({ name: '南京' });
    getClauseNameList({});
  }

  componentWillReceiveProps(nextProps) {
    const { seibleListLoading: prevSLL } = this.props;
    const {
      seibleListLoading: nextSLL,
      seibleList,
      getBaseInfo,
      location: { query: { currentId } },
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

    // 判断是否取到 seibleList
    if (prevSLL && !nextSLL) {
      if (!_.isEmpty(seibleList.resultData)) {
        const item = _.filter(seibleList.resultData, o => String(o.id) === String(currentId));
        // 表示左侧列表获取完毕
        // 因此此时获取Detail
        console.warn('获取详情', item);
        getBaseInfo({
          flowId: '47D97E3A0E52E84ABE1CFBB388F869C3',
          id: '',
        });
        this.setState({
          business2: item[0].business2,
          createTime: item[0].createTime,
        });
      }
    }
  }

  @autobind
  onOk(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  // 上传成功后回调
  onUploadComplete(attachment) {
    console.warn('attachment', attachment);
  }
  /**
   * 点击列表每条的时候对应请求详情
   */
  @autobind
  getListRowId(obj) {
    const { getBaseInfo } = this.props;
    getBaseInfo({
      // flowId: obj.flowId,
      flowId: '47D97E3A0E52E84ABE1CFBB388F869C3',
      id: '',
    });
    this.setState({
      business2: obj.business2,
      createTime: obj.createTime,
    });
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

  // 根据子类型和客户查询合约编号
  @autobind
  handleSearchContractNum(data) {
    this.props.getContractNumList({ subType: data.childType, custId: data.client.cusId });
  }

  // 查询客户
  @autobind
  handleSearchCutList(value) {
    const { getCanApplyCustList } = this.props;
    getCanApplyCustList({
      keyword: value,
    });
  }

  // 查询合约详情
  @autobind
  handleSearchContractDetail(data) {
    this.props.getBaseInfo({
      id: data.value,
      flowId: data.flowId,
    });
  }

  // 显示修改合作合约弹框
  @autobind
  handleShowEditForm(data = {}) {
    this.setState({
      ...this.state,
      editContractInfo: data,
    }, () => {
      console.log('显示修改');
      this.showModal('editFormModal');
    });
  }

  // 接收AddForm数据
  @autobind
  handleChangeContractForm(formData) {
    console.log('接收AddForm数据', formData);
    this.setState({
      ...this.state,
      contractFormData: formData,
    });
  }

  // 根据关键词查询合作部门
  @autobind
  handleSearchCooperDeparment(keyword) {
    if (keyword) {
      this.props.getCooperDeparmentList({ name: keyword });
    }
  }

  // 保存合作合约 新建/修改 数据
  @autobind
  saveContractData() {
    const { contractFormData } = this.state;
    console.log('保存数据', contractFormData);
    if (!contractFormData.childType) {
      message.error('请选择子类型');
      return;
    }
    if (!contractFormData.client.cusId) {
      message.error('请选择客户');
      return;
    }
    // 判断是新建还是修改
    if (contractFormData.formType === 'add') {
      const operationType = contractFormData.operation;
      // 判断是退订还是订购
      if (operationType === unsubscribe) {
        if (!contractFormData.contractNum) {
          message.error('请选择合约编号');
        }
        // const condition = {
          // 接口和传值待定
        // };
      } else {
        if (!contractFormData.contractStarDate) {
          message.error('请选择合约开始日期');
          return;
        }
        const condition = {
          subType: contractFormData.childType,
          custId: contractFormData.client.cusId,
          startDt: contractFormData.contractStarDate,
          vailDt: contractFormData.contractPalidity || '',
          contractName: '1123123123', // 待删
          createdBy: '002332', // 待删
          createdName: 'zhangsan', // 待删
          id: '',
          action: 'new',
          // endDt: '',
          context: '',
          description: contractFormData.remark || '',
        };
        console.log('savesave');
        this.props.saveContractData(condition);
      }
    } else if (contractFormData.formType === 'edit') {
      if (!contractFormData.contractStarDate) {
        message.error('请选择合约开始日期');
        return;
      }
      console.log('修改', contractFormData);
    }
  }

  // 查询拟稿人
  @autobind
  toSearchDrafter(value) {
    const { getDrafterList } = this.props;
    getDrafterList({
      keyword: value,
      type: pageType,
    });
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
    this.showModal('addFormModal');
  }

  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  @autobind
  closeModal(modalKey) {
    console.warn('点击了关闭弹窗', modalKey);
    this.setState({
      [modalKey]: false,
    }, console.warn('修改后的 state', this.state));
  }

  @autobind
  constructTableColumns() {
    return seibelColumns({
      pageName: 'contract',
      type: 'kehu1',
      pageData: contract,
    });
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      drafterList,
      custRange,
      customerList,
      baseInfo,
      attachmentList,
      flowHistory,
      canApplyCustList,
      contractNumList,
    } = this.props;
    const {
      addFormModal,
      editFormModal,
      business2,
      createTime,
    } = this.state;
    if (!custRange || !custRange.length) {
      return null;
    }
    const isEmpty = _.isEmpty(seibleList.resultData);
    const topPanel = (
      <ContractHeader
        location={location}
        replace={replace}
        page="contractPage"
        subtypeOptions={subType}
        stateOptions={status}
        toSearchDrafter={this.toSearchDrafter}
        toSearchCust={this.toSearchCust}
        drafterList={drafterList}
        customerList={customerList}
        custRange={custRange}
        creatSeibelModal={this.handleCreateBtnClick}
      />
    );

    const leftPanel = (
      <ContractList
        list={seibleList}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
        clickRow={this.getListRowId}
        backKeys={['flowId', 'business2', 'createTime']}
      />
    );
    const rightPanel = (
      <Detail
        baseInfo={baseInfo}
        operationType={business2}
        createTime={createTime}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
        showEditModal={this.handleShowEditForm}
        uploadAttachment={this.onUploadComplete}
      />
    );
    // 新建表单props
    const addFormProps = {
      // 合约编号
      onSearchContractNum: this.handleSearchContractNum,
      contractNumList,
      // 可申请客户列表
      onSearchCutList: this.handleSearchCutList,
      custList: canApplyCustList,
      // 基本信息
      onSearchContractDetail: this.handleSearchContractDetail,
      contractDetail: this.props.baseInfo,
      // 表单变化
      onChangeForm: this.handleChangeContractForm,
      // 条款名称列表
      clauseNameList: this.props.clauseNameList,
      // 合作部门列表
      cooperDeparment: this.props.cooperDeparment,
      // 根据管检测查询合作部门
      searchCooperDeparment: this.handleSearchCooperDeparment,
    };
    // 修改表单props
    const contractDetail = {
      baseInfo: {
        ...baseInfo,
        business2,
        createTime,
      },
      attachmentList,
      flowHistory,
    };
    const editFormProps = {
      custList: canApplyCustList,
      contractDetail,
      onSearchCutList: this.toSearchCust,
      onChangeForm: this.handleChangeContractForm,
      operationType: this.state.editContractInfo.operationType || '',
      // 条款名称列表
      clauseNameList: this.props.clauseNameList,
      // 合作部门列表
      cooperDeparment: this.props.cooperDeparment,
      // 根据管检测查询合作部门
      searchCooperDeparment: this.handleSearchCooperDeparment,
    };
    const addFormModalProps = {
      modalKey: 'addFormModal',
      title: '新建合约申请',
      onOk: this.saveContractData,
      closeModal: this.closeModal,
      visible: addFormModal,
      size: 'large',
      children: <AddForm {...addFormProps} />,
    };
    const editFormModalProps = {
      modalKey: 'editFormModal',
      title: '修改合约申请',
      onOk: this.saveContractData,
      closeModal: this.closeModal,
      visible: editFormModal,
      size: 'large',
    };
    return (
      <div className={styles.premissionbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="contractList"
        />
        <CommonModal {...addFormModalProps} />
        {
          editFormModal ?
            <CommonModal {...editFormModalProps}>
              <EditForm {...editFormProps} />
            </CommonModal>
          :
            null
        }
      </div>
    );
  }
}
