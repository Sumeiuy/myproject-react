/*
 * @Author: LiuJianShu
 * @Date: 2017-09-22 15:02:49
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-01 16:54:43
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
import styles from './multiUploader.less';
import Icon from '../Icon';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  deleteAttachmentLoading: state.loading.effects['channelsTypeProtocol/deleteAttachment'],
});

const mapDispatchToProps = {
  // 删除附件
  deleteAttachment: fetchDataFunction(true, 'channelsTypeProtocol/deleteAttachment'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class MultiUpload extends PureComponent {
  static propTypes = {
    // 上传组件的索引
    index: PropTypes.number.isRequired,
    // 上传成功后回调方法
    uploadCallback: PropTypes.func,
    // 删除成功后回调方法
    deleteCallback: PropTypes.func,
    // 删除附件方法
    deleteAttachment: PropTypes.func,
    // 删除事件的状态
    deleteAttachmentLoading: PropTypes.bool,
    // 组件的元素 list
    attachmentList: PropTypes.array,
    // 每个单子对应的唯一附件表 ID，默认为 ''
    attachment: PropTypes.string,
    // 是否可删除、上传
    edit: PropTypes.bool,
    // 标题
    title: PropTypes.string,
    // 是否必须
    required: PropTypes.bool,
    // 上传组件的 type
    type: PropTypes.string,
  }

  static defaultProps = {
    uploadCallback: () => {},
    deleteCallback: () => {},
    deleteAttachment: () => {},
    deleteAttachmentLoading: false,
    attachmentList: [],
    attachment: '',
    edit: false,
    title: '',
    required: false,
    type: '',
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
      deleteObj: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { deleteAttachmentLoading: preDAL } = this.props;
    const {
      deleteAttachmentLoading: nextDAL,
      type,
      index,
      deleteCallback,
    } = nextProps;
    const { deleteObj: { deleteType, deleteAttachId }, fileList } = this.state;
    if ((preDAL && !nextDAL) && deleteType === type) {
      const newFileList = _.cloneDeep(fileList);
      _.remove(newFileList, o => o.attachId === deleteAttachId);
      this.setState({
        fileList: newFileList, // 文件列表
      }, () => deleteCallback(index));
    }
  }
  // 上传事件
  @autobind
  onChange(info) {
    const { index, uploadCallback } = this.props;
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
        }, uploadCallback(index, data.attachment));
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
    const { type, deleteAttachment } = this.props;
    const { empId, attachment } = this.state;
    const deleteObj = {
      empId,
      attachId,
      attachment,
    };
    this.setState({
      deleteObj: {
        deleteType: type,
        deleteAttachId: attachId,
      },
    }, () => deleteAttachment(deleteObj));
  }

  @autobind
  findContainer() {
    return this.fileListMultiMain;
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
    const { edit, title, required } = this.props;
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
                    getPopupContainer={this.findContainer}
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
            { uploadElement }
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
          { uploadElement }
        </div>
      </div>);
    }
    return (
      <div
        className={`${styles.fileListMultiMain}
        fileListMultiMain`}
        ref={fileListMultiMain => this.fileListMultiMain = fileListMultiMain}
      >
        {
          _.isEmpty(title) ?
            null
          :
            <h3 className={styles.title}>{title}{required ? '(必填)' : null}</h3>
        }
        { fileListElement }
      </div>
    );
  }
}
