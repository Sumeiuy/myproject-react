/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-22 14:52:49
 */
import React, { PureComponent, PropTypes } from 'react';
import { Col } from 'antd';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
// import PageHeader from '../../components/contract/PageHeader';
import Detail from '../../components/contract/Detail';
import ContractList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
// import AddForm from '../../components/contract/AddForm';
import EditForm from '../../components/contract/EditForm';
import CommonModal from '../../components/common/biz/CommonModal';
// import Edit from '../../components/contract/Edit';
import ContractHeader from '../../components/common/biz/SeibelHeader';
import { permissionOptions } from '../../config';

import styles from './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
// 子类型
const subtypeOptions = permissionOptions.subtypeOptions;
// 状态
const stateOptions = permissionOptions.stateOptions;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 右侧详情
  detailMessage: state.contract.detailMessage,
  // 左侧列表数据
  list: state.contract.list,
  // 拟稿人
  drafterList: state.contract.drafterList,
  // 部门
  empOrgTreeList: state.contract.empOrgTreeList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情
  getDetailMessage: fetchDataFunction(true, 'contract/getDetailMessage'),
  // 获取左侧列表
  getContractList: fetchDataFunction(true, 'contract/getContractList'),
  // 获取拟稿人
  getDrafterList: fetchDataFunction(true, 'contract/getDrafterList'),
  // 获取部门
  getEmpOrgTree: fetchDataFunction(true, 'contract/getEmpOrgTree'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Contract extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    drafterList: PropTypes.array.isRequired,
    empOrgTreeList: PropTypes.object.isRequired,
    getContractList: PropTypes.func.isRequired,
    getDrafterList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    detailMessage: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      commonModal: true,
    };
  }

  componentWillMount() {
    const { getContractList, location: { query, query: {
      pageNum,
      pageSize,
     } } } = this.props;
    // 默认筛选条件
    getContractList(constructSeibelPostBody(query, pageNum || 1, pageSize || 10));
    document.addEventListener('click', () => {
      this.showModal('commonModal');
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getContractList } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;

    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        getContractList(constructSeibelPostBody(
          nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        ));
      }
    }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace,
      list: { resultData = EMPTY_LIST } } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
        },
      });
    }

    if (_.isEmpty(resultData)) {
      this.setState({ // eslint-disable-line
        isEmpty: true,
      });
    } else {
      this.setState({ // eslint-disable-line
        isEmpty: false,
      });
    }
  }

  get getDetailComponent() {
    if (_.isEmpty(this.props.detailMessage)) {
      return null;
    }
    return <Detail {...this.props.detailMessage} />;
  }

  /**
   * 点击列表每条的时候对应请求详情
   */
  @autobind
  getListRowId(id) {
    const { getDetailMessage } = this.props;
    getDetailMessage({
      id,
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

  /**
   * 构造表格的列数据
   * 传参为icon的type
   */
  @autobind
  constructTableColumns() {
    return seibelColumns('save_blue');
  }

  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  @autobind
  toSearchDrafter(value) {
    // 查询拟稿人
    this.props.getDrafterList({
      empId: value,
    });
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {
    console.log('新建');
  }

  render() {
    const { list, location, replace, drafterList, empOrgTreeList } = this.props;
    const { isEmpty } = this.state;
    const topPanel = (
      // <PageHeader
      //   location={location}
      //   replace={replace}
      // />
      <ContractHeader
        location={location}
        replace={replace}
        page="premissionPage"
        subtypeOptions={subtypeOptions}
        stateOptions={stateOptions}
        creatSeibelModal={this.creatPermossionModal}
        toSearchDrafter={this.toSearchDrafter}
        drafterList={drafterList}
        empOrgTreeList={empOrgTreeList}
      />
    );

    const leftPanel = (
      <ContractList
        list={list}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
        getListRowId={this.getListRowId}
      />
    );

    const rightPanel = (
      <Col span="24" className={styles.rightSection}>
        {this.getDetailComponent}
      </Col>
    );
    const newModalProps = {
      modalKey: 'commonModal',
      title: '合作合约修改',
      onOk: this.onOk,
      closeModal: this.closeModal,
      visible: this.state.commonModal,
      size: 'large',
      children: <EditForm />,
      // children: <AddForm />,
    };
    return (
      <div className={styles.premissionbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="premissionList"
        />
        <CommonModal
          {...newModalProps}
        />
      </div>
    );
  }
}
