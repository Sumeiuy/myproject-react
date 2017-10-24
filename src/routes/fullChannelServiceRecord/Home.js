import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';

// import Search from '../../components/fullChannelServiceRecord/Search';
import Filter from '../../components/fullChannelServiceRecord/Filter';
import DateFilter from '../../components/fullChannelServiceRecord/DateFilter';
import RecordList from '../../components/fullChannelServiceRecord/RecordList';
// import { helper } from '../../utils';
import styles from './home.less';

// const searchName = 'fullChannelServiceRecord';
const effects = {
  getServiceRecordList: 'fullChannelServiceRecord/getServiceRecordList',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  dict: state.customerPool.dict,
  serviceRecordList: state.fullChannelServiceRecord.serviceRecordList,
  serviceRecordPage: state.fullChannelServiceRecord.serviceRecordPage,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getServiceRecordList: fetchDataFunction(true, effects.getServiceRecordList),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    serviceRecordList: PropTypes.array.isRequired,
    serviceRecordPage: PropTypes.object.isRequired,
    getServiceRecordList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.getServiceRecordList(this.props);
  }

  getServiceRecordList(props) {
    const {
      location: {
        query: {
          serviceChannel,
          serviceStatus,
          taskSource,
          serviceTimeStart,
          serviceTimeEnd,
          feedbackTimeStart,
          feedbackTimeEnd,
        },
      },
      getServiceRecordList,
    } = props;
    const obj = {
      serverChannel: serviceChannel,
      serverStatus: serviceStatus,
      taskSource,
      serverDateFrom: serviceTimeStart,
      serverDateTo: serviceTimeEnd,
      backDateFrom: feedbackTimeStart,
      backDateTo: feedbackTimeEnd,
    };
    getServiceRecordList(obj);
  }

  @autobind
  handleFilter(obj) {
    const {
      location: {
        pathname,
        query,
      },
      replace,
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [obj.name]: obj.value,
      },
    });
  }

  @autobind
  handleDateFilter(obj) {
    const {
      location: {
        pathname,
        query,
      },
      replace,
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
  }

  render() {
    const {
      dict,
      location,
      serviceRecordPage,
      serviceRecordList,
    } = this.props;
    return (
      <div className={styles.serviceRecord}>
        {
          /* <div className={styles.searchBox}>
            <Search {...searchProps} />
          </div> */
        }
        <div className={styles.filterBox}>
          <Filter
            dict={dict}
            location={location}
            onFilter={this.handleFilter}
          />
          <DateFilter
            location={location}
            onChange={this.handleDateFilter}
          />
        </div>
        <div className={styles.listBox}>
          <RecordList
            data={serviceRecordList}
            page={serviceRecordPage}
          />
        </div>
      </div>
    );
  }
}
