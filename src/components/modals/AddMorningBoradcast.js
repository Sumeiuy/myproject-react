/**
 * Created By K0170179 on 2018/1/16
 * 新增晨报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Upload, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class AddMorningBoradcast extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    handleOk: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
  };

  @autobind()
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  @autobind
  normFile(e) {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16, offset: 1 },
    };
    return (
      <Modal
        title="新建晨间播报"
        visible={this.props.visible}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        width="650px"
        wrapClassName="addMorningBoradcast"
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            wrapperCol={{ span: 8, offset: 1 }}
            label="类型"
            hasFeedback
          >
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: '请选择晨报类型' },
              ],
            })(
              <Select placeholder="请选择晨报类型">
                <Option value="china">China</Option>
                <Option value="use">U.S.A</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            wrapperCol={{ span: 8, offset: 1 }}
            label="作者"
          >
            {getFieldDecorator('author', {
              rules: [{ required: true, message: '请输入晨报作者!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="摘要"
          >
            {getFieldDecorator('abstract', {
              rules: [{ required: true, message: '请输入摘要!' }],
            })(
              <TextArea placeholder="请输入摘要内容..." autosize={{ minRows: 2, maxRows: 6 }} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="正文"
          >
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '请输入正文!' }],
            })(
              <TextArea placeholder="请输入正文内容..." autosize={{ minRows: 6, maxRows: 10 }} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="音频文件"
          >
            {getFieldDecorator('audioFile', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="audioFile" action="/audioFile.do" listType="picture">
                <div>
                  <i
                    className="icon iconfont icon-yinpinwenjian"
                    style={{ color: '#ac8ce0' }}
                  />
                  <span
                    className="audioDesc"
                    style={{ color: '#2782d7' }}
                  >
                  音频文件
                </span>
                </div>
              </Upload>,
            )}
            <Icon type="close" style={{ color: '#2782d7', cursor: 'pointer' }} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="其他文件"
          >
            {getFieldDecorator('otherFile', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="otherFile" action="/otherFile.do" listType="picture">
                <Button type="primary" icon="plus" >
                  添加文件
                </Button>
              </Upload>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
