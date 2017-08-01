/**
 * @description 另存为历史看板的Modal
 * @author hongguangqing
 */
import React, { PropTypes, PureComponent } from 'react';
import { Button, Modal, Form, Input, Tooltip } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';

const FormItem = Form.Item;
const create = Form.create;

@create()
export default class DeleteHistoryBoardModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    modalCaption: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      nameHelp: '不可以为空',
      boardnamettVisible: false, // 看板名称Tooltip显示与否
      modalVisible: visible,
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
  setTooltipVisible(boardnamettVisible) {
    this.setState({
      boardnamettVisible,
    });
  }

  @autobind
  getTootipPopContainer() {
    const wrapClassName = styles.boardManageModal;
    return document.querySelector(`.createBoard.${wrapClassName} .ant-modal-content .ant-form> .ant-form-item:first-child`);
  }

  @autobind
  closeCreateModal() {
    const { closeModal, modalKey } = this.props;
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
    console.warn('boardname', boardname);
    // 判断看板名称
    if (boardname === '') {
      // 看板名称不能为空
      this.setState({
        nameHelp: '名称不能为空',
      },
      () => {
        this.setTooltipVisible(true);
      });
      return;
    }
    if (/\s+/.test(boardname)) {
      this.setState({
        nameHelp: '名称不能含空格',
      },
      () => {
        this.setTooltipVisible(true);
      });
      return;
    }
    this.closeCreateModal();
  }

  render() {
    const { modalCaption, form } = this.props;
    const { getFieldDecorator } = form;
    const { nameHelp, boardnamettVisible, modalVisible } = this.state;

    const createBoard = classnames({
      [styles.boardManageModal]: true,
      createBoard: true,
    });
    return (
      <Modal
        visible={modalVisible}
        title={modalCaption}
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
        <div className={styles.modalDelTips}>
          <span>将挑选的指标结果保存为新的看板，请在以下输入框设置新看板名称：</span>
        </div>
        <Form>
          <Tooltip
            title={nameHelp}
            visible={boardnamettVisible}
            getPopupContainer={this.getTootipPopContainer}
            overlayClassName={styles.tooltipTop}
          >
            <FormItem>
              {
                getFieldDecorator(
                  'boardname',
                  {
                    rules: [{ required: true, message: '请输入看板名称' }],
                    initialValue: '',
                  })(
                    <Input placeholder="请输入看板名称" />,
                )
              }
            </FormItem>
          </Tooltip>
        </Form>
      </Modal>
    );
  }
}
