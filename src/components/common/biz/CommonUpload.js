/*
 * @Author: LiuJianShu
 * @Date: 2017-09-22 15:02:49
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-15 10:06:38
 */
/**
 * 常用说明
 * 参数             类型         说明
 * attaches         string      附件列表
 * attachment       boolean     上传附件必须的 ID
 * fileRemove       function    删除附件
 * 其他参数与 Antd.Modal 相同，具体见下方链接
 * https://ant.design/components/upload-cn/
 * 示例
 <CommonUpload
   attaches: [{
      creator: '002332',
      attachId: '{6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
      name: '新建文本文档 (3).txt',
      size: '0',
      createTime: '2017/09/12 13:37:45',
      downloadURL: '',
      realDownloadURL: '',
    }],
    attachment: 'dkdjk-ieidop-kldlkd-bndnbjd',
    fileRemove: this.fileRemove,
  />
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
import styles from './commonUpload.less';
import Icon from '../Icon';
import logable from '../../../decorators/logable';

// const EMPTY_OBJECT = {};
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  deleteAttachmentList: state.app.deleteAttachmentList,
  deleteAttachmentLoading: state.loading.effects['app/deleteAttachment'],
});

const mapDispatchToProps = {
  // 删除附件
  deleteAttachment: fetchDataFunction(true, 'app/deleteAttachment'),
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class CommonUpload extends PureComponent {
  static propTypes = {
    // 删除附件方法
    deleteAttachment: PropTypes.func,
    // 上传附件方法
    uploadAttachment: PropTypes.func,
    // 删除成功后回调方法
    deleteCallback: PropTypes.func,
    // 每个单子对应的唯一附件表 ID，默认为 ''
    attachment: PropTypes.string,
    attachmentList: PropTypes.array,
    edit: PropTypes.bool,
    // 是否需要默认文字-“暂无附件”，默认为 true
    needDefaultText: PropTypes.bool,
    deleteAttachmentList: PropTypes.array,
    deleteAttachmentLoading: PropTypes.bool,
    // 标题
    title: PropTypes.string,
    maxFileSize: PropTypes.number,
    // 是否是假删除
    isFalseDelete: PropTypes.bool,
    // 假删除方法
    onFalseDelete: PropTypes.func,
  }

  static defaultProps = {
    deleteAttachment: _.noop,
    uploadAttachment: _.noop,
    attachment: '',
    deleteAttachmentList: [],
    attachmentList: [],
    edit: false,
    needDefaultText: true,
    deleteAttachmentLoading: false,
    title: '',
    // 最大上传文件限制，单位 MB
    maxFileSize: 20,
    // 删除成功后回调方法
    deleteCallback: _.noop,
    // 是否是假删除
    isFalseDelete: false,
    // 假删除方法
    onFalseDelete: _.noop,
  }

  constructor(props) {
    super(props);
    const { attachmentList, attachment } = props;
    this.state = {
      empId: emp.getId(), // empId
      percent: 0, // 上传百分比
      status: 'active', // 上传状态
      statusText: '', // 上传状态对应文字
      file: {}, // 当前上传的文件
      fileList: attachmentList, // 文件列表
      oldFileList: attachmentList, // 旧的文件列表
      attachment, // 上传后的唯一 ID
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      deleteAttachmentLoading: preDAL,
      attachmentList: preAL,
    } = this.props;
    const {
      deleteAttachmentLoading: nextDAL,
      attachmentList: nextAL,
    } = nextProps;
    if (preDAL && !nextDAL) {
      const { deleteAttachmentList } = nextProps;
      // 文件列表
      const fileList = deleteAttachmentList;
      this.setState({
        fileList,
        oldFileList: fileList, // 旧的文件列表
        percent: 0,
      });
    }
    if (!_.isEqual(preAL, nextAL)) {
      this.setState({
        fileList: nextAL, // 文件列表
      });
    }
  }

  // 上传事件
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上传附件' } })
  onChange(info) {
    const { uploadAttachment, maxFileSize } = this.props;
    const uploadFile = info.file;
    const fileSize = uploadFile.size;
    if (fileSize === 0) {
      message.error('文件大小不能为 0');
      return;
    }
    // 文件上传不能大于maxFileSize
    if (fileSize >= (maxFileSize * 1024 * 1024)) {
      message.error(`文件大小不能超过 ${maxFileSize} MB`);
      return;
    }
    this.setState({
      percent: info.file.percent,
      fileList: info.fileList,
      file: uploadFile,
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
        }, uploadAttachment(data.attachment, data.attaches));
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
    const { deleteAttachment, isFalseDelete, onFalseDelete } = this.props;
    const { empId, attachment } = this.state;
    const deleteObj = {
      empId,
      attachId,
      attachment,
    };
    if (!isFalseDelete) {
      deleteAttachment(deleteObj).then(() => {
        const { deleteCallback, deleteAttachmentList } = this.props;
        deleteCallback(deleteAttachmentList);
      });
    } else {
      onFalseDelete();
    }
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() {}

  // 获取上传数据
  @autobind
  getUploadData() {
    const { empId, file, attachment, fileList } = this.state;
    const { isFalseDelete } = this.props;
    const defaultData = {
      empId,
      file,
      attachment,
    };
    if (isFalseDelete) {
      const attachId = fileList[0];
      return {
        ...defaultData,
        attachId,
      };
    } else {
      return {
        ...defaultData,
      };
    }
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
    });
  }

  render() {
    const {
      empId,
      fileList,
      percent,
      status,
      statusText,
    } = this.state;
    const {
      edit,
      title,
      needDefaultText,
      isFalseDelete,
    } = this.props;
    // 调用接口的名称，如果是假删除就调用替换文件接口ceFileReplaceUpload2，否则调用上传文件接口ceFileUpload2
    const actionName = isFalseDelete ? 'ceFileReplaceUpload2' : 'ceFileUpload2';
    // const actionName = 'ceFileUpload2';
    // 上传附件接口需要传输的data
    const data = this.getUploadData();
    const uploadProps = {
      data,
      action: `${request.prefix}/file/${actionName}`,
      headers: {
        accept: '*/*',
      },
      beforeUpload: this.beforeUpload,
      onChange: this.onChange,
      showUploadList: false,
      fileList,
    };
    const downloadName = 'ceFileDownload2';
    let fileListElement;
    // 活动栏目是假删除,删除时第一个文件会设置isDelete属性为true，当isDelete是true时，不显示组件
    if (fileList && fileList.length) {
      fileListElement = (
        <div className={styles.fileList}>
          {
            fileList.map((item, index) => {
              if (item.isDelete) {
                return null;
              }
              const fileName = item.name;
              const popoverHtml = (
                <div className={styles.filePop}>
                  <h3 className="clearfix">
                    <Icon type="fujian1" />
                    <span className={styles.popFileName}>{fileName}</span>
                    <span className={styles.btnBox}>
                      {
                        edit ?
                          <em>
                            <Popconfirm
                              placement="top"
                              onConfirm={() => this.onRemove(item.attachId)}
                              okText="是"
                              cancelText="否"
                              title={'是否删除该附件？'}
                            >
                              <Icon type="shanchu" />
                              <i className={styles.cutline} />
                            </Popconfirm>
                          </em>
                        :
                          null
                      }
                      <em>
                        <a
                          href={`${request.prefix}/file/${downloadName}?attachId=${item.attachId}&empId=${empId}&filename=${window.encodeURIComponent(item.name)}`}
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
                <div key={item.attachId} className={styles.fileItem}>
                  <Popover
                    placement="right"
                    content={popoverHtml}
                    trigger="hover"
                    mouseLeaveDelay={0.3}
                    overlayClassName={styles.filePopover}
                  >
                    <p className={styles.fileItemText} title={fileName}>
                      <Icon type="fujian" />
                      <span className={styles.fileName}>{fileName}</span>
                    </p>
                  </Popover>
                  <Popover
                    placement="bottom"
                    content={statusText}
                    trigger="hover"
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
        </div>
      );
    } else if (needDefaultText) {
      fileListElement = (
        <div className={styles.fileList}>
          <div className={styles.noFile}>
            <Icon type="fujian" />
            <span>暂未上传</span>
          </div>
        </div>
      );
    } else {
      fileListElement = null;
    }
    return (
      <div className={`${styles.fileListMain} fileListMain`}>
        {
          _.isEmpty(title) ?
            null
          :
            <h3 className={styles.title}>{title}</h3>
        }
        { fileListElement }
        {
          edit ?
            <div className={styles.fileUploadItem}>
              <Upload {...uploadProps} {...this.props}>
                <Button className={styles.commonUploadBtn}>
                  <Icon type="fujian1" />上传附件
                </Button>
              </Upload>
            </div>
          :
            null
        }
      </div>
    );
  }
}
