/**
 * @descript 看板编辑页面
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import { Input } from 'antd';
import SimpleEditor from '../../components/Edit/SimpleEditor';
import SelfSelect from '../../components/Edit/SelfSelect';
import { VisibleRangeAll } from '../../components/Edit/VisibleRange';
import styles from './Home.less';

const visibleRange = VisibleRangeAll;

export default class BoardManageHome extends PureComponent {
  render() {
    return (
      <div className="page-invest content-inner">
        <div className={styles.editPageHd}>
          <div className={styles.HdName}>看板编辑</div>
        </div>
        <div className={styles.editBasicHd}>
          <div className={styles.editBasic}>
            <div className={styles.basicInfo}>
              <div className={styles.title}>看板类型:</div>
              <SimpleEditor
                editable={false}
                originalValue="经营业绩"
              />
            </div>
            <div className={styles.hDivider} />
            <div className={styles.basicInfo}>
              <div className={styles.title}>看板名称:</div>
              <SimpleEditor
                editable
                originalValue="分公司经营业绩看板分公司经营业绩看板分公司经营业绩看板"
                style={{
                  maxWidth: '350px',
                }}
                editorValue="分公司经营业绩看板"
                editorName="boardName"
              >
                <Input />
              </SimpleEditor>
            </div>
            <div className={styles.hDivider} />
            <div className={styles.basicInfo}>
              <div className={styles.title}>可见范围:</div>
              <SimpleEditor
                editable
                originalValue="经济业务总部/南京分公司/北京分公司/经济业务总部/南京分公司/北京分公司/经济业务总部/南京分公司/北京分公司"
                style={{
                  maxWidth: '450px',
                }}
                editorValue={['zong']}
                editorName="visibleRange"
              >
                <SelfSelect options={visibleRange} level="1" style={{ height: '30px' }} />
              </SimpleEditor>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
