/**
 * @description 定制看板预览页面
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Button } from 'antd';
import ReportHome from './Home';
import { getCssStyle } from '../../utils/helper';

import styles from './PreviewReport.less';

// 首先判断wrap存在与否
const contentWrapper = document.getElementById('workspace-content');

export default class PreviewReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    reportName: PropTypes.string,
    boardId: PropTypes.number,
    boardType: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    reportName: '预览报表临时名称哈哈哈哈哈哈哈哈哈',
    boardId: 2,
    boardType: 'TYPE_JYYJ',
  }

  render() {
    const { location, reportName, boardId, boardType } = this.props;
    return (
      <div className={styles.previewReport}>
        <ReportHome
          preView
          reportName={reportName}
          location={location}
          boardId={boardId}
          boardType={boardType}
        />
        <div
          className={styles.previewLayout}
          style={{
            left: contentWrapper ? getCssStyle(contentWrapper, 'left') : '0',
          }}
        >
          <Button key="publish" className={styles.preButton} size="large" type="primary">发布</Button>
          <Button key="back" className={styles.preButton}size="large" ghost>返回</Button>
        </div>
      </div>
    );
  }
}
