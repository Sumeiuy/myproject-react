/**
 * @file invest/Home.js
 *  投顾业绩汇总首页
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';

// import List from '../../components/example/List';
import styles from './Home.less';

// const mapStateToProps = state => ({
//   list: state.example.list,
// });

// const mapDispatchToProps = {
//   getList: query => ({
//     type: 'example/getList',
//     payload: query || {},
//   }),
// };

//@connect(mapStateToProps, mapDispatchToProps)
export default class InvestHome extends PureComponent {

  static propTypes = {
    //getList: PropTypes.func.isRequired,
    //list: PropTypes.array,
  }

  static defaultProps = {
    //list: [],
  }

  componentWillMount() {
    //this.props.getList();
  }

  render() {
    //const { list } = this.props;
    return (
      <div className="page-invest content-inner">
        <div className={styles.investBlock}>
          <div className={styles.headerFilter}>
            {/* TODO 添加内容 
              此处添加的内容的容器使用inlin-block
            */}
          </div>
        </div>
        <div className={styles.investBlock}>
          <div className={styles.investIndex}>
            {/* TODO 添加内容 */}
          </div>
        </div>
        <div className={styles.investBlock}>
          {/* TODO 后期迭代任务 */}
        </div>
      </div>
    );
  }
}

