/**
 * @file customerPool/ServiceLog.js
 *  360服务记录
 * @author zhushengnan
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, DatePicker, Row, Col, Button, message, Input } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import logable from '../../decorators/logable';
import Collapse from '../../components/customerPool/list/CreateCollapse';
import withRouter from '../../decorators/withRouter';
import styles from './serviceLog.less';

const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const today = moment(new Date()).format(dateFormat);

const sixMonth = moment(today).subtract(6, 'months');
const sixDate = moment(sixMonth).format(dateFormat);
const PAGE_NUM = 1;

const effects = {
  getServiceLog: 'customerPool/getServiceLog',
  getServiceLogMore: 'customerPool/getServiceLogMore',
  handleCollapseClick: 'contactModal/handleCollapseClick',  // 手动上传日志
  getCeFileList: 'customerPool/getCeFileList',
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
  filesList: state.customerPool.filesList,
});
const mapDispatchToProps = {
  replace: routerRedux.replace,
  getServiceLog: fetchDataFunction(true, effects.getServiceLog),
  getServiceLogMore: fetchDataFunction(true, effects.getServiceLogMore),
  handleCollapseClick: fetchDataFunction(false, effects.handleCollapseClick),
  getCeFileList: fetchDataFunction(false, effects.getCeFileList),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ServiceLog extends PureComponent {
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
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
  };

  static defaultProps = {
    dict: {},
    serviceLogDataLoading: false,
    serviceLogData: [],
    serviceLogMoreData: [],
    filesList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      custId: '',
      startValue: null,
      endValue: null,
      showBtn: true,
      logData: [],
      pageNum: 1,
    };
  }

  componentWillMount() {
    const { serviceLogData } = this.props;
    if (!_.isEmpty(serviceLogData)) {
      this.setState({
        logData: serviceLogData,
        showBtn: _.isEmpty(serviceLogData),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { serviceLogMoreData, serviceLogData } = nextProps;
    const { serviceLogMoreData: prevServiceLogMoreData,
      serviceLogData: prevServiceLogData } = this.props;
    const { logData } = this.state;
    if (serviceLogData !== prevServiceLogData) {
      this.setState({
        logData: serviceLogData,
        showBtn: _.isEmpty(serviceLogData),
      });
    }
    if (serviceLogMoreData !== prevServiceLogMoreData) {
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
  }


  @autobind
  handleDateChange(value) {
    const { location: { query, pathname }, replace } = this.props;
    const start = moment(value[0]).format(dateFormat);
    const end = moment(value[1]).format(dateFormat);
    replace({
      pathname,
      query: {
        ...query,
        serveDateFrom: start,
        serveDateTo: end,
        serveDateToPaged: null,
        pageNum: PAGE_NUM,
      },
    });
  }

  /**
   * 搜索服务记录
   */
  @autobind
  handleSearchServiceRecord(value) {
    const { location: { query, pathname }, replace } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        serveDateToPaged: null,
        pageNum: PAGE_NUM,
        keyword: decodeURIComponent(value),
      },
    });
  }

  @autobind
  // 设置不可选日期
  disabledDate(value) {
    if (!value) {
      return false;
    }

    // 设置间隔日期，只能在大于六个月之前日期和当前日期之间选择
    const nowDay = sixDate;
    const currentMonth = moment(value).month() + 1;
    const localMonth = moment(new Date()).month() + 1;
    const currentDate = moment(value).format(dateFormat);
    const localDate = moment(new Date()).format(dateFormat);

    if (currentMonth === localMonth) {
      // endValue
      return currentDate > localDate;
    }
    // startValue
    return currentDate < nowDay;
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '加载更多服务记录' } })
  handleMore() {
    const { location: { query },
      getServiceLogMore,
    } = this.props;
    const { logData, pageNum } = this.state;
    const lastTime = logData[logData.length - 1].serveTime;
    const params = query;
    params.pageNum = pageNum + 1;
    this.setState({
      pageNum: pageNum + 1,
    });
    // params.custId = '118000004279'; // 本地测试用的数据 02001404
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '渠道',
      value: '$args[0]',
    },
  })
  serveAllSourceChange(value) {
    const { location: { query, pathname }, replace } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        serveSource: value,
        serveDateToPaged: null,
        pageNum: PAGE_NUM,
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '类型',
      value: '$args[0]',
    },
  })
  serveAllTypeChange(value) {
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
        pageNum: PAGE_NUM,
      },
    });
  }

  render() {
    const { dict, handleCollapseClick, filesList, getCeFileList, location } = this.props;
    const { query = {} } = location;
    // 默认搜索内容
    const { keyword } = query;
    const { serveAllSource, serveAllType, executeTypes, serveWay } = dict;
    const { logData, showBtn } = this.state;
    return (
      <div className={styles.serviceInner}>
        <div
          className={styles.servicecontent}
          ref={ref => this.serviceScroll = ref}
          onScroll={this.handleScroll}
        >
          <div className={styles.service_from}>
            <Row>
              <Col span={2} offset={2} className={styles.service_label}>
                <label htmlFor="dd" >服务时间：</label>
              </Col>
              <Col span={7} >
                <RangePicker
                  allowClear={false}
                  defaultValue={[moment(sixDate, dateFormat), moment(today, dateFormat)]}
                  format="YYYY-MM-DD"
                  showTime={false}
                  disabledDate={this.disabledDate}
                  onChange={this.handleDateChange}
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
                    {this.handleCreatOptions(serveAllType, 'serveType')}
                  </Select> :
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0" >暂无数据</Option>
                  </Select>
                }
              </Col>
              <Col span={3} className={styles.searchInput}>
                <Search
                  placeholder="搜索服务记录"
                  defaultValue={!_.isEmpty(keyword) ? decodeURIComponent(keyword) : ''}
                  onSearch={this.handleSearchServiceRecord}
                  style={{ width: 160 }}
                  enterButton
                />
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
                getCeFileList={getCeFileList}
                filesList={filesList}
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
      </div>
    );
  }
}
