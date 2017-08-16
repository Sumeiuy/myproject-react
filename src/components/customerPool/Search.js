/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon as AntdIcon, Button, Input, AutoComplete, message } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { fspGlobal } from '../../utils';
import Icon from '../../components/common/Icon';
import styles from './search.less';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
let COUNT = 0;
export default class Search extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
    queryHotPossibleWds: PropTypes.func,
    queryHistoryWdsList: PropTypes.func,
    queryHotWdsData: PropTypes.array,
    push: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    historyWdsList: PropTypes.array,
    clearSeccess: PropTypes.object,
    clearFun: PropTypes.func,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    queryHotPossibleWds: () => { },
    queryHistoryWdsList: () => { },
    clearFun: () => { },
    clearSeccess: EMPTY_OBJECT,
    queryHotWdsData: EMPTY_LIST,
    orgId: '',
    historyWdsList: EMPTY_LIST,
  }

  state = {
    dataSource: EMPTY_LIST,
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

  componentWillMount() {
    this.handleCreatHistoryList(this.props.historyWdsList);
  }

  componentWillReceiveProps(nextProps) {
    const { historyWdsList: preHistoryWdsList, clearSeccess: preClearSeccess } = this.props;
    const { queryHotWdsData: nextQueryHotWdsData,
      historyWdsList: nextHistoryWdsList,
      clearSeccess: nextClearSeccess } = nextProps;
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

  componentDidUpdate() {
  }

  @autobind
  onSelect(value) {
    console.log(value);
    this.setState({
      inputVal: value,
    });
  }

  @autobind
  handleOpenTab(obj, titles, ids) {
    const {
      source,
      labelMapping,
      tagNumId,
      q } = obj;
    const { push } = this.props;
    const firstUrl = '/customerPool/list';
    if (process.env.NODE_ENV === 'production') {
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
            id: `historyList${COUNT++}`,
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
    return hotList.map((item, index) => ({
      query,
      category: `${item.labelNameVal}${index}`,
      content: item.labelNameVal,
      desc: item.labelDesc,
      id: `autoList${COUNT++}`,
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
    this.setState({
      inputVal: value,
    });
    const { queryHotPossibleWds } = this.props;
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
    data.forEach((item, index) => {
      recommendList.push(
        <a
          className="item"
          onClick={() => this.handleOpenTab({
            source: 'tag',
            labelMapping: item.labelMapping || '',
            tagNumId: item.tagNumId || '',
            q: encodeURIComponent(item.labelNameVal),
          }, '标签目标客户', 'FSP_TAG')}
          title={item.labelDesc}
          rel="noopener noreferrer"
        >
          {item.labelNameVal}
        </a>);
      if (index !== data.length - 1) {
        recommendList.push(<i className={styles.bd} />);
      }
    });
    return recommendList;
  }

  createOption() {
    const { dataSource, historySource, inputVal } = this.state;
    const newData = dataSource.map(this.renderOption);
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
    let searchVal = inputVal;
    if (_.isEmpty(_.trim(inputVal))) {
      // message.info('搜索内容不能为空', 1);
      // return;
      searchVal = hotWds.labelNameVal;
    }
    this.handleOpenTab({
      source: 'search',
      labelMapping: '',
      tagNumId: '',
      q: encodeURIComponent(searchVal),
    }, '搜索目标客户', 'FSP_SEARCH');
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
    // debugger;
    const newContent = item.content.replace(inputVal, `<em>${inputVal}</em>`);
    // 联想 association
    // 搜索 search
    // 标签 tag
    return (
      <Option key={item.category} text={item.content}>
        <a
          onClick={() => this.handleOpenTab({
            source: 'association',
            labelMapping: item.labelMapping || '',
            tagNumId: item.tagNumId || item.content,
            q: encodeURIComponent(item.content),
          }, '搜索目标客户', 'FSP_SEARCH')}
          dangerouslySetInnerHTML={{ __html: newContent }}
          rel="noopener noreferrer"
        />
        <span className="desc">{item.desc}</span>
      </Option>
    );
  }

  renderGroup(dataSource) {
    // debugger;
    const options = dataSource.map(group => (
      <OptGroup
        key={group.id}
        label={this.renderTitle(group.title)}
      >
        {group.children.map(item => (
          item.labelNameVal === '无' ?
            <Option key={item.id} text={item.labelNameVal} disabled>
              {item.labelNameVal}
            </Option> :
            <Option key={item.labelNameVal} text={item.labelNameVal} >
              <a
                onClick={() => this.handleOpenTab({
                  source: 'association',
                  labelMapping: item.labelMapping || '',
                  tagNumId: item.tagNumId || '',
                  q: encodeURIComponent(item.labelNameVal),
                }, '搜索目标客户', 'FSP_SEARCH')}
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
      hotWdsList = EMPTY_LIST } } = this.props;
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
                placeholder={hotWds.labelNameVal || ''}
                optionLabelProp="text"
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
            <div className={styles.inner}>
              <span className={styles.s_title}>
                <Icon type="dengpao" />猜你感兴趣：
              </span>
              <div>{this.handleCreatRecommend(hotWdsList)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
