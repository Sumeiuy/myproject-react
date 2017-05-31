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

export default class BoardHeader extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    postExcelInfo: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    changeBoard: PropTypes.func.isRequired,
    showScopeOrder: PropTypes.bool.isRequired,
    level: PropTypes.string,
  }

  static defaultProps = {
    level: '',
  }

  constructor(props) {
    super(props);
    const { location: { query }, level } = this.props;
    this.state = {
      scopeSelectValue: String(Number(level) + 1),
      showChart: query.showChart || 'zhuzhuangtu',
      orderType: query.orderType || 'desc',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: { orgId } } } = nextProps;
    const { location: { query: { orgId: preOrgId } } } = this.props;
    const { level } = nextProps;
    const { level: preLevel } = this.props;
    if (preLevel !== level || orgId !== preOrgId) {
      this.setState({
        scopeSelectValue: String(Number(level) + 1),
      });
    }
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
    this.setState({
      scopeSelectValue: v,
    });
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
    const { title, level, showScopeOrder } = this.props;
    const { showChart, orderType, scopeSelectValue } = this.state;

    const toggleScopeSelect = classnames({
      [styles.newSelect]: true,
      hideSelect: !showScopeOrder,
    });

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

    const toggleScope2Option = classnames({
      hideOption: Number(level) !== 1,
    });
    const toggleScope3Option = classnames({
      hideOption: Number(level) === 3,
    });

    return (
      <div className={styles.titleBar}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.titleBarRight}>
          <div className={styles.iconBtn1}>
            <span>排序方式:</span>
            <Select
              value={scopeSelectValue}
              className={toggleScopeSelect}
              onChange={this.handleScopeChange}
            >
              {
                sortByType.map((item, index) => {
                  const sortByTypeIndex = index;
                  let optionClass = '';
                  if (index === 0) {
                    optionClass = toggleScope2Option;
                  }
                  if (index === 1) {
                    optionClass = toggleScope3Option;
                  }
                  return (
                    <Option
                      className={optionClass}
                      key={sortByTypeIndex}
                      value={item.scope}
                    >
                      按{item.name}
                    </Option>
                  );
                })
              }
            </Select>
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
