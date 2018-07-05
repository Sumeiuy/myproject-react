/**
 * Created By K0170179 on 2018/1/11
 * 单前目录资源
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import PerformanceIndicatorsNew from './PerformanceIndicators__';
import PerformanceIndicatorsOld from './PerformanceIndicators';
import { env } from '../../../helper';

export const PerformanceIndicators = env.isGrayFlag() ?
  PerformanceIndicatorsNew : PerformanceIndicatorsOld;
export { default as MorningBroadcast } from './MorningBroadcast';
export { default as ToBeDone } from './ToBeDone';
export { default as Viewpoint } from './Viewpoint';
export { default as TabsExtra } from './TabsExtra';
export { default as Search } from './Search';
export { default as LabelModal } from './LabelModal';
