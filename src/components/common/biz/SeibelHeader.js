/**
 * @file Pageheader.js
 * 权限申请，合约管理，佣金调整头部筛选
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import HtFilter, { MoreFilter } from '../htFilter';
import Button from '../Button';
import styles from '../../style/jiraLayout.less';
import contractHelper from '../../../helper/page/contract';
import { permission } from '../../../helper';
import { seibelConfig } from '../../../config';
import config from '../../telephoneNumberManage/config';
import logable from '../../../decorators/logable';

const {
  contract: { pageType: contractPageType },
  channelsTypeProtocol: { pageType: channelsPageType },
  filialeCustTransfer: { pageType: filialeCustTransfer },
} = seibelConfig;
const { telephoneNumApply: { pageType: phoneApplyPageType } } = config;

// 头部筛选filterBox的高度
const dateFormat = 'YYYY/MM/DD';
// 当前时间
const currentDate = moment();
const DEFAULT_VALUE = '';

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 页面
    page: PropTypes.string,
    // 子类型
    subtypeOptions: PropTypes.array,
    // 状态
    stateOptions: PropTypes.array.isRequired,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 操作类型
    needOperate: PropTypes.bool,
    operateOptions: PropTypes.array,
    // 页面类型
    pageType: PropTypes.string.isRequired,
    // 部门列表
    custRange: PropTypes.array.isRequired,
    // 获取部门列表
    getCustRange: PropTypes.func.isRequired,
    // 拟稿人列表
    drafterList: PropTypes.array.isRequired,
    // 获取拟稿人列表
    getDrafterList: PropTypes.func.isRequired,
    // 已申请服务经理
    ptyMngList: PropTypes.array.isRequired,
    // 获取已申请的服务经理
    getPtyMngList: PropTypes.func.isRequired,
    // 审批人列表
    approvePersonList: PropTypes.array.isRequired,
    // 获取审批人列表
    getApprovePersonList: PropTypes.func.isRequired,
    // 客户列表
    customerList: PropTypes.array.isRequired,
    // 获取客户列表
    getCustomerList: PropTypes.func.isRequired,
    // 新的客户列表
    newCustomerList: PropTypes.array.isRequired,
    // 获取新的客户列表
    getNewCustomerList: PropTypes.func.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
    // 判断登录人当前切换的职位所在部门为分公司层级
    checkUserIsFiliale: PropTypes.func,
    // 提供由用户来判断是否需要显示新建按钮
    isShowCreateBtn: PropTypes.func,
    // 是否调用新的客户列表接口，若为true，则使用新的获取客户列表接口，为false，则使用原来的获取客户列表接口，默认为false
    isUseNewCustList: PropTypes.bool,
    basicFilters: PropTypes.array.isRequired,
    moreFilters: PropTypes.array,
    moreFilterData: PropTypes.array,
  }

  static contextTypes = {
    empInfo: PropTypes.object,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    page: '',
    needOperate: false,
    operateOptions: [],
    empInfo: {},
    subtypeOptions: [],
    filterCallback: _.noop,
    checkUserIsFiliale: _.noop,
    isShowCreateBtn: () => true,
    isUseNewCustList: false,
    moreFilters: [],
    moreFilterData: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      // 需要显示的出来的更多里的过滤条件
      moreFilterList: [],
    };
  }

  componentWillMount() {
    this.props.getCustRange({
      type: this.props.pageType,
    });
  }

  @autobind
  getCalendarContainer() {
    return this.pageCommonHeader;
  }

  @autobind
  filterBoxRef(input) {
    this.filterBox = input;
  }

  @autobind
  filterMoreRef(input) {
    this.filterMore = input;
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].custName',
    },
  })
  selectCustItem(item) {
    const { value: { custNumber, custName } } = item;
    const { filterCallback } = this.props;
    filterCallback({
      custNumber,
      custName,
    });
  }

  // 选中拟稿人/审批人下拉对象中对应的某个对象
  @autobind
  selectItem(name, item) {
    const { filterCallback } = this.props;
    const { ptyMngId, ptyMngName } = item;
    let params = {};
    switch (name) {
      case 'ptyMngId':
        params = {
          ptyMngId,
          ptyMngName,
        };
        break;
      case 'drafterId':
        params = {
          drafterId: ptyMngId,
          drafterName: ptyMngName,
        };
        break;
      case 'approvalId':
        params = {
          approvalId: ptyMngId,
          approvalName: ptyMngName,
        };
        break;
      default:
        break;
    }
    filterCallback(params);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务经理',
      value: '$args[1].ptyMngName',
    },
  })
  handleManagerSelect(name, item) {
    const { value } = item;
    this.selectItem(name, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '拟稿人',
      value: '$args[1].ptyMngName',
    },
  })
  handleDrafterSelect(name, item) {
    const { value } = item;
    this.selectItem(name, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '审批人',
      value: '$args[1].ptyMngName',
    },
  })
  handleApproverSelect(name, item) {
    const { value } = item;
    this.selectItem(name, value);
  }

  // 选中部门下拉对象中对应的某个对象
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '部门',
      value: '$args[0]',
    },
  })
  selectCustRange(value) {
    const { filterCallback } = this.props;
    filterCallback({
      orgId: value,
    });
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    this.setState({
      [key]: v,
    });
    const { filterCallback } = this.props;
    filterCallback({
      [key]: v,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '操作类型',
      value: '$args[1]',
    },
  })
  handleOperateTypeChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[1]',
    },
  })
  handleSubtypeChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '状态',
      value: '$args[1]',
    },
  })
  handleStatusChange(option) {
    const { id, value: { value } } = option;
    this.handleSelectChange(id, value);
  }

  @autobind
  handleCreate() {
    this.props.creatSeibelModal();
  }

  // 查询客户、拟稿人、审批人公共调接口方法
  @autobind
  toSearch(method, value) {
    method({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询客户',
      value: '$args[0]',
    },
  })
  handleCustSearch(value) {
    const {
      pageType,
      isUseNewCustList,
      getCustomerList,
      getNewCustomerList,
    } = this.props;
    const params = {
      keyword: value,
      type: pageType,
    };
    if (isUseNewCustList) {
      getNewCustomerList(params);
    } else {
      getCustomerList(params);
    }
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询服务经理',
      value: '$args[0]',
    },
  })
  handleManagerSearch(value) {
    this.props.getPtyMngList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询拟稿人',
      value: '$args[0]',
    },
  })
  handleDrafterSearch(value) {
    this.props.getDrafterList({
      keyword: value,
      type: this.props.pageType,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '查询审批人',
      value: '$args[0]',
    },
  })
  handleApproverSearch(value) {
    this.props.getApprovePersonList({
      keyword: value,
      type: this.props.pageType,
    });
  }


  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '申请时间',
      value: (instance, args) => {
        const dateArr = _.map(
          args[0],
          item => moment(item).format(dateFormat),
        );
        return _.join(dateArr, '~');
      },
    },
  })
  handleCreateDateChange(date) {
    const { value } = date;
    const startDate = value[0];
    const endDate = value[1];
    if (startDate && endDate) {
      const createTime = moment(startDate).format(dateFormat);
      const createTimeTo = moment(endDate).format(dateFormat);
      this.props.filterCallback({
        createTime,
        createTimeTo,
      });
    }
  }

  // 获取客户列表
  @autobind
  getCustList() {
    const {
      customerList,
      newCustomerList,
      isUseNewCustList,
    } = this.props;
    return isUseNewCustList ? newCustomerList : customerList;
  }

  // 只能选择今天之前的时间
  @autobind
  setDisableRange(date) {
    return date > currentDate;
  }

  // 获取部门
  @autobind
  transformCustRangeData(list) {
    return list.map((item) => {
      const obj = {
        label: item.name,
        value: item.id,
        key: item.id,
      };
      if (item.children && item.children.length) {
        obj.children = this.transformCustRangeData(item.children);
      }
      return obj;
    });
  }

  @autobind
  getFilterData(filter) {
    const { filterId } = filter.props;
    const {
      subtypeOptions,
      stateOptions,
      drafterList,
      approvePersonList,
      custRange,
      operateOptions,
      ptyMngList,
    } = this.props;
    const custList = this.getCustList();
    // 客户增加不限
    // const customerAllList = !_.isEmpty(custList) ?
    //   [{ custName: '不限', custNumber: '' }, ...custList] : custList;
    // const ptyMngAll = { ptyMngName: '不限', ptyMngId: '' };
    // // 服务经理增加不限
    // const ptyMngAllList = !_.isEmpty(ptyMngList) ?
    //   [ptyMngAll, ...ptyMngList] : ptyMngList;
    // // 拟稿人增加不限
    // const drafterAllList = !_.isEmpty(drafterList) ?
    //   [ptyMngAll, ...drafterList] : drafterList;
    // 部门增加不限
    let treeCustRange = [];
    if (custRange.length) {
      treeCustRange = this.transformCustRangeData(custRange);
    }
    treeCustRange = [
      {
        label: '不限',
        value: '',
        key: 0,
      },
      ...treeCustRange,
    ];
    // 审批人增加不限
    // const approvePersonAllList = !_.isEmpty(approvePersonList) ?
    //   [ptyMngAll, ...approvePersonList] : approvePersonList;
    switch (filterId) {
      case 'customer':
        return _.isEmpty(custList) ? [] : custList;
      case 'serviceManager':
        return ptyMngList;
      case 'business2':
        return operateOptions;
      case 'subType':
        return subtypeOptions;
      case 'status':
        return stateOptions;
      case 'drafter':
        return drafterList;
      case 'department':
        return treeCustRange;
      case 'approver':
        return approvePersonList;
      default:
        return [];
    }
  }

  @autobind
  getFilterValue(filter) {
    const { filterId } = filter.props;
    const {
      location: {
        query: {
          custNumber,
          custName,
          drafterId,
          drafterName,
          approvalId,
          approvalName,
          ptyMngId,
          ptyMngName,
          orgId,
          subType,
          status,
          business2,
          createTime,
          createTimeTo,
        },
      },
    } = this.props;
    // 时间组件的回填
    const startTime = createTime ? moment(createTime, dateFormat) : null;
    const endTime = createTimeTo ? moment(createTimeTo, dateFormat) : null;
    const customer = custNumber ? [custNumber, custName] : ['', ''];
    const serviceManager = ptyMngId ? [ptyMngId, ptyMngName] : ['', ''];
    const drafter = drafterId ? [drafterId, drafterName] : ['', ''];
    const approval = approvalId ? [approvalId, approvalName] : ['', ''];
    switch (filterId) {
      case 'customer':
        return customer;
      case 'serviceManager':
        return serviceManager;
      case 'business2':
        return business2;
      case 'subType':
        return subType;
      case 'status':
        return status;
      case 'drafter':
        return drafter;
      case 'department':
        return orgId || DEFAULT_VALUE;
      case 'approver':
        return approval;
      case 'applyTime':
        return [startTime, endTime];
      default:
        return '';
    }
  }

  @autobind
  getFilterOnChange(filter) {
    const { filterId } = filter.props;
    switch (filterId) {
      case 'customer':
        return this.selectCustItem;
      case 'serviceManager':
        return item => this.handleManagerSelect('ptyMngId', item);
      case 'business2':
        return this.handleOperateTypeChange;
      case 'subType':
        return this.handleSubtypeChange;
      case 'status':
        return this.handleStatusChange;
      case 'drafter':
        return item => this.handleDrafterSelect('drafterId', item);
      case 'department':
        return this.selectCustRange;
      case 'approver':
        return item => this.handleApproverSelect('approvalId', item);
      case 'applyTime':
        return this.handleCreateDateChange;
      default:
        return () => {};
    }
  }

  // 更多里面选中的过滤条件
  @autobind
  selectMoreFilter() {
    const {
      location: {
        query,
      },
      moreFilters,
    } = this.props;
    return _.map(moreFilters, (itemFilter) => {
      const hasFilterItem = _.every(itemFilter.filterOption, item => _.hasIn(query, item));
      if (hasFilterItem) {
        return itemFilter.props.key;
      }
      return null;
    });
  }

  @autobind
  moreFilterChange(obj) {
    const {
      location: {
        pathname,
        query,
      },
      moreFilters,
    } = this.props;
    const { moreFilterList } = this.state;
    const { replace } = this.context;
    const { isDeleteFilterFromLocation, id } = obj;
    const currentFilterItem = _.filter(moreFilters, item => item.props.key === id)[0];
    const filterOption = currentFilterItem && currentFilterItem.filterOption;
    let finalQuery = query;
    if (isDeleteFilterFromLocation && currentFilterItem) {
      finalQuery = _.omit(query, filterOption);
    } else {
      // ['a','b'] => {a:'', b: ''}
      const filterMap = _.reduce(filterOption,
        (filterQuery, itemQuery) => ({ ...filterQuery, [itemQuery]: '' }), {});
      finalQuery = _.merge(query, filterMap);
      const list = moreFilterList;
      if (_.indexOf(list, id) > -1) {
        _.pull(list, id);
      } else {
        list.push(id);
      }
      this.setState({ moreFilterList: list });
    }
    replace({
      pathname,
      query: finalQuery,
    });
  }

  @autobind
  getFilterOnClose(filter) {
    const { key } = filter.props;
    const { moreFilterList } = this.state;
    this.moreFilterChange({ id: key, isDeleteFilterFromLocation: true });
    this.setState({ moreFilterList: _.pull(moreFilterList, key) });
  }

  // 根据类型，渲染更多的过滤组件
  @autobind
  getMoreFilterElement(filter) {
    const { filterId } = filter.props;
    return filterId ?
      <HtFilter
        className={styles.filterFl}
        data={this.getFilterData(filter)}
        value={this.getFilterValue(filter)}
        onChange={this.getFilterOnChange(filter)}
        onInputChange={this[filter.props.handleInputChange]}
        onClose={() => this.getFilterOnClose(filter)}
        isCloseable
        {...filter.props}
      /> : null;
  }

  @autobind
  getMoreFilters(key) {
    const { moreFilters } = this.props;
    const filterItem = _.find(moreFilters, item => (item.props.key === key));
    return filterItem ? this.getMoreFilterElement(filterItem) : null;
  }

  @autobind
  pageCommonHeaderRef(input) {
    this.pageCommonHeader = input;
  }

  render() {
    const {
      pageType,
      checkUserIsFiliale,
      basicFilters,
      moreFilterData,
    } = this.props;
    let { moreFilterList } = this.state;
    const { empInfo } = this.context;
    moreFilterList = this.selectMoreFilter();
    // 新建按钮权限
    let hasCreatePermission = true;
    // 如果是合作合约页面
    if (pageType === contractPageType) {
      hasCreatePermission = contractHelper.hasPermission(empInfo);
    } else if (pageType === channelsPageType) {
      // 如果是通道类协议页面
      hasCreatePermission = permission.hasPermissionOfProtocolCreate(empInfo);
    } else if (pageType === filialeCustTransfer) {
      // 如果分公司客户人工划转,是分公司并且是HTSC 客户分配岗
      hasCreatePermission = permission.hasFilialeCustTransferCreate(empInfo)
        && checkUserIsFiliale();
    } else if (pageType === phoneApplyPageType) {
      hasCreatePermission = permission.hasPermissionOfPhoneApplyCreate(empInfo);
    } else {
      // 此处,通用的判断是否需要隐藏新建按钮
      hasCreatePermission = this.props.isShowCreateBtn();
    }
    // 分公司客户分配不显示客户搜索
    // const custElement = page !== PAGE_CUST_ALLOT ?
    //   (<div className={styles.filterFl}>
    //     <div className={styles.dropDownSelectBox}>
    //       <SingleFilter
    //         filterId="curFilterCust"
    //         filterName="客户"
    //         value={custNumber}
    //         data={customerAllList}
    //         dataMap={['custNumber', 'custName']}
    //         onChange={this.selectCustItem}
    //         onInputChange={this.handleCustSearch}
    //         useLabelInValue
    //         showSearch
    //         needItemObj
    //       />
    //     </div>
    //   </div>)
    // : null;
    return (
      <div className={styles.pageCommonHeader} ref={this.pageCommonHeaderRef}>
        <div className={styles.filterBox} ref={this.filterBoxRef}>
          <div className={styles.filter}>
            {
              _.map(basicFilters, filter => (
                  !_.isEmpty(filter.props) ?
                  (
                    <HtFilter
                      key={filter.props.filterId}
                      className={styles.filterFl}
                      data={this.getFilterData(filter)}
                      value={this.getFilterValue(filter)}
                      onChange={this.getFilterOnChange(filter)}
                      onInputChange={this[filter.props.handleInputChange]}
                      {...filter.props}
                    />
                  ) : null
                ),
              )
            }
            {
              _.map(
                moreFilterList,
                  key => this.getMoreFilters(key))
            }

          </div>
          <div className={styles.moreFilterBtn}>
            {
              moreFilterData.length ?
                <div className={styles.filterFl}>
                  <MoreFilter
                    value={this.selectMoreFilter()}
                    data={moreFilterData}
                    onChange={this.moreFilterChange}
                  />
                </div> : null
              }
          </div>
        </div>
        {
          hasCreatePermission ?
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={() => { this.handleCreate(); }}
            >
              新建
            </Button>
            :
            null
        }
      </div>
    );
  }
}
