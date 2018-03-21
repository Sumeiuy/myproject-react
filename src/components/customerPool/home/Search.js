/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Clickable from '../../../components/common/Clickable';
import { url as urlHelper } from '../../../helper';
import { openRctTab } from '../../../utils';
import Icon from '../../common/Icon';
import { isSightingScope } from '../helper';
import styles from './search.less';

const Option = AutoComplete.Option;
const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
let searchInput;
const NONE_INFO = '按回车键发起搜索';
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
      inputVal: searchHistoryVal || '',
      isHasSearchResult: !_.isEmpty(searchHistoryVal),
    };
  }


  componentDidMount() {
    searchInput = ReactDOM.findDOMNode(document.querySelector('.ant-select-search .ant-input'));// eslint-disable-line
    if (searchInput) {
      searchInput.addEventListener('keydown', this.handleSearchInput, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { queryHotWdsData: nextQueryHotWdsData } = nextProps;
    const { inputVal } = this.state;
    this.setState({
      dataSource: inputVal ? this.searchResult(inputVal, nextQueryHotWdsData) : [],
      isHasSearchResult: !_.isEmpty(nextQueryHotWdsData),
    });
  }

  componentWillUnmount() {
    if (searchInput) {
      searchInput.removeEventListener('keydown', this.handleSearchInput);
    }
  }

  @autobind
  onSelect(value) {
    this.setState({
      inputVal: value,
    }, () => this.props.queryHotPossibleWds({
      wd: value,
    }));
  }

  @autobind
  checkInputValue(value) {
    if (value.length > 0 && value.replace(/\s+/, '').length === 0) {
      console.log('全是空格');
      return false;
    }
    return true;
  }

  @autobind
  handleSearchInput(event) {
    const e = event || window.event; // || arguments.callee.caller.arguments[0];
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    if (e && e.keyCode === 13) {
      const searchVal = e.target.value;
      if (!this.checkInputValue(searchVal)) {
        return false;
      }
      this.handleOpenTab({
        source: 'search',
        q: encodeURIComponent(searchVal),
      }, '客户列表', 'RCT_FSP_CUSTOMER_LIST');
    }
    return true;
  }

  @autobind
  handleOpenTab(obj, titles, ids) {
    const { push, location: { query }, authority, orgId } = this.props;
    const firstUrl = '/customerPool/list';
    this.handleSaveSearchVal();
    const condition = urlHelper.stringify(obj);
    const url = `${firstUrl}?${condition}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: ids, // 'FSP_SERACH',
      title: titles, // '搜索目标客户',
    };
    // 有任务管理岗权限将orgId带到下一个页面,没权限orgId传msm
    const newOrgId = authority ? orgId : 'msm';
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: firstUrl,
      query: { ...obj, orgId: newOrgId },
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
  handleSearch(value) {
    if (_.isEmpty(value)) {
      this.setState({
        inputVal: value,
        dataSource: [],
      });
      return;
    }
    const { queryHotPossibleWds } = this.props;
    this.setState({
      inputVal: value,
    });
    queryHotPossibleWds({
      wd: value,
    });
  }

  @autobind
  handleCreatRecommend(data) {
    if (data.length <= 0) {
      return null;
    }
    const recommendList = [];
    data.forEach((item) => {
      recommendList.push(
        <Clickable
          onClick={() => this.handleOpenTab({
            source: item.source === 'jzyx' ? 'sightingTelescope' : 'tag',
            labelMapping: item.id || '',
            labelName: encodeURIComponent(item.name),
            labelDesc: encodeURIComponent(item.description),
            q: encodeURIComponent(item.name),
          }, '客户列表', 'RCT_FSP_CUSTOMER_LIST')}
          eventName="/click/search/recommend"
          key={item.id}
        >
          <a
            className="item"
            title={item.description}
            rel="noopener noreferrer"
          >
            {item.name}
          </a>
        </Clickable>);
    });
    return recommendList;
  }

  createOption() {
    const { dataSource, inputVal, isHasSearchResult } = this.state;
    let newData;
    if (isHasSearchResult) {
      // 有搜索结果
      newData = _.map(dataSource, this.renderOption);
    } else {
      // 无搜索结果
      newData = _.map(dataSource, this.renderNoneSearchResult);
    }
    if (!_.isEmpty(inputVal)) {
      return newData;
    }
    return null;
  }

  @autobind
  handleSearchBtn() {
    const { inputVal } = this.state;
    if (!this.checkInputValue(inputVal)) {
      return false;
    }
    if (!_.isEmpty(inputVal)) {
      this.setState({
        inputVal: '',
      });
      this.handleOpenTab({
        source: 'search',
        q: encodeURIComponent(inputVal),
      }, '客户列表', 'RCT_FSP_CUSTOMER_LIST');
    }
    return true;
  }

  @autobind
  handleSaveSearchVal() {
    const { saveSearchVal } = this.props;
    let saveVal = '';
    if (searchInput) {
      saveVal = searchInput.value;
    }
    saveSearchVal({
      searchVal: saveVal,
    });
  }

  @autobind
  renderOption(item) {
    const { inputVal } = this.state;
    const newContent = item.name.replace(inputVal, `<em>${inputVal}</em>`);
    const sightingScopeBool = isSightingScope(item.type);
    // 联想 association
    // 搜索 search
    // 标签 tag
    return (
      <Option key={item.name} text={item.name}>
        <Clickable
          onClick={() => this.handleOpenTab({
            source: sightingScopeBool ? 'sightingTelescope' : 'association',
            labelMapping: sightingScopeBool ? item.id : item.type,
            labelName: encodeURIComponent(item.name),
            labelDesc: encodeURIComponent(item.description),
            q: encodeURIComponent(item.name),
          }, '客户列表', 'RCT_FSP_CUSTOMER_LIST')}
          eventName="/click/search/option"
        >
          <a
            dangerouslySetInnerHTML={{ __html: newContent }} // eslint-disable-line
            rel="noopener noreferrer"
          />
        </Clickable>
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

  render() {
    const { hotWdsList = EMPTY_LIST, searchHistoryVal } = this.props;

    return (
      <div className={styles.searchBox}>
        <div className={styles.inner}>
          <div className={styles.inputBox}>
            <div className="global-search-wrapper">
              <AutoComplete
                className="global-search"
                dropdownClassName="certain-category-search-dropdown"
                size="large"
                style={{ width: '100%' }}
                dataSource={this.createOption()}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                placeholder={'经纪客户号、姓名、电话、身份证号码或你感兴趣的关键字'}
                optionLabelProp="text"
                defaultValue={searchHistoryVal}
              >
                <Input
                  suffix={(
                    <Clickable
                      onClick={this.handleSearchBtn}
                      eventName="/click/search"
                    >
                      <Button
                        className="search-btn"
                        size="large"
                        type="primary"
                      >
                        <AntdIcon type="search" />
                      </Button>
                    </Clickable>
                  )}
                />
              </AutoComplete>
            </div>
          </div>
          <div className={styles.historyList}>
            <span className={styles.s_title}>
              <Icon type="dengpao" />猜你感兴趣：
            </span>
            <div>{this.handleCreatRecommend(hotWdsList)}</div>
          </div>
        </div>
      </div>
    );
  }
}
