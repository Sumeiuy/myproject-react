/**
 * @descript 看板编辑页面
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Input } from 'antd';
import { autobind } from 'core-decorators';
import SimpleEditor from '../../components/Edit/SimpleEditor';
import SelfSelect from '../../components/Edit/SelfSelect';
import { VisibleRangeAll } from '../../components/Edit/VisibleRange';

import PreviewReport from '../reports/PreviewReport';

import styles from './Home.less';

const visibleRangeAll = VisibleRangeAll;

export default class BoardEditHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    boardName: PropTypes.string,
    visibleRange: PropTypes.array,
  }

  static defaultProps = {
    boardName: '分公司经营业绩看板',
    visibleRange: ['nj'],
  }

  constructor(props) {
    super(props);
    const { boardName, visibleRange } = this.props;
    this.state = {
      boardNameEditor: false,
      visibleRangeEditor: false,
      bNEditorOriginal: boardName,
      vROriginal: '经营业务总部/南京分公司',
      vREditorOriginal: visibleRange,
      preview: false,
    };
  }

  @autobind
  editorStateController(editor, flag) {
    if (flag) {
      // 如果是打开某一个,其余需要关闭
      this.setState({
        boardNameEditor: false,
        visibleRangeEditor: false,
        [editor]: true,
      });
    } else {
      // 如果是关闭则只是关闭
      this.setState({
        [editor]: false,
      });
    }
  }

  // editor按确认按钮的处理程序
  @autobind
  editorConfirm(obj) {
    const { key, value } = obj;
    if (key === 'boardNameEditor') {
      this.setState({
        bNEditorOriginal: value,
      });
    }
    if (key === 'visibleRangeEditor') {
      this.setState({
        vROriginal: value.label,
        vREditorOriginal: value.currency,
      });
    }
  }

  @autobind
  showPreview() {
    this.setState({
      preview: true,
    });
  }

  render() {
    const {
      boardNameEditor,
      visibleRangeEditor,
      bNEditorOriginal,
      vROriginal,
      vREditorOriginal,
      preview,
    } = this.state;
    const { location } = this.props;
    return preview ?
    (
      <PreviewReport
        location={location}
      />
    )
    :
    (
      <div className="page-invest content-inner">
        <div className={styles.editPageHd}>
          <div className={styles.HdName} onClick={this.showPreview}>看板编辑</div>
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
                originalValue={bNEditorOriginal}
                style={{
                  maxWidth: '350px',
                }}
                editorValue={bNEditorOriginal}
                editorName="boardNameEditor"
                controller={this.editorStateController}
                editorState={boardNameEditor}
                confirm={this.editorConfirm}
              >
                <Input />
              </SimpleEditor>
            </div>
            <div className={styles.hDivider} />
            <div className={styles.basicInfo}>
              <div className={styles.title}>可见范围:</div>
              <SimpleEditor
                editable
                originalValue={vROriginal}
                style={{
                  maxWidth: '450px',
                }}
                editorValue={{
                  currency: vREditorOriginal,
                  label: vROriginal,
                }}
                editorName="visibleRangeEditor"
                controller={this.editorStateController}
                editorState={visibleRangeEditor}
                confirm={this.editorConfirm}
              >
                <SelfSelect
                  options={visibleRangeAll}
                  level="1"
                  style={{ height: '30px' }}
                />
              </SimpleEditor>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
