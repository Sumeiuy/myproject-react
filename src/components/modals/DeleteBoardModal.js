/**
 * @description 删除看板的Modal
 * @author sunweibin
 */
import React, { PropTypes, PureComponent } from 'react';
import { Modal, Button, Form, Input, Tooltip } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';

const FormItem = Form.Item;
const create = Form.create;

@create()
export default class DeleteBoardModal extends PureComponent {
  static propTypes = {
    modalName: PropTypes.string.isRequired,
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    form: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
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
    const selector = `.delBoard.${wrapClassName} .ant-modal-content .ant-form> .ant-form-item:first-child`;
    return document.querySelector(selector);
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
    const { form, modalName } = this.props;
    // TODO 添加确认按钮处理程序
    const delModalName = form.getFieldValue('delModalName');
    // 判断看板名称
    if (_.isEqual(delModalName, modalName)) {
      // 如果相同，则删除看板
      // TODO 调用删除看板接口
      // 隐藏Modal
      this.closeCreateModal();
    } else {
      // 不同则显示提示框
      this.setTooltipVisible(true);
    }
  }

  render() {
    const { modalVisible, boardnamettVisible } = this.state;
    const { modalName, modalCaption } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 表单布局
    const formItemLayout = {
      wrapperCol: { span: 24 },
      layout: 'horizontal',
    };

    const delBoard = classnames({
      [styles.boardManageModal]: true,
      delBoard: true,
    });

    return (
      <Modal
        title={modalCaption}
        visible={modalVisible}
        closeable
        onCancel={this.closeCreateModal}
        wrapClassName={delBoard}
        maskClosable={false}
        footer={[
          <Button key="back" size="large" onClick={this.closeCreateModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.confirmCreateModal}>
            确认
          </Button>,
        ]}
      >
        <div className={styles.modalDelTips}>
          <span>您选择删除的看板为“</span>
          <span className={styles.delModalName}>{modalName}</span>
          <span>”。删除后，可见范围权限的用户将无法查看，且不能恢复，请再次输入看板名称确认：</span>
        </div>
        <Form>
          <Tooltip
            title="名称与选中的看板不符"
            visible={boardnamettVisible}
            getPopupContainer={this.getTootipPopContainer}
            overlayClassName={styles.tooltipTop}
          >
            <FormItem
              {...formItemLayout}
            >
              {
                getFieldDecorator(
                  'delModalName',
                  {
                    initialValue: '',
                  })(<Input type="text" placeholder="请输入看板名称" />)
              }
            </FormItem>
          </Tooltip>
        </Form>
      </Modal>
    );
  }
}
