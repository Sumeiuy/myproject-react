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

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  // @autobind
  // handleModuleChange(key) {
  //   console.log('key', key);
  //   const { replace, location: { pathname, query } } = this.props;
  //   // 做跳转页面逻辑处理
  //   // const url = '?typeKey=${key}';
  //   // push(url);
  //   const appId = `${key}`;
  //   console.log(`selected ${key}`);
  //   replace({
  //     pathname,
  //     query: {
  //       ...query,
  //       appId,
  //     },
  //   });
  // }

  @autobind
  handleDateChange(dateStrings) {
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    const { replace, location: { pathname, query } } = this.props;
    // 做跳转页面逻辑处理
    // const url = '?typeKey=${key}';
    // push(url);
    const feedbackCreateTimeFrom = dateStrings[0];
    const feedbackCreateTimeTo = dateStrings[1];
    replace({
      pathname,
      query: {
        ...query,
        feedbackCreateTimeFrom,
        feedbackCreateTimeTo,
      },
    });
  }


  @autobind
  handleSelectChange(name, key) {
    const { replace, location: { pathname, query } } = this.props;
    console.log('key>>', key);
    replace({
      pathname,
      query: {
        ...query,
        [name]: key instanceof Array ? key.join(',') : key,
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
    const { location: { query: {
      appId,
      issueType,
      feedbackTagEnum,
      feedbackStatusEnum,
      processer,
    } } } = this.props;

    return (
      <div className="feedbackHeader">
        模块: <Cascader
          options={channelOptions}
          style={{ width: '11%' }}
          changeOnSelect
          placeholder="全部"
          value={!appId ? [] : appId.split(',')}
          onChange={key => this.handleSelectChange('appId', key)}
        />
        类型: <Select
          mode="multiple"
          style={{ width: '10%' }}
          placeholder="全部"
          value={!issueType ? [] : issueType.split(',')}
          onChange={key => this.handleSelectChange('issueType', key)}
          allowClear="true"
        >
          {getSelectOption(typeOptions)}
        </Select>
        问题标签: <Select
          mode="multiple"
          style={{ width: '12%' }}
          placeholder="全部"
          value={!feedbackTagEnum ? [] : feedbackTagEnum.split(',')}
          onChange={key => this.handleSelectChange('feedbackTagEnum', key)}
          allowClear="true"
        >
          {getSelectOption(questionTagOptions)}
        </Select>
        状态: <Select
          mode="multiple"
          style={{ width: '10%' }}
          defaultValue={['PROCESSING']}
          value={!feedbackStatusEnum ? ['PROCESSING'] : feedbackStatusEnum.split(',')}
          onChange={key => this.handleSelectChange('feedbackStatusEnum', key)}
          allowClear="true"
        >
          {getSelectOption(stateOptions)}
        </Select>
        反馈时间:<RangePicker
          style={{ width: '16%' }}
          ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
          onChange={this.handleDateChange}
        />
        经办人: <Select
          defaultValue="ALL"
          style={{ width: '6%' }}
          value={!processer ? 'ALL' : processer}
          onChange={key => this.handleSelectChange('processer', key)}
        >
          {getSelectOption(operatorOptions)}
        </Select>
      </div>
    );
  }
}

