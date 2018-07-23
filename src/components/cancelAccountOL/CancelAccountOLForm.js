/**
 * @Author: sunweibin
 * @Date: 2018-07-10 14:49:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-23 15:42:36
 * @description 线上销户新建以及驳回后修改通用部分
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { AutoComplete, Input, Row, Col } from 'antd';
import { MultiFilter } from 'lego-react-filter/src';

import InfoTitle from '../common/InfoTitle';
import SimilarAutoComplete from '../common/similarAutoComplete';
import Select from '../common/Select';
import CommonUpload from '../common/biz/CommonUpload';
import InfoCell from './InfoCell';

import {
  isInvestLostDirection,
  isTransferLostDirection,
  getSelectedKeys,
  isSelectedOtherOption,
} from './utils';
import { data } from '../../helper';
import logable from '../../decorators/logable';

import styles from './cancelAccountOLForm.less';

const Option = AutoComplete.Option;
const TextArea = Input.TextArea;
const DEFAULT_OPTION = { value: '', label: '--请选择--' };
// 投资品种中的其他品种的 key
const INVEST_OTHER_VAR_KEY = 'churnInvestmentOther';
// 流失原因中的其他原因的 key
const LOST_REASON_OTHER_KEY = 'churnOther';

export default class CancelAccountOLForm extends PureComponent {
  static propTypes = {
    // 判断此组件用于新建页面还是驳回后修改页面，'CREATE'或者'UPDATE'
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
    // 在驳回后修改页面，如果提交了之后，则不允许修改
    disablePage: PropTypes.bool,
    queryCustList: PropTypes.func,
    // 可选的客户列表
    custList: PropTypes.array,
    // 申请单详情
    detailInfo: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    // 字典
    optionsDict: PropTypes.object.isRequired,
  }

  static defaultProps = {
    custList: [],
    queryCustList: _.noop,
    detailInfo: {},
    disablePage: false,
  }

  constructor(props) {
    super(props);
    const formData = this.getInitialState(props);
    this.state = {
      // 整个 Form 表单数据
      formData,
    };

    this.wrapRef = React.createRef();
  }

  @autobind
  getInitialState(props) {
    const { action, detailInfo = {} } = props;
    const isCreate = action === 'CREATE';
    if (isCreate) {
      return {};
    }
    // 附件相关
    const attach = _.pick(detailInfo, ['attachment', 'attachmentList']);
    // 客户基础信息有关
    const cust = detailInfo.basicInfo;
    return {
      uploadKey: data.uuid(),
      ...attach,
      // 选中的客户信息
      cust,
      // 流失去向
      lostDirection: _.lowerFirst(_.get(cust, 'lostDirectionCode')),
      // 流失去向如果是转户，则存在证券营业部的名称
      stockExchange: _.get(cust, 'stockExchange'),
      // 流失去向如果是投资其他，则存在投资品种
      investVars: getSelectedKeys(_.get(cust, 'investVars')),
      // 是否选择了其他投资品种
      hasSelecOtherVar: isSelectedOtherOption(_.get(cust, 'investVars'), INVEST_OTHER_VAR_KEY),
      // 其他投资品种详情
      otherVarDetail: _.get(detailInfo, 'basicInfo.investVars.churnInvestOtherDetail'),
      // 流失原因
      lostReason: getSelectedKeys(_.get(cust, 'lostReason')),
      // 是否选择了其他原因
      hasSelectOtherReason: isSelectedOtherOption(_.get(cust, 'lostReason'), LOST_REASON_OTHER_KEY),
      // 其他流失原因的详情
      otherReasonDetail: _.get(_.get(cust, 'lostReason'), 'churnOtheReason'),
      // 备注
      comment: detailInfo.commet,
    };
  }

  @autobind
  getWrapRef() {
    return this.wrapRef.current;
  }

  @autobind
  handleUploadCallBack(attachment) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        attachment,
      },
    });
    this.props.onChange({
      attachment,
    });
  }

  @autobind
  handleSwitchCust(cust) {
    // 重新渲染附件组件，直接修改上传组件的key值得方式
    this.setState({
      formData: { cust },
    });
    this.props.onChange({
      cust,
      attachment: '',
      lostDirection: '',
      stockExchange: '',
      investVars: [],
      hasSelecOtherVar: false,
      otherVarDetail: '',
      lostReason: [],
      hasSelectOtherReason: false,
      otherReasonDetail: '',
      comment: '',
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '搜索客户', value: '$args[0]' } })
  handleSearchCustList(keyword) {
    if (_.isEmpty(keyword)) {
      return;
    }
    this.props.queryCustList({ keyword });
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '选择线上销户申请的客户', value: '$args[0]' } })
  handleSelectCust(newCust) {
    // 如果切换客户，则提示会将之前的所有数据清空
    // 如果删除客户，则需要清空数据
    const { formData } = this.state;
    if (_.isEmpty(newCust) || _.get(formData, 'cust.brokerNumber') !== newCust.brokerNumber) {
      this.handleSwitchCust(newCust);
    }
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '流失去向', value: '$args[1]' } })
  handleLosDirectionSelect(key, value) {
    let derivedState = {};
    if (isTransferLostDirection(value)) {
      // 如果选择的是转户，则需要将证券营业部的文字以及投资品种的选项全部情况
      derivedState = {
        investVars: [],
        hasSelecOtherVar: false,
        otherVarDetail: '',
      };
    } else if (isInvestLostDirection(value)) {
      // 如果选择的是投资其他, 则需要将证券营业部的文字以及投资品种的选项全部情况
      derivedState = {
        stockExchange: '',
      };
    } else {
      derivedState = {
        stockExchange: '',
        investVars: [],
        hasSelecOtherVar: false,
        otherVarDetail: '',
      };
    }
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        ...derivedState,
        lostDirection: value,
      },
    });
    this.props.onChange({
      ...derivedState,
      lostDirection: value,
    });
  }

  @autobind
  handleStockExchangeChange(e) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        stockExchange: e.target.value,
      },
    });
    this.props.onChange({ stockExchange: e.target.value });
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '投资品种', value: '$args[0]' } })
  handleInvestVarsChange({ value }) {
    const { formData: { hasSelecOtherVar = false } } = this.state;
    const noSelectOther = _.isEmpty(_.find(value, o => o.key === INVEST_OTHER_VAR_KEY));
    // 如果从没选其他品种-->选择其他品种，则显示详情品种输入框
    // 如果从选了其他品种-->取消选择其他品种，则不显示详情品种输入框
    let otherState = {};
    if (!hasSelecOtherVar && !noSelectOther) {
      otherState = { hasSelecOtherVar: true };
    } else if (hasSelecOtherVar && noSelectOther) {
      otherState = {
        hasSelecOtherVar: false,
        otherVarDetail: '',
      };
    }
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        ...otherState,
        investVars: value,
      },
    });
    this.props.onChange({
      ...otherState,
      investVars: value,
    });
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '流失原因', value: '$args[0]' } })
  handleLostReasonChange({ value }) {
    const { formData: { hasSelectOtherReason = false } } = this.state;
    const noSelectOther = _.isEmpty(_.find(value, o => o.key === LOST_REASON_OTHER_KEY));
    // 如果从没选其他品种-->选择其他品种，则显示详情品种输入框
    // 如果从选了其他品种-->取消选择其他品种，则不显示详情品种输入框
    let otherState = {};
    if (!hasSelectOtherReason && !noSelectOther) {
      otherState = {
        hasSelectOtherReason: true,
        otherReasonDetail: '',
      };
    } else if (hasSelectOtherReason && noSelectOther) {
      otherState = {
        hasSelectOtherReason: false,
        otherReasonDetail: '',
      };
    }
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        ...otherState,
        lostReason: value,
      },
    });
    this.props.onChange({
      ...otherState,
      lostReason: value,
    });
  }

  @autobind
  handleOtherVarDetailChange(e) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        otherVarDetail: e.target.value,
      },
    });
    this.props.onChange({
      otherVarDetail: e.target.value,
    });
  }

  @autobind
  handleOtherLostResonDetailChange(e) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        otherReasonDetail: e.target.value,
      },
    });
    this.props.onChange({
      otherReasonDetail: e.target.value,
    });
  }

  @autobind
  handleCommenteChange(e) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        comment: e.target.value,
      },
    });
    this.props.onChange({
      comment: e.target.value,
    });
  }

  @autobind
  addDefaultOption(list = []) {
    return _.map([DEFAULT_OPTION, ...list],
      item => ({ key: item.value, value: item.label }));
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

  @autobind
  renderLostDirectionCascadeDom(lostDirection, investVarsOptions) {
    // 判断流失去向选择的是转户还是投资其他,
    // 如果是转户，则显示证券营业部输入框
    // 如果是投资其他，则显示投资品种多选框
    const isTransfer = isTransferLostDirection(lostDirection);
    const hasSelectLostDirection = lostDirection !== '';
    const { disablePage } = this.props;
    const { formData } = this.state;

    if (hasSelectLostDirection && isTransfer) {
      return (
        <InfoCell label="证券营业部" labelWidth={100}>
          <div className={styles.infoCellInput}>
            <Input
              disabled={disablePage}
              value={formData.stockExchange || ''}
              onChange={this.handleStockExchangeChange}
            />
          </div>
        </InfoCell>
      );
    } else if (hasSelectLostDirection && !isTransfer) {
      return (
        <InfoCell label="投资品种" labelWidth={100}>
          <div className={styles.infoCellInput}>
            <MultiFilter
              disabled={disablePage}
              needItemObj
              useCustomerFilter
              className={styles.investVarFilter}
              filterName="投资品种"
              defaultLabel="--请选择--"
              data={investVarsOptions}
              value={formData.investVars || []}
              onChange={this.handleInvestVarsChange}
            />
          </div>
          {
            !formData.hasSelecOtherVar ? null
            :
            (
              <div className={`${styles.infoCellInput} ${styles.ml15} ${styles.autoWidth}`}>
                <Input
                  disabled={disablePage}
                  placeholder="详细投资品种"
                  value={formData.otherVarDetail || ''}
                  onChange={this.handleOtherVarDetailChange}
                />
              </div>
            )
          }
        </InfoCell>
      );
    }
    return null;
  }

  render() {
    const { formData } = this.state;
    const { action, custList, optionsDict, disablePage } = this.props;
    if (_.isEmpty(optionsDict)) {
      return null;
    }
    // 判断当前组件是否在驳回后修改页面里面
    const isCreate = action === 'CREATE';
    const wrapCls = cx({
      [styles.cancelAccountContainer]: true,
      [styles.reject]: !isCreate,
    });
    // 服务营业部名称
    const orgName = _.isEmpty(formData.cust) ? '--' : `${formData.cust.orgName}`;

    // 流失去向 Options
    const lostDirectionOptions = this.addDefaultOption(optionsDict.custLossDirectionTypeList);
    // 投资品种 Options
    const investVarsOptions = this.addDefaultOption(optionsDict.custInvestVarietyTypeList);
    // 流失原因 Options
    const lostReasonOptions = this.addDefaultOption(optionsDict.custLossReasonTypeList);

    return (
      <div className={wrapCls} ref={this.wrapRef}>
        <InfoTitle head="基本信息" />
        <Row type="flex" gutter={16} align="middle">
          <Col span={10}>
            {
              isCreate ?
              (
                <InfoCell label="客户" labelWidth={90}>
                  <SimilarAutoComplete
                    style={{ width: '180px' }}
                    placeholder="经纪客户号/客户名称"
                    optionList={custList}
                    optionKey="brokerNumber"
                    needConfirmWhenClear
                    clearConfirmTips="切换或者删除客户，将导致所有的数据清空或者重置"
                    onSelect={this.handleSelectCust}
                    onSearch={this.handleSearchCustList}
                    renderOptionNode={this.renderCustAutoCompleteOption}
                  />
                </InfoCell>
              )
              :
              (
                <div className={styles.rejectCust}>
                  <span className={styles.rejectCustLabel}>客户：</span>
                  <span className={styles.rejectCustName}>{`${formData.cust.custName}(${formData.cust.custId})`}</span>
                </div>
              )
            }
          </Col>
          <Col span={14}>
            <InfoCell label="服务营业部" labelWidth={100} required={false}>
              <span className={styles.orgName}>{orgName}</span>
            </InfoCell>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col span={10}>
            <InfoCell label="流失去向" labelWidth={90}>
              <Select
                disabled={disablePage}
                needShowKey={false}
                width="180px"
                name="lostDirection"
                optionLabelMapKey="value"
                optionValueMapKey="key"
                data={lostDirectionOptions}
                value={formData.lostDirection || ''}
                onChange={this.handleLosDirectionSelect}
                getPopupContainer={this.getWrapRef}
              />
            </InfoCell>
          </Col>
          <Col span={14}>
            {this.renderLostDirectionCascadeDom(formData.lostDirection || '', investVarsOptions)}
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col span={24}>
            <InfoCell label="流失原因" labelWidth={90}>
              <div className={styles.infoCellInput}>
                <MultiFilter
                  disabled={disablePage}
                  needItemObj
                  useCustomerFilter
                  className={styles.investVarFilter}
                  filterName="流失原因"
                  defaultLabel="--请选择--"
                  data={lostReasonOptions}
                  value={formData.lostReason || []}
                  onChange={this.handleLostReasonChange}
                />
              </div>
              {
                !formData.hasSelectOtherReason ? null
                :
                (
                  <div className={`${styles.infoCellInput} ${styles.ml15} ${styles.autoWidth}`}>
                    <Input
                      disabled={disablePage}
                      placeholder="详细原因"
                      value={formData.otherReasonDetail || ''}
                      onChange={this.handleOtherLostResonDetailChange}
                    />
                  </div>
                )
              }
            </InfoCell>
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col span={24}>
            <div className={styles.commentArea}>
              <div className={styles.label}>
                <span className={styles.colon}>备注:</span>
              </div>
              <div className={styles.textArea}>
                <TextArea
                  disabled={disablePage}
                  rows={5}
                  value={formData.comment || ''}
                  onChange={this.handleCommenteChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <div className={styles.divider} />
        <InfoTitle head="附件信息" />
        <CommonUpload
          edit={!disablePage}
          reformEnable
          key={formData.uploadKey || data.uuid()}
          attachment={formData.attachment || ''}
          needDefaultText={false}
          attachmentList={formData.attachList || []}
          uploadAttachment={this.handleUploadCallBack}
        />
      </div>
    );
  }
}
