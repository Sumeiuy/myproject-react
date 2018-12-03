/**
 * @Author: sunweibin
 * @Date: 2018-04-14 20:52:53
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-06-15 16:42:54
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

// 二级反馈的选择框样式
const STYLE_SECONDSELECT = { width: 142, marginLeft: 18 };

export default class CascadeFeedbackSelect extends PureComponent {
  constructor(props) {
    super(props);
    const { dataSource, value } = this.props;
    const first = _.get(dataSource, '[0].key') || '';
    const second = _.get(dataSource, '[0].children[0].key') || '';
    const initialState = _.isEmpty(value) ? { first, second } : value;
    this.state = {
      ...initialState,
      // 是否展示二级反馈，默认不展示
      isShowSecond: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.setState({ ...value });
  }

  @autobind
  getCustFeedback2() {
    const { dataSource } = this.props;
    const { first } = this.state;
    // 二级客户反馈选项
    let isShowSecond = true;
    let second = defaultFeedbackOption;
    const secondList = this.findChildrenByFirstSelect(first);
    const isEmptySecondList = _.isEmpty(secondList);

    // 判断如果一级反馈的文字与二级反馈的文字一样且二级只有一条数据时，则不显示二级反馈
    if (!isEmptySecondList && secondList.length === 1) {
      const firstFeedback = _.find(dataSource, { key: first }) || {};
      isShowSecond = firstFeedback.value !== secondList[0].value;
      second = isShowSecond ? defaultFeedbackOption : secondList[0].key;
    }

    // 如果二级反馈没数据，不展示二级反馈
    if (isEmptySecondList) {
      isShowSecond = false;
      // 二级不展示，而且二级反馈没有，
      second = '';
    }

    return {
      isShowSecond,
      second,
    };
  }

  @autobind
  saveCustFeedbackRef(input) {
    this.customerFeedbackRef = input;
  }

  // 改变一级客户反馈
  @autobind
  handleFirstFeedbakSelectChange(first) {
    // 切换一级，将二级设置成请选择
    this.setState({
      first,
    }, () => {
      const { isShowSecond, second } = this.getCustFeedback2();
      this.setState({
        second,
        isShowSecond,
      });
      this.props.onChange({ first, second });
    });
  }

  // 根据选中的一级客户反馈，获取二级客户反馈列表
  @autobind
  findChildrenByFirstSelect(first) {
    const { dataSource } = this.props;
    return (_.find(dataSource, item => item.key === first) || {}).children || [];
  }

  // 改变二级客户反馈
  @autobind
  handleSecondFeedbackSelectChange(second) {
    this.setState({ second });
    this.props.onChange({ ...this.state, second });
  }

  @autobind
  renderOption(item) {
    return (<Option key={item.key} value={item.key}>{item.value}</Option>);
  }

  render() {
    const { dataSource } = this.props;
    if (_.isEmpty(dataSource)) return null;
    const { first, second, isShowSecond } = this.state;
    // 一级客户反馈选项
    const firstOptions = dataSource.map(this.renderOption);
    // 二级客户反馈选项
    const secondList = this.findChildrenByFirstSelect(first);
    const secondOptions = secondList.map(this.renderOption);

    return (
      <div className={styles.feedbackType}>
        <div className={styles.title}>客户反馈:</div>
        <div className={styles.content} ref={this.saveCustFeedbackRef}>
          <Select
            value={first}
            style={{ width: 142 }}
            onChange={this.handleFirstFeedbakSelectChange}
            getPopupContainer={() => this.customerFeedbackRef}
          >
            {firstOptions}
          </Select>
          {/**
           * isShowSecond
           * 代表是否展示二级反馈
           * first === defaultFeedbackOption
           * 用来更新组件时，不显示客户反馈
           */}
          {
            !isShowSecond || first === defaultFeedbackOption ? null
              : (
                <Select
                  value={second}
                  style={STYLE_SECONDSELECT}
                  onChange={this.handleSecondFeedbackSelectChange}
                  getPopupContainer={() => this.customerFeedbackRef}
                >
                  {secondOptions}
                </Select>
              )
          }
        </div>
      </div>
    );
  }
}

CascadeFeedbackSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
};

CascadeFeedbackSelect.defaultProps = {};
