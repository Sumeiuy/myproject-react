/*
 * @Author: zhufeiyang
 * @Date: 2018-11-19 11:11:19
 * @Last Modified by: zhufeiyang
 * @Last Modified time: 2018-11-22 16:14:50
 * @description 新版360服务记录
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import DateRangePicker from 'lego-react-date/src';
import { SingleFilter } from 'lego-react-filter/src';
import { TreeFilter } from 'lego-tree-filter/src';
import { autobind } from 'core-decorators';
import Icon from '../../../../components/common/Icon';
import { dva } from '../../../../helper';
import logable from '../../../../decorators/logable';
import IfWrap from '../../../../components/common/biz/IfWrap';
import ServiceLogList from '../../../../components/customerDetailProductOrder/ServiceLogList';
import styles from './home.less';

const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD';
const today = moment().format(dateFormat);
const EMPTY_LIST = [];
// 六个月的天数
const SIX_MONTH_DAYS = 180;
// 六个月之前的那天日期
const beforeSixDate = moment().subtract(SIX_MONTH_DAYS - 1, 'days');
// 类型初始值
const DEFAULT_SERVE_TYPE = '所有类型';


// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  dict: state.app.dict,
  // 服务记录数据
  serviceLogList: state.customerPool.serviceLogList,
  // 是否是最后一条服务记录
  isLastServiceLog: state.customerPool.isLastServiceLog,
  filesList: state.customerPool.filesList,
});

const mapDispatchToProps = {
  getServiceLog: effect('customerPool/getServiceLog', { loading: true }),
  getServiceLogMore: effect('customerPool/getServiceLogMore', { loading: false }),
  getCeFileList: effect('customerPool/getCeFileList', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ServiceLog extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    getServiceLog: PropTypes.func.isRequired,
    getServiceLogMore: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    serviceLogList: PropTypes.array,
    isLastServiceLog: PropTypes.bool.isRequired,
    dict: PropTypes.object,
    filesList: PropTypes.array,
  }

  static defaultProps = {
    dict: {},
    filesList: [],
    serviceLogList: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps;
    const { query: nextQuery } = location;
    const { location: { query: prevQuery } } = prevState;
    // url是否发生变化
    const isQueryChange = !_.isEqual(nextQuery, prevQuery);
    if(isQueryChange) {
      const { custId } = nextQuery;
      const { custId: prevCustId } = prevQuery;
      if (custId && custId !== prevCustId) {
        // 当url上的custId变化时，清除所有的内部状态
        return {
          serveType: DEFAULT_SERVE_TYPE,
          serveSource: '',
          startDate: '',
          endDate: '',
          keyword: '',
          pageNum: 1,
          location,
        };
      }
      return { location };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // 类型
      serveType: DEFAULT_SERVE_TYPE,
      // 服务渠道
      serveSource: '',
      // 开始日期
      startDate: '',
      // 结束日期
      endDate: '',
      // 输入框关键字
      keyword: '',
      // 路由信息
      location: props.location,
      // 当前页码
      pageNum: 1,
    };
  }

  componentDidMount() {
    this.queryServiceRecord({
      initial: true,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId,
        },
      },
    } = prevProps;
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (custId && prevCustId !== custId) {
      this.queryServiceRecord({
        initial: true,
      });
    }
  }

  getServiceSourceData(data) {
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
          value: item.key,
          children,
        };
      });
    }
    return EMPTY_LIST;
  }

  // SB传中文value给后端，为了能使用singleFilter，这里对数据处理一下
  getServeAllType(data) {
    return _.map(data, item => ({
      key: item.value,
      value: item.value,
    }));
  }

  // 当初始化时，需求要求日期组件需要有初始值
  // 开始值是六个月前，结束值是今天
  // 这是可筛选的最大范围
  getDefaultDate(startDate, endDate) {
    const defaultStartDate = startDate || beforeSixDate;
    const defaultEndDate = endDate || today;
    return {
      defaultStartDate,
      defaultEndDate,
    };
  }

  /*
    keyword = '', 模糊搜索关键字
    pageNum = 1,
    custId, 查询客户id
    serveSource, 服务渠道
    serveType, 任务类型
    serveDateFrom, 筛选开始时间
    serveDateTo, 筛选结束时间
  */
  queryServiceRecord(params) {
    const {
      location: {
        query: { custId },
      },
      getServiceLog,
    } = this.props;
    const {
      keyword,
      serveType,
      serveSource,
      startDate,
      endDate,
    } = this.state;

    const requestParams = {
      pageNum: 1,
      custId,
      keyword,
      serveType,
      serveSource,
      serveDateFrom: startDate,
      serveDateTo: endDate,
      ...params,
    };

    if (requestParams.serveType === '所有类型') {
      requestParams.serveType = '';
    }

    if (custId) {
      if (params.initial) {
        getServiceLog({
          pageNum: 1,
          custId,
          serveType: '',
          keyword:'',
        });
      } else {
        getServiceLog({
          ...requestParams,
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
  handleDateChange(date) {
    const startDate = date.value[0];
    const endDate = date.value[1];
    // 如果时间没有发生改变, 直接return
    if (startDate === this.state.startDate &&
        endDate === this.state.endDate) {
          return;
    }
    this.setState({
      startDate,
      endDate,
      pageNum: 1,
    });
    this.queryServiceRecord({
      serveDateFrom: startDate,
      serveDateTo: endDate,
    });
  }

  /**
   * 搜索服务记录
   */
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索服务记录',
      value: '$args[0]',
    },
  })
  handleServiceRecordSearch(value) {
    this.setState({
      pageNum: 1,
    });
    this.queryServiceRecord({
      keyword: value,
    });
  }

  @autobind
  handleInputChange(e) {
    this.setState({
      keyword: e.target.value,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '加载更多服务记录' } })
  handleMoreBtnClick() {
    const {
      location: {
        query: { custId },
      },
    } = this.props;

    const {
      pageNum,
      keyword,
      serveType,
      serveSource,
      startDate,
      endDate,
    } = this.state;

    const currentPageNum = pageNum + 1;

    this.setState({
      pageNum: currentPageNum,
    });

    this.props.getServiceLogMore({
      custId,
      pageNum: currentPageNum,
      keyword,
      serveType: serveType === '所有类型' ? '' : serveType,
      serveSource,
      serveDateFrom: startDate,
      serveDateTo: endDate,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '渠道',
      value: '$args[0]',
    },
  })
  handleTreeFilterChange(value = '') {
    this.setState({
      serveSource: value,
      pageNum: 1,
    });
    this.queryServiceRecord({
      serveSource: value,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '类型',
      value: '$args[0]',
    },
  })
  handleSingleFilterChange({ value }) {
    this.setState({
      serveType: value,
      pageNum: 1,
    });
    this.queryServiceRecord({
      serveType: value,
    });
  }

  render() {
    const {
      dict: {
        serveAllSource,
        serveAllType,
        executeTypes,
      },
      serviceLogList,
      isLastServiceLog,
      filesList,
      getCeFileList,
    } = this.props;
    const {
      serveSource,
      serveType,
      startDate,
      endDate,
      keyword,
    } = this.state;

    const { defaultStartDate, defaultEndDate } = this.getDefaultDate(startDate, endDate);

    return (
      <div className={styles.serviceInner}>
        <div className={styles.servicecontent}>
          <div className={styles.service_from}>
            <div className={styles.searchInput}>
              <Search
                placeholder="搜索服务记录"
                value={keyword}
                onSearch={this.handleServiceRecordSearch}
                onChange={this.handleInputChange}
                style={{ width: 160 }}
                enterButton
              />
            </div>
            <div className={styles.serviceSource}>
              <IfWrap isRender={!_.isEmpty(serveAllSource)}>
                <TreeFilter
                  value={serveSource}
                  onChange={this.handleTreeFilterChange}
                  treeData={this.getServiceSourceData(serveAllSource)}
                  treeDefaultExpandAll
                />
              </IfWrap>
            </div>
            <div className={styles.serviceType}>
              <IfWrap isRender={!_.isEmpty(serveAllType)}>
                <SingleFilter
                  value={serveType}
                  defaultLabel="所有类型"
                  onChange={this.handleSingleFilterChange}
                  data={this.getServeAllType(serveAllType)}
                  useCustomerFilter
                />
              </IfWrap>
            </div>
            <div className={styles.serviceTime}>
              <DateRangePicker
                filterName="服务时间"
                filterValue={[defaultStartDate, defaultEndDate]}
                onChange={this.handleDateChange}
                disabledRange={SIX_MONTH_DAYS}
              />
            </div>
          </div>
          <div className={styles.serviceLog}>
            <ServiceLogList
              serviceLogList={serviceLogList}
              executeTypes={executeTypes}
              getCeFileList={getCeFileList}
              filesList={filesList}
            />
          </div>
          <div className={styles.listFooter}>
            <span
              className={classnames({
                [styles.btn]: true,
                [styles.hidden]: isLastServiceLog || _.isEmpty(serviceLogList),
              })}
              onClick={this.handleMoreBtnClick}
            >
              <span className={styles.btnContent}>加载更多服务记录</span>
              <Icon
                type="zhankai1"
                className={styles.icon}
              />
            </span>
            <div
              className={classnames({
                [styles.lastServiceLog]: true,
                [styles.hidden]: !isLastServiceLog,
              })}
            >
              <span className={styles.divider} />已经是最后一条了<span className={styles.divider} />
            </div>
          </div>
          <div>

          </div>
        </div>
      </div>
    );
  }
}
