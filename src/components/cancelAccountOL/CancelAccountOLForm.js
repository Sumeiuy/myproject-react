/**
 * @Author: sunweibin
 * @Date: 2018-07-10 14:49:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-12 18:13:38
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

export default class CancelAccountOLForm extends PureComponent {
  static propTypes = {
    // 判断此组件用于新建页面还是驳回后修改页面，'CREATE'或者'UPDATE'
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
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
  }

  constructor(props) {
    super(props);
    const { action, detailInfo } = props;
    const isCreate = action === 'CREATE';
    this.state = {
      // 用于重新渲染上传组件的key
      uploadKey: data.uuid(),
      attachment: isCreate ? '' : _.get(detailInfo, 'attachment'),
      attachList: isCreate ? [] : _.get(detailInfo, 'attachmentList'),
      cust: isCreate ? {} : _.get(detailInfo, 'basicInfo'),
      // 流失去向
      lostDirection: isCreate ? '' : _.get(detailInfo, 'basicInfo.lostDirectionCode'),
      // 证券营业部
      stockExchange: isCreate ? '' : _.get(detailInfo, 'basicInfo.stockExchange'),
      // 投资品种
      investVars: isCreate ? [] : getSelectedKeys(_.get(detailInfo, 'basicInfo.investVars')),
      // 是否选择了其他投资品种
      hasSelecOtherVar: isCreate ? false : isSelectedOtherOption(_.get(detailInfo, 'basicInfo.investVars'), 'churnInvestOther'),
      // 其他投资品种详情
      otherVarDetail: isCreate ? '' : _.get(detailInfo, 'basicInfo.investVars.churnInvestOtherDetail'),
      // 流失原因
      lostReason: isCreate ? [] : getSelectedKeys(_.get(detailInfo, 'basicInfo.lostReason')),
      // 是否选择了其他原因
      hasSelectOtherReason: isCreate ? false : isSelectedOtherOption(_.get(detailInfo, 'basicInfo.lostReason'), 'churnOther'),
      // 其他流失原因的详情
      otherReasonDetail: isCreate ? '' : _.get(detailInfo, 'basicInfo.lostReason.churnOtheReason'),
      // 备注
      comment: isCreate ? '' : _.get(detailInfo, 'basicInfo.commet'),
    };

    this.wrapRef = React.createRef();
  }

  @autobind
  getWrapRef() {
    return this.wrapRef.current;
  }

  @autobind
  handleUploadCallBack(attachment) {
    this.setState({ attachment });
    this.props.onChange({ attachment });
  }

  @autobind
  handleClearDataBySwitchCust() {
    // 重新渲染附件组件，直接修改上传组件的key值得方式
    this.setState({
      cust: {},
      attachment: '',
      attachList: [],
      uploadKey: data.uuid(),
    });
    this.props.onChange({
      cust: {},
      attachment: '',
    });
  }

  @autobind
  handleSearchCustList(keyword) {
    this.props.queryCustList({ keyword });
  }

  @autobind
  handleSelectCust(cust) {
    // 如果切换客户，则提示会将之前的所有数据清空
    // 如果删除客户，则需要清空数据
    if (_.isEmpty(cust)) {
      this.handleClearDataBySwitchCust();
    } else {
      this.setState({ cust });
    }
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '流失去向', value: '$args[1]' } })
  handleLosDirectionSelect(key, value) {
    this.setState({ lostDirection: value });
  }

  @autobind
  handleStockExchangeChange(e) {
    this.setState({ stockExchange: e.target.value });
  }

  @autobind
  handleInvestVarsChange({ value }) {
    this.setState({ investVars: value });
    console.warn('handleInvestVarsChange:', value);
  }

  @autobind
  handleLostReasonChange({ value }) {
    this.setState({ lostReason: value });
    console.warn('handleLostReasonChange:', value);
  }

  @autobind
  handleOtherVarDetailChange(e) {
    this.setState({ otherVarDetail: e.target.value });
  }

  @autobind
  handleOtherLostResonDetailChange(e) {
    this.setState({ otherReasonDetail: e.target.value });
  }

  @autobind
  handleCommenteChange(e) {
    this.setState({ comment: e.target.value });
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

  render() {
    const {
      uploadKey,
      attachment,
      attachList,
      cust,
      lostDirection,
      stockExchange,
      investVars,
      otherVarDetail,
      hasSelecOtherVar,
      lostReason,
      hasSelectOtherReason,
      otherReasonDetail,
      comment,
    } = this.state;
    const { action, custList, optionsDict } = this.props;
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
    const orgName = _.isEmpty(cust) ? '--' : `${cust.orgName}`;
    // 判断流失去向选择的是转户还是投资其他,
    // 如果是转户，则显示证券营业部输入框
    // 如果是投资其他，则显示投资品种多选框
    const isTransfer = isTransferLostDirection(lostDirection);

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
                    style={{ width: '160px' }}
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
                  <span className={styles.rejectCustName}>{`${cust.custName}(${cust.custId})`}</span>
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
                needShowKey={false}
                width="160px"
                name="lostDirection"
                optionLabelMapKey="value"
                optionValueMapKey="key"
                data={lostDirectionOptions}
                value={lostDirection}
                onChange={this.handleLosDirectionSelect}
                getPopupContainer={this.getWrapRef}
              />
            </InfoCell>
          </Col>
          <Col span={14}>
            {
              isTransfer ?
              (
                <InfoCell label="证券营业部" labelWidth={100}>
                  <div className={styles.infoCellInput}>
                    <Input
                      value={stockExchange}
                      onChange={this.handleStockExchangeChange}
                    />
                  </div>
                </InfoCell>
              )
              :
              (
                <InfoCell label="投资品种" labelWidth={100}>
                  <div className={styles.infoCellInput}>
                    <MultiFilter
                      needItemObj
                      useCustomerFilter
                      className={styles.investVarFilter}
                      filterName="投资品种"
                      defaultLabel="--请选择--"
                      data={investVarsOptions}
                      value={investVars}
                      onChange={this.handleInvestVarsChange}
                    />
                  </div>
                  {
                    hasSelecOtherVar ? null
                    :
                    (
                      <div className={`${styles.infoCellInput} ${styles.ml15} ${styles.autoWidth}`}>
                        <Input
                          placeholder="详细投资品种"
                          value={otherVarDetail}
                          onChange={this.handleOtherVarDetailChange}
                        />
                      </div>
                    )
                  }
                </InfoCell>
              )
            }
          </Col>
        </Row>
        <Row gutter={16} type="flex">
          <Col span={24}>
            <InfoCell label="流失原因" labelWidth={90}>
              <div className={styles.infoCellInput}>
                <MultiFilter
                  needItemObj
                  useCustomerFilter
                  className={styles.investVarFilter}
                  filterName="流失原因"
                  defaultLabel="--请选择--"
                  data={lostReasonOptions}
                  value={lostReason}
                  onChange={this.handleLostReasonChange}
                />
              </div>
              {
                hasSelectOtherReason ? null
                :
                (
                  <div className={`${styles.infoCellInput} ${styles.ml15} ${styles.autoWidth}`}>
                    <Input
                      placeholder="详细原因"
                      value={otherReasonDetail}
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
                <i className={styles.required}>*</i>
                <span className={styles.colon}>备注:</span>
              </div>
              <div className={styles.textArea}>
                <TextArea
                  rows={5}
                  value={comment}
                  onChange={this.handleCommenteChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <div className={styles.divider} />
        <InfoTitle head="附件信息" />
        <CommonUpload
          edit
          reformEnable
          key={uploadKey}
          attachment={attachment}
          needDefaultText={false}
          attachmentList={attachList}
          uploadAttachment={this.handleUploadCallBack}
        />
      </div>
    );
  }
}
