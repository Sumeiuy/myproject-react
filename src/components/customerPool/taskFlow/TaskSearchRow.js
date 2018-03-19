/**
 * @file components/customerPool/TaskSearchRow.js
 *  客户列表项中的快捷菜单
 * @author zhushengnan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import { Radio, Modal, Button, Icon, Tooltip } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { emp, number } from '../../../helper';
import Loading from '../../../layouts/Loading';
import GroupTable from '../groupManage/GroupTable';
import styles from './taskSearchRow.less';
import Clickable from '../../../components/common/Clickable';
import FilterCustomers from './step1/FilterCustomers';
import { isSightingScope } from '../helper';
import { fspContainer } from '../../../config';
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

function transformNumber(num) {
  return `${number.thousandFormat(num)}人`;
}

function transformDate(date) { // 2017-01-31 12:33:55.0
  if (date) {
    const dateStr = date.split(' ')[0]; // 2017-01-31
    const dateArray = dateStr.split('-'); // ['2017', '01', '31']
    return `${dateArray[0]}年${dateArray[1]}月${dateArray[2]}日`; // 2017年01月31日
  }

  return '--';
}

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

    const {
      argsOfQueryCustomer = {},
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
      filterNumObject,
    } = labelCust || {};

    this.state = {
      curPageNum: INITIAL_PAGE_NUM,
      // totalRecordNum: 0,
      totalCustNums: 0,
      labelId: '',
      modalVisible: false,
      title: '',
      custTableData: [],
      currentFilterObject: _.isEmpty(currentFilterObject) ? {} : currentFilterObject,
      currentAllFilterState: _.isEmpty(currentAllFilterState) ? {} : currentAllFilterState,
      allFiltersCloseIconState: _.isEmpty(allFiltersCloseIconState) ? {} : allFiltersCloseIconState,
      filterNumObject: _.isEmpty(filterNumObject) ? {} : filterNumObject,
      // 当前筛选条件
      argsOfQueryCustomer,
      currentSelectLabelName: '',
      currentModalKey: '',
    };
    this.visible = false;
  }

  // 获取已筛选客户数
  // 获取当前过滤条件
  // 获取当前筛选客户查询条件
  @autobind
  getSelectFilters() {
    return _.pick(this.state, [
      'filterNumObject',
      'argsOfQueryCustomer',
      'currentFilterObject',
      'currentAllFilterState',
      'allFiltersCloseIconState',
    ]);
  }

  /**
 * 查询标签下客户
 * @param {*} labelId 标签Id
 * @param {*} curPageNum 当前页
 * @param {*} pageSize 当前页条目
 */
  queryPeopleOfLabel({ labelId, curPageNum = 1, pageSize = 10, filter = [] }) {
    const { isAuthorize, orgId, getLabelPeople, onChange } = this.props;
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
      const { filters, labels } = getCustomerListFilters(filter, labelId, filtersList);
      payload.filtersReq = filters;
      payload.labels = labels;
    }
    if (!_.isEmpty(filtersList)) {
      payload.filtersReq = filtersList;
    }
    // 获取客户列表
    getLabelPeople(payload).then(() => {
      const { filterNumObject } = this.state;
      // 数据回来后，显示弹框
      this.setState({
        modalVisible: true,
        // 以当前labelId作为key，在第二次打开modal的时候，如果是同一个label，则保留filter数据，否则清空
        currentModalKey: `${labelId}_modalKey`,
      });
      this.visible = true;
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
        onChange({
          currentLabelId: labelId,
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
  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

  @autobind
  change(e) {
    const { onChange, circlePeopleData } = this.props;
    const { filterNumObject } = this.state;
    const currentLabelId = e.target.value;
    const currentLabelInfo = _.find(circlePeopleData, item => item.id === currentLabelId
      || item.labelMapping === currentLabelId) || {};
    let finalFilterNumObject = filterNumObject;
    if (!(`${currentLabelId}` in finalFilterNumObject)) {
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

    onChange({
      currentLabelId,
      filterNumObject: {
        ...filterNumObject,
        ...finalFilterNumObject,
      },
      currentSelectLabelName: currentLabelInfo.labelName,
    });
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
    this.props.onChange({
      currentLabelId: value.id,
      currentSelectLabelName: value.labelName,
    });
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
   * 筛查客户弹窗中的 筛选项 变化值,
   * 该对象包含该筛选条件对应的名称name，代码key，选中字段名value
   */
  @autobind
  handleFilterChange(obj) {
    const { labelId, currentFilterObject, currentAllFilterState } = this.state;
    const newFilterArray = currentFilterObject[labelId] ? [...currentFilterObject[labelId]] : [];
    const newFilterAllArray =
      currentAllFilterState[labelId] ? [...currentAllFilterState[labelId]] : [];
    const index = _.findIndex(newFilterArray, o => o.split('.')[0] === obj.name);
    const filterItem = `${obj.name}.${obj.key}`;
    const filterAllItem = {
      name: obj.name,
      filterLabel: obj.filterLabel,
      valueArray: obj.valueArray,
    };
    if (index > -1) {
      newFilterArray[index] = filterItem;
      newFilterAllArray[index] = filterAllItem;
    } else {
      newFilterArray.push(filterItem);
      newFilterAllArray.push(filterAllItem);
    }
    this.setState({
      currentFilterObject: {
        ...currentFilterObject,
        [labelId]: newFilterArray,
      },
      currentAllFilterState: {
        ...currentAllFilterState,
        [labelId]: newFilterAllArray,
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

  @autobind
  onCheckFilterMoreButton(obj) {
    const { labelId, allFiltersCloseIconState } = this.state;
    const newFilterStatusArray =
      allFiltersCloseIconState[labelId] ? [...allFiltersCloseIconState[labelId]] : [];
    const index = _.findIndex(newFilterStatusArray, o => o.name === obj.name);
    const filterStatusItem = {
      name: obj.name,
      status: obj.status,
    };
    if (index > -1) {
      newFilterStatusArray[index] = filterStatusItem;
    } else {
      newFilterStatusArray.push(filterStatusItem);
    }
    this.setState({
      allFiltersCloseIconState: {
        ...allFiltersCloseIconState,
        [labelId]: newFilterStatusArray,
      },
    });
  }

  // 瞄准镜关闭按钮状态切换并保存allFiltersCloseIconState
  @autobind
  onCloseIconClick(obj) {
    this.onCheckFilterMoreButton(obj);
  }

  @autobind
  renderFilterTooltip(filters) {
    let stringArray = _.map(filters, (filterObj) => {
      if (!_.isEmpty(filterObj.valueArray) && filterObj.valueArray[0] !== '不限') {
        return {
          title: filterObj.filterLabel,
          value: filterObj.valueArray.join('，'),
        };
      }
      return null;
    });
    stringArray = _.compact(stringArray);
    return (
      <div className={styles.filterTooltip}>
        {
          _.map(stringArray, (filter, index) => (
            <div className={styles.toolTipItem} key={index}>
              <span className={styles.title}>{`${filter.title}：`}</span>
              <span className={styles.tipsContent}>{filter.value}</span>
            </div>))
        }
      </div>
    );
  }

  @autobind
  getFilterInfo(filters) {
    const stringArray = _.map(filters, (filterObj) => {
      if (!_.isEmpty(filterObj.valueArray) && filterObj.valueArray[0] !== '不限') {
        return `${filterObj.filterLabel}：${filterObj.valueArray.join('，')}`;
      }
      return null;
    });
    return _.compact(stringArray).join(' ； ');
  }

  @autobind
  getSelectFiltersInfo(filters) {
    if (filters) {
      return (
        <Tooltip
          title={this.renderFilterTooltip(filters)}
          overlayClassName={styles.filtersTooltip}
          getPopupContainer={this.getPopupContainer}
          placement="bottomLeft"
          trigger="hover"
        >
          <div className={styles.selectFiltersInfo}>
            {this.getFilterInfo(filters)}
          </div>
        </Tooltip>
      );
    }
    return null;
  }

  // Y为高净值、N为非高净值
  @autobind
  renderRadioSection() {
    const { condition, circlePeopleData, currentSelectLabel } = this.props;
    const { filterNumObject, currentAllFilterState } = this.state;
    return _.map(circlePeopleData,
      (item, index) => {
        const currentFilterNum = (`${item.id}` in filterNumObject ?
          filterNumObject[item.id] : item.customNum) || 0;
        const currentSelectFilters = currentAllFilterState[item.id];
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
          [styles.clearBorder]: index === circlePeopleData.length - 1, // 最后一个item清除border
        });

        return (
          <div
            className={cls}
            key={item.id || item.labelMapping}
          >
            <div className={styles.leftContent}>
              <Radio
                value={item.id}
                key={item.tagNumId || item.labelMapping}
              >
                <span
                  className={styles.title}
                  title={item.labelName}
                  dangerouslySetInnerHTML={{ __html: newTitle }} // eslint-disable-line
                />
              </Radio>
              <span className={styles.titExp}>
                <span>由</span><i>{item.createrName || '--'}</i><span>创建于</span><i>{transformDate(item.createDate)}</i><span>- 客户总数：</span><i>{transformNumber(item.customNum)}</i>
              </span>
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: newDesc }} // eslint-disable-line
              />
            </div>
            <div className={styles.divider} />
            <div className={styles.filterCount}>
              已选客户数：<i>{transformNumber(currentFilterNum)}</i>
            </div>
            {this.getSelectFiltersInfo(currentSelectFilters)}
            {
              item.customNum === 0 ? null :
              <Clickable
                onClick={() => this.handleSeeCust(item)}
                eventName="/click/taskSearchRow/checkCust"
              >
                <Button className={styles.seeCust}>筛查客户</Button>
              </Clickable>
            }
          </div>
        );
      });
  }

  render() {
    const {
      curPageNum = INITIAL_PAGE_NUM,
      custTableData,
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
      currentSource,
      labelId,
      filterNumObject,
      currentSelectLabelName,
      modalVisible,
      currentModalKey,
    } = this.state;

    const {
      currentSelectLabel,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      dict,
      sightingTelescopeFilters,
      circlePeopleData,
    } = this.props;

    const currentItems = currentFilterObject[labelId] || [];
    const currentAllItems = currentAllFilterState[labelId] || [];
    const filtersCloseIconState = allFiltersCloseIconState[labelId] || [];
    const totalRecordNum = filterNumObject[labelId] || 0;

    const cls = classnames({
      [styles.divContent]: true,
      [styles.clearBorder]: circlePeopleData.length === 0, // 最后一个item清除border
    });

    return (
      <div className={cls}>
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
          <Modal
            visible={modalVisible}
            title={currentSelectLabelName || ''}
            maskClosable={false}
            // 关闭弹框时，销毁子元素，不然数据会复用,antd升级这个api才会有，所以先用key代替这个api
            destroyOnClose
            key={currentModalKey}
            onCancel={this.handleCancel}
            width={1090}
            footer={
              <Clickable
                onClick={this.handleCancel}
                eventName="/click/taskSearchRow/close"
              >
                <Button className={styles.modalButton} key="back" size="large">确定</Button>
              </Clickable>
            }
            wrapClassName={styles.labelCustModalContainer}
          >
            <div className={styles.filter}>
              <FilterCustomers
                dict={dict}
                currentItems={currentItems}
                currentAllItems={currentAllItems}
                filtersCloseIconState={filtersCloseIconState}
                onFilterChange={this.handleFilterChange}
                onCloseIconClick={this.onCloseIconClick}
                onCheckMoreButton={this.onCheckFilterMoreButton}
                source={currentSource}
                sightingTelescopeFilters={sightingTelescopeFilters}
              />
            </div>
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
        </div>
        {
          <Loading loading={!isLoadingEnd || !isSightTelescopeLoadingEnd} />
        }
      </div>
    );
  }
}
