/*
 * @Description: 最新观点
 * @Author: XuWenKang
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-25 14:03:02
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
import MajorAssets from '../../components/latestView/majorAssets/Home';
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
  // 大类资产配置分析-首页列表
  queryMajorAssetsIndexList: 'latestView/queryMajorAssetsIndexList',
  // 大类资产配置分析-更多列表
  queryMajorAssetsList: 'latestView/queryMajorAssetsList',
  // 大类资产配置分析-详情
  queryMajorAssetsDetail: 'latestView/queryMajorAssetsDetail',
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
  // 大类资产配置分析-首页列表
  majorAssetsIndexData: state.latestView.majorAssetsIndexData,
  // 大类资产配置分析-更多列表
  majorAssetsData: state.latestView.majorAssetsData,
  // 大类资产配置分析-详情
  majorAssetsDetail: state.latestView.majorAssetsDetail,
});
const mapDispatchToProps = {
  queryChiefViewpoint: dispatch(effects.queryChiefViewpoint,
    { loading: true, forceFull: true }),
  queryChiefViewpointList: dispatch(effects.queryChiefViewpointList,
    { loading: true, forceFull: true }),
  queryChiefViewpointDetail: dispatch(effects.queryChiefViewpointDetail,
    { loading: true, forceFull: true }),
  queryMajorAssetsIndexList: dispatch(effects.queryMajorAssetsIndexList,
    { loading: true, forceFull: true }),
  queryMajorAssetsList: dispatch(effects.queryMajorAssetsList,
    { loading: true, forceFull: true }),
  queryMajorAssetsDetail: dispatch(effects.queryMajorAssetsDetail,
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
    // 大类资产配置分析-首页列表
    queryMajorAssetsIndexList: PropTypes.func.isRequired,
    majorAssetsIndexData: PropTypes.object.isRequired,
    // 大类资产配置分析-更多列表
    queryMajorAssetsList: PropTypes.func.isRequired,
    majorAssetsData: PropTypes.object.isRequired,
    // 大类资产配置分析-详情
    queryMajorAssetsDetail: PropTypes.func.isRequired,
    majorAssetsDetail: PropTypes.object.isRequired,
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
      queryMajorAssetsIndexList,
    } = this.props;
    // 每日首席观点
    queryChiefViewpoint({
      type: config.chiefViewpointType[1].value,
    });
    // 每周首席观点
    queryChiefViewpoint({
      type: config.chiefViewpointType[2].value,
    });
    // 大类资产配置分析
    queryMajorAssetsIndexList();
  }

  render() {
    const {
      location,
      dayViewpointData,
      monthViewpointData,
      majorAssetsData,
      majorAssetsIndexData,
      majorAssetsDetail,
      queryMajorAssetsDetail,
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
          <MajorAssets
            data={majorAssetsData}
            indexData={majorAssetsIndexData}
            detail={majorAssetsDetail}
            getDetail={queryMajorAssetsDetail}
          />
        </div>
      </div>
    );
  }
}
