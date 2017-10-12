/*
* @Description: 合作合约 附件上传
* @Author: XuWenKang
* @Date:   2017-09-26 10:51:52
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-11 14:15:32
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import style from './uploadFile.less';

export default class UploadFile extends PureComponent {
  static propTypes = {
    fileList: PropTypes.array,
    edit: PropTypes.bool,
    uploadAttachment: PropTypes.func,
  }

  static defaultProps = {
    fileList: [],
    edit: false,
    uploadAttachment: () => {},
  }

  constructor() {
    super();
    this.state = {
      fileList: [],
    };
  }

  // componentWillMount() {
    // this.setState({ fileList: this.props.fileList });
  // }

  render() {
    const { fileList, edit, uploadAttachment } = this.props;
    return (
      <div className={style.uploadFile}>
        <InfoTitle head="附件" />
        <CommonUpload
          attaches={fileList}
          edit={edit}
          uploadAttachment={uploadAttachment}
        />
      </div>
    );
  }
}
