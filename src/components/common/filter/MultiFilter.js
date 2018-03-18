/**
 * @file components/common/filter/SingleFilter.js
 *  多项筛选
 * @author wangjunjun
 *
 * filterLabel string类型 筛选的对象 eg: '客户类型'
 * filterField array类型 筛选项
 * filter string类型 onChange回调方法中返回的对象的name值
 * value string类型 回填到组件的值，也是onChange回调方法中返回的对象的value值
 * separator string类型 多选的分割符号，可选, 默认逗号分割
 * onChange function类型 组件的回调方法，获取已选中的值
 *             返回一个对象 { name: 'name', value: 'value' }
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

import Icon from '../Icon';
import { dom } from '../../../helper';
import { fspContainer } from '../../../config';

import styles from './filter.less';

const currentClass = 'current';

const generateCls = (v, k) => {
  if (_.isEmpty(v) && k === '') {
    return currentClass;
  } else if (v.indexOf(k) > -1) {
    return currentClass;
  }
  return '';
};

export default class MultiFilter extends PureComponent {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    filterField: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    separator: PropTypes.string,
    valueArray: PropTypes.array,
  }

  static defaultProps = {
    filterField: [],
    separator: ',',
    valueArray: [],
  }

  constructor(props) {
    super(props);
    const { value, separator, valueArray } = props;
    this.state = {
      keyArr: value ? value.split(separator) : [],
      valueArray,
      moreBtnVisible: false,
      fold: true,
    };
    this.domNodeLineHeight = '0px';
  }

  componentDidMount() {
    this.addMoreBtn();
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.addMoreBtn);
      sidebarShowBtn.addEventListener('click', this.addMoreBtn);
    }
  }

  componentWillUnmount() {
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.addMoreBtn);
      sidebarShowBtn.removeEventListener('click', this.addMoreBtn);
    }
  }

  // 判断是否超过一行，超过则显示 ... , 点击 ... 展开所有
  @autobind
  addMoreBtn() {
    if (this.domNode) {
      const domNodeHeight = dom.getCssStyle(this.domNode, 'height');
      this.domNodeLineHeight = dom.getCssStyle(this.domNode, 'line-height');
      if (parseInt(domNodeHeight, 10) >= 2 * parseInt(this.domNodeLineHeight, 10)) {
        this.domNode.style.height = this.domNodeLineHeight;
        this.setState({
          moreBtnVisible: true,
        });
      } else {
        this.domNode.style.height = 'auto';
        this.setState({
          moreBtnVisible: false,
          fold: true,
        });
      }
    }
  }

  @autobind
  handleClick({ key, value, filterLabel }) {
    const { keyArr, valueArray } = this.state;
    const { separator, filter, onChange } = this.props;
    const valueArr =
      _.includes(valueArray, value) ? valueArray.filter(v => v !== value) : [...valueArray, value];
    if (key) {
      this.setState({
        keyArr: _.includes(keyArr, key) ? keyArr.filter(v => v !== key) : [...keyArr, key],
        valueArray: valueArr,
      }, () => {
        onChange({
          name: filter,
          filterLabel,
          key: this.state.keyArr.join(separator),
          valueArray: valueArr,
        });
      });
    } else { // 如果选中了不限
      this.setState({
        keyArr: [],
        valueArray: [],
      }, () => {
        onChange({
          name: filter,
          filterLabel,
          valueArray: [],
          key: '',
        });
      });
    }
  }

  @autobind
  handleMore() {
    const { fold } = this.state;
    this.domNode.style.height = fold ? 'auto' : this.domNodeLineHeight;
    this.setState({ fold: !fold });
  }

  @autobind
  renderList() {
    const { filterField, filterLabel } = this.props;
    const { keyArr } = this.state;
    return filterField.map(item => (
      <li
        key={item.key}
        className={generateCls(keyArr, item.key)}
        onClick={() => this.handleClick({ key: item.key, value: item.value, filterLabel })}
      >
        {item.value}
      </li>
    ));
  }

  render() {
    const { filterLabel, filterField } = this.props;
    const { moreBtnVisible, fold } = this.state;
    if (_.isEmpty(filterField)) {
      return null;
    }
    const foldClass = classnames({ up: !fold });
    return (
      <div className={styles.filter}>
        <span title={filterLabel}>{filterLabel}:</span>
        <ul
          className={fold ? 'single' : 'multi'}
          ref={r => this.domNode = r}
        >
          {
            this.renderList()
          }
          {
            moreBtnVisible ?
              <li className={styles.moreBtn} onClick={this.handleMore}>
                { fold ? '展开' : '收起' }&nbsp;
                <Icon type="more-down-copy" className={foldClass} />
              </li> :
            null
          }
        </ul>
      </div>
    );
  }
}
