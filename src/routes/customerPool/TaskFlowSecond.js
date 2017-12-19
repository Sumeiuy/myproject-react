import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import { Radio } from 'antd';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';
// import Button from '../../components/common/Button';
import Search from '../../components/common/Search';
import TaskSearchRow from '../../components/customerPool/taskFlow/TaskSearchRow';
import withRouter from '../../decorators/withRouter';
import styles from './taskFlowSecond.less';

// const Search = Input.Search;
const RadioGroup = Radio.Group;
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
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }
  change(e) {
    console.log(1111111111);
    console.log('e.target.value', e.target.value);
  }

  render() {
    console.log(Search);
    return (
      <div className={styles.searchContact}>
        <Search
          searchStyle={{
            height: '30px',
            width: '290px',
          }}
        />
        <RadioGroup name="radiogroup" onChange={this.change}>
          <TaskSearchRow value="1" />
          <TaskSearchRow value="2" />
          <div className={styles.divRows}>
            <Radio value="88"><span className={styles.title}>标签标签</span></Radio>
            <h4 className={styles.titExp}>瞄准镜标签，共有<span>1234</span>客户。创建时间2017-12-3，创建人：张三</h4>
            <h4>标签描述标签描述，<span>匹配字符</span>标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，</h4>
            <a className={styles.seeCust}>查看客户</a>
          </div>
          <div className={styles.divRows}>
            <Radio value="77"><span className={styles.title}>标签标签</span></Radio>
            <h4 className={styles.titExp}>瞄准镜标签，共有<span>1234</span>客户。创建时间2017-12-3，创建人：张三</h4>
            <h4>标签描述标签描述，<span>匹配字符</span>标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，</h4>
            <a className={styles.seeCust}>查看客户</a>
          </div>
        </RadioGroup>
      </div>
    );
  }
}
