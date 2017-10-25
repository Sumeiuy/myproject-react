/**
 * @file components/common/filter/SingleFilter.js
 *  单项筛选
 * @author wangjunjun
 *
 * filterLabel string类型 筛选的对象 eg: '客户类型'
 * filterField array类型 筛选项
 * filter string类型 onChange回调方法中返回的对象的name值
 * value string类型 回填到组件的值，也是onChange回调方法中返回的对象的value值
 * onChange function类型 组件的回调方法，获取已选中的值
 *             返回一个对象 { name: 'name', value: 'value' }
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';

import Icon from '../Icon';
import { helper } from '../../../utils';

import styles from './filter.less';

export default class SingleFilter extends PureComponent {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    filterField: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  static defaultProps = {
    filterField: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      moreBtnVisible: false,
      fold: true,
    };
    this.domNodeLineHeight = '0px';
  }

  componentDidMount() {
    this.addMoreBtn();
  }

  // 判断是否超过一行，超过则显示 ... , 点击 ... 展开所有
  @autobind
  addMoreBtn() {
    if (this.domNode) {
      const domNodeHeight = helper.getCssStyle(this.domNode, 'height');
      this.domNodeLineHeight = helper.getCssStyle(this.domNode, 'line-height');
      if (parseInt(domNodeHeight, 10) >= 2 * parseInt(this.domNodeLineHeight, 10)) {
        this.domNode.style.height = this.domNodeLineHeight;
        this.setState({
          moreBtnVisible: true,
        });
      }
    }
  }

  @autobind
  handleClick(value) {
    const { filter, onChange } = this.props;
    this.setState({
      key: value,
    }, () => {
      onChange({
        name: filter,
        value,
      });
    });
  }

  @autobind
  handleMore() {
    const { fold } = this.state;
    this.domNode.style.height = fold ? 'auto' : this.domNodeLineHeight;
    this.setState({ fold: !fold });
  }

  render() {
    const { filterLabel, filterField, value } = this.props;
    const { moreBtnVisible, fold } = this.state;
    const isFold = fold ? '' : 'up';
    return (
      <div className={styles.filter}>
        <span>{filterLabel}:</span>
        <ul
          className={fold ? 'single' : 'multi'}
          ref={r => this.domNode = r}
        >
          {
            filterField.map(item => (
              <li
                key={item.key}
                className={value === item.key ? 'current' : ''}
                onClick={() => this.handleClick(item.key)}
              >
                {item.value}
              </li>
            ))
          }
          {
            moreBtnVisible ?
              <li className={styles.moreBtn} onClick={this.handleMore}>
                { fold ? '展开' : '收起' }&nbsp;
                <Icon type="more-down-copy" className={isFold} />
              </li> :
            null
          }
        </ul>
      </div>
    );
  }
}
