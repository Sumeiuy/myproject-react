/*
 * @Author: sunweibin
 * @Date: 2018-10-11 16:30:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 12:30:25
 * @description 新版客户360详情下账户信息Tab下的资产分布组件
 */
import React, { PureComponent } from 'react';
import { Checkbox, Table } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { autobind } from 'core-decorators';

import IECharts from '../IECharts';
import Icon from '../common/Icon';
import DebtDetailModal from './DebtDetailModal';
import {
  TABLE_SCROLL_SETTING,
  CHART_SERIES_OPTIONS,
  CHART_RADAR_OPTIONS,
} from './config';
import { convertMoney } from './utils';
import { composeIndicatorAndData } from './assetRadarHelper';
import logable, { logPV, logCommon } from '../../decorators/logable';
import styles from './assetDistribute.less';

export default class AssetDistribute extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 点击含信用的checkbox
    onClickCredit: PropTypes.func.isRequired,
    // 资产分布雷达图数据
    assetsRadarData: PropTypes.object.isRequired,
    // 负债详情数据
    debtDetail: PropTypes.object.isRequired,
    // 查询负债详情数据接口
    queryDebtDetail: PropTypes.func.isRequired,
    // 查询资产分布的雷达上具体指标的数据
    querySpecificIndexData: PropTypes.func.isRequired,
    // 资产分布的雷达上具体指标的数据
    specificIndexData: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      // 选中含信用的checkbox
      checkedCredit: true,
      // 负债详情弹出层
      debtDetailModal: false,
      // 高亮的哪个雷达图指标的名称
      radarIndexName: '股票',
    };
  }

  @autobind
  setRowClassName(record) {
    // 给表格的内容区域设置一个类名，来覆盖表头column设置的样式
    const { children } = record;
    return _.isEmpty(children) ? '' : 'fixRowPadding';
  }

  // 处理表格表头的配置项
  @autobind
  getIndexTableColumns() {
    return [
      {
        width: 140,
        title: '资产',
        dataIndex: 'name',
        key: 'name',
        className: styles.zichanCls,
      },
      {
        width: 140,
        title: '持仓金额/占比',
        dataIndex: 'value',
        key: 'value',
        className: styles.holdValueCls,
        render: this.renderTableValueColumn,
      },
      {
        title: '收益/收益率',
        dataIndex: 'profit',
        key: 'profit',
        className: styles.profitCls,
        render: this.renderTableProfitColumn,
      },
    ];
  }

  // 获取雷达图的配置
  @autobind
  getRadarOption(radarData) {
    // 1. 获取雷达图的指标名称及
    const indicators = _.map(radarData, item => ({ name: item.name }));
    // 2. 获取雷达图的每一项指标的值,并且是格式化后的值
    const data = _.map(radarData, item => convertMoney(item.value || 0, { formater: true }));
    // 3. 因为UI图上面需要在指标名称下显示指标的值，但是echart上并没有这个功能
    // 所以此处需要将指标名称和其指标值先进行拼接起来，然后在区分开
    const composedIndicators = composeIndicatorAndData(indicators, data);
    // 4. 取出data中的值的数据
    const value = _.map(data, item => item.value);
    // 5. 生成雷达图的配置项
    return {
      radar: {
        ...CHART_RADAR_OPTIONS,
        name: {
          ...CHART_RADAR_OPTIONS.name,
          formatter: (name) => {
            // 此时的name中含有了指标的值,并且是用|分割
            // 三个值分别是指标名称、指标索引、指标值
            const nameLable = name.split('|');
            const axisName = nameLable[0];
            const { radarIndexName } = this.state;
            if (radarIndexName === axisName) {
              return `{hightLightName|${axisName}}\n{hightLightValue|${nameLable[2]}}`;
            }
            return `{name|${axisName}}\n{value|${nameLable[2]}}`;
          },
        },
        indicator: composedIndicators,
      },
      series: [{
        ...CHART_SERIES_OPTIONS,
        data: [{
          name: '资产分布',
          value,
        }],
      }],
    };
  }


  @autobind
  @logable({ type: 'Click', payload: { name: '含信用' } })
  handleCreditCheckboxChange(e) {
    const { checked } = e.target;
    // 重新渲染数据
    this.setState({
      checkedCredit: checked,
      axiosName: '股票',
    });
    // 切换含信用的 checkbox 需要查询雷达图的数据
    const creditFlag = checked ? 'Y' : 'N';
    const { location: { query: { custId } } } = this.props;
    this.props.onClickCredit({ creditFlag, custId });
  }

  // 打开负债详情的弹框
  @autobind
  @logPV({ pathname: '/modal/custDetailAccountDebtDetailModal', title: '负债详情' })
  handleDebtDetailIconClick() {
    this.setState({ debtDetailModal: true });
  }

  // 关闭负债详情弹框
  @autobind
  handleCloseDebtDetailModal() {
    this.setState({ debtDetailModal: false });
  }

  // 当雷达图加载完成后，给雷达图的轴添加点击事件
  @autobind
  handleRadarChartReady(echartInstance) {
    if (echartInstance) {
      echartInstance.on('click', (args) => {
        const { targetType, name } = args;
        if (targetType === 'axisName') {
          // 因为雷达图上点击指标名称，实际上点击的是图标轴相应，所以没法找到实际的index值，
          // 所以只能使用雷达图的轴名称来控制,轴名称实际有3部分组成，指标名称、指标索引、指标值
          const axisNameData = name.split('\n')[0];
          if (axisNameData.indexOf('name') > -1) {
            // 已经高亮的数据不需要再次查询
            const axisName = axisNameData.match(/\{name\|(.+)\}/)[1];
            this.hanleRadarAxisNameClick(axisName);
          }
        }
      });
    }
  }

  // 点击雷达图上的指标项
  @autobind
  hanleRadarAxisNameClick(axisName) {
    const { checkedCredit } = this.state;
    // 切换含信用的 checkbox 需要查询雷达图的数据
    const creditFlag = checkedCredit ? 'Y' : 'N';
    // 通过 dataIndex 查找到相应资产分布的数据，然后查询其详情
    const {
      assetsRadarData: { assetIndexData },
      location: { query: { custId } },
    } = this.props;
    const data = _.find(assetIndexData, item => item.name === axisName);
    this.setState({ radarIndexName: axisName });
    this.props.querySpecificIndexData({ indexKey: data.key, creditFlag, custId });
    // 通过 dataIndex 查找到相应的原始数据，从而上传真实的数据
    logCommon({
      type: 'Click',
      payload: {
        name: data.name,
        value: data.value
      },
    });
  }

  // 渲染持仓金额和占比的单元格
  @autobind
  renderTableValueColumn(value, record) {
    const { percent } = record;
    const percentText = `${percent * 100}%`;
    return (
      <div className={styles.indexHoldValueCell}>
        <span className={styles.value}>{value}</span>
        <span className={styles.percent}>{percentText}</span>
      </div>
    );
  }

  // 渲染收益/收益率的单元格
  @autobind
  renderTableProfitColumn(profit, record) {
    const { profitPercent } = record;
    // 需要判断数值，如果是>=0的数显示红色并带有加号
    // 如果是<0数显示成绿色，并带有减号
    const isAsc = profitPercent >=0;
    const percentText = isAsc ? `+${profitPercent * 100}%` : `${profitPercent * 100}%`;
    const profitRateCls = cx({
      [styles.profitRate]: true,
      [styles.isAsc]: isAsc,
    });
    return (
      <div className={styles.indexHoldValueCell}>
        <span className={styles.profit}>{profit}</span>
        <span className={profitRateCls}>{percentText}</span>
      </div>
    );
  }

  render() {
    const { checkedCredit, debtDetailModal } = this.state;
    const {
      assetsRadarData: { assetIndexData, totalAsset, debt },
      debtDetail,
      queryDebtDetail,
      location,
      specificIndexData,
    } = this.props;
    // 如果没有雷达图数据，则整块资产分布不显示
    const hasNoRadarData = _.isEmpty(assetIndexData);
    // 总资产
    const totalMoney = convertMoney(totalAsset, { unit: '元' });
    // 负债
    const totalDebt = convertMoney(debt, { unit: '元' });
    // 获取雷达图的option
    const radarOption = this.getRadarOption(assetIndexData || []);
    // 获取表格的columns数据
    const columns = this.getIndexTableColumns();

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>资产分布（元）</span>
          <span className={styles.checkbox}>
            <Checkbox
              checked={checkedCredit}
              onChange={this.handleCreditCheckboxChange}
            >
              含信用
            </Checkbox>
          </span>
        </div>
        {
          hasNoRadarData
            ? (
              <div className={styles.body}>
                <div className={styles.noRadarData}>
                  <div className={styles.noDataHead}><Icon type="zanwushuju" className={styles.noDataIcon} /></div>
                  <div className={styles.noDataTip}>暂无资产分布数据</div>
                </div>
              </div>
            )
            : (
               <div className={styles.body}>
                <div className={styles.radarArea}>
                  <div className={styles.radarChart}>
                    <IECharts
                      resizable
                      option={radarOption}
                      onReady={this.handleRadarChartReady}
                      style={{ height: '220px' }}
                    />
                  </div>
                  <div className={styles.summary}>
                    <span className={styles.summaryInfo}>
                      <span className={styles.label}>总资产：</span>
                      <span className={styles.value}>{totalMoney.value}</span>
                      <span className={styles.unit}>{totalMoney.unit}</span>
                    </span>
                    <span className={styles.summaryInfo}>
                      <span className={styles.label}>负债：</span>
                      <span className={styles.value}>{totalDebt.value}</span>
                      <span className={styles.unit}>{totalDebt.unit}</span>
                      <span className={styles.infoIco} onClick={this.handleDebtDetailIconClick}>
                        <Icon type="tishi2" />
                      </span>
                    </span>
                  </div>
                </div>
                <div className={styles.indexDetailArea}>
                  <Table
                    indentSize={0}
                    className={styles.indexDetailTable}
                    dataSource={specificIndexData}
                    columns={columns}
                    pagination={false}
                    rowClassName={this.setRowClassName}
                    scroll={TABLE_SCROLL_SETTING}
                  />
                </div>
              </div>
            )
        }
        {
          debtDetailModal
            ? (
                <DebtDetailModal
                  location={location}
                  onClose={this.handleCloseDebtDetailModal}
                  queryDebtDetail={queryDebtDetail}
                  debtDetail={debtDetail}
                />
              )
            : null
        }
      </div>
    );
  }
}

