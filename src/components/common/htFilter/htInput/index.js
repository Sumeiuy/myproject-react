import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './input.less';

export default function HtInput(props) {
  const { unitStyle, ...restProps } = props;
  return (
    <div className={styles.input}>
      <Input {...restProps} autoFocus={props.autoFocus} />
      <span className={styles.unit} style={unitStyle}>{props.unit}</span>
    </div>
  );
}

HtInput.propTypes = {
  unit: PropTypes.string.isRequired,
  unitStyle: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
};

HtInput.defaultProps = {
  autoFocus: false,
};
