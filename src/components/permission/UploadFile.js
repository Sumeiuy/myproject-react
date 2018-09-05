import React, { PureComponent } from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import style from './uploadFile.less';

const maxFileSize = 20971520; // 上传文件上限是20M
export default class UploadFile extends PureComponent {
  static propTypes = {
    fileList: PropTypes.array,
    edit: PropTypes.bool,
    attachment: PropTypes.string,
    type: PropTypes.string.isRequired,
    onEmitEvent: PropTypes.func.isRequired,
    needDefaultText: PropTypes.bool,
  }

  static defaultProps = {
    fileList: [],
    edit: false,
    attachment: '',
    needDefaultText: true,
  }

  constructor() {
    super();
    this.state = {
      fileList: [],
    };
  }

  @autobind
  uploadAttachment(value) {
    console.log('attachment', value);
    this.props.onEmitEvent(this.props.type, value);
  }

  @autobind
  handleBeforeUpload(file) {
    const fileSize = file.size;
    if (fileSize >= maxFileSize) {
      const formatSize = maxFileSize / 1024 / 1024;
      message.error(`上传文件的不能大于${formatSize}M`);
      return false;
    }
    return true;
  }

  render() {
    const uploadProps = {
      attachmentList: this.props.fileList,
      edit: this.props.edit,
      uploadAttachment: this.uploadAttachment,
      attachment: this.props.attachment,
      needDefaultText: this.props.needDefaultText,
      beforeUpload: this.handleBeforeUpload,
      maxFileSize,
    };

    return (
      <div className={style.uploadFile}>
        <InfoTitle head="附件" />
        <CommonUpload {...uploadProps} />
      </div>
    );
  }
}
