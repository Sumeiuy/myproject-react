/**
 * @file feedback/ProblemDetail.js
 *  问题反馈-问题详情
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Input, Form, Select } from 'antd';
import { createForm } from 'rc-form';
// import classnames from 'classnames';

const FormItem = Form.Item;
const EMPTY_OBJECT = {};
@createForm()
export default class ProblemDetail extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    visible: PropTypes.bool,
    problemDetails: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
  }
  static defaultProps = {
    id: '0',
    visible: false,
  }
  constructor(props) {
    super(props);
    const { problemDetails = EMPTY_OBJECT } = this.props.problemDetails || EMPTY_OBJECT;
    this.state = {
      data: problemDetails,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { problemDetails: preVisible } = this.props;
    const { problemDetails } = nextProps;
    if (problemDetails !== preVisible) {
      this.setState({
        data: problemDetails,
      });
    }
  }
  /**
   * 解决状态
  */
  handleStatus = (pop) => {
    if (pop === '2') {
      return (
        <b className="toSolve">解决中</b>
      );
    } else if (pop === '1') {
      return (
        <b className="close">关闭</b>
      );
    }
    return '--';
  }
  render() {
    const { form } = this.props;
    const { data = EMPTY_OBJECT } = this.state;
    const { functionName,
      createTime,
      version,
      status, issueType, processer, jiraId } = data;
    const { getFieldDecorator } = form;
    // const remarkVisible = classnames({
    //   remarkbox: true,
    //   isShow,
    // });
    return (
      <div>
        <Form layout="vertical">
          <ul className="property_list">
            <li className="item">
              <div className="wrap">
                <strong className="name">模块：</strong>
                <span className="value">{functionName}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">反馈时间：</strong>
                <span className="value">{createTime}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">系统版本号：</strong>
                <span className="value">{version}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">状态：</strong>
                <span className="value">
                  {this.handleStatus(status)}
                </span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">问题标签：</strong>
                <span className="value">
                  {issueType}
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('status', { initialValue: '解决中' })(
                      <Select style={{ width: 220 }}>
                        <Option value="解决中">解决中</Option>
                        <Option value="关闭">关闭</Option>
                      </Select>,
                    )}
                  </FormItem>
                </span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">Jira编号：</strong>
                <span className="value">{jiraId}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">经办人：</strong>
                <span className="value">
                  {processer}
                  <Input style={{ display: 'none' }} />
                </span>
              </div>
            </li>
          </ul>
        </Form>
      </div>
    );
  }
}

