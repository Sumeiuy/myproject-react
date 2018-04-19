/**
 * @Author: hongguangqing
 * @Descripter: 公务手机卡号申请页面
 * @Date: 2018-04-17 16:49:00
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-18 09:24:58
 */


import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';

import styles from './applyHome.less';
import withRouter from '../../decorators/withRouter';


// const mapStateToProps = state => ({

// });

// const mapDisPatchToProps = {

// };

// @connect(mapStateToProps, mapDisPatchToProps)
@withRouter
export default class ApplyHome extends PureComponent {
  render() {
    return (
      <div className={styles.applyHomeBox}>
        2222222
      </div>
    );
  }
}
