/**
 * @Author: sunweibin
 * @Date: 2018-06-08 16:42:34
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-17 15:56:37
 * @description 投资建议模板内容展示
 */

import React from 'react';
import PropTypes from 'prop-types';

import styles from './choiceInvestAdviceTmplMode.less';

export default function TemplateContent(props) {
  const { content } = props;
  return (
    <div className={styles.cardBody}>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={content} // eslint-disable-line
      />
    </div>
  );
}

TemplateContent.propTypes = {
  content: PropTypes.object.isRequired,
};
