/**
 * @file components/feedback/UploadFiles.js
 * 上传附件
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, message, Upload, Form } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import FileItem from './FileItem';
import { createForm } from 'rc-form';
import { request } from '../../config';
import { helper } from '../../utils';
import './uploadFiles.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
@createForm()
export default class UploadFiles extends PureComponent {
  static propTypes = {
    attachModelList: PropTypes.array,
    userId: PropTypes.string,
    form: PropTypes.object.isRequired,
    onCreate: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
  }
  static defaultProps = {
    attachModelList: EMPTY_LIST,
  }
  constructor(props) {
    super(props);
    const { onCreate, form } = props;
    this.state = {
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
            onCreate(form);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      },
      fileList: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { attachModelList: nextFileList = EMPTY_LIST } = nextProps;
    const { attachModelList: prevFileList = EMPTY_LIST } = this.props;
    if (nextFileList !== prevFileList) {
      const fileArray = nextFileList.map((item,i) => ({
        uid: item.attachUploader,
        key: i,
        name: item.attachName,
        status: 'done',
        url: item.attachUrl,
        thumbUrl: item.attachUrl,
      }));
      this.setState({
        fileList: nextFileList,
        changeFileList: fileArray,
      });
    }
  }
  @autobind
  getFileList(items) {
    const { removeFile, form } = this.props;
    const userId = helper.getEmpId();
    if (_.isEmpty(items)) {
      return null;
    }
    return items.map((item, i) => (
      <FileItem
        key={i}
        fileItem={item}
        onRemoveFile={removeFile}
      />
    ));
  }
  //附件上传
  @autobind
  fileUpdate(info) {
    const status = info.file.status;
    const { form, onCreate } = this.props;
    console.log(status);
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      onCreate(form);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    debugger;
  }
  render() {
    const { fileList, uploadPops } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="vertical">
        <Row>
          <Col span="12">
            <ul id="filelist" className="filelist">
              {this.getFileList(fileList)}
            </ul>
          </Col>
          <Col span="12">
            <div className="upload_dv">
              <FormItem>
                {getFieldDecorator('uploadedFiles')(
                    <Dragger 
                      {...uploadPops}
                      key="draggerOne"
                    >
                      <div className="upload_txt">
                        + 上传附件
                      </div>
                    </Dragger>,
                )},
              </FormItem>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
