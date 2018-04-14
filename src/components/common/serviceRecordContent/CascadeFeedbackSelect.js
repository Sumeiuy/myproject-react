/**
 * @Author: sunweibin
 * @Date: 2018-04-14 20:52:53
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-14 21:47:12
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
    const { feedbackList } = this.props;
    const secondList = _.find(feedbackList, item => item.key === feedbackList[0].key).children;
    this.state = {
      first: feedbackList[0].key,
      second: secondList[0].key,
    };
  }

  @autobind
  setCustFeedbackRef(input) {
    this.customerFeedbackRef = input;
  }

  // 改变一级客户反馈
  @autobind
  handleFirstFeedbakSelectChange(value) {
    // 切换一级，需要同时将二级修改
    const { feedbackList } = this.props;
    const secondList = _.find(feedbackList, item => item.key === value).children;
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
    const secondFeedbackList = _.find(feedbackList, item => item.key === first).children;
    const isEmptySecondList = _.isEmpty(secondFeedbackList);
    const secondOptions = isEmptySecondList.map(this.renderOption);
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
};

CascadeFeedbackSelect.defaultProps = {};

