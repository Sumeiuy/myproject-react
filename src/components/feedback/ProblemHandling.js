/**
 * @file feedback/ProblemHandling.js
 *  问题反馈-解决弹窗
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, Row, Col, Input, Form, Modal, message, Upload } from 'antd';
import { createForm } from 'rc-form';
import { feedbackOptions } from '../../config';
import './problemHandling.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;
@createForm()
export default class ProblemHandling extends PureComponent {
  static propTypes = {
    popContent: PropTypes.string,
    title: PropTypes.string,
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    width: PropTypes.string,
  }
  static defaultProps = {
    popContent: ' ',
    title: '问题反馈',
    width: '620px',
  }
  constructor(props) {
    super(props);
    this.setState({
      uploadPops: {
        name: 'file',
        multiple: true,
        showUploadList: true,
        action: '//jsonplaceholder.typicode.com/posts/',
        onChange(info) {
          const status = info.file.status;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      },
    });
  }
  state = {
    uploadPops: {},
  }
  render() {
    const { visible, title, onCancel, onCreate, width, form } = this.props;
    const { getFieldDecorator } = form;
    const questionTagOptions = feedbackOptions.questionTagOptions;
    console.log(questionTagOptions.pop(), '-------------22222');
    const getSelectOption = item => item.map(i =>
      <Option key={i.value}>{i.label}</Option>,
    );
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={onCreate}
        onCancel={onCancel}
        width={width}
        className="problemwrap"
      >
        <div className="problembox">
          <div className="pro_title">
            <i>!</i>处理问题表示对此问题做出判断处理。
          </div>
          <div className="list_box">
            <Form layout="vertical">
              <Row>
                <Col span="4"><div className="label">问题标签：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('qutable', { initialValue: '使用方法' })(
                      <Select style={{ width: 220 }} onChange={this.handleChange}>
                        {getSelectOption(questionTagOptions)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">状态：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('status', { initialValue: '解决中' })(
                      <Select style={{ width: 220 }}>
                        <Option value="解决中">解决中</Option>
                        <Option value="关闭">关闭</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">经办人：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('message', { initialValue: '信息技术部运维人员' })(
                      <Select style={{ width: 220 }}>
                        <Option value="信息技术部运维人员">信息技术部运维人员</Option>
                        <Option value="金基业务总部运维人员">金基业务总部运维人员</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">处理意见：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('content')(
                      <Input type="textarea" rows={5} style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">附件：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('file')(
                      <Dragger {...this.state.uploadPops}>
                        <div className="upload_txt">
                          + 上传附件
                        </div>
                      </Dragger>,
                    )},
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}

