/**
 * Created By K0170179 on 2018/1/15
 * 播放列表详情
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Input, Button, Table, Icon, Popconfirm, Affix, message, Form } from 'antd';
import DateRangePick from 'lego-react-date/src';
import moment from 'moment';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import withRouter from '../../decorators/withRouter';
import styles from './boradcastList.less';
import { openRctTab } from '../../utils';
import { url as urlHelper, permission, fsp } from '../../helper';
import Pagination from '../../components/common/Pagination';
import AddMorningBoradcast from '../../components/morningBroadcast/AddMorningBoradcast';
import logable, { logPV } from '../../decorators/logable';

const Search = Input.Search;
// 新建晨报时标记晨报id为-1
// const createNewsId = -1;

// function getOpenModalLog(ctx) {
//   const newsId = ctx.state.newsId;
//   if (newsId === createNewsId) {
//     return {
//       pathname: '/modal/createBoradcastList',
//       title: '新建晨报',
//     };
//   }
//   return {
//     pathname: '/modal/modifyBoradcastList',
//     title: '修改晨报详情',
//   };
// }


// 六个月的天数
const SIX_MONTH_DAYS = 180;
const dateFormatStr = 'YYYY-MM-DD';
const effects = {
  getBoradcastList: 'morningBoradcast/getBoradcastList',
  saveBoradcast: 'morningBoradcast/saveBoradcast',
  getBoradcastDetail: 'morningBoradcast/getBoradcastDetail',
  delBoradcastItem: 'morningBoradcast/delBoradcastItem',
  getUuid: 'morningBoradcast/getUuid',
  delCeFile: 'morningBoradcast/delCeFile',
  uploaderFile: 'morningBoradcast/uploaderFile',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  creator: state.app.creator,
  morningBoradcast: state.morningBoradcast,
  dict: state.app.dict,
  newsListLoading: state.loading.effects['morningBoradcast/getBoradcastList'] || false,
});

const mapDispatchToProps = {
  getBoradcastList: fetchDataFunction(false, effects.getBoradcastList),
  saveBoradcast: fetchDataFunction(true, effects.saveBoradcast),
  getBoradcastDetail: fetchDataFunction(true, effects.getBoradcastDetail),
  delBoradcastItem: fetchDataFunction(true, effects.delBoradcastItem),
  getUuid: fetchDataFunction(false, effects.getUuid),
  delCeFile: fetchDataFunction(true, effects.delCeFile),
  uploaderFile: fetchDataFunction(true, effects.uploaderFile),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@Form.create()
@withRouter
export default class BroadcastList extends PureComponent {
  static propTypes = {
    creator: PropTypes.string.isRequired,
    morningBoradcast: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    newsListLoading: PropTypes.bool.isRequired,
    getBoradcastList: PropTypes.func.isRequired,
    saveBoradcast: PropTypes.func.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
    delBoradcastItem: PropTypes.func.isRequired,
    getUuid: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    delCeFile: PropTypes.func.isRequired,
    uploaderFile: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
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
    const TO_DATE = moment().format(dateFormatStr);
    const FROM_DATE = moment().subtract(beforeM, 'months').format(dateFormatStr);
    const PAGE_NUM = 1;
    const PAGE_LEN = 20;
    return { TO_DATE, FROM_DATE, PAGE_NUM, PAGE_LEN };
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      open: false,
      newsId: -1,
    };
  }

  componentDidMount() {
    const {
      morningBoradcast: { boradcastList, newUuid },
      getUuid,
      location: { query: { isInit } },
    } = this.props;
    const { onHandleGetList } = this;
    // 如果当前每日播报列表中没有数据则去获取
    if (!boradcastList || !boradcastList.length || isInit === true) {
      onHandleGetList(null, true);
    }
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

  componentDidUpdate(prevProps) {
    const {
      morningBoradcast: { boradcastList },
    } = prevProps;
    // 列表数据刷新后返回fsp顶部
    if (boradcastList !== this.props.morningBoradcast.boradcastList) {
      fsp.scrollToTop();
    }
  }

  // 刷新列表数据
  @autobind
  onHandleGetList(option, initList) {
    const { getBoradcastList, replace, location: { pathname } } = this.props;
    const { TO_DATE, FROM_DATE, PAGE_NUM, PAGE_LEN } = BroadcastList.initNewsListQuery();
    const { pagination, newsListQuery } = this.props.morningBoradcast;
    const { defaultCurrent, defaultPageSize } = pagination;
    let definedQuery = {
      createdFrom: FROM_DATE,
      createdTo: TO_DATE,
      pageNum: PAGE_NUM,
      pageSize: PAGE_LEN,
      createdBy: '',
      title: '',
    };
    if (initList) {
      getBoradcastList(definedQuery);
      replace({ pathname });
    } else {
      definedQuery = {
        createdFrom: newsListQuery.FROM_DATE || FROM_DATE,
        createdTo: newsListQuery.TO_DATE || TO_DATE,
        pageNum: defaultCurrent || PAGE_NUM,
        pageSize: defaultPageSize || PAGE_LEN,
        createdBy: newsListQuery.CREATE_BY || '',
        title: newsListQuery.TITLE || '',
        ...option,
      };
      getBoradcastList(definedQuery);
    }
  }

  // 跳转至晨报详情
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '$args[0].title',
      subtype: '$args[0].newsTypValue',
    },
  })
  onHandleToDetail({ newsId }) {
    const { push } = this.props;
    const param = { id: 'RTC_TAB_NEWS_LIST', title: '晨报' };
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

  // table -->start
  @autobind
  onHandleTablecolumns() {
    const columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      className: 'tableTitle',
      width: '35%',
      align: 'left',
      render: (text, record, index) => {
        return (
          <span
            onClick={() => { this.onHandleToDetail(record); }}
            className={styles.textOverflow}
            style={{ cursor: 'pointer' }}
            title={text}
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
      align: 'left',
    }, {
      title: '创建日期',
      dataIndex: 'created',
      width: '15%',
      key: 'date',
      align: 'left',
    }, {
      title: '作者',
      dataIndex: 'createdBy',
      width: '15%',
      className: 'tableAuthor',
      key: 'author',
      align: 'left',
      render: (text, record) => record.updatedBy || record.createdBy,
    }];
    if (permission.hasZXMampPermission()) {
      columns.push({
        title: '操作',
        key: 'action',
        dataIndex: 'newsId',
        width: '6%',
        className: 'tableAction',
        align: 'left',
        render: newsId => (
          <span>
            <span onClick={() => { this.showModal(newsId); }}><Icon className="edit" type="edit" /></span>
            <Popconfirm
              title="确定删除?"
              onConfirm={() => this.onDelItem(newsId)}
              cancelText="取消"
              okText="确定"
            >
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
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '删除晨报',
    },
  })
  onDelItem(newsId) {
    const { delBoradcastItem } = this.props;
    delBoradcastItem({ newsId });
  }
  // table -->end

  // Search -->start
  @autobind()
  onHandleSearch() {
    const { onHandleGetList } = this;
    onHandleGetList({
      ...this.formQuery(),
      pageNum: 1,
    });
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '创建时间',
      min: '$args[0]',
      max: '$args[1]',
    },
  })
  handleDateChange(startDate, endDate) {
    const { onHandleGetList } = this;
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      createdTime: [startDate, endDate],
    });
    onHandleGetList({
      ...this.formQuery(),
      pageNum: 1,
      createdFrom: startDate,
      createdTo: endDate,
    });
  }
  // 日期选择组件-->end

  // 日期选择组件-->start
  @autobind()
  disabledDate(startValue) {
    const { TO_DATE } = BroadcastList.initNewsListQuery();
    return startValue &&
      startValue.valueOf() > moment(TO_DATE).valueOf();
  }

  @autobind()
  @logable({ type: 'Click', payload: { name: '搜索作者' } })
  handleSearchAuthority() {
    this.onHandleSearch();
  }

  @autobind()
  @logable({ type: 'Click', payload: { name: '搜索标题' } })
  handleSearchHeadline() {
    this.onHandleSearch();
  }
  // Search -->end

  // Model(晨报新增、修改) --> start
  @autobind()
  @logPV({ pathname: '/modal/createModal', title: '晨报新增或修改' })
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
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  // Model(晨报新增、修改) --> end
  @autobind
  formQuery() {
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    return {
      createdBy: values.createdBy,
      title: values.title,
      createdFrom: values.createdTime[0],
      createdTo: values.createdTime[1],
    };
  }

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
      getUuid,
      delCeFile,
      getBoradcastDetail,
      dict,
      uploaderFile,
      creator,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { FROM_DATE, TO_DATE, TITLE, CREATE_BY } = newsListQuery;
    const { visible, newsId } = this.state;
    const newBoradcastList = _.map(boradcastList, item => ({ ...item, key: `${item.newsId}` }));
    const paginationOption = {
      ...pagination,
      onChange: this.onPageNumChange,
      onShowSizeChange: this.onPageSizeChange,
    };
    return (
      <div className={styles.broadcastListWrap} >
        <Affix>
          <div className={styles.header}>
            <div>
              <div className={styles.author}>
                <span>作者：</span>
                {getFieldDecorator('createdBy', {
                  initialValue: CREATE_BY,
                })(
                  <Search
                    placeholder="作者"
                    style={{ width: 200 }}
                    onSearch={this.handleSearchAuthority}
                    enterButton
                  />,
                )}
              </div>
              <div className={styles.timeRange}>
                {/* 此处原来用antd-RangePicker组件,包在antd的Form里， */}
                {/* 现在替换成DateRangePick组件，由于新组件不支持antdForm， */}
                {/* 在不影响原代码逻辑下， DateRangePick触发onChange的时候手动执行this.props.form.setFieldsValue */}
                {/* 把DateRangePick传出的值更新到formData里去， */}
                {/* 但是由于formData里的“createdTime”值必须要初始化才能对它使用setFieldsValue */}
                {/* 所以此处用一个Input type='hidden' 用来初始化formData的‘createdTime’值 */}
                {getFieldDecorator('createdTime')(
                  <Input type="hidden" />,
                )}
                <span>创建时间：</span>
                <DateRangePick
                  filterValue={[FROM_DATE, TO_DATE]}
                  filterName=""
                  onChange={date => this.handleDateChange(date.value[0], date.value[1])}
                  disabledStart={startDate => this.disabledDate(startDate)}
                  disabledEnd={(startDate, endDate) => this.disabledDate(endDate)}
                  disabledRange={SIX_MONTH_DAYS}
                />
              </div>
            </div>
            <div>
              {getFieldDecorator('title', {
                initialValue: TITLE,
              })(
                <Search
                  placeholder="标题关键词"
                  style={{ width: 200 }}
                  onSearch={this.handleSearchHeadline}
                  enterButton
                />,
              )}
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
                creator={creator}
                uploaderFile={uploaderFile}
                visible={visible}
                newsId={newsId}
                newUuid={newUuid}
                delCeFile={delCeFile}
                delSourceFile={delSourceFile}
                saveboradcastInfo={saveboradcastInfo}
                boradcastDetail={boradcastDetail}
                saveBoradcast={saveBoradcast}
                getBoradcastDetail={getBoradcastDetail}
                getUuid={getUuid}
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
              pagination={false}
            />
            <Pagination {...paginationOption} />
          </div>
        </div>
      </div>
    );
  }
}
