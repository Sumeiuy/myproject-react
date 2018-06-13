/**
 * @Author: sunweibin
 * @Date: 2018-04-14 20:52:53
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-06-13 16:58:20
 * @description 非涨乐财富通服务方式下的客户反馈级联Select
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select } from 'antd';

import { defaultFeedbackOption } from './utils';

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
    const { value } = nextProps;
    this.setState({ ...value });
  }

  @autobind
  setCustFeedbackRef(input) {
    this.customerFeedbackRef = input;
  }

  // 根据选中的一级客户反馈，获取二级客户反馈列表
  @autobind
  findChildrenByFirstSelect(value) {
    const { feedbackList } = this.props;
    return (_.find(feedbackList, item => item.key === value) || {}).children || [];
  }

  // 改变一级客户反馈
  @autobind
  handleFirstFeedbakSelectChange(value) {
    // 切换一级，将二级设置成请选择
    this.setState({
      first: value,
      second: defaultFeedbackOption,
    });
    this.props.onChange({ first: value, second: defaultFeedbackOption });
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
    if (_.isEmpty(feedbackList)) return null;
    const { first, second } = this.state;
    // 一级客户反馈选项
    const firstOptions = feedbackList.map(this.renderOption);
    // 二级客户反馈选项
    let showSecondSelect = false;
    const secondFeedbackList = this.findChildrenByFirstSelect(first);
    const isEmptySecondList = _.isEmpty(secondFeedbackList);
    const secondOptions = secondFeedbackList.map(this.renderOption);
    // 判断如果一级反馈的文字与二级反馈的文字一样且二级只有一条数据时，则不显示二级反馈
    if (!isEmptySecondList && secondFeedbackList.length === 1) {
      const firstFeedback = _.find(feedbackList, { key: first }) || {};
      const secondFedback = _.find(secondFeedbackList, { key: second }) || {};
      showSecondSelect = firstFeedback.value === secondFedback.value;
    }
    // 代表请选择，前端自定义的key，其实用不到，只是为了加一个非空的默认值
    if (first === defaultFeedbackOption) {
      showSecondSelect = true;
    }

    // 如果二级反馈没数据，不展示二级反馈
    if (isEmptySecondList) {
      showSecondSelect = true;
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

