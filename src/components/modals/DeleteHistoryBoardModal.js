/**
 * @description 删除历史看板的Modal
 * @author hongguangqing
 */
import React, { PropTypes, PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';

import './modalCommon.less';

const FormItem = Form.Item;
const create = Form.create;

@create()
export default class DeleteHistoryBoardModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="提示"
        okText="提交"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="将挑选的指标结果保存为新的看板，请在以下输入框设置新看板名称：">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入看板名称' }],
            })(
              <Input placeholder="请输入看板名称" />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
