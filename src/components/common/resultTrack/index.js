/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-03 14:00:18
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-08 20:49:36
 * 结果跟踪
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Checkbox, Input, message } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import DropdownSelect from '../dropdownSelect';
import styles from './index.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const Option = Select.Option;
const defaultIndicatorValue = '请选择指标';
// 跟踪窗口期时间列表
// 10天
// 20天
// 30天
const trackWindowDateList = [{
  key: '10',
  value: '10',
}, {
  key: '20',
  value: '20',
}, {
  key: '30',
  value: '30',
}];
// 跟踪窗口期默认30天
const defaultTrackWindowDate = '30';

export default class ResultTrack extends PureComponent {

  static propTypes = {
    // 跟踪窗口期
    trackDate: PropTypes.array,
    // 一级指标目标数据
    indicatorTargetData: PropTypes.array,
    // 搜索出来的产品列表
    searchedProductList: PropTypes.array,
    // 搜索产品
    onSearchProduct: PropTypes.func,
    // 选中某一个产品
    onSelectProductItem: PropTypes.func,
    // 是否选中结果跟踪
    isChecked: PropTypes.bool,
    // 查询指标数据
    queryIndicatorData: PropTypes.func,
    // 存储的任务流程数据
    storedData: PropTypes.object,
  }

  static defaultProps = {
    trackDate: EMPTY_LIST,
    isChecked: true,
    indicatorTargetData: [{}],
    searchedProductList: EMPTY_LIST,
    onSearchProduct: () => { },
    onSelectProductItem: () => { },
    queryIndicatorData: () => { },
    storedData: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    // this.setDefaultState(this.initData(), true);
    this.state = {
      inputValue: '',
      checked: true,
      level2Indicator: [{}],
      level1Indicator: [{}],
      currentSelectedLevel1Indicator: defaultIndicatorValue,
      currentSelectedLevel2Indicator: '',
      currentUnit: '',
      operationType: [{}],
      currentMin: 0,
      currentMax: 0,
      currentIndicatorDescription: '',
      currentSelectedOperation: '',
      originSelectedIndicator: {
        currentSelectedLevel1Indicator: defaultIndicatorValue,
        currentSelectedLevel2Indicator: '',
        currentUnit: '',
        currentSelectedOperation: '',
        currentSelectedTrackDate: '',
        inputValue: '',
      },
      isDataChanged: false,
      currentSelectedTrackDate: '30',
      currentSelectedOperationId: '',
      isProdBound: false,
    };
  }

