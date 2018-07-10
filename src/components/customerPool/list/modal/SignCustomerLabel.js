/**
 * @Descripter: 给客户打标签
 * @Author: K0170179
 * @Date: 2018/7/6
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Modal, Select, Spin } from 'antd';
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
    const { preProps } = state;
    const { custId, custLabel, custLikeLabel } = props;
    let nextState = {
      preProps: props,
    };
    if (custId !== preProps.custId) {
      let selectedLabels = custLabel[custId] || EMPTY_LIST;
      selectedLabels = _.map(selectedLabels,
        item => ({ key: item.id, label: item.labelName }));
      nextState = { ...nextState, selectedLabels, custLikeLabel: EMPTY_LIST };
    }
    if (custLikeLabel !== preProps.custLikeLabel) {
      nextState = { ...nextState, data: custLikeLabel, fetching: false };
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
    this.state = {
      data: EMPTY_LIST,
      selectedLabels: EMPTY_LIST,
      value: '',
      fetching: false,
      preProps: props,
    };
  }

  @autobind
  handleSearchCustLabel(value) {
    const { queryLikeLabelInfo } = this.props;
    this.setState({
      data: EMPTY_LIST,
      fetching: true,
      value,
    });
    queryLikeLabelInfo({ labelNameLike: value });
  }

  @autobind
  handleChange(selectedLabels) {
    const { data } = this.state;
    let lastSelectLabel = _.last(selectedLabels);
    let finalSelectedLabels = selectedLabels;
    const { key, label } = lastSelectLabel;
    if (_.isPlainObject(label)) {
      finalSelectedLabels = _.pull(finalSelectedLabels, lastSelectLabel);
      const selectedLabel = _.find(data, item => item.id === key);
      lastSelectLabel = {
        ...lastSelectLabel,
        label: selectedLabel.labelName,
      };
      finalSelectedLabels = [...finalSelectedLabels, lastSelectLabel];
    }
    this.setState({
      selectedLabels: finalSelectedLabels,
      data: EMPTY_LIST,
    });
  }

  @autobind
  handleSubmitSignLabel() {
    const { signCustLabels, custId, handleCancelSignLabelCustId, currentPytMng } = this.props;
    const { selectedLabels } = this.state;
    const { ptyMngId } = currentPytMng;
    const labelIds = _.map(selectedLabels, item => item.key);
    signCustLabels({
      custIds: [custId],
      labelIds,
      ptyMngId,
    }).then(handleCancelSignLabelCustId);
  }

  @autobind
  handleBlur() {
    this.setState({ value: '' });
  }
  render() {
    const { custId, handleCancelSignLabelCustId } = this.props;
    const { fetching, data, selectedLabels, value = '' } = this.state;

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
          notFoundContent={fetching ? <Spin size="small" /> : null}
          filterOption={false}
          onSearch={this.handleSearchCustLabel}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          style={{ width: '100%' }}
        >
          {value ? data.map(lableItem =>
            <Option key={lableItem.id}>{replaceKeyWord(lableItem.labelName, value)}</Option>,
          ) : null}
        </Select>
      </Modal>
    );
  }
}
