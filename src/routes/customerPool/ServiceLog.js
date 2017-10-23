/**
 * @file customerPool/ServiceLog.js
 *  360服务记录
 * @author zhushengnan
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, DatePicker, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import classnames from 'classnames';
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
const newDay = moment(new Date()).subtract(1, 'minutes');
const today = moment(newDay).format('YYYY-MM-DD HH:mm:ss');

const sixMonth = moment(today).subtract(6, 'months');
const sixDay = moment(sixMonth).add(1, 'days');
const sixDate = moment(sixDay).format('YYYY-MM-DD HH:mm:ss');

const effects = {
  getServiceLog: 'customerPool/getServiceLog',
  getServiceLogMore: 'customerPool/getServiceLogMore',
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
      showBtn: false,
      logData: [],
    };
  }
  componentWillMount() {
    // this.handleData();
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps---', nextProps);
    const { serviceLogMoreData, serviceLogData } = nextProps;
    const { serviceLogMoreData: prevServiceLogMoreData,
      serviceLogData: prevServiceLogData } = this.props;
    if (!_.isEqual(serviceLogData, prevServiceLogData)) {
      this.setState({
        logData: serviceLogData,
      });
    }
    this.setState({
      showBtn: _.isEmpty(serviceLogData),
    });
    if (!_.isEqual(serviceLogMoreData, prevServiceLogMoreData)) {
      const newServiceLogData = _.concat(serviceLogData, serviceLogMoreData);
      this.setState({
        logData: newServiceLogData,
      });
    }
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
  }

  // 设置不可选日期
  @autobind
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
    const { location: { query, pathname }, replace, getServiceLog } = this.props;
    console.log(query);
    const params = { // 模拟 query 穿过来的数据
      custId: '666621585446',
      empId: null,
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
    console.log(this.props);
    const { location: { query },
      serviceLogData,
      getServiceLogMore,
    } = this.props;
    const lastTime = serviceLogData[serviceLogData.length - 1].serveTime;
    const params = query;
    params.serveDateToPaged = lastTime;
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
  }

  render() {
    const { dict } = this.props;
    const { serveAllSource, serveAllType } = dict;
    const { logData, showBtn } = this.state;
    console.warn('dict--', dict);
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
                data={logData}
              // executeTypes={executeTypes}
              />
            </Col>
          </Row>
          <Row
            className={
              classnames({
                [styles.showBtn]: !showBtn,
              })
            }
          >
            <Col className={styles.more}>
              <Button onClick={this.handleMore}>加载更多服务记录</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
