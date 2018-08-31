/**
 * @Author: sunweibin
 * @Date: 2018-04-14 18:42:59
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-20 23:26:32
 * @description 服务记录下的附件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';
import { request } from '../../../config';
import { emp, getIconType } from '../../../helper';
import logable from '../../../decorators/logable';

import styles from './index.less';

const NO_HREF = 'javascript:void(0);'; // eslint-disable-line

export default class ServeRcordAttachment extends PureComponent {

  // 空方法，用于日志上传
  @autobind
  @logable({ type: 'Click', payload: { name: '附件下载' } })
  handleDownloadClick() { }

  render() {
    const { list } = this.props;
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
                        `${request.prefix}/file/ceFileDownload2?attachId=${item.attachId}&empId=${emp.getId()}&filename=${item.name}`}
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
}

ServeRcordAttachment.propTypes = {
  list: PropTypes.array.isRequired,
};
