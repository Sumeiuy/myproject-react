/**
 * @Author: sunweibin
 * @Date: 2018-04-09 15:38:19
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-15 20:41:48
 * @description 客户池头部搜索组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import logable, { logCommon } from '../../../decorators/logable';
import { url as urlHelper } from '../../../helper';
import { openRctTab } from '../../../utils';
import { padSightLabelDesc } from '../../../config';
import Icon from '../../common/Icon';
import { isSightingScope } from '../helper';
import styles from './search.less';

const Option = AutoComplete.Option;
const EMPTY_LIST = [];
const NONE_INFO = '按回车键发起搜索';
// 标签的类型值
const LABEL = 'LABEL';
let guid = 0;

export default class Search extends PureComponent {

  static propTypes = {
    hotWdsList: PropTypes.array,
    queryHotPossibleWds: PropTypes.func,
    queryHotWdsData: PropTypes.array,
    push: PropTypes.func.isRequired,
    orgId: PropTypes.string.isRequired,
    searchHistoryVal: PropTypes.string,
    saveSearchVal: PropTypes.func,
    location: PropTypes.object.isRequired,
    isPreview: PropTypes.bool,
  }

  static defaultProps = {
    hotWdsList: EMPTY_LIST,
    queryHotPossibleWds: () => { },
    saveSearchVal: () => { },
    queryHotWdsData: EMPTY_LIST,
    searchHistoryVal: '',
    isPreview: false,
  }

  constructor(props) {
    super(props);
    const { queryHotWdsData = EMPTY_LIST, searchHistoryVal = '' } = props;

    this.state = {
      // 页面初始化的时候，选择上一次的数据，生成option
      dataSource: this.searchResult(searchHistoryVal, queryHotWdsData),
      value: searchHistoryVal || '',
      hasSearchResult: !_.isEmpty(queryHotWdsData),
    };

    this.dropdownClassName = `customerpool-search-${guid++}`;
  }


  componentWillReceiveProps(nextProps) {
    const { queryHotWdsData: nextQueryHotWdsData } = nextProps;
    const { value } = this.state;
    this.setState({
      dataSource: value ? this.searchResult(value, nextQueryHotWdsData) : [],
      hasSearchResult: !_.isEmpty(nextQueryHotWdsData),
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '目标客户池首页点击推荐词' } })
  handleOpenTab(options) {
    const { push, location: { query } } = this.props;
    const firstUrl = '/customerPool/list';
    this.props.saveSearchVal({
      searchVal: this.state.value,
    });
    const condition = urlHelper.stringify(options);
    const url = `${firstUrl}?${condition}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: firstUrl,
      query: options,
      // 方便返回页面时，记住首页的query，在本地环境里
      state: {
        ...query,
      },
    });
  }

  searchResult(query, hotList) {
    if (_.isEmpty(hotList)) {
      // 提示无相关目标客户
      return [{
        query,
        category: NONE_INFO,
        value: NONE_INFO,
        description: NONE_INFO,
        id: NONE_INFO,
      }];
    }
    return _.map(hotList, (item, index) => (
      {
        query,
        category: `${item.value}${index}`,
        value: item.value,
        description: item.description,
        id: item.primaryKey,
        type: item.type,
        source: item.source,
        name: item.name,
      }
    ));
  }

  @autobind
  handleSearch(value) {
    if (_.isEmpty(value)) {
      this.setState({
        value,
        dataSource: [],
      });
      return;
    }
    this.props.queryHotPossibleWds({
      wd: value,
    });
  }

  @autobind
  handleSelect(value) {
    const item = _.find(this.state.dataSource, child => child.id === value);
    const sightingScopeBool = isSightingScope(item.source);
    let query = {
      source: sightingScopeBool ? 'sightingTelescope' : 'association',
      labelMapping: item.id,
      // 任务提示
      missionDesc: padSightLabelDesc({
        sightingScopeBool,
        labelId: item.id,
        labelName: item.value,
        isLabel: item.type === LABEL,
      }),
      labelName: encodeURIComponent(item.value),
      labelDesc: encodeURIComponent(item.description),
      q: encodeURIComponent(item.value),
      type: item.type,
    };
    // 查到的时持仓产品，传持仓产品的名称
    if (item.type === 'PRODUCT' && item.name) {
      query = { ...query, productName: encodeURIComponent(item.name) };
    }

    // log日志 --- 首页搜索选中
    const subtype = sightingScopeBool ? '瞄准镜' : item.description;
    logCommon({
      type: 'DropdownSelect',
      payload: {
        name: '首页搜索框',
        value,
        type: 'dropdownSelect',
        subtype,
      },
    });
    this.handleOpenTab(query);
  }

  @autobind
  handleChange(value) {
    this.setState({ value });
  }

  @autobind
  handlePressEnter() {
    // 如果当期有选中项，走select逻辑，不做任何处理
    const activeItemElement = document.querySelector(
      `.${this.dropdownClassName} .ant-select-dropdown-menu-item-active`,
    );
    if (activeItemElement) {
      return;
    }
    this.handleClickButton();
  }

  @autobind
  handleClickButton() {
    const { value } = this.state;
    const newValue = _.trim(value);
    if (newValue.length === 0) {
      return false;
    }
    // log日志 --- 首页搜索点击
    logCommon({
      type: 'Click',
      payload: {
        name: '首页搜索框',
        value,
        type: 'click',
        subtype: '',
      },
    });
    this.handleOpenTab({
      source: 'search',
      q: encodeURIComponent(newValue),
    });
    return true;
  }

  renderDatasource() {
    const { dataSource, value, hasSearchResult } = this.state;
    let newData;
    if (hasSearchResult) {
      // 有搜索结果
      newData = _.map(dataSource, this.renderOption);
    } else {
      // 无搜索结果
      newData = _.map(dataSource, this.renderNoneSearchResult);
    }
    if (!_.isEmpty(value)) {
      return newData;
    }
    return null;
  }

  @autobind
  renderOption(item) {
    const { value } = this.state;
    const newContent = item.value.replace(value, `<em>${value}</em>`);
    const sightingScopeBool = isSightingScope(item.source);
    // 联想 association
    // 搜索 search
    // 标签 tag
    return (
      <Option key={item.id} text={item.value}>
        <a
          dangerouslySetInnerHTML={{ __html: newContent }} // eslint-disable-line
          rel="noopener noreferrer"
        />
        <span className="desc">{sightingScopeBool ? '瞄准镜' : item.description}</span>
      </Option>
    );
  }

  @autobind
  renderNoneSearchResult(item) {
    return (
      <Option key={item.value} text={item.value} disabled>
        {item.description}
      </Option>
    );
  }

  @autobind
  renderRecommend(data) {
    const { isPreview } = this.props;
    if (data.length <= 0) {
      return null;
    }
    return _.map(data, item => (
      <a
        className="item"
        title={item.description}
        rel="noopener noreferrer"
        onClick={() => {
          if (!isPreview) {
            this.handleOpenTab({
              source: isSightingScope(item.source) ? 'sightingTelescope' : 'tag',
              labelMapping: item.id || '',
              labelName: encodeURIComponent(item.name),
              labelDesc: encodeURIComponent(item.description),
              // 任务提示
              missionDesc: padSightLabelDesc({
                sightingScopeBool: isSightingScope(item.source),
                labelId: item.id,
                labelName: item.name,
              }),
              q: encodeURIComponent(item.name),
              type: LABEL,
            });
          }
        }}
        key={item.id}
      >
        {item.name}
      </a>
    ));
  }

  render() {
    const { hotWdsList = EMPTY_LIST, searchHistoryVal, isPreview } = this.props;
    const autoCompleteOption = isPreview ? {} :
    {
      dataSource: this.renderDatasource(),
      onSelect: this.handleSelect,
      onSearch: this.handleSearch,
      onChange: this.handleChange,
      defaultValue: searchHistoryVal,
    };

    return (
      <div className={styles.searchBox}>
        <div className={styles.inner}>
          <div className={styles.inputBox}>
            <div className="global-search-wrapper">
              <AutoComplete
                ref={ref => this.autoComplete = ref}
                className="global-search"
                dropdownClassName={`certain-category-search-dropdown ${this.dropdownClassName}`}
                size="large"
                style={{ width: '100%' }}
                placeholder={'经纪客户号、姓名、电话、身份证号码或你感兴趣的关键字'}
                optionLabelProp="text"
                defaultActiveFirstOption={false}
                {...autoCompleteOption}
              >
                <Input
                  onPressEnter={isPreview ? null : this.handlePressEnter}
                  suffix={(
                    <Button
                      className="search-btn"
                      size="large"
                      type="primary"
                      onClick={isPreview ? null : this.handleClickButton}
                    >
                      <AntdIcon type="search" />
                    </Button>
                  )}
                />
              </AutoComplete>
            </div>
          </div>
          <div className={styles.historyList}>
            <span className={styles.s_title}>
              <Icon type="dengpao" />猜你感兴趣：
            </span>
            <div>{this.renderRecommend(hotWdsList)}</div>
          </div>
        </div>
      </div>
    );
  }
}
