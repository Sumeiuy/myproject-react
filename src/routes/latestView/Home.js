/*
 * @Description: 最新观点
 * @Author: XuWenKang
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-25 14:03:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import { dva } from '../../helper';
import ChiefViewpoint from '../../components/latestView/chiefViewpoint/ChiefViewpoint';
import MajorAssets from '../../components/latestView/majorAssets/Home';
import ZiJinClockViewpoint from '../../components/latestView/ziJinClockView/ZiJinClockViewpoint';

import config from '../../components/latestView/config';
import styles from './index.less';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const effects = {
  // 首席观点模块数据
  queryChiefViewpoint: 'latestView/queryChiefViewpoint',
  // 大类资产配置分析-首页列表
  queryMajorAssetsIndexList: 'latestView/queryMajorAssetsIndexList',
  // 大类资产配置分析-更多列表
  queryMajorAssetsList: 'latestView/queryMajorAssetsList',
  // 大类资产配置分析-详情
  queryMajorAssetsDetail: 'latestView/queryMajorAssetsDetail',
  // 获取首页紫金时钟当前周期数据
  queryZiJinClockCycle: 'latestView/queryZiJinClockCycle',
  // 获取首页紫金时钟列表数据
  queryZiJinViewpointList: 'latestView/queryZiJinViewpointList',
};

const mapStateToProps = state => ({
  // 首页每日首席观点
  dayViewpointData: state.latestView.dayViewpointData,
  // 首页每周首席观点
  monthViewpointData: state.latestView.monthViewpointData,
  // 专题研究数据
  specialStudyData: state.latestView.specialStudyData,
  // 大类资产配置分析-首页列表
  majorAssetsIndexData: state.latestView.majorAssetsIndexData,
  // 大类资产配置分析-更多列表
  majorAssetsData: state.latestView.majorAssetsData,
  // 大类资产配置分析-详情
  majorAssetsDetail: state.latestView.majorAssetsDetail,
  // 首页紫金时钟当前周期数据
  ziJinCycleData: state.latestView.ziJinCycleData,
  // 首页紫金时钟列表
  ziJinClockList: state.latestView.ziJinClockList,
});
const mapDispatchToProps = {
  queryChiefViewpoint: dispatch(effects.queryChiefViewpoint,
    { loading: true, forceFull: true }),
  queryZiJinClockCycle: dispatch(effects.queryZiJinClockCycle,
    { loading: true, forceFull: true }),
  queryZiJinViewpointList: dispatch(effects.queryZiJinViewpointList,
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
    // 专题研究
    specialStudyData: PropTypes.object.isRequired,
    // 大类资产配置分析-首页列表
    queryMajorAssetsIndexList: PropTypes.func.isRequired,
    majorAssetsIndexData: PropTypes.object.isRequired,
    // 大类资产配置分析-更多列表
    queryMajorAssetsList: PropTypes.func.isRequired,
    majorAssetsData: PropTypes.object.isRequired,
    // 大类资产配置分析-详情
    queryMajorAssetsDetail: PropTypes.func.isRequired,
    majorAssetsDetail: PropTypes.object.isRequired,
    // 首页紫金时钟当前周期数据
    queryZiJinClockCycle: PropTypes.func.isRequired,
    ziJinCycleData: PropTypes.object.isRequired,
    // 首页紫金时钟列表
    queryZiJinViewpointList: PropTypes.func.isRequired,
    ziJinClockList: PropTypes.array.isRequired,
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
      queryZiJinClockCycle,
      queryZiJinViewpointList,
    } = this.props;
    // 每日首席观点
    queryChiefViewpoint({
      type: config.chiefViewpointType[1].value,
    });
    // 每周首席观点
    queryChiefViewpoint({
      type: config.chiefViewpointType[2].value,
    });
    // 专题研究
    queryChiefViewpoint({
      type: config.chiefViewpointType[3].value,
    });
    // 大类资产配置分析
    queryMajorAssetsIndexList();
    // 首页紫金时钟当前周期数据
    queryZiJinClockCycle();
    // 首页紫金时钟列表
    queryZiJinViewpointList({
      active: '0', // 根据后端要求暂时写死
    });
  }

  render() {
    const {
      location,
      dayViewpointData,
      monthViewpointData,
      specialStudyData,
      majorAssetsData,
      majorAssetsIndexData,
      majorAssetsDetail,
      queryMajorAssetsDetail,
      ziJinCycleData,
      ziJinClockList,
    } = this.props;
    return (
      <div className={styles.latestViewBox}>
        <div className={styles.top}>
          <div className={styles.item}>
            <ChiefViewpoint
              location={location}
              title="每日首席观点"
              data={dayViewpointData}
              type={config.chiefViewpointType[1].value}
            />
          </div>
          <div className={styles.item}>
            <ChiefViewpoint
              location={location}
              title="每周首席观点"
              data={monthViewpointData}
              type={config.chiefViewpointType[2].value}
            />
          </div>
          <div className={styles.item}>
            <ChiefViewpoint
              location={location}
              title="专题研究"
              data={specialStudyData}
              type={config.chiefViewpointType[3].value}
            />
          </div>
        </div>
        <div className={`${styles.floor} clearfix`}>
          <div className={styles.left}>
            <MajorAssets
              data={majorAssetsData}
              indexData={majorAssetsIndexData}
              detail={majorAssetsDetail}
              getDetail={queryMajorAssetsDetail}
            />
          </div>
          <div className={styles.right}>
            <ZiJinClockViewpoint
              data={ziJinCycleData}
              list={ziJinClockList}
            />
          </div>
        </div>
      </div>
    );
  }
}
