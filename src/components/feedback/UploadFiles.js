/**
 * @file components/feedback/UploadFiles.js
 * 上传附件
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, message, Upload } from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import './uploadFiles.less';
import { helper } from '../../utils';

// const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const Dragger = Upload.Dragger;
export default class UploadFiles extends PureComponent {
  static propTypes = {
    attachModelList: PropTypes.array,
    userId: PropTypes.string,
  }
  static defaultProps = {
    attachModelList: EMPTY_LIST,
    userId: '002332',
  }
  constructor(props) {
    super(props);
    this.state = {
      uploadPops: {
        name: 'file',
        multiple: true,
        showUploadList: false,
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
      fileList: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { attachModelList: nextFileList = EMPTY_LIST } = nextProps;
    const { attachModelList: prevFileList = EMPTY_LIST } = this.props;
    if (nextFileList !== prevFileList) {
      this.setState({
        fileList: nextFileList,
      });
    }
  }

  getFileList(item) {
    const userId = helper.getEmpId();
    if (_.isEmpty(item)) {
      return null;
    }
    return item.map(i =>
      <li className={`${i.attachUploader && userId === i.attachUploader ? 'userfile' : 'noUserfile'}`}>
        <a href={i.attachUrl}>{i.attachName}</a>
        <a className="removeFile">X</a>
      </li>,
    );
  }

  render() {
    const { fileList } = this.state;

    return (
      <Row>
        <Col span="12">
          <ul id="filelist" className="filelist">
            {this.getFileList(fileList)}
          </ul>
        </Col>
        <Col span="12">
          <div className="upload_dv">
            <Dragger {...this.state.uploadPos}>
              <div className="upload_txt">
                + 上传附件
              </div>
            </Dragger>
          </div>
        </Col>
      </Row>
    );
  }
}
