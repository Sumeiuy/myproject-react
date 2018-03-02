/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-03 14:00:18
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-22 17:28:32
 * 结果跟踪
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Checkbox, InputNumber, message, DatePicker } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import { autobind } from 'core-decorators';
import DropdownSelect from '../dropdownSelect';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import styles from './index.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const Option = Select.Option;
const defaultIndicatorValue = '请选择指标';

// 跟踪窗口期默认0天
const defaultTrackWindowDate = 0;

@RestoreScrollTop
export default class ResultTrack extends PureComponent {

  static propTypes = {
    // 跟踪窗口期
    trackDate: PropTypes.array,
    // 一级指标目标数据
    indicatorTargetData: PropTypes.array,
    // 搜索出来的产品列表
    searchedProductList: PropTypes.array,
    // 搜索产品
    queryProduct: PropTypes.func,
    // 选中某一个产品
    onSelectProductItem: PropTypes.func,
    // 是否选中结果跟踪
    isChecked: PropTypes.bool,
    // 查询指标数据
    queryIndicatorData: PropTypes.func,
    // 存储的任务流程数据
    storedData: PropTypes.object,
    // 该用户是否需要审批
    needApproval: PropTypes.bool,
  }

  static defaultProps = {
    trackDate: EMPTY_LIST,
    isChecked: true,
    needApproval: false,
    indicatorTargetData: [{}],
    searchedProductList: EMPTY_LIST,
    queryProduct: () => { },
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
      currentSelectedOperationName: '',
      currentSelectedOperationValue: '',
      currentSelectedTrackDate: this.getfirstAllowedDate(),
      currentSelectedOperationId: '',
      isProdBound: false,
      currentSelectedProduct: {},
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

  @autobind
  setDefaultState({
    level1Indicator,
    level2Indicator,
    currentSelectedOperationName,
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
    currentSelectedProduct,
    }) {
    const initialData = {
      inputValue: inputIndicator || '',
      checked: _.isBoolean(isResultTrackChecked) ? isResultTrackChecked : true,
      level2Indicator,
      level1Indicator,
      currentSelectedLevel1Indicator,
      currentSelectedLevel2Indicator,
      currentUnit,
      operationType: !_.isEmpty(traceOpList[0]) ? _.map(traceOpList, item => ({
        key: item.key,
        value: item.name,
        id: item.key,
      })) : [{}],
      currentMin,
      currentMax,
      currentIndicatorDescription,
      currentSelectedOperationName,
      currentSelectedTrackDate,
      currentSelectedOperationId,
      isProdBound,
      currentSelectedProduct,
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
    const { indicatorLevel1Key } = resultTrackData || {};

    let firstIndicator = [];
    let children = [EMPTY_OBJECT];
    if (!_.isEmpty(indicatorTargetData)) {
      firstIndicator = _.find(indicatorTargetData, item =>
        item.indexId === indicatorLevel1Key) || indicatorTargetData[0];
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
      indexRemark: item.indexRemark,
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
    // indicatorLevel1Key,
    //   // 二级指标
    //   indicatorLevel2Key,
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
    //   hasState,
    //   // 是否有产品搜索
    //   hasSearchedProduct,
    //   // 是否选中
    //   isChecked: isResultTrackChecked,
    //   // 是否有输入情况
    //   isNeedInput,

    const {
      currentSelectedLevel1Indicator,
      currentSelectedLevel2Indicator,
      currentSelectedOperationId = '',
      currentSelectedOperationName,
      currentUnit,
      inputValue = '',
      isProdBound,
      currentSelectedProduct,
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
      trackWindowDate: this.transformDateToDay(currentSelectedTrackDate),
      // 一级指标key
      indicatorLevel1Key: indicatorLevel1.key || '',
      // 一级指标value
      indicatorLevel1Value: currentSelectedLevel1Indicator || '',
      // 二级指标key
      indicatorLevel2Key: indicatorLevel2.key || '',
      // 二级指标value
      indicatorLevel2Value: currentSelectedLevel2Indicator || '',
      // 产品编号
      currentSelectedProduct,
      // 操作符key,传给后台,譬如>=/<=
      operationKey: currentSelectedOperationId,
      // 操作符name,展示用到，譬如达到/降到
      operationValue: currentSelectedOperationName,
      // 当前输入的指标值
      inputIndicator: inputValue,
      // 单位
      unit: currentUnit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善,开通，是
      hasState: this.judgeTraceOp(currentSelectedOperationId),
      stateText: this.renderStateText(),
      // 是否有产品搜索
      hasSearchedProduct: isProdBound,
      // 是否选中
      isResultTrackChecked: checked,
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
      })) : [{}],
      currentMin: indicator.min,
      currentMax: indicator.max,
      currentIndicatorDescription: indicator.indexRemark,
      currentSelectedOperationName: traceOpList[0].name,
      currentSelectedOperationId: traceOpList[0].key,
      inputValue: '',
      isProdBound: indicator.isProdBound,
      currentSelectedProduct: {},
    });
  }

  @autobind
  getfirstAllowedDate() {
    const { needApproval, storedData } = this.props;
    const { timelyIntervalValue } = storedData.taskFormData;
    const momentNow = moment();
    // 修正可以选择的开始时间
    const firstAllowedDate = timelyIntervalValue ? momentNow.add(Number(timelyIntervalValue), 'days') : momentNow;

    // 如果需要审批，多加5天
    if (needApproval) {
      firstAllowedDate.add(5, 'days');
    }

    return _.clone(firstAllowedDate).startOf('day');
  }

  @autobind
  disabledDate(current) {
    const firstAllowedDate = this.getfirstAllowedDate();
    const isLessThanFirstAllowedDate = current && current < firstAllowedDate.startOf('day');
    const isBiggerThanLastAllowedDate = current && current > firstAllowedDate.add(180, 'days').startOf('day');
    if (isLessThanFirstAllowedDate || isBiggerThanLastAllowedDate) {
      return true;
    }
    return false;
  }

  @autobind
  fixDays(value, reverse) {
    let days;
    const { needApproval, storedData } = this.props;
    const { timelyIntervalValue } = storedData.taskFormData;
    if (reverse) {
      days = needApproval ? value - timelyIntervalValue - 5 :
        value - timelyIntervalValue;
    } else {
      days = needApproval ? value + timelyIntervalValue + 5 :
        value + timelyIntervalValue;
    }

    return days;
  }

  @autobind
  transformDateToDay(value) {
    const firstAllowedDate = this.getfirstAllowedDate();
    return this.fixDays(value.diff(firstAllowedDate, 'days'));
  }

  @autobind
  transformDayToDate(value) {
    const days = this.fixDays(value, true);
    const firstAllowedDate = this.getfirstAllowedDate();
    return firstAllowedDate.add(days, 'days');
  }

  /**
   * 判断当前操作符是否没有，只有开通，是，或者完善这种类型
   * @param {*string} id id
   */
  @autobind
  judgeTraceOp(id) {
    return id === 'TRUE'
      || id === 'OPEN'
      || id === 'COMPLETE';
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
      indicatorLevel1Key,
      // 二级指标
      indicatorLevel2Key,
      // 操作符key,传给后台,譬如>=/<=
      operationKey,
      // 当前输入的指标值
      inputIndicator,
      // 单位
      unit,
      // 是否有产品搜索
      hasSearchedProduct,
      // 是否选中
      isResultTrackChecked,
      operationValue,
      currentMin,
      currentMax,
      currentIndicatorDescription,
      currentSelectedProduct = {},
    } = resultTrackData;

    let currentSelectedOperationNew = operationValue;
    let currentSelectedLevel1Indicator = _.find(level1Indicator, item =>
      item.key === indicatorLevel1Key) || {};
    currentSelectedLevel1Indicator = currentSelectedLevel1Indicator.value || defaultIndicatorValue;

    const currentSelectedLevel2 = _.find(level2Indicator, item =>
      item.key === indicatorLevel2Key) || {};
    const currentSelectedLevel2Indicator = currentSelectedLevel2.value
      || level2Indicator[0].value;

    let traceOpList = currentSelectedLevel2.traceOpList;
    let currentSelectedOperationId = operationKey;
    const indexRemark = currentIndicatorDescription;

    if (_.isEmpty(currentSelectedOperationNew)) {
      traceOpList = level2Indicator[0].traceOpList;
      if (_.isArray(traceOpList) && _.isEmpty(traceOpList[0])) {
        traceOpList = [{}];
      }

      currentSelectedOperationNew = traceOpList[0].name;
      currentSelectedOperationId = traceOpList[0].key;
    }
    const currentUnit = unit || level2Indicator[0].unit || '';
    // 跟踪截止天数
    const trackDays = trackWindowDate != null ? trackWindowDate :
      this.fixDays(defaultTrackWindowDate);
    const currentSelectedTrackDate =
      this.transformDayToDate(trackDays);
    return {
      level1Indicator,
      level2Indicator,
      currentSelectedOperationName: currentSelectedOperationNew,
      currentUnit,
      currentSelectedLevel2Indicator,
      currentSelectedTrackDate,
      currentSelectedLevel1Indicator,
      currentSelectedOperationId,
      isProdBound: hasSearchedProduct || level2Indicator[0].isProdBound,
      inputIndicator,
      isResultTrackChecked,
      traceOpList,
      currentMin,
      currentMax,
      currentIndicatorDescription: indexRemark || level2Indicator[0].indexRemark,
      currentSelectedProduct: currentSelectedProduct || {},
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
      indexRemark: item.indexRemark,
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
    const { checked, currentSelectedLevel1Indicator } = this.state;

    this.setState({
      checked: !checked,
    });

    if (checked && currentSelectedLevel1Indicator !== defaultIndicatorValue) {
      message.error('您已设置结果跟踪指标，如果取消选择将不对此任务进行结果跟踪');
    }
  }

  /**
   * 输入框change事件handler
   * @param {*object} e 当前事件event
   */
  @autobind
  handleInputChange(value) {
    const { currentMin = 0, currentMax = 0 } = this.state;
    if (_.isUndefined(value)) {
      return;
    }
    if (!_.isEmpty(currentMax) && !_.isEmpty(currentMin)) {
      if (Number(value) < Number(currentMin)) {
        message.error('不能小于指标最小值');
        return;
      }

      if (Number(value) > Number(currentMax)) {
        message.error('不能大于指标最大值');
        return;
      }
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
      currentSelectedOperationName: currentOperation.name,
      currentSelectedOperationId: currentOperation.key,
    });
  }

  @autobind
  handleTrackDateChange(value) {
    this.setState({
      currentSelectedTrackDate: value,
    });
  }

  @autobind
  handleSelectProductItem(value) {
    console.log(value);
    if (!_.isEmpty(value)) {
      this.setState({
        currentSelectedProduct: value,
      });
    }
  }

  @autobind
  handleQueryProduct(value) {
    this.props.queryProduct({
      keyword: value,
    });
  }

  @autobind
  renderStateText() {
    let stateText = '';
    const { operationType } = this.state;
    if (!_.isEmpty(operationType)) {
      if (operationType[0].key === 'TRUE') {
        stateText = '状态：是';
      } else if (operationType[0].key === 'COMPLETE') {
        stateText = '状态：完善';
      } else if (operationType[0].key === 'OPEN') {
        stateText = '状态：开通';
      }
    }

    return stateText;
  }

  render() {
    const {
      searchedProductList,
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
      currentSelectedOperationValue,
      level1Indicator,
      level2Indicator,
      isProdBound,
      currentSelectedProduct,
      currentSelectedTrackDate,
     } = this.state;

    const stateText = this.renderStateText();

    let currentSelectProductValue = '请输入产品';
    if (!_.isEmpty(currentSelectedProduct)) {
      currentSelectProductValue = `${currentSelectedProduct.aliasName || ''}${currentSelectedProduct.name ? `(${currentSelectedProduct.name || ''})` : ''}`;
    }

    return (
      <div className={styles.resultTrackContainer}>
        <div className={styles.title}>
          <Checkbox checked={checked} onChange={this.handleCheckChange}>结果跟踪</Checkbox>
        </div>
        <div className={styles.divider} />
        <div className={styles.container}>
          <div className={styles.resultTrackWindow}>
            <div className={styles.title}>
              跟踪截止日期（跟踪自任务实施日开始）
            </div>
            <div className={styles.content}>
              <DatePicker
                allowClear={false}
                value={currentSelectedTrackDate}
                disabledDate={this.disabledDate}
                onChange={this.handleTrackDateChange}
              />
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
                          value={currentSelectProductValue}
                          showObjKey="aliasName"
                          objId="name"
                          placeholder="产品编码/产品名称"
                          name="产品"
                          disable={!checked}
                          searchList={searchedProductList || EMPTY_LIST}
                          emitSelectItem={this.handleSelectProductItem}
                          emitToSearch={this.handleQueryProduct}
                          defaultSearchValue={currentSelectedProduct.searchValue || ''}
                        />
                      </div> : null
                    }

                    {/**
                     * 如果operation是TRUE或者OPEN或者COMPLETE,不需要输入框，也不需要单位，
                     * 只需要显示一个状态：完善/开通/是
                     */}
                    {
                      ((!_.isEmpty(operationType)
                        && !_.isEmpty(operationType[0])
                        && _.isArray(operationType)
                        && _.size(operationType) === 1
                        && (operationType[0].key === 'TRUE'
                          || operationType[0].key === 'OPEN'
                          || operationType[0].key === 'COMPLETE')) || (_.isEmpty(operationType[0])))
                        ? <div className={styles.hasStateIndicator}>
                          <span>{stateText}</span>
                        </div> :
                        <div className={styles.noStateIndicator}>
                          <div className={styles.condition}>
                            {
                              (_.isArray(operationType) && _.size(operationType) > 1) ?
                                <Select
                                  disabled={!checked}
                                  value={currentSelectedOperationValue}
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
                            <InputNumber
                              disabled={!checked}
                              placeholder={''}
                              value={inputValue}
                              min={!_.isEmpty(currentMin) ? Number(currentMin) : 0}
                              max={!_.isEmpty(currentMax) ? Number(currentMax) : Number.MAX_VALUE}
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
        {
          currentSelectedLevel1Indicator !== defaultIndicatorValue ?
            <div className={styles.indicatorDescription}>
              <span>{currentSelectedLevel2Indicator || ''}：</span>
              <span>{currentIndicatorDescription}</span>
            </div> : null
        }
      </div>
    );
  }
}
