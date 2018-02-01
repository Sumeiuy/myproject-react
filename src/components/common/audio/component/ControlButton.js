/*
 * @Description: 控制按钮
 * @Author: XiaZhiQiang
 * @Date: 2018/2/1 14:12
 * @Last Modified by: XiaZhiQiang
 * @Last Modified time: 2018/2/1 14:12
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PauseIcon from './svg/PauseIcon';
import PlayIcon from './svg/PlayIcon';


export default class ControlButton extends PureComponent {
  static propTypes = {
    isPlay: PropTypes.bool.isRequired,
  };

  render() {
    const { isPlay } = this.props;
    return (
      <button
        style={{
          transition: '.25s all ease',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#c5c3c3',
          border: 'none',
          cursor: 'pointer',
          'z-index': '10',
          outline: 'none',
        }}
      >
        {
          isPlay ? <PlayIcon /> : <PauseIcon />
        }
      </button>
    );
  }
}
