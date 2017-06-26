/**
 * @file feedback/ProblemHandling.js
 *  问题反馈-解决弹窗
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, Row, Col, Input, Form, Modal, message, Upload } from 'antd';
import { createForm } from 'rc-form';
import { helper } from '../../utils';
import Icon from '../../components/common/Icon';
import { feedbackOptions, request } from '../../config';
import './problemHandling.less';

let COUNT = 0;
const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
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
    problemDetails: PropTypes.object.isRequired,
  }
  static defaultProps = {
    popContent: ' ',
    title: '问题处理',
    width: '620px',
  }
  constructor(props) {
    super(props);
    const questionTagOptions = feedbackOptions.questionTagOptions || EMPTY_LIST;
    const stateOptions = feedbackOptions.stateOptions || EMPTY_LIST;
    const { problemDetails = EMPTY_OBJECT } = props;
    this.state = {
      uploadKey: `uploadHandkey${COUNT++}`,
      newDetails: problemDetails,
      popQuestionTagOptions: questionTagOptions,
      stateOptions,
      uploadPops: {
        name: 'file',
        multiple: true,
        showUploadList: true,
        data: {
          empId: helper.getEmpId(),
        },
        action: `${request.prefix}/file/feedbackFileUpload`,
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
    };
  }
  componentWillReceiveProps(nextProps) {
    const { problemDetails: preData = EMPTY_OBJECT } = this.props;
    const { problemDetails: nextData = EMPTY_OBJECT } = nextProps;
    if (nextData !== preData) {
      this.setState({
        newDetails: nextData,
        uploadKey: `uploadHandkey${COUNT++}`,
      });
    }
  }

  // 数据提交
  handleSubChange() {
    const { form, onCreate } = this.props;
    onCreate(form);
  }

  render() {
    const {
      visible,
      title,
      onCancel,
      width,
      form,
    } = this.props;
    const {
      processer,
      status,
      tag,
      id,
    } = this.state.newDetails;
    const { getFieldDecorator } = form;
    const {
      popQuestionTagOptions,
      uploadPops,
      uploadKey,
    } = this.state;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value} value={i.value}>{i.label}</Option>,
    );
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleSubChange}
        onCancel={onCancel}
        width={width}
        className="problemwrap"
        key={uploadKey}
      >
        <div className="problembox">
          <div className="pro_title">
            <Icon type="tishi" className="tishi" />处理问题表示对此问题做出判断处理。
          </div>
          <div className="list_box">
            <Form layout="vertical">
              <Row>
                <Col span="4"><div className="label">问题标签：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('tag', { initialValue: `${tag || '无'}` })(
                      <Select style={{ width: 220 }}>
                        {getSelectOption(popQuestionTagOptions)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">状态：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('status', { initialValue: `${status}` })(
                      <Select style={{ width: 220 }}>
                        <Option value="PROCESSING">解决中</Option>
                        <Option value="CLOSED">关闭</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">经办人：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('processerEmpId', { initialValue: `${processer}` })(
                      <Select style={{ width: 220 }}>
                        <Option value="002332">经办人1</Option>
                        <Option value="002333">经办人2</Option>
                        <Option value="002334">经办人3</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">处理意见：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('processSuggest')(
                      <Input type="textarea" rows={5} style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">附件：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('uploadedFiles')(
                      <Dragger
                        {...uploadPops}
                      >
                        <div className="upload_txt">
                          + 上传附件
                        </div>
                      </Dragger>,
                    )},
                  </FormItem>
                </Col>
              </Row>
              <FormItem>
                {getFieldDecorator('id', { initialValue: `${id}` })(
                  <Input type="hidden" />,
                )}
              </FormItem>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}

