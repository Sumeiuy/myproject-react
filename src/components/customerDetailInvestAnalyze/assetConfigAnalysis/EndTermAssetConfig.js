/*
 * @Author: zhangjun
 * @Date: 2018-12-04 10:00:23
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-05 12:09:03
 * @description 期末资产配置
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import AssetConfigHeader from './AssetConfigHeader';
import EndTermAssetChart from './EndTermAssetChart';
import EndTermAssetTable from './EndTermAssetTable';
import Summary from '../Summary';
import { data } from '../../../helper';
import { END_TERM_ASSET_TIP, LARGE_CLASS_ASSET } from './config';
import logable from '../../../decorators/logable';
import styles from './endTermAssetConfig.less';

export default class EndTermAssetConfig extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取期末资产配置数据
    getEndTermAssetConfig: PropTypes.func.isRequired,
    // 期末资产配置数据
    endTermAssetConfigData: PropTypes.object.isRequired,
    // 期间总收益
    periodTotalProfit: PropTypes.number.isRequired,
    // 期间收益贡献度最大类别
    maxCategory: PropTypes.string.isRequired,
    // 期间收益贡献度最小类别
    minCategory: PropTypes.string.isRequired,
    // 客户资产配置占比排序
    assetConfigRate: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      classify: LARGE_CLASS_ASSET,
    };
  }

  componentDidMount() {
    // 获取期末资产配置数据
    this.getEndTermAssetConfig();
  }

  // 获取期末资产配置数据
  @autobind
  getEndTermAssetConfig() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    const { classify } = this.state;
    this.props.getEndTermAssetConfig({
      custId,
      classify,
    });
  }

  // 获取期末资产配置描述
  @autobind
  getEndTermAssetSummary() {
    const {
      endTermAssetConfigData: {
        periodTotalProfit,
        maxCategory,
        minCategory,
        assetConfigRate = [],
      }
    } = this.props;
    const periodProfitText = `统计期内客户实现盈利${periodTotalProfit}万元，其中${maxCategory}类对盈利贡献最高，${minCategory}类收益最低。`;
    let assetConfigRateText = '';
    if (_.isArray(assetConfigRate) && !_.isEmpty(assetConfigRate)) {
      // assetConfigRate数据后端返回的是一个数组，需要转化成字符串
      const assetConfigRateStr = _.join(assetConfigRate, '、');
      if (assetConfigRate.length >= 3) {
        assetConfigRateText = `客户资产配置占比由高到低依次为${assetConfigRateStr}。客户有一定的资产配置理念，后期可参考华泰证券资产配置方案，优化各类资产配置权重，提高风险调整后收益比。`;
      } else {
        assetConfigRateText = `客户资产配置占比由高到低依次为${assetConfigRateStr}。客户资产过于集中配置，建议后期参考华泰证券资产配置方案，优化各类资产配置权重，提高风险调整后收益比。`;
      }
    }
    return (
      <div>
        <p><span>{periodProfitText}</span></p>
        <p><span>{assetConfigRateText}</span></p>
      </div>
    );
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
  handleClassifyChange(option) {
    const { value } = option;
    this.setState({ classify: value }, this.getEndTermAssetConfig);
  }

  render() {
    const {
      endTermAssetConfigData: {
        endTermAssetTableData = [],
        totalAsset,
        liabilities,
      }
    } = this.props;
    const {
      classify
    } = this.state;
    // 期末资产配置提示
    const endTermAssetTipData = _.map(END_TERM_ASSET_TIP, item => <p key={data.uuid()}>{item}</p>);
    // 期末资产配置描述
    const endTermAssetSummaryData = this.getEndTermAssetSummary();
    return (
      <div className={styles.endTermAssetConfig}>
        <AssetConfigHeader
          title="期末资产配置"
          classify={classify}
          onChange={this.handleClassifyChange}
        />
        <div className={styles.endTermAssetContainer}>
          <div className={styles.endTermAssetChartBox}>
            <EndTermAssetChart
              endTermAssetTableData={endTermAssetTableData}
              totalAsset={totalAsset}
              liabilities={liabilities}
            />
            <EndTermAssetTable
              endTermAssetTableData={endTermAssetTableData}
            />
          </div>
          <div className={styles.endTermAssetTips}>
            <div className={styles.label}>注：</div>
            <div className={styles.value}>
              {endTermAssetTipData}
            </div>
          </div>
          <Summary>
            {endTermAssetSummaryData}
          </Summary>
        </div>
      </div>
    );
  }
}
