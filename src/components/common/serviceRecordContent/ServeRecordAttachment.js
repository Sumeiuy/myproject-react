/**
 * @Author: sunweibin
 * @Date: 2018-04-14 18:42:59
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-14 23:03:24
 * @description 服务记录下的附件
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Icon from '../../common/Icon';
import { request } from '../../../config';
import { emp, getIconType } from '../../../helper';

import styles from './index.less';

const NO_HREF = 'javascript:void(0);'; // eslint-disable-line

export default function ServeRcordAttachment(props) {
  const { list } = props;

  return (
    <div className={styles.uploadSection}>
      <div className={styles.uploadList}>
        {
          list.map(item => (
            <div key={item.attachId}>
              <span>附件:</span>
              <Icon className={styles.excelIcon} type={getIconType(item.name)} />
              <span>
                <a
                  onClick={this.handleDownloadClick}
                  href={
                    _.isEmpty(item.attachId) && _.isEmpty(item.name)
                      ? NO_HREF :
                      `${request.prefix}/file/ceFileDownload?attachId=${item.attachId}&empId=${emp.getId()}&filename=${item.name}`}
                >
                  {item.name}
                </a>
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

ServeRcordAttachment.propTypes = {
  list: PropTypes.array.isRequired,
};
