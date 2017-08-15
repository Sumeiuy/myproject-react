/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
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
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    queryHotPossibleWds: () => { },
    queryHistoryWdsList: () => { },
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
        labelNameVal: '暂无数据',
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
    const { historyWdsList: preHistoryWdsList } = this.props;
    const { queryHotWdsData: nextQueryHotWdsData, historyWdsList: nextHistoryWdsList } = nextProps;
    const { inputVal } = this.state;
    this.setState({
      dataSource: inputVal ? this.searchResult(inputVal, nextQueryHotWdsData) : [],
    });
    if (!_.isEqual(nextHistoryWdsList, preHistoryWdsList)) {
      this.handleCreatHistoryList(nextHistoryWdsList);
    }
  }

  componentDidUpdate() {
  }

  @autobind
  onSelect(value) {
    this.setState({
      inputVal: value,
    });
  }

  @autobind
  handleOpenTab(obj, title, id) {
    const {
      source,
      labelMapping,
      tagNumId,
      q } = obj;
    const { push } = this.props;
    const url = '/customerPool/list';
    if (process.env.NODE_ENV === 'production') {
      const toFspUrl = `${url}?source=${source}&labelMapping=${labelMapping}&tagNumId=${tagNumId}&q=${q}`;
      fspGlobal.openRctTab(
        toFspUrl,
        {
          closable: true,
          forceRefresh: true,
          isSpecialTab: true,
          id, // 'FSP_SERACH',
          title, // '搜索目标客户',
        },
      );
    } else {
      push({
        pathname: url,
        query: obj,
      });
    }
  }

  // 历史搜索数据集合
  @autobind
  handleCreatHistoryList(data) {
    console.log(data); // 历史搜索数据接口未好暂时注释
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
    const { dataSource, historySource } = this.state;
    const newData = dataSource.map(this.renderOption);
    if (dataSource.length > 0) {
      return newData;
    }
    const history = this.renderGroup(historySource);
    const options = newData.concat(history);
    return options;
  }

  @autobind
  handleSearchBtn() {
    const { inputVal } = this.state;
    this.handleOpenTab({
      source: 'association',
      labelMapping: '',
      tagNumId: '',
      q: encodeURIComponent(inputVal),
    }, '搜索目标客户', 'FSP_SEARCH');
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
      <Option key={item.content} text={item.content}>
        <a
          onClick={() => this.handleOpenTab({
            source: 'association',
            labelMapping: item.labelMapping || '',
            tagNumId: item.tagNumId || item.content,
            q: encodeURIComponent(item.content),
          }, '搜索目标客户', 'FSP_SEARCH')}
          dangerouslySetInnerHTML={{ __html: newContent }}
        />
        <span>{item.desc}</span>
      </Option>
    );
  }

  renderGroup(dataSource) {
    console.log(dataSource, '9999999999999');
    const options = dataSource.map(group => (
      <OptGroup
        key={group.id}
        label={this.renderTitle(group.title)}
      >
        {group.children.map(item => (
          item.title === '暂无数据' ?
            <Option key={item.labelNameVal} text={item.labelNameVal} disabled>
              {item.labelNameVal}
            </Option> :
            <Option key={item.labelNameVal} text={item.labelNameVal} >
              <a
                rel="noopener noreferrer"
                onClick={() => this.handleOpenTab({
                  source: 'association',
                  labelMapping: item.labelMapping || '',
                  tagNumId: item.tagNumId || '',
                  q: encodeURIComponent(item.labelNameVal),
                }, '搜索目标客户', 'FSP_SEARCH')}
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
    return (
      <span>
        {title}
        {/* <a
          className={styles.delHistory_a}
          rel="noopener noreferrer"
        ><AntdIcon type="delete" />清除历史记录
        </a>*/}
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
