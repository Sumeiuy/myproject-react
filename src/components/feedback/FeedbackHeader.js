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
import _ from 'lodash';
import { feedbackOptions } from '../../config';
import './feedbackHeader.less';

const Option = Select.Option;
const { RangePicker } = DatePicker;
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

  @autobind
  handleDateChange(dateStrings) {
    const { replace, location: { pathname, query } } = this.props;
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
  handleCascaderSelectChange(name, funcName, key) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [name]: _.isArray(key) ? key[0] : key,
        [funcName]: _.isArray(key) ? key[1] : key,
      },
    });
  }
  @autobind
  handleSelectChange(name, key) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [name]: _.isArray(key) ? key.join(',') : key,
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
      functionName,
      issueType,
      feedbackTagEnum,
      feedbackStatusEnum,
      processer,
      feedbackCreateTimeFrom,
      feedbackCreateTimeTo,
    } } } = this.props;

    // 级联选择的value
    let cascaderVale = [];
    if (appId) {
      cascaderVale = [appId];
      if (functionName) {
        cascaderVale = [appId, functionName];
      } else {
        cascaderVale = [appId];
      }
    }

    // 默认时间
    const startTime = feedbackCreateTimeFrom ? moment(feedbackCreateTimeFrom) : null;
    const endTime = feedbackCreateTimeTo ? moment(feedbackCreateTimeTo) : null;

    return (
      <div className="feedbackHeader">
        模块: <Cascader
          options={channelOptions}
          style={{ width: '11%' }}
          changeOnSelect
          placeholder="全部"
          value={cascaderVale}
          onChange={key => this.handleCascaderSelectChange('appId', 'functionName', key)}
        />
        类型: <Select
          style={{ width: '10%' }}
          placeholder="全部"
          value={issueType}
          onChange={key => this.handleSelectChange('issueType', key)}
          allowClear
        >
          {getSelectOption(typeOptions)}
        </Select>
        问题标签: <Select
          style={{ width: '10%' }}
          placeholder="全部"
          value={feedbackTagEnum}
          onChange={key => this.handleSelectChange('feedbackTagEnum', key)}
          allowClear
        >
          {getSelectOption(questionTagOptions)}
        </Select>
        状态: <Select
          style={{ width: '10%' }}
          placeholder="解决中"
          value={feedbackStatusEnum}
          onChange={key => this.handleSelectChange('feedbackStatusEnum', key)}
          allowClear
        >
          {getSelectOption(stateOptions)}
        </Select>
        反馈时间:<RangePicker
          style={{ width: '16%' }}
          value={[startTime, endTime]}
          onChange={this.handleDateChange}
          placeholder={['开始时间', '结束时间']}
        />
        经办人: <Select
          style={{ width: '6%' }}
          placeholder="全部"
          value={processer}
          onChange={key => this.handleSelectChange('processer', key)}
          allowClear
        >
          {getSelectOption(operatorOptions)}
        </Select>
      </div>
    );
  }
}

