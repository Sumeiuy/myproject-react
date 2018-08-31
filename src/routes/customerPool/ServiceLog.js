/**
 * @file customerPool/ServiceLog.js
 *  360服务记录
 * @author zhushengnan
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, message, Input, TreeSelect } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import DateRangePick from 'lego-react-date/src';
import { autobind } from 'core-decorators';
import logable from '../../decorators/logable';
import Select from '../../components/common/Select';
import Collapse from '../../components/customerPool/list/CreateCollapse';
import withRouter from '../../decorators/withRouter';
import styles from './serviceLog.less';
import { ALL_SERVE_SOURCE } from './config';

const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD';
const today = moment().format(dateFormat);
// 六个月的天数
const SIX_MONTH_DAYS = 180;
const beforeSixDate = moment().subtract(SIX_MONTH_DAYS - 1, 'days');
const PAGE_NUM = 1;

const DEFAULT_SERVE_TYPE = '所有类型';
const EMPTY_LIST = [];

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
    const { location: { query: { channel = '' } } } = props;
    this.state = {
      custId: '',
      startValue: null,
      endValue: null,
      showBtn: true,
      logData: [],
      pageNum: 1,
      serveType: DEFAULT_SERVE_TYPE,
      serveSource: decodeURIComponent(channel) || ALL_SERVE_SOURCE,
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
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '服务时间',
      min: '$args[0]',
      max: '$args[1]',
    },
  })
  handleDateChange(startDate, endDate) {
    const { location: { query, pathname }, replace } = this.props;
    if (startDate !== null && endDate !== null) {
      replace({
        pathname,
        query: {
          ...query,
          serveDateFrom: startDate,
          serveDateTo: endDate,
          serveDateToPaged: null,
          pageNum: PAGE_NUM,
        },
      });
    }
  }


  // 判断当用户选择了第一次日期之后，可选的时间范围
  // 刻意自由选择一个日期，保证间隔不大于6个月
  @autobind
  isInsideOffSet({ day, firstDay, focusedInput, flag }) {
    // focusedInput 的值 只有两种情况：1.为 endDate 2.为 null
    if (focusedInput === 'endDate') {
      // 首次聚焦日历组件为 END_DATE时，开始时间往前推6个月
      // firstDay之前6个月到当前选择时间firstDay
      // 代表用户聚焦了结束时间endDate
      if (flag) {
        return day <= firstDay.clone().add(6, 'months') && day >= firstDay.clone();
      }
      // 代表用户聚焦了开始时间startDate
      // 当前选择时间firstDay到firstDay之后6个月
      return day <= firstDay.clone().add(6, 'months') && day >= firstDay.clone().subtract(1, 'days');
    }
    return true;
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

    if (moment(lastTime).isBefore(beforeSixDate)) {
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
  serveAllSourceChange(value = '') {
    if (_.isEmpty(value)) {
      return;
    }
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
      return data.map(item => ({
        label: item.value,
        value: item.value,
        show: true,
      }));
    }
    return data.map(item => ({
      label: item.value,
      value: item.key,
      show: true,
    }));
  }

  // 生成treeSelect数据
  @autobind
  constructCreatTreeOptions(data) {
    // 后端返回的值key,value是反的，需要处理
    if (!_.isEmpty(data)) {
      return data.map((item) => {
        const children = (item.children || EMPTY_LIST).map(child => ({
          key: child.key,
          title: child.value,
          value: child.key,
        }));
        return {
          key: item.key,
          title: item.value,
          value: item.key || ALL_SERVE_SOURCE,
          children,
        };
      });
    }
    return EMPTY_LIST;
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
      serveType: value,
    });
  }

  render() {
    const { dict, handleCollapseClick, filesList, getCeFileList, location } = this.props;
    const { query = {} } = location;
    // 默认搜索内容
    const { keyword, serveDateFrom, serveDateTo } = query;
    const { serveAllSource, serveAllType, executeTypes, serveWay } = dict;
    const { logData, showBtn, serveSource, serveType } = this.state;

    const endDate = serveDateTo ?
    moment(serveDateTo, dateFormat) : moment(today, dateFormat);
    const startDate = serveDateFrom ?
    moment(serveDateFrom, dateFormat) : moment(beforeSixDate, dateFormat);
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
                <TreeSelect
                  value={serveSource}
                  onChange={this.serveAllSourceChange}
                  treeData={this.constructCreatTreeOptions(serveAllSource)}
                  treeDefaultExpandAll
                />
                :
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
              <DateRangePick
                filterName=""
                filterValue={[startDate, endDate]}
                onChange={date => this.handleDateChange(date.value[0], date.value[1])}
                disabledRange={SIX_MONTH_DAYS}
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