  componentDidMount() {
    // 初始化获取数据
    const { queryIndicatorData, indicatorTargetData } = this.props;
    if (_.isEmpty(indicatorTargetData)) {
      queryIndicatorData().then(() => {
        const { indicatorTargetData: nextData } = this.props;
        this.setDefaultState(this.initData(nextData));
      });
    } else {
      this.setDefaultState(this.initData(indicatorTargetData));
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const { indicatorTargetData } = this.props;
  //   const { indicatorTargetData: nextData } = nextProps;
  //   console.log('-------------', nextData);
  // }

  @autobind
  setDefaultState({
    level1Indicator,
    level2Indicator,
    currentSelectedOperation,
    currentUnit,
    currentSelectedLevel2Indicator,
    currentSelectedLevel1Indicator,
    currentSelectedTrackDate,
    traceOpList,
    currentMin,
    currentMax,
    currentIndicatorDescription,
    currentSelectedOperationId,
    isProdBound,
    inputIndicator,
    isResultTrackChecked,
    }) {
    const initialData = {
      inputValue: inputIndicator || '',
      checked: _.isEmpty(isResultTrackChecked) ? true : isResultTrackChecked,
      level2Indicator,
      level1Indicator,
      currentSelectedLevel1Indicator,
      currentSelectedLevel2Indicator,
      currentUnit,
      operationType: !_.isEmpty(traceOpList[0]) ? _.map(traceOpList, item => ({
        key: item.key,
        value: item.name,
        id: item.key,
        operation: item.value,
      })) : [{}],
      currentMin,
      currentMax,
      currentIndicatorDescription,
      currentSelectedOperation,
      originSelectedIndicator: {
        currentSelectedLevel1Indicator,
        currentSelectedLevel2Indicator,
        currentUnit,
        currentSelectedOperation,
        currentSelectedTrackDate,
        inputValue: inputIndicator || '',
      },
      isDataChanged: false,
      currentSelectedTrackDate,
      currentSelectedOperationId,
      isProdBound,
    };

    this.setState({
      ...initialData,
    });
  }

  /**
   * 获取二级指标
   */
  @autobind
  getLevel2Indicator(indicatorTargetData) {
    // 先取一级指标的第一个，然后拿出一级指标对应的二级指标
    const { storedData = {} } = this.props;
    const { resultTrackData = {} } = storedData || {};
    const { indicatorLevel1 } = resultTrackData || {};

    let firstIndicator = [];
    let children = [EMPTY_OBJECT];
    if (!_.isEmpty(indicatorTargetData)) {
      firstIndicator = _.find(indicatorTargetData, item =>
        item.key === indicatorLevel1) || indicatorTargetData[0];
      children = firstIndicator.children;
    }
    return _.map(children, item => ({
      key: item.indexCateId,
      value: item.indexCateName,
      id: item.indexCateId,
      unit: item.indexUnit,
      min: item.thresholdMin,
      max: item.thresholdMax,
      isProdBound: item.isProdBound,
      traceOpList: item.traceOpList,
      description: item.description,
    }));
  }

  /**
   * 构造一级指标下拉列表
   *     // // 一级指标id
    // indexId
    // /// 一级指标名称
    // indexName
    // // 二级指标id
    // indexCateId
    // // 二级指标名称
    // indexCateName
    // // 是否和产品绑定
    // isProdBound
    // // 跟踪操作，达到，降到，
    // traceOpList
    // // 输入框类型
    // thresholdType
    // // 下限
    // thresholdMin
    // // 上限
    // thresholdMax
    // // 单位
    // indexUnit
   */
  @autobind
  getLevel1Indicator(indicatorTargetData) {
    return _.map(indicatorTargetData, item => ({
      key: item.indexId,
      value: item.indexName,
      id: item.indexId,
    }));
  }

  /**
   * 向外部组件提供数据
   */
  @autobind
  getData() {
    // 需要向外部提供的数据
    // // 跟踪窗口期
    // trackWindowDate,
    // // 一级指标
    // indicatorLevel1,
    //   // 二级指标
    //   indicatorLevel2,
    //   // 产品编号
    //   productCode,
    //   // 产品名称
    //   productName,
    //   // 操作符key,传给后台,譬如>=/<=
    //   operationKey,
    //   // 操作符name,展示用到，譬如达到/降到
    //   operationValue,
    //   // 当前输入的指标值
    //   inputIndicator,
    //   // 单位
    //   unit,
    //   // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
    //   isHasState,
    //   // 是否有产品搜索
    //   isHasSearchedProduct,
    //   // 是否选中
    //   isChecked: isResultTrackChecked,
    //   // 是否有输入情况
    //   isNeedInput,

    const {
      currentSelectedLevel1Indicator,
      currentSelectedLevel2Indicator,
      currentSelectedOperationId = '',
      currentSelectedOperation,
      currentUnit,
      inputValue = '',
      isProdBound,
      productCode = '',
      productName = '',
      currentSelectedTrackDate,
      checked,
      level1Indicator,
      level2Indicator,
      currentMin,
      currentIndicatorDescription,
      currentMax,
    } = this.state;

    const indicatorLevel1 = _.find(level1Indicator, item =>
      item.value === currentSelectedLevel1Indicator) || {};
    const indicatorLevel2 = _.find(level2Indicator, item =>
      item.value === currentSelectedLevel2Indicator) || {};

    return {
      // 跟踪窗口期
      trackWindowDate: currentSelectedTrackDate,
      // 一级指标
      indicatorLevel1: indicatorLevel1.key || '',
      // 二级指标
      indicatorLevel2: indicatorLevel2.key || '',
      // 产品编号
      productCode,
      // 产品名称
      productName,
      // 操作符key,传给后台,譬如>=/<=
      operationKey: currentSelectedOperationId,
      // 操作符name,展示用到，譬如达到/降到
      operationValue: currentSelectedOperation,
      // 当前输入的指标值
      inputIndicator: inputValue,
      // 单位
      unit: currentUnit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
      isHasState: currentSelectedOperationId === 'TRUE' || currentSelectedOperationId === 'OPEN',
      // 是否有产品搜索
      isHasSearchedProduct: isProdBound,
      // 是否选中
      isResultTrackChecked: checked,
      // 是否有输入情况
      isNeedInput: !_.isEmpty(inputValue),
      currentMin,
      currentIndicatorDescription,
      currentMax,
    };
  }

  @autobind
  setLevel2IndicatorProperty(indicator) {
    let traceOpList = indicator.traceOpList;
    if (_.isArray(traceOpList) && _.isEmpty(traceOpList[0])) {
      traceOpList = [{}];
    }

    this.setState({
      currentUnit: indicator.unit,
      operationType: !_.isEmpty(traceOpList[0]) ? _.map(traceOpList, item => ({
        key: item.key,
        value: item.name,
        id: item.key,
        operation: item.value,
      })) : [{}],
      currentMin: indicator.min,
      currentMax: indicator.max,
      currentIndicatorDescription: indicator.description,
      currentSelectedOperation: traceOpList[0].name,
      inputValue: '',
      isProdBound: indicator.isProdBound,
    });
  }

  @autobind
  initData(data) {
    const level1Indicator = this.getLevel1Indicator(data);
    const level2Indicator = this.getLevel2Indicator(data);
    // 先取一级指标的第一个，然后拿出一级指标对应的二级指标
    const { storedData = {} } = this.props;
    const { resultTrackData = {} } = storedData || {};
    const {
      // 跟踪窗口期
      trackWindowDate,
      // 一级指标
      indicatorLevel1,
      // 二级指标
      indicatorLevel2,
      // 产品编号
      // productCode,
      // 产品名称
      // productName,
      // 操作符key,传给后台,譬如>=/<=
      operationKey,
      // 操作符name,展示用到，譬如达到/降到
      // operationValue,
      // 当前输入的指标值
      inputIndicator,
      // 单位
      unit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
      // isHasState,
      // 是否有产品搜索
      isHasSearchedProduct,
      // 是否选中
      isResultTrackChecked,
      // 是否有输入情况
      // isNeedInput,
      currentSelectedOperation,
      currentMin,
      currentMax,
      currentIndicatorDescription,
    } = resultTrackData;
    let currentSelectedOperationNew = currentSelectedOperation;
    let currentSelectedLevel1Indicator = _.find(level1Indicator, item =>
      item.key === indicatorLevel1) || {};
    currentSelectedLevel1Indicator = currentSelectedLevel1Indicator.value || defaultIndicatorValue;

    let currentSelectedLevel2Indicator = _.find(level2Indicator, item =>
      item.key === indicatorLevel2) || {};
    currentSelectedLevel2Indicator = currentSelectedLevel2Indicator.value
      || level2Indicator[0].value;
    let traceOpList = currentSelectedLevel2Indicator.traceOpList;
    let currentSelectedOperationId = operationKey;
    const description = currentIndicatorDescription;

    if (_.isEmpty(currentSelectedOperationNew)) {
      traceOpList = level2Indicator[0].traceOpList;
      if (_.isArray(traceOpList) && _.isEmpty(traceOpList[0])) {
        traceOpList = [{}];
      }

      currentSelectedOperationNew = traceOpList[0].name;
      currentSelectedOperationId = traceOpList[0].value;
    }
    const currentUnit = unit || level2Indicator[0].unit || '';
    const currentSelectedTrackDate = trackWindowDate || defaultTrackWindowDate;

    return {
      level1Indicator,
      level2Indicator,
      currentSelectedOperation: currentSelectedOperationNew,
      currentUnit,
      currentSelectedLevel2Indicator,
      currentSelectedTrackDate,
      currentSelectedLevel1Indicator,
      currentSelectedOperationId,
      isProdBound: isHasSearchedProduct || level2Indicator[0].isProdBound,
      inputIndicator,
      isResultTrackChecked,
      traceOpList,
      currentMin,
      currentMax,
      currentIndicatorDescription: description || level2Indicator[0].description,
    };
  }

  /**
   * 选中一级指标时，触发handler
   * @param {*string} value 当前选中一级指标值
   */
  @autobind
  handleIndicator1Change(value) {
    const { indicatorTargetData } = this.props;
    // 找到当前一级指标对应的二级指标列表数据
    const level2Indicator = _.find(indicatorTargetData, item => item.indexName === value);
    let children = EMPTY_LIST;
    if (!_.isEmpty(level2Indicator) && !_.isEmpty(level2Indicator.children)) {
      children = level2Indicator.children;
    }
    children = _.map(children, item => ({
      key: item.indexCateId,
      value: item.indexCateName,
      id: item.indexCateId,
      unit: item.indexUnit,
      min: item.thresholdMin,
      max: item.thresholdMax,
      isProdBound: item.isProdBound,
      traceOpList: item.traceOpList,
      description: item.description,
    }));
    const currentLevel2Indicator = children[0];

    // 当前二级指标
    this.setState({
      currentSelectedLevel1Indicator: value,
      level2Indicator: children,
      currentSelectedLevel2Indicator: currentLevel2Indicator.value,
    });
    this.setLevel2IndicatorProperty(currentLevel2Indicator);
  }

  /**
   * 选中二级指标时，change事件handler
   * @param {*string} value 当前选中二级指标值
   */
  @autobind
  handleIndicator2Change(value) {
    const { level2Indicator } = this.state;
    // 找到当前二级指标对应的具体数据
    const currentIndicator = _.find(level2Indicator, item => item.value === value) || {};
    this.setState({
      currentSelectedLevel2Indicator: value,
    });
    this.setLevel2IndicatorProperty(currentIndicator);
  }

  /**
   * checkbox切换handler
   */
  @autobind
  handleCheckChange() {
    const {
      checked,
      originSelectedIndicator,
      currentSelectedLevel1Indicator,
      currentSelectedLevel2Indicator,
      currentUnit,
      currentSelectedOperation,
      currentSelectedTrackDate,
      inputValue,
      } = this.state;
    const newSelectedIndicatorData = {
      currentSelectedLevel1Indicator,
      currentSelectedLevel2Indicator,
      currentUnit,
      currentSelectedOperation,
      currentSelectedTrackDate,
      inputValue,
    };

    if (checked) {
      // 当前即将取消选择
      if (!_.isEqual(originSelectedIndicator, newSelectedIndicatorData)) {
        this.setState({
          isDataChanged: true,
          originSelectedIndicator: newSelectedIndicatorData,
        });
      } else {
        this.setState({
          isDataChanged: false,
        });
      }
    }

    this.setState({
      checked: !checked,
    });
  }

  /**
   * 输入框change事件handler
   * @param {*object} e 当前事件event
   */
  @autobind
  handleInputChange(e) {
    const value = e.target.value;
    const { currentMin = 0, currentMax = 0 } = this.state;
    if (!_.isEmpty(currentMax) && !_.isEmpty(currentMin)) {
      if (Number(value) < currentMin) {
        message.error('不能小于指标最小值');
      }

      if (Number(value) > currentMax) {
        message.error('不能大于指标最大值');
      }
      return;
    }

    this.setState({
      inputValue: value || '',
    });
  }

  @autobind
  handleOperationChange(value) {
    const { operationType } = this.state;
    const currentOperation = _.find(operationType, item =>
      item.value === value) || EMPTY_OBJECT;
    this.setState({
      currentSelectedOperation: value,
      currentSelectedOperationId: currentOperation.operation,
    });
  }

  @autobind
  handleTrackDateChange(value) {
    this.setState({
      currentSelectedTrackDate: value,
    });
  }

  /**
   * 取消结果跟踪时的提示信息
   */
  @autobind
  renderCheckWarning() {
    message.error('您已设置结果跟踪指标，如果取消选择将不对此任务进行结果跟踪');
  }

  render() {
    const {
      searchedProductList,
      onSearchProduct,
      onSelectProductItem,
    } = this.props;

    const {
      inputValue,
      checked,
      operationType,
      currentMax,
      currentMin,
      currentUnit,
      currentIndicatorDescription,
      currentSelectedLevel1Indicator,
      currentSelectedLevel2Indicator,
      currentSelectedOperation,
      level1Indicator,
      level2Indicator,
      isDataChanged,
      currentSelectedTrackDate,
      isProdBound,
     } = this.state;

    return (
      <div className={styles.resultTrackContainer}>
        <div className={styles.title}>
          <Checkbox checked={checked} onChange={this.handleCheckChange}>结果跟踪</Checkbox>
        </div>
        <div className={styles.divider} />
        <div className={styles.container}>
          <div className={styles.resultTrackWindow}>
            <div className={styles.title}>
              跟踪窗口期（自任务实施日开始）
            </div>
            <div className={styles.content}>
              <Select
                disabled={!checked}
                value={currentSelectedTrackDate}
                onChange={this.handleTrackDateChange}
              >
                {_.map(trackWindowDateList, item =>
                  <Option key={item.value} value={item.value}>{item.value}</Option>)}
              </Select>
            </div>
          </div>
          <div className={styles.indicatorTargetData}>
            <div className={styles.title}>
              指标目标
            </div>
            <div className={styles.content}>
              <div className={styles.indicatorLevel1}>
                <Select
                  disabled={!checked}
                  className={styles.level1Select}
                  onChange={this.handleIndicator1Change}
                  value={currentSelectedLevel1Indicator}
                >
                  {_.map(level1Indicator, item =>
                    <Option key={item.value} value={item.value}>{item.value}</Option>)}
                </Select>
              </div>
              {
                currentSelectedLevel1Indicator !== defaultIndicatorValue ?
                  <div className={styles.remainingContent}>
                    <div className={styles.indicatorLevel2}>
                      <Select
                        disabled={!checked}
                        className={classnames({
                          [styles.level2Select]: true,
                          [styles.hideSelectArrow]: _.size(level2Indicator) <= 1,
                        })}
                        value={currentSelectedLevel2Indicator}
                        onChange={this.handleIndicator2Change}
                      >
                        {_.map(level2Indicator, item =>
                          <Option key={item.value} value={item.value}>{item.value}</Option>)}
                      </Select>
                    </div>
                    {/**
                     * 当isProdBound为true时，代表有搜索产品功能
                     */}
                    {
                      isProdBound ? <div className={styles.indicatorLevel3}>
                        <DropdownSelect
                          theme="theme2"
                          showObjKey="productName"
                          objId="productCode"
                          placeholder="产品编码/产品名称"
                          name="产品"
                          disable={!checked}
                          value={'请搜索产品'}
                          searchList={searchedProductList}
                          emitSelectItem={onSelectProductItem}
                          emitToSearch={onSearchProduct}
                        />
                      </div> : null
                    }

                    {/**
                     * 如果operation是TRUE或者OPEN,不需要输入框，也不需要单位，只需要显示一个状态：完善/开通/是
                     */}
                    {
                      ((!_.isEmpty(operationType)
                        && !_.isEmpty(operationType[0])
                        && _.isArray(operationType)
                        && _.size(operationType) === 1
                        && (operationType[0].operation === 'TRUE'
                          || operationType[0].operation === 'OPEN')) || (_.isEmpty(operationType[0])))
                        ? <div className={styles.hasStateIndicator}>
                          <span>状态：</span>
                          <span>{operationType[0].value}</span>
                        </div> :
                        <div className={styles.noStateIndicator}>
                          <div className={styles.condition}>
                            {
                              (_.isArray(operationType) && _.size(operationType) > 1) ?
                                <Select
                                  disabled={!checked}
                                  value={currentSelectedOperation}
                                  onChange={this.handleOperationChange}
                                  className={classnames({
                                    [styles.operationSelect]: true,
                                    [styles.hideSelectArrow]: _.size(operationType) <= 1,
                                  })}
                                >
                                  {
                                    _.map(operationType, item =>
                                      <Option key={item.value} value={item.value}>
                                        {item.value}
                                      </Option>)
                                  }
                                </Select> :
                                <span>{operationType[0].value}</span>
                            }
                          </div>
                          <div className={styles.text}>
                            <Input
                              disabled={!checked}
                              placeholder={''}
                              value={inputValue}
                              min={currentMin}
                              max={currentMax}
                              onChange={this.handleInputChange}
                            />
                          </div>
                          {
                            !_.isEmpty(currentUnit) ?
                              <div className={styles.unit}>
                                <span>{currentUnit}</span>
                              </div> : null
                          }
                        </div>
                    }
                  </div>
                  : null
              }
            </div>
          </div>
        </div>
        <div className={styles.indicatorDescription}>
          <span>总净资产：</span>
          <span>{currentIndicatorDescription}</span>
        </div>
        {
          (!checked && isDataChanged) ?
            this.renderCheckWarning()
            : null
        }
      </div>
    );
  }
}
