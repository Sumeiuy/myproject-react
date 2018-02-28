/**
 * @file components/customerPool/TaskSearchRow.js
 *  客户列表项中的快捷菜单
 * @author zhushengnan
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
    isSightTelescopeLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    isAuthorize: PropTypes.bool.isRequired,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    storedData: PropTypes.object.isRequired,
  }
  static defaultProps = {
    condition: '',
    orgId: null,
  };

  constructor(props) {
    super(props);
    const {
      storedData: { labelCust = {} },
      // currentSelectLabel = '',
    } = props;

    const { argsOfQueryCustomer = {}, currentFilterObject, filterNumObject } = labelCust || {};
    this.state = {
      curPageNum: INITIAL_PAGE_NUM,
      // totalRecordNum: 0,
      totalCustNums: 0,
      labelId: '',
      modalVisible: false,
      title: '',
      custTableData: [],
      currentFilterObject: _.isEmpty(currentFilterObject) ? {} : currentFilterObject,
      filterNumObject: _.isEmpty(filterNumObject) ? {} : filterNumObject,
      // 当前筛选条件
      argsOfQueryCustomer,
      currentSelectLabelName: '',
    };
    this.visible = false;
  }

  // 获取已筛选客户数
  // 获取当前过滤条件
  // 获取当前筛选客户查询条件
  @autobind
  getSelectFilters() {
    return _.pick(this.state, ['filterNumObject', 'argsOfQueryCustomer', 'currentFilterObject']);
  }

  /**
 * 查询标签下客户
 * @param {*} labelId 标签Id
 * @param {*} curPageNum 当前页
 * @param {*} pageSize 当前页条目
 */
  queryPeopleOfLabel({ labelId, curPageNum = 1, pageSize = 10, filter = [] }) {
    const { isAuthorize, orgId, getLabelPeople } = this.props;
    const { argsOfQueryCustomer } = this.state;
    let payload = {
      curPageNum,
      pageSize,
      enterType: 'labelSearchCustPool',
      labels: [labelId],
    };
    if (!_.isEmpty(argsOfQueryCustomer[`${labelId}`])) {
      // 如果data里面存在payload，就恢复数据，不然就取默认数据
      // 查询客户列表时必传的参数
      const { labels: remberLabels } = argsOfQueryCustomer[`${labelId}`];
      payload = { ...payload, labels: remberLabels };
    }
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
    getLabelPeople(payload).then(() => {
      // 数据回来后，显示弹框
      this.setState({
        modalVisible: true,
      });
      this.visible = true;
      const { filterNumObject } = this.state;
      const { peopleOfLabelData, isLoadingEnd, isSightTelescopeLoadingEnd } = this.props;
      const showStatus = this.visible && isLoadingEnd && isSightTelescopeLoadingEnd;
      // 是否展示筛查客户的modal
      if (showStatus) {
        const { custList = [] } = peopleOfLabelData || {};
        const list = _.map(custList, item => ({
          ...item,
          brok_id: item.brokId,
          brok_org_id: item.brokOrgId,
          contact_flag: item.contactFlag,
          lever_code: item.levelName,
          cust_type: item.custType === 'N' ? '高净值' : '零售',
        }));
        let finalFilterNumObject = filterNumObject;
        // 只有点击了筛查客户，才需要替换filterNumObject
        if (!_.isEmpty(labelId) && showStatus) {
          finalFilterNumObject = {
            [labelId]: _.isEmpty(peopleOfLabelData) ? 0 : peopleOfLabelData.totalCount,
          };
        }

        this.setState({
          custTableData: list,
          filterNumObject: {
            ...filterNumObject,
            ...finalFilterNumObject,
          },
        });
      }
    });

    this.setState({
      argsOfQueryCustomer: {
        [labelId]: payload,
      },
    });
  }

  @autobind
  change(e) {
    const { onChange, circlePeopleData } = this.props;
    const { filterNumObject } = this.state;
    const currentLabelId = e.target.value;
    const currentLabelInfo = _.find(circlePeopleData, item => item.id === currentLabelId
      || item.labelMapping === currentLabelId) || {};
    let finalFilterNumObject = filterNumObject;
    if (!(`${currentLabelId}` in finalFilterNumObject) ||
      (finalFilterNumObject[`${currentLabelId}`] !== 0
        && _.isEmpty(finalFilterNumObject[`${currentLabelId}`])
      )) {
      finalFilterNumObject = {
        [currentLabelId]: currentLabelInfo.customNum,
      };
    }
    this.setState({
      labelId: currentLabelId,
      filterNumObject: {
        ...filterNumObject,
        ...finalFilterNumObject,
      },
      currentSelectLabelName: currentLabelInfo.labelName,
    });
    onChange(currentLabelId);
  }


  @autobind
  handleSeeCust(value = {}) {
    const { currentFilterObject } = this.state;
    const { getFiltersOfSightingTelescope } = this.props;
    // 瞄准镜的label 时取获取对应的筛选条件
    if (isSightingScope(value.source)) {
      getFiltersOfSightingTelescope({
        prodId: value.labelMapping || '',
      });
    }
    this.queryPeopleOfLabel({
      labelId: value.labelMapping,
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: INITIAL_PAGE_SIZE,
      filter: currentFilterObject[value.labelMapping] || [],
    });
    this.setState({
      title: value.labelName,
      totalCustNums: value.customNum,
      labelId: value.labelMapping,
      currentSource: value.source,
      curPageNum: INITIAL_PAGE_NUM,
      currentSelectLabelName: value.labelName,
    });
    // 点击筛查客户，将当前标签选中
    this.props.onChange(value.id || '');
  }

  @autobind
  handleCancel() {
    const { onCancel } = this.props;
    this.setState({
      modalVisible: false,
    });
    onCancel();
  }

  // 表格信息
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { labelId, currentFilterObject } = this.state;
    this.queryPeopleOfLabel({
      labelId,
      curPageNum: currentPageNum,
      pageSize: changedPageSize,
      filter: currentFilterObject[labelId] || [],
    });

    this.setState({
      curPageNum: currentPageNum,
    });
  }

  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { labelId, currentFilterObject } = this.state;
    this.queryPeopleOfLabel({
      labelId,
      curPageNum: nextPage,
      pageSize: currentPageSize,
      filter: currentFilterObject[labelId] || [],
    });

    this.setState({
      curPageNum: nextPage,
    });
  }

  /**
   * 筛查客户弹窗中的 筛选项 变化值
   */
  @autobind
  handleFilterChange(obj) {
    const { labelId, currentFilterObject } = this.state;
    const newFilterArray = currentFilterObject[labelId] ? [...currentFilterObject[labelId]] : [];
    const index = _.findIndex(newFilterArray, o => o.split('.')[0] === obj.name);
    const filterItem = `${obj.name}.${obj.value}`;
    if (index > -1) {
      newFilterArray[index] = filterItem;
    } else {
      newFilterArray.push(filterItem);
    }
    this.setState({
      currentFilterObject: {
        [labelId]: newFilterArray,
      },
    }, () => {
      this.queryPeopleOfLabel({
        labelId,
        curPageNum: INITIAL_PAGE_NUM,
        pageSize: INITIAL_PAGE_SIZE,
        filter: newFilterArray,
      });
    });
  }

  // Y为高净值、N为非高净值
  @autobind
  renderRadioSection() {
    const { condition, circlePeopleData, currentSelectLabel } = this.props;
    const { filterNumObject } = this.state;
    return _.map(circlePeopleData,
      (item) => {
        const currentFilterNum = (`${item.id}` in filterNumObject ?
          filterNumObject[item.id] : item.customNum) || 0;
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
                已筛选客户数：<i>{currentFilterNum}</i>
              </span>
              {item.customNum === 0 ? null :
              <Clickable
                onClick={() => this.handleSeeCust(item)}
                eventName="/click/taskSearchRow/checkCust"
              >
                <Button className={styles.seeCust}>筛查客户</Button>
              </Clickable>
              }
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
      custTableData,
      currentFilterObject,
      currentSource,
      labelId,
      filterNumObject,
      currentSelectLabelName,
      modalVisible,
    } = this.state;

    const {
      currentSelectLabel,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      condition,
      dict,
      sightingTelescopeFilters,
    } = this.props;
    if (_.isEmpty(condition)) {
      return null;
    }

    const currentItems = currentFilterObject[labelId] || [];
    const totalRecordNum = filterNumObject[labelId] || 0;
    return (
      <div className={styles.divContent}>
        <RadioGroup
          name="radiogroup"
          onChange={this.change}
          value={currentSelectLabel}
        >
          {
            this.renderRadioSection()
          }
        </RadioGroup>
        <div className={styles.seeCust}>
          {
            <Modal
              visible={modalVisible}
              title={currentSelectLabelName || ''}
              maskClosable={false}
              closable={false}
              footer={
                <Clickable
                  onClick={this.handleCancel}
                  eventName="/click/taskSearchRow/close"
                >
                  <Button key="back" size="large">确定</Button>
                </Clickable>
              }
              width={700}
              wrapClassName={styles.labelCustModalContainer}
            >
              {
                <div className={styles.filter}>
                  <FilterCustomers
                    dict={dict}
                    currentItems={currentItems}
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
                      curPageSize: INITIAL_PAGE_SIZE,
                      totalRecordNum,
                    }}
                    tableClass={
                      classnames({
                        [styles.labelCustTable]: true,
                        [tableStyles.groupTable]: true,
                      })
                    }
                    isFixedTitle={false}
                    onSizeChange={this.handleShowSizeChange}
                    onPageChange={this.handlePageChange}
                    listData={custTableData}
                    titleColumn={renderColumnTitle}
                    isFirstColumnLink={false}
                    columnWidth={100}
                  />
              }
            </Modal>
          }
        </div>
        {
          <Loading loading={!isLoadingEnd || !isSightTelescopeLoadingEnd} />
        }
      </div>
    );
  }
}
