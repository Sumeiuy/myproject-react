/**
 * @Descripter: 添加单客户标签
 * @Author: K0170179
 * @Date: 2018/7/6
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, Select, Form } from 'antd';
import _ from 'lodash';
import { replaceKeyWord } from './SignCustomerLabel';
import styles from './addCustomerLabel.less';

const Option = Select.Option;
const FormItem = Form.Item;

const EMPTY_LIST = [];
const EMPTY_OBJ = {};

export default class SignCustomerLabel extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { preCustLikeLabel } = state;
    const { custLikeLabel } = props;
    let nextState = {
      preCustLikeLabel: custLikeLabel,
    };
    if (custLikeLabel !== preCustLikeLabel) {
      nextState = { ...nextState, data: custLikeLabel };
    }
    return nextState;
  }

  static propTypes = {
    currentPytMng: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signBatchCustLabels: PropTypes.func.isRequired,
    closeMultiCustSignLabel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    condition: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.selectLabel = EMPTY_OBJ;
    const { custLikeLabel } = props;
    this.state = {
      data: EMPTY_LIST,
      labelValue: '',
      preCustLikeLabel: custLikeLabel,
      validateState: false,
    };
  }

  @autobind
  handleChange(labelValue) {
    const { selectLabel: { labelName } } = this;
    const { queryLikeLabelInfo } = this.props;
    let finalLabelValue = labelValue;
    let validateState = false;
    if (labelName === labelValue) {
      queryLikeLabelInfo({ labelNameLike: '' });
    } else if (_.isEmpty(this.selectLabel)) {
      queryLikeLabelInfo({ labelNameLike: labelValue });
    } else {
      this.selectLabel = EMPTY_OBJ;
      finalLabelValue = '';
      validateState = true;
    }
    this.setState({
      labelValue: finalLabelValue,
      validateState,
    });
  }

  @autobind
  handleSelect(value) {
    const { data } = this.state;
    this.selectLabel = _.find(data, item => item.labelName === value) || {};
    this.setState({
      validateState: false,
    });
  }

  @autobind
  handleSubmitSignLabel() {
    const {
      signBatchCustLabels,
      currentPytMng,
      condition,
      location: {
        query: {
          selectAll,
          selectedIds,
        },
      },
    } = this.props;
    if (_.isEmpty(this.selectLabel)) {
      this.setState({
        validateState: true,
      });
      return;
    }
    const { ptyMngId } = currentPytMng;
    const payload = {};
    payload.labelIds = [this.selectLabel.id];
    if (selectAll) {
      payload.queryCustsReq = condition;
    }
    if (selectedIds) {
      const custList = decodeURIComponent(selectedIds).split(',');
      const custIds = [];
      _.forEach(custList, (item) => {
        custIds.push(item.split('.')[0]);
      });
      payload.custIds = custIds;
    }
    signBatchCustLabels({
      ...payload,
      ptyMngId,
    }).then(this.handleCloseModal);
  }

  @autobind
  handleCloseModal() {
    const { closeMultiCustSignLabel } = this.props;
    this.selectLabel = EMPTY_OBJ;
    this.setState({
      labelValue: '',
      validateState: false,
    });
    closeMultiCustSignLabel();
  }

  render() {
    const { visible } = this.props;
    const { data, labelValue, validateState } = this.state;

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
        <Form>
          <FormItem
            validateStatus={validateState ? 'error' : ''}
            help={validateState ? '请选择自定义标签' : ''}
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
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
