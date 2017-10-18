/**
 * @file customerPool/ServiceLog.js
 *  360服务记录
 * @author zhushengnan
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, DatePicker, Row, Col, Button } from 'antd';
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
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
const sixMonth = moment(today).subtract(6, 'months');
const sixDate = moment(sixMonth).format('YYYY-MM-DD HH:mm:ss');

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
  serviceLogMoreData: state.customerPool.serviceLogMoreData,
});
const mapDispatchToProps = {
  replace: routerRedux.replace,
  getServiceLog: fetchDataFunction(true, effects.getServiceLog),
  getServiceLogMore: fetchDataFunction(true, effects.getServiceLogMore),
};
@connect(mapStateToProps, mapDispatchToProps)
// @create()
export default class CreateTaskForm extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getServiceLog: PropTypes.func.isRequired,
    getServiceLogMore: PropTypes.func.isRequired,
    serviceLogData: PropTypes.array.isRequired,
    serviceLogMoreData: PropTypes.array.isRequired,
    dict: PropTypes.object,
  };
  static defaultProps = {
    dict: {},
  };
  constructor(props) {
    super(props);
    this.state = {
      custId: '',
      startValue: null,
      endValue: null,
      startFormat: 'YYYY-MM-DD HH:mm:ss',
      endFormat: 'YYYY-MM-DD HH:mm:ss',
    };
  }
  componentWillMount() {
    this.handleData();
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps---', nextProps);
    const { location: { query }, serviceLogMoreData } = nextProps;
    const { location: { query: prevQuery } } = this.props;
    console.log('nextProps---', query);
    console.log('prevQuery---', prevQuery);
    // console.log('query.serveDateToPaged---', query.serveDateToPaged);
    // console.log('prevQuery.serveDateToPaged---', prevQuery.serveDateToPaged);
    console.warn('serviceLogMoreData--', serviceLogMoreData);
    // console.warn(query.serveDateToPaged === prevQuery.serveDateToPaged);

    // console.log(query!==prevQuery && query.serveDateToPaged === prevQuery.serveDateToPaged)
    // if (query!==prevQuery && query.serveDateToPaged === prevQuery.serveDateToPaged) {
    //   getServiceLog(query);
    // }
  }
  @autobind
  onChange(value) {
    const { location: { query, pathname }, replace } = this.props;
    const start = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
    replace({
      pathname,
      query: {
        ...query,
        serveDateFrom: start,
        serveDateTo: end,
      },
    });
    console.log(query);
  }

  // @autobind
  // // 获取当前六个月之前的日期
  // getSixDate() {
  //   const d = new Date();
  //   const month = (new Date()).getMonth() + 1;
  //   let sixMonth = month - 6;
  //   let sixDate = null;
  //   // console.log(month);
  //   if (sixMonth > 0) {
  //     sixDate = `${d.getFullYear()}-${sixMonth}-${d.getDate()}
  // ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  //     // console.log('sixDate--', sixDate);
  //   } else {
  //     sixMonth = 12 + sixMonth;
  //     sixDate = `${d.getFullYear() - 1}-${sixMonth}-${d.getDate()}`;
  //     // console.log('sixDate2222--', sixDate);
  //   }
  //   return sixDate;
  // }

  @autobind
  // 设置不可选日期
  disabledDate(startValue) {
    if (!startValue) {
      return false;
    }
    const nowDay = sixDate;
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
      custId: '666621585446',
      serveSource: '短信',
      serveType: 'MOT服务记录',
      serveDateFrom: sixDate,
      serveDateTo: today,
      serveDateToPaged: null,
      pageSize: null,
    };
    replace({
      pathname,
      query: params,
    });
    console.log(query);
    getServiceLog(params);
  }
  // @autobind
  // handleScroll(e) {
  //   alert('111');
  //   console.log(this.serviceScroll);
  //   const clientHeight = this.serviceScroll.clientHeight; // 可视区域高度
  //   const scrollTop = this.serviceScroll.scrollTop;  // 滚动条滚动高度
  //   const scrollHeight = this.serviceScroll.scrollHeight; // 滚动内容高度
  //   // if((clientHeight+scrollTop)==(scrollHeight)){ //如果滚动到底部 }
  // }
  @autobind
  handleMore() {
    // alert(111)
    const { location: { query, pathname },
        replace,
        serviceLogData,
        getServiceLogMore,
    } = this.props;
    const lastTime = serviceLogData[serviceLogData.length - 1].serveTime;
    replace({
      pathname,
      query: {
        ...query,
        serveDateToPaged: lastTime,
      },
    });
    const params = query;
    params.serveDateToPaged = lastTime;
    console.warn(query);
    getServiceLogMore(params);
  }
  @autobind
  serveAllSourceChange(value) {
    console.log(value);
    const { location: { query, pathname }, replace } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        serveSource: value,
      },
    });
    console.log(query);
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
  serveAllTypeChange(value) {
    console.log(value);
    console.log(value);
    const { location: { query, pathname }, replace } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        serveType: value,
      },
    });
    console.log(query);
  }

  render() {
    const { dict, serviceLogData } = this.props;
    const { serveAllSource, serveAllType } = dict;
    // serveSource 在字典中未找到，taskTypes 先代替展现
    console.warn('dict--', dict);
    // console.warn('this.props---', this.props)
    return (
      <div className={styles.serviceInner}>
        <div
          className={styles.servicecontent}
          ref={ref => this.serviceScroll = ref}
          onScroll={this.handleScroll}
        >
          <div className={styles.service_from}>
            <Row>
              <Col span={2} offset={1} className={styles.service_label}>
                <label htmlFor="dd" >服务时间：</label>
              </Col>
              <Col span={6} >
                <RangePicker
                  defaultValue={[moment(sixDate, dateFormat), moment(today, dateFormat)]}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  onOk={this.onChange} disabledDate={this.disabledDate}
                />
              </Col>
              <Col span={4}>
                {!_.isEmpty(serveAllSource) ?
                  <Select defaultValue="所有渠道" onChange={this.serveAllSourceChange}>
                    {this.handleCreatOptions(serveAllSource)}
                  </Select> :
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0" >暂无数据</Option>
                  </Select>
                }
              </Col>
              <Col span={4}>
                {!_.isEmpty(serveAllType) ?
                  <Select defaultValue="所有类型" onChange={this.serveAllTypeChange}>
                    {this.handleCreatOptions(serveAllType)}
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
          <Row>
            <Col className={styles.more}>
              <Button onClick={this.handleMore}>更多</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
