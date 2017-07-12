/**
 * @description 简单的修改编辑器
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
// import { createForm } from 'rc-form';
import { autobind } from 'core-decorators';
import { Form, Icon } from 'antd';
import _ from 'lodash';

import styles from './SimpleEditor.less';

const FormItem = Form.Item;
const create = Form.create;

@create()
export default class SimpleEditor extends PureComponent {
  static propTypes = {
    editable: PropTypes.bool,
    editorState: PropTypes.bool,
    originalValue: PropTypes.string.isRequired,
    style: PropTypes.object,
    children: PropTypes.element,
    editorValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    editorName: PropTypes.string,
    form: PropTypes.object.isRequired,
    controller: PropTypes.func,
    confirm: PropTypes.func,
  }

  static defaultProps = {
    editable: true,
    editorState: false,
    style: {},
    children: null,
    editorName: '',
    editorValue: '' || {},
    controller: () => {},
    confirm: () => {},
  }

  constructor(props) {
    super(props);
    const { originalValue, editorState, editorValue } = props;
    this.state = {
      originalValue,
      editorValue,
      editing: editorState,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.exitEditState, false);
  }

  componentWillReceiveProps(nextProps) {
    const { editorState, editorValue, originalValue } = nextProps;
    const {
      editorState: preEditorState,
      editorValue: preEditor,
      originalValue: preOriginal,
    } = this.props;
    if (!_.isEqual(preEditorState, editorState)) {
      this.setState({
        editing: editorState,
      });
    }
    if (!_.isEqual(editorValue, preEditor)) {
      this.setState({
        editorValue,
      });
    }
    if (!_.isEqual(originalValue, preOriginal)) {
      this.setState({
        originalValue,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.exitEditState);
  }

  @autobind
  editorConfirm(e) {
    const { controller, confirm, editorName, form } = this.props;
    const newValue = form.getFieldValue(editorName);
    confirm({
      key: editorName,
      value: newValue,
    });
    controller(editorName, false);
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  editorCancel(e) {
    const { controller, editorName, form } = this.props;
    form.resetFields();
    controller(editorName, false);
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  enterEditState() {
    const { controller, editorName } = this.props;
    controller(editorName, true);
  }

  @autobind
  exitEditState() {
    const { controller, editorName, form } = this.props;
    form.resetFields();
    controller(editorName, false);
  }

  @autobind
  handleEditWrapperClick(e) {
    const { form, editorName, editable } = this.props;
    if (!editable) {
      return;
    }
    const editor = form.getFieldInstance(editorName);
    if (editor.focus) {
      editor.focus();
    } else {
      editor.expandSelect();
    }
    this.enterEditState();
    // 阻止React合成事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { editable, style, children, editorName } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { originalValue, editing, editorValue } = this.state;
    const editWrapperClass = classnames({
      [styles.editWrapper]: true,
      [styles.editable]: editable,
      [styles.editing]: editing,
    });
    const editIconClass = classnames({
      [styles.editIcon]: true,
      [styles.showIcon]: editable && !editing,
    });

    const editContentClass = classnames({
      [styles.editContent]: true,
    });

    const editButtonGroupClass = classnames({
      [styles.editButtonGroup]: true,
      [styles.editButtonGroupShow]: editable && editing,
    });

    return (
      <div className={editWrapperClass} style={style} onClick={this.handleEditWrapperClick}>
        <div className={editIconClass}>
          <Icon type="edit" />
        </div>
        {/* 修改取消和确认按钮 */}
        <div className={editButtonGroupClass}>
          <div className={styles.editBt} onClick={this.editorConfirm}><Icon type="check" /></div>
          <div className={styles.editBt} onClick={this.editorCancel}><Icon type="close" /></div>
        </div>
        <div className={editContentClass}>{originalValue}</div>
        {
          React.Children.map(children, child =>
            (<Form>
              <FormItem>
                {
                  getFieldDecorator(editorName, { initialValue: editorValue })(child)
                }
              </FormItem>
            </Form>))
        }
      </div>
    );
  }
}

