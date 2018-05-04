/**
 * @file customerPool/ServiceLog.js
 *  360服务记录
 * @author zhushengnan
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, message, Input } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import logable from '../../decorators/logable';
import Select from '../../components/common/Select';
import DateRangePicker from '../../components/common/dateRangePicker';
import Collapse from '../../components/customerPool/list/CreateCollapse';
import withRouter from '../../decorators/withRouter';
import styles from './serviceLog.less';

const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD';
const today = moment(new Date()).format(dateFormat);

const sixMonth = moment(today).subtract(6, 'months');
const sixDate = moment(sixMonth).format(dateFormat);
const PAGE_NUM = 1;

const DEFAULT_SERVE_TYPE = '所有类型';
const DEFAULT_SERVE_SOURCE = '所有渠道';

const ALL_SERVE_TYPE = [{
  label: DEFAULT_SERVE_TYPE,
  value: '',
  show: true,
}];

const ALL_SERVE_SOURCE = [{
  label: DEFAULT_SERVE_SOURCE,
  value: '',
  show: true,
}];

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
      serveType: DEFAULT_SERVE_TYPE,
      serveSource: DEFAULT_SERVE_SOURCE,
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
  handleDateChange(date) {
    const { location: { query, pathname }, replace } = this.props;
    const { startDate, endDate } = date;
    if (startDate !== null && endDate !== null) {
      const endTimeStart = startDate.format(dateFormat);
      const endTimeEnd = endDate.format(dateFormat);
      replace({
        pathname,
        query: {
          ...query,
          serveDateFrom: endTimeStart,
          serveDateTo: endTimeEnd,
          serveDateToPaged: null,
          pageNum: PAGE_NUM,
        },
      });
    }
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
        keyword: encodeURIComponent(value),
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
  serveAllSourceChange(key, value) {
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
    this.setState({
      serveSource: value,
    });
  }

  @autobind
  constructCreatOptions(data, type) {
    if (!_.isEmpty(data) && type === 'serveType') {
      return [...data.map(item => ({
        label: item.value,
        value: item.value,
        show: true,
      })), ...ALL_SERVE_TYPE];
    }
    return [...data.map(item => ({
      label: item.value,
      value: item.key,
      show: true,
    })), ...ALL_SERVE_SOURCE];
  }

  @autobind
  constructNullCreatOptions() {
    return (
      <Select
        defaultValue="暂无数据"
        data={[{
          label: '暂无数据',
          value: '0',
          show: true,
        }]}
      />
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
  serveAllTypeChange(key, value) {
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
    this.setState({
      serveType: type,
    });
  }

  render() {
    const { dict, handleCollapseClick, filesList, getCeFileList, location } = this.props;
    const { query = {} } = location;
    // 默认搜索内容
    const { keyword } = query;
    const { serveAllSource, serveAllType, executeTypes, serveWay } = dict;
    const { logData, showBtn, serveSource, serveType } = this.state;
    return (
      <div className={styles.serviceInner}>
        <div
          className={styles.servicecontent}
          ref={ref => this.serviceScroll = ref}
          onScroll={this.handleScroll}
        >
          <div className={styles.service_from}>
            <div className={styles.searchInput}>
              <Search
                placeholder="搜索服务记录"
                defaultValue={!_.isEmpty(keyword) ? decodeURIComponent(keyword) : ''}
                onSearch={this.handleSearchServiceRecord}
                style={{ width: 160 }}
                enterButton
              />
            </div>
            <div className={styles.serviceSource}>
              {!_.isEmpty(serveAllSource) ?
                <Select
                  value={serveSource}
                  onChange={this.serveAllSourceChange}
                  name="渠道"
                  data={this.constructCreatOptions(serveAllSource)}
                /> :
                this.constructNullCreatOptions()
              }
            </div>
            <div className={styles.serviceType}>
              {!_.isEmpty(serveAllType) ?
                <Select
                  value={serveType}
                  onChange={this.serveAllTypeChange}
                  name="类型"
                  data={this.constructCreatOptions(serveAllType, 'serveType')}
                /> :
                this.constructNullCreatOptions()
              }
            </div>
            <div className={styles.serviceTime}>
              <div className={styles.title}>服务时间：</div>
              <DateRangePicker
                hasCustomerOffset
                initialEndDate={moment(today, dateFormat)}
                initialStartDate={moment(sixDate, dateFormat)}
                disabledRange={this.disabledDate}
                onChange={this.handleDateChange}
                key="服务时间"
              />
            </div>
          </div>
          <Row>
            <Col span={20} className={styles.serviceLog}>
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
