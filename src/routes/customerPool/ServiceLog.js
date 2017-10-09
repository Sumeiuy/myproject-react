/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, DatePicker, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import Collapse from '../../components/customerPool/list/CreateCollapse';
import styles from './serviceLog.less';


// const create = Form.create;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
// const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const dateFormat = 'YYYY-MM-DD';
const today = moment(new Date()).format('YYYY-MM-DD');

const effects = {
  getServiceLog: 'customerPool/getServiceLog',
};
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const mapStateToProps = state => ({
  dict: state.app.dict,
  serviceLogData: state.customerPool.serviceLogData, // 最近服务记录
});
const mapDispatchToProps = {
  replace: routerRedux.replace,
  getServiceLog: fetchDataFunction(true, effects.getServiceLog),
};
@connect(mapStateToProps, mapDispatchToProps)
// @create()
export default class CreateTaskForm extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getServiceLog: PropTypes.func.isRequired,
    serviceLogData: PropTypes.array.isRequired,
    dict: PropTypes.object,
  };
  static defaultProps = {
    dict: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      custId: '',
      startValue: null,
      endValue: null,
      startFormat: 'YYYY/MM/DD(E)',
      endFormat: 'YYYY/MM/DD(E)',
    };
  }
  componentWillMount() {
    this.handleData();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  @autobind
  onChange(value) {
    console.log('value---', value);
    const { location: { query, pathname }, replace } = this.props;
    const start = moment(value[0]).format('YYYY-MM-DD');
    const end = moment(value[1]).format('YYYY-MM-DD');
    console.log(start);
    console.log(end);
    replace({
      pathname,
      query: {
        ...query,
        serveDateFrom: start,
        serveDateTo: end,
      },
    });
  }
  @autobind
  // 获取当前六个月之前的日期
  getSixDate() {
    const d = new Date();
    const month = (new Date()).getMonth() + 1;
    let sixMonth = month - 6;
    let sixDate = null;
    // console.log(month);
    if (sixMonth > 0) {
      sixDate = `${d.getFullYear()}-${sixMonth}-${d.getDate()}`;
      // console.log('sixDate--', sixDate);
    } else {
      sixMonth = 12 + sixMonth;
      sixDate = `${d.getFullYear() - 1}-${sixMonth}-${d.getDate()}`;
      // console.log('sixDate2222--', sixDate);
    }
    return sixDate;
  }
  @autobind
  // 设置不可选日期
  disabledDate(startValue) {
    if (!startValue) {
      return false;
    }
    const newDay = this.getSixDate();
    const nowDay = moment(newDay, 'YYYY-MM-DD');
    return startValue.valueOf() <= nowDay.valueOf();
  }
// >custId: 客户经纪客户号（必填）
// >serveSource: 服务渠道来源
// >serveType: 服务类型
// >serveDateFrom:开始服务日期（格式：xxxx-xx-xx，如果不填默认为6个月前，不能小于6个月前）
// >serveDateTo:结束服务日期（格式：xxxx-xx-xx，如果不填默认为今天，不能大于今天）
// >serveDateToPaged: 上一页返回的最大日期（本次查询将从此日期-1天开始查询，如果不传，默认从serveDateTo开始）
// >pageSize: 每页返回的日期总数（默认7天）
  @autobind
  handleData() {
    const { location: { query, pathname }, getServiceLog, replace } = this.props;
    console.log(query);
    const params = { // 模拟 query 穿过来的数据
      custId: '020014642',
      serveSource: '001206',
      serveType: '',
      serveDateFrom: this.getSixDate(),
      serveDateTo: today,
      serveDateToPaged: today,
      pageSize: '',
    };
    replace({
      pathname,
      query: params,
    });
    console.log(query);
    getServiceLog(params);
  }
  @autobind
  handleCreatOptions(data) {
    if (!_.isEmpty(data)) {
      return data.map(item =>
        <Option key={`task${item.key}`} value={item.key}>{item.value}</Option>,
      );
    }
    return null;
  }
  @autobind
  taskTypesChange(value) {
    console.log(value);
  }

  render() {
    const { dict, serviceLogData } = this.props;
    const { taskTypes, serveType } = dict;
    // serveSource 在字典中未找到，taskTypes 先代替展现
    console.warn('dict--', dict);
    return (
      <div className={styles.serviceInner}>
        <div className={styles.servicecontent}>
          <div className={styles.service_from}>
            <Row>
              <Col span={2} offset={1} className={styles.service_label}>
                <label htmlFor="dd" >服务时间：</label>
              </Col>
              <Col span={5} >
                <RangePicker
                  defaultValue={[moment(this.getSixDate(), dateFormat), moment(today, dateFormat)]}
                  onChange={this.onChange} disabledDate={this.disabledDate}
                />
              </Col>
              <Col span={4}>
                {!_.isEmpty(taskTypes) ?
                  <Select defaultValue="所有渠道" onChange={this.taskTypesChange}>
                    {this.handleCreatOptions(taskTypes)}
                  </Select> :
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0" >暂无数据</Option>
                  </Select>
                }
              </Col>
              <Col span={4}>
                {!_.isEmpty(serveType) ?
                  <Select defaultValue="所有类型">
                    {this.handleCreatOptions(serveType)}
                  </Select> :
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0" >暂无数据</Option>
                  </Select>
                }
              </Col>
            </Row>
          </div>
          <Row>
            <Col span={20} offset={2} className={styles.serviceLog}>
              <Collapse
                data={serviceLogData}
              // executeTypes={executeTypes}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
