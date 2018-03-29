/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import logable from '../../../decorators/logable';
import { url as urlHelper } from '../../../helper';
import { openRctTab } from '../../../utils';
import Icon from '../../common/Icon';
import { isSightingScope } from '../helper';
import { MAIN_MAGEGER_ID } from '../../../routes/customerPool/config';
import styles from './search.less';

const Option = AutoComplete.Option;
const EMPTY_LIST = [];
const NONE_INFO = '按回车键发起搜索';
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
    authority: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    hotWdsList: EMPTY_LIST,
    queryHotPossibleWds: () => { },
    saveSearchVal: () => { },
    queryHotWdsData: EMPTY_LIST,
    searchHistoryVal: '',
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
    const { push, location: { query }, authority, orgId } = this.props;
    const firstUrl = '/customerPool/list';
    this.props.saveSearchVal({
      searchVal: this.state.value,
    });
    // 有任务管理岗权限将orgId带到下一个页面,没权限orgId传msm
    const newOrgId = authority ? orgId : MAIN_MAGEGER_ID;
    const newQuery = { ...options, orgId: newOrgId };
    const condition = urlHelper.stringify(newQuery);
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
        name: NONE_INFO,
        description: NONE_INFO,
        id: NONE_INFO,
      }];
    }
    return _.map(hotList, (item, index) => {
      if (item.type === 'label') {
        return {
          query,
          category: `${item.name}${index}`,
          name: item.name,
          description: item.description,
          id: item.id,
          type: item.source,
        };
      }
      return {
        query,
        category: `${item.value}${index}`,
        name: item.value,
        description: item.description,
        type: item.type,
      };
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字目标客户池首页搜索' } })
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '目标客户池首页搜索框',
      value: '$args[0]',
    },
  })
  handleSelect(value) {
    const item = _.find(this.state.dataSource, child => child.name === value);
    const sightingScopeBool = isSightingScope(item.type);
    this.handleOpenTab({
      source: sightingScopeBool ? 'sightingTelescope' : 'association',
      labelMapping: sightingScopeBool ? item.id : item.type,
      labelName: encodeURIComponent(item.name),
      labelDesc: encodeURIComponent(item.description),
      q: encodeURIComponent(item.name),
    });
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
  handleChange(value) {
    this.setState({ value });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '目标客户池首页回车搜索' } })
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
  @logable({ type: 'Click', payload: { name: '目标客户池首页搜索' } })
  handleClickButton() {
    const { value } = this.state;
    if (_.trim(value).length === 0) {
      return false;
    }
    this.handleOpenTab({
      source: 'search',
      q: encodeURIComponent(value),
    });
    return true;
  }

  @autobind
  renderOption(item) {
    const { value } = this.state;
    const newContent = item.name.replace(value, `<em>${value}</em>`);
    const sightingScopeBool = isSightingScope(item.type);
    // 联想 association
    // 搜索 search
    // 标签 tag
    return (
      <Option key={item.name} text={item.name}>
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
      <Option key={item.name} text={item.name} disabled>
        {item.description}
      </Option>
    );
  }

  @autobind
  renderRecommend(data) {
    if (data.length <= 0) {
      return null;
    }
    return _.map(data, item => (
      <a
        className="item"
        title={item.description}
        rel="noopener noreferrer"
        onClick={() => this.handleOpenTab({
          source: item.source === 'jzyx' ? 'sightingTelescope' : 'tag',
          labelMapping: item.id || '',
          labelName: encodeURIComponent(item.name),
          labelDesc: encodeURIComponent(item.description),
          q: encodeURIComponent(item.name),
        })}
        key={item.id}
      >
        {item.name}
      </a>
    ));
  }

  render() {
    const { hotWdsList = EMPTY_LIST, searchHistoryVal } = this.props;

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
                dataSource={this.renderDatasource()}
                onSelect={this.handleSelect}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                placeholder={'经纪客户号、姓名、电话、身份证号码或你感兴趣的关键字'}
                optionLabelProp="text"
                defaultValue={searchHistoryVal}
                defaultActiveFirstOption={false}
              >
                <Input
                  onPressEnter={this.handlePressEnter}
                  suffix={(
                    <Button
                      className="search-btn"
                      size="large"
                      type="primary"
                      onClick={this.handleClickButton}
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
