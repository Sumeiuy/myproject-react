/**
 * @description 用于展示各种Modal
 */

import React, { PropTypes, PureComponent } from 'react';
import { Modal, Button, Form, Input, Select, Tooltip } from 'antd';
import { autobind } from 'core-decorators';
import { createForm } from 'rc-form';
import classnames from 'classnames';

import SelfSelect from './SelfSelect';
import styles from '../../components/modals/modalCommon.less';

import { VisibleRangeAll } from './VisibleRange';

const FormItem = Form.Item;
const Option = Select.Option;

const visibleRange = VisibleRangeAll;

@createForm()
export default class TemplModal extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      createModal: false,
      boardnamettVisible: false, // 看板名称Tooltip显示与否
    };
  }

  @autobind
  setModalVisible(modalName, visible) {
    this.setState({
      [modalName]: visible,
    });
  }

  @autobind
  getTootipPopContainer() {
    const wrapClassName = styles.boardManageModal;
    return document.querySelector(`.createBoard.${wrapClassName} .ant-modal-content`);
  }

  @autobind
  setTooltipVisible(boardnamettVisible) {
    this.setState({
      boardnamettVisible,
    });
  }

  @autobind
  openCreateModal() {
    this.setModalVisible('createModal', true);
  }

  @autobind
  closeCreateModal() {
    // 此处需要将form重置
    this.props.form.resetFields();
    // 隐藏Modal
    this.setModalVisible('createModal', false);
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
    }
    // this.closeCreateModal();
  }

  render() {
    const { createModal, boardnamettVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    // 表单布局
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      layout: 'horizontal',
    };
    // 设置表单选项的默认值
    const boardNameInital = '';
    const visibleRnageInitial = []; // 在弹出层中初始值为 [],
    const boardTypeInitial = 'invest';

    const createBoard = classnames({
      [styles.boardManageModal]: true,
      createBoard: true,
    });

    return (
      <div>
        <Button onClick={this.openCreateModal}>创建</Button>

        {/* 创建绩效看板Modal */}
        <Modal
          title="创建绩效看板"
          visible={createModal}
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
                      initialValue: boardNameInital,
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
                    initialValue: visibleRnageInitial,
                    valuePropName: 'value',
                  })(<SelfSelect options={visibleRange} level="1" />)
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
