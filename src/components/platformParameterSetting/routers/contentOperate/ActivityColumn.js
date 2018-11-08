/*
 * @Author: zhangjun
 * @Descripter: 活动栏目
 * @Date: 2018-11-05 14:17:20
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-08 20:31:43
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import Button from '../../../common/Button';
import { dva, data } from '../../../../helper';
import ActivityColumnCarousel from './ActivityColumnCarousel';
import ColumnModal from './ColumnModal';
import ColumnItem from './ColumnItem';
import confirm from '../../../common/confirm_';
import { request } from '../../../../config';
import { FUNCTION_ONE, FUNCTION_TWO, FUNCTION_THREE, FUNCTION_FOUR } from './config';
import logable, { logPV } from '../../../../decorators/logable';

import styles from './activityColumn.less';

const effect = dva.generateEffect;
const downloadName = 'ceFileDownload2';

const mapStateToProps = state => ({
  // 活动栏目提交结果
  submitResult: state.activityColumn.submitResult,
  // 活动栏目
  activityColumnList: state.morningBoradcast.activityColumnList,
  newUuid: state.morningBoradcast.newUuid,
});

const mapDispatchToProps = {
  // 提交活动栏目
  submitContent: effect('activityColumn/submitContent', { forceFull: true }),
  // 预览活动栏目
  queryContent: effect('morningBoradcast/queryContent', { forceFull: true }),
  // 获取uuid
  getUuid: effect('morningBoradcast/getUuid', { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ActivityColumn extends PureComponent {
  static propTypes = {
    // 活动栏目
    activityColumnList: PropTypes.array.isRequired,
    // 活动栏目提交结果
    submitResult: PropTypes.bool.isRequired,
    // 提交活动栏目
    submitContent: PropTypes.func.isRequired,
    // 预览活动栏目
    queryContent: PropTypes.func.isRequired,
    // 获取uuid
    newUuid: PropTypes.array.isRequired,
    getUuid: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      // 判断是ColumnForm页面是新建栏目还是编辑栏目，新建是'CREATE' 编辑是 'UPDATE'
      action: 'CREATE',
      // 栏目表单数据
      formData: {},
      // 新建栏目弹窗是否可见
      visible: false,
      // 栏目列表
      activityColumnList: [],
      // 编辑栏目附件列表
      attachmentList: [],
    };
  }

  componentDidMount() {
    this.queryContent();
  }

  // 预览活动栏目
  @autobind
  queryContent() {
    this.props.queryContent().then(() => {
      const { activityColumnList } = this.props;
      this.setState({ activityColumnList });
    });
  }

  @autobind
  setColumnFormRef(form) {
    this.columnForm = form;
  }

  // 渲染活动栏目
  @autobind
  renderActivityColumnList() {
    const { activityColumnList } = this.state;
    return _.map(activityColumnList, (item, index) => (
       <ColumnItem
          columnData={item}
          onEdit={() => this.handleEditColumn(index)}
          onDelete={() => this.handleDeleteColumnConfirm(index)}
          key={data.uuid()}
        />
    ));
  }

  // 编辑活动栏目
  @logable({ type: 'Click', payload: { name: '编辑' } })
  handleEditColumn(index) {
    const { activityColumnList } = this.state;
    const { description, attaches } = activityColumnList[index];
    const descriptionCount = description.length;
    this.setState({
      formData: {
        ...activityColumnList[index],
        descriptionCount,
      },
      attachmentList: attaches,
      action: 'UPDATE',
    }, () => {
      this.handleOpenForm();
    });
  }

  // 删除活动栏目
  @logable({ type: 'Click', payload: { name: '删除' } })
  handleDeleteColumnConfirm(index) {
    // 活动栏目只剩1条，就不能删除，并给出提示
    if (this.state.activityColumnList.length === 1) {
      confirm({
        title: '此栏目展示在首页，至少要保留一项内容',
        shortCut: 'default',
      });
    } else {
      console.warn('index', index);
      this.handleDeleteColumn(index);
    }
  }

  handleDeleteColumn(index) {
    const { activityColumnList: oldActivityColumnList  } = this.state;
    oldActivityColumnList.splice(index, 1);
    console.warn('oldActivityColumnList', oldActivityColumnList);
    // this.setState({ activityColumnList: oldActivityColumnList });
  }

  // 打开新建弹窗
  @autobind
  handleCreateForm() {
    this.setState({
      action: 'CREATE',
    }, () => {
      this.handleOpenForm();
    });
  }

  // 打开弹窗
  @autobind
  @logPV({
    pathname: '/modal/activityColumnModal',
    title: '活动栏目弹框',
  })
  handleOpenForm() {
    this.setState({ visible: true });
  }

  // 关闭弹窗
  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCloseModal() {
    this.columnForm.getForm().resetFields();
    this.setState({
      formData: {},
      visible: false,
      attachmentList: [],
   });
  }

  // 确认提交活动栏目
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubmitConfirm() {
    confirm({
      title: '请确认配置的内容，提交后数据将实时生效',
      shortCut: 'default',
      onOk: this.handleSubmit,
    });
  }

  // 提交活动栏目
  @autobind
  handleSubmit() {
    this.props.submitContent({
      activityColumn: this.state.activityColumnList,
    }).then(() => {
      // 保存成功
      if (this.props.submitResult) {
        this.queryContent();
      }
    });
  }

  // 表单数据变化
  @autobind
  handleChangeFormData(obj) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        ...obj,
      },
    });
  }

  // 点击确定
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleConfirm() {
    const { validateFields } = this.columnForm.getForm();
    validateFields((err, values) => {
      if(!err) {
        const { link, description } = values;
        const {
          activityColumnList,
          formData,
          formData: {
            index,
            attachment,
            attaches,
          }
        } = this.state;
        const { attachId, name, creator } = attaches[0];
        const url = `${request.prefix}/file/${downloadName}?attachId=${attachId}&empId=${creator}&filename=${window.encodeURIComponent(name)}`;
        // 编辑栏目
        const editColumn = _.find(activityColumnList, (item) => ( item.index === index ));
        let newActivityColumnList = [];
        if (_.isEmpty(editColumn)) {
          // 新增栏目
          newActivityColumnList = _.concat(activityColumnList, { attachment, attaches, link, description, url});
        } else {
          // 编辑替换栏目
          activityColumnList[index] = formData;
          newActivityColumnList = activityColumnList;
        }
        this.setState({ activityColumnList: newActivityColumnList });
        this.handleCloseModal();
      }
    });
  }

  render() {
    const {
      visible,
      action,
      formData,
      activityColumnList,
      attachmentList,
    } = this.state;
    // 活动栏目大于等于4条，添加按钮就不可点击
    const createButtonDisabled = activityColumnList.length >= 4;
    return (
      <div className={styles.activityColumnWrapper}>
        <p className={styles.tip}>在此设置的活动栏目内容将以跑马灯的形式展示在首页左上角，最少一条，最多设置四条。</p>
        <div className={styles.createBox}>
          <Button type="primary" icon="plus" className={styles.createButton} onClick={this.handleCreateForm} disabled={createButtonDisabled}>添加</Button>
        </div>
        <div className={styles.activityColumn}>
          <div className={styles.previewWrapper}>
              <ActivityColumnCarousel activityColumnList={activityColumnList} className={styles.activityColumnCarousel}/>
              <span className={styles.previewTitle}>效果预览</span>
          </div>
          <div className={styles.activityColumnList}>
            {this.renderActivityColumnList()}
          </div>
        </div>
        <div className={styles.footerButton}>
          <Button className={styles.cancelButton}>取消</Button>
          <Button type="primary" className={styles.submitButton} onClick={this.handleSubmit}>提交</Button>
        </div>
        <ColumnModal
          visible={visible}
          action={action}
          formData={formData}
          attachmentList={attachmentList}
          onCloseModal={this.handleCloseModal}
          onChangeFormData={this.handleChangeFormData}
          onConfirm={this.handleConfirm}
          onSetColumnFormRef={this.setColumnFormRef}
        />
      </div>
    );
  }
}
