/**
 * @file components/feedback/FileItem.js
 * 上传附件
 * @author yangquanjian
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';
import { helper } from '../../utils';
import { request } from '../../config';
import Icon from '../../components/common/Icon';
import './uploadFiles.less';

const confirm = Modal.confirm;

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
    confirm({
      title: '您确定要删除该文件?',
      content: '点击确定删除该文件',
      onOk() {
        onRemoveFile(file);
      },
    });
  }
  render() {
    const { attachUploader, attachName, attachUrl } = this.props;
    const empId = helper.getEmpId();
    return (
      <li className={`${attachUploader && empId === attachUploader ? 'userfile' : 'noUserfile'}`}>
        <a href={`${request.prefix}/file/${attachUrl}`} title="点击下载" download={attachName}>{attachName}</a>
        <a className="removeFile" onClick={this.handleClick} title="点击删除">
          <Icon type="close" />
        </a>
      </li>
    );
  }
}
