/**
 * Created By K0170179 on 2018/1/15
 * 播放列表详情
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DatePicker, Input, Button, Table, Icon, Popconfirm, Affix, message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import withRouter from '../../decorators/withRouter';
import styles from './boradcastList.less';
import { openRctTab, permission } from '../../utils';
import { url as urlHelper } from '../../helper';
import AddMorningBoradcast from '../../components/modals/AddMorningBoradcast';

const Search = Input.Search;

let TIME_RANGE_FROM; // 查询创建时间-->开始时间

const effects = {
  getBoradcastList: 'morningBoradcast/getBoradcastList',
  saveBoradcast: 'morningBoradcast/saveBoradcast',
  getBoradcastDetail: 'morningBoradcast/getBoradcastDetail',
  delBoradcastItem: 'morningBoradcast/delBoradcastItem',
  getUuid: 'morningBoradcast/getUuid',
  delCeFile: 'morningBoradcast/delCeFile',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  morningBoradcast: state.morningBoradcast,
  dict: state.app.dict,
  newsListLoading: state.loading.effects['morningBoradcast/getBoradcastList'] || false,
});

const mapDispatchToProps = {
  getBoradcastList: fetchDataFunction(false, effects.getBoradcastList),
  saveBoradcast: fetchDataFunction(true, effects.saveBoradcast),
  getBoradcastDetail: fetchDataFunction(true, effects.getBoradcastDetail),
  delBoradcastItem: fetchDataFunction(true, effects.delBoradcastItem),
  getUuid: fetchDataFunction(true, effects.getUuid),
  delCeFile: fetchDataFunction(true, effects.delCeFile),
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BroadcastList extends PureComponent {
  static propTypes = {
    morningBoradcast: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    newsListLoading: PropTypes.bool.isRequired,
    getBoradcastList: PropTypes.func.isRequired,
    saveBoradcast: PropTypes.func.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
    delBoradcastItem: PropTypes.func.isRequired,
    getUuid: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    delCeFile: PropTypes.func.isRequired,
  };

  /**
   * 获取晨报列表默认参数
   * @param beforeM 与当日时间间隔（月）
   * @returns {{TO_DATE: string, FROM_DATE: string, PAGE_NUM: number, PAGE_LEN: number}}
   * TO_DATE 当日时间(YYYY-MM-DD)
   * FROM_DATE 距当日beforeM月前日期(YYYY-MM-DD)
   * PAGE_NUM 默认当前页
   * PAGE_LEN 默认页容量
   */
  static initNewsListQuery(beforeM = 1) {
    const TO_DATE = moment().format('YYYY-MM-DD');
    const FROM_DATE = moment().subtract(beforeM, 'months').format('YYYY-MM-DD');
    const PAGE_NUM = 1;
    const PAGE_LEN = 10;
    return { TO_DATE, FROM_DATE, PAGE_NUM, PAGE_LEN };
  }

  constructor(props) {
    super(props);

    // 初始化开始时间
    const { morningBoradcast: { newsListQuery } } = this.props;
    const { FROM_DATE } = BroadcastList.initNewsListQuery();
    TIME_RANGE_FROM = newsListQuery.FROM_DATE || FROM_DATE;

    this.state = {
      visible: false,
      open: false,
      newsId: -1,
    };
  }

  componentDidMount() {
    const { morningBoradcast: { boradcastList, newUuid }, getUuid } = this.props;
    const { onHandleGetList } = this;
    // 如果当前每日播报列表中没有数据则去获取
    if (!boradcastList.length) onHandleGetList();
    // 初始化Uuid
    if (!newUuid.length) getUuid();
  }

  componentWillReceiveProps(nextProps) {
    const preDelInfo = this.props.morningBoradcast.delBoradcastInfo;
    const nextDelInfo = nextProps.morningBoradcast.delBoradcastInfo;
    if (preDelInfo !== nextDelInfo) {
      if (nextDelInfo.code === '0') {
        message.success('删除成功', 1, this.onHandleGetList);
      } else {
        message.success('删除失败', 1);
      }
    }
  }

  // 刷新列表数据
  @autobind
  onHandleGetList(option) {
    const { getBoradcastList } = this.props;
    const { TO_DATE, FROM_DATE, PAGE_NUM, PAGE_LEN } = BroadcastList.initNewsListQuery();
    const { pagination, newsListQuery } = this.props.morningBoradcast;
    const { defaultCurrent, defaultPageSize } = pagination;
    const query = {
      createdFrom: newsListQuery.FROM_DATE || FROM_DATE,
      createdTo: newsListQuery.TO_DATE || TO_DATE,
      pageNum: defaultCurrent || PAGE_NUM,
      pageSize: defaultPageSize || PAGE_LEN,
      createdBy: newsListQuery.CREATE_BY || '',
      title: newsListQuery.TITLE || '',
      ...option,
    };
    getBoradcastList(query);
  }

  // 跳转至晨报详情
  @autobind
  onHandleToDetail(newsId) {
    const { push } = this.props;
    const param = { id: 'RTC_TAB_NEWS_DETAIL', title: '晨报' };
    const url = '/broadcastDetail';
    const query = { newsId };
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
    });
  }

  // Model(晨报新增、修改) --> start
  @autobind()
  showModal(newsId = -1) {
    this.setState({
      visible: true,
      newsId,
    });
  }

  @autobind()
  handleOk(callback) {
    this.setState({
      visible: false,
    }, callback);
  }

  @autobind()
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  // Model(晨报新增、修改) --> end

  // table -->start
  @autobind
  onHandleTablecolumns() {
    const columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      className: 'tableTitle',
      width: '35%',
      render: (text, record) => {
        const newId = record.newsId;
        return (
          <span
            onClick={() => { this.onHandleToDetail(newId); }}
            className={styles.textOverflow}
            style={{ cursor: 'pointer' }}
          >
            {text}
          </span>
        );
      },
    }, {
      title: '类型',
      dataIndex: 'newsTypValue',
      width: '15%',
      key: 'type',
    }, {
      title: '创建日期',
      dataIndex: 'created',
      width: '15%',
      key: 'date',
    }, {
      title: '作者',
      dataIndex: 'createdBy',
      width: '15%',
      className: 'tableAuthor',
      key: 'author',
    }];
    if (permission.hasZXMampPermission()) {
      columns.push({
        title: '操作',
        key: 'action',
        dataIndex: 'newsId',
        width: '15%',
        className: 'tableAction',
        render: newsId => (
          <span>
            <span onClick={() => { this.showModal(newsId); }}><Icon className="edit" type="edit" /></span>
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelItem(newsId)}>
              <i className="icon iconfont icon-shanchu remove" />
            </Popconfirm>
          </span>
        ),
      });
    }
    return columns;
  }
  // 页码切换
  @autobind()
  onPageNumChange(page) {
    const { onHandleGetList } = this;
    onHandleGetList({ pageNum: page });
  }
  // 页容量切换
  @autobind()
  onPageSizeChange(current, size) {
    const { onHandleGetList } = this;
    const query = {
      pageSize: size,
      pageNum: current,
    };
    onHandleGetList(query);
  }
  // 列表项删除
  @autobind()
  onDelItem(newsId) {
    const { delBoradcastItem } = this.props;
    delBoradcastItem({ newsId });
  }
  // table -->end

  // Search -->start
  @autobind()
  onHandleSearch(value) {
    const { onHandleGetList } = this;
    onHandleGetList({
      title: value,
      pageNum: 1,
    });
  }
  @autobind()
  onHandleAuthorSearch(value) {
    const { onHandleGetList } = this;
    onHandleGetList({
      createdBy: value,
      pageNum: 1,
    });
  }
  // Search -->end

  // 日期选择组件-->start
  @autobind()
  startValue(value) {
    if (!value) return TIME_RANGE_FROM;
    TIME_RANGE_FROM = value.format('YYYY-MM-DD');
    return TIME_RANGE_FROM;
  }

  @autobind()
  disabledStartDate(startValue) {
    const { TO_DATE } = BroadcastList.initNewsListQuery();
    return startValue &&
      startValue.valueOf() > moment(TO_DATE).valueOf();
  }

  @autobind()
  disabledEndDate(endValue) {
    const startValue = this.startValue();
    const MIN_DATE = moment.min(moment(), moment(startValue).add(6, 'month'));
    return endValue &&
      endValue.valueOf() >= MIN_DATE.valueOf();
  }

  @autobind()
  onStartChange(value) {
    this.startValue(value);
  }

  @autobind()
  onEndChange(value) {
    const { onHandleGetList } = this;
    const startValue = this.startValue();
    this.setState({ endOpen: false });
    onHandleGetList({
      createdFrom: startValue,
      createdTo: value.format('YYYY-MM-DD'),
      pageNum: 1,
    });
  }

  @autobind()
  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    } else {
      this.setState({ endValue: null });
    }
  }

  @autobind()
  handleEndOpenChange(open) {
    if (open) {
      this.setState({ endOpen: open });
    }
  }
  // 日期选择组件-->end
  render() {
    const {
      morningBoradcast: {
        boradcastList,
        pagination,
        newsListQuery,
        saveboradcastInfo,
        boradcastDetail,
        newUuid,
        delSourceFile,
      },
      newsListLoading,
      saveBoradcast,
      delCeFile,
      getBoradcastDetail,
      dict,
    } = this.props;
    const initQuery = BroadcastList.initNewsListQuery();
    const { FROM_DATE, TO_DATE, TITLE, CREATE_BY } = newsListQuery;
    const { visible, endOpen, newsId } = this.state;
    const newBoradcastList = _.map(boradcastList, item => ({ ...item, key: `${item.newsId}` }));

    return (
      <div className={styles.broadcastListWrap} >
        <Affix>
          <div className={styles.header}>
            <div>
              <div className={styles.author}>
                <span>作者：</span>
                <Search
                  placeholder="作者"
                  defaultValue={CREATE_BY}
                  style={{ width: 200 }}
                  onSearch={this.onHandleAuthorSearch}
                />
              </div>
              <div className={styles.timeRange}>
                <span>创建时间：</span>
                <DatePicker
                  size="default"
                  format="YYYY-MM-DD"
                  placeholder="Start"
                  allowClear={false}
                  defaultValue={moment(FROM_DATE || initQuery.FROM_DATE)}
                  disabledDate={this.disabledStartDate}
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
                ~
                <DatePicker
                  size="default"
                  format="YYYY-MM-DD"
                  placeholder="End"
                  allowClear={false}
                  defaultValue={moment(TO_DATE || initQuery.TO_DATE)}
                  disabledDate={this.disabledEndDate}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
              </div>
            </div>
            <div>
              <Search
                placeholder="标题关键词"
                defaultValue={TITLE}
                style={{ width: 200 }}
                onSearch={this.onHandleSearch}
              />
              {
                permission.hasZXMampPermission() ?
                  (
                    <span>
                      <span className={styles.division}>|</span>
                      <Button type="primary" icon="plus" size="large" onClick={() => this.showModal()}>新建</Button>
                    </span>
                  ) :
                  null
              }
              <AddMorningBoradcast
                dict={dict}
                visible={visible}
                newsId={newsId}
                newUuid={newUuid}
                delCeFile={delCeFile}
                delSourceFile={delSourceFile}
                saveboradcastInfo={saveboradcastInfo}
                boradcastDetail={boradcastDetail}
                saveBoradcast={saveBoradcast}
                getBoradcastDetail={getBoradcastDetail}
                handleOk={this.handleOk}
                handleCancel={this.handleCancel}
                onHandleGetList={this.onHandleGetList}
              />
            </div>
          </div>
        </Affix>
        <div className={styles.body}>
          <div className={styles.broadcastList}>
            <Table
              loading={newsListLoading}
              columns={this.onHandleTablecolumns()}
              dataSource={newBoradcastList}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal() { return `共${pagination.total}项`; },
                onChange: this.onPageNumChange,
                onShowSizeChange: this.onPageSizeChange,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
