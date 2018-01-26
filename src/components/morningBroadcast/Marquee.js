/**
 * Created By K0170179 on 2018/1/26
 * 文字滚动
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

import React, { PureComponent, PropTypes } from 'react';
import styles from './marquee.less';

let modify;
export default class Marquee extends PureComponent {
  static propTypes = {
    content: PropTypes.node.isRequired,
    speed: PropTypes.number,
  };

  static defaultProps = {
    speed: 20,
  };

  componentDidMount() {
    const { speed } = this.props;
    const wrap = this.wrap;
    const wrapStyle = wrap.style;
    const scrollDiv1 = this.content1;
    const itemWidth = scrollDiv1.offsetWidth;
    let wrapLeftNum = 0;
    function marqueeMachine() {
      if (itemWidth === wrapLeftNum) {
        wrapLeftNum = 0;
      }
      wrapStyle.left = `-${wrapLeftNum++}px`;
    }

    modify = setInterval(marqueeMachine, speed);
    wrap.onmouseover = function StartScroll() {
      clearInterval(modify);
    };

    wrap.onmouseout = function StopScroll() {
      modify = setInterval(marqueeMachine, speed);
    };
  }

  componentWillUnmount() {
    clearInterval(modify);
  }

  render() {
    const { content } = this.props;
    return (
      <div className={styles.container}>
        <div ref={(c) => { this.wrap = c; }} className={styles.wrap}>
          <div ref={(c) => { this.content1 = c; }} className={styles.item}>
            {content}
          </div>
          <div>
            {content}
          </div>
        </div>
      </div>
    );
  }
}
