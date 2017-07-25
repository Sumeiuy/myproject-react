/**
 * by xuxiaoqin
 * CommonScatter.js
 */
import React, { PropTypes } from 'react';
import _ from 'lodash';
import IECharts from '../IECharts';

export default function CommonScatter(props) {
  const {
    scatterElemHeight,
    onScatterHover,
    onScatterLeave,
    scatterOptions,
    onDispatch,
  } = props;

  if (_.isEmpty(scatterElemHeight.toString())) {
    return null;
  }

  return (
    <IECharts
      option={scatterOptions}
      resizable
      style={{
        height: scatterElemHeight,
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
