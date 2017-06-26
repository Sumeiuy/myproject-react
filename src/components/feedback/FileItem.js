/**
 * @file components/feedback/FileItem.js
 * 上传附件
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { helper } from '../../utils';
import './uploadFiles.less';

export default class FileItem extends PureComponent {
  static propTypes = {
    attachName: PropTypes.string.isRequired,
    attachUploader: PropTypes.string.isRequired,
    attachUrl: PropTypes.string.isRequired,
    onRemoveFile: PropTypes.func.isRequired,
  }

  @autobind
  handleClick() {
    const { attachUploader, attachName, attachUrl, onRemoveFile } = this.props;
    const file = { attachUploader, attachName, attachUrl };
    onRemoveFile(file);
  }
  render() {
    const { attachUploader, attachName, attachUrl } = this.props;
    const empId = helper.getEmpId();
    return (
      <li className={`${attachUploader && empId === attachUploader ? 'userfile' : 'noUserfile'}`}>
        <a href={attachUrl}>{attachName}</a>
        <a className="removeFile" onClick={this.handleClick}>X</a>
      </li>
    );
  }
}
