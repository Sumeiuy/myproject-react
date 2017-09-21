import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import styles from './viewpoint.less';

export default class Viewpoint extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
  }

  static defaultProps = {
    dataSource: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      isFold: true,
    };
  }

  @autobind
  handleClick() {
    const { isFold } = this.state;
    this.setState({
      isFold: !isFold,
    });
  }

  @autobind
  renderContent() {
    const { dataSource } = this.props;
    const { isFold } = this.state;
    return dataSource.map((item, index) => (
      <div
        className={classnames(styles.row, { [styles.none]: (isFold && index >= 12) })}
      >
        <a onClick={() => {}}>{item.descri}</a>
      </div>
    ));
  }

  render() {
    const { dataSource } = this.props;
    const { isFold } = this.state;
    const isShow = dataSource.length > 12;
    return (
      <div className={styles.container}>
        <div className={styles.title}>首席投顾观点</div>
        <div className={styles.descriContainer}>
          {this.renderContent()}
        </div>
        {
          isShow ? (
            <div className={styles.fold} onClick={this.handleClick} >{isFold ? '更多' : '收起'}</div>
          ) : (
            null
          )
        }
      </div>
    );
  }
}
