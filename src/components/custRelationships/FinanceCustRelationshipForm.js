/**
 * @Author: sunweibin
 * @Date: 2018-06-11 14:09:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 20:07:49
 * @description 融资类业务客户关联关系数据填写表单
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, AutoComplete } from 'antd';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import SimilarAutoComplete from '../common/similarAutoComplete';
import Select from '../common/Select';
import CommonUpload from '../common/biz/CommonUpload';
import FormItem from './FormItem';
import CustInfo from './CustInfo';
import AssociateRelationTable from './AssociateRelationTable';
import AddRelationshipModal from './AddRelationshipModal';

import { StockRepurchaseOptions, custRelationships } from './config';

import styles from './financeCustRelationshipForm.less';

const Option = AutoComplete.Option;
const APPLY_TYPE_CODE = custRelationships.pageType;

export default class FinanceCustRelationshipForm extends Component {
  static propTypes = {
    // 判断此组件用于新建页面还是驳回后修改页面，'CREATE'或者'UPDATE'
    action: PropTypes.oneOf(['CREATE', 'UPDATE']),
    // 获取客户详情
    getCustDetail: PropTypes.func,
    custDetail: PropTypes.object.isRequired,
    // 获取可申请客户列表
    queryCustList: PropTypes.func,
    custList: PropTypes.array,
    // 获取关联关系树
    getRelationshipTree: PropTypes.func,
    relationshipTree: PropTypes.array.isRequired,
    // 当用户选的数据发生变化时候的回调
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    action: 'CREATE',
    getCustDetail: _.noop,
    queryCustList: _.noop,
    custList: [],
    getRelationshipTree: _.noop,
  }

  constructor(props) {
    super(props);
    const { action, custDetail } = props;
    const isCreate = action === 'CREATE';

    this.state = {
      // 选择的用户
      cust: {},
      // 是否办理股票质押回购业务选项，默认 是 'Y'
      stockRepurchase: isCreate ? '' : _.get(custDetail, 'custDetail.stockRepurchase'),
      // 添加关联关系Modal
      addAssociateModal: false,
      // 客户的关联关系
      custRelationshipList: isCreate ? [] : _.get(custDetail, 'custRelationshipList'),
      // 上传后的附件ID
      attachment: isCreate ? '' : _.get(custDetail, 'attachment'),
      // 用户驳回后修改的初始化展示的附件列表
      attachList: isCreate ? [] : _.get(custDetail, 'attachmentList'),
      // 判断是修改关联关系，还是添加关联关系
      relationModalAction: 'CREATE',
    };
  }

  @autobind
  updateAssociateList() {
    const { custDetail: { custRelationshipList = [] } } = this.props;
    const listWithKey = custRelationshipList.map((item, index) => ({ ...item, key: index }));
    this.setState({ custRelationshipList: listWithKey });
    this.props.onChange({ relationships: custRelationshipList });
  }

  @autobind
  handleSearchCustList(keyword) {
    this.props.queryCustList({ keyword, type: APPLY_TYPE_CODE });
  }

  @autobind
  handleSelectCust(cust) {
    this.setState({ cust });
    this.props.onChange({ cust });
    this.props.getCustDetail({ custId: cust.brokerNumber }).then(this.updateAssociateList);
    // 切换客户之后，需要查询下客户类型下的关联关系树
    this.props.getRelationshipTree({ custType: cust.custType });
  }

  @autobind
  handleStockRepurchaseSelectChange(name, stockRepurchase) {
    this.setState({ stockRepurchase });
    this.props.onChange({ stockRepurchase });
  }

  @autobind
  handlAddAssociateRelationBtnClick() {
    this.setState({
      addAssociateModal: true,
      relationModalAction: 'CREATE',
    });
  }

  @autobind
  handleDelRelation(record) {
    // TODO 确定要删除关联关系吗？
    console.warn('删除关联关系:', record);
    const { key } = record;
    const { custRelationshipList } = this.state;
    const newList = _.filter(custRelationshipList, item => item.key !== key);
    this.setState({ custRelationshipList: newList });
    this.props.onChange({ relationships: newList });
  }

  @autobind
  handleUpdateRelation(record) {
    // TODO 需要将数据回填给添加关联关系的弹出层
    console.warn('handleUpdateRelation: ', record);
    this.setState({ relationModalAction: 'UPDATE' });
  }

  @autobind
  handleUploadCallBack(attachment) {
    this.setState({ attachment });
  }

  @autobind
  handleRelationshipModalClose() {
    this.setState({ addAssociateModal: false });
  }

  @autobind
  handleAddRelationModalConfirm(param) {
    console.warn('点击添加关联关系确认按钮:', param);
    this.setState({
      addAssociateModal: false,
    });
  }

  @autobind
  renderCustAutoCompleteOption(cust) {
    // 渲染客户下拉列表的选项DOM
    const { brokerNumber, custName } = cust;
    const text = `${custName}（${brokerNumber}）`;
    return (
      <Option key={brokerNumber} value={text} >
        <span className={styles.custAutoCompleteOptionValue} title={text}>{text}</span>
      </Option>
    );
  }

  render() {
    const {
      stockRepurchase,
      addAssociateModal,
      custRelationshipList,
      relationModalAction,
      attachList,
      attachment,
    } = this.state;
    const { action, custList, custDetail, relationshipTree } = this.props;
    // 判断当前组件是否在驳回后修改页面里面
    const isCreate = action === 'CREATE';
    let cust = custDetail;
    if (!isCreate) {
      cust = custDetail.custDetail;
    }

    return (
      <div className={styles.custRelationshipContainer}>
        <InfoTitle head="基本信息" />
        {
          isCreate ?
          (
            <FormItem label="客户" labelWidth={90}>
              <SimilarAutoComplete
                placeholder="经纪客户号/客户名称"
                optionList={custList}
                optionKey="brokerNumber"
                onSelect={this.handleSelectCust}
                onSearch={this.handleSearchCustList}
                renderOptionNode={this.renderCustAutoCompleteOption}
              />
            </FormItem>
          )
          :
          (
            <div className={styles.rejectCust}>
              <span className={styles.rejectCustLabel}>客户：</span>
              <span className={styles.rejectCustName}>{`${cust.custName}(${cust.custId})`}</span>
            </div>
          )
        }
        <CustInfo cust={cust} isCreate={isCreate} />
        <FormItem label="是否办理股票质押回购业务" labelWidth={204}>
          <Select
            name="stockRepurchase"
            width="105px"
            needShowKey={false}
            value={stockRepurchase}
            data={StockRepurchaseOptions}
            onChange={this.handleStockRepurchaseSelectChange}
          />
        </FormItem>
        <div className={styles.divider} />
        <InfoTitle head="关联信息" />
        <div className={styles.associateBtn}>
          <Button
            ghost
            type="primary"
            icon="plus"
            onClick={this.handlAddAssociateRelationBtnClick}
          >
            添加
          </Button>
        </div>
        <AssociateRelationTable
          data={custRelationshipList}
          onDelRelation={this.handleDelRelation}
          onUpdateRelation={this.handleUpdateRelation}
        />
        <div className={styles.divider} />
        <InfoTitle head="附件信息" />
        <CommonUpload
          edit
          attachment={attachment}
          needDefaultText={false}
          attachmentList={attachList}
          uploadAttachment={this.handleUploadCallBack}
        />
        {
          !addAssociateModal ? null :
          (
            <AddRelationshipModal
              action={relationModalAction}
              ralationTree={relationshipTree}
              data={{}}
              visible={addAssociateModal}
              onClose={this.handleRelationshipModalClose}
              onOK={this.handleAddRelationModalConfirm}
            />
          )
        }
      </div>
    );
  }
}
