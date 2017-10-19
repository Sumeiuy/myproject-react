import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
// import { Radio } from 'antd';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';
// import Button from '../../components/common/Button';
import Search from '../../common/Search/index';
import TaskSearchRow from './TaskSearchRow';
import styles from './taskFlowSecond.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

// const effects = {
//   getHotPossibleWds: 'customerPool/getCustomerHotPossibleWds',
// };

// const fetchData = (type, loading) => query => ({
//   type,
//   payload: query || EMPTY_OBJECT,
//   loading,
// });

const mapStateToProps = state => ({
  // 字典信息
  dict: state.app.dict,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    getCirclePeople: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
    this.bigBtn = true;
  }
  @autobind
  handleRadioChange(value) {
    console.log('value--', value);
  }
  @autobind
  handleSearchClick({ value, selectedItem }) {
    console.log('search click---', value, '--', JSON.stringify(selectedItem));
    const { getCirclePeople } = this.props;
    // const condition = value;
    const param = {
      condition: value,
    };
    console.log(param);
    getCirclePeople(param);
  }

  render() {
    console.log(Search);
    return (
      <div className={styles.searchContact}>
        <Search
          searchStyle={{
            height: '50px',
            width: '390px',
          }}
          onSearchClick={this.handleSearchClick}
          isNeedLgSearch={this.bigBtn}
        />
        <TaskSearchRow
          onChange={this.handleRadioChange}
        />
      </div>
    );
  }
}
