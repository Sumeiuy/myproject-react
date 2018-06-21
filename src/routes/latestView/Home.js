/*
 * @Author: XuWenKang
 * @Description: 精选组合home
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-20 15:25:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import { connect } from 'dva';
// import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import { dva } from '../../helper';
import ChiefViewpoint from '../../components/latestView/chiefViewpoint/ChiefViewpoint';
// import { openRctTab } from '../../utils';
import config from '../../components/latestView/config';
import styles from './index.less';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const effects = {
  // 首席观点模块数据
  queryChiefViewpoint: 'latestView/queryChiefViewpoint',
  // 获取首席观点列表数据
  queryChiefViewpointList: 'latestView/queryChiefViewpointList',
  // 获取首席观点详情数据
  queryChiefViewpointDetail: 'latestView/queryChiefViewpointDetail',
};

const mapStateToProps = state => ({
  // 首页每日首席观点
  dayViewpointData: state.latestView.dayViewpointData,
  // 首页每周首席观点
  monthViewpointData: state.latestView.monthViewpointData,
  // 首席观点列表数据
  viewpointData: state.latestView.viewpointData,
  // 首席观点详情
  viewpointDetail: state.latestView.viewpointDetail,
});
const mapDispatchToProps = {
  queryChiefViewpoint: dispatch(effects.queryChiefViewpoint,
    { loading: true, forceFull: true }),
  queryChiefViewpointList: dispatch(effects.queryChiefViewpointList,
    { loading: true, forceFull: true }),
  queryChiefViewpointDetail: dispatch(effects.queryChiefViewpointDetail,
    { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class LatestView extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 首页每日首席观点
    queryChiefViewpoint: PropTypes.func.isRequired,
    dayViewpointData: PropTypes.object.isRequired,
    // 首页每周首席观点
    monthViewpointData: PropTypes.object.isRequired,
    // 首席观点列表数据
    queryChiefViewpointList: PropTypes.func.isRequired,
    viewpointData: PropTypes.object.isRequired,
    // 首席观点详情
    queryChiefViewpointDetail: PropTypes.func.isRequired,
    viewpointDetail: PropTypes.object.isRequired,

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

  componentDidMount() {
    const {
      queryChiefViewpoint,
    } = this.props;
    // 每日首席观点
    queryChiefViewpoint({
      type: config.chiefViewpointType[1].value,
    });
    // 每周首席观点
    queryChiefViewpoint({
      type: config.chiefViewpointType[2].value,
    });
  }

  render() {
    const {
      location,
      dayViewpointData,
      monthViewpointData,
    } = this.props;
    return (
      <div className={styles.latestViewBox}>
        <div className={`${styles.floor} clearfix`}>
          <div className={styles.left}>
            <ChiefViewpoint
              location={location}
              title="每日首席观点"
              data={dayViewpointData}
              type={config.chiefViewpointType[1].value}
            />
          </div>
          <div className={styles.right}>
            <ChiefViewpoint
              location={location}
              title="每周首席观点"
              data={monthViewpointData}
              type={config.chiefViewpointType[2].value}
            />
          </div>
        </div>
      </div>
    );
  }
}
