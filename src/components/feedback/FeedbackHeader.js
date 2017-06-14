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
    replace: PropTypes.func.isRequired,
  }

  @autobind
  handleModuleChange(key) {
    console.log('key', key);
    const { replace, location: { pathname, query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const moduleName = `${key}`;
    console.log(`selected ${key}`);
    replace({
      pathname,
      query: {
        ...query,
        moduleName,
      },
    });
  }

  @autobind
  handleTypeChange(key) {
    console.log('key', key);
    const { replace, location: { pathname, query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const typeName = `${key}`;
    console.log(`selected ${key}`);
    replace({
      pathname,
      query: {
        ...query,
        typeName,
      },
    });
  }

  @autobind
  handleQuestionChange(key) {
    console.log('key', key);
    const { replace, location: { pathname, query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const questionName = `${key}`;
    console.log(`selected ${key}`);
    replace({
      pathname,
      query: {
        ...query,
        questionName,
      },
    });
  }

  @autobind
  handleStateChange(key) {
    console.log('key', key);
    const { replace, location: { pathname, query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const stateName = `${key}`;
    console.log(`selected ${key}`);
    replace({
      pathname,
      query: {
        ...query,
        stateName,
      },
    });
  }

  @autobind
  handleDateChange(dateStrings) {
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    const { replace, location: { pathname, query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const startTime = dateStrings[0];
    const endTime = dateStrings[1];
    replace({
      pathname,
      query: {
        ...query,
        startTime,
        endTime,
      },
    });
  }

  @autobind
  handleOperatorChange(key) {
    console.log('key', key);
    const { replace, location: { pathname, query } } = this.props;
    console.log('location', this.props.location);
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const operatorName = `${key}`;
    console.log(`selected ${key}`);
    replace({
      pathname,
      query: {
        ...query,
        operatorName,
      },
    });
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
        模块: <Cascader
          options={channelOptions}
          style={{ width: '10%' }}
          onChange={this.handleModuleChange}
          changeOnSelect
        />
        类型: <Select
          mode="multiple"
          tokenSeparators={[',']}
          style={{ width: '10%' }}
          placeholder="全部"
          onChange={this.handleTypeChange}
        >
          {getSelectOption(typeOptions)}
        </Select>
        问题标签: <Select
          mode="multiple"
          style={{ width: '10%' }}
          placeholder="全部"
          onChange={this.handleQuestionChange}
        >
          {getSelectOption(questionTagOptions)}
        </Select>
        状态: <Select
          mode="multiple"
          style={{ width: '10%' }}
          placeholder="全部"
          onChange={this.handleStateChange}
        >
          {getSelectOption(stateOptions)}
        </Select>
        反馈时间:<RangePicker
          style={{ width: '20%' }}
          ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
          onChange={this.handleDateChange}
        />
        经办人: <Select
          defaultValue="all"
          style={{ width: '10%' }}
          onChange={this.handleOperatorChange}
        >
          {getSelectOption(operatorOptions)}
        </Select>
      </div>
    );
  }
}

