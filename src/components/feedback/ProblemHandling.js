/*
 * @Author: yangquanjian
 * @Date: 2018-10-22 09:13:51
 * @LastEditors: li-ke
 * @LastEditTime: 2018-11-30 09:54:34
 * @Description: 问题反馈-解决弹窗
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Row, Col, Input, Form, Modal, message, Upload } from 'antd';
import { createForm } from 'rc-form';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { emp } from '../../helper';
import Icon from '../common/Icon';
import uploadRequest from '../../utils/uploadRequest';
import { feedbackOptions, request } from '../../config';
import styles from './problemHandling.less';
import logable from '../../decorators/logable';

let COUNT = 0;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const Dragger = Upload.Dragger;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const EMPTY_TEXT = '请选择';
const EMPTY_VALUE = '';
// 马珂默认工号
const DEFAULT_USER_ID = feedbackOptions.defaultUserId;
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
    inforTxt: PropTypes.string,
    operatorList: PropTypes.array.isRequired,
  }
  static defaultProps = {
    popContent: ' ',
    title: '问题处理',
    inforTxt: '处理问题表示对此问题做出判断处理。',
    width: '620px',
  }
  constructor(props) {
    super(props);
    const questionTagOptions = feedbackOptions.questionTagOptions || EMPTY_LIST;
    const stateOptions = feedbackOptions.stateOptions || EMPTY_LIST;
    const { problemDetails = EMPTY_OBJECT } = props;
    this.state = {
      showError: false,
      uploadKey: `uploadHandkey${COUNT++}`,
      newDetails: problemDetails,
      popQuestionTagOptions: questionTagOptions,
      stateOptions,
      uploadPops: {
        name: 'file',
        multiple: true,
        showUploadList: true,
        data: {
          empId: emp.getId(),
        },
        action: `${request.prefix}/file/feedbackFileUpload`,
        onChange: this.handleUploadFile,
        customRequest: this.fileCustomRequest,
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

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上传附件' } })
  handleUploadFile(info) {
    const file = info.file;
    const fileSize = file.size;
    if (fileSize === 0) {
      message.error('文件大小不能为 0');
      return;
    }
    const status = file.status;
    const response = file.response || {};
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (status === 'error') {
      const msg = _.isEmpty(response.msg) ? '文件上传失败' : response.msg;
      message.error(`${msg}.`);
    }
    return true;
  }

  // 数据提交
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubChange() {
    const { form, onCreate } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        message.error(err);
        return;
      }
      const { processer = '' } = values;
      if (_.isEmpty(processer)) {
        this.setState({
          showError: true,
        });
        return;
      }

      onCreate(form);
    });
  }

  @autobind
  handleProcesserChange(value) {
    this.setState({
      showError: _.isEmpty(value),
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    this.props.onCancel();
    this.setState({
      showError: false,
    });
  }

  @autobind
  fileCustomRequest(option) {
    return uploadRequest(option);
  }

  // 显示经办人
  @autobind
  renderEmpResp(processerID, operatorList) {
    // 如果经办人是无就显示defaultUser 马珂
    const defaultUser = _.find(operatorList, operator => operator.loginName === DEFAULT_USER_ID) || {};
    if (!_.isEmpty(processerID) && !_.isEmpty(operatorList)) {
      const operator = _.find(operatorList, operator =>
        operator.loginName === processerID) || {};
      return operator.lastName || defaultUser.lastName;
    }
    return '无';
  }

  render() {
    const {
      inforTxt,
      visible,
      title,
      width,
      form,
      operatorList,
    } = this.props;
    const {
      popQuestionTagOptions,
      uploadPops,
      uploadKey,
      newDetails,
      showError,
    } = this.state;
    const {
      processer,
      status,
      tag,
      id,
    } = newDetails;
    const { getFieldDecorator } = form;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value} value={i.value}>{i.label}</Option>,
    );
    const renderEmpOption = item => item.map(i =>
      <Option key={i.loginName} value={i.loginName}>{i.lastName}</Option>,
    );
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleSubChange}
        onCancel={this.handleCancel}
        width={width}
        className={styles.problemwrap}
        key={uploadKey}
        okText="提交"
      >
        <div className={styles.problembox}>
          <div className={styles.proTitle}>
            <Icon type="tishi" className={styles.tishi} />
            {inforTxt}
          </div>
          <div className={styles.listBox}>
            <Form layout="vertical">
              <Row>
                <Col span="4"><div className={styles.amLabel}>问题标签：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('tag', { initialValue: tag || '无' })(
                      <Select style={{ width: 220 }}>
                        {getSelectOption(popQuestionTagOptions)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className={styles.amLabel}>状态：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('status', { initialValue: `${title === '重新打开' ? 'PROCESSING' : status}` })(
                      <Select style={{ width: 220 }}>
                        <Option value="PROCESSING">解决中</Option>
                        <Option value="CLOSED">关闭</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4">
                  <div className={styles.amLabel}>
                    <span>*</span>经办人：
                  </div>
                </Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator(
                      'processer', {
                        initialValue: this.renderEmpResp(processer, operatorList)
                      }
                    )(
                      <Select
                        placeholder="请选择"
                        style={{ width: 220 }}
                        onChange={this.handleProcesserChange}
                      >
                      {renderEmpOption(operatorList)}
                      </Select>,
                    )}
                  </FormItem>
                  <div className={styles.errorMsg}>{showError ? '经办人不能为空' : ''}</div>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className={styles.amLabel}>处理意见：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('processSuggest')(
                      <TextArea rows={5} style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className={styles.amLabel}>附件：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('uploadedFiles')(
                      <Dragger
                        {...uploadPops}
                      >
                        <div className={styles.uploadTxt}>
                          + 上传附件
                        </div>
                      </Dragger>,
                    )},
                  </FormItem>
                </Col>
              </Row>
              <div style={{ display: 'none' }}>
                <FormItem>
                  {getFieldDecorator('id', { initialValue: `${id}` })(
                    <Input type="hidden" />,
                  )}
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}

