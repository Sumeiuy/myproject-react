/*
 * @Author: zhangjun
 * @Date: 2018-04-25 10:05:32
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-04-27 16:30:14
 * @Description: 投资模板添加弹窗
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Form, Input, Select, Mention, Dropdown, Menu } from 'antd';
import styles from './TemplateForm.less';
// import logable from '../../../decorators/logable';

const FormItem = Form.Item;
const create = Form.create;
const Option = Select.Option;
const { toContentState, toString } = Mention;
const Nav = Mention.Nav;

const PREFIX = ['$'];
const mentionTextStyle = {
  color: '#2d84cc',
  backgroundColor: '#ebf3fb',
  borderColor: '#ebf3fb',
};

@create()
export default class TemplateForm extends PureComponent {
  static propTypes = {
    // form表单
    form: PropTypes.object.isRequired,
    // 表单初始化参数
    initialTemplateParams: PropTypes.object.isRequired,
    // 内容提示框错误状态
    isShowContentStatusError: PropTypes.bool.isRequired,
    // 内容提示框错误提示信息
    contentStatusErrorMessage: PropTypes.string.isRequired,
    // 标题提示框错误状态
    isShowTitleStatusError: PropTypes.bool.isRequired,
    // 标题提示框错误提示信息
    titleStatusErrorMessage: PropTypes.string.isRequired,
    // 校验mention内容提及框
    checkMention: PropTypes.func.isRequired,
    // 校验form表单title
    checkTitle: PropTypes.func.isRequired,
  }

  static contextTypes = {
    dict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 初始化mention的suggestions
      suggestions: [],
    };
    // 判断内容是否需要校验，第一次渲染会调用handleMentionChange方法
    this.needCheckContent = false;
  }

  @autobind
  getForm() {
    return this.props.form;
  }

  @autobind
  handleSearchChange() {
    // 不需要根据用户输入的$后面的值进行过滤，总是返回全部的可选项
    const { dict: { investAdviceIndexPlaceHolders = [] } } = this.context;
    const suggestions = investAdviceIndexPlaceHolders.map(suggestion => (
      <Nav value={suggestion.value} data={suggestion}>
        <span>{suggestion.value}</span>
      </Nav>
    ));
    this.setState({ suggestions });
  }

  // 内容提及框内容失去焦点
  @autobind
  handleMentionBlur() {
    const selections = window.getSelection();
    console.warn('selections', selections);
  }

  // 内容提及框内容变化
  @autobind
  handleMentionChange(contentState) {
    // 第一次没必要校验
    if (!this.needCheckContent) {
      this.needCheckContent = true;
      return;
    }
    const content = toString(contentState);
    this.props.checkMention(content);
  }

  // 表单标题变化
  @autobind
  handleTitleInputChange(e) {
    const { value } = e.target;
    this.props.checkTitle(value);
  }

  // 插入参数
  @autobind
  insertParameter(item) {
    console.warn('item', item);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { suggestions } = this.state;

    // 字典
    const { dict: { missionType = [], investAdviceIndexPlaceHolders = [] } } = this.context;

    // 表单初始化数据
    const {
      initialTemplateParams,
      isShowContentStatusError,
      contentStatusErrorMessage,
      isShowTitleStatusError,
      titleStatusErrorMessage,
    } = this.props;

    const { typeName, title, content } = initialTemplateParams;

    // 模板类型选项默认值
    const missionTypeDefaultValue = typeName || missionType[0].value;
    const mentionContent = content || '';

    // 模板类型选项列表
    const templateOptionsList = missionType.map(item => (
      <Option key={item.key} value={item.key}>{item.value}</Option>
    ));

    // 插入参数列表
    const menuItems = investAdviceIndexPlaceHolders.map(item => (
      <Menu.Item key={item.id}>{item.value}</Menu.Item>
    ));

    const menu = (
      <Menu onClick={this.insertParameter}>
        {menuItems}
      </Menu>
    );

    // 标题校验
    const titleStatusErrorProps = isShowTitleStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: titleStatusErrorMessage,
    } : null;

    // 内容提及框校验
    const contentStatusErrorProps = isShowContentStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: contentStatusErrorMessage,
    } : null;

    return (
      <div className={styles.TemplateFormWapper}>
        <Form>
          <ul className={styles.TemplateFormList}>
            <li>
              <div className={styles.TemplateFormItem}>
                <label htmlFor="dd" className={styles.templateForm_label}><i className={styles.required_i}>*</i>标题:</label>
                <FormItem {...titleStatusErrorProps}>
                  {getFieldDecorator('title', {
                    initialValue: title,
                  })(<Input onChange={e => this.handleTitleInputChange(e)} />)}
                </FormItem>
              </div>
            </li>
            <li>
              <div className={styles.TemplateFormItem}>
                <label htmlFor="dd" className={styles.templateForm_label}><i className={styles.required_i}>*</i>内容:</label>
                <FormItem {...contentStatusErrorProps}>
                  {getFieldDecorator('content', {
                    initialValue: toContentState(mentionContent),
                  })(
                    <Mention
                      ref={(mention) => { this.mention = mention; }}
                      mentionStyle={mentionTextStyle}
                      style={{ width: '100%', height: 200 }}
                      prefix={PREFIX}
                      onSearchChange={this.handleSearchChange}
                      suggestions={suggestions}
                      onSelect={this.onSelect}
                      onChange={this.handleMentionChange}
                      onBlur={this.handleMentionBlur}
                      placeholder="请输入服务内容"
                      multiLines
                    />,
                  )}
                </FormItem>
              </div>
              <p className={styles.tipWapper}>
                <span className={styles.tipNormal}>
                  如果要在内容中包含对应每个客户的属性数值，可以用 $xx 插入参数，比如 $客户名称。注意“$”前要有空格。
                </span>
                <Dropdown overlay={menu}>
                  <span className={styles.tipInsert}>插入参数</span>
                </Dropdown>
              </p>
            </li>
            <li>
              <div className={styles.TemplateFormItem}>
                <label htmlFor="dd" className={styles.templateForm_label}><i className={styles.required_i}>*</i>类型:</label>
                <FormItem >
                  {getFieldDecorator('type', {
                    initialValue: missionTypeDefaultValue,
                    rules: [{
                      required: true, message: '请选择类型！',
                    }],
                  })(
                    <Select>{templateOptionsList}</Select>,
                  )}
                </FormItem>
              </div>
            </li>
          </ul>
        </Form>
      </div>
    );
  }
}
