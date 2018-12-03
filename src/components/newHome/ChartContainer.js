import React from 'react';
import PropTypes from 'prop-types';
import RectFrame from '../customerPool/home/RectFrame';

export default function ChartContiner(props) {
  return (
    <RectFrame
      dataSource={props.dataSource}
      isNewHome
      noMargin={!props.margin}
      isfromAsset={props.margin}
    >
      {props.children}
    </RectFrame>
  );
}

ChartContiner.propTypes = {
  dataSource: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
