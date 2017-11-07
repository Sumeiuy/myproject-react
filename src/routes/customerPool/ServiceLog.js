/**
 * @file customerPool/ServiceLog.js
 *  360服务记录
 * @author zhushengnan
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, DatePicker, Row, Col, Button, message } from 'antd';
import { connect } from 'react-redux';
import { routerRedux, withRouter } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import Loading from '../../layouts/Loading';
import Collapse from '../../components/customerPool/list/CreateCollapse';
import styles from './serviceLog.less';


const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

const sixMonth = moment(today).subtract(6, 'months');
const sixDate = moment(sixMonth).format('YYYY-MM-DD HH:mm:ss');

const effects = {
  getServiceLog: 'customerPool/getServiceLog',
  getServiceLogMore: 'customerPool/getServiceLogMore',
  handleCollapseClick: 'contactModal/handleCollapseClick',  // 手动上传日志
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
  serviceLogDataLoading: state.loading.effects[effects.getServiceLog] || false,
});
const mapDispatchToProps = {
  replace: routerRedux.replace,
  getServiceLog: fetchDataFunction(true, effects.getServiceLog),
  getServiceLogMore: fetchDataFunction(true, effects.getServiceLogMore),
  handleCollapseClick: fetchDataFunction(false, effects.handleCollapseClick),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CreateTaskForm extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getServiceLog: PropTypes.func.isRequired,
    getServiceLogMore: PropTypes.func.isRequired,
    serviceLogData: PropTypes.array,
    serviceLogMoreData: PropTypes.array,
    handleCollapseClick: PropTypes.func.isRequired,
    dict: PropTypes.object,
    serviceLogDataLoading: PropTypes.bool,
  };

  static defaultProps = {
    dict: {},
    serviceLogDataLoading: false,
    serviceLogData: [],
    serviceLogMoreData: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      custId: '',
      startValue: null,
      endValue: null,
      showBtn: true,
      logData: [],
      loading: props.serviceLogDataLoading,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { serviceLogMoreData, serviceLogData, serviceLogDataLoading } = nextProps;
    const { serviceLogMoreData: prevServiceLogMoreData,
      serviceLogData: prevServiceLogData,
      serviceLogDataLoading: prevServiceLogDataLoading } = this.props;
    const { logData } = this.state;
    if (!_.isEqual(serviceLogData, prevServiceLogData)) {
      this.setState({
        logData: serviceLogData,
      });
    }
    this.setState({
      showBtn: _.isEmpty(serviceLogData),
    });
    if (!_.isEqual(serviceLogMoreData, prevServiceLogMoreData)) {
      if (_.isEmpty(serviceLogMoreData)) {
        this.setState({
          showBtn: true,
        });
        message.error('已经是最后一条了');
      } else {
        const newServiceLogData = _.concat(logData, serviceLogMoreData);
        this.setState({
          logData: newServiceLogData,
        });
      }
    }
    if (!_.isEqual(serviceLogDataLoading, prevServiceLogDataLoading)) {
      this.setState({
        loading: serviceLogDataLoading,
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
        serveDateToPaged: null,
      },
    });
  }

  @autobind
  // 设置不可选日期
  disabledDate(startValue, endValue) {
    if (!startValue && !endValue) {
      return false;
    }

    const nowDay = sixDate;
    const currentStartDate = moment(startValue).format('YYYY-MM-DD HH:mm:ss');
    const currentEndDate = moment(endValue).format('YYYY-MM-DD HH:mm:ss');
    return currentStartDate <= nowDay && currentEndDate > nowDay;
  }

  @autobind
  handleMore() {
    console.log(this.props);
    const { location: { query },
      getServiceLogMore,
    } = this.props;
    const { logData } = this.state;
    const lastTime = logData[logData.length - 1].serveTime;
    const params = query;
    params.serveDateToPaged = moment(lastTime).format('YYYY-MM-DD HH:mm:ss');
    // params.custId = '02001404'; // 本地测试用的数据
    if (moment(lastTime).isBefore(sixDate)) {
      this.setState({
        showBtn: true,
      });
      message.error('已经是最后一条了');
    } else {
      getServiceLogMore(params);
    }
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
        serveDateToPaged: null,
      },
    });
  }

  @autobind
  handleCreatOptions(data, boolen) {
    if (!_.isEmpty(data) && boolen === 'serveType') {
      return data.map(item =>
        <Option key={`task${item.key}`} value={item.value}>{item.value}</Option>,
      );
    }
    return data.map(item =>
      <Option key={`task${item.key}`} value={item.key}>{item.value}</Option>,
    );
  }

  @autobind
  serveAllTypeChange(value) {
    console.log(value);
    let type = '';
    const { location: { query, pathname }, replace } = this.props;
    if (value === '所有类型') {
      type = '';
    } else {
      type = value;
    }
    replace({
      pathname,
      query: {
        ...query,
        serveType: type,
        serveDateToPaged: null,
      },
    });
  }

  render() {
    const { dict, handleCollapseClick } = this.props;
    const { serveAllSource, serveAllType, executeTypes, serveWay } = dict;
    const { logData, showBtn, loading } = this.state;
    console.log('showBtn-->', showBtn);
    console.log('loading-->', loading);
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
              <Col span={8} >
                <RangePicker
                  allowClear={false}
                  defaultValue={[moment(sixDate, dateFormat), moment(today, dateFormat)]}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{
                    format: 'HH:mm',
                  }}
                  onOk={this.onChange}
                  disabledDate={this.disabledDate}
                />
              </Col>
              <Col span={5}>
                {!_.isEmpty(serveAllSource) ?
                  <Select defaultValue="所有渠道" onChange={this.serveAllSourceChange}>
                    {this.handleCreatOptions(serveAllSource)}
                  </Select> :
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0" >暂无数据</Option>
                  </Select>
                }
              </Col>
              <Col span={5}>
                {!_.isEmpty(serveAllType) ?
                  <Select defaultValue="所有类型" onChange={this.serveAllTypeChange}>
                    {this.handleCreatOptions(serveAllType, 'serveType')}
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
                executeTypes={executeTypes}
                serveWay={serveWay}
                handleCollapseClick={handleCollapseClick}
                loading={loading}
              />
            </Col>
          </Row>
          <Row
            className={
              classnames({
                [styles.showBtn]: showBtn,
              })
            }
          >
            <Col className={styles.more}>
              <Button onClick={this.handleMore}>加载更多服务记录</Button>
            </Col>
          </Row>
        </div>
        <div>
          <Loading loading={loading} />
        </div>
      </div>
    );
  }
}
