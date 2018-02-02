/*
 * @Description: 定制audio react 组件
 * @Author: XiaZhiQiang
 * @Date: 2018/2/1 12:48
 * @Last Modified by: XiaZhiQiang
 * @Last Modified time: 2018/2/1 12:48
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';
import { autobind } from 'core-decorators';
import ControlButton from './component/ControlButton';
import styles from './audio.less';

export default class Audio extends PureComponent {
  static propTypes = {
    autoplay: PropTypes.bool,
    preload: PropTypes.bool,
    src: PropTypes.string.isRequired,
    volume: PropTypes.number,
    tipFormatter: PropTypes.func,
  };

  static defaultProps = {
    autoplay: false,
    preload: true,
    volume: 0.8,
    tipFormatter: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isCanPlay: false,  // 是否加载至可开始播放
      currentTime: 0, // 当前播放时间
      totalTime: 0, // 音频总播放时间
    };
  }

  componentDidMount() {
  }
  // 滑块 --- start
  // 滑块tip格式化
  @autobind
  handleTipFormatter(value) {
    const duration = this.nativeAudio.duration;
    console.log(duration);
    return (value / 100) * duration;
  }
  // 滑块 --- end

  // 当音频可以播放时
  @autobind
  handleAudioCanplay() {
    this.setState({
      isCanPlay: true,
    });
  }
  // 当播放位置改变时
  handleTimeUpdate() {
  }
  render() {
    const { src, tipFormatter } = this.props;
    const { isCanPlay } = this.state;
    return (
      <div className={styles.audioContainer}>
        <audio
          preload="auto"
          src={src}
          ref={(audio) => { this.nativeAudio = audio; }}
          onCanPlay={() => this.handleAudioCanplay()}
          onTimeUpdate={() => this.handleTimeUpdate()}
        />
        <div className={styles.audioControl}>
          <ControlButton isPlay={isCanPlay} />
        </div>
        <div className={styles.currentTime}>00:00</div>
        <div className={styles.audioProgress}>
          <Slider
            defaultValue={30}
            tipFormatter={tipFormatter}
          />
        </div>
        <div className={styles.currentTime}>00:00</div>
      </div>
    );
  }
}
