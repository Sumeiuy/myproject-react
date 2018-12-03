/**
 * @Descripter: 平台参数设置/标签管理
 * @Author: xiaZhiQiang
 * @Date: 2018/4/13
 */

import React, { PureComponent } from 'react';
import {
  Button, Input, Table, Modal, Form
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { fsp, dva } from '../../../helper';
import Icon from '../../common/Icon';
import Pagination from '../../common/Pagination';
import logable from '../../../decorators/logable';

import styles from './labelManager.less';
import withRouter from '../../../decorators/withRouter';

const confirm = Modal.confirm;
const EMPTY_OBJ = {};

// dva的dispatch方式
const fetchDataFunction = dva.generateEffect;

const mapStateToProps = state => ({
  // 标签列表
  allLabels: state.userCenter.allLabels,
});

const mapDisPatchToProps = {
  replace: routerRedux.replace,
  queryAllLabels: fetchDataFunction('userCenter/queryAllLabels'),
  updateLabel: fetchDataFunction('userCenter/updateLabel'),
  delLabel: fetchDataFunction('userCenter/delLabel'),
  addLabel: fetchDataFunction('userCenter/addLabel'),
};

@connect(mapStateToProps, mapDisPatchToProps)
@withRouter
@Form.create()
export default class LabelManager extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    allLabels: PropTypes.array.isRequired,
    queryAllLabels: PropTypes.func.isRequired,
    updateLabel: PropTypes.func.isRequired,
    delLabel: PropTypes.func.isRequired,
    addLabel: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.columns = [{
      title: 'labelName',
      dataIndex: 'name',
      width: '43%',
      render: (text, record) => this.EditableCell(text, record, 'name'),
    }, {
      title: 'operation',
      dataIndex: 'operation',
      width: '57%',
      render: (text, record) => {
        const { editorCell } = this.state;
        return (
          <div className={styles.editableWrap}>
            {
              editorCell.id === record.id
                ? (
                  <div>
                    <span onClick={() => this.confirmSave(record.id)}>
                      <Icon className={styles.confirm} type="gou" />
                    </span>
                    <span onClick={() => this.cancel(record.id)}>
                      <Icon className={styles.cancel} type="close1" />
                    </span>
                  </div>
                )
                : (
                  <span onClick={() => this.edit(record)}>
                    <Icon className={`${styles.editable} showEdit`} type="beizhu" />
                  </span>
                )
            }
          </div>
        );
      },
    },
      // 删除按钮暂时屏蔽
    //   {
    //   title: 'age',
    //   dataIndex: 'age',
    //   width: '0%',
    //   render: (text, record) => (<div
    //     onClick={() => { this.confirmDelLabel(record.id); }}
    //     className={styles.labelDel}
    //   >
    //     <Icon type="shanchu" />
    //   </div>),
    // }
    ];
    this.state = {
      editorCell: EMPTY_OBJ,
      addLabelState: false,
    };
  }

  componentWillMount() {
    const { queryAllLabels, allLabels } = this.props;
    if (!allLabels.length) {
      queryAllLabels();
    }
  }

  // --修改标签--start
  // 可编辑单元格
  @autobind
  EditableCell(text, record, column) {
    const { editorCell } = this.state;
    if (editorCell.id === record.id) {
      return (
        <div className={styles.labelName}>
          <Input
            maxLength={15}
            value={editorCell.name}
            onChange={e => this.handleChange(e.target.value, record.id, column)}
          />
          {
            editorCell.error
              ? (
                <div className={styles.labelError}>{editorCell.error }</div>
              )
              : null
          }
        </div>
      );
    }
    return (
      <div className={styles.labelName}>
        <div>
          {text}
        </div>
      </div>
    );
  }

  handleChange(value, id) {
    this.setState({
      editorCell: {
        name: value,
        id,
        error: value ? '' : '名称不能为空', // 当输入为空时的错误提示
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '编辑标签' } })
  edit(record) {
    this.setState({
      editorCell: record,
    });
  }

  // 确认是否修改个人标签
  @autobind
  @logable({ type: 'Click', payload: { name: '确认' } })
  confirmSave() {
    const { allLabels } = this.props;
    const { editorCell } = this.state;
    const oldLabelItem = _.filter(allLabels, item => item.id === editorCell.id)[0];
    if (editorCell.error) {
      return;
    }
    if (oldLabelItem.name === editorCell.name) {
      this.setState({
        editorCell: EMPTY_OBJ,
      });
      return;
    }
    confirm({
      okText: '确认',
      cancelText: '取消',
      content: '修改的标签名称实时生效，会影响已与此关联的入岗投顾标签，是否确认修改？',
      onOk: this.updataLabel,
    });
  }

  // 修改标签
  @autobind
  updataLabel() {
    const { updateLabel, queryAllLabels } = this.props;
    const { editorCell } = this.state;
    updateLabel(editorCell)
      .then(() => {
        queryAllLabels();
        this.setState({
          editorCell: EMPTY_OBJ,
        });
      });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '删除' } })
  cancel() {
    this.setState({
      editorCell: EMPTY_OBJ,
    });
  }
  // --修改标签--end

  // --删除标签--start
  @autobind
  confirmDelLabel(id) {
    confirm({
      okText: '确认',
      cancelText: '取消',
      content: '删除的标签实时生效，会影响已与此关联的入岗投顾标签，是否确认删除？',
      onOk: () => { this.delLabel(id); },
    });
  }

  @autobind
  delLabel(id) {
    this.props.delLabel({ id })
      .then(() => {
        this.props.queryAllLabels();
      });
  }

  // --删除标签--end
  // --添加标签--start
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '+标签' } })
  openAddLabel() {
    this.setState({
      addLabelState: true,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭' } })
  closeAddLabel() {
    this.setState({
      addLabelState: false,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '添加' } })
  addLabel() {
    const { addLabel } = this.props;
    const { getFieldValue } = this.props.form;
    const name = getFieldValue('labelValue');
    if (!name) {
      this.setState({
        addLabelState: false,
      });
    } else {
      addLabel({ name })
        .then(() => {
          this.props.queryAllLabels();
          this.setState({
            addLabelState: false,
          });
          this.paginationChange(1);
        });
    }
  }

  // --添加标签--end
  // 分页(当前页，当前页数据)
  getPaginationAndData() {
    const {
      location: {
        query: {
          pageSize = 20,
          pageNum = 1,
        },
      },
      allLabels = [],
    } = this.props;

    let finalCurrent = Number(pageNum) || 1;
    const total = allLabels.length;

    if (finalCurrent > 1 && total <= pageSize * (finalCurrent - 1)) {
      finalCurrent = _.ceil(total / pageSize, 0);
    }

    const allLabelsToTable = allLabels.map(item => ({ ...item, key: item.id }));
    const currentLabels = _.filter(allLabelsToTable, (labelItem, index) => index + 1 > (finalCurrent - 1) * pageSize
      && index + 1 <= finalCurrent * pageSize);
    return {
      pagination: {
        total: allLabels.length,
        current: finalCurrent,
        pageSize,
      },
      currentLabels,
    };
  }

  // 分页变化
  @autobind
  paginationChange(pageNum) {
    const {
      replace,
      location: {
        pathname,
        query,
      },
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        pageNum,
      },
    });
    fsp.scrollToTop();
  }

  render() {
    const { pagination, currentLabels } = this.getPaginationAndData();
    const { addLabelState } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.labelManager}>
        <div className={styles.labelHeader}>
          <span>请在此维护入岗投顾个人标签列表，用于入岗投顾在用户中心页面进行个人标签匹配。</span>
          <span>
            <Button icon="plus" onClick={this.openAddLabel}>标签</Button>
          </span>
        </div>
        <div className={styles.labelBody}>
          {
            addLabelState
              ? (
                <div className={styles.addLabelWrap}>
                  {getFieldDecorator('labelValue')(
                    <Input
                      ref={(input) => { this.textInput = input; }}
                      maxLength={15}
                      style={{ width: 150 }}
                    />,
                  )}
                  <span>
                    <Icon className={styles.confirm} type="gou" onClick={this.addLabel} />
                  </span>
                  <span>
                    <Icon className={styles.cancel} type="close1" onClick={this.closeAddLabel} />
                  </span>
                </div>
              )
              : null
          }
          <Table
            showHeader={false}
            size="small"
            dataSource={currentLabels}
            columns={this.columns}
            pagination={false}
          />
          <Pagination
            {...pagination}
            onChange={this.paginationChange}
          />
        </div>
      </div>
    );
  }
}
