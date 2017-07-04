/**
 * @fileOverview components/feedback/FeedbackHeader.js
 * @author hongguanqging
 * @description 用户反馈头部筛选
 */

import React, { PropTypes, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import { Cascader, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { getEnv } from '../../utils/helper';
import { feedbackOptions } from '../../config';
import './feedbackHeader.less';

const Option = Select.Option;
const { RangePicker } = DatePicker;

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

  componentDidMount() {
    this.addIeInputListener();
  }

  componentWillUnmount() {
    this.removeIeInputListener();
  }

  @autobind
  handleDateChange(dateStrings) {
    const { replace, location: { pathname, query } } = this.props;
    const feedbackCreateTimeFrom = dateStrings[0];
    const feedbackCreateTimeTo = dateStrings[1];
    const startDate = feedbackCreateTimeFrom && moment(feedbackCreateTimeFrom).format('YYYY-MM-DD');
    const endDate = feedbackCreateTimeTo && moment(feedbackCreateTimeTo).format('YYYY-MM-DD');
    if (endDate && startDate) {
      if (endDate > startDate) {
        replace({
          pathname,
          query: {
            ...query,
            feedbackCreateTimeFrom,
            feedbackCreateTimeTo,
            isResetPageNum: 'Y',
          },
        });
        return true;
      }
      message.error('开始时间与结束时间不能为同一天', 1);
      return false;
    }
    return false;
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
        isResetPageNum: 'Y',
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
        isResetPageNum: 'Y',
      },
    });
  }

  // 解决IE下readonly无效
  @autobind
  addIeInputListener() {
    if (getEnv().$browser === 'Internet Explorer') {
      const node = ReactDOM.findDOMNode(document.querySelector('.cascader_box input')); // eslint-disable-line
      node.addEventListener('focus', () => node.blur());
    }
  }

  // 销毁监听
  @autobind
  removeIeInputListener() {
    if (getEnv().$browser === 'Internet Explorer') {
      const node = ReactDOM.findDOMNode(document.querySelector('.cascader_box input')); // eslint-disable-line
      node.removeEventListener('focus', () => node.blur());
    }
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
    // debugger;
    // 默认时间
    const startTime = feedbackCreateTimeFrom ? moment(feedbackCreateTimeFrom) : null;
    const endTime = feedbackCreateTimeTo ? moment(feedbackCreateTimeTo) : null;

    return (
      <div className="feedbackHeader">
        模块:
        <div className="cascader_box">
          <Cascader
            options={channelOptions}
            style={{ width: '90%' }}
            changeOnSelect
            placeholder="全部"
            value={cascaderVale}
            onChange={key => this.handleCascaderSelectChange('appId', 'functionName', key)}
          />
        </div>
        类型: <Select
          style={{ width: '6%' }}
          placeholder="全部"
          value={issueType}
          onChange={key => this.handleSelectChange('issueType', key)}
          allowClear
        >
          {getSelectOption(typeOptions)}
        </Select>
        问题标签: <Select
          style={{ width: '8%' }}
          placeholder="全部"
          value={feedbackTagEnum}
          onChange={key => this.handleSelectChange('feedbackTagEnum', key)}
          allowClear
        >
          {getSelectOption(questionTagOptions)}
        </Select>
        状态: <Select
          style={{ width: '6%' }}
          placeholder="解决中"
          value={feedbackStatusEnum}
          onChange={key => this.handleSelectChange('feedbackStatusEnum', key)}
          allowClear
        >
          {getSelectOption(stateOptions)}
        </Select>
        反馈时间:<RangePicker
          style={{ width: '14%' }}
          defaultValue={[startTime, endTime]}
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

