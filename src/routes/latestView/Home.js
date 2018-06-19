/*
 * @Author: XuWenKang
 * @Description: 精选组合home
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-19 13:58:06
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import { connect } from 'dva';
// import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import { dva } from '../../helper';
import ChiefViewpoint from '../../components/latestView/chiefViewpoint/ChiefViewpoint';
// import { openRctTab } from '../../utils';
import styles from './index.less';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const effects = {
  // 获取调仓历史
  getAdjustWarehouseHistory: 'choicenessCombination/getAdjustWarehouseHistory',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 调仓历史数据
  adjustWarehouseHistoryData: state.choicenessCombination.adjustWarehouseHistoryData,
});
const mapDispatchToProps = {
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory,
    { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class LatestView extends PureComponent {
  static propTypes = {
  }

  static contextTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  render() {
    return (
      <div className={styles.latestViewBox}>
        最新观点
        <div className={`${styles.floor} clearfix`}>
          <div className={styles.left}>
            <ChiefViewpoint />
          </div>
          <div className={styles.right}>
            <ChiefViewpoint />
          </div>
        </div>
      </div>
    );
  }
}
