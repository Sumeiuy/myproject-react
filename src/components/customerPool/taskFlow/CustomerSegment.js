/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 13:43:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-18 15:46:08
 * 客户细分组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import GroupTable from '../groupManage/GroupTable';
import Uploader from './Uploader';
import { steps, custSelectType } from '../../../config';
import tableStyles from '../groupManage/groupTable.less';
import styles from './customerSegment.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const COLUMN_WIDTH = 140;

export default class CustomerSegment extends PureComponent {
  static propTypes = {
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    // 是否需要恢复数据
    isRestoreData: PropTypes.bool.isRequired,
    // 是否需要保存数据
    isStoreData: PropTypes.bool.isRequired,
    // 保存数据方法
    storeData: PropTypes.func.isRequired,
    // 恢复数据方法
    restoreData: PropTypes.func.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    // 步骤更新回调
    onStepUpdate: PropTypes.func.isRequired,
    // replace
    replace: PropTypes.func.isRequired,
    // location
    location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onPreview: () => { },
    storedData: {},
  };

  constructor(props) {
    super(props);
    const { isRestoreData, storedData } = props;
    let attachModel = {};
    let fileKey;
    if (isRestoreData) {
      // 恢复数据
      attachModel = storedData.attachModel;
      fileKey = storedData.fileKey;
    }
    this.state = {
      curPageNum: 1,
      curPageSize: 10,
      dataSource: EMPTY_LIST,
      totalRecordNum: 10,
      isShowTable: false,
      currentFile: attachModel,
      uploadedFileKey: fileKey,
      attachModel,
      fileKey,
    };
  }

  componentWillMount() {
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        // 页面初始化时，恢复option
        isStoreData: 'N',
        step: steps[1].key,
        type: custSelectType[0].key,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      priviewCustFileData = EMPTY_LIST,
      isRestoreData,
      isStoreData,
      // storeData,
      // restoreData,
      storedData,
      onStepUpdate,
      replace,
      location: { query, pathname, state },
     } = this.props;
    const {
      priviewCustFileData: nextData = EMPTY_LIST,
      isRestoreData: nextIsRestoreData,
      isStoreData: nextIsStoreData,
     } = nextProps;
    const { custInfos = EMPTY_LIST } = priviewCustFileData;
    const { custInfos: nextInfos = EMPTY_LIST, page: nextPage = EMPTY_OBJECT } = nextData;
    const { totalCount: nextTotalCount, pageNum, pageSize } = nextPage;
    if (custInfos !== nextInfos) {
      // 展示预览数据
      const columns = _.head(nextInfos);
      this.setState({
        totalRecordNum: nextTotalCount,
        curPageNum: pageNum,
        curPageSize: pageSize,
        titleColumn: this.renderColumnTitle(columns),
        dataSource: this.renderDataSource(columns, _.drop(nextInfos)),
        isShowTable: true,
        columnSize: _.size(columns),
      });
    }

    if (isStoreData !== nextIsStoreData || isStoreData) {
      const { currentFile, uploadedFileKey } = this.state;
      replace({
        pathname,
        query: {
          ...query,
          isStoreData: nextIsStoreData ? 'Y' : 'N',
          // 第二步
          step: steps[1].key,
          // 客户细分
          type: custSelectType[0].key,
        },
        state: {
          ...state,
          data: { attachModel: currentFile, fileKey: uploadedFileKey },
        },
      });

      onStepUpdate({
        type: 'next',
      });
    }

    if (isRestoreData !== nextIsRestoreData || isRestoreData) {
      // 恢复数据
      const {
        attachModel,
        fileKey,
      } = storedData;
      this.setState({
        attachModel,
        currentFile: attachModel,
        fileKey,
      });
    }
  }

  @autobind
  handleShowMatchCustTable(uploadedFileKey) {
    // 已经上传的file key
    // 用来预览客户列表时，用
    const { onPreview } = this.props;
    const { curPageNum, curPageSize, fileKey } = this.state;
    this.setState({
      uploadedFileKey: uploadedFileKey || fileKey,
    });
    onPreview({ uploadKey: uploadedFileKey, pageNum: curPageNum, pageSize: curPageSize });
  }

  /**
   * @param {*} result 本次上传结果
   */
  @autobind
  handleFileUpload(lastFile) {
    // 当前上传的file
    const { currentFile = {}, uploadedFileKey = '' } = lastFile;
    this.setState({
      currentFile,
      uploadedFileKey,
    });
  }

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    const { uploadedFileKey } = this.state;
    const { onPreview } = this.props;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    // 预览数据
    onPreview({
      uploadKey: uploadedFileKey,
      pageNum: nextPage,
      pageSize: currentPageSize,
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    const { uploadedFileKey } = this.state;
    const { onPreview } = this.props;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    // 预览数据
    onPreview({
      uploadKey: uploadedFileKey,
      pageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, (item, index) => _.merge(item, { id: index }));
    }

    return [];
  }

  handleTabChange(key) {
    console.log(key);
  }

  @autobind
  handleDeleteFile() {
    this.setState({
      isShowTable: false,
      uploadedFileKey: '',
    });
  }

  @autobind
  renderDataSource(column, data) {
    const dataSource = _.map(data, (item) => {
      const rowData = {};
      return _.merge(rowData, _.fromPairs(_.map(item, (itemData, index) => { // eslint-disable-line
        return [column[index], itemData];
      })));
    });
    return dataSource;
  }

  renderColumnTitle(columns) {
    // "custName":"1-5TTJ-3900",
    // "custId":"118000119822",
    // "levelName":"钻石",
    // "riskLevelName":"稳定"

    // 随着导入表格列的变化而变化
    return _.map(columns, item => ({
      key: item,
      value: item,
    }));
  }

  render() {
    const {
      curPageNum = 1,
      curPageSize = 10,
      dataSource = EMPTY_LIST,
      totalRecordNum,
      isShowTable,
      titleColumn,
      columnSize,
      attachModel,
      fileKey,
    } = this.state;

    const scrollX = ((columnSize + 1) * COLUMN_WIDTH);

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <div className={styles.customerSegmentContainer}>
        <div className={styles.uploadSection}>
          <Uploader
            onOperateFile={this.handleFileUpload}
            onHandleOverview={this.handleShowMatchCustTable}
            attachModel={attachModel}
            fileKey={fileKey}
            onDeleteFile={this.handleDeleteFile}
          />
        </div>
        <div className={styles.tipSection}>
          注：支持从客户细分导出的Excel或CSV格式文件。文件第一列必须是客户号，第二列必须是客户名称。
        </div>
        <div className={styles.tableSection}>
          {
            isShowTable ?
              <div className={styles.title}>共匹配到<span>{totalRecordNum}</span>客户</div> : null
          }
          {
            isShowTable ?
              <GroupTable
                pageData={{
                  curPageNum,
                  curPageSize,
                  totalRecordNum,
                }}
                listData={newDataSource}
                onSizeChange={this.handleShowSizeChange}
                onPageChange={this.handlePageChange}
                tableClass={
                  classnames({
                    [tableStyles.groupTable]: true,
                    [styles.custListTable]: true,
                  })
                }
                titleColumn={titleColumn}
                isFixedColumn={false}
                // 前三列固定，如果太长，后面的就滚动
                fixedColumn={[0, 1, 2]}
                // 列的总宽度加上固定列的宽度
                scrollX={scrollX}
                columnWidth={COLUMN_WIDTH}
                isFirstColumnLink={false}
                bordered
              /> : null
          }
        </div>
      </div>
    );
  }
}
