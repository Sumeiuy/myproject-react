/*
 * @Author: LiuJianShu
 * @Date: 2017-09-22 15:02:49
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-19 21:35:52
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
import { Progress, Upload, message, Popover, Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import moment from 'moment';
// import _ from 'lodash';
import { connect } from 'react-redux';
import Button from '../Button';
import { request } from '../../../config';
import { helper } from '../../../utils';
import styles from './commonUpload.less';
import Icon from '../Icon';

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

@connect(mapStateToProps, mapDispatchToProps)

export default class CommonUpload extends PureComponent {
  static propTypes = {
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
  }

  static defaultProps = {
    deleteAttachment: () => {},
    uploadAttachment: () => {},
    attachment: '',
    attachmentList: [],
    deleteAttachmentList: [],
    edit: false,
    needDefaultText: true,
    deleteAttachmentLoading: false,
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
      attachment, // 上传后的唯一 ID
    };
  }

  componentWillReceiveProps(nextProps) {
    const { deleteAttachmentLoading: preDAL } = this.props;
    const { deleteAttachmentLoading: nextDAL } = nextProps;
    if ((preDAL && !nextDAL)) {
      const { deleteAttachmentList } = nextProps;
      this.setState({
        fileList: deleteAttachmentList, // 文件列表
        percent: 0,
      });
    }
  }
  // 上传事件
  @autobind
  onChange(info) {
    const { uploadAttachment } = this.props;
    this.setState({
      percent: info.file.percent,
      fileList: info.fileList,
      file: info.file,
    });
    if (info.file.status === 'done') {
      const data = info.file.response.resultData;
      this.setState({
        status: 'success',
        statusText: '上传完成',
        fileList: data.attaches,
        attachment: data.attachment,
      }, uploadAttachment(data.attachment));
    } else if (info.file.status === 'error') {
      this.setState({
        status: 'exception ',
        statusText: '上传失败',
      });
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  // 删除事件
  @autobind
  onRemove(attachId) {
    const { deleteAttachment } = this.props;
    const { empId, attachment } = this.state;
    if (confirm('确定要删除此附件吗？')) {// eslint-disable-line
      const deleteObj = {
        empId,
        attachId,
        attachment,
      };
      deleteAttachment(deleteObj);
    }
  }

  @autobind
  findFileListNode() {
    return document.querySelectorAll('.fileListMain')[0];
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
    const { edit, needDefaultText } = this.props;
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

    let fileListElement;
    if (fileList && fileList.length) {
      fileListElement = (
        <div className={styles.fileList}>
          <Row>
            {
              fileList.map((item, index) => {
                const fileName = item.name.substring(0, item.name.lastIndexOf('.'));
                const popoverHtml = (
                  <div>
                    <p title={fileName}>
                      <Icon type="fujian1" />
                      {fileName}
                    </p>
                    <p>
                      上传人：{item.creator}
                      <span className="fileListItemSize">大小：{`${item.size} kb`}</span>
                    </p>
                    <p>
                      上传于：{moment(item.lastModified).format('YYYY-MM-DD')}
                      <span>
                        {
                          edit ?
                            <em>
                              <Icon type="shanchu" onClick={() => this.onRemove(item.attachId)} />
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
                    </p>
                  </div>
                );
                return (
                  <Col
                    span={8}
                    key={item.attachId}
                  >
                    <div className={styles.fileItem}>
                      <Popover
                        placement="right"
                        content={popoverHtml}
                        trigger="hover"
                        getPopupContainer={this.findFileListNode}
                      >
                        <p className={styles.fileItemText} title={fileName}>
                          <Icon type="fujian" />
                          {fileName}
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
                  </Col>
                );
              })
            }
          </Row>
        </div>
      );
    } else if (needDefaultText) {
      fileListElement = (
        <div className={styles.fileList}>
          <div className={styles.noFile}>暂无附件</div>
        </div>
      );
    } else {
      fileListElement = null;
    }
    return (
      <div className={`${styles.fileListMain} fileListMain`}>
        { fileListElement }
        {
          edit ?
            <Upload {...uploadProps} {...this.props}>
              <Button className={styles.commonUploadBtn}>
                上传附件
              </Button>
            </Upload>
          :
            null
        }
      </div>
    );
  }
}

