/**
 * @file components/feedback/UploadFiles.js
 * 上传附件
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, message, Upload, Form } from 'antd';
import { autobind } from 'core-decorators';
import { createForm } from 'rc-form';
import _ from 'lodash';
import FileItem from './FileItem';
import { request } from '../../config';
import { helper } from '../../utils';
import './uploadFiles.less';

let COUNT = 0;
const EMPTY_LIST = [];
const Dragger = Upload.Dragger;
const FormItem = Form.Item;

@createForm()
export default class UploadFiles extends PureComponent {
  static propTypes = {
    attachModelList: PropTypes.array,
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
      formKey: `formKey${COUNT}`,
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
            // message.success(`${info.file.name} file uploaded successfully.`);
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
      this.setState({
        fileList: nextFileList,
        formKey: `formKey${COUNT++}`,
      });
    }
  }

  @autobind
  getFileList(items) {
    const { removeFile } = this.props;
    if (_.isEmpty(items)) {
      return null;
    }
    return items.map(item => (
      <FileItem
        key={`k${COUNT++}`}
        attachName={item.attachName || ''}
        attachUploader={item.attachUploader || ''}
        attachUrl={item.attachUrl || ''}
        onRemoveFile={removeFile}
      />
    ));
  }

  render() {
    const { fileList, uploadPops, formKey } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row>
        <Col span="12">
          <ul id="filelist" className="filelist">
            {this.getFileList(fileList)}
          </ul>
        </Col>
        <Col span="12" className="upload_dv">
          <Form
            layout="vertical"
            key={formKey}
          >
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
          </Form>
        </Col>
      </Row>
    );
  }
}
