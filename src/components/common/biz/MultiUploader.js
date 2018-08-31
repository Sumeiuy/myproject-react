/*
 * @Author: LiuJianShu
 * @Date: 2017-09-22 15:02:49
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-02-07 09:52:43
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Progress, Popconfirm, Upload, message, Popover } from 'antd';
import { autobind } from 'core-decorators';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'dva';

import Button from '../Button';
import { request } from '../../../config';
import { emp } from '../../../helper';
import styles from './multiUploader.less';
import Icon from '../Icon';
import logable from '../../../decorators/logable';

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  deleteAttachmentLoading: state.loading.effects['channelsTypeProtocol/deleteAttachment'],
});

const mapDispatchToProps = {
  // 删除附件
  deleteAttachment: fetchDataFunction(true, 'channelsTypeProtocol/deleteAttachment', true),
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class MultiUpload extends PureComponent {
  static propTypes = {
    // 删除附件方法
    deleteAttachment: PropTypes.func.isRequired,
    // 删除事件的状态
    deleteAttachmentLoading: PropTypes.bool,
    // key 值
    key: PropTypes.string,
    // 编辑状态
    edit: PropTypes.bool,
    // 上传组件的 type
    type: PropTypes.string,
    // 标题
    title: PropTypes.string,
    // 是否必须
    required: PropTypes.bool,
    // 每个单子对应的唯一附件表 ID，默认为 ''
    attachment: PropTypes.string,
    // 组件的元素 list
    attachmentList: PropTypes.array,
    // 上传成功后回调方法
    uploadCallback: PropTypes.func,
    // 删除成功后回调方法
    deleteCallback: PropTypes.func,
    showDelete: PropTypes.bool,
    // 上传文件大小限制，默认20Mb
    maxSize: PropTypes.number,
    // 上传限制数量个数
    limitCount: PropTypes.number,
  }

  static defaultProps = {
    key: '',
    edit: false,
    type: '',
    title: '',
    required: false,
    attachment: '',
    attachmentList: [],
    uploadCallback: () => {},
    deleteCallback: () => {},
    deleteAttachmentLoading: false,
    showDelete: true,
    maxSize: 20,
    limitCount: 9999,
  }

  constructor(props) {
    super(props);
    const { attachmentList, attachment, limitCount } = props;
    this.state = {
      empId: emp.getId(), // empId
      percent: 0, // 上传百分比
      status: 'active', // 上传状态
      statusText: '', // 上传状态对应文字
      file: {}, // 当前上传的文件
      fileList: attachmentList, // 文件列表
      oldFileList: attachmentList, // 旧的文件列表
      attachment, // 上传后的唯一 ID
      isShowUploadBtn: limitCount > attachmentList.length,  // 是否显示上传按钮
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachment: preAT } = this.props;
    const { attachment: nextAT, attachmentList, limitCount } = nextProps;
    const { attachment } = this.state;
    if (preAT !== nextAT && nextAT !== attachment) {
      this.setState({
        fileList: attachmentList, // 文件列表
        oldFileList: attachmentList, // 旧的文件列表
        attachment: nextAT, // 上传后的唯一 ID
        // 如果限制并且新数组的 length 小于限制的个数
        isShowUploadBtn: limitCount > attachmentList.length,
      });
    }
  }

  // 上传事件
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上传附件' } })
  onChange(info) {
    const { type, uploadCallback, limitCount } = this.props;
    const uploadFile = info.file;
    this.setState({
      percent: info.file.percent,
      fileList: info.fileList,
      file: uploadFile,
      statusText: '上传中',
    });
    if (uploadFile.response && uploadFile.response.code) {
      if (uploadFile.response.code === '0') {
        // 上传成功的返回值 0
        const data = uploadFile.response.resultData;
        this.setState({
          status: 'success',
          statusText: '上传完成',
          fileList: data.attaches,
          oldFileList: data.attaches,
          attachment: data.attachment,
          isShowUploadBtn: limitCount > data.attaches.length,
        }, () => {
          uploadCallback(type, data.attachment);
        });
      } else {
        // 上传失败的返回值 MAG0005
        this.setState({
          status: 'active',
          fileList: this.state.oldFileList,
          file: {},
          percent: 0,
        });
        message.error(uploadFile.response.msg);
      }
    }
  }

  // 删除事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '删除附件',
      value: '$args[0]',
    },
  })
  onRemove(attachId) {
    const { type, deleteAttachment, deleteCallback } = this.props;
    const { empId, attachment, fileList } = this.state;
    const deleteObj = {
      empId,
      attachId,
      attachment,
    };
    deleteAttachment(deleteObj).then(() => {
      const { limitCount } = this.props;
      const newFileList = _.cloneDeep(fileList);
      _.remove(newFileList, o => o.attachId === attachId);
      this.setState({
        fileList: newFileList, // 文件列表
        isShowUploadBtn: limitCount > newFileList.length,
      }, () => {
        deleteCallback(type);
      });
    });
  }

  @autobind
  findContainer() {
    return this.fileListMultiMain;
  }

  // 清空数据
  @autobind
  resetUpload() {
    this.setState({
      percent: 0, // 上传百分比
      status: 'active', // 上传状态
      statusText: '', // 上传状态对应文字
      file: {}, // 当前上传的文件
      fileList: [], // 文件列表
      oldFileList: [], // 旧的文件列表
      attachment: '', // 上传后的唯一 ID
      isShowUploadBtn: true,  // 显示上传按钮
    });
  }

  @autobind
  beforeUpload(file) {
    const { maxSize } = this.props;
    const { size } = file;
    if (size > (maxSize * 1024 * 1024)) {
      message.error(`文件大小不能超过 ${maxSize} Mb`);
      return false;
    }
    return true;
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() {}

  render() {
    const {
      empId,
      file,
      attachment,
      fileList,
      percent,
      status,
      statusText,
      isShowUploadBtn,
    } = this.state;
    const { edit, title, required, showDelete } = this.props;
    const uploadProps = {
      data: {
        empId,
        file,
        attachment,
      },
      action: `${request.prefix}/file/ceFileUpload2`,
      headers: {
        accept: '*/*',
      },
      onChange: this.onChange,
      showUploadList: false,
      fileList,
      beforeUpload: this.beforeUpload,
    };

    const uploadElement = (edit && isShowUploadBtn) ?
      (<Upload {...uploadProps} {...this.props}>
        <Button className={styles.commonUploadBtn}>
          <Icon type="fujian1" />上传附件
        </Button>
      </Upload>)
      :
      null;

    let fileListElement;
    if (fileList && fileList.length) {
      fileListElement = (
        <div className={`${styles.fileList} fileList`}>
          {
            fileList.map((item, index) => {
              const fileName = item.name;
              const popoverHtml = (
                <div className={styles.filePop} key={item.attachId}>
                  <h3 className="clearfix">
                    <Icon type="fujian1" />
                    <span className={styles.popFileName}>{fileName}</span>
                    <span className={styles.btnBox}>
                      {
                        edit && showDelete && emp.getId() === item.creator ?
                          <em>
                            <Popconfirm
                              placement="top"
                              onConfirm={() => this.onRemove(item.attachId)}
                              okText="是"
                              cancelText="否"
                              title={'是否删除该附件？'}
                              key={item.attachId}
                            >
                              <Icon type="shanchu" />
                            </Popconfirm>
                            <i className={styles.cutline} />
                          </em>
                          :
                          null
                      }
                      <em>
                        <a
                          href={`${request.prefix}/file/ceFileDownload2?attachId=${item.attachId}&empId=${empId}&filename=${item.name}`}
                          onClick={this.handleDownloadClick}
                        >
                          <Icon type="xiazai2" />
                        </a>
                      </em>
                    </span>
                  </h3>
                  <h3 className={styles.uploadText}>
                    <span className="fileListItemSize">大小：{`${item.size} KB`}</span>
                    上传人：{item.creator}
                  </h3>
                  <h3 className={styles.uploadTime}>
                    上传于：{moment(item.createTime).format('YYYY-MM-DD')}
                  </h3>
                </div>
              );
              return (
                <div
                  className={styles.fileItem}
                  key={item.attachId}
                >
                  <Popover
                    placement="right"
                    content={popoverHtml}
                    trigger="hover"
                    mouseLeaveDelay={0.3}
                    getPopupContainer={this.findContainer}
                  >
                    <p className={styles.fileItemText} title={fileName}>
                      <Icon type="fujian" />
                      <span className={styles.fileName}>{fileName}</span>
                    </p>
                  </Popover>
                  <Popover
                    placement="top"
                    content={statusText}
                    trigger="hover"
                    arrowPointAtCenter
                  >
                    {
                      (index === fileList.length - 1 && Number(percent) !== 0) ?
                        <Progress
                          percent={Number.parseInt(percent, 10)}
                          strokeWidth={4}
                          status={status}
                        />
                        :
                        null
                    }
                  </Popover>
                </div>
              );
            })
          }
          <div className={styles.fileUploadItem}>
            { uploadElement }
          </div>
        </div>
      );
    } else {
      fileListElement = (<div className={`${styles.fileList} fileList`}>
        <div
          className={styles.noFile}
        >
          <Icon type="fujian" />
          <span className={styles.fileName}>暂未上传</span>
        </div>
        <div className={styles.fileUploadItem}>
          { uploadElement }
        </div>
      </div>);
    }
    return (
      <div
        className={`${styles.fileListMultiMain} fileListMultiMain`}
        ref={fileListMultiMain => this.fileListMultiMain = fileListMultiMain}
      >
        {
          _.isEmpty(title) ?
            null
            :
            <h3 className={styles.title}>{title}{required ? '(必传)' : null}</h3>
        }
        { fileListElement }
      </div>
    );
  }
}
