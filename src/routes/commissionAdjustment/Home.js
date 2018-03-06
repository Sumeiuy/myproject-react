/**
 * @Author: ouchangzhi
 * @Date: 2018-02-22 15:08:11
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-03-06 12:11:20
 * @description 单佣金调整
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Input, message, Button } from 'antd';
import _ from 'lodash';

import confirm from '../../components/common/Confirm';
import InfoTitle from '../../components/common/InfoTitle';
import CommissionLine from '../../components/commissionAdjustment/CommissionLine';
import { permission, url } from '../../helper';
import { closeRctTab } from '../../utils';
import { allCommissionParamName as otherComs } from '../../config/otherCommissionDictionary';
import SingleCreatBoard from '../../components/commissionAdjustment/SingleCreatBoard';
import DisabledSelect from '../../components/commissionChange/DisabledSelect';
import styles from './home.less';

const { TextArea } = Input;

const effects = {
  singleComOptions: 'commission/getSingleOtherCommissionOptions',
  threeMatchInfo: 'commission/queryThreeMatchInfo',
  singleCustList: 'commission/getSingleCustList',
  submitSingle: 'commission/submitSingleCommission',
  clearReduxState: 'commission/clearReduxState',
  singleCustValidate: 'commission/validateCustomerInSingle',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 登录人的信息
  empInfo: state.app.empInfo.empInfo,
  // 登录人的职位列表
  empPostnList: state.app.empInfo.empPostnList,
  // 单佣金调整的其他佣金费率码值
  singleOtherRatio: state.commission.singleOtherCommissionOptions,
  // 客户与产品的三匹配信息
  threeMatchInfo: state.commission.threeMatchInfo,
  // 单佣金调整页面客户查询列表
  singleCustomerList: state.commission.singleCustomerList,
  // 单佣金调整申请结果
  singleSubmit: state.commission.singleSubmit,
  // 单佣金调整客户检验返回数据
  singleCVR: state.commission.singleCustValidate,
});

const getDataFunction = (loading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading,
  forceFull,
});

const mapDispatchToProps = {
  // 获取单佣金调整中的其他佣金费率选项
  getSingleOtherRates: getDataFunction(false, effects.singleComOptions),
  // 查询产品与客户的三匹配信息
  queryThreeMatchInfo: getDataFunction(false, effects.threeMatchInfo),
  // 查询单佣金调整页面客户列表
  getSingleCustList: getDataFunction(false, effects.singleCustList),
  // 提交单佣金调整申请
  submitSingle: getDataFunction(false, effects.submitSingle),
  // 清空redux保存的state
  clearReduxState: getDataFunction(false, effects.clearReduxState),
  // 单佣金调整客户校验
  singleCustValidate: getDataFunction(false, effects.singleCustValidate),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class CommissionAdjustmentHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    empPostnList: PropTypes.array.isRequired,
    getSingleOtherRates: PropTypes.func.isRequired,
    singleOtherRatio: PropTypes.array.isRequired,
    singleCustomerList: PropTypes.array.isRequired,
    singleSubmit: PropTypes.string.isRequired,
    clearReduxState: PropTypes.func.isRequired,
    singleCustValidate: PropTypes.func.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    getSingleCustList: PropTypes.func.isRequired,
    submitSingle: PropTypes.func.isRequired,
    singleCVR: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      remark: '', // 备注
      newCommission: '0.16', // 新佣金，业务要求的默认值
      approverId: '', // 审批人id
      customer: {}, // 单佣金选择的客户
      attachment: '', // 附件
      singleProductMatchInfo: [], // 单佣金调整选择的产品的三匹配信息
    };
  }

  componentDidMount() {
    const { search } = this.props.location;
    this.custid = url.parse(search).custid;
    this.postionid = url.parse(search).postionid;
    this.handleChangeSingleAssembly(this.custid);
  }

  @autobind
  clearRedux() {
    // 清空redux的state
    this.props.clearReduxState({
      clearList: [
        { name: 'singleOtherCommissionOptions' },
        { name: 'singleCustomerList' },
        { name: 'singleComProductList' },
        { name: 'threeMatchInfo', value: {} },
        { name: 'singleGJCommission' },
      ],
    });
  }

  // 根据职责权限进行子类型选项
  @autobind
  authorityOptions(subTypes) {
    return subTypes.map((item) => {
      const { empPostnList } = this.props;
      const newItem = {
        show: permission.hasCommissionSingleAuthority(empPostnList),
      };
      return {
        ...item,
        ...newItem,
      };
    });
  }

  // 根据用户输入查询单佣金客户列表,默认选取列表中的第一项
  @autobind
  handleChangeSingleAssembly(keywords) {
    if (_.isEmpty(keywords)) {
      confirm({
        content: '请输入经纪客户号/客户名称',
      });
    } else {
      const { occDivnNum } = this.props.empInfo;
      this.props.getSingleCustList({
        keywords,
        postionId: this.postionid,
        deptCode: occDivnNum,
      }).then(() => {
        const { singleCustomerList } = this.props;
        if (!_.isEmpty(singleCustomerList)) {
          const custmoer = singleCustomerList[0];
          this.handleSelectAssembly(custmoer);
        }
      });
    }
  }

  // 修改单佣金父产品参数
  @autobind
  updateParamsProduct(product, matchInfos) {
    const { prodCode, prodName, prodRate } = product;
    const matchInfo = _.filter(matchInfos, item => item.productCode === prodCode)[0] || {};
    return {
      prodCode,
      aliasName: prodName,
      prodCommission: prodRate,
      ...matchInfo,
    };
  }

  // 修改单佣金子产品参数
  @autobind
  updateParamChildProduct(product) {
    const { prodCode, prodName } = product;
    return {
      prodCode,
      aliasName: prodName,
    };
  }

  // 将选择的产品进行筛选，并合并入3匹配信息
  @autobind
  pickSingleProductList(list, matchInfos) {
    return list.map((item) => {
      const { children } = item;
      const product = this.updateParamsProduct(item, matchInfos);
      if (!_.isEmpty(children)) {
        product.subProductVO = children.map(this.updateParamChildProduct);
      }
      return product;
    });
  }

  // 提交前检查各项输入的值是否符合要求
  @autobind
  submitCheck() {
    let result = true;
    const { dValue, approverId } = this.singleBoard.getData();
    if (dValue !== 0) {
      result = false;
      confirm({
        content: '请确保所选产品佣金率与目标股基佣金率一致',
      });
    }
    if (_.isEmpty(approverId)) {
      message.error('审批人员不能为空');
      result = false;
    }
    return result;
  }

  // 隐藏/显示提交Loading
  @autobind
  submitLoadiing(modalLoading) {
    this.setState({
      modalLoading,
    });
  }

  // 单佣金调整提交
  @autobind
  singleSubmit() {
    if (!this.submitCheck()) return;
    // 单佣金调整需要的key
    this.submitLoadiing(true);
    const {
      userProductList,
      singleProductMatchInfo,
      newCommission,
      approverId,
      attachment,
    } = this.singleBoard.getData();
    const {
      remark,
      customer,
    } = this.state;
    const otherCommissions = _.pick(this.singleBoard.getData(), otherComs);
    const productList = this.pickSingleProductList(userProductList, singleProductMatchInfo);
    const params = {
      custRowId: customer.id,
      custType: customer.custType,
      newComm: newCommission,
      comments: remark,
      attachmentNum: attachment,
      aprovaluser: approverId,
      productInfo: productList,
      ...otherCommissions,
    };
    this.props.submitSingle(params).then(() => {
      message.success('单佣金调整提交成功');
      this.submitLoadiing(false);
      closeRctTab({
        id: 'utb-serviceOrdering-wizard',
      });
    }, () => {
      this.submitLoadiing(false);
    });
  }

  // 提交
  @autobind
  handleSubmitApprovals() {
    this.singleSubmit();
  }

  // 选择申请子类型
  @autobind
  choiceApprovalSubType(name, key) {
    if (key === '') return;
    this.setState({
      approvalType: key,
      remark: '',
      customer: {},
    });
    this.clearRedux();
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 清除单佣金调整的数据
  @autobind
  clearSingleSelect() {
    this.singleBoard.resetData();
    this.setState({
      remark: '',
    });
  }

  // 单佣金基本信息选择客户
  @autobind
  handleSelectAssembly(customer) {
    const { id } = customer;
    this.setState({
      customer,
    });
    this.clearSingleSelect();
    this.props.getSingleOtherRates({
      custRowId: id,
    });
  }

  // 单佣金内容组件
  // 由于组件被connect包装过所以需要使用getWrappedInstance获取真实的组件
  @autobind
  singleCreateBoardRef(input) {
    if (!input) return;
    this.singleBoard = input.getWrappedInstance();
  }

  render() {
    const {
      empInfo,
      singleOtherRatio,
    } = this.props;
    const {
      remark,
      customer,
    } = this.state;

    return (
      <div className={styles.newApprovalBox}>
        {/* 基本信息 */}
        <div className={styles.approvalBlock}>
          <InfoTitle head="基本信息" />
          <CommissionLine label="子类型" labelWidth="90px" required>
            <DisabledSelect text="佣金调整" />
          </CommissionLine>
          <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
            {
              customer && customer.custName ?
                (<DisabledSelect text={`${customer.custName}(${customer.custEcom})-${customer.riskLevelLabel}`} />) :
                (<DisabledSelect />)
            }
          </CommissionLine>
          <CommissionLine label="备注" labelWidth="90px">
            <TextArea
              placeholder="备注内容"
              value={remark}
              onChange={this.handleChangeRemark}
              style={{
                fontSize: '14px',
              }}
            />
          </CommissionLine>
        </div>
        {/* 单佣金调整 */}
        <SingleCreatBoard
          otherRations={singleOtherRatio}
          customer={customer}
          empInfo={empInfo}
          ref={this.singleCreateBoardRef}
        />
        <Button type="primary" onClick={this.handleSubmitApprovals} className={styles.commitBtn}>提交</Button>
      </div>
    );
  }
}
