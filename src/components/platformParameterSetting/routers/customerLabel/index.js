/**
 * @Descripter: 自定义客户标签
 * @Author: K0170179
 * @Date: 2018/7/2
 */
import React, { PureComponent } from 'react';
import { Button, Popconfirm, Modal } from 'antd';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { SingleFilter } from 'lego-react-filter/src';

import { scrollToTop } from '../../../../helper/fsp';
import Icon from '../../../common/Icon';
import Table from '../../../common/commonTable/index';
import withRouter from '../../../../decorators/withRouter';
import CreateLabelType from './CreateLabelType';
import CreateLabel from './CreateLabel';
import { dva } from '../../../../helper';
import logable, { logPV } from '../../../../decorators/logable';
import CustRange from '../../../customerPool/list/manageFilter/CustFilter';

import styles from './customerLabel.less';

const DEFAULT_LABEL_TYPE = { id: '', typeName: '不限' };

// dva的dispatch方式
const fetchDataFunction = dva.generateEffect;

const mapStateToProps = state => ({
  // 客户标签类型
  allLabels: state.customerLabel.labelTypeList,
  // 客户标签
  labelInfo: state.customerLabel.labelInfo,
  // 组织机构树
  custRange: state.customerPool.custRange,
});

const mapDisPatchToProps = {
  queryLabelType: fetchDataFunction('customerLabel/queryLabelType'),
  queryLabelInfo: fetchDataFunction('customerLabel/queryLabelInfo'),
  addLabelType: fetchDataFunction('customerLabel/addLabelType'),
  addLabel: fetchDataFunction('customerLabel/addLabel'),
  deleteLabel: fetchDataFunction('customerLabel/deleteLabel'),
  checkDuplicationName: fetchDataFunction('customerLabel/checkDuplicationName', { loading: false }),
};

