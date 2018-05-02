/*
 * @Author: zhangjun
 * @Date: 2018-04-25 10:05:32
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-02 20:47:51
 * @Description: 投资模板添加弹窗
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Form, Input, Select, Mention, Dropdown, Menu } from 'antd';
import { getDomByAttribute, getTextByAttribute } from './helper';
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
      // mention中光标偏移
      anchorOffset: 0,
      // mention中光标所在的span标签的data-offset-key值
      dataOffestKey: '',
    };
    // 判断内容是否需要校验，第一次渲染会调用handleMentionChange方法
    this.needCheckContent = false;
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

  // 内容提及框内容失去焦点
  @autobind
  handleMentionBlur() {
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
    // 获取光标位置
    const selection = document.getSelection();
    const { anchorOffset, baseNode } = selection;
    if (baseNode) {
      const parentNode = baseNode.parentNode;
      let dataOffestKey = parentNode.getAttribute('data-offset-key');
      if (!dataOffestKey) {
        const targetNode = parentNode.parentNode;
        dataOffestKey = targetNode.getAttribute('data-offset-key');
      }
      this.setState({
        anchorOffset,
        dataOffestKey,
      });
    }
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
    const { value } = item.item.props;
    const { anchorOffset, dataOffestKey } = this.state;
    let content = '';
    // 判断是否时首次插入参数，首次插入参数dataOffestKey是false
    if (dataOffestKey) {
      // 获取属性是data-offset-key的标签
      const targetElement = getDomByAttribute('span', 'data-offset-key', dataOffestKey);
      let innerText = targetElement[0].innerText;
      innerText = `${innerText.slice(0, anchorOffset)} $${value} ${innerText.slice(anchorOffset)}`;
      targetElement[0].children[0].innerText = innerText;
      // 获取属性是data-text的标签内容
      const allTextArray = getTextByAttribute('span', 'data-text');
      content = allTextArray.join('');
    } else {
      content = ` $${value}`;
    }
    const contentState = toContentState(content);
    this.props.form.setFieldsValue({ content: contentState });
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

    const { typeCode, title, content } = initialTemplateParams;

    // 模板类型选项默认值
    const missionTypeDefaultValue = typeCode || missionType[0].key;
    const mentionContent = content || '';

    // 模板类型选项列表
    const templateOptionsList = missionType.map(item => (
      <Option key={item.key} value={item.key}>{item.value}</Option>
    ));

    // 插入参数列表
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
                <label htmlFor="dd" className={styles.templateForm_label}><i className={styles.required_i}>*</i>标题:</label>
                <FormItem {...titleStatusErrorProps}>
                  {getFieldDecorator('title', {
                    initialValue: title,
                  })(<Input onChange={this.handleTitleInputChange} />)}
                </FormItem>
              </div>
            </li>
            <li>
              <div className={styles.TemplateFormItem} id="templateFormMention">
                <label htmlFor="dd" className={styles.templateForm_label}><i className={styles.required_i}>*</i>内容:</label>
                <FormItem {...contentStatusErrorProps}>
                  {getFieldDecorator('content', {
                    initialValue: toContentState(mentionContent),
                  })(
                    <Mention
                      ref={this.setMentionRef}
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
