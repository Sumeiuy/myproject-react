import React, { PropTypes, PureComponent } from 'react';
import { Progress, Upload, message, Popover, Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import Button from '../Button';
import uploadRequest from '../../../utils/uploadRequest';
import styles from './commonUpload.less';
import Icon from '../Icon';


export default class CommonUpload extends PureComponent {
  static propTypes = {
    fileList: PropTypes.array.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      fileList: props.fileList,
      status: 'active',
      statusText: '',
      file: {},
    };
  }

  @autobind
  onChange(info) {
    console.warn('info', info);
    this.setState({
      percent: info.file.percent,
      fileList: info.fileList,
      file: info.file,
    });
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.setState({
        status: 'success',
        statusText: '上传完成',
      });
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.setState({
        status: 'exception ',
        statusText: '上传失败',
      });
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  @autobind
  fileRemove(index) {
    const { fileList } = this.state;
    const that = this;
    if (confirm('确定要删除此附件吗？')) {// eslint-disable-line
      const newFileList = _.without(fileList, fileList[index]);
      that.setState({
        fileList: newFileList,
      });
      console.warn('OK');
    } else {
      console.warn('Cancel');
    }
  }

  @autobind
  findFileListNode() {
    return document.querySelectorAll('.fileListMain')[0];
  }
  @autobind
  fileCustomRequest(option) {
    console.warn('option', option);
    console.warn('uploadRequest(option)', uploadRequest(option));
    return uploadRequest(option);
  }

  render() {
    const { file, fileList, percent, status, statusText } = this.state;
    const uploadProps = {
      data: {
        empId: '002332',
        file,
      },
      action: '/mcrm/api/v1/file/ceFileUpload',
      onChange: this.onChange,
      showUploadList: false,
      fileList,
      // customRequest: this.fileCustomRequest,
    };
    console.warn('render data', file);
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
                          上传人：
                          <span className="fileListItemSize">大小：{`${(item.size / 1024).toFixed(0)} kb`}</span>
                        </p>
                        <p>
                          上传于：{moment(item.lastModified).format('YYYY-MM-DD')}
                          <span>
                            <Icon type="shanchu" onClick={() => this.fileRemove(index)} /> |
                            <Icon type="xiala" />
                          </span>
                        </p>
                      </div>
                    );
                    const colKey = `attachment${index}`;
                    return (
                      <Col
                        span={8}
                        key={colKey}
                      >
                        <div className={styles.fileItem}>
                          <Popover
                            placement="right"
                            content={popoverHtml}
                            trigger="hover"
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
        <Upload {...uploadProps}>
          <Button className={styles.commonUploadBtn}>
            上传附件
          </Button>
        </Upload>
      </div>
    );
  }
}

