/*
 * @Author: zhangjun
 * @Descripter: 活动栏目
 * @Date: 2018-11-05 14:17:20
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-13 21:39:37
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Button from '../../../common/Button';
import { dva, data } from '../../../../helper';
import ActivityColumnCarousel from './ActivityColumnCarousel';
import ColumnModal from './ColumnModal';
import ColumnItem from './ColumnItem';
import confirm from '../../../common/confirm_';
import { request } from '../../../../config';
import logable, { logPV, logCommon } from '../../../../decorators/logable';

import styles from './activityColumn.less';

const effect = dva.generateEffect;
const downloadName = 'ceFileDownload2';

const mapStateToProps = state => ({
  // 活动栏目提交结果
  submitResult: state.activityColumn.submitResult,
  // 活动栏目
  activityColumnList: state.morningBoradcast.activityColumnList,
});

const mapDispatchToProps = {
  // 提交活动栏目
  submitContent: effect('activityColumn/submitContent', { forceFull: true }),
  // 预览活动栏目
  queryContent: effect('morningBoradcast/queryContent', { forceFull: true }),
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
  }
  constructor(props) {
    super(props);
    this.state = {
      // 栏目表单数据
      formData: {},
      // 新建栏目弹窗是否可见
      visible: false,
      // 栏目列表
      activityColumnList: [],
      // 编辑栏目附件列表
      attachmentList: [],
      // 附件校验错误状态
      isShowAttachmentStatusError: false,
      // 附件校验错误信息
      attachmentStatusErrorMessage: '',
    };
    this.columnFormRef = React.createRef();
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

  // 获取活动栏目表单
  @autobind
  getColumnForm() {
    return this.columnFormRef.current;
  }

  // 渲染活动栏目
  @autobind
  renderActivityColumnList() {
    const { activityColumnList } = this.props;
    return _.map(activityColumnList, item => (
       <ColumnItem
          columnData={item}
          onEdit={() => this.handleEditColumn(item)}
          onDelete={() => this.handleDeleteColumnConfirm(item)}
          key={data.uuid()}
        />
    ));
  }

  // 编辑活动栏目
  @logable({ type: 'Click', payload: { name: '编辑' } })
  handleEditColumn(item) {
    const { description, attaches } = item;
    const descriptionCount = description.length;
    this.setState({
      formData: {
        ...item,
        descriptionCount,
      },
      attachmentList: attaches,
    }, this.handleOpenForm);
  }

  // 删除活动栏目
  @autobind
  @logable({ type: 'Click', payload: { name: '删除' } })
  handleDeleteColumnConfirm(item) {
    // 活动栏目只剩1条，就不能删除，并给出提示
    if (this.state.activityColumnList.length === 1) {
      confirm({
        title: '此栏目展示在首页，至少要保留一项内容',
        shortCut: 'default',
      });
    } else {
      confirm({
        title: '确定要删除吗？',
        shortCut: 'default',
        onOk: () => this.handleDeleteColumn(item),
      });
    }
  }

  @autobind
  handleDeleteColumn(item) {
    const { activityColumnList } = this.state;
    // 删除后新的活动栏目
    const newActivityColumnList = _.without(activityColumnList, item);
    this.setState({ activityColumnList: newActivityColumnList}, this.handleDeleteContent);
  }

  // 删除活动栏目数据
  @autobind
  handleDeleteContent() {
    const { activityColumnList } = this.state;
    this.props.submitContent({
      activityColumn: activityColumnList,
    }).then(() => {
      // 删除成功
      if (this.props.submitResult) {
        this.queryContent();
      }
    });
  }



  // 附件校验是否上传
  @autobind
  checkAttachmentStatus() {
    const { formData: { attachment, attaches } } = this.state;
    if (_.isEmpty(attachment) || _.isEmpty(attaches)) {
      this.setState({
        isShowAttachmentStatusError: true,
        attachmentStatusErrorMessage: '请上传附件',
      });
      return true;
    }
    return false;
  }

  // 重置附件错误状态
  @autobind
  resetAttachmentErrorStatus() {
    this.setState({
      isShowAttachmentStatusError: false,
      attachmentStatusErrorMessage: '',
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
    }, () => {
      const { formData: {attachment, attaches} } = this.state;
      if (!_.isEmpty(attachment) || !_.isEmpty(attaches)) {
        this.resetAttachmentErrorStatus();
      }
    });
  }

  // 点击确定
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleConfirm() {
    const { validateFields } = this.getColumnForm().getForm();
    validateFields((err, values) => {
      if(!err) {
        // 校验附件失败
        if (this.checkAttachmentStatus()) {
          return;
        }
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
        const editColumnIndex = _.findIndex(activityColumnList, (item) => ( item.index === index ));
        let newActivityColumnList = [];
        if (editColumnIndex < 0) {
          // 新增栏目
          newActivityColumnList = _.concat(activityColumnList, { attachment, attaches, link, description, url, index: data.uuid(16)});
        } else {
          // 编辑替换栏目
          newActivityColumnList = _.map(activityColumnList, item => {
            if (item.index === index) {
              return { ...formData, link, description, url };
            } else {
              return item;
            }
          });
        }
        this.setState({ activityColumnList: newActivityColumnList }, this.handleSubmitConfirm);
      }
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
    // 重置表单
    this.getColumnForm().getForm().resetFields();
    this.setState({
      formData: {},
      visible: false,
      attachmentList: [],
      isShowAttachmentStatusError: false,
      attachmentStatusErrorMessage: '',
   });
  }

  // 确认提交活动栏目
  @autobind
  handleSubmitConfirm() {
    confirm({
      title: '请确认配置的内容，提交后数据将实时生效',
      shortCut: 'default',
      onOk: this.handleSubmit,
    });
  }

  // 弹窗提交活动栏目数据
  @autobind
  handleSubmit() {
    const { activityColumnList } = this.state;
    this.props.submitContent({
      activityColumn: activityColumnList,
    }).then(() => {
      // 保存成功
      if (this.props.submitResult) {
        this.handleCloseModal();
        this.queryContent();
      }
    });

    logCommon({
      type: 'Submit',
      name: '活动栏目提交',
      value: JSON.stringify(activityColumnList),
    });
  }

  render() {
    const {
      visible,
      formData,
      attachmentList,
      isShowAttachmentStatusError,
      attachmentStatusErrorMessage,
    } = this.state;
    const { activityColumnList } = this.props;
    // 活动栏目大于等于4条，添加按钮就不可点击
    const createButtonDisabled = activityColumnList.length >= 4;
    return (
      <div className={styles.activityColumnWrapper}>
        <p className={styles.tip}>
          在此设置的活动栏目内容将以跑马灯的形式展示在首页左上角，最少一条，最多设置四条。
          <span className={styles.warningTip}>您的操作将实时生效，请谨慎操作！</span>
        </p>
        <div className={styles.createBox}>
          <Button type="primary" icon="plus" className={styles.createButton} onClick={this.handleOpenForm} disabled={createButtonDisabled}>添加</Button>
        </div>
        {
          _.isEmpty(activityColumnList)
          ? null
          : (
            <div className={styles.activityColumnBox}>
              <div className={styles.activityColumn}>
                <div className={styles.previewWrapper}>
                  <ActivityColumnCarousel activityColumnList={activityColumnList} className={styles.activityColumnCarousel}/>
                  <span className={styles.previewTitle}>效果预览</span>
                </div>
                <div className={styles.activityColumnList}>
                  {this.renderActivityColumnList()}
                </div>
              </div>
            </div>
          )
        }
        <ColumnModal
          visible={visible}
          formData={formData}
          attachmentList={attachmentList}
          isShowAttachmentStatusError={isShowAttachmentStatusError}
          attachmentStatusErrorMessage={attachmentStatusErrorMessage}
          onCloseModal={this.handleCloseModal}
          onChangeFormData={this.handleChangeFormData}
          onConfirm={this.handleConfirm}
          ref={this.columnFormRef}
        />
      </div>
    );
  }
}
