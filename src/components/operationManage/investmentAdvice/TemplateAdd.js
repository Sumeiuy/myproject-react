/*
 * @Author: zhangjun
 * @Date: 2018-04-25 10:05:32
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-04-25 22:18:43
 * @Description: 投资模板添加弹窗
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Form, Input, Select, Mention, Dropdown, Menu } from 'antd';
import styles from './TemplateAdd.less';
import logable from '../../../decorators/logable';

const FormItem = Form.Item;
const create = Form.create;
const Option = Select.Option;
const { toContentState } = Mention;
const Nav = Mention.Nav;

const PREFIX = ['$'];
const mentionTextStyle = {
  color: '#2d84cc',
  backgroundColor: '#ebf3fb',
  borderColor: '#ebf3fb',
};

@create()
export default class TemplateAdd extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    defaultMissionDesc: PropTypes.string.isRequired,
    templetDescSuggestion: PropTypes.object,
  }

  static defaultProps = {
    templetDescSuggestion: {},
  }

  constructor(props) {
    super(props);
    const { templetDescSuggestion } = props;
    this.state = {
      // 初始化的时候，如果外部有标签任务提示带入mention，
      // 那么将suggestion填充默认值，为了让标签任务提示高亮显示
      suggestions: !_.isEmpty(templetDescSuggestion) ? [
        <Nav
          value={templetDescSuggestion.type}
          data={'sightLabel'}
        >
          <span>{templetDescSuggestion.name}</span>
        </Nav>,
      ] : [],

      // 模板类型选项
      templateOptions: [
        {
          id: 1,
          value: '行情类1',
        },
        {
          id: 2,
          value: '行情类2',
        },
        {
          id: 3,
          value: '行情类3',
        },
      ],

      // 插入参数
      parameterList: [
        {
          id: 1,
          value: '参数1',
        },
        {
          id: 2,
          value: '参数2',
        },
        {
          id: 2,
          value: '参数2',
        },
      ],
    };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '任务提示' } })
  handleSearchChange(value, trigger) {
    const { users, templetDescSuggestion } = this.props;
    const searchValue = value.toLowerCase();
    const dataSource = _.includes(PREFIX, trigger) ? [...users, templetDescSuggestion] : [];
    const filtered = dataSource.filter(item =>
      item.name && item.name.toLowerCase().indexOf(searchValue) !== -1,
    );
    const suggestions = filtered.map(suggestion => (
      <Nav
        value={suggestion.type}
        // 来自瞄准镜，则添加一个sightLabel标记
        data={suggestion.isSightingScope ? 'sightLabel' : suggestion}
      >
        <span>{suggestion.name}</span>
      </Nav>
    ));
    this.setState({ suggestions });
  }

  // 内容提及框
  @autobind
  renderMention() {
    const { defaultMissionDesc } = this.props;
    const { suggestions } = this.state;

    return (
      <div className={styles.wrapper}>
        <Mention
          mentionStyle={mentionTextStyle}
          style={{ width: '100%', height: 100 }}
          prefix={PREFIX}
          onSearchChange={this.handleSearchChange}
          suggestions={suggestions}
          getSuggestionContainer={() => this.fatherMention}
          multiLines
          defaultValue={toContentState(defaultMissionDesc)}
          onChange={this.handleMentionChange}
          onBlur={this.handleMentionBlur}
        />
        {/* <span className={styles.insert}>插入参数</span> */}
      </div>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { templateOptions, parameterList } = this.state;

    // 模板类型选项列表
    const templateOptionsList = templateOptions.map(item => (
      <Option value={item.value}>{item.value}</Option>
    ));

    // 插入参数列表
    const menuItems = parameterList.map(item => (
      <Menu.Item key={item.id}>{item.value}</Menu.Item>
    ));

    const menu = (
      <Menu>
        {menuItems}
      </Menu>
    );

    return (
      <div className={styles.TemplateAddWapper}>
        <Form>
          <FormItem
            label="标题："
          >
            {getFieldDecorator('title', {
              rules: [{
                required: true, message: '请输入标题！',
              }],
            })(<Input />)}
          </FormItem>
          <FormItem
            label="内容："
          >
            {getFieldDecorator('content', {
              rules: [{
                required: true, message: '请输入内容！',
              }],
            })(
              <div className={styles.contentWapper}>
                {
                  this.renderMention()
                }
                <p className={styles.tipWapper}>
                  <span className={styles.tipNormal}>如果要在内容中包含对应每个客户的属性数值，
                  可以用 $xx 插入参数，比如 $客户名称。注意“$”前要有空格。</span>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <span className={styles.tipInsert}>
                      插入参数
                    </span>
                  </Dropdown>
                </p>
              </div>,
            )}
          </FormItem>
          <FormItem
            label="类型："
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true, message: '请选择类型！',
              }],
            })(
              <Select>{templateOptionsList}</Select>,
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
