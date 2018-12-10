/*
 * @Author: zhangjun
 * @Date: 2018-12-05 13:03:49
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-08 21:38:44
 * @description 资产配置变动走势
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import IfWrap from '../../common/biz/IfWrap';
import AssetConfigHeader from './AssetConfigHeader';
import AssetConfigTrendChart from './AssetConfigTrendChart';
import Summary from '../Summary';
import { data } from '../../../helper';
import { LARGE_CLASS_ASSET, ASSET_TREND_TIP } from './config';
import logable from '../../../decorators/logable';
import styles from './assetConfigTrend.less';

export default class AssetConfigTrend extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取资产配置变动走势
    getAssetConfigTrend: PropTypes.func.isRequired,
    // 资产配置变动走势数据
    assetConfigTrendData: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      classifyType: LARGE_CLASS_ASSET,
    };
  }

  componentDidMount() {
    // 获取资产配置变动走势
    this.getAssetConfigTrend();
  }

  // 获取资产配置变动走势
  @autobind
  getAssetConfigTrend() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    const { classifyType } = this.state;
    this.props.getAssetConfigTrend({
      custId,
      classifyType,
    });
  }

  // 获取资产配置变动走势描述
  @autobind
  getAssetTrendSummary() {
    const {
      assetConfigTrendData: {
        assetConfigTrendSummary,
      },
    } = this.props;
    if (!_.isEmpty(assetConfigTrendSummary)) {
      const {
        minRateCategory,
        maxRateCategory,
        maxChangeCategory,
      } = assetConfigTrendSummary;
      const assetRateText = `统计期内客户投资比例最高的是${maxRateCategory}，投资比例最低的是${minRateCategory}。`;
      const assetChangeText = `统计期内${maxChangeCategory}资产持仓占比变化最大。`;
      return (
        <div>
          <p key={data.uuid()}>
            <span>{assetRateText}</span>
          </p>
          <p key={data.uuid()}>
            <span>{assetChangeText}</span>
          </p>
        </div>
      );
    }
    return null;
  }

  // 更改资产分类
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '资产分类方式',
      value: '$args[0].value',
    }
  })
  handleClassifyTypeChange(option) {
    const { value } = option;
    this.setState({ classifyType: value }, this.getAssetConfigTrend);
  }

  render() {
    const {
      assetConfigTrendData: {
        assetConfigTrendChart,
      }
    } = this.props;
    const {
      classifyType,
    } = this.state;
    // 资产配置变动走势提示
    const assetTrendTipData = _.map(ASSET_TREND_TIP, item => <p key={data.uuid()}>{item}</p>);
    // 资产配置变动走势描述
    const assetTrendSummaryData = this.getAssetTrendSummary();
    return (
      <div className={styles.assetConfigTrend}>
        <AssetConfigHeader
          title="资产配置变动走势"
          classifyType={classifyType}
          onChange={this.handleClassifyTypeChange}
        />
        <IfWrap isRender={!_.isEmpty(assetConfigTrendChart)}>
          <div className={styles.configTrendContainer}>
            <AssetConfigTrendChart
              assetConfigTrendChart={assetConfigTrendChart}
            />
            <div className={styles.assetTrendTips}>
              <div className={styles.label}>注：</div>
              <div className={styles.value}>
                {assetTrendTipData}
              </div>
            </div>
            <Summary>
              {assetTrendSummaryData}
            </Summary>
          </div>
        </IfWrap>
      </div>
    );
  }
}
