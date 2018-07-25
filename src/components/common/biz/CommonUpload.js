/*
 * @Author: LiuJianShu
 * @Date: 2017-09-22 15:02:49
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-15 17:34:18
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
  reformDeleteAttachmentList: state.app.reformDeleteAttachmentList,
  reformDeleteAttachmentLoading: state.loading.effects['app/reformDeleteAttachment'],
  deleteAttachmentList: state.app.deleteAttachmentList,
  deleteAttachmentLoading: state.loading.effects['app/deleteAttachment'],
});

const mapDispatchToProps = {
  // 删除附件
  deleteAttachment: fetchDataFunction(true, 'app/deleteAttachment'),
  // api getway 删除附件
  reformDeleteAttachment: fetchDataFunction(true, 'app/reformDeleteAttachment'),
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class CommonUpload extends PureComponent {
  static propTypes = {
    // api getway 改造 删除附件方法
    reformDeleteAttachment: PropTypes.func,
    // 删除附件方法
    deleteAttachment: PropTypes.func,
    // 上传附件方法
    uploadAttachment: PropTypes.func,
    // 每个单子对应的唯一附件表 ID，默认为 ''
    attachment: PropTypes.string,
    attachmentList: PropTypes.array,
    edit: PropTypes.bool,
    // 是否需要默认文字-“暂无附件”，默认为 true
    needDefaultText: PropTypes.bool,
    deleteAttachmentList: PropTypes.array,
    deleteAttachmentLoading: PropTypes.bool,
    // api getway 改造 删除附件返回结果
    reformDeleteAttachmentList: PropTypes.array,
    reformDeleteAttachmentLoading: PropTypes.bool,
    // 标题
    title: PropTypes.string,
    // 判断使用附件相关何种接口的，
    // 对于上传路径来说 false代表使用原来的 ceFileUpload ， true 代表使用新的 ceFileUpload2
    // 对于下载路径来说 false代表使用原来的 ceFileDownload, true 代表使用新的 ceFileDownload2
    reformEnable: PropTypes.bool,
    maxFileSize: PropTypes.number,
  }

  static defaultProps = {
    reformDeleteAttachment: _.noop,
    deleteAttachment: _.noop,
    uploadAttachment: _.noop,
    attachment: '',
    deleteAttachmentList: [],
    reformDeleteAttachmentList: [],
    attachmentList: [],
    edit: false,
    needDefaultText: true,
    deleteAttachmentLoading: false,
    reformDeleteAttachmentLoading: false,
    title: '',
    reformEnable: false,
    maxFileSize: null,
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
      reformDeleteAttachmentLoading: preReformDAL,
      attachmentList: preAL,
    } = this.props;
    const {
      deleteAttachmentLoading: nextDAL,
      reformDeleteAttachmentLoading: nextReformDAL,
      attachmentList: nextAL,
      reformEnable,
    } = nextProps;

    if ((preDAL && !nextDAL) ||
      (reformEnable && preReformDAL && !nextReformDAL)
    ) {
      const {
        deleteAttachmentList,
        reformDeleteAttachmentList,
      } = nextProps;

      // 文件列表
      const fileList = reformEnable ? reformDeleteAttachmentList : deleteAttachmentList;
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

    // 文件上传不能大于maxFileSize
    const fileSize = uploadFile.size;
    if (maxFileSize && fileSize >= maxFileSize) {
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
        }, uploadAttachment(data.attachment));
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
    const { deleteAttachment, reformDeleteAttachment, reformEnable } = this.props;
    const { empId, attachment } = this.state;
    const deleteObj = {
      empId,
      attachId,
      attachment,
    };
    const deleteFunc = reformEnable ? reformDeleteAttachment : deleteAttachment;
    deleteFunc(deleteObj);
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() {}

  @autobind
  findFileListNode() {
    return document.querySelectorAll('.fileListMain')[0];
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
      file,
      attachment,
      fileList,
      percent,
      status,
      statusText,
    } = this.state;
    const {
      edit,
      title,
      reformEnable,
      needDefaultText,
    } = this.props;

    const actionName = reformEnable ? 'ceFileUpload2' : 'ceFileUpload';
    const uploadProps = {
      data: {
        empId,
        file,
        attachment,
      },
      action: `${request.prefix}/file/${actionName}`,
      headers: {
        accept: '*/*',
      },
      onChange: this.onChange,
      showUploadList: false,
      fileList,
    };

    const downloadName = reformEnable ? 'ceFileDownload2' : 'ceFileDownload';
    let fileListElement;
    if (fileList && fileList.length) {
      fileListElement = (
        <div className={styles.fileList}>
          {
            fileList.map((item, index) => {
              const fileName = item.name;
              const popoverHtml = (
                <div key={item.attachId} className={styles.filePop}>
                  <h3 className='clearfix'>
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
                    上传于：{moment(item.lastModified).format('YYYY-MM-DD')}
                  </h3>
                </div>
              );
              return (
                <div className={styles.fileItem}>
                  <Popover
                    placement="right"
                    content={popoverHtml}
                    trigger="hover"
                    mouseLeaveDelay={0.3}
                    getPopupContainer={this.findFileListNode}
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
