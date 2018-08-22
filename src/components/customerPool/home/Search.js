/**
 * @Author: sunweibin
 * @Date: 2018-04-09 15:38:19
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-07-02 16:27:56
 * @description 客户池头部搜索组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import store from 'store';

import logable, { logCommon } from '../../../decorators/logable';
import { url as urlHelper } from '../../../helper';
import { openRctTab } from '../../../utils';
import { padSightLabelDesc } from '../../../config';
import Icon from '../../common/Icon';
import { isSightingScope, getFilter, getSortParam } from '../helper';
import styles from './search.less';
import classes from './headerSearch.less';

const Option = AutoComplete.Option;
const EMPTY_LIST = [];
const NONE_INFO = '按回车键发起搜索';
// 标签的类型值
const LABEL = 'LABEL';
let guid = 0;
// 自定义标签类型值
const DEFINED_LABEL = ['manegeFsp', 'personalFsp'];

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
    // 打开展示所有标签弹窗
    showMoreLabelModal: PropTypes.func,
    isOnlySearchable: PropTypes.bool,
  }

  static defaultProps = {
    isOnlySearchable: false,
    hotWdsList: EMPTY_LIST,
    queryHotPossibleWds: _.noop,
    saveSearchVal: _.noop,
    queryHotWdsData: EMPTY_LIST,
    searchHistoryVal: '',
    isPreview: false,
    showMoreLabelModal: _.noop,
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
  handleOpenTab(data) {
    const { labelDesc, missionDesc, ...options } = data;
    const { push, location: { query } } = this.props;
    const firstUrl = '/customerPool/list';
    this.props.saveSearchVal({
      searchVal: this.state.value,
    });
    // 有标签描述需要将描述存到storage
    if (labelDesc) {
      store.set(`${options.labelMapping}-labelDesc`, {
        ...data,
        labelName: decodeURIComponent(options.labelName),
      });
    }
    const filters = getFilter(data);
    const sortParams = getSortParam(filters);
    const newQuery = {
      ...options,
      ...sortParams,
      filters,
    };
    const condition = urlHelper.stringify({ ...newQuery });
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
      query: newQuery,
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
      labelDesc: item.description,
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
        name: '目标客户池首页搜索',
        value: item.value,
        type: '联想词选择',
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
        name: '目标客户池首页搜索',
        value,
        type: '搜索',
        subtype: '',
      },
    });
    this.handleOpenTab({
      source: 'search',
      q: encodeURIComponent(newValue),
    });
    return true;
  }

  // 打开搜索帮助页面
  @logable({
    type: 'Click',
    payload: {
      name: '搜索说明',
    },
  })
  toSearchHelpPage() {
    window.open('/fspa/spy/functionIntroduction/html/searchHelp.html');
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
    const newContent = (item.value || '').replace(value, `<em>${value}</em>`);
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
            // 神策搜索上报
            logCommon({
              type: 'Click',
              payload: {
                name: '首页搜索',
                value: item.name,
                type: '猜你感兴趣',
              },
            });
            this.handleOpenTab({
              source: isSightingScope(item.source) ? 'sightingTelescope' : 'tag',
              labelMapping: item.id || '',
              labelName: encodeURIComponent(item.name),
              // 任务提示
              missionDesc: padSightLabelDesc({
                sightingScopeBool: isSightingScope(item.source),
                labelId: item.id,
                labelName: item.name,
              }),
              labelDesc: item.description,
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
    const {
      hotWdsList = EMPTY_LIST,
      searchHistoryVal,
      isPreview,
      showMoreLabelModal,
      isOnlySearchable,
    } = this.props;
    const autoCompleteOption = isPreview ? {} :
    {
      dataSource: this.renderDatasource(),
      onSelect: this.handleSelect,
      onSearch: this.handleSearch,
      onChange: this.handleChange,
      defaultValue: searchHistoryVal,
    };

    const trueStyles = isOnlySearchable ? classes : styles;

    return (
      <div className={trueStyles.searchBox}>
        <div className={trueStyles.inner}>
          <div className={trueStyles.inputBox}>
            <div className="global-search-wrapper">
              <AutoComplete
                ref={ref => this.autoComplete = ref}
                className="global-search"
                dropdownClassName={`certain-category-search-dropdown ${this.dropdownClassName}`}
                size="large"
                style={{ width: '100%' }}
                placeholder={'客户基本信息、精准营销产品、客户行为特征、持仓产品、服务记录关键字等'}
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
              {
                isOnlySearchable ? null : <AntdIcon type="question-circle" onClick={this.toSearchHelpPage} />
              }
            </div>
          </div>
          {
            isOnlySearchable ?
              null :
              <div className={trueStyles.historyList}>
                <span className={trueStyles.s_title}>
                  <Icon type="dengpao" />猜你感兴趣：
                </span>
                <div className={'clearfix'}>
                  <a
                    className={trueStyles.moreLabelBtn}
                    onClick={() => showMoreLabelModal(true)}
                  >
                    更多 &gt;
                  </a>
                  {this.renderRecommend(hotWdsList)}
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}
