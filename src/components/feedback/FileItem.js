/**
 * @file components/feedback/FileItem.js
 * 上传附件
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { helper } from '../../utils';
import './uploadFiles.less';

const EMPTY_OBJECT = {};
export default class FileItem extends PureComponent {
  static propTypes = {
    fileItem: PropTypes.object.isRequired,
    onRemoveFile: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    const { fileItem = EMPTY_OBJECT } = props;
    this.state = {
      file: fileItem,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { fileItem: nextFile = EMPTY_OBJECT } = nextProps;
    const { fileItem: prevFile = EMPTY_OBJECT } = this.props;
    if (nextFile !== prevFile) {
      this.setState({
        file: nextFile,
      });
    }
  }
  @autobind
  handleClick() {
    const { onRemoveFile } = this.props;
    const { file } = this.state;
    onRemoveFile(file);
  }
  render() {
    const { file } = this.state;
    const empId = helper.getEmpId();
    return (
      <li className={`${file.attachUploader && empId === file.attachUploader ? 'userfile' : 'noUserfile'}`}>
        <a href={file.attachUrl}>{file.attachName}</a>
        <a className="removeFile" onClick={this.handleClick}>X</a>
      </li>
    );
  }
}
