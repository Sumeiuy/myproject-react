/*
 * @Author: zhangjun
 * @Descripter: 活动栏目表单
 * @Date: 2018-11-07 10:39:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-12 15:33:29
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Form, Input  } from 'antd';
import { urlRegExp } from './config';
import CommonUpload from '../../../common/biz/CommonUpload';
import InfoCell from './InfoCell';

import styles from './columnForm.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const create = Form.create;

@create()
export default class ColumnForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formData: PropTypes.object.isRequired,
    // form数据变化回调
    onChange: PropTypes.func.isRequired,
    // 编辑状态附件列表
    attachmentList: PropTypes.array.isRequired,
    // 附件校验错误状态
    isShowAttachmentStatusError: PropTypes.bool.isRequired,
    // 附件校验错误信息
    attachmentStatusErrorMessage: PropTypes.string.isRequired,
  }

  // 获取Form表单
  @autobind
  getForm() {
    return this.props.form;
  }

  // 上传附件
  @autobind
  handleUploadAttachment(attachment, attaches) {
    this.props.onChange({
      attachment,
      attaches,
    });
  }

  // 删除附件回调
  @autobind
  handleDeleteAttachment(attaches) {
    this.props.onChange({ attaches });
  }

  // 功能描述改变
  @autobind
  handleChangeDesc(e) {
    const descriptionCount = e.target.value.length;
    this.props.onChange({
      descriptionCount,
    });
  }

  // 校验图片链接
  @autobind
  validateLink(rule, value, callback) {
    if (value && !urlRegExp.test(value)) {
      callback('图片链接格式不正确');
    } else {
      callback();
    }
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      },
      formData: {
        attachment,
        link,
        description,
        descriptionCount = 0,
      },
      attachmentList = [],
      isShowAttachmentStatusError,
      attachmentStatusErrorMessage,
    } = this.props;
    // 附件验证
    const attachmentStatusErrorProps = isShowAttachmentStatusError
      ? {
        hasFeedback: false,
        validateStatus: 'error',
        help: attachmentStatusErrorMessage,
      }
      : null;
    // 图片上传样式
    const formCellUploadStyles = classnames([styles.formCell, styles.formCellUpload]);
    return (
      <div className={styles.columnForm}>
        <Form>
          <InfoCell
            label="图片上传"
            className={formCellUploadStyles}
            required
          >
            <FormItem {...attachmentStatusErrorProps}>
              <div className={styles.columnUpload}>
                <CommonUpload
                  attachment={attachment}
                  attachmentList={attachmentList}
                  edit
                  uploadAttachment={this.handleUploadAttachment}
                  deleteCallback={this.handleDeleteAttachment}
                  needDefaultText={false}
                />
              </div>
            </FormItem>
          </InfoCell>
          <InfoCell
            label="图片链接"
            className={styles.formCell}
            required
          >
            <FormItem>
              {getFieldDecorator('link', {
                rules: [
                  { required: true, message: '请输入图片链接' },
                  { whitespace: true, message: '请输入图片链接' },
                  { validator: this.validateLink },
                ],
                initialValue: link,
              })(
                <Input />
              )}
            </FormItem>
          </InfoCell>
          <InfoCell
            label="功能描述"
            className={styles.descCell}
            required
          >
            <FormItem>
              <div className={styles.descBox}>
                {getFieldDecorator('description', {
                  rules: [
                    { required: true, message: '请输入功能描述' },
                    { whitespace: true, message: '请输入功能描述' },
                    { min: 4, message: '最少4个字' },
                    { max: 1000, message: '最多1000个字' },
                  ],
                  initialValue: description,
                })(

                    <TextArea
                      placeholder="最少4个，最多1000个字"
                      onChange={this.handleChangeDesc}
                    />
                )}
                <span className={styles.descCount}>{descriptionCount}/1000</span>
              </div>
          </FormItem>
          </InfoCell>
        </Form>
      </div>
    );
  }
}
