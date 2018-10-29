/**
 * @Author: XuWenKang
 * @Description: 客户列表页搜索框组件
 * @Date: 2018-10-26 10:17:58
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-10-26 19:32:15
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon as AntdIcon, Input, AutoComplete } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { isSightingScope, getFilter, getSortParam } from '../helper';
// import { padSightLabelDesc } from '../../../config';
import logable, { logCommon } from '../../../decorators/logable';

import styles from './custSearch.less';

const Option = AutoComplete.Option;
const NONE_INFO = '按回车键发起搜索';
// 自定义标签类型值
const DEFINED_LABEL = ['manageFsp', 'personalFsp'];

export default class CustSearch extends PureComponent {

  static propTypes ={
    location: PropTypes.object.isRequired,
    // 搜索联想词
    getHotPossibleWds: PropTypes.func.isRequired,
    hotPossibleWdsList: PropTypes.array.isRequired,
    // 搜索词,从其他页面带过来的
    keyword: PropTypes.string,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    keyword: '',
  }

  constructor(props) {
    super(props);
    const { keyword } = props;
    this.state = {
      value: keyword,
    };
  }

  componentDidMount() {
    // 此处第一次请求是为了从其他页面跳转到客户列表页面时，如果url带参数过来时，用户打开搜索组件下拉时有数据存在。
    const { value } = this.state;
    if (!_.isEmpty(value)) {
      this.getHotPossibleWds(value);
    }
    document.querySelector(`.${styles.custSearchBox}`).addEventListener('click', this.handleClickClearDataBtn);
  }

  componentWillUnmount() {
    document.querySelector(`.${styles.custSearchBox}`).removeEventListener('click', this.handleClickClearDataBtn);
  }

  @autobind
  handleClickClearDataBtn(e) {
    // 点击清除数据按钮
    if (e.target.className === 'ant-select-selection__clear') {
      this.clearData();
    }
  }

  @autobind
  clearData() {
    this.setState({
      value: '',
    });
    this.replaceUrl({
      source: '',
      q: '',
      labelName: '',
      type: '',
      productName: '',
    });
  }

  // 查询热词
  @autobind
  getHotPossibleWds(value) {
    const { getHotPossibleWds } = this.props;
    getHotPossibleWds({
      // 和后端约定，传此字段标识请求来自客户列表，和其他地方的搜索热词做区分
      fromCustList: true,
      wd: value,
    });
  }

  // 输入框按回车
  @autobind
  handlePressEnter() {
    // 如果当期有选中项，走select逻辑，不做任何处理
    const activeItemElement = document.querySelector(
      `.${styles.custSearchDropdown} .ant-select-dropdown-menu-item-active`,
    );
    if (activeItemElement) {
      return;
    }
    // todo 查询客户列表
    const { value } = this.state;
    this.replaceUrl({
      source: 'search',
      q: encodeURIComponent(_.trim(value)),
      labelName: '',
      type: '',
      productName: '',
    });
    logCommon({
      type: 'Click',
      payload: {
        name: '淘客页面搜索',
        value,
        type: '搜索',
        subtype: '',
      },
    });
  }

  @autobind
  handleChange(value = '') {
    this.setState({
      value,
    });
  }

  // 统一处理url
  @autobind
  replaceUrl(data) {
    const { replace } = this.context;
    const { location: { query = {}, pathname } } = this.props;
    const filters = getFilter(data);
    const sortParams = getSortParam(filters);
    replace({
      pathname,
      query: {
        ...query,
        ...data,
        ...sortParams,
        filters,
      },
    });
  }

  @autobind
  handleSelect(value) {
    const { hotPossibleWdsList } = this.props;
    const item = _.find(hotPossibleWdsList, item => item.primaryKey === value);
    const sightingScopeBool = isSightingScope(item.source);
    let query = {
      source: sightingScopeBool ? 'sightingTelescope' : 'association',
      labelName: encodeURIComponent(item.value),
      // labelDesc: item.description,
      q: encodeURIComponent(item.value),
      type: item.type,
    };
    // 自定义标签的选择
    if (_.includes(DEFINED_LABEL, item.source)) {
      query = {
        ...query,
        source: item.source,
      };
    }

    // 查到的时持仓产品，传持仓产品的名称
    if (item.type === 'PRODUCT' && item.name) {
      query = { ...query, productName: item.name };
    }

    // log日志 --- 首页搜索选中
    const subtype = sightingScopeBool ? '瞄准镜' : item.description;
    logCommon({
      type: 'Click',
      payload: {
        name: '淘客页面搜索',
        value: item.value,
        type: '联想词选择',
        subtype,
      },
    });
    this.replaceUrl(query);
  }

  @autobind
  handleSearch(value) {
    if (_.isEmpty(value)) {
      this.setState({
        value,
      });
      return;
    }
    this.getHotPossibleWds(value);
  }

  // 判断搜索热词是否为空
  @autobind
  checkResultIsEmpty() {
    const { hotPossibleWdsList } = this.props;
    return _.isEmpty(hotPossibleWdsList);
  }

  @autobind
  renderDatasource() {
    const { value } = this.state;
    const { hotPossibleWdsList } = this.props;
    let newData;
    if (!this.checkResultIsEmpty()) {
      // 有搜索结果
      newData = _.map(hotPossibleWdsList, this.renderOption);
    } else {
      // 无搜索结果
      newData = this.renderNoneSearchResult();
    }
    if (!_.isEmpty(value)) {
      return newData;
    }
    return null;
  }

  @autobind
  renderNoneSearchResult() {
    return (
      [
        <Option key="NONE_INFO" text={NONE_INFO} disabled>
          {NONE_INFO}
        </Option>,
      ]
    );
  }

  @autobind
  renderOption(item) {
    const { value } = this.state;
    const newContent = (item.value || '').replace(value, `<em>${value}</em>`);
    const sightingScopeBool = isSightingScope(item.source);
    // 联想 association
    // 搜索 search
    // 标签 tag
    return (
      <Option key={item.primaryKey} text={item.value}>
        <a
          dangerouslySetInnerHTML={{ __html: newContent }} // eslint-disable-line
          rel="noopener noreferrer"
        />
        <span className="desc">{sightingScopeBool ? '瞄准镜' : item.description}</span>
      </Option>
    );
  }

  render() {
    const { value } = this.state;
    return (
      <AutoComplete
        className={styles.custSearchBox}
        dropdownClassName={styles.custSearchDropdown}
        size="large"
        placeholder={'客户基本信息等'}
        defaultActiveFirstOption={false}
        allowClear
        dataSource={this.renderDatasource()}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        optionLabelProp="text"
        value={value}
      >
        <Input
          onPressEnter={this.handlePressEnter}
          suffix={
              <AntdIcon
                type="search"
                className="certain-category-icon"
                onClick={this.handlePressEnter}
              />
            }
        />
      </AutoComplete>
    );
  }
}
