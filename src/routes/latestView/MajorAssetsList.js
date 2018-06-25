/**
 * @Description: 大类资产配置分析更多列表
 * @Author: Liujianshu
 * @Date: 2018-06-22 13:24:46
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-25 15:55:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Table, Select, DatePicker } from 'antd';
import _ from 'lodash';

import { dva, time } from '../../helper';
import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/latestView/majorAssets/Modal';
import config from '../../components/latestView/config';
import styles from './majorAssetsList.less';

const dispatch = dva.generateEffect;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const { dateFormatStr, majorAssets: { titleArray, typeArray, categoryArray } } = config;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

const selectStyle = {
  width: 155,
  height: 30,
};

const KEY_TITLE = 'title';
const KEY_TIME = 'time';

// 详情弹窗的 key
const MODAL_KEY = 'detailModal';

const effects = {
  // 大类资产配置分析-更多列表
  queryMajorAssetsList: 'latestView/queryMajorAssetsList',
  // 大类资产配置分析-详情
  queryMajorAssetsDetail: 'latestView/queryMajorAssetsDetail',
};

const mapStateToProps = state => ({
  // 大类资产配置分析-更多列表
  majorAssetsData: state.latestView.majorAssetsData,
  // 大类资产配置分析-详情
  majorAssetsDetail: state.latestView.majorAssetsDetail,
});
const mapDispatchToProps = {
  queryMajorAssetsList: dispatch(effects.queryMajorAssetsList,
    { loading: true, forceFull: true }),
  queryMajorAssetsDetail: dispatch(effects.queryMajorAssetsDetail,
    { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class MajorAssetsList extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    queryMajorAssetsList: PropTypes.func.isRequired,
    majorAssetsData: PropTypes.object.isRequired,
    // 大类资产配置分析-详情
    queryMajorAssetsDetail: PropTypes.func.isRequired,
    majorAssetsDetail: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { query: { type = '' } } } = props;
    this.state = {
      type,
      category: '',
      startDate: '',
      endDate: '',
      pageNum: 1,
      pageSize: 20,
      detailModal: false,
    };
  }

  componentDidMount() {
    this.sendRequest();
  }

  // 生成下拉选择选项
  @autobind
  getOptionList(array) {
    return array.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ));
  }

  // 翻页
  @autobind
  handlePageChange(pageNum) {
    this.setState({
      pageNum,
    }, this.sendRequest);
  }

  // 类型切换事件
  @autobind
  handleTypeChange(value) {
    this.setState({
      type: value,
    }, this.sendRequest);
  }

  // 资产大类切换事件
  @autobind
  handleCategoryChange(value) {
    this.setState({
      category: value,
    }, this.sendRequest);
  }

  @autobind
  handleDateChange(moments, dateStrs) {
    this.setState({
      startDate: dateStrs[0],
      endDate: dateStrs[1],
    }, this.sendRequest);
  }

  // 发送请求
  @autobind
  sendRequest() {
    const { queryMajorAssetsList } = this.props;
    const { type, category, startDate, endDate, pageNum, pageSize } = this.state;
    queryMajorAssetsList({
      type,
      category,
      startDate,
      endDate,
      pageNum,
      pageSize,
    });
  }

  @autobind
  handleTitleClick(record) {
    const { queryMajorAssetsDetail } = this.props;
    const { id = '' } = record;
    this.setState({
      detailModal: true,
    }, () => {
      queryMajorAssetsDetail({ id });
    });
  }

  @autobind
  getColumnsTitle(array) {
    const newArray = [...array];

    // 标题
    const titleIndex = _.findIndex(newArray, o => o.key === KEY_TITLE);
    // 报告日期
    const timeIndex = _.findIndex(newArray, o => o.key === KEY_TIME);

    newArray[titleIndex].render = (text, record) => <div
      title={text}
      onClick={() => this.handleTitleClick(record)}
    >
      {text}
    </div>;

    newArray[timeIndex].render = text => time.format(text, dateFormatStr);
    return newArray;
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  render() {
    const { majorAssetsData, majorAssetsDetail } = this.props;
    const { type, category, detailModal } = this.state;
    const {
      list = EMPTY_ARRAY,
      page = EMPTY_OBJECT,
    } = majorAssetsData;
    const paganationOption = {
      current: page.curPageNum || 1,
      pageSize: page.pageSize || 20,
      total: page.totalRecordNum || 0,
      onChange: this.handlePageChange,
    };

    const titleList = this.getColumnsTitle(titleArray);
    return (
      <div className={styles.listContainer}>
        <div
          className={styles.inner}
        >
          <div className={styles.filterWrapper}>
            <div className={styles.selectBox}>
              <span className={styles.title}>类型：</span>
              <Select
                style={selectStyle}
                defaultValue={type}
                onChange={this.handleTypeChange}
              >
                {
                  this.getOptionList(typeArray)
                }
              </Select>
            </div>
            <div className={styles.selectBox}>
              <span className={styles.title}>资产大类：</span>
              <Select
                style={selectStyle}
                defaultValue={category}
                onChange={this.handleCategoryChange}
              >
                {
                  this.getOptionList(categoryArray)
                }
              </Select>
            </div>
            <div className={styles.dateBox}>
              <span className={styles.title}>报告日期：</span>
              <RangePicker
                defaultValue={''}
                format={dateFormatStr}
                onChange={this.handleDateChange}
              />
            </div>
          </div>
          <Table
            rowKey={'id'}
            columns={titleList}
            dataSource={list}
            pagination={false}
          />
          <Pagination {...paganationOption} />
          <Modal
            modalKey={MODAL_KEY}
            visible={detailModal}
            closeModal={this.closeModal}
            data={majorAssetsDetail}
          />
        </div>
      </div>
    );
  }
}
