/**
 * @Author: sunweibin
 * @Date: 2018-06-11 14:09:17
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-07-04 14:59:00
 * @description 融资类业务客户关联关系数据填写表单
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, AutoComplete } from 'antd';
import _ from 'lodash';
import cx from 'classnames';

import InfoTitle from '../common/InfoTitle';
import SimilarAutoComplete from '../common/similarAutoComplete';
import Select from '../common/Select';
import confirm from '../common/confirm_';
import CommonUpload from '../common/biz/CommonUpload';
import FormItem from './FormItem';
import CustInfo from './CustInfo';
import AssociateRelationTable from './AssociateRelationTable';
import AddRelationshipModal from './AddRelationshipModal';
import logable, { logPV } from '../../decorators/logable';
import { STOCK_REPURCHASE_OPTIONS, custRelationships } from './config';
import { data, emp } from '../../helper';

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
    const custRelationshipList = isCreate ? []
    : _.map(_.get(custDetail, 'custRelationshipList'), (item) => {
      const uuid = data.uuid();
      return {
        ...item,
        key: uuid,
      };
    });
    this.state = {
      // 选择的用户
      cust: isCreate ? {} : _.get(custDetail, 'custDetail'),
      // 是否办理股票质押回购业务选项
      stockRepurchase: isCreate ? '' : _.get(custDetail, 'custDetail.businessFlag'),
      // 添加关联关系Modal
      addAssociateModal: false,
      // 客户的关联关系
      custRelationshipList,
      // 上传后的附件ID
      attachment: isCreate ? '' : _.get(custDetail, 'attachment'),
      // 用户驳回后修改的初始化展示的附件列表
      attachList: isCreate ? [] : _.get(custDetail, 'attachmentList'),
      // 判断是修改关联关系，还是添加关联关系
      relationModalAction: 'CREATE',
      // 进行修改的关联关系对象数据
      relationForUpdate: {},
      // 用于重新渲染上传组件的key
      uploadKey: data.uuid(),
    };
  }

  @autobind
  updateAssociateList() {
    const { custDetail: { custRelationshipList = [], ...reset } } = this.props;
    const listWithKey = custRelationshipList.map((item, index) => ({ ...item, key: index }));
    this.setState({
      custRelationshipList: listWithKey,
      cust: reset,
      stockRepurchase: '',
      attachment: '',
      attachList: [],
      uploadKey: data.uuid(),
    });
    this.props.onChange({
      relationships: custRelationshipList,
      cust: reset,
      attachment: '',
      stockRepurchase: '',
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '搜索客户', value: '$args[0]' } })
  handleSearchCustList(keyword) {
    this.props.queryCustList({
      keyword,
      type: APPLY_TYPE_CODE,
      deptCode: emp.getOrgId(),
      postnId: emp.getPstnId(),
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择客户',
      value: '$args[0].custName',
    },
  })
  handleSelectCust(cust) {
    // 如果切换客户，则提示会将之前的所有数据清空
    // 如果删除客户，则需要清空数据
    if (_.isEmpty(cust)) {
      this.handleClearDataBySwitchCust();
    } else {
      this.setState({ cust });
      this.props.getCustDetail({ custNumber: cust.brokerNumber }).then(this.updateAssociateList);
      // 切换客户之后，需要查询下客户类型下的关联关系树
      this.props.getRelationshipTree({ custType: cust.custType });
    }
  }

  @autobind
  handleClearDataBySwitchCust() {
    // 重新渲染附件组件，直接修改上传组件的key值得方式
    this.setState({
      cust: {},
      custRelationshipList: [],
      stockRepurchase: '',
      attachment: '',
      attachList: [],
      uploadKey: data.uuid(),
    });
    this.props.onChange({
      relationships: [],
      cust: {},
      attachment: '',
      stockRepurchase: '',
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '是否办理股票质押回购业务',
      value: (instance, args) => {
        if (args[1] === 'Y') {
          return '是';
        }
        return '否';
      },
    },
  })
  handleStockRepurchaseSelectChange(name, stockRepurchase) {
    this.setState({ stockRepurchase });
    this.props.onChange({ stockRepurchase });
  }

  @autobind
  @logPV({ pathname: '/modal/addRelation', title: '添加客户关联关系' })
  handlAddAssociateRelationBtnClick() {
    // 如果是驳回后修改页面则不需要对客户进行校验
    const { action } = this.props;
    const { cust } = this.state;
    if (action === 'CREATE' && _.isEmpty(cust)) {
      confirm({ content: '请先选择要申请的客户' });
    } else {
      this.setState({
        addAssociateModal: true,
        relationModalAction: 'CREATE',
      });
    }
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '删除$args[0].partyName',
    },
  })
  handleDelRelationConifrm(record) {
    confirm({
      content: '确定要删除该条关联关系吗？',
      onOk: () => {
        this.handleDelRelation(record);
      },
    });
  }

  @autobind
  handleDelRelation(record) {
    const { key } = record;
    const { custRelationshipList } = this.state;
    const newList = _.filter(custRelationshipList, item => item.key !== key);
    this.setState({ custRelationshipList: newList });
    this.props.onChange({ relationships: newList });
  }

  @autobind
  @logPV({ pathname: '/modal/updateRelation', title: '修改客户关联关系' })
  handleUpdateRelation(record) {
    this.setState({
      addAssociateModal: true,
      relationModalAction: 'UPDATE',
      relationForUpdate: record,
    });
  }

  @autobind
  handleUploadCallBack(attachment) {
    this.setState({ attachment });
    this.props.onChange({ attachment });
  }

  @autobind
  handleRelationshipModalClose() {
    this.setState({
      addAssociateModal: false,
      relationForUpdate: {},
    });
  }

  @autobind
  handleAddRelationModalConfirm(param) {
    const { action, ...reset } = param;
    const { custRelationshipList } = this.state;
    let newList = [];
    if (action === 'CREATE') {
      // 新增的关联关系的 processFlag 为 'N'
      const uuid = data.uuid();
      const key = `REAL-${uuid}`;
      newList = [{ ...reset, key, processFlag: 'N' }, ...custRelationshipList];
    } else {
      // 修改,需要将原有的拿出来进行替换,
      // 修改关联关系的 processFlag 不变，即使修改的是新增的
      newList = _.map(custRelationshipList, (item) => {
        const { key } = item;
        if (key === param.key) {
          return {
            ...item,
            ...reset,
          };
        }
        return item;
      });
    }
    this.setState({
      addAssociateModal: false,
      custRelationshipList: newList,
      relationForUpdate: {},
    });
    this.props.onChange({ relationships: newList });
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
      relationForUpdate,
      uploadKey,
      cust,
    } = this.state;
    const { action, custList, relationshipTree } = this.props;
    // 判断当前组件是否在驳回后修改页面里面
    const isCreate = action === 'CREATE';
    const wrapCls = cx({
      [styles.custRelationshipContainer]: true,
      [styles.reject]: !isCreate,
    });
    const stockRepurchaseValue = stockRepurchase === 'Y' ? '是' : '否';

    return (
      <div className={wrapCls}>
        <InfoTitle head="基本信息" />
        {
          isCreate ?
          (
            <FormItem label="客户" labelWidth={90}>
              <SimilarAutoComplete
                placeholder="经纪客户号/客户名称"
                optionList={custList}
                optionKey="brokerNumber"
                needConfirmWhenClear
                clearConfirmTips="切换或者删除客户，将导致所有的数据清空或者重置"
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
        {
          isCreate
          ? (
            <FormItem label="是否办理股票质押回购业务" labelWidth={204}>
              <Select
                name="stockRepurchase"
                width="105px"
                needShowKey={false}
                value={stockRepurchase}
                data={STOCK_REPURCHASE_OPTIONS}
                onChange={this.handleStockRepurchaseSelectChange}
              />
            </FormItem>
          )
          : (
            <div className={styles.rejectStockRepurchase}>
              <span className={styles.rejectStockRepurchaseLabel}>是否办理股票质押回购业务：</span>
              <span className={styles.rejectStockRepurchaseName}>{stockRepurchaseValue}</span>
            </div>
          )
        }
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
          onDelRelation={this.handleDelRelationConifrm}
          onUpdateRelation={this.handleUpdateRelation}
        />
        <div className={styles.divider} />
        <InfoTitle head="附件信息" />
        <CommonUpload
          edit
          reformEnable
          key={uploadKey}
          attachment={attachment || ''}
          needDefaultText={false}
          attachmentList={attachList}
          uploadAttachment={this.handleUploadCallBack}
        />
        {
          !addAssociateModal ? null :
          (
            <AddRelationshipModal
              cust={cust}
              action={relationModalAction}
              ralationTree={relationshipTree}
              data={relationForUpdate}
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
