/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import { Radio, Modal, Button, Icon } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { emp } from '../../../helper';
import Loading from '../../../layouts/Loading';
import GroupTable from '../groupManage/GroupTable';
import styles from './taskSearchRow.less';
import tableStyles from '../groupManage/groupTable.less';
import Clickable from '../../../components/common/Clickable';
import FilterCustomers from './step1/FilterCustomers';
import { isSightingScope } from '../helper';
import { getCustomerListFilters } from '../../../helper/page/customerPool';

const RadioGroup = Radio.Group;
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 10;

const renderColumnTitle = [{
  key: 'brok_id',
  value: '经纪客户号',
},
{
  key: 'name',
  value: '客户名称',
},
{
  key: 'empName',
  value: '服务经理',
},
{
  key: 'orgName',
  value: '所在营业部',
},
{
  key: 'lever_code',
  value: '客户等级',
},
{
  key: 'cust_type',
  value: '客户类型',
}];
export default class TaskSearchRow extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    condition: PropTypes.string,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    currentSelectLabel: PropTypes.string.isRequired,
    orgId: PropTypes.string,
    isLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    isAuthorize: PropTypes.bool.isRequired,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    getArgsOfQueryCustomer: PropTypes.func.isRequired,
  }
  static defaultProps = {
    condition: '',
    orgId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: INITIAL_PAGE_SIZE,
      totalRecordNum: 0,
      totalCustNums: 0,
      labelId: '',
      visible: false,
      isLoadingEnd: true,
      title: '',
      custTableData: [],
      filter: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { peopleOfLabelData, visible } = nextProps;
    const { custList = [] } = peopleOfLabelData || {};
    const list = _.map(custList, item => ({
      ...item,
      brok_id: item.brokId,
      brok_org_id: item.brokOrgId,
      contact_flag: item.contactFlag,
      lever_code: item.levelName,
      cust_type: item.custType === 'N' ? '高净值' : '零售',
    }));
    this.setState({
      totalRecordNum: _.isEmpty(peopleOfLabelData) ? 0 : peopleOfLabelData.totalCount,
      custTableData: list,
      visible,
    });
  }

  @autobind
  change(e) {
    const { onChange } = this.props;
    onChange(e.target.value);
  }

  /**
   * 查询标签下客户
   * @param {*} labelId 标签Id
   * @param {*} curPageNum 当前页
   * @param {*} pageSize 当前页条目
   */
  queryPeopleOfLabel(labelId, curPageNum = 1, pageSize = 10, filter = []) {
    const { isAuthorize, orgId, getLabelPeople, getArgsOfQueryCustomer } = this.props;
    // 查询客户列表时必传的参数
    const payload = {
      curPageNum,
      pageSize,
      enterType: 'labelSearchCustPool',
      labels: [labelId],
    };
    // 有权限传orgId，没有权限传ptyMngId
    if (isAuthorize) {
      payload.orgId = orgId;
    } else {
      payload.ptyMngId = emp.getId();
    }
    // 存放可开通、已开通、风险等级、客户类型、客户性质的数组
    const filtersList = [];
    if (!_.isEmpty(filter)) {
      const { filters, labels } = getCustomerListFilters(filter, payload.labels, filtersList);
      payload.filtersReq = filters;
      payload.labels = labels;
    }
    if (!_.isEmpty(filtersList)) {
      payload.filtersReq = filtersList;
    }
    // 获取客户列表
    getLabelPeople(payload);
    // 将查询列表的参数以回调的方式传给父组件
    getArgsOfQueryCustomer({
      [labelId]: payload,
    });
  }

  @autobind
  handleSeeCust(value = {}) {
    const { filter } = this.state;
    const { getFiltersOfSightingTelescope } = this.props;
    // 瞄准镜的label 时取获取对应的筛选条件
    if (isSightingScope(value.source)) {
      getFiltersOfSightingTelescope({
        prodId: value.labelMapping || '',
      });
    }
    this.queryPeopleOfLabel(value.labelMapping, INITIAL_PAGE_NUM, INITIAL_PAGE_SIZE, filter);
    this.setState({
      title: value.labelName,
      totalCustNums: value.customNum,
      labelId: value.labelMapping,
      currentSource: value.source,
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: INITIAL_PAGE_SIZE,
    });
  }

  @autobind
  handleCancel() {
    const { onCancel } = this.props;
    this.setState({ visible: false });
    onCancel();
  }

  // 表格信息
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { labelId, filter } = this.state;
    this.queryPeopleOfLabel(
      labelId,
      INITIAL_PAGE_NUM,
      changedPageSize,
      filter,
    );

    this.setState({
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: changedPageSize,
    });
  }

  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { labelId, filter } = this.state;
    this.queryPeopleOfLabel(
      labelId,
      nextPage,
      currentPageSize,
      filter,
    );

    this.setState({
      curPageNum: nextPage,
    });
  }

  /**
   * 筛查客户弹窗中的 筛选项 变化值
   */
  @autobind
  handleFilterChange(obj) {
    const { labelId, filter } = this.state;
    const newFilterArray = [...filter];
    const index = _.findIndex(filter, o => o.split('.')[0] === obj.name);
    const filterItem = `${obj.name}.${obj.value}`;
    if (index > -1) {
      newFilterArray[index] = filterItem;
    } else {
      newFilterArray.push(filterItem);
    }
    // debugger
    this.setState({
      filter: newFilterArray,
    }, () => {
      this.queryPeopleOfLabel(
        labelId,
        INITIAL_PAGE_NUM,
        INITIAL_PAGE_SIZE,
        this.state.filter,
      );
    });
  }

  // Y为高净值、N为非高净值
  @autobind
  renderRadioSection() {
    const { condition, circlePeopleData, currentSelectLabel } = this.props;
    const { totalRecordNum, labelId } = this.state;
    return _.map(circlePeopleData,
      (item) => {
        let newDesc = item.labelDesc;
        let newTitle = item.labelName;
        if (!_.isEmpty(condition)) {
          newDesc = _.isEmpty(newDesc)
            ? '--'
            : newDesc.replace(condition, `<span class=${styles.keyword}>${condition}</span>`);
          newTitle = _.isEmpty(newTitle)
          ? '--'
            : newTitle.replace(condition, `<span class=${styles.keyword}>${condition}</span>`);
        }
        const cls = classnames({
          [styles.divRows]: true,
          [styles.active]: currentSelectLabel === item.id,
        });
        const filteredCustomerNums = labelId === item.id
          ? totalRecordNum : item.customNum;
        return (
          <div className={cls} key={item.id || item.labelMapping}>
            <Radio
              value={item.id}
              key={item.tagNumId || item.labelMapping}
            >
              <span
                className={styles.title}
                dangerouslySetInnerHTML={{ __html: newTitle }} // eslint-disable-line
              />
              <span className={styles.filterCount}>
                已筛选客户数：<i>{filteredCustomerNums}</i>
              </span>
              <Clickable
                onClick={() => this.handleSeeCust(item)}
                eventName="/click/taskSearchRow/checkCust"
              >
                <Button className={styles.seeCust}>筛查客户</Button>
              </Clickable>
            </Radio>
            <h4 className={styles.titExp}>
              <span>创建人：<i>{item.createrName || '--'}</i></span>
              <span>创建时间：<i>{item.createDate || '--'}</i></span>
              <span>客户总数：<i>{item.customNum}</i></span>
            </h4>
            <h4
              dangerouslySetInnerHTML={{ __html: newDesc }} // eslint-disable-line
            />
          </div>
        );
      });
  }

  render() {
    const {
      curPageNum = INITIAL_PAGE_NUM,
      pageSize = INITIAL_PAGE_SIZE,
      totalRecordNum = 0,
      visible,
      // title,
      custTableData,
      filter,
      currentSource,
    } = this.state;

    const {
      currentSelectLabel,
      isLoadingEnd,
      condition,
      dict,
      sightingTelescopeFilters,
    } = this.props;

    if (_.isEmpty(condition)) {
      return null;
    }
    return (
      <div className={styles.divContent}>
        <RadioGroup name="radiogroup" onChange={this.change} defaultValue={currentSelectLabel}>
          {
            this.renderRadioSection()
          }
        </RadioGroup>
        <div className={styles.seeCust}>
          {
            (isLoadingEnd && visible) ?
              <Modal
                visible
                title="筛查客户"
                onOk={this.handleOk}
                maskClosable={false}
                onCancel={this.handleCancel}
                closable={false}
                footer={[
                  <Clickable
                    onClick={this.handleCancel}
                    eventName="/click/taskSearchRow/close"
                  >
                    <Button key="back" size="large">关闭</Button>
                  </Clickable>,
                ]}
                width={700}
                wrapClassName={styles.labelCustModalContainer}
              >
                {
                  <div className={styles.filter}>
                    <FilterCustomers
                      dict={dict}
                      currentItems={filter}
                      onFilterChange={this.handleFilterChange}
                      source={currentSource}
                      sightingTelescopeFilters={sightingTelescopeFilters}
                    />
                  </div>
                }
                {
                  _.isEmpty(custTableData) ?
                    <div className={styles.emptyContent}>
                      <span>
                        <Icon className={styles.emptyIcon} type="frown-o" />
                        暂无数据
                      </span>
                    </div> :
                    <GroupTable
                      pageData={{
                        curPageNum,
                        curPageSize: pageSize,
                        totalRecordNum,
                      }}
                      tableClass={
                        classnames({
                          [styles.labelCustTable]: true,
                          [tableStyles.groupTable]: true,
                        })
                      }
                      isFixedTitle
                      scrollY={200}
                      onSizeChange={this.handleShowSizeChange}
                      onPageChange={this.handlePageChange}
                      listData={custTableData}
                      titleColumn={renderColumnTitle}
                      isFirstColumnLink={false}
                      columnWidth={100}
                    />
                }
              </Modal> : null
          }
        </div>
        {
          <Loading loading={!isLoadingEnd} />
        }
      </div>
    );
  }
}
