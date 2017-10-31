/*
 * @Author: LiuJianShu
 * @Date: 2017-09-22 15:02:49
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-31 14:33:28
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Progress, Popconfirm, Upload, message, Popover } from 'antd';
import { autobind } from 'core-decorators';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import Button from '../Button';
import { request } from '../../../config';
import { helper } from '../../../utils';
import styles from './multiUpload.less';
import Icon from '../Icon';

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

@connect(mapStateToProps, mapDispatchToProps)
export default class MultiUpload extends PureComponent {
  static propTypes = {
    // 删除附件方法
    deleteAttachment: PropTypes.func,
    // 上传附件方法
    uploadAttachment: PropTypes.func,
    // 每个单子对应的唯一附件表 ID，默认为 ''
    attachment: PropTypes.string,
    attachmentList: PropTypes.array.isRequired,
    edit: PropTypes.bool,
    deleteAttachmentList: PropTypes.array,
    deleteAttachmentLoading: PropTypes.bool,
    // 标题
    title: PropTypes.string,
  }

  static defaultProps = {
    deleteAttachment: () => {},
    uploadAttachment: () => {},
    attachment: '',
    deleteAttachmentList: [],
    edit: false,
    deleteAttachmentLoading: false,
    title: '',
  }

  constructor(props) {
    super(props);
    const { attachmentList, attachment } = props;
    this.state = {
      empId: helper.getEmpId(), // empId
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
    const { deleteAttachmentLoading: preDAL, attachmentList: preAL } = this.props;
    const { deleteAttachmentLoading: nextDAL, attachmentList: nextAL } = nextProps;
    if ((preDAL && !nextDAL)) {
      const { deleteAttachmentList } = nextProps;
      this.setState({
        fileList: deleteAttachmentList, // 文件列表
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
  onChange(info) {
    const { uploadAttachment } = this.props;
    const uploadFile = info.file;
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
      } else if (uploadFile.response.code === 'MAG0005') {
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
  onRemove(attachId) {
    const { deleteAttachment } = this.props;
    const { empId, attachment } = this.state;
    const deleteObj = {
      empId,
      attachId,
      attachment,
    };
    deleteAttachment(deleteObj);
  }

  @autobind
  findFileListNode() {
    return document.querySelectorAll('.fileListMultiMain')[0];
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
    const { edit, title } = this.props;
    const uploadProps = {
      data: {
        empId,
        file,
        attachment,
      },
      action: `${request.prefix}/file/ceFileUpload`,
      onChange: this.onChange,
      showUploadList: false,
      fileList,
    };

    const uploadElement = edit ?
      (<Upload {...uploadProps} {...this.props}>
        <Button className={styles.commonUploadBtn}>
          <Icon type="xiazai" />上传附件
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
              const fileName = item.name.substring(0, item.name.lastIndexOf('.'));
              const popoverHtml = (
                <div>
                  <h3>
                    <Icon type="fujian1" />
                    {fileName}
                  </h3>
                  <h3>
                    <span className="fileListItemSize">大小：{`${item.size} kb`}</span>
                    上传人：{item.creator}
                  </h3>
                  <h3>
                    <span>
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
                            </Popconfirm>
                          </em>
                        :
                          null
                      }
                      <em>
                        <a href={`${request.prefix}/file/ceFileDownload?attachId=${item.attachId}&empId=${empId}&filename=${item.name}`}>
                          <Icon type="xiazai1" />
                        </a>
                      </em>
                    </span>
                    上传于：{moment(item.lastModified).format('YYYY-MM-DD')}
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
                    getPopupContainer={this.findFileListNode}
                  >
                    <p className={styles.fileItemText} title={fileName}>
                      <Icon type="fujian" />
                      {fileName}
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
          <div className={styles.fileItem}>
            <p>
              { uploadElement }
            </p>
          </div>
        </div>
      );
    } else {
      fileListElement = (<div className={styles.fileList}>
        <div
          className={styles.fileItem}
        >
          <p className={styles.unUploadText}>
            <Icon type="fujian" />
            暂未上传
          </p>
        </div>
        <div className={styles.fileItem}>
          <p>
            { uploadElement }
          </p>
        </div>
      </div>);
    }
    return (
      <div className={`${styles.fileListMultiMain} fileListMultiMain`}>
        {
          _.isEmpty(title) ?
            null
          :
            <h3 className={styles.title}>{title}</h3>
        }
        { fileListElement }
      </div>
    );
  }
}
