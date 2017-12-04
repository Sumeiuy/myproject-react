/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Clickable from '../../../components/common/Clickable';
import { fspContainer } from '../../../config';
import { fspGlobal } from '../../../utils';
import Icon from '../../common/Icon';
import styles from './search.less';

const Option = AutoComplete.Option;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
let searchInput;
const NONE_INFO = '没有匹配内容';
export default class Search extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
    queryHotPossibleWds: PropTypes.func,
    queryHotWdsData: PropTypes.array,
    push: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    searchHistoryVal: PropTypes.string,
    saveSearchVal: PropTypes.func,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    queryHotPossibleWds: () => { },
    saveSearchVal: () => { },
    queryHotWdsData: EMPTY_LIST,
    orgId: '',
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
    });
  }

  componentWillUnmount() {
    if (searchInput) {
      searchInput.removeEventListener('keydown', this.handleSearchInput, false);
    }
  }

  @autobind
  onSelect(value) {
    this.setState({
      inputVal: value,
    });
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
        labelMapping: '',
        tagNumId: '',
        q: encodeURIComponent(searchVal),
      }, '客户列表', 'RCT_FSP_CUSTOMER_LIST');
    }
    return true;
  }

  @autobind
  handleOpenTab(obj, titles, ids) {
    const {
      source,
      labelMapping,
      tagNumId,
      q } = obj;
    const { push, location: { query } } = this.props;
    const firstUrl = '/customerPool/list';
    this.handleSaveSearchVal();
    if (document.querySelector(fspContainer.container)) {
      const url = `${firstUrl}?source=${source}&labelMapping=${labelMapping}&tagNumId=${tagNumId}&q=${q}`;
      const param = {
        closable: true,
        forceRefresh: true,
        isSpecialTab: true,
        id: ids, // 'FSP_SERACH',
        title: titles, // '搜索目标客户',
      };
      fspGlobal.openRctTab({ url, param });
    } else {
      push({
        pathname: firstUrl,
        query: obj,
        // 方便返回页面时，记住首页的query，在本地环境里
        state: {
          ...query,
        },
      });
    }
  }

  searchResult(query, hotList) {
    if (_.isEmpty(hotList)) {
      this.setState({
        isHasSearchResult: false,
      });
      // 提示无相关目标客户
      return [{
        query,
        category: NONE_INFO,
        content: NONE_INFO,
        desc: NONE_INFO,
        labelMapping: NONE_INFO,
        tagNumId: NONE_INFO,
        id: NONE_INFO,
      }];
    }

    this.setState({
      isHasSearchResult: true,
    });

    return _.map(hotList, (item, index) => ({
      query,
      category: `${item.labelNameVal}${index}`,
      content: item.labelNameVal,
      desc: item.labelDesc,
      labelMapping: item.labelMapping,
      tagNumId: item.tagNumId,
      id: item.labelNameVal,
    }));
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
            source: 'tag',
            labelMapping: item.labelMapping || '',
            tagNumId: item.tagNumId || '',
            q: encodeURIComponent(item.labelNameVal),
          }, '客户列表', 'RCT_FSP_CUSTOMER_LIST')}
          eventName="/click/search/recommend"
          key={item.id}
        >
          <a
            className="item"
            title={item.labelDesc}
            rel="noopener noreferrer"
          >
            {item.labelNameVal}
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
        labelMapping: '',
        tagNumId: '',
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
    const newContent = item.content.replace(inputVal, `<em>${inputVal}</em>`);
    // 联想 association
    // 搜索 search
    // 标签 tag
    return (
      <Option key={item.id} text={item.content}>
        <Clickable
          onClick={() => this.handleOpenTab({
            source: 'association',
            labelMapping: item.labelMapping || '',
            tagNumId: item.tagNumId || item.content,
            q: encodeURIComponent(item.content),
          }, '客户列表', 'RCT_FSP_CUSTOMER_LIST')}
          eventName="/click/search/option"
        >
          <a
            dangerouslySetInnerHTML={{ __html: newContent }}
            rel="noopener noreferrer"
          />
        </Clickable>
        <span className="desc">{item.desc}</span>
      </Option>
    );
  }

  @autobind
  renderNoneSearchResult(item) {
    return (
      <Option key={item.id} text={item.labelNameVal} disabled>
        {item.desc}
      </Option>
    );
  }

  render() {
    const { data: { hotWdsList = EMPTY_LIST }, searchHistoryVal } = this.props;

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
