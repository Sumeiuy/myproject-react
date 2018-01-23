/**
 * Created By K0170179 on 2018/1/16
 * 新增晨报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const props = {
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  },
  initialValue: [{
    uid: '222',
    name: 'xxx.png',
    status: 'done',
    reponse: 'Server Error 500', // custom error message to show
    url: 'http://www.baidu.com/xxx.png',
  }],
};

@Form.create()
export default class AddMorningBoradcast extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    uuid: PropTypes.number.isRequired,
    boradcastDetail: PropTypes.object.isRequired,
    saveboradcastInfo: PropTypes.object.isRequired,
    handleOk: PropTypes.func.isRequired,
    onHandleGetList: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    saveBoradcast: PropTypes.func.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { saveboradcastInfo, handleOk, onHandleGetList, visible } = this.props;
    const nextInfo = nextProps.saveboradcastInfo;
    const { resetFields } = this.props.form;
    // 新增或修改晨报
    if (saveboradcastInfo !== nextInfo) {
      if (nextInfo.resultData === 'success') {
        handleOk(resetFields);
        message.success('操作成功', 1);
        onHandleGetList();
      }
    }
    // 打开模态框时
    if (!visible && nextProps.visible) {
      const { uuid, boradcastDetail, getBoradcastDetail } = nextProps;
      console.log(uuid);
      if (uuid !== -1) {
        const itemDetail = boradcastDetail[uuid];
        if (!itemDetail) getBoradcastDetail({ newId: uuid });
      }
    }
  }

  @autobind()
  handleSubmit() {
    const { saveBoradcast } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.audioFileId.length === 1) {
          Object.assign(values, { audioFileId: values.audioFileId[0].uid });
          saveBoradcast(values);
        }
        console.log('Received values of form: ', values);
      }
    });
  }

  @autobind()
  normFile(e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  @autobind()
  getInitDate(type) {
    const { uuid, boradcastDetail } = this.props;
    if (!uuid) return '';
    const itemDetail = boradcastDetail[uuid];
    return itemDetail && itemDetail[type];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { getInitDate } = this;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16, offset: 1 },
    };
    return (
      <Modal
        title="新建晨间播报"
        width="650px"
        wrapClassName="addMorningBoradcast"
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.props.handleCancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="类型"
            wrapperCol={{ span: 8, offset: 1 }}
          >
            {getFieldDecorator('typeCode', {
              initialValue: getInitDate('newsTypeCode'),
              rules: [
                { required: true, message: '请选择晨报类型' },
              ],
            })(
              <Select placeholder="晨报类型">
                <Option value="V2_MORNING_NEWS">财经V2晨报</Option>
                <Option value="PROD_SALES_MORNING_NEWS">产品销售晨报</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="作者"
            wrapperCol={{ span: 8, offset: 1 }}
          >
            {getFieldDecorator('createdBy', {
              initialValue: getInitDate('createdBy'),
              rules: [{ required: true, message: '请输入晨报作者!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="标题"
          >
            {getFieldDecorator('title', {
              initialValue: getInitDate('title'),
              rules: [{ required: true, message: '请输入标题!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="摘要"
          >
            {getFieldDecorator('summary', {
              initialValue: getInitDate('summary'),
              rules: [{ required: true, message: '请输入摘要!' }],
            })(
              <TextArea placeholder="请输入摘要内容..." autosize={{ minRows: 2, maxRows: 6 }} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="正文"
          >
            {getFieldDecorator('content', {
              initialValue: getInitDate('content'),
              rules: [{ required: true, message: '请输入正文!' }],
            })(
              <TextArea placeholder="请输入正文内容..." autosize={{ minRows: 6, maxRows: 10 }} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="添加音频"
          >
            {getFieldDecorator('audioFileId', {
              ...props,
              valuePropName: 'fileList',
              rules: [{ required: true, message: '请添加音频文件' }],
              getValueFromEvent: this.normFile,
            })(
              <Upload action="action: '//jsonplaceholder.typicode.com/posts/'," listType="text">
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
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="其他文件"
          >
            {getFieldDecorator('otherFileId', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="otherFile" action="/otherFile.do" listType="text">
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
