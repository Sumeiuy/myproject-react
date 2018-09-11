/*
 * @Author: zhangjun
 * @Date: 2018-06-13 14:32:27
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-21 10:13:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import CommonUpload from '../common/biz/CommonUpload';
import { data } from '../../helper';
import style from './uploadFile.less';

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
      // 用于重新渲染上传组件的key
      uploadKey: data.uuid(),
    };
  }

  @autobind
  uploadAttachment(value) {
    this.props.onEmitEvent({ [this.props.type]: value });
  }

  render() {
    const uploadProps = {
      key: this.state.uploadKey,
      attachmentList: this.props.fileList,
      edit: this.props.edit,
      uploadAttachment: this.uploadAttachment,
      attachment: this.props.attachment,
      needDefaultText: this.props.needDefaultText,
    };

    return (
      <div className={style.uploadFile}>
        <CommonUpload {...uploadProps} />
      </div>
    );
  }
}
