/**
 * @Author: sunweibin
 * @Date: 2018-04-14 20:52:53
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-16 15:26:04
 * @description 非涨乐财富通服务方式下的客户反馈级联Select
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select } from 'antd';

import styles from './index.less';

const { Option } = Select;

export default class CascadeFeedbackSelect extends PureComponent {
  constructor(props) {
    super(props);
    const { feedbackList, value } = this.props;
    const first = _.get(feedbackList, '[0].key') || '';
    const second = _.get(feedbackList, '[0].children[0].key') || '';

    this.state = _.isEmpty(value) ? { first, second } : value;
  }

  componentWillReceiveProps(nextProps) {
    // const { feedbackList: prevList } = this.props;
    // const { feedbackList: nextList } = nextProps;
    // if (!_.isEqual(prevList, nextList)) {
    //   const first = _.get(nextList, '[0].key') || '';
    //   const second = _.get(nextList, '[0].children[0].key') || '';
    //   this.setState({ first, second });
    // }

    const { value } = nextProps;
    this.setState(value);
  }

  @autobind
  setCustFeedbackRef(input) {
    this.customerFeedbackRef = input;
  }

  // 根据选中的一级客户反馈，获取二级客户反馈列表
  @autobind
  findChildrenByFirstSelect(value) {
    const { feedbackList } = this.props;
    return _.find(feedbackList, item => item.key === value).children || [];
  }

  // 改变一级客户反馈
  @autobind
  handleFirstFeedbakSelectChange(value) {
    // 切换一级，需要同时将二级修改
    const secondList = this.findChildrenByFirstSelect(value);
    const secondFeedback = secondList[0] || {};
    this.setState({
      first: value,
      second: secondFeedback.key,
    });
    this.props.onChange({ first: value, second: secondFeedback.key });
  }

  // 改变二级客户反馈
  @autobind
  handleSecondFeedbackSelectChange(value) {
    this.setState({ second: value });
    this.props.onChange({ ...this.state, second: value });
  }

  @autobind
  renderOption(item) {
    return (<Option key={item.key} value={item.key}>{item.value}</Option>);
  }

  render() {
    const { feedbackList } = this.props;
    const { first, second } = this.state;
    // 一级客户反馈选项
    const firstOptions = feedbackList.map(this.renderOption);
    // 二级客户反馈选项
    let showSecondSelect = false;
    const secondFeedbackList = this.findChildrenByFirstSelect(first);
    const isEmptySecondList = _.isEmpty(secondFeedbackList);
    const secondOptions = secondFeedbackList.map(this.renderOption);
    // 判断如果一级反馈的文字与二级反馈的文字一样，则不显示二级反馈
    if (!isEmptySecondList) {
      const firstFeedback = _.find(feedbackList, { key: first });
      const secondFedback = _.find(secondFeedbackList, { key: second });
      showSecondSelect = firstFeedback.value === secondFedback.value;
    }

    return (
      <div className={styles.feedbackType}>
        <div className={styles.title}>客户反馈:</div>
        <div className={styles.content} ref={this.setCustFeedbackRef}>
          <Select
            value={first}
            style={{ width: 142 }}
            onChange={this.handleFirstFeedbakSelectChange}
            getPopupContainer={() => this.customerFeedbackRef}
          >
            {firstOptions}
          </Select>
          {
            showSecondSelect ? null :
              (<Select
                value={second}
                style={{ width: 142 }}
                onChange={this.handleSecondFeedbackSelectChange}
                getPopupContainer={() => this.customerFeedbackRef}
              >
                {secondOptions}
              </Select>)
          }
        </div>
      </div>
    );
  }
}

CascadeFeedbackSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  feedbackList: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
};

CascadeFeedbackSelect.defaultProps = {};

