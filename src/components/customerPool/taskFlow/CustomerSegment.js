/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 13:43:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-19 17:25:42
 * 客户细分组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import GroupTable from '../groupManage/GroupTable';
import Uploader from './Uploader';
import Button from '../../common/Button';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';
import styles from './customerSegment.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const COLUMN_WIDTH = 115;

export default class CustomerSegment extends PureComponent {
  static propTypes = {
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    // 保存数据方法
    storeData: PropTypes.func.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    saveDataEmitter: PropTypes.object.isRequired,
    onStepUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onPreview: () => { },
    storedData: {},
  };

  constructor(props) {
    super(props);
    const { storedData = EMPTY_OBJECT } = props;
    const { custSegment = EMPTY_OBJECT } = storedData;
    const { currentFile = {}, uploadedFileKey = '', originFileName = '' } = custSegment;
    this.state = {
      curPageNum: 1,
      curPageSize: 10,
      dataSource: EMPTY_LIST,
      totalRecordNum: 10,
      isShowTable: false,
      currentFile,
      uploadedFileKey,
      originFileName,
    };
  }

  componentWillMount() {
    const { saveDataEmitter } = this.props;
    saveDataEmitter.on('saveSelectCustData', this.handleSaveData);
  }

  componentWillReceiveProps(nextProps) {
    const {
      priviewCustFileData = EMPTY_LIST,
     } = this.props;
    const {
      priviewCustFileData: nextData = EMPTY_LIST,
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
  }

  componentWillUnmount() {
    const { saveDataEmitter } = this.props;
    saveDataEmitter.removeListener('saveSelectCustData', this.handleSaveData);
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
    const { currentFile = {}, uploadedFileKey = '', originFileName = '' } = lastFile;
    this.setState({
      currentFile,
      uploadedFileKey,
      originFileName,
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
  handleSaveData() {
    const { storeData, storedData, onStepUpdate } = this.props;
    const { currentFile, uploadedFileKey, originFileName } = this.state;
    storeData({
      ...storedData,
      custSegment: {
        currentFile,
        uploadedFileKey,
        originFileName,
      },
    });
    onStepUpdate();
  }

  @autobind
  handleCloseModal() {
    this.setState({
      isShowTable: false,
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
      currentFile,
      uploadedFileKey,
      originFileName,
    } = this.state;

    const scrollX = (columnSize * COLUMN_WIDTH);

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);

    return (
      <div className={styles.customerSegmentContainer}>
        <div className={styles.uploadSection}>
          <Uploader
            onOperateFile={this.handleFileUpload}
            onHandleOverview={this.handleShowMatchCustTable}
            attachModel={currentFile}
            fileKey={uploadedFileKey}
            onDeleteFile={this.handleDeleteFile}
            originFileName={originFileName}
          />
        </div>
        <div className={styles.tipSection}>
          注：支持从客户细分导出的Excel或CSV格式文件。文件第一列必须是客户号，第二列必须是客户名称。
        </div>
        {
          isShowTable ?
            <GroupModal
              // 为了每次都能打开一个新的modal
              visible={isShowTable}
              title={'客户预览'}
              okText={'提交'}
              okType={'primary'}
              onOkHandler={this.handleCloseModal}
              footer={
                <Button type="primary" size="default" onClick={this.handleCloseModal}>
                  确定
                </Button>
              }
              modalContent={
                <GroupTable
                  pageData={{
                    curPageNum,
                    curPageSize,
                    totalRecordNum,
                  }}
                  listData={newDataSource}
                  onSizeChange={this.handleShowSizeChange}
                  onPageChange={this.handlePageChange}
                  tableClass={styles.custListTable}
                  titleColumn={titleColumn}
                  isFixedColumn
                  // 前三列固定，如果太长，后面的就滚动
                  fixedColumn={[0, 1]}
                  // 列的总宽度加上固定列的宽度
                  scrollX={scrollX}
                  columnWidth={COLUMN_WIDTH}
                  bordered
                />
              }
            />
            : null
        }
      </div>
    );
  }
}
