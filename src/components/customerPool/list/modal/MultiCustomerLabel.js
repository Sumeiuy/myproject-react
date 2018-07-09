/**
 * @Descripter: 添加单客户标签
 * @Author: K0170179
 * @Date: 2018/7/6
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, Select } from 'antd';
import _ from 'lodash';
import { replaceKeyWord } from './SignCustomerLabel';
import styles from './addCustomerLabel.less';

const Option = Select.Option;

const EMPTY_LIST = [];
const EMPTY_OBJ = {};

export default class SignCustomerLabel extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { preProps } = state;
    const { custLikeLabel } = props;
    let nextState = {
      preProps: props,
    };
    if (custLikeLabel !== preProps.custLikeLabel) {
      nextState = { ...nextState, data: custLikeLabel };
    }
    return nextState;
  }

  static propTypes = {
    currentPytMng: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signCustLabels: PropTypes.func.isRequired,
    closeMultiCustSignLabel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    condition: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.selectLabel = EMPTY_OBJ;
    this.state = {
      data: EMPTY_LIST,
      labelValue: '',
      preProps: props,
    };
  }

  @autobind
  handleChange(labelValue) {
    const { selectLabel: { labelName } } = this;
    const { queryLikeLabelInfo } = this.props;
    if (labelName === labelValue) {
      queryLikeLabelInfo({ labelNameLike: '' });
    } else {
      this.selectLabel = EMPTY_OBJ;
      queryLikeLabelInfo({ labelNameLike: labelValue });
    }
    this.setState({
      labelValue,
    });
  }

  @autobind
  handleSelect(value) {
    const { data } = this.state;
    this.selectLabel = _.find(data, item => item.labelName === value) || {};
  }

  @autobind
  handleSubmitSignLabel() {
    const {
      signCustLabels,
      currentPytMng,
      condition,
      location: {
        query: {
          selectAll,
          selectedIds,
        },
      },
    } = this.props;
    const { ptyMngId } = currentPytMng;
    const payload = {};
    payload.labelIds = [this.selectLabel.id];
    if (selectAll) {
      payload.queryCustReq = condition;
    }
    if (selectedIds) {
      const custList = decodeURIComponent(selectedIds).split(',');
      const custIds = [];
      _.forEach(custList, (item) => {
        custIds.push(item.split('.')[0]);
      });
      payload.custIds = custIds;
    }
    signCustLabels({
      ...payload,
      ptyMngId,
    }).then(this.handleCloseModal);
  }

  @autobind
  handleCloseModal() {
    const { closeMultiCustSignLabel } = this.props;
    this.selectLabel = EMPTY_OBJ;
    this.setState({ labelValue: '' });
    closeMultiCustSignLabel();
  }

  render() {
    const { visible } = this.props;
    const { data, labelValue } = this.state;

    return (
      <Modal
        title="添加客户标签"
        width={650}
        visible={visible}
        wrapClassName={styles.signCustomerLabel}
        destroyOnClose
        maskClosable={false}
        onOk={this.handleSubmitSignLabel}
        onCancel={this.handleCloseModal}
      >
        <Select
          mode="combobox"
          placeholder="请选择客户标签"
          filterOption={false}
          value={labelValue}
          defaultActiveFirstOption={false}
          showArrow={false}
          style={{ width: '100%' }}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          firstActiveValue={labelValue}
        >
          {data.map(labelItem =>
            <Option key={labelItem.labelName}>
              {replaceKeyWord(labelItem.labelName, labelValue)}
            </Option>,
          )}
        </Select>
      </Modal>
    );
  }
}
