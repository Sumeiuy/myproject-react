/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-13 13:57:32
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-22 14:55:53
 */

import React, { PropTypes, PureComponent } from 'react';
import { Upload, message } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import confirm from '../../common/confirm_';
import Icon from '../../common/Icon';
import { helper } from '../../../utils';
import uploadRequest from '../../../utils/uploadRequest';
import Clickable from '../../../components/common/Clickable';
import './uploader.less';

let count = 0;
const EMPTY_OBJECT = {};
const Dragger = Upload.Dragger;

export default class Uploader extends PureComponent {
  static propTypes = {
    attachModel: PropTypes.object,
    fileKey: PropTypes.string,
    onOperateFile: PropTypes.func,
    onHandleOverview: PropTypes.func,
    onDeleteFile: PropTypes.func,
    originFileName: PropTypes.string,
    totalCount: PropTypes.number,
    isNeedPreview: PropTypes.bool,
    isNeedDelete: PropTypes.bool,
    uploadTitle: PropTypes.string.isRequired,
    uploadTarget: PropTypes.string.isRequired,
  }

  static defaultProps = {
    attachModel: {},
    fileKey: '',
    originFileName: '',
    totalCount: 0,
    onHandleOverview: () => { },
    onDeleteFile: () => { },
    onOperateFile: () => { },
    isNeedPreview: false,
    isNeedDelete: false,
  }

  constructor(props) {
    super(props);
    const { attachModel = EMPTY_OBJECT, fileKey = '', originFileName = '', totalCount = 0 } = props;
    this.state = {
      fList: [],
      lastFile: attachModel,
      fileList: [],
      uploadedFileKey: fileKey,
      upData: {
        empId: helper.getEmpId(),
      },
      isShowUpload: !(attachModel && fileKey),
      isShowError: false,
      originFileName,
      totalCount,
      showUploadList: true,
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

    const { status, response, name } = currentFile;
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
          const { resultData: lastData = {} } = lastResponse || {};
          const { fileName, totalCustNum } = lastData;
          this.setState({
            lastFile,
            uploadedFileKey: fileName,
            totalCount: totalCustNum,
          });
          onOperateFile({
            currentFile: lastFile,
            uploadedFileKey: lastData,
            originFileName: name,
            totalCount: totalCustNum,
          });
        }
      }
    }

    if (status === 'done') {
      const { fileName, totalCustNum } = resultData;
      message.success('文件上传成功', 2);
      onOperateFile({
        currentFile,
        uploadedFileKey: fileName,
        originFileName: name,
        totalCount: totalCustNum,
      });
      this.setState({
        lastFile: currentFile,
        uploadedFileKey: fileName,
        // 不展示upload组件
        isShowUpload: false,
        isShowError: false,
        originFileName: name,
        totalCount: totalCustNum,
        showUploadList: true,
      });
    }

    if (status === 'error') {
      const errorMsg = _.isEmpty(msg) ? '文件上传失败' : msg;
      message.error(`${errorMsg}.`, 2);
      this.setState({
        isShowError: true,
        showUploadList: false,
      });
    }
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
    confirm({
      type: 'delete',
      onOkHandler: this.handleDeleteConfirm,
      onCancelHandler: this.handleCancel,
    });
  }

  @autobind
  createUpload() {
    const { uploadTitle, uploadTarget } = this.props;
    const { upData, fileList, showUploadList } = this.state;
    const uploadKey = `uploadKey${count++}`;
    return (
      <Dragger
        key={uploadKey}
        name="file"
        defaultFileList={fileList}
        data={upData}
        action={uploadTarget}
        onRemove={this.handleFileRemove}
        onChange={this.handleFileChange}
        customRequest={this.fileCustomRequest}
        showUploadList={showUploadList}
      >
        <div className="upload_txt">
          + {uploadTitle}
        </div>
      </Dragger>
    );
  }

  @autobind
  handleDeleteConfirm() {
    const { onDeleteFile } = this.props;
    this.setState({
      lastFile: {},
      uploadedFileKey: '',
      isShowUpload: true,
      // 删除完毕之后，打开上传进度开关
      showUploadList: true,
    });
    onDeleteFile();
  }

  @autobind
  handleCancel() {
    console.log('cancel');
  }

  @autobind
  handleDeleteFile() {
    confirm({
      type: 'delete',
      onOkHandler: this.handleDeleteConfirm,
      onCancelHandler: this.handleCancel,
    });
  }

  @autobind
  handlePreview() {
    const { onHandleOverview } = this.props;
    const { uploadedFileKey } = this.state;
    onHandleOverview(uploadedFileKey);
  }

  render() {
    const { isNeedDelete, isNeedPreview } = this.props;
    const { isShowUpload, isShowError, originFileName } = this.state;
    return (
      <div>
        <div className="uploadBox">
          {
            isShowUpload ? this.createUpload() : null
          }
          {
            !isShowUpload ? <div className="previewSection">
              <div className="uploadedFile">
                {
                  originFileName.indexOf('csv') !== -1 ?
                    <Icon className="csvIcon" type="CSV" /> :
                    <Icon className="excelIcon" type="excel" />
                }
                <span>{originFileName}</span>
              </div>
              {
                isNeedPreview ? (
                  <Clickable
                    onClick={this.handlePreview}
                    eventName="/click/uploader"
                    payload={{ test: 'overview' }}
                  >
                    <div className="overview">预览</div>
                  </Clickable>
                ) : null
              }
              {
                isNeedDelete ? (
                  <Clickable
                    onClick={this.handleDeleteFile}
                    eventName="/click/uploader"
                    payload={{ test: 'delete' }}
                  >
                    <div className="delete">删除</div>
                  </Clickable>
                ) : null
              }
            </div> : null
          }
        </div>
        {
          (isShowUpload && isShowError) ?
            <div className="errorInfo">导入数据失败，上传格式不正确！</div> : null
        }
      </div>
    );
  }
}
