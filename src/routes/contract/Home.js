/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2017-09-27 10:19:19
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { message } from 'antd';
// import _ from 'lodash';
// import { constructSeibelPostBody } from '../../utils/helper';
// import { seibelConfig } from '../../config';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/contract/EditForm';
import AddForm from '../../components/contract/AddForm';

import styles from './home.less';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 退订的类型
const unsubscribe = '2';
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({

  // 新建/修改 客户列表
  custList: state.contract.custList,
  // 退订所选合约详情
  contractDetail: state.contract.contractDetail,
  // 合作合约编号列表
  contractNumList: state.contract.contractNumList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,

  // 获取客户列表
  getCutList: fetchDataFunction(false, 'contract/getCutList'),
  // 查询合作合约详情
  getContractDetail: fetchDataFunction(false, 'contract/getContractDetail'),
  // 保存合作合约
  saveContractData: fetchDataFunction(true, 'contract/saveContractData'),
  // 查询合作合约编号
  getContractNumList: fetchDataFunction(false, 'contract/getContractNumList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {

    getCutList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    getContractDetail: PropTypes.func.isRequired,
    saveContractData: PropTypes.func.isRequired,
    contractNumList: PropTypes.array.isRequired,
    getContractNumList: PropTypes.func.isRequired,
    contractDetail: PropTypes.object.isRequired,

  }

  static defaultProps = {

  }

  // static childContextTypes = {
    // getCutList: PropTypes.func.isRequired,
    // getServerPersonelList: PropTypes.func.isRequired,
  // }

  constructor(props) {
    super(props);
    this.state = {
      // isEmpty: true,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      // isShowModal: false,

      // 合作合约表单数据
      contractFormData: EMPTY_OBJECT,
      addFormModal: true,
      editFormModal: false,
      editContractInfo: EMPTY_OBJECT,
    };
  }

  componentWillMount() {
    console.log('adawdawd', this.props);
  }

  // getChildContext() {
    // return {
      // getCustomerList: (data) => {
      //   this.props.getCustomerList({ code: data });
      // },
      // 获取 服务人员列表
      // getServerPersonelList: (data) => {
      //   this.props.getServerPersonelList({ code: data });
      // },
    // };
  // }

  @autobind
  onOk(modalKey) {
    this.setState({
      [modalKey]: false,
    });
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
  clearModal() {
    // 清除模态框组件
    console.log('模态框已经清楚');
    this.setState({ isShowModal: false });
  }

  // 根据子类型和客户查询合约编号
  @autobind
  handleSearchContractNum(data) {
    this.props.getContractNumList({ subType: data.childType, custId: data.client.cusId });
  }

  // 查询客户
  @autobind
  handleSearchCutList(value) {
    const { getCutList } = this.props;
    getCutList({
      keyword: value,
    });
  }

  // 查询合约详情
  @autobind
  handleSearchContractDetail(data) {
    this.props.getContractDetail({ id: data.value });
  }

  // 显示修改合作合约弹框
  @autobind
  handleShowEditForm(data) {
    this.setState({
      ...this.state,
      editContractInfo: data,
    }, () => {
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
      console.log('修改');
    }
  }

  render() {
    const addFormProps = {
      custList: this.props.custList,
      contractDetail: this.props.contractDetail,
      onSearchCutList: this.handleSearchCutList,
      contractNumList: this.props.contractNumList,
      onChangeForm: this.handleChangeContractForm,
      onSearchContractNum: this.handleSearchContractNum,
      onSearchContractDetail: this.handleSearchContractDetail,
    };
    const editFormProps = {
      custList: this.props.custList,
      contractDetail: this.props.contractDetail,
      onSearchCutList: this.handleSearchCutList,
      onChangeForm: this.handleChangeContractForm,
      operationType: this.state.editContractInfo.operationType || '',
    };
    const addFormModalProps = {
      modalKey: 'addFormModal',
      title: '新建合约申请',
      onOk: this.saveContractData,
      closeModal: this.closeModal,
      visible: this.state.addFormModal,
      size: 'large',
      children: <AddForm {...addFormProps} />,
    };
    const editFormModalProps = {
      modalKey: 'editFormModal',
      title: '修改合约申请',
      onOk: this.saveContractData,
      closeModal: this.closeModal,
      visible: this.state.editFormModal,
      size: 'large',
      children: <EditForm {...editFormProps} />,
    };

    return (
      <div className={styles.premissionbox}>
        <CommonModal {...addFormModalProps} />
        <CommonModal {...editFormModalProps} />
      </div>
    );
  }
}

