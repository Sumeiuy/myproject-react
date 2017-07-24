/**
* @fileOverview components/pageCommon/scrollBar.js
* @author hongguangqing
*/

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import styles from './scrollBar.less';

const clientWidthValue = document.querySelector('#exApp').clientWidth - 40;
export default class ScrollBar extends PureComponent {

  static propTypes = {
    allWidth: PropTypes.string.isRequired,
    setScrollLeft: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      clientWidth: clientWidthValue,
      scrollLeft: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, false);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
  }

  @autobind
  onWindowResize() {
    this.setState({ clientWidth: document.querySelector('#exApp').clientWidth - 40 });
  }

  @autobind
  handleScroll(e) {
    const { setScrollLeft } = this.props;
    const scrollLeft = e.target.scrollLeft;
    // 滚动条向左滚动距离的传递函数
    setScrollLeft(scrollLeft);
  }

  render() {
    const { clientWidth } = this.state;
    const { allWidth } = this.props;
    return (
      <div
        className={styles.reportScrollBar}
        style={{ width: clientWidth }}
        onScroll={this.handleScroll}
      >
        <div className={styles.reportScrollBarInner} style={{ width: allWidth }} />
      </div>
    );
  }
}
