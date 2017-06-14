/**
 * @fileOverview components/feedback/FeedbackHeader.js
 * @author hongguanqging
 * @description 用户反馈头部筛选
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { Cascader, Select, DatePicker } from 'antd';
import moment from 'moment';
import { feedbackOptions } from '../../config';
import './feedbackHeader.less';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const mapStateToProps = state => ({
  boards: state.app.boards,
});

const mapDispatchToProps = {
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PageHeader extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  @autobind
  handleTypeChange(key) {
    console.log('key', key);
    const { replace, location: { query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const typeName = `${key}`;
    console.log(`selected ${key}`);
    replace({
      pathname: '/feedback',
      query: {
        ...query,
        typeName,
      },
    });
  }

  @autobind
  handleQuestionChange(key) {
    console.log('key', key);
    const { replace, location: { query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const QuestionName = `${key}`;
    console.log(`selected ${key}`);
    replace({
      pathname: '/feedback',
      query: {
        ...query,
        QuestionName,
      },
    });
  }

  @autobind
  handleDateChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  render() {
    const channelOptions = feedbackOptions.feedbackChannel;
    const typeOptions = feedbackOptions.typeOptions;
    const questionTagOptions = feedbackOptions.questionTagOptions;
    const stateOptions = feedbackOptions.stateOptions;
    const operatorOptions = feedbackOptions.operatorOptions;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value}>{i.label}</Option>,
    );


    return (
      <div className="feedbackHeader">
        模块: <Cascader options={channelOptions} onChange={this.handleChange} changeOnSelect />
        类型: <Select
          mode="multiple"
          tokenSeparators={[',']}
          style={{ width: '120px' }}
          placeholder="全部"
          onChange={this.handleTypeChange}
        >
          {getSelectOption(typeOptions)}
        </Select>
        问题标签: <Select
          mode="multiple"
          style={{ width: '120px' }}
          placeholder="全部"
          onChange={this.handleQuestionChange}
        >
          {getSelectOption(questionTagOptions)}
        </Select>
        状态: <Select
          mode="multiple"
          style={{ width: '120px' }}
          placeholder="全部"
          onChange={this.handleChange}
        >
          {getSelectOption(stateOptions)}
        </Select>
        反馈时间:<RangePicker
          ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
          onChange={this.handleDateChange}
        />
        经办人: <Select defaultValue="all" style={{ width: 120 }} onChange={this.handleChange}>
          {getSelectOption(operatorOptions)}
        </Select>
      </div>
    );
  }
}

