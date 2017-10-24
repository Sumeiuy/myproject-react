/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-13 13:57:32
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-16 10:00:34
 */

import React, { PropTypes, PureComponent } from 'react';
import { Upload, message } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import confirm from '../../common/Confirm/confirm';
import Button from '../../common/Button';
import { request } from '../../../config';
import { helper } from '../../../utils';
import uploadRequest from '../../../utils/uploadRequest';
import './upload.less';

let count = 0;
const EMPTY_LIST = [];
const Dragger = Upload.Dragger;
// const confirm = Modal.confirm;

export default class UploadFile extends PureComponent {
  static propTypes = {
    attachModelList: PropTypes.array,
    onOperateFile: PropTypes.func.isRequired,
    onHandleOverview: PropTypes.func,
  }

  static defaultProps = {
    attachModelList: EMPTY_LIST,
    onHandleOverview: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      fList: [],
      upData: {
        empId: helper.getEmpId(),
      },
      delData: {},
      // isShowDeleteConfirm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachModelList: nextFileList = EMPTY_LIST } = nextProps;
    const { attachModelList: prevFileList = EMPTY_LIST } = this.props;
    if (nextFileList !== prevFileList) {
      let fileList = [];
      if (nextFileList && nextFileList.length > 0) {
        const filesList = this.removeEmpty(nextFileList);
        fileList = filesList.map((item, i) => ({
          uid: `${item.attachUploader || ''}-server-files${i}`,
          name: item.attachName,
          status: 'done',
          url: `${request.prefix}/file/${item.attachUrl}`,
          thumbUrl: item.attachUrl,
        }));
      }
      this.setState({
        fList: fileList,
      });
    }
  }

  @autobind
  removeEmpty(obj) {
    const objs = obj;
    Object.keys(objs).forEach(key => (_.isEmpty(objs[key]) || objs[key] === 'undefined')
      && delete objs[key]);
    return objs;
  }

  @autobind
  fileCustomRequest(option) {
    return uploadRequest(option);
  }

  @autobind
  fileOnChange({ file }) {
    // {
    //    uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //    name: 'xx.png'   // 文件名
    //    status: 'done', // 状态有：uploading done error removed
    //    response: '{"status": "success"}', // 服务端响应内容
    // }
    const status = file.status;
    const response = file.response || {};
    const { resultData, msg } = response;
    const { onOperateFile } = this.props;
    if (status === 'uploading') {
      console.log('uploading');
    }
    if (status === 'removed') {
      console.log('removed');
    }
    if (status === 'done') {
      message.success('文件上传成功', 1);
      onOperateFile(resultData, 'ADD');
    } else if (status === 'error') {
      const errorMsg = _.isEmpty(msg) ? '文件上传失败' : msg;
      message.error(`${errorMsg}.`);
    }
    return true;
  }

  @autobind
  fileOnRemove(file) {
    const uid = file.uid || '';
    if (!_.isEmpty(uid) && !file.error) {
      let delData = {};
      // 具体deletData等接口联调
      // TODO
      delData = {
        attachName: file.name,
        attachUrl: file.thumbUrl,
      };
      this.showConfirm(delData);
    } else if (file.error) {
      // 删除错误的文件，不用提示是否删除
      return true;
    } else if (_.isEmpty(uid)) {
      return false;
    } else {
      message.warning(`您无权限删除文件${file.name}`);
    }

    return false;
  }

  @autobind
  showConfirm(delData) {
    this.setState({
      delData,
      // isShowDeleteConfirm: true,
    });
    confirm({
      onOk: this.deleteFile,
    });
  }

  @autobind
  createUpload() {
    const { fList = EMPTY_LIST, upData } = this.state;
    const uploadKey = `uploadKey${count++}`;
    return (
      <Dragger
        key={uploadKey}
        name="file"
        // 上传所需要的参数
        data={upData}
        action={`${request.prefix}/file/feedbackFileUpload`} //  khxfFileUpload
        defaultFileList={fList}
        onRemove={this.fileOnRemove}
        onChange={this.fileOnChange}
        customRequest={this.fileCustomRequest}
      >
        <div className="upload_txt">
          + 上传附件
        </div>
      </Dragger>
    );
  }

  @autobind
  deleteFile() {
    const { onOperateFile } = this.props;
    const { delData } = this.state;
    onOperateFile(delData, 'DELETE');
    // this.setState({
    //   isShowDeleteConfirm: false,
    // });
  }

  // @autobind
  // cancelDeleteFile() {
  //   this.setState({
  //     isShowDeleteConfirm: false,
  //   });
  // }

  render() {
    // const { isShowDeleteConfirm } = this.state;
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
            onClick={onHandleOverview}
          >预览</Button>
        </div>
        {/*
          isShowDeleteConfirm ?
            <Confirm
              type="delete"
              onCancelHandler={this.cancelDeleteFile}
              onOkHandler={this.deleteFile}
            /> : null
        */}
      </div>
    );
  }
}
