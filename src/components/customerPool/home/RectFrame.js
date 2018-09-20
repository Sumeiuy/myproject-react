/**
 * @file components/customerPool/home/RectFrame.js
 *  存在不同指标的矩形框，带有title。样子类似：----和 | 都是solid线
 * ----------
 * |title   |
 * ----------
 * |        |
 * |        |
 * ----------
 * @author zhangjunli
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';

import Icon from '../../common/Icon';

import antdStyles from '../../../css/antd.less';
import styles from './rectFrame.less';
import classes from './reactFrame__.less';

function RectFrame(props) {
  const {
    dataSource: { title, icon },
    children,
    desc,
    isNewHome,
    noMargin,
  } = props;

  const trueStyles = isNewHome ? classes : styles;

  let contentCls = styles.content;
  if (noMargin) {
    contentCls = ''
  } else if(isNewHome) {
    contentCls = classes.content;
  }

  return (
    <div className={trueStyles.container}>
      <div className={trueStyles.header}>
        {
          (_.isEmpty(icon) || isNewHome) ? (
            <span style={{ display: 'inline-block', width: 6, height: 26 }} />
          ) : (
            <Icon type={icon} />
          )
        }
        {
          desc ?
            (
              <Popover
                title={title}
                content={desc}
                placement="bottom"
                mouseEnterDelay={0.2}
                overlayClassName={antdStyles.popoverClass}
              >
                <div className={trueStyles.title}>{title}</div>
              </Popover>
            ) :
            <div className={trueStyles.title}>{title}</div>
        }
      </div>
      <div className={contentCls}>{children}</div>
    </div>
  );
}

RectFrame.defaultProps = {
  desc: null,
  noMargin: false,
};

RectFrame.propTypes = {
  dataSource: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  noMargin: PropTypes.bool,
  desc: PropTypes.string,
};

export default RectFrame;
