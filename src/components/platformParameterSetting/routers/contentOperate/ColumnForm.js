/*
 * @Author: zhangjun
 * @Descripter: 活动栏目表单
 * @Date: 2018-11-07 10:39:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-16 14:59:33
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Form, Input } from 'antd';
import { urlRegExp, acceptType } from './config';
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
    // 假删除方法
    onFalseDelete: PropTypes.func.isRequired,
    // 判断此组件用于新建页面还是修改页面，'CREATE'或者'UPDATE'
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
  }

  // 获取Form表单
  @autobind
  getForm() {
    return this.props.form;
  }

  // 判断是否是新建
  @autobind
  isCreate() {
    // action 判断当前是新建 'CREATE' 还是 修改'UPDATE'
    return this.props.action === 'CREATE';
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
    const descriptionCount = e.target.value.trim().length;
    this.props.onChange({
      descriptionCount,
    });
  }

  // 校验图片链接
  @autobind
  validateLink(rule, value, callback) {
    // 去掉前后空格校验图片链接，以及判断value中有没有空格
    if (!_.isEmpty(value)) {
      const trimValue = value.trim();
      if (_.isEmpty(trimValue)) {
        callback('请输入图片链接');
      } else if (!urlRegExp.test(trimValue) || _.indexOf(trimValue, ' ') > -1) {
        callback('图片链接格式不正确');
      }
    }
    callback();
  }

  // 校验功能描述
  @autobind
  validateDescription(rule, value, callback) {
    if (!_.isEmpty(value)) {
      const trimValue = value.trim();
      if (trimValue.length > 1000) {
        callback('最多1000个字');
      }
    }
    callback();
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
      attachmentList,
      isShowAttachmentStatusError,
      attachmentStatusErrorMessage,
      onFalseDelete,
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
                  accept={acceptType}
                  onFalseDelete={onFalseDelete}
                  isFalseDelete={!this.isCreate()}
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
                validateTrigger: ['onBlur'],
                rules: [
                  {
                    required: true,
                    message: '请输入图片链接'
                  },
                  { validator: this.validateLink },
                ],
                initialValue: link,
              })(
                <Input autocomplete="off" />
              )}
            </FormItem>
          </InfoCell>
          <InfoCell
            label="功能描述"
            className={styles.descCell}
          >
            <FormItem>
              <div className={styles.descBox}>
                {getFieldDecorator('description', {
                  validateTrigger: ['onBlur'],
                  rules: [
                    { validator: this.validateDescription }
                  ],
                  initialValue: description,
                })(

                  <TextArea
                    placeholder="最多1000个字"
                    onChange={this.handleChangeDesc}
                  />
                )}
                <span className={styles.descCount}>
                  {descriptionCount}
/1000
                </span>
              </div>
            </FormItem>
          </InfoCell>
        </Form>
      </div>
    );
  }
}
