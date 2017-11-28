/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-13 13:57:32
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-28 20:33:04
 */

import React, { PropTypes, PureComponent } from 'react';
import { Upload, message } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import reqwest from 'reqwest';
import confirm from '../../common/confirm_';
import Icon from '../../common/Icon';
import Button from '../../common/Button';
import { apiCreator as api } from '../../../utils';
import { emp } from '../../../helper';
import uploadRequest from '../../../utils/uploadRequest';
import './uploader.less';

let count = 0;
const EMPTY_OBJECT = {};
const Dragger = Upload.Dragger;

const beforeUploadPostUrl = '/groovynoauth/fsp/campaign/mot/queryCustUuid';

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
    upData: PropTypes.object,
    beforeUpload: PropTypes.func,
    custUuid: PropTypes.string.isRequired,
    isUploadFileManually: PropTypes.bool,
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
    upData: {},
    beforeUpload: () => { },
    isUploadFileManually: false,
  }

  constructor(props) {
    super(props);
    const {
      attachModel = EMPTY_OBJECT,
      fileKey = '',
      originFileName = '',
      totalCount = 0,
      upData,
    } = props;
    this.state = {
      lastFile: attachModel,
      fileList: [],
      uploadedFileKey: fileKey,
      upData: {
        empId: emp.getId(),
      },
      isShowUpload: !(attachModel && fileKey),
      isShowError: false,
      originFileName,
      totalCount,
      showUploadList: true,
      originUpData: upData,
      custUuid: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachModel: nextFile = EMPTY_OBJECT, custUuid } = nextProps;
    const { attachModel: prevFile = EMPTY_OBJECT } = this.props;
    if (nextFile !== prevFile) {
      this.setState({
        lastFile: nextFile,
      });
    }

    this.setState({
      upData: {
        ...this.state.upData,
        attachment: custUuid,
      },
    });
  }

  @autobind
  fileCustomRequest(option) {
    return uploadRequest(option);
  }

  @autobind
  handleFileChange(info) {
    const { onOperateFile } = this.props;
    const { upData, custUuid } = this.state;
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
      const { fileName, totalCustNum, attachment = '' } = resultData;
      message.success('文件上传成功', 2);
      onOperateFile({
        currentFile,
        uploadedFileKey: fileName,
        originFileName: name,
        totalCount: totalCustNum,
        attachment,
        custUuid,
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
        upData: {
          ...upData,
          attachment,
        },
        fileList: [...fileList, currentFile],
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
  handleUpload() {
    const { fileList, upData: { attachment, empId }, custUuid } = this.state;
    const { uploadTarget, onOperateFile } = this.props;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('attachment', attachment);
    formData.append('empId', empId);

    this.setState({
      uploading: true,
    });

    reqwest({
      url: uploadTarget,
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          // fileList: [],
          uploading: false,
        });
        onOperateFile({
          currentFile: fileList,
          attachment,
          custUuid,
        });
        message.success('upload successfully.');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  }

  /**
   * 在文件上传之前
   * @param {*} file 文件
   */
  @autobind
  handleBeforeUpload(file) {
    const { fileList, custUuid } = this.state;
    const { isUploadFileManually } = this.props;
    if (isUploadFileManually) {
      if (_.isEmpty(custUuid)) {
        const { upData } = this.state;
        api().post(beforeUploadPostUrl, {
          empId: emp.getEmpId(),
        }).then((res) => {
          console.log(res);
          const { resultData } = res;
          this.setState({
            upData: {
              ...upData,
              attachment: resultData,
            },
            custUuid: resultData,
          });
        });
      }
      this.setState({
        fileList: [...fileList, file],
      });
      return false;
    }

    return true;
  }

  @autobind
  createUpload() {
    const { uploadTitle, uploadTarget, isUploadFileManually } = this.props;
    const { upData, fileList, showUploadList } = this.state;
    const uploadKey = `uploadKey${count++}`;
    let uploadProps = {};
    if (isUploadFileManually) {
      uploadProps = {
        fileList,
      };
    }

    return (
      <Dragger
        key={uploadKey}
        name="file"
        data={upData}
        action={uploadTarget}
        onRemove={this.handleFileRemove}
        onChange={this.handleFileChange}
        customRequest={this.fileCustomRequest}
        showUploadList={showUploadList}
        beforeUpload={this.handleBeforeUpload}
        {...uploadProps}
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

  /**
   * 清除当前上传的文件列表和历史记录
   */
  @autobind
  clearUploadFile() {
    const { originUpData } = this.state;
    this.setState({
      lastFile: {},
      uploadedFileKey: '',
      isShowUpload: true,
      // 删除完毕之后，打开上传进度开关
      showUploadList: true,
      upData: originUpData,
      custUuid: '',
    });
  }

  render() {
    const { isNeedDelete, isNeedPreview, isUploadFileManually } = this.props;
    const { isShowUpload, isShowError, originFileName, uploading, fileList } = this.state;
    return (
      <div>
        <div className="uploadBox">
          {
            isShowUpload ? this.createUpload() : null
          }
          {
            !isUploadFileManually ? null :
            <Button
              className="uploadBtn"
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
            >
              {uploading ? 'Uploading' : 'Upload'}
            </Button>
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
                isNeedPreview ? <div
                  className="overview"
                  onClick={this.handlePreview}
                >预览</div>
                  : null
              }
              {
                isNeedDelete ? <div
                  className="delete"
                  onClick={this.handleDeleteFile}
                >删除</div> : null
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
