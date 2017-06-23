/**
 * @file feedback/ProblemDetail.js
 *  问题反馈-问题详情
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Input, Form, Select } from 'antd';
import { createForm } from 'rc-form';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from '../../components/common/Icon';
import { feedbackOptions } from '../../config';
import './problemDetails.less';

const FormItem = Form.Item;
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const feedbackChannel = feedbackOptions.feedbackChannel;

@createForm()
export default class ProblemDetail extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    problemDetails: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    nowStatus: PropTypes.bool.isRequired,
    userId: PropTypes.string,
  }
  static defaultProps = {
    visible: false,
    qtab: false,
    qtabHV: false,
    jira: false,
    jiraHV: false,
    processerV: false,
    processerHV: false,
    userId: '002332',
  }
  constructor(props) {
    super(props);
    const { problemDetails = EMPTY_OBJECT } = this.props.problemDetails || EMPTY_OBJECT;
    const questionTagOptions = feedbackOptions.questionTagOptions || EMPTY_LIST;
    this.state = {
      data: problemDetails,
      popQuestionTagOptions: questionTagOptions,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { problemDetails: preVisible } = this.props;
    const { problemDetails, nowStatus } = nextProps;
    if (problemDetails !== preVisible) {
      this.setState({
        data: problemDetails,
        canBeEdited: nowStatus,
      });
    }
    this.handleClose();
  }
  /**
   * 解决状态
  */
  handleStatus = (pop) => {
    if (pop === 'PROCESSING') {
      return (
        <b className="toSolve">解决中</b>
      );
    } else if (pop === 'CLOSED') {
      return (
        <b className="close">关闭</b>
      );
    }
    return '--';
  }

  /**
   * 问题详情编辑
  */
  @autobind
  handleShowEdit(type) {
    this.handleClose();
    if (type === 'qt') {
      this.setState({
        qtab: true,
        qtabHV: true,
      });
      return true;
    } else if (type === 'jira') {
      this.setState({
        jira: true,
        jiraHV: true,
      });
      return true;
    } else if (type === 'processer') {
      this.setState({
        processerV: true,
        processerHV: true,
      });
      return true;
    }
    return true;
  }
  @autobind
  handleSub() {
    this.handleClose();
    // 提交数据
  }
  /**
   * 数据为空处理
  */
  dataNull(data) {
    if (data !== null && data !== 'null') {
      console.log(data);
      return data;
    }
    return '无';
  }

  /**
   * 问题标签显示转换
  */
  changeTag(st) {
    if (st) {
      const { popQuestionTagOptions } = this.state;
      const nowStatus = _.find(popQuestionTagOptions, o => o.value === st);
      return nowStatus.label;
    }
    return '';
  }

  @autobind
  handleClose() {
    this.setState({
      qtab: false,
      qtabHV: false,
      jira: false,
      jiraHV: false,
      processerV: false,
      processerHV: false,
    });
  }
  render() {
    const { form, onCreate } = this.props;
    const { data = EMPTY_OBJECT,
      qtab,
      qtabHV,
      jira,
      jiraHV, processerV, processerHV, canBeEdited } = this.state;
    const { functionName,
      createTime,
      version,
      status, tag, processer, jiraId } = data;
    const { getFieldDecorator } = form;
    const value = true;
    const qtValue = classnames({
      value,
      editable_field: true,
      value_hide: qtab,
    });
    const qtHiddenValue = classnames({
      hidden_value: true,
      edit_show: qtabHV,
    });
    const jiraValue = classnames({
      value,
      editable_field: true,
      value_hide: jira,
    });
    const jiraHiddenValue = classnames({
      hidden_value: true,
      edit_show: jiraHV,
    });
    const processerValue = classnames({
      value,
      editable_field: true,
      value_hide: processerV,
    });
    const processerHiddenValue = classnames({
      hidden_value: true,
      edit_show: processerHV,
    });
    const valueIsVisibel = classnames({
      value,
      value_hide: canBeEdited,
    });
    const editIsVisibel = classnames({
      eitbox: true,
      edit_show: canBeEdited,
    });
    const { popQuestionTagOptions = EMPTY_LIST } = this.state;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value} value={i.value}>{i.label}</Option>,
    );

    const channel = _.find(_.omit(feedbackChannel[0], ['value', 'lable']).children,
      item => item.value === functionName);

    return (
      <div>
        <Form layout="vertical">
          <ul className="property_list clearfix">
            <li className="item">
              <div className="wrap">
                <strong className="name">模块：</strong>
                <span className="value">{this.dataNull(channel && channel.label)}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">反馈时间：</strong>
                <span className="value">{this.dataNull(createTime)}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">系统版本号：</strong>
                <span className="value">{this.dataNull(version)}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">状态：</strong>
                <span className="value">
                  <span className="value" >
                    {this.dataNull(this.handleStatus(status))}
                  </span>
                </span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">问题标签：</strong>
                <span className={valueIsVisibel}>
                  {this.dataNull(tag)}
                </span>
                <div className={editIsVisibel}>
                  <span className={qtValue} onClick={() => this.handleShowEdit('qt')} title="点击编辑">
                    {this.dataNull(tag)}
                    <Icon type="edit" className="anticon-edit" />
                  </span>
                </div>
                <div className={qtHiddenValue}>
                  <FormItem>
                    {getFieldDecorator('tag', { initialValue: `${this.dataNull(tag)}` })(
                      <Select style={{ width: 140 }} className="qtSelect" id="qtSelect" onBlur={this.handleClose}>
                        {getSelectOption(popQuestionTagOptions)}
                      </Select>,
                    )}
                    <div className="btn">
                      <a onClick={(from) => {onCreate(form)}}><Icon type="success" /></a>
                      <a onClick={this.handleClose}><Icon type="close" /></a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">Jira编号：</strong>
                <span className={valueIsVisibel}>
                  {this.dataNull(jiraId)}
                </span>
                <div className={editIsVisibel}>
                  <span className={jiraValue} onClick={() => this.handleShowEdit('jira')} title="点击编辑">
                    {this.dataNull(jiraId)}
                    <Icon type="edit" className="anticon-edit" />
                  </span>
                </div>
                <div className={jiraHiddenValue}>
                  <FormItem>
                    {getFieldDecorator('jiraId', { initialValue: `${jiraId || ''}` })(
                      <Input style={{ width: 140 }} />,
                    )}
                    <div className="btn">
                      <a onClick={(from) => {onCreate(form)}}><Icon type="success" /></a>
                      <a onClick={this.handleClose}><Icon type="close" /></a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">经办人：</strong>
                <span className={valueIsVisibel}>
                  {this.dataNull(processer)}
                </span>
                <div className={editIsVisibel}>
                  <span className={processerValue} onClick={() => this.handleShowEdit('processer')} title="点击编辑">
                    {this.dataNull(processer)}
                    <Icon type="edit" className="anticon-edit" />
                  </span>
                </div>
                <div className={processerHiddenValue}>
                  <FormItem>
                    {getFieldDecorator('processerEmpId', { initialValue: `${this.dataNull(processer)}` })(
                      <Select style={{ width: 140 }} className="qtSelect" onBlur={this.handleClose}>
                        <Option value="002332">经办人1</Option>
                        <Option value="002333">经办人2</Option>
                        <Option value="002334">经办人3</Option>
                      </Select>,
                    )}
                    <div className="btn">
                      <a onClick={(from) => {onCreate(form)}}><Icon type="success" /></a>
                      <a onClick={this.handleClose}><Icon type="close" /></a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </li>
          </ul>
        </Form>
      </div>
    );
  }
}

