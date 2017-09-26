/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-26 10:09:07
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { constructSeibelPostBody, getEmpId } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import ContractHeader from '../../components/common/biz/SeibelHeader';
import Detail from '../../components/contract/Detail';
import ContractList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import { seibelConfig } from '../../config';

import styles from './home.less';

const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
// const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const { contract, contract: { pageType, subType, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
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
  // 删除附件
  deleteAttachment: fetchDataFunction(true, 'contract/deleteAttachment'),
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
    // 查询拟稿人
    getDrafterList: PropTypes.func.isRequired,
    drafterList: PropTypes.array.isRequired,
    // 查询部门
    getCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 查询右侧详情
    getBaseInfo: PropTypes.func.isRequired,
    baseInfo: PropTypes.object.isRequired,
    // 附件列表
    getAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
    // 删除附件
    deleteAttachment: PropTypes.func,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    deleteAttachment: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      createApprovalBoard: false,
    };
  }

  componentWillMount() {
    const {
      location: {
        query,
        query: {
          currentId,
          pageNum,
          pageSize,
        },
      },
      getSeibleList,
      getCustRange,
      getBaseInfo,
      getAttachmentList,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);

    getCustRange({});
    // 默认筛选条件
    getSeibleList({
      ...params,
      type: pageType,
    });
    getBaseInfo({
      id: currentId,
    });
    getAttachmentList({
      empId: getEmpId(),
      attachment: '121212121212',
    });
  }
  // 上传成功后回调
  onUploadComplete(attachment) {
    console.warn('attachment', attachment);
  }
  // 删除附件
  @autobind
  onRemoveFile(attachId) {
    const { deleteAttachment } = this.props;
    console.warn('删除事件。。。。。。。。。。。');
    const deleteObj = {
      empId: getEmpId(),
      attachId,
      attachment: '121212121212',
    };
    deleteAttachment(deleteObj);
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
    this.openCreateApprovalBoard();
  }
  // 打开新建申请的弹出框
  @autobind
  openCreateApprovalBoard() {
    this.setState({
      createApprovalBoard: true,
    });
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
    } = this.props;
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
      />
    );

    const rightPanel = (
      <Detail
        baseInfo={baseInfo}
        attachmentList={attachmentList}
        deleteAttachment={this.onRemoveFile}
        uploadAttachment={this.onUploadComplete}
      />
    );
    return (
      <div className={styles.premissionbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="contractList"
        />
      </div>
    );
  }
}

