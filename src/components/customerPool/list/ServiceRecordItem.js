// import React, { PropTypes } from 'react';
import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from '../../common/Icon';
import styles from './createCollapse.less';
import { request } from '../../../config';
import { helper } from '../../../utils';

const EMPTY_OBJECT = {};

export default class ServiceRecordItem extends PureComponent {
  static propTypes = {
    content: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    executeTypes: PropTypes.array,
    isShowChild: PropTypes.bool,
    files: PropTypes.string,
    onDown: PropTypes.func.isRequired,
    filesList: PropTypes.array,
  }
  static defaultProps = {
    content: '--',
    title: '--',
    type: 'left',
    executeTypes: [],
    isShowChild: false,
    files: '',
    filesList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      filesListData: [],
      isFile: false, // 用于判断 isFollows更改
    };
  }

  componentWillReceiveProps(nextProps) {
    const { filesList: prevFileList } = this.props;
    const { filesList: nextFileList } = nextProps;
    if (prevFileList !== nextFileList) {
      this.setState({
        filesListData: nextFileList,
        isFile: true,
      });
    }
  }
  componentDidUpdate() {
    // const { filesList } = this.props;
    const { isFile, filesListData } = this.state;
    console.warn('filesListData-->', filesListData);
    // 在此以isEmail判断是否是isFollows更新渲染完成
    if (!_.isEmpty(filesListData) && isFile) {
      // 模拟 fsp '#workspace-content>.wrapper' 上的鼠标mousedown事件
      helper.trigger(this.sendEmail, 'click', false, false);
    }
  }

  render() {
    const { title, type, content, executeTypes, isShowChild, files, onDown } = this.props;
    const { filesListData } = this.state;
    console.log(filesListData[0]);
    let newContent = content;
    if (!_.isEmpty(executeTypes)) {
      // 当前为执行方式
      // [{key: "Chance", value: "选做"},
      // {key: "Mission", value: "必做"}]
      newContent = _.find(executeTypes, item => item.key === content) || EMPTY_OBJECT;
      newContent = newContent.value;
    }
    //  href={`${request.prefix}/file/ceFileDownload?attachId=${newContent}&empId=${helper.getEmpId()}&filename=${files}`}
    return (
      <div
        className={classnames({
          [styles.leftModule]: type === 'left',
          [styles.rightModule]: type === 'right',
        })}
      >
        <span>{title || '--'}</span>
        {
          isShowChild ?
            <span title={newContent} onClick={() => onDown(newContent)}><Icon type="excel" className={styles.excel} />
              <a
                className={styles.seeCust}
                ref={ref => this.sendEmail = ref}
                
              >{'我的附件'}</a>
            </span>
            :
            <span title={newContent}>{newContent || '--'}</span>
        }

      </div>
    );
  }
}
