/**
 * by xuxiaoqin
 * CommonScatter.js
 */
import React, { PropTypes } from 'react';
// import _ from 'lodash';
import IECharts from '../IECharts';

export default function CommonScatter(props) {
  const {
    onScatterHover,
    onScatterLeave,
    scatterOptions,
    onDispatch,
  } = props;

  return (
    <IECharts
      option={scatterOptions}
      resizable
      style={{
        height: '360px',
        width: '100%',
      }}
      onEvents={{
        mouseover: onScatterHover,
        mouseout: onScatterLeave,
      }}
      onDispatch={onDispatch}
    />
  );
}

CommonScatter.propTypes = {
  scatterOptions: PropTypes.object,
  scatterElemHeight: PropTypes.number.isRequired,
  onScatterHover: PropTypes.func.isRequired,
  onScatterLeave: PropTypes.func.isRequired,
  onDispatch: PropTypes.object,
};

CommonScatter.defaultProps = {
  scatterOptions: {},
  onDispatch: {},
};
