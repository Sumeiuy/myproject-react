/*
 * @Author: zhangjun
 * @Date: 2018-04-25 10:05:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-29 17:08:13
 * @Description: 投资模板添加弹窗
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Draft from 'draft-js';
import { autobind } from 'core-decorators';
import {
  Form, Input, Mention, Dropdown, Menu
} from 'antd';

import { MENTION_PREFIX, MentionTextStyles } from '../../../routes/investmentAdvice/config';
import styles from './templateForm_.less';
import logable from '../../../decorators/logable';

const { EditorState, Modifier } = Draft;

const FormItem = Form.Item;
const create = Form.create;
const { toContentState, toString } = Mention;
const Nav = Mention.Nav;

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
    // form 表单数据变化
    onChange: PropTypes.func.isRequired,
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
    // 连续插入参数的个数。判断是否时连续插入参数
    this.insertParameterStatus = 0;
    // mention的光标信息selection
    this.selection = {};
  }

  @autobind
  getForm() {
    return this.props.form;
  }

  @autobind
  setMentionRef(mention) {
    this.mentionRef = mention;
  }

  @autobind
  getMention() {
    return this.mentionRef;
  }

  @autobind
  handleSearchChange() {
    // 不需要根据用户输入的$后面的值进行过滤，总是返回全部的可选项
    const { dict: { investAdviceIndexPlaceHolders = [] } } = this.context;
    const slicedSuggestions = investAdviceIndexPlaceHolders.map(item => ({
      ...item,
      value: item.value.slice(1),
    }));
    const suggestions = slicedSuggestions.map(suggestion => (
      <Nav value={suggestion.value} data={suggestion}>
        <span>{suggestion.value}</span>
      </Nav>
    ));
    this.setState({ suggestions });
  }

  @autobind
  handleMentionChange(contentState) {
    // 第一次没必要校验
    if (!this.needCheckContent) {
      this.needCheckContent = true;
      return;
    }
    // 将Mention中的contentState对象转化成字符串
    const content = toString(contentState);
    this.props.checkMention(content);
    this.props.onChange({ content });
  }

  // 内容提及框获取焦点
  @autobind
  handleMentionFocus() {
    this.insertParameterStatus = 0;
  }

  // 表单标题变化
  @autobind
  handleTitleInputChange(e) {
    const { value } = e.target;
    this.props.checkTitle(value);
    this.props.onChange({ title: value });
  }

  // 插入参数
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '插入参数',
      value: '$args[0].key',
    },
  })
  insertParameter(item) {
    const { value } = item.item.props;
    const editor = this.getMention().mentionEle._editor; // eslint-disable-line
    const editorState = editor.getEditorState();
    let contentState = editorState.getCurrentContent();
    const content = contentState.getPlainText();
    const contentLength = content.length;
    let selection = editorState.getSelection();
    this.insertParameterStatus = this.insertParameterStatus + 1;
    // 连续插入参数光标会跑到最前面
    if (this.insertParameterStatus > 1) {
      // 当连续插入参数，光标会移动到头部，导致连续插入第二次会在头部插入参数
      // 从第二次开始的连续插入需要将光标的位置修改到前一次插入的末尾
      // apiUrl: (https://draftjs.org/docs/api-reference-selection-state.html#focusoffset)
      selection = selection.merge({
        focusOffset: contentLength,
        anchorOffset: contentLength,
      });
    }
    contentState = Modifier.insertText(
      contentState,
      selection,
      ` $${value} `,
    );
    editor.setEditorState(
      EditorState.createWithContent(
        contentState,
        editorState.getDecorator(),
      ),
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { suggestions } = this.state;

    // 字典
    const { dict: { investAdviceIndexPlaceHolders = [] } } = this.context;

    // 表单初始化数据
    const {
      initialTemplateParams,
      isShowContentStatusError,
      contentStatusErrorMessage,
      isShowTitleStatusError,
      titleStatusErrorMessage,
    } = this.props;

    const { title, content } = initialTemplateParams;

    const mentionContent = content || '';

    // 插入参数列表，原始数据中本身就含有 $ 符号，所以需要删除，否则Mention组件会再加一个 $
    const slicedSuggestions = investAdviceIndexPlaceHolders.map(item => ({
      ...item,
      value: item.value.slice(1),
    }));
    const menuItems = slicedSuggestions.map(item => (
      <Menu.Item key={item.key} value={item.value}>{item.value}</Menu.Item>
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
                <label htmlFor="dd" className={styles.templateForm_label}>
                  <i className={styles.required_i}>*</i>
标题:
                </label>
                <FormItem {...titleStatusErrorProps}>
                  {getFieldDecorator('title', {
                    initialValue: title,
                  })(<Input onChange={this.handleTitleInputChange} />)}
                </FormItem>
              </div>
            </li>
            <li>
              <div className={styles.TemplateFormItem} id="templateFormMention">
                <label htmlFor="dd" className={styles.templateForm_label}>
                  <i className={styles.required_i}>*</i>
内容:
                </label>
                <FormItem {...contentStatusErrorProps}>
                  <Mention
                    defaultValue={toContentState(mentionContent)}
                    ref={this.setMentionRef}
                    mentionStyle={MentionTextStyles}
                    style={{ width: '100%', height: 230 }}
                    prefix={MENTION_PREFIX}
                    onSearchChange={this.handleSearchChange}
                    suggestions={suggestions}
                    onChange={this.handleMentionChange}
                    onFocus={this.handleMentionFocus}
                    placeholder="请输入服务内容"
                    multiLines
                  />
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
          </ul>
        </Form>
      </div>
    );
  }
}
