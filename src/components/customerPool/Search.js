/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Link } from 'dva/router';
import Icon from '../../components/common/Icon';
import styles from './search.less';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
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

  // constructor(props) {
  //   super(props);
  //   // console.log(props);
  // }

  state = {
    dataSource: EMPTY_LIST,
    historySource: [{
      title: '历史搜索',
      children: [{
        id: 0,
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

  // 历史搜索数据集合
  @autobind
  handleCreatHistoryList(data) {
    if (!_.isEmpty(data[0]) && data[0].length > 0) {
      console.log(data, '===================');
      const historyList = data.map(item => ({
        labelNameVal: item[0].labelNameVal,
        labelMapping: item[0].labelMapping,
        tagNumId: item[0].tagNumId,
        id: item[0].id,
        labelDesc: item[0].labelDesc,
      }));
      console.log(historyList, '00000000000000000');
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
        <Link
          target="_blank"
          className="item"
          to={`/customerPool/list?source=tag&labelMapping=${item.labelMapping || ''}&tagNumId=${item.tagNumId || ''}&q=${encodeURIComponent(item.labelNameVal)}`} // eslint-disable-line
          title={item.labelDesc}
        >
          {item.labelNameVal}
        </Link>);
      if (index !== data.length - 1) {
        recommendList.push(<i className={styles.bd} />);
      }
    });
    return recommendList;
  }

  createOption() {
    const { dataSource, historySource } = this.state;
    // debugger;
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
    const { push } = this.props;
    push({
      pathname: `/customerPool/list?source=search&q=${encodeURIComponent(inputVal)}`,
      query: {},
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
      <Option key={item.category} text={item.category}>
        <Link
          to={`/customerPool/list?source=association&labelMapping=${item.labelMapping || ''}&tagNumId=${item.tagNumId || item.content}&q=${encodeURIComponent(item.content)}`}
          target="_blank"
          rel="noopener noreferrer"
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
        key={group.title}
        label={this.renderTitle(group.title)}
      >
        {group.children.map(item => (
          item.title === '暂无数据' ?
            <Option key={item.id} value={item.labelNameVal} disabled>
              {item.labelNameVal}
            </Option> :
            <Option key={item.labelNameVal} value={item.labelNameVal} >
              <Link
                to={`/customerPool/list?source=association&labelMapping=${item.labelMapping || ''}&tagNumId=${item.tagNumId || ''}&q=${encodeURIComponent(item.labelNameVal)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.labelNameVal}
                <span className="certain-search-item-count">{item.labelDesc}</span>
              </Link>
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
        <a
          className={styles.delHistory_a}
          rel="noopener noreferrer"
        ><AntdIcon type="delete" />清除历史记录
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
