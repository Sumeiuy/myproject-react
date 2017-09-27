/*
 * @Author: LiuJianShu
 * @Date: 2017-09-22 15:02:49
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-22 17:44:10
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
import _ from 'lodash';
import Button from '../Button';
import { request } from '../../../config';
import { helper } from '../../../utils';
import styles from './commonUpload.less';
import Icon from '../Icon';


export default class CommonUpload extends PureComponent {
  static propTypes = {
    fileRemove: PropTypes.func,
    attachment: PropTypes.string,
    attaches: PropTypes.array,
    edit: PropTypes.bool,
  }

  static defaultProps = {
    fileRemove: () => {},
    attachment: '',
    attaches: [],
    edit: false,
  }

  constructor(props) {
    super(props);
    const { attaches, attachment } = props;
    this.state = {
      empId: helper.getEmpId(), // empId
      percent: 0, // 上传百分比
      status: 'active', // 上传状态
      statusText: '', // 上传状态对应文字
      file: {}, // 当前上传的文件
      fileList: attaches, // 文件列表
      attachment, // 上传后的唯一 ID
    };
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if (!_.isEqual(props, nextProps)) {
      const { attaches, attachment } = nextProps;
      this.setState({
        fileList: attaches, // 文件列表
        attachment, // 上传后的唯一 ID
      });
    }
  }

  @autobind
  onChange(info) {
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
      });
    } else if (info.file.status === 'error') {
      this.setState({
        status: 'exception ',
        statusText: '上传失败',
      });
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  @autobind
  onRemove(attachId) {
    const { fileRemove } = this.props;
    if (confirm('确定要删除此附件吗？')) {// eslint-disable-line
      fileRemove(attachId);
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
    const { edit } = this.props;
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
    return (
      <div className={`${styles.fileListMain} fileListMain`}>
        <div className={styles.fileList}>
          { /* 判断是否有 fileList */ }
          {
            (fileList && fileList.length) ?
              <Row>
                {
                  fileList.map((item, index) => {
                    const popoverHtml = (
                      <div>
                        <p>
                          <Icon type="fuzhi" />
                          {item.name.substring(0, item.name.lastIndexOf('.'))}
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
                            <em><a href={item.downloadURL}><Icon type="xiala" /></a></em>
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
                            <p>
                              <Icon type="fuzhi" />
                              {item.name.substring(0, item.name.lastIndexOf('.'))}
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
                                  percent={Number(percent).toFixed(0)}
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
            :
              <div className={styles.noFile}>暂无附件</div>
          }
        </div>
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

