/**
 * Created By K0170179 on 2018/1/11
 * 晨间播报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './morningBroadcast.less';

export default class MorningBroadcast extends PureComponent {
  static propTypes = {
    dataList: PropTypes.array.isRequired,
  };

  static defaultProps = {
    dataList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      activeMusic: 0,
    };
  }

  onHandleListen(id) {
    this.setState({
      activeMusic: id,
    });
  }

  @autobind
  onHandleClose() {
    this.setState({
      activeMusic: '',
    });
  }

  render() {
    const { dataList } = this.props;
    const { activeMusic } = this.state;
    return (
      <div className={styles.morning_broadcast}>
        <div className={styles.title}>
          <span>晨间播报</span>
          <span className={styles.more}> 更多&gt;&gt; </span>
        </div>
        <div className={styles.listWrap}>
          {
            dataList.map((item) => {
              if (activeMusic === item.id) {
                return (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.simpleName}>{item.simpleName}</div>
                    <div className={styles.music}>
                      <audio src={item.source} controls="controls">
                        Your browser does not support the audio element.
                      </audio>
                      <Icon onClick={this.onHandleClose} className={styles.close} type="close-circle" />
                    </div>
                  </div>
                );
              }
              return (
                <div key={item.id} className={styles.item}>
                  <span className={styles.desc}>{`${item.fullName}:${item.desc}`}</span>
                  <span
                    onClick={() => { this.onHandleListen(item.id); }}
                    className={styles.listen}
                  >收听</span>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

