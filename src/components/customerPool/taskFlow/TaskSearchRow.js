/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import { Radio } from 'antd';
import _ from 'lodash';
import styles from './taskSearchRow.less';

const RadioGroup = Radio.Group;
const radioData = [
  {
    title: '标签标签',
    number: '1234',
    cont: `标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，`,
    tips: '匹配字符',
    date: '2017-12-3',
    people: '张三',
  },
  {
    title: '标签标签',
    number: '768689',
    cont: '标签描述标签描述，标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，',
    tips: '匹配字符',
    date: '2017-12-31',
    people: '张三',
  },
  {
    title: '标签标签',
    number: '555555',
    cont: '标签描述标签描述，标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，\n' +
    '            标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，',
    tips: '匹配字符',
    date: '2017-12-21',
    people: '张三',
  },
];

export default class TaskSearchRow extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      addressEmail: {},
    };
  }

  // componentWillReceiveProps(nextProps) {
  // }
  componentDidUpdate() {
  }
  change(e) {
    console.log(1111111111);
    console.log('e.target.value', e.target.value);
  }
  render() {
    console.log(this.props);
    return (
      <RadioGroup name="radiogroup" onChange={this.change}>
        {_.map(radioData,
          item => <div className={styles.divRows}>
            <Radio value={item.number}><span className={styles.title}>{item.title}</span></Radio>
            <h4 className={styles.titExp}>瞄准镜标签，共有
              <span>{item.number}</span>客户。创建时间{item.date}，创建人：{item.people}
            </h4>
            <h4>标签描述标签描述，<span>{item.tips}</span>{item.cont}</h4>
            <a className={styles.seeCust}>查看客户</a>
          </div>)}
      </RadioGroup>
    );
  }
}
