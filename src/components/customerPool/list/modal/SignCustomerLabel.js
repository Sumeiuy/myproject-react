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
import styles from './signCustomerLabel.less';

const Option = Select.Option;

const EMPTY_LIST = [];

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
    removeSignLabelCustId: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: EMPTY_LIST,
      selectedLabels: EMPTY_LIST,
      fetching: false,
      preProps: props,
    };
  }

  @autobind
  handleSearchCustLabel(value) {
    const { queryLikeLabelInfo } = this.props;
    this.setState({ data: EMPTY_LIST, fetching: true });
    queryLikeLabelInfo({ labelNameLike: value });
  }

  @autobind
  handleChange(selectedLabels) {
    this.setState({
      selectedLabels,
      data: EMPTY_LIST,
    });
  }

  @autobind
  handleSubmitSignLabel() {
    const { signCustLabels, custId, removeSignLabelCustId, currentPytMng } = this.props;
    const { selectedLabels } = this.state;
    const { ptyMngId } = currentPytMng;
    const labelIds = _.map(selectedLabels, item => item.key);
    signCustLabels({
      custIds: [custId],
      labelIds,
      ptyMngId,
    }).then(removeSignLabelCustId);
  }

  render() {
    const { custId, removeSignLabelCustId } = this.props;
    const { fetching, data, selectedLabels } = this.state;

    return (
      <Modal
        title="添加客户标签"
        width={650}
        visible={Boolean(custId)}
        wrapClassName={styles.signCustomerLabel}
        onCancel={removeSignLabelCustId}
        destroyOnClose
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
          style={{ width: '100%' }}
        >
          {data.map(lableItem => <Option key={lableItem.id}>{lableItem.labelName}</Option>)}
        </Select>
      </Modal>
    );
  }
}
