/**
 * @Descripter: 标签管理
 * @Author: K0170179
 * @Date: 2018/4/26
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Divider, Tag, Input, List, Checkbox, Button, Modal } from 'antd';

import { dva, emp, fsp, permission, env } from '../../../helper';
import Pagination from '../../../components/common/Pagination';
import { Search } from '../../../components/customerPool/home';
import Icon from '../../../components/common/Icon';
import logable, { logPV } from '../../../decorators/logable';
import styles from './recommendedLabel.less';
import withRouter from '../../../decorators/withRouter';

const { Item } = List;
const confirm = Modal.confirm;
const EMPTY_LIST = [];
const effects = {
  queryHotWds3: 'operationCenter/queryHotWds3',
  queryCustLabels: 'operationCenter/queryCustLabels',
  updataCustLabels: 'operationCenter/updataCustLabels',
};

// 当前用户orgId
const ORG_ID = emp.getOrgId();
// 任务管理岗权限
const AUTHORITY = permission.hasTkMampPermission();
// 最多可以选择的推荐标签数目
const MAX_SELECT_LABEL_SIZE = 20;
const MIN_SELECT_LABEL_SIZE = 8;

const mapStateToProps = state => ({
  hotWds: state.operationCenter.hotWds,
  custLabels: state.operationCenter.custLabels,
});
const mapDispatchToProps = {
  replace: routerRedux.replace,
  push: routerRedux.push,
  queryHotWds3: dva.generateEffect(effects.queryHotWds3),
  queryCustLabels: dva.generateEffect(effects.queryCustLabels),
  updataCustLabels: dva.generateEffect(effects.updataCustLabels),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class RecommendedLabel extends PureComponent {
  static propTypes = {
    hotWds: PropTypes.array.isRequired,
    custLabels: PropTypes.array.isRequired,
    queryHotWds3: PropTypes.func.isRequired,
    queryCustLabels: PropTypes.func.isRequired,
    updataCustLabels: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { queryCustLabels,
      location: { query: { sWord = '' } },
    } = props;
    // 初始化加载客户标签
    queryCustLabels({ condition: sWord });
    this.state = {
      selectedLabels: EMPTY_LIST, // 以选择标签项
      visible: false, // 是否显示预览model
      searchValue: sWord,
    };
  }

  componentDidMount() {
    const { queryHotWds3 } = this.props;
    // 加载热词数据
    queryHotWds3();
  }

  componentWillReceiveProps(nextProps) {
    const {
      hotWds,
      location: {
        query: { sWord = '' } },
    } = nextProps;
    if (hotWds !== this.props.hotWds) {
      this.setState({
        selectedLabels: hotWds,
        searchValue: sWord,
        rangeError: hotWds.length > MAX_SELECT_LABEL_SIZE || hotWds.length < MIN_SELECT_LABEL_SIZE,
      });
    }
  }

  // 搜索标签
  @autobind
  onQueryLabel(sWord = '') {
    const { queryCustLabels } = this.props;
    queryCustLabels({ condition: sWord });
    this.paginationChange({ sWord,
pageNum: 1 });
  }
  // 分页(当前页，当前页数据)
  getPaginationAndData() {
    const {
      location: {
        query: {
          pageSize = 3,
          pageNum = 1,
        },
      },
      custLabels = [],
    } = this.props;

    let finalCurrent = Number(pageNum) || 1;
    const total = custLabels.length;

    if (finalCurrent > 1 && total <= pageSize * (finalCurrent - 1)) {
      finalCurrent = _.ceil(total / pageSize, 0);
    }

    const allLabelsToTable = custLabels.map(item => ({ ...item,
key: item.id }));
    const currentLabels = _.filter(allLabelsToTable, (labelItem, index) =>
      index + 1 > (finalCurrent - 1) * pageSize &&
      index + 1 <= finalCurrent * pageSize);
    return {
      pagination: {
        total: custLabels.length,
        current: finalCurrent,
        pageSize,
      },
      currentLabels,
    };
  }

  // 分页变化
  @autobind
  paginationChange(option) {
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
        ...option,
      },
    });
    fsp.scrollToTop();
  }

  // 选择/取消标签
  @autobind
  handleCheckedLabel(e, item) {
    const { selectedLabels } = this.state;
    let finalSelectedLabels = selectedLabels;
    if (e.target.checked) {
      finalSelectedLabels = _.concat(finalSelectedLabels, item);
    } else {
      finalSelectedLabels = _.filter(finalSelectedLabels,
          selectedItem => selectedItem.id !== item.id);
    }
    this.setState({
      selectedLabels: finalSelectedLabels,
      rangeError: finalSelectedLabels.length > MAX_SELECT_LABEL_SIZE || finalSelectedLabels.length < MIN_SELECT_LABEL_SIZE,
    });
  }
  // 删除标签
  @autobind
  deleteUserLabel(e, labelId) {
    e.preventDefault();
    this.setState((preState) => {
      const { selectedLabels: preLabels } = preState;
      const selectedLabels = _.filter(preLabels, preLabelItem => preLabelItem.id !== labelId);
      return { selectedLabels,
rangeError: selectedLabels.length > MAX_SELECT_LABEL_SIZE || selectedLabels.length < MIN_SELECT_LABEL_SIZE };
    });
  }
  // 列表item
  @autobind
  renderLabelItem(item) {
    const { location: { query: { sWord = '' } } } = this.props;
    const { selectedLabels } = this.state;
    const {
      name = '',
      description = '',
    } = item;
    const replaceTag = `<span class="searchWord">${sWord}</span>`;

    const regExpSWord = new RegExp(_.escapeRegExp(sWord), 'g');
    const finalName = sWord ? name.replace(regExpSWord, replaceTag) : name;
    // 字数超两百打点显示
    let finalDesc = description.length > 200 ? `${description.slice(0, 200)}...` : description;
    finalDesc = sWord ? finalDesc.replace(regExpSWord, replaceTag) : finalDesc;

    const isCludeLabel = _.filter(selectedLabels, selectItem => selectItem.id === item.id).length;
    return (
      <Item.Meta
        avatar={<Checkbox
          checked={isCludeLabel}
          onChange={(e) => { this.handleCheckedLabel(e, item); }}
        />}
        title={
          <span
            dangerouslySetInnerHTML={{ __html: finalName }}
          />
        }
        description={<div
          title={description}
          dangerouslySetInnerHTML={{ __html: finalDesc }}
        />}
      />
    );
  }
  // 取消以选标签
  @autobind
  @logable({ type: 'ButtonClick',
payload: { name: '取消' } })
  cancelSelectedLabel() {
    const { hotWds } = this.props;
    this.setState({
      selectedLabels: hotWds,
      rangeError: hotWds.length > MAX_SELECT_LABEL_SIZE || hotWds.length < MIN_SELECT_LABEL_SIZE,
    });
  }
  // 预览
  @autobind
  @logPV({ pathname: '/modal/previewLabel',
title: '预览' })
  handlePreview() {
    this.setState({
      visible: true,
    });
  }
  // 搜索值
  @autobind
  handleSearchChange(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }
  // 关闭预览
  @autobind
  handleClosePreview() {
    this.setState({
      visible: false,
    });
  }
  // 提交
  @autobind
  @logPV({ pathname: '/modal/submitLabel',
title: '提交' })
  handleSubmit() {
    const { updataCustLabels, queryHotWds3 } = this.props;
    const { onQueryLabel } = this;
    const { selectedLabels } = this.state;
    const submitTitle = env.isInReact() ?
      '请确认选择的标签，提交后数据将实时生效' :
      '选择标签后请点击预览查看在首页的展示情况，标签文字超出部分将不在首页显示，如已查看，确定后将保存数据实时生效';
    confirm({
      title: submitTitle,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        const finalSelectedLabels = _.map(selectedLabels, item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          source: item.source,
        }));
        updataCustLabels({
          recommendedTags: finalSelectedLabels,
        }).then(() => {
          // 加载热词数据
          queryHotWds3();
          onQueryLabel();
        });
      },
    });
  }

  render() {
    const { selectedLabels, visible, searchValue, rangeError } = this.state;
    const { currentLabels, pagination } = this.getPaginationAndData();
    const {
      location,
      push,
    } = this.props;

    const previewCls = classnames({
      [styles.preview]: true,
      [styles.hidden]: env.isInReact(),
    });

    // 顶部提示语
    const headerHelperTip = env.isInReact() ?
      (<span>在此设置的推荐标签将显示在 <b>首页-猜你感兴趣</b> 中，实时生效。</span>) :
      (<span>在此设置的推荐标签将显示在 <b>首页-猜你感兴趣</b> 中，实时生效，点击下方 <b>预览</b> 可预览展示效果。</span>);

    // 标签占位文字
    const labelPlaceholder = env.isInReact() ?
      `请在下方标签列表中选择最多${MAX_SELECT_LABEL_SIZE}个推荐标签，最少${MIN_SELECT_LABEL_SIZE}个推荐标签` : '请在下方标签列表中选择最多5个推荐标签';

    const errorMessageCls = classnames({
      [styles.errorMessage]: true,
      [styles.hidden]: !rangeError,
    });

    return (<div className={styles.recommendedLabelWrap}>
      <div className={styles.headerTip}>
        {headerHelperTip}
      </div>
      <div className={styles.title}>
        <Divider type="vertical" className={styles.itemDivider} />
        选择标签
      </div>
      {
        env.isInReact() ?
          <div className={errorMessageCls}><span className="iconfont icon-guanbi"></span>{`最多只能选择${MAX_SELECT_LABEL_SIZE}个推荐标签，最少需要选择${MIN_SELECT_LABEL_SIZE}个推荐标签`}</div>
        : null
      }
      <div>
        {
          selectedLabels.length ?
          _.map(selectedLabels, item => (
            <Tag
              key={item.id}
              color="gold"
              closable
              onClose={(e) => {
                this.deleteUserLabel(e, item.id);
              }}
            >
              {item.name}
            </Tag>
          )) :
            (<span>{labelPlaceholder}</span>)
        }
      </div>
      <div className={styles.searchWrap}>
        <Input.Search
          enterButton
          placeholder="标签名称"
          onSearch={this.onQueryLabel}
          style={{ width: 200 }}
          value={searchValue}
          onChange={this.handleSearchChange}
        />
        <Button onClick={this.handlePreview} className={previewCls}>
          <Icon type="yulan" />
          预览
        </Button>
      </div>
      <div className={styles.transferWrap}>
        <List
          itemLayout="horizontal"
          dataSource={currentLabels}
          renderItem={item => (
            <Item>
              {
                this.renderLabelItem(item)
              }
            </Item>
          )}
        />
        <Pagination
          {...pagination}
          wrapClassName={styles.PaginationWrap}
          onChange={(pageNum) => { this.paginationChange({ pageNum }); }}
        />
      </div>
      <div className={styles.btnWrap}>
        <Button onClick={this.cancelSelectedLabel}>取消</Button>
        {
          env.isInReact() ?
            <Button type="primary" disabled={rangeError} onClick={this.handleSubmit}>提交</Button>
            : <Button type="primary" onClick={this.handleSubmit}>提交</Button>
        }
      </div>
      <Modal
        visible={visible}
        width={790}
        footer={null}
        onCancel={this.handleClosePreview}
      >
        <Search
          location={location}
          push={push}
          hotWdsList={selectedLabels}
          possibleWordsData={selectedLabels}
          authority={AUTHORITY}
          orgId={ORG_ID}
          isPreview
        />
      </Modal>
    </div>);
  }
}