@connect(mapStateToProps, mapDisPatchToProps)
@withRouter
export default class LabelManager extends PureComponent {
  static propTypes = {
    allLabels: PropTypes.array.isRequired,
    labelInfo: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    queryLabelType: PropTypes.func.isRequired,
    queryLabelInfo: PropTypes.func.isRequired,
    addLabelType: PropTypes.func.isRequired,
    addLabel: PropTypes.func.isRequired,
    deleteLabel: PropTypes.func.isRequired,
    checkDuplicationName: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
  };

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      createTypeVisible: false,
      createLabelVisit: false,
    };
  }

  componentDidMount() {
    const { queryLabelType } = this.props;
    queryLabelType();
    this.queryLabelList();
  }

  @autobind
  getClumneTitle() {
    return ([{
      key: 'labelTypeName',
      value: '标签类型',
    },
    {
      key: 'labelName',
      value: '标签名称',
    },
    {
      key: 'labelDesc',
      value: '标签描述',
    },
    {
      key: 'createdOrgName',
      value: '创建部门',
    },
    {
      key: 'createdBy',
      value: '创建人',
    },
    {
      key: 'id',
      value: '操作',
      render: labelItem => (
        <span>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => this.handleDelLabel(labelItem.id)}
            cancelText="取消"
            okText="确定"
          >
            <Icon type="shanchu" className={styles.remove} />
          </Popconfirm>
        </span>
      ),
    }]);
  }

  @autobind
  getTablePagination() {
    const { labelInfo = {} } = this.props;
    const {
      curPageNum = 1,
      curPageSize = 10,
      totalRecordNum = 0,
    } = labelInfo;
    return { curPageNum, curPageSize, totalRecordNum };
  }

  @autobind
  queryLabelList(option) {
    const { location: { pathname, query }, queryLabelInfo } = this.props;
    const { replace } = this.context;
    const preParams = _.pick(
      query,
      ['labelTypeId', 'currentPage', 'pageSize', 'orgId'],
    );
    const params = {
      currentPage: 1,
      pageSize: 10,
      ...preParams,
      ...option,
    };
    queryLabelInfo(params);
    scrollToTop();
    replace({
      pathname,
      query: {
        ...query,
        ...params,
      },
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '标签类型',
      value: '$args[0].value',
    },
  })
  handleLabelTypeChange(labelTypeItem) {
    const { value } = labelTypeItem;
    this.queryLabelList({
      labelTypeId: value,
      currentPage: 1,
      pageSize: 10,
    });
  }

  // 分页事件处理
  @autobind
  handlePageChange(pageNum, pageSize) {
    this.queryLabelList({
      currentPage: pageNum,
      pageSize,
    });
  }

  // 新建标签类型 ----start
  @autobind
  @logPV({ pathname: '/modal/createLabelTypeLog', title: '新建标签类型' })
  handleCreateType() {
    this.setState({
      createTypeVisible: true,
    });
  }

  @autobind
  closeCreateTypeModal() {
    this.setState({
      createTypeVisible: false,
    });
  }

  // 新建标签类型 ----end
  // 删除标签 ----start
  handleDelLabel(labelId) {
    const { deleteLabel } = this.props;
    deleteLabel({ labelId }).then((delLabelResult) => {
      if (delLabelResult) {
        this.queryLabelList({ currentPage: 1 });
      } else {
        Modal.warning({
          mask: false,
          title: '此标签已使用，不可删除',
          okText: '确定',
        });
      }
    });
  }

  // 删除标签 ----end
  // 新建标签 ----start
  @autobind
  @logPV({ pathname: '/modal/createLabelLog', title: '新建标签' })
  handleCreateLabel() {
    this.setState({
      createLabelVisit: true,
    });
  }

  // 创建部门change事件
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '创建部门',
      value: '$args[0].orgId',
    },
  })
  handleCustRange({ orgId }) {
    this.queryLabelList({
      orgId,
      currentPage: 1,
      pageSize: 10,
    });
  }

  @autobind
  closeCreateLabelModal() {
    this.setState({
      createLabelVisit: false,
    });
  }

  // 新建标签 ----end
  render() {
    const {
      allLabels = [],
      addLabelType,
      addLabel,
      checkDuplicationName,
      labelInfo = {},
      queryLabelType,
      location: { query: { labelTypeId, orgId } },
      custRange,
    } = this.props;

    // 增加一个不限选项
    const newCustRange = [
      {
        id: '',
        level: 1,
        name: '不限',
      },
      ...custRange
    ];

    const {
      labelList = [],
    } = labelInfo;

    if (_.isEmpty(custRange)) {
      return null;
    }

    const { createTypeVisible, createLabelVisit } = this.state;

    const finalLabelTypes = [DEFAULT_LABEL_TYPE, ...allLabels];
    return (
      <div className={styles.customerLabelWrap}>
        <div className={styles.tip}>自定义客户标签，用于管理岗人员在此创建标签，标签必须保持唯一性，采用先到先得的规则，标签一旦创建对所有人可见。</div>
        <div className={styles.operationWrap}>
          <div>
            <SingleFilter
              data={finalLabelTypes}
              value={labelTypeId}
              dataMap={['id', 'typeName']}
              defaultLabel="不限"
              filterName="标签类型"
              onChange={this.handleLabelTypeChange}
            />
            <div className={styles.custRange}>
              <CustRange
                filterName="创建部门"
                defaultFirst
                orgId={orgId}
                custRange={newCustRange}
                updateQueryState={this.handleCustRange}
                expandAll={false}
              />
            </div>
          </div>
          <div className={styles.operationRight}>
            <Button icon="plus" onClick={this.handleCreateType}>新建类型</Button>
            <Button icon="plus" type="primary" onClick={this.handleCreateLabel}>新建标签</Button>
          </div>
        </div>
        <div className={styles.customerLabelList}>
          <Table
            pageData={this.getTablePagination()}
            listData={labelList}
            titleColumn={this.getClumneTitle()}
            columnWidth={['15%', '15%', '32%', '16%', '12%', '10%']}
            needPagination
            isFixedColumn
            needShowEmptyRow={false}
            onPageChange={this.handlePageChange}
          />
        </div>
        <CreateLabelType
          visible={createTypeVisible}
          addLabelType={addLabelType}
          closeModal={this.closeCreateTypeModal}
          queryLabelType={queryLabelType}
        />
        <CreateLabel
          addLabel={addLabel}
          allLabels={allLabels}
          visible={createLabelVisit}
          queryLabelList={this.queryLabelList}
          checkDuplicationName={checkDuplicationName}
          closeModal={this.closeCreateLabelModal}
        />
      </div>
    );
  }
}
