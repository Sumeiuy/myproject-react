import React from 'react';
import PropTypes from 'prop-types';
import IfEmpty from '../customerPool/common/IfEmpty';
import RectFrame from '../customerPool/home/RectFrame';

export default function ChartContiner(props) {
  return (
    <RectFrame
      dataSource={props.dataSource}
      isNewHome
      noMargin
    >
      <IfEmpty isEmpty={props.isEmpty}>
        {props.children}
      </IfEmpty>
    </RectFrame>
  );
}

ChartContiner.propTypes = {
  dataSource: PropTypes.object.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};
