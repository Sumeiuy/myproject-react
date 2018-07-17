/**
 * @Descripter: 给客户打标签
 * @Author: K0170179
 * @Date: 2018/7/6
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Modal, Select } from 'antd';
import styles from './addCustomerLabel.less';

const Option = Select.Option;

const EMPTY_LIST = [];

export function replaceKeyWord(text, word = '') {
  if (!word) {
    return text;
  }
  const keyWordRegex = new RegExp(_.escapeRegExp(word), 'g');
  const keyWordText = _.replace(text, keyWordRegex, match => (
    `<span class=${styles.keyWord}>${match}</span>`
  ));
  return <div dangerouslySetInnerHTML={{ __html: keyWordText }} />;
}

export default class SignCustomerLabel extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { preCustId } = state;
    const { custId, custLabel } = props;
    let nextState = {
      preCustId: custId,
    };
    if (custId !== preCustId) {
      let selectedLabels = custLabel[custId] || EMPTY_LIST;
      selectedLabels = _.map(selectedLabels,
        item => ({ key: item.id, label: item.labelName }));
      nextState = { ...nextState, selectedLabels };
    }
    return nextState;
  }

  static propTypes = {
    custId: PropTypes.string.isRequired,
    custLabel: PropTypes.object.isRequired,
    currentPytMng: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signCustLabels: PropTypes.func.isRequired,
    handleCancelSignLabelCustId: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { custId } = props;
    this.state = {
      selectedLabels: EMPTY_LIST,
      value: '',
      preCustId: custId,
    };
  }

  @autobind
  handleSearchCustLabel(value) {
    this.setState({ value });
  }

  @autobind
  handleChange(selectedLabels) {
    this.setState({ selectedLabels });
  }

  @autobind
  handleSubmitSignLabel() {
    const { signCustLabels, custId, handleCancelSignLabelCustId, currentPytMng } = this.props;
    const { selectedLabels } = this.state;
    const { ptyMngId } = currentPytMng;
    const labelIds = _.map(selectedLabels, item => item.key);
    signCustLabels({
      custId,
      labelIds,
      ptyMngId,
    }).then(handleCancelSignLabelCustId);
  }

  @autobind
  handleBlur() {
    this.setState({ value: '' });
  }

  @autobind
  handleFocus() {
    const { queryLikeLabelInfo } = this.props;
    // 获得焦点时获取全部数据
    queryLikeLabelInfo({ labelNameLike: '' });
  }

  @autobind
  handleSearch(value) {
    this.setState({ value });
  }


  @autobind
  filterOption(value, option) {
    const { custLikeLabel } = this.props;
    const { key } = option;
    const { labelName = '' } = _.find(custLikeLabel, item => item.id === key) || {};
    return labelName.indexOf(value) > -1;
  }
  render() {
    const { custId, handleCancelSignLabelCustId, custLikeLabel } = this.props;
    const { selectedLabels, value = '' } = this.state;

    return (
      <Modal
        title="添加客户标签"
        width={650}
        visible={Boolean(custId)}
        wrapClassName={styles.signCustomerLabel}
        onCancel={handleCancelSignLabelCustId}
        destroyOnClose
        maskClosable={false}
        onOk={this.handleSubmitSignLabel}
      >
        <div className={styles.selectedInfo}>已选标签（{ selectedLabels.length }）</div>
        <Select
          mode="multiple"
          labelInValue
          value={selectedLabels}
          placeholder="请选择客户标签"
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onSearch={this.handleSearch}
          style={{ width: '100%' }}
          filterOption={this.filterOption}
          optionFilterProp="children"
        >
          {custLikeLabel.map(labelItem =>
            <Option key={labelItem.id}>{replaceKeyWord(labelItem.labelName, value)}</Option>,
          )}
        </Select>
      </Modal>
    );
  }
}
