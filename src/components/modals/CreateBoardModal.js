/**
 * @description 创建看板的Modal
 * @author sunweibin
 */
import React, { PropTypes, PureComponent } from 'react';
import { Modal, Button, Form, Input, Select, Tooltip } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import SelfSelect from '../Edit/SelfSelect';
import styles from './modalCommon.less';

const FormItem = Form.Item;
const create = Form.create;
const Option = Select.Option;

@create()
export default class CreateBoardModal extends PureComponent {
  static propTypes = {
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    form: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    allOptions: PropTypes.array.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      modalVisible: visible,
      boardnamettVisible: false, // 看板名称Tooltip显示与否
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    const { visible: preVisible } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        modalVisible: visible,
      });
    }
  }

  @autobind
  getTootipPopContainer() {
    const wrapClassName = styles.boardManageModal;
    return document.querySelector(`.createBoard.${wrapClassName} .ant-modal-content .ant-form> .ant-form-item:first-child`);
  }

  @autobind
  setTooltipVisible(boardnamettVisible) {
    this.setState({
      boardnamettVisible,
    });
  }

  @autobind
  closeCreateModal() {
    const { modalKey, closeModal } = this.props;
    // 此处需要将form重置
    this.props.form.resetFields();
    // 隐藏Modal
    closeModal(modalKey);
    this.setTooltipVisible(false);
  }

  @autobind
  confirmCreateModal() {
    const { form } = this.props;
    // TODO 添加确认按钮处理程序
    const boardname = form.getFieldValue('boardname');
    const boardtype = form.getFieldValue('boardtype');
    const visibleRangeConfirm = form.getFieldValue('visibleRange');
    console.log('confirmCreateModal>boardname', boardname);
    console.log('confirmCreateModal>boardtype', boardtype);
    console.log('confirmCreateModal>visibleRangeConfirm', visibleRangeConfirm);
    // 判断看板名称
    if (boardname === '') {
      // 看板名称不能为空
      this.setTooltipVisible(true);
      return;
    }
    // TODO 调用创建看板接口
    // 隐藏Modal
    this.closeCreateModal();
  }

  render() {
    const { modalVisible, boardnamettVisible } = this.state;
    const { modalCaption, allOptions } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 表单布局
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      layout: 'horizontal',
    };
    // 设置表单选项的默认值
    const boardTypeInitial = 'invest';

    const createBoard = classnames({
      [styles.boardManageModal]: true,
      createBoard: true,
    });

    return (
      <Modal
        title={modalCaption}
        visible={modalVisible}
        closeable
        onCancel={this.closeCreateModal}
        wrapClassName={createBoard}
        maskClosable={false}
        footer={[
          <Button key="back" size="large" onClick={this.closeCreateModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.confirmCreateModal}>
            确认
          </Button>,
        ]}
      >
        <Form>
          <Tooltip
            title="不可以为空"
            visible={boardnamettVisible}
            getPopupContainer={this.getTootipPopContainer}
            overlayClassName={styles.tooltipTop}
          >
            <FormItem
              {...formItemLayout}
              label="看板名称"
              required
            >
              {
                getFieldDecorator(
                  'boardname',
                  {
                    initialValue: '',
                  })(<Input type="text" placeholder="请输入看板名称" />)
              }
            </FormItem>
          </Tooltip>
          <FormItem
            {...formItemLayout}
            label="看板类型"
            required
          >
            {getFieldDecorator(
              'boardtype',
              {
                initialValue: boardTypeInitial,
              })(
                <Select>
                  <Option value="invest">投顾业绩</Option>
                  <Option value="business">经营业绩</Option>
                </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="可见范围"
            required
            showSearch={false}
          >
            {
              getFieldDecorator(
                'visibleRange',
                {
                  initialValue: {
                    currency: [],
                    label: allOptions[0].name,
                  },
                })(<SelfSelect options={allOptions} level="1" />)
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
