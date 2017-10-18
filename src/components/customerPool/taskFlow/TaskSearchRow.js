/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import { Radio } from 'antd';
// import _ from 'lodash';

import styles from './taskSearchRow.less';

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

  render() {
    console.log(this.props);
    return (
      <div className={styles.divRows}>
        <Radio value={this.props.value}><span className={styles.title}>标签标签</span></Radio>
        <h4 className={styles.titExp}>瞄准镜标签，共有<span>1234</span>客户。创建时间2017-12-3，创建人：张三</h4>
        <h4>标签描述标签描述，<span>匹配字符</span>标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
        标签描述标签描述标签描述，标签描述标签描述,标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
        标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
        标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，
        标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，标签描述标签描述标签描述，</h4>
        <a className={styles.seeCust}>查看客户</a>
      </div>
    );
  }
}
