/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon as AntdIcon, Button, Input, AutoComplete, message } from 'antd';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { fspContainer } from '../../../config';
import { fspGlobal } from '../../../utils';
import Icon from '../../common/Icon';
import styles from './search.less';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
let COUNT = 0;
let searchInput;
export default class Search extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
    queryHotPossibleWds: PropTypes.func,
    queryHistoryWdsList: PropTypes.func,
    queryHotWdsData: PropTypes.array,
    push: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    historyWdsList: PropTypes.array,
    clearSuccess: PropTypes.object,
    clearFun: PropTypes.func,
    searchHistoryVal: PropTypes.string,
    saveSearchVal: PropTypes.func,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    queryHotPossibleWds: () => { },
    queryHistoryWdsList: () => { },
    clearFun: () => { },
    saveSearchVal: () => { },
    clearSuccess: EMPTY_OBJECT,
    queryHotWdsData: EMPTY_LIST,
    orgId: '',
    historyWdsList: EMPTY_LIST,
    searchHistoryVal: '',
  }

  state = {
    dataSource: EMPTY_LIST,
    inputValue: '',
    historySource: [{
      title: '历史搜索',
      children: [{
        id: `history_${COUNT++}`,
        labelNameVal: '无',
        labelMapping: '',
        tagNumId: '',
        labelDesc: '',
      }],
    }],
  }

  componentDidMount() {
    this.handleCreatHistoryList(this.props.historyWdsList);
    searchInput = ReactDOM.findDOMNode(document.querySelector('.ant-select-search .ant-input'));// eslint-disable-line
    if (searchInput) {
      searchInput.addEventListener('keydown', this.handleSearchInput, false);
    }
    const { searchHistoryVal } = this.props;
    this.handleSearch(searchHistoryVal);
  }

  componentWillReceiveProps(nextProps) {
    const { historyWdsList: preHistoryWdsList, clearSuccess: preClearSeccess } = this.props;
    const { queryHotWdsData: nextQueryHotWdsData,
      historyWdsList: nextHistoryWdsList,
      clearSuccess: nextClearSeccess } = nextProps;
    const { inputVal } = this.state;
    this.setState({
      dataSource: inputVal ? this.searchResult(inputVal, nextQueryHotWdsData) : [],
    });
    if (!_.isEqual(nextHistoryWdsList, preHistoryWdsList)) {
      this.handleCreatHistoryList(nextHistoryWdsList);
    }
    if (nextClearSeccess !== preClearSeccess) {
      const { code, resultData } = nextClearSeccess;
      if (code !== '0') {
        message.error(resultData);
      }
    }
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
    this.handleSearch(value);
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
    const { data: { hotWds = EMPTY_OBJECT } } = this.props;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    if (e && e.keyCode === 13) {
      let searchVal = e.target.value;
      if (!this.checkInputValue(searchVal)) {
        return false;
      }
      if (_.isEmpty(searchVal)) {
        // message.info('搜索内容不能为空', 1);
        // return;
        searchVal = hotWds.labelNameVal;
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

  // 历史搜索数据集合
  @autobind
  handleCreatHistoryList(data) {
    if (!_.isEmpty(data) && data.length > 0) {
      const historyList = [];
      data.forEach((item) => {
        if (!_.isEmpty(item)) {
          historyList.push({
            labelNameVal: item,
            labelMapping: '',
            tagNumId: item,
            // id: `historyList${COUNT++}`,
            id: item,
            labelDesc: '',
          });
        }
      });
      this.setState({
        historySource: [{
          title: '历史搜索',
          children: historyList,
        }],
      });
    }
  }

  searchResult(query, hotList) {
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
    queryHotPossibleWds({
      wd: value,
    });
    this.setState({
      inputVal: value,
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
        <a
          key={item.id}
          className="item"
          onClick={() => this.handleOpenTab({
            source: 'tag',
            labelMapping: item.labelMapping || '',
            tagNumId: item.tagNumId || '',
            q: encodeURIComponent(item.labelNameVal),
          }, '客户列表', 'RCT_FSP_CUSTOMER_LIST')}
          title={item.labelDesc}
          rel="noopener noreferrer"
        >
          {item.labelNameVal}
        </a>);
    });
    return recommendList;
  }

  createOption() {
    const { dataSource, historySource, inputVal } = this.state;
    const newData = _.map(dataSource, this.renderOption);
    if (!_.isEmpty(inputVal)) {
      return newData;
    }
    const history = this.renderGroup(historySource);
    const options = newData.concat(history);
    return options;
  }

  @autobind
  handleSearchBtn() {
    const { inputVal } = this.state;
    const { data: { hotWds = EMPTY_OBJECT } } = this.props;
    if (!this.checkInputValue(inputVal)) {
      return false;
    }
    if (_.isEmpty(inputVal)) {
      // 搜索的时候，如果搜索框没有内容，将hotWds塞入搜索框
      this.setState({
        inputVal: hotWds.labelNameVal,
      });
    } else {
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
  // 清除历史搜索
  @autobind
  handleClearHistory() {
    const { clearFun } = this.props;
    clearFun();
    this.setState({
      historySource: [{
        title: '历史搜索',
        children: [{
          id: `history_${COUNT++}`,
          labelNameVal: '无',
          labelMapping: '',
          tagNumId: '',
          labelDesc: '',
        }],
      }],
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
        <a
          onClick={() => this.handleOpenTab({
            source: 'association',
            labelMapping: item.labelMapping || '',
            tagNumId: item.tagNumId || item.content,
            q: encodeURIComponent(item.content),
          }, '客户列表', 'RCT_FSP_CUSTOMER_LIST')}
          dangerouslySetInnerHTML={{ __html: newContent }}
          rel="noopener noreferrer"
        />
        <span className="desc">{item.desc}</span>
      </Option>
    );
  }

  renderGroup(dataSource) {
    const options = dataSource.map(group => (
      <OptGroup
        key={group.title}
        label={this.renderTitle(group.title)}
      >
        {group.children.map(item => (
          item.labelNameVal === '无' ?
            <Option key={item.id} text={item.labelNameVal} disabled>
              {item.labelNameVal}
            </Option> :
            <Option key={item.id} text={item.labelNameVal} >
              <a
                onClick={() => this.handleOpenTab({
                  source: 'search',
                  labelMapping: item.labelMapping || '',
                  tagNumId: item.tagNumId || '',
                  q: encodeURIComponent(item.labelNameVal),
                }, '客户列表', 'RCT_FSP_CUSTOMER_LIST')}
                rel="noopener noreferrer"
              >
                {item.labelNameVal}
              </a>
            </Option>
        ))}
      </OptGroup>
    ));
    return options;
  }

  renderTitle(title) {
    const { historySource } = this.state;
    if (historySource[0].children[0].labelNameVal === '无') {
      return (<span>
        {title}
      </span>);
    }
    return (
      <span>
        {title}
        <a
          className={styles.delHistory_a}
          rel="noopener noreferrer"
          onClick={this.handleClearHistory}
        >
          <AntdIcon type="delete" />清除历史记录
        </a>
      </span>
    );
  }

  render() {
    const { data: { hotWds = EMPTY_OBJECT,
      hotWdsList = EMPTY_LIST }, searchHistoryVal } = this.props;

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
                onSearch={_.debounce(this.handleSearch, 250)}
                placeholder={hotWds.labelNameVal || ''}
                optionLabelProp="text"
                defaultValue={searchHistoryVal}
              >
                <Input
                  suffix={(
                    <Button
                      className="search-btn"
                      size="large"
                      type="primary"
                      onClick={this.handleSearchBtn}
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
            <div>{this.handleCreatRecommend(hotWdsList)}</div>
          </div>
        </div>
      </div>
    );
  }
}
