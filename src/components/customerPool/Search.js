/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
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
    queryHotWdsData: PropTypes.array,
    push: PropTypes.func.isRequired,
    orgId: PropTypes.string,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    queryHotPossibleWds: () => { },
    queryHotWdsData: EMPTY_LIST,
    orgId: '',
  }

  constructor(props) {
    super(props);
    console.log(props);
  }

  state = {
    dataSource: [],
    historySource: [{
      title: '历史搜索',
      children: [{
        title: 'AntDesign',
        count: 10000,
      }, {
        title: 'AntDesign UI',
        count: 10600,
      }],
    }],
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { queryHotWdsData: nextQueryHotWdsData } = nextProps;
    const { inputVal } = this.state;
    this.setState({
      dataSource: inputVal ? this.searchResult(inputVal, nextQueryHotWdsData) : [],
    });
  }

  componentDidUpdate() {
  }

  @autobind
  onSelect(value) {
    this.setState({
      inputVal: value,
    });
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
  async handleSearch(value) {
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
    await queryHotPossibleWds({
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
          target="_blank" // eslint-disable-line
          className="item" href={`/customerList/list?source=association&labelMapping=
          ${item.labelMapping}&tagNumId=${item.tagNumId}q=${item.labelNameVal}`}
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
      pathName: `/customerList/list?source=seach&q=${inputVal}`,
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
        <a
          href={`/customerList/list?source=association&labelMapping=
          ${item.labelMapping}&tagNumId=${item.tagNumId}q=${item.query}`}
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: newContent }}
        />
        <span>{item.desc}</span>
      </Option>
    );
  }

  renderGroup(dataSource) {
    const options = dataSource.map(group => (
      <OptGroup
        key={group.title}
        label={this.renderTitle(group.title)}
      >
        {group.children.map(opt => (
          <Option key={opt.title} value={opt.title}>
            {opt.title}
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

