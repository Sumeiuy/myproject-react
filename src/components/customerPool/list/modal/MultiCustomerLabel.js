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

const EMPTY_OBJ = {};

@Form.create()
export default class SignCustomerLabel extends PureComponent {
  static propTypes = {
    currentPytMng: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signBatchCustLabels: PropTypes.func.isRequired,
    closeMultiCustSignLabel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    condition: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.selectLabel = EMPTY_OBJ;
    this.state = {
      labelValue: '',
    };
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { ptyMngId } = currentPytMng;
        const { labelId } = values;
        const payload = {
          labelIds: [labelId],
        };
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
    });
  }

  @autobind
  handleCloseModal() {
    const { closeMultiCustSignLabel } = this.props;
    this.setState({ labelValue: '' });
    closeMultiCustSignLabel();
  }

  @autobind
  handleFocus() {
    const { queryLikeLabelInfo } = this.props;
    // 获得焦点时获取全部数据
    queryLikeLabelInfo({ labelNameLike: '' });
  }

  @autobind
  handleSearch(value) {
    this.setState({
      labelValue: value,
    });
  }

  @autobind
  handleFilterOption(value, option) {
    const { custLikeLabel } = this.props;
    const { key } = option;
    const { labelName = '' } = _.find(custLikeLabel, item => item.id === key) || {};
    return labelName.indexOf(value) > -1;
  }
  render() {
    const { visible, custLikeLabel, form } = this.props;
    const { getFieldDecorator } = form;
    const { labelValue } = this.state;

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
          <FormItem>
            {getFieldDecorator('labelId', {
              rules: [{ required: true, message: '请选择自定义标签' }],
            })(
              <Select
                showSearch
                placeholder="请选择您希望设置的标签"
                optionFilterProp="children"
                style={{ width: '100%' }}
                onFocus={this.handleFocus}
                onSearch={this.handleSearch}
                filterOption={this.handleFilterOption}
              >
                {custLikeLabel.map(labelItem =>
                  <Option key={labelItem.id}>
                    {replaceKeyWord(labelItem.labelName, labelValue)}
                  </Option>,
                )}
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
