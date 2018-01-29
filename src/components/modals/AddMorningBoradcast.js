/**
 * Created By K0170179 on 2018/1/16
 * 新增晨报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { request } from '../../config';
import { emp } from '../../helper';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@Form.create()
export default class AddMorningBoradcast extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    newsId: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    boradcastDetail: PropTypes.object.isRequired,
    saveboradcastInfo: PropTypes.object.isRequired,
    delSourceFile: PropTypes.object.isRequired,
    newUuid: PropTypes.array.isRequired,
    handleOk: PropTypes.func.isRequired,
    onHandleGetList: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    saveBoradcast: PropTypes.func.isRequired,
    delCeFile: PropTypes.func.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
    dict: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      audioFileList: [],
      audioError: true, // audioFile 校验
      otherFileList: [],
      finalNewUuid: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { saveboradcastInfo,
      handleOk,
      onHandleGetList,
      visible,
      delSourceFile,
      newUuid,
    } = this.props;
    const { newsId, boradcastDetail, getBoradcastDetail } = nextProps;
    const nextInfo = nextProps.saveboradcastInfo;
    const { finalNewUuid } = this.state;
    const { resetFields } = this.props.form;
    // 打开模态框
    if (!visible && nextProps.visible) {
      this.resetState();
      if (newsId !== -1) {
        const itemDetail = boradcastDetail[newsId];
        if (!itemDetail) {
          getBoradcastDetail({ newsId });
        } else {
          this.setSourceValue(itemDetail);
        }
      } else {
        // 新建时初始化表单和参数
        resetFields();
        this.setState({ finalNewUuid: newUuid });
      }
    }
    // 获取晨报详情
    if (boradcastDetail !== this.props.boradcastDetail) {
      const itemDetail = boradcastDetail[newsId];
      this.setSourceValue(itemDetail);
    }
    // 新增或修改晨报
    if (saveboradcastInfo !== nextInfo) {
      if (nextInfo.resultData === 'success') {
        this.resetState();
        handleOk(resetFields);
        message.success('操作成功', 1);
        onHandleGetList();
      }
    }
    // 删除文件
    if (delSourceFile !== nextProps.delSourceFile) {
      const audioSource = nextProps.delSourceFile[finalNewUuid[0]];
      const otherSource = nextProps.delSourceFile[finalNewUuid[1]];
      if (audioSource) {
        this.setState({
          audioFileList: this.resourceToUpload(audioSource, finalNewUuid[0]),
        });
      } else if (otherSource) {
        this.setState({
          otherFileList: this.resourceToUpload(otherSource, finalNewUuid[1]),
        });
      }
    }
  }

  //  初始化state
  @autobind
  resetState() {
    this.setState({
      audioFileList: [],
      audioError: true, // audioFile 校验
      otherFileList: [],
      finalNewUuid: [],
    });
  }
  setSourceValue(itemDetail) {
    const { resourceToUpload } = this;
    const { audioFileList, audioFileId, otherFileList, otherFileId } = itemDetail;
    if (itemDetail) {
      this.setState({
        audioFileList: resourceToUpload(audioFileList, audioFileId),
        otherFileList: resourceToUpload(otherFileList, otherFileId),
        finalNewUuid: [audioFileId, otherFileId],
      });
    }
  }

  @autobind()
  handleSubmit() {
    const { saveBoradcast, newsId } = this.props;
    const { audioFileList, finalNewUuid } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!audioFileList.length) {
        this.setState({ audioError: false });
        return;
      }
      this.setState({ audioError: true });
      if (!err) {
        Object.assign(values, {
          audioFileId: finalNewUuid[0],
          otherFileId: finalNewUuid[1],
        });
        if (newsId !== -1) {
          Object.assign(values, { newsId,
            updatedBy: values.createdBy,
            createdBy: null,
          });
        }
        saveBoradcast(values);
      }
    });
  }

  @autobind()
  getInitDate(type) {
    const { newsId, boradcastDetail } = this.props;
    const itemDetail = boradcastDetail[newsId];
    if (!itemDetail) return '';
    const { updatedBy } = itemDetail;
    if (type === 'createdBy') return updatedBy || itemDetail[type];
    return itemDetail[type];
  }

  // audio upload --> start
  @autobind
  onAudioUploading(fileList) {
    const audioFileList = fileList.filter((fileItem) => {
      if (fileItem.response) {
        return fileItem.response.code === '0';
      }
      return true;
    });
    this.setState({ audioFileList });
  }
  @autobind
  onOtherUploading(fileList) {
    const otherFileList = fileList.filter((fileItem) => {
      if (fileItem.response) {
        return fileItem.response.code === '0';
      }
      return true;
    });
    this.setState({ otherFileList });
  }
  @autobind
  onDone(file) {
    const { finalNewUuid } = this.state;
    const sourceState = ['fileAudioList', 'otherFileList'];
    const attachment = file.response.attachment;
    const fileState = sourceState[finalNewUuid.indexOf(attachment)];
    const resFileList = file.response.resultData.attaches;
    const finalFileAudioList = this.resourceToUpload(resFileList, attachment);
    this.setState({ [fileState]: finalFileAudioList });
  }
  @autobind
  onAudioChange({ fileList, file }) {
    if (file.status === 'uploading') {
      this.onAudioUploading(fileList);
    }
    if (file.status === 'done') {
      const resFileList = file.response.resultData.attaches;
      const attachment = file.response.resultData.attachment;
      const finalFileAudioList = this.resourceToUpload(resFileList, attachment);
      this.setState({
        audioFileList: finalFileAudioList,
        audioError: finalFileAudioList.length,
      });
    }
    if (file.status === 'error') {
      this.setState({ fileAudioList: fileList });
    }
  }
  @autobind
  onOtherChange({ fileList, file }) {
    if (file.status === 'uploading') {
      this.onOtherUploading(fileList);
    }
    if (file.status === 'done') {
      const attachment = file.response.resultData.attachment;
      const resFileList = file.response.resultData.attaches;
      const finalFileAudioList = this.resourceToUpload(resFileList, attachment);
      this.setState({ otherFileList: finalFileAudioList });
    }
    if (file.status === 'error') {
      this.setState({ otherFileList: fileList });
    }
  }
  @autobind
  onRemove(file) {
    const { delCeFile } = this.props;
    if (file.status === 'removed') {
      const query = {
        attachment: file.attachment,
        empId: emp.getId(),
        type: 'audio',
        attachId: file.uid,
      };
      delCeFile(query);
    }
    return false;
  }
  @autobind
  onBeforeUpload(file) {
    const isMPC = file.type === 'audio/mp3';
    const audioType = this.getInitDate('newsTypeCode');
    if (!isMPC) {
      message.info('音频文件格式为audio/mp3');
      return false;
    }
    if (audioType === 'V2_MORNING_NEWS') {
      const isOver = file.size / 1024 / 1024 < 16;
      if (!isOver) {
        message.info('资讯晨报文件小于16兆');
        return false;
      }
    } else if (audioType === 'PROD_SALES_MORNING_NEWS') {
      const isOver = file.size / 1024 / 1024 < 30;
      if (!isOver) {
        message.info('资讯晨报文件小于20兆');
        return false;
      }
    }

    return true;
  }
  @autobind
  resourceToUpload(resource, attachment) {
    if (Array.isArray(resource)) {
      return resource.map((item) => {
        const audioItem = {
          status: 'done',
          uid: item.attachId,
          name: item.name,
          response: { code: '0' },
          attachment,
        };
        return audioItem;
      });
    }
    return [];
  }
  // audio upload --> end

  render() {
    const {
      audioFileList,
      audioError,
      otherFileList,
      finalNewUuid,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { getInitDate } = this;
    const { newsId, dict, handleCancel } = this.props;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16, offset: 1 },
    };
    const sourceProps = {
      action: `${request.prefix}/file/ceFileUpload`,
      onRemove: this.onRemove,
    };
    const audioProps = Object.assign({}, sourceProps, {
      action: `${request.prefix}/file/ceFileReplaceUpload `,
      accept: 'audio/*',
      data: {
        attachment: finalNewUuid[0],
        empId: emp.getId(),
      },
      showUploadList: {
        showRemoveIcon: false,
      },
      beforeUpload: this.onBeforeUpload,
      onChange: this.onAudioChange,
    });
    const otherProps = Object.assign({}, sourceProps, {
      accept: '*/*',
      data: {
        attachment: finalNewUuid[1],
        empId: emp.getId(),
      },
      onChange: this.onOtherChange,
    });
    const morningBoradcastType = dict.newsTypeDictList || [];
    return (
      <Modal
        title={`${newsId !== -1 ? '修改' : '新建'}晨间播报`}
        width="650px"
        wrapClassName="addMorningBoradcast"
        bodyStyle={{
          height: '400px',
          overflowY: 'scroll',
        }}
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={handleCancel}
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
                {
                  morningBoradcastType.map(item => <Option value={item.key}>{item.value}</Option>)
                }
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
            <Upload {...audioProps} fileList={audioFileList} >
              <div>
                <i
                  className="icon iconfont icon-yinpinwenjian"
                  style={{ color: '#ac8ce0' }}
                />
                <span
                  className="audioDesc"
                  style={{ color: '#2782d7', cursor: 'pointer' }}
                >
                  {`${audioFileList.length ? '上传音频文件' : '更新音频文件'}`}
                </span>
              </div>
            </Upload>
            { audioError ? null : (<div style={{ color: 'red' }}>请上传一首音频文件</div>) }
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="其他文件"
          >
            <Upload {...otherProps} fileList={otherFileList}>
              <Button type="primary" icon="plus" >
                添加文件
              </Button>
            </Upload>,
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
