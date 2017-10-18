/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-13 13:57:32
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-18 09:52:35
 */

import React, { PropTypes, PureComponent } from 'react';
import { Upload, message } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Confirm from '../../common/Confirm';
import Button from '../../common/Button';
import { request } from '../../../config';
import { helper } from '../../../utils';
import uploadRequest from '../../../utils/uploadRequest';
import './uploader.less';

let count = 0;
// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const Dragger = Upload.Dragger;
// const confirm = Modal.confirm;

export default class Uploader extends PureComponent {
  static propTypes = {
    attachModel: PropTypes.object,
    fileKey: PropTypes.string,
    onOperateFile: PropTypes.func.isRequired,
    onHandleOverview: PropTypes.func,
  }

  static defaultProps = {
    attachModel: {},
    onHandleOverview: () => { },
    fileKey: '',
  }

  constructor(props) {
    super(props);
    const { attachModel = EMPTY_OBJECT, fileKey = '' } = props;
    this.state = {
      fList: [],
      lastFile: attachModel,
      fileList: [],
      uploadedFileKey: fileKey,
      upData: {
        empId: helper.getEmpId(),
      },
      isShowDeleteConfirm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachModel: nextFile = EMPTY_OBJECT } = nextProps;
    const { attachModel: prevFile = EMPTY_OBJECT } = this.props;
    if (nextFile !== prevFile) {
      this.setState({
        lastFile: nextFile,
      });
    }
  }

  @autobind
  fileCustomRequest(option) {
    return uploadRequest(option);
  }

  @autobind
  handleFileChange(info) {
    const { onOperateFile } = this.props;
    // 当前列表
    const fileList = info.fileList;
    // 当前操作upload项
    const currentFile = info.file;
    // {
    //    uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //    name: 'xx.png'   // 文件名
    //    status: 'done', // 状态有：uploading done error removed
    //    response: '{"status": "success"}', // 服务端响应内容
    // }

    //  {
    //   "lastModified": 1247549551674,
    //   "lastModifiedDate": "2009-07-14T05:32:31.674Z",
    //   "name": "Lighthouse.jpg",
    //   "size": 561276,
    //   "type": "image/jpeg",
    //   "uid": "rc-upload-1508129119030-2",
    //   "response": {
    //       "code": "0",
    //       "msg": "OK",
    //       "resultData": {
    //           "attachName": "Lighthouse.jpg",
    //           "attachUrl": "10dc4bd5-2a16-408f-a380-bfb077b65e59.jpg",
    //           "attachUploader": "002332"
    //       }
    //   },
    //   "percent": 100,
    //   "originFileObj": {
    //       "uid": "rc-upload-1508129119030-2"
    //   },
    //   "status": "done"
    // }

    const { status, response } = currentFile;
    const { resultData, msg } = response || {};

    if (status === 'uploading') {
      console.log('uploading');
    }

    if (status === 'removed') {
      console.log('removed');
      // 移除file
      // 保留最后一个file在state里面
      if (!_.isEmpty(fileList)) {
        let newFileList = fileList;
        // 过滤掉错误的fileList
        newFileList = newFileList.filter(file => !_.isEmpty(file.error));
        if (!_.isEmpty(newFileList)) {
          const lastFile = newFileList[newFileList.length - 1];
          const { response: lastResponse } = lastFile;
          const { resultData: lastData } = lastResponse || {};
          this.setState({
            lastFile,
            uploadedFileKey: lastData,
          });
          onOperateFile({
            currentFile: lastFile,
            uploadedFileKey: lastData,
          });
        }
      }
    }

    if (status === 'done') {
      message.success('文件上传成功', 2);
      onOperateFile({
        currentFile,
        uploadedFileKey: resultData,
      });
      this.setState({
        lastFile: currentFile,
        uploadedFileKey: resultData,
      });
    }

    if (status === 'error') {
      const errorMsg = _.isEmpty(msg) ? '文件上传失败' : msg;
      message.error(`${errorMsg}.`, 2);
    }

    // this.setState({
    //   fileList,
    // });
  }

  @autobind
  handleFileRemove(file) {
    console.log(file);
    const { error } = file;
    if (!error) {
      this.showConfirm();
    }

    return true;
  }

  @autobind
  showConfirm() {
    this.setState({
      isShowDeleteConfirm: true,
    });
  }

  @autobind
  createUpload() {
    const { upData, fileList } = this.state;
    const uploadKey = `uploadKey${count++}`;
    return (
      <Dragger
        key={uploadKey}
        name="file"
        defaultFileList={fileList}
        data={upData}
        action={`${request.prefix}/file/khxfFileUpload`} //  feedbackFileUpload
        onRemove={this.handleFileRemove}
        onChange={this.handleFileChange}
        customRequest={this.fileCustomRequest}
      >
        <div className="upload_txt">
          + 上传附件
        </div>
      </Dragger>
    );
  }

  @autobind
  handleDelete() {
    this.setState({
      isShowDeleteConfirm: false,
    });
  }

  @autobind
  handleCancel() {
    this.setState({
      isShowDeleteConfirm: false,
    });
  }

  render() {
    const { isShowDeleteConfirm, uploadedFileKey } = this.state;
    const { onHandleOverview } = this.props;
    return (
      <div className="uploadBox">
        {this.createUpload()}
        {
          /*
          <div className="downloadSection">
          <a className="downloadLnk" download="">下载模板</a>
          </div>
          */
        }
        <div className="overviewBtnSection">
          <Button
            className="overviewBtn"
            type="default"
            onClick={() => onHandleOverview(uploadedFileKey)}
          >预览</Button>
        </div>
        {
          isShowDeleteConfirm ?
            <Confirm
              type="delete"
              onCancelHandler={this.handleCancel}
              onOkHandler={this.handleDelete}
            /> : null
        }
      </div>
    );
  }
}
