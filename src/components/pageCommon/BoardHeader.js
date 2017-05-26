/**
 * @fileOverview invest/BoardHeader.js
 * @author sunweibin
 * @description 业绩看板头部
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import { optionsMap } from '../../config';
import Icon from '../common/Icon';
import styles from './BoardHeader.less';

// Select的选项组件
const Option = Select.Option;
// 自高到低、自低到高排序选项
const sortByOrder = optionsMap.sortByOrder;
const sortByOrderSelect = sortByOrder.map((item, index) => {
  const optionKey = `Order-${index}`;
  return (React.createElement(Option, { key: optionKey, value: `${item.key}` }, `${item.name}`));
});
// 按类别排序
const sortByType = optionsMap.sortByType;
function createOrderTypeSelectOptions(options, defaultValue) {
  return (onChange) => {
    const selectOptions = options.map((item, index) => {
      const optionKey = `options-${item.scope}-${index}`;
      return (React.createElement(Option, { key: optionKey, value: `${item.scope}` }, `按${item.name}`));
    });
    const props = {
      key: `typeSelect-${defaultValue}`,
      defaultValue,
      className: styles.newSelect,
      onChange,
    };
    return React.createElement(Select, props, selectOptions);
  };
}

const sortByTypeSelect3 = createOrderTypeSelectOptions(sortByType, '2');
const sortByTypeSelect2 = createOrderTypeSelectOptions(sortByType.slice(1), '3');
const sortByTypeSelect1 = createOrderTypeSelectOptions(sortByType.slice(2), '4');


export default class BoardHeader extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    postExcelInfo: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    changeBoard: PropTypes.func.isRequired,
    level: PropTypes.string,
  }

  static defaultProps = {
    level: '',
  }

  constructor(props) {
    super(props);
    const { location: { query } } = this.props;
    this.state = {
      showChart: query.showChart || 'zhuzhuangtu',
      orderType: query.orderType || 'desc',
    };
  }

  @autobind
  generateSelect(level) {
    // level = 1 || 2 || 3
    const NLevel = Number(level);
    if (NLevel === 1) {
      return sortByTypeSelect3(this.handleScopeChange);
    } else if (NLevel === 2) {
      return sortByTypeSelect2(this.handleScopeChange);
    } else if (NLevel === 3) {
      return sortByTypeSelect1(this.handleScopeChange);
    }
    return null;
  }


  @autobind
  handleDataExportClick() {
    const { postExcelInfo } = this.props;
    postExcelInfo();
  }

  // 柱状图与表格切换
  @autobind
  handleIconClick(type) {
    // const val = event.target.getAttribute('type');
    const { replace, location: { query }, changeBoard } = this.props;
    replace({
      pathname: '/invest',
      query: {
        ...query,
        showChart: type,
        page: type !== 'tables' ? '1' : query.page,
      },
    });
    this.setState({
      showChart: type,
    });
    changeBoard(type);
  }

  @autobind
  handleSortChange(column, value) {
    const { replace, location: { query } } = this.props;
    replace({
      pathname: '/invest',
      query: {
        ...query,
        [column]: value,
      },
    });
  }

  @autobind
  handleScopeChange(v) {
    this.handleSortChange('scope', v);
  }
  @autobind
  handleOrderTypeChange(v) {
    this.handleSortChange('orderType', v);
  }

  @autobind
  handleTablesIconClick() {
    this.handleIconClick('tables');
  }

  @autobind
  handleBarIconClick() {
    this.handleIconClick('zhuzhuangtu');
  }

  render() {
    // 取出相关变量
    const { title, level } = this.props;
    const { showChart, orderType } = this.state;

    const toggleOrderTypeSelect = classnames({
      [styles.newSelect1]: true,
      hideSelect: showChart === 'tables',
    });

    const toggleBarIconColor = classnames({
      [styles.fixMargin]: true,
      iconColor: showChart === 'zhuzhuangtu',
    });
    const toggleTableIconColor = classnames({
      [styles.fixMargin]: true,
      iconColor: showChart === 'tables',
    });

    return (
      <div className={styles.titleBar}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.titleBarRight}>
          <div className={styles.iconBtn1}>
            <span>排序方式:</span>
            {this.generateSelect(level)}
            <Select
              defaultValue={orderType}
              className={toggleOrderTypeSelect}
              onChange={this.handleOrderTypeChange}
            >
              {sortByOrderSelect}
            </Select>
          </div>
          <div className={styles.iconBtn}>
            <Icon
              title={'表格视图'}
              type={'tables'}
              className={toggleTableIconColor}
              onClick={this.handleTablesIconClick}
            />
            <Icon
              title={'柱状视图'}
              type={'zhuzhuangtu'}
              className={toggleBarIconColor}
              onClick={this.handleBarIconClick}
            />
          </div>
          <div className={styles.iconBtn}>
            <Icon
              title="导出到文件"
              type="daochu"
              onClick={this.handleDataExportClick}
            />
          </div>
        </div>
      </div>
    );
  }
}
