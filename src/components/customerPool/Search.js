/**
 * @file components/customerPool/Search.js
 *  客户池-搜索
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon, Button, Input, AutoComplete } from 'antd';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Link } from 'dva/router';
import styles from './search.less';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
export default class Search extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
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
    console.log(nextProps);
  }

  onSelect(value) {
    console.log('onSelect', value);
  }

  getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
  }

  searchResult(query) {
    return (new Array(this.getRandomInt(5))).join('.').split('.')
      .map((item, idx) => ({
        query,
        category: `${query}${idx}`,
        count: this.getRandomInt(200, 100),
      }));
  }

  @autobind
  handleSearch(value) {
    this.setState({
      dataSource: value ? this.searchResult(value) : [],
    });
  }

  createOption() {
    const { dataSource, historySource } = this.state;
    // debugger;
    const newData = dataSource.map(this.renderOption);
    const history = this.renderGroup(historySource);
    const options = newData.concat(history);
    return options;
  }

  renderOption(item) {
    return (
      <Option key={item.category} text={item.category}>
        {item.query} 在
        <a
          href={`https://s.taobao.com/search?q=${item.query}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.category}
        </a>
        区块中
        <span className="global-search-item-count">约 {item.count} 个结果</span>
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
    )).concat([
      <Option disabled key="removeHistory" className="removeHistory">
        <a>
          清除历史记录
        </a>
      </Option>,
    ]);
    return options;
  }

  renderTitle(title) {
    return (
      <span>
        {title}
      </span>
    );
  }

  render() {
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
                placeholder="两融业务潜在客户"
                optionLabelProp="text"
              >
                <Input
                  suffix={(
                    <Button className="search-btn" size="large" type="primary">
                      <Icon type="search" />
                    </Button>
                  )}
                />
              </AutoComplete>
            </div>
          </div>
          <div className={styles.historyList}>
            <div className={styles.inner}>
              <span className={styles.s_title}><Icon type="search" />猜你感兴趣：</span>
              <Link className="item" to="/customerPool/canDoToday">
                过去30天有大额资金转出客户
              </Link>
              <i className={styles.bd} />
              <Link className="item" to="/customerPool/canDoToday">
                国债逆回购潜在客户
              </Link>
              <i className={styles.bd} />
              <Link className="item" to="/customerPool/canDoToday">
                理财产品到期客户
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

