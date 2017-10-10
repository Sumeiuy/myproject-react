import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import style from './uploadFile.less';

export default class UploadFile extends PureComponent {
  static propTypes = {
    fileList: PropTypes.array,
    edit: PropTypes.bool,
    attachment: PropTypes.string,
    type: PropTypes.string.isRequired,
    onEmitEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    fileList: [],
    edit: false,
    attachment: '',
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

  render() {
    const uploadProps = {
      attachmentList: this.props.fileList,
      edit: this.props.edit,
      uploadAttachment: this.uploadAttachment,
      attachment: this.props.attachment,
    };

    return (
      <div className={style.uploadFile}>
        <InfoTitle head="附件" />
        <CommonUpload {...uploadProps} />
      </div>
    );
  }
}
