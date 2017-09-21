import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';

// import Search from '../../components/fullChannelServiceRecord/Search';
import Filter from '../../components/fullChannelServiceRecord/Filter';
import DateFilter from '../../components/fullChannelServiceRecord/DateFilter';
// import { helper } from '../../utils';
import styles from './home.less';

// const searchName = 'fullChannelServiceRecord';

const mapStateToProps = state => ({
  dict: state.customerPool.dict,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
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
        <div className={styles.listBox} />
      </div>
    );
  }
}
