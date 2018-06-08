/**
 * @file components/feedback/RemarkList.js
 *  处理记录
 * @author yangquanjian
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Table } from 'antd';
import _ from 'lodash';

import { request } from '../../config';
import Icon from '../common/Icon';
import styles from './remarkList.less';

const EMPTY_LIST = [];
export default class RemarkList extends PureComponent {
  static propTypes = {
    remarkList: PropTypes.array.isRequired,
    className: PropTypes.string,
    category: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    category: 'admin',
  }

  constructor(props) {
    super(props);
    const { remarkList = EMPTY_LIST } = props;
    this.state = {
      dataSource: remarkList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { remarkList: nextList = EMPTY_LIST } = nextProps;
    const { remarkList: prevList = EMPTY_LIST } = this.props;
    if (nextList !== prevList) {
      this.setState({
        dataSource: nextList,
      });
    }
  }

  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'title.description',
      width: '100%',
      render: (text, record) => {
        const { category } = this.props;
        const { attachModelList = [] } = record;
        const hasAttachment = category !== 'admin' && !_.isEmpty(attachModelList);

        // 当前行记录
        return (
          <div className={styles.item}>
            <div className={styles.wrap}>
              <div className={styles.info}>
                <span>{record.title}</span>
              </div>
              <pre className={styles.txt}>
                {record.description}
              </pre>
              {
                hasAttachment ? (
                  <div className={styles.attachContainer}>
                    {this.renderAttachmentList(attachModelList)}
                  </div>
                ) : null
              }
            </div>
          </div>
        );
      },
    }];
    return columns;
  }

  renderAttachmentList(list) {
    return (
      _.map(
        list,
        item => (
          <div className={styles.attachItem}>
            <a href={`${request.prefix}/file/${item.attachUrl}`}>
              <Icon type={'kehu1'} />{`${item.attachName}`}
            </a>
          </div>
        ),
      )
    );
  }

  render() {
    const columns = this.constructTableColumns();
    const { className } = this.props;
    return (
      <Table
        rowKey={'id'}
        className={classnames(
          styles.recordList,
          { [className]: !!className },
        )}
        columns={columns}
        dataSource={this.state.dataSource}
        showHeader={false}
        pagination={false}
        bordered={false}
      />
    );
  }
}
