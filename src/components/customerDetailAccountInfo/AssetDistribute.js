/*
 * @Author: sunweibin
 * @Date: 2018-10-11 16:30:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-10 13:42:12
 * @description 新版客户360详情下账户信息Tab下的资产分布组件
 */
import React, { PureComponent } from 'react';
import { Checkbox, Table, Popover } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import IfTableWrap from '../common/IfTableWrap';
import PlaceHolder from '../common/placeholderImage';
import IFWrap from '../common/biz/IfWrap';
import IECharts from '../IECharts';
import Icon from '../common/Icon';
import DebtDetailModal from './DebtDetailModal';
import {
  TABLE_SCROLL_SETTING,
  CHART_SERIES_OPTIONS,
  CHART_RADAR_OPTIONS,
  SPECIFIC_INITIAL_NAME,
  SPECIFIC_INITIAL_KEY,
} from './config';
import {
  convertMoney,
  displayMoney,
  displayMoneyWithoutUnit,
} from './utils';
import { composeIndicatorAndData, pickRadarDisplayData } from './assetRadarHelper';
import { number } from '../../helper';
import logable, { logPV, logCommon } from '../../decorators/logable';
import styles from './assetDistribute.less';

export default class AssetDistribute extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询资产分布的雷达图数据
    getAssetRadarData: PropTypes.func.isRequired,
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
      // 保存以前的props指标详情数据
      prevData: props.specificIndexData,
      // 选中含信用的checkbox
      checkedCredit: true,
      // 负债详情弹出层
      debtDetailModal: false,
      // 高亮的哪个雷达图指标的名称和key
      indexKey: SPECIFIC_INITIAL_KEY,
      radarIndexName: SPECIFIC_INITIAL_NAME,
      // 资产分布右侧详情打开的行的key,因为默认打开全部的行，
      // 但是antd的Table表格的defaultExpandAllRows,只是一次性使用，当数据变化了之后，还是根据以前的key值来展开行
      assetDetailExpandKeys: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevData } = prevState;
    const { specificIndexData } = nextProps;
    if (specificIndexData !== prevData) {
      // 如果发现指标详情数据变化了，则修改展开的指标key
      return {
        assetDetailExpandKeys: _.map(specificIndexData, item => item.key),
      };
    }
    return null;
  }

  componentDidMount() {
    this.getInitialData();
  }

  componentDidUpdate(prevProps) {
    // 如果 custId不同需要重新查一下数据
    const {
      location: {
        query: { custId: nextCustId },
      },
    } = this.props;
    const {
      location: {
        query: { custId: prevCustId },
      },
    } = prevProps;
    if (nextCustId !== prevCustId && _.isEmpty(nextCustId)) {
      this.freshDataForDiffUser();
    }
  }

  // 获取初始化或者刷新数据
  @autobind
  getInitialData() {
    const { indexKey, checkedCredit } = this.state;
    const {
      location: { query: { custId } },
      getAssetRadarData,
      querySpecificIndexData,
    } = this.props;
    // 判断是否含信用
    const creditFlag = checkedCredit ? 'Y' : 'N';
    getAssetRadarData({
      creditFlag,
      custId,
    });
    querySpecificIndexData({
      indexKey,
      creditFlag,
      custId,
    });
  }

  // 处理表格表头的配置项
  @autobind
  getIndexTableColumns() {
    return [
      {
        width: '30%',
        title: '资产',
        dataIndex: 'name',
        key: 'name',
        render: this.renderTableZichanColumn,
      },
      {
        width: '20%',
        title: '持仓金额',
        dataIndex: 'value',
        key: 'value',
        align: 'right',
        render: this.renderTableValueColumn,
      },
      {
        width: '15%',
        title: '持仓占比',
        dataIndex: 'percent',
        key: 'percent',
        align: 'right',
        render: this.renderTablePercentColumn,
      },
      {
        width: '35%',
        title: '收益    ',
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
    // TODO 需要将雷达图的数据做一步过滤处理，处理出需要展示到雷达图上的数据
    const filteredData = pickRadarDisplayData(radarData || []);
    // 1. 获取雷达图的指标名称及
    const indicators = _.map(filteredData, item => ({ name: item.name }));
    // 2. 获取雷达图的每一项指标的值
    const value = _.map(filteredData, item => item.value || 0);
    // 3. 因为UI图上面需要在指标名称下显示指标的值，但是echart上并没有这个功能
    // 所以此处需要将指标名称和其指标值先进行拼接起来，然后在区分开
    const composedIndicators = composeIndicatorAndData(indicators, value);
    // 4. 生成雷达图的配置项
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
            const indexValue = displayMoneyWithoutUnit(Number(nameLable[2]));
            if (radarIndexName === axisName) {
              return `{hightLightName|${axisName}}\n{hightLightValue|${indexValue}}`;
            }
            return `{name|${axisName}}\n{value|${indexValue}}`;
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

  // 刷新数据
  @autobind
  freshDataForDiffUser() {
    // 刷新数据时，需要将页面展示成默认
    this.setState({
      checkedCredit: true,
      debtDetailModal: false,
      indexKey: SPECIFIC_INITIAL_KEY,
      radarIndexName: SPECIFIC_INITIAL_NAME,
    }, this.getInitialData);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '含信用' },
  })
  handleCreditCheckboxChange(e) {
    const { checked } = e.target;
    // 点击含信用checkbox后，需要指标选项全部更换到默认的初始值，并查询相应的数据
    this.setState({
      checkedCredit: checked,
      indexKey: SPECIFIC_INITIAL_KEY,
      radarIndexName: SPECIFIC_INITIAL_NAME,
    }, this.getInitialData);
  }

  // 打开负债详情的弹框
  @autobind
  @logPV({
    pathname: '/modal/custDetailAccountDebtDetailModal',
    title: '负债详情',
  })
  handleDebtDetailIconClick() {
    this.setState({ debtDetailModal: true });
  }

  // 关闭负债详情弹框
  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' },
  })
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
    this.setState({
      indexKey: data.key,
      radarIndexName: axisName,
    });
    this.props.querySpecificIndexData({
      indexKey: data.key,
      creditFlag,
      custId,
    });
    // 通过 dataIndex 查找到相应的原始数据，从而上传真实的数据
    logCommon({
      type: 'Click',
      payload: {
        name: data.name,
        value: data.value
      },
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '展开/收起资产分布表格行详情' }
  })
  handleExpandChange(expanded, record) {
    const { key } = record;
    let { assetDetailExpandKeys } = this.state;
    if (!expanded) {
      // 如果是，则删除
      assetDetailExpandKeys = _.filter(assetDetailExpandKeys, item => item !== key);
    } else {
      // 如果不是展开，则添加到展开行数据中
      assetDetailExpandKeys = _.concat(assetDetailExpandKeys, [key]);
    }
    this.setState({
      assetDetailExpandKeys,
    });
  }

  // 渲染表格资产列数据
  @autobind
  renderTableZichanColumn(value, record) {
    const { isCreditProduct } = record;
    return (
      <div className={styles.zichanCell}>
        <div className={styles.zichanText}>
          {
            isCreditProduct ? (<span className={styles.icon}>融</span>) : null
          }
          <span className={styles.value} title={value}>{value}</span>
        </div>
      </div>
    );
  }

  // 渲染持仓金额的单元格
  @autobind
  renderTableValueColumn(value) {
    const holdText = displayMoney(value || 0);
    return holdText;
  }

  // 渲染占比的单元格
  @autobind
  renderTablePercentColumn(value) {
    const percentText = number.convertRate(value || 0);
    return percentText;
  }

  // 渲染收益/收益率的单元格
  @autobind
  renderTableProfitColumn(profit) {
    // TODO 本期暂时不展示收益率，后期需要展示，所以暂时保留处理逻辑
    // const { profitPercent } = record;
    // const fixedPercent = profitPercent || 0;
    // 需要判断数值，如果是>=0的数显示红色并带有加号
    // 如果是<0数显示成绿色，并带有减号
    // const isAsc = fixedPercent >= 0;
    // 此处针对超大的百分比数据进行特殊处理
    // let percentStr = number.convertRate(fixedPercent);
    // if (fixedPercent > 10) {
    //   percentStr = '>999%';
    // } else if (fixedPercent < -10) {
    //   percentStr = '<-999%';
    // }
    // const percentText = isAsc ? `+${percentStr}` : `${percentStr}`;
    // const profitRateCls = cx({
    //   [styles.profitRate]: true,
    //   [styles.isAsc]: isAsc,
    // });
    const profitText = displayMoney(profit || 0);
    return (
      <div className={styles.indexHoldValueCell}>
        <span className={styles.profit}>{profitText}</span>
        {/*
          // TODO 本期暂时不展示收益率，后期需要展示
          <span className={profitRateCls}>{percentText}</span>
         */}
      </div>
    );
  }

  render() {
    const {
      checkedCredit,
      debtDetailModal,
      radarIndexName,
      assetDetailExpandKeys,
    } = this.state;
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
    const totalMoney = convertMoney(totalAsset || 0, { unit: '元' });
    // 负债
    const totalDebt = convertMoney(debt || 0, { unit: '元' });
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
                <PlaceHolder title="暂无资产分布数据" />
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
                    <IFWrap isRender={checkedCredit}>
                      <span className={styles.summaryInfo}>
                        <span className={styles.label}>负债：</span>
                        <span className={styles.value}>{totalDebt.value}</span>
                        <span className={styles.unit}>{totalDebt.unit}</span>
                        <span className={styles.infoIco}>
                          <Popover overlayClassName={styles.labelPopover} content="此处仅为融资融券负债">
                            <Icon type="tishi2" />
                          </Popover>
                        </span>
                      </span>
                    </IFWrap>
                  </div>
                </div>
                <div className={styles.indexDetailArea}>
                  <IfTableWrap isRender={!_.isEmpty(specificIndexData)} text={`无${radarIndexName}明细`}>
                    <Table
                      expandedRowKeys={assetDetailExpandKeys}
                      rowKey="key"
                      indentSize={0}
                      className={styles.indexDetailTable}
                      dataSource={specificIndexData}
                      columns={columns}
                      pagination={false}
                      scroll={TABLE_SCROLL_SETTING}
                      onExpand={this.handleExpandChange}
                    />
                  </IfTableWrap>
                </div>
              </div>
            )
        }
        <IFWrap isRender={debtDetailModal}>
          <DebtDetailModal
            location={location}
            onClose={this.handleCloseDebtDetailModal}
            queryDebtDetail={queryDebtDetail}
            debtDetail={debtDetail}
          />
        </IFWrap>
      </div>
    );
  }
}
