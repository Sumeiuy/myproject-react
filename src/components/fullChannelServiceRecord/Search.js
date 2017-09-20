/**
 * @file components/fullChannelServiceRecord/Search.js
 *  全渠道服务记录
 * @author wangjunjun
 */
import React, { PureComponent, PropTypes } from 'react';
import { Icon as AntdIcon, Button, Input, AutoComplete } from 'antd';

const Option = AutoComplete.Option;

import styles from './search.less'; // eslint-disable-line

function onSelect(value) {
  console.log('onSelect', value);
}

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
}

function searchResult(query) {
  return (new Array(getRandomInt(5))).join('.').split('.')
    .map((item, idx) => ({
      query,
      category: `${query}${idx}`,
      count: getRandomInt(200, 100),
    }));
}

function renderOption(item) {
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

export default class Search extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  handleSearch(value) {
    this.setState({
      dataSource: value ? searchResult(value) : [],
    });
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className={styles.search}>
        <AutoComplete
          className="global-search"
          size="large"
          style={{ width: '100%' }}
          dataSource={dataSource.map(renderOption)}
          onSelect={onSelect}
          onSearch={this.handleSearch}
          placeholder="input here"
          optionLabelProp="text"
        >
          <Input
            suffix={(
              <Button className="search-btn" size="large" type="primary">
                <AntdIcon type="search" />
              </Button>
            )}
          />
        </AutoComplete>
      </div>
    );
  }
}
