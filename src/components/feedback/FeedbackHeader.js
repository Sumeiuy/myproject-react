/**
 * @fileOverview components/feedback/FeedbackHeader.js
 * @author hongguanqging
 * @description 用户反馈头部筛选
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import { Cascader, Select, message } from 'antd';
import DateRangePick from 'lego-react-date/src';
import moment from 'moment';
import _ from 'lodash';
import { env } from '../../helper';
import { feedbackOptions } from '../../config';
import './feedbackHeader.less';
import logable from '../../decorators/logable';

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';
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
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '反馈时间',
      min: '$args[0]',
      max: '$args[1]',
    },
  })
  handleDateChange(startDateStr, endDateStr) {
    const { replace, location: { pathname, query } } = this.props;
    if (endDateStr && startDateStr) {
      if (endDateStr > startDateStr) {
        replace({
          pathname,
          query: {
            ...query,
            feedbackCreateTimeFrom: startDateStr,
            feedbackCreateTimeTo: endDateStr,
            isResetPageNum: 'Y',
          },
        });
        return true;
      }
      message.error('开始时间与结束时间不能为同一天', 1);
      return false;
    }
    replace({
      pathname,
      query: {
        ...query,
        feedbackCreateTimeFrom: '',
        feedbackCreateTimeTo: '',
        isResetPageNum: 'Y',
      },
    });
    return false;
  }


  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '模块',
      value: (instance, args) => args[2].join('/'),
    },
  })
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '类型',
      value: '$args[1]',
    },
  })
  handleTypeClick(name, key) {
    this.handleSelectChange(name, key);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '问题标签',
      value: '$args[1]',
    },
  })
  handleProblemClick(name, key) {
    this.handleSelectChange(name, key);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[1]',
    },
  })
  handleStatusClick(name, key) {
    this.handleSelectChange(name, key);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '经办人',
      value: '$args[1]',
    },
  })
  handleProcesserClick(name, key) {
    this.handleSelectChange(name, key);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '用户评价',
      value: '$args[1]',
    },
  })
  handleFeedbackEvaluationClick(name, key) {
    this.handleSelectChange(name, key);
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
    if (env.isIE()) {
      const node = ReactDOM.findDOMNode(document.querySelector('.cascader_box input')); // eslint-disable-line
      node.addEventListener('focus', () => node.blur());
    }
  }

  // 销毁监听
  @autobind
  removeIeInputListener() {
    if (env.isIE()) {
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
    // 用户评价的下拉选项
    const userDegreeOfSatisfaction = feedbackOptions.userDegreeOfSatisfaction;
    const { location: {
        query: {
          appId,
          functionName,
          issueType,
          feedbackTagEnum,
          feedbackStatusEnum,
          processer,
          feedbackCreateTimeFrom,
          feedbackCreateTimeTo,
          evaluationEnum,
        }
      }
    } = this.props;

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
          onChange={key => this.handleTypeClick('issueType', key)}
          allowClear
        >
          {getSelectOption(typeOptions)}
        </Select>
        问题标签: <Select
          style={{ width: '8%' }}
          placeholder="全部"
          value={feedbackTagEnum}
          onChange={key => this.handleProblemClick('feedbackTagEnum', key)}
          allowClear
        >
          {getSelectOption(questionTagOptions)}
        </Select>
        状态: <Select
          style={{ width: '6%' }}
          placeholder="解决中"
          value={feedbackStatusEnum}
          onChange={key => this.handleStatusClick('feedbackStatusEnum', key)}
          allowClear
        >
          {getSelectOption(stateOptions)}
        </Select>
        用户评价: <Select
          style={{ width: '6%' }}
          placeholder="全部"
          value={evaluationEnum}
          onChange={key => this.handleFeedbackEvaluationClick('evaluationEnum', key)}
          allowClear
        >
          {getSelectOption(userDegreeOfSatisfaction)}
        </Select>
        反馈时间:
        <DateRangePick
          filterValue={[startTime, endTime]}
          filterName=""
          onChange={date => this.handleDateChange(date.value[0], date.value[1])}
          stateDateWrapper={date => date.format(dateFormat)}
        />
        经办人: <Select
          style={{ width: '6%' }}
          placeholder="全部"
          value={processer}
          onChange={key => this.handleProcesserClick('processer', key)}
          allowClear
        >
          {getSelectOption(operatorOptions)}
        </Select>
      </div>
    );
  }
}

