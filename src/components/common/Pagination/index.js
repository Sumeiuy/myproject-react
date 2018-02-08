/**
 * @file common/Pagination/index.js
 *  分页组件
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Pagination } from 'antd';
import styles from './index.less';

function renderTotal(total) {
  /*  return total !== 0 ? `第${range[0]}-${range[1]}条，共${total}条` : `共${total}条`; */
  return `共${total}条`;
}

// 每页最多40条记录
// 最极端的情况下pageSize最小也只会设置成5
function renderPageSizeOptions(pageSize) {
  const maxOption = Math.ceil(40 / pageSize);
  const pageSizeOptionsArray = [];
  for (let i = 1; i <= maxOption; i++) {
    pageSizeOptionsArray.push((pageSize * i).toString());
  }
  return pageSizeOptionsArray;
}

// 是否应该隐藏最后一页的按钮
function shouldHideLastButton(current, pageSize, total) {
  // 当最后一页与当前页相差5页时显示最后一页
  const SHOW_NUMBER = 2;
  const totalPageNumber = pageSize && (total / pageSize);
  if ((totalPageNumber - current) > SHOW_NUMBER) {
    return true;
  }

  return false;
}

export default class PaginationComponent extends PureComponent {
  static propTypes = {
    current: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    onChange: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    showSizeChanger: PropTypes.bool,
    isHideLastButton: PropTypes.bool,
    isShortPageList: PropTypes.bool,
    // 如果为true， 就不要加commonPage了，历史遗留问题，默认false
    useClearStyle: PropTypes.bool,
  };
  static defaultProps = {
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: false,
    isHideLastButton: false, // 默认情况下不隐藏最后一页
    isShortPageList: false, // 默认情况下使用标准长度的分页列表
    onChange: _.noop,
    onShowSizeChange: _.noop,
    useClearStyle: false,
  };

  constructor(props) {
    super(props);
    const { current, pageSize, total, isHideLastButton } = props;
    this.state = isHideLastButton ?
    {
      current,
      shouldHideLastButton: shouldHideLastButton(current, pageSize, total),
    } :
    { current };
  }

  // 之所以这里写这个生命周期，是为了应对当props请求的数据在组件初始化以后才到来时，
  // 可以控制最后一页的按钮显示，以及当前页
  componentWillReceiveProps(nextProps) {
    const { isHideLastButton, total: prevTotal, current: prevCurrent } = this.props;
    const { current, pageSize, total } = nextProps;

    // props.total发生变化就更新组件
    if (total !== prevTotal) {
      if (isHideLastButton) {
        this.setState({
          current,
          shouldHideLastButton: shouldHideLastButton(current, pageSize, total),
        });
      } else {
        this.setState({ current });
      }
    } else if (current === 1 && prevCurrent > 1) { // 这里是为了处理模态框关闭重新进入时，将页码置为1
      this.setState({
        current,
      });
    }
  }

  // 之所以这里声明这个，是因为部分页面对该组件的使用不恰当，导致组件过多渲染，
  // 分页切换时，出现卡顿，样式不同步问题，使用该函数修正此类问题
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.current !== this.state.current || nextProps.total !== this.props.total) {
      return true;
    }
    return false;
  }

  @autobind
  handlePageChange(page, pageSize) {
    const { total, onChange, isHideLastButton } = this.props;
    if (isHideLastButton) {
      this.setState({
        current: page,
        shouldHideLastButton: shouldHideLastButton(page, pageSize, total),
      });
    } else {
      this.setState({
        current: page,
      });
    }
    onChange(page, pageSize);
  }


  @autobind
  handlePageSizeChange(current, size) {
    const { total, onShowSizeChange, isHideLastButton } = this.props;
    if (isHideLastButton) {
      this.setState({
        current,
        shouldHideLastButton: shouldHideLastButton(current, size, total),
      });
    } else {
      this.setState({
        current,
      });
    }
    onShowSizeChange(current, size);
  }

  render() {
    const { pageSize, isShortPageList, total, useClearStyle } = this.props;
    const { current } = this.state;
    return (
      <div
        className={classnames({
          [styles.commonPage]: useClearStyle === false,
          [styles.hidden]: total === 0,
          [styles.shortPageList]: isShortPageList,
          [styles.hideLastButton]: this.state.shouldHideLastButton,
        })}
      >
        <Pagination
          {...this.props}
          showTotal={renderTotal}
          pageSizeOptions={renderPageSizeOptions(pageSize)}
          onChange={this.handlePageChange}
          onShowSizeChange={this.handlePageSizeChange}
          current={current}
        />
      </div>
    );
  }
}

