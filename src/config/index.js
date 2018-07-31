import engine from 'store/src/store-engine';
import sessionStorage from 'store/storages/sessionStorage';
import cookieStorage from 'store/storages/cookieStorage';

import fspContainer from './fspContainer';
import constants from './constants';
import log from './log';
import menu from './menu';
import persist from './persist';
import request from './request';
import iconTypeMap from './iconTypeMap';
import optionsMap from './optionsMap';
import feedbackOptions from './feedbackOptions';
import reportAnchorOptions from './reportAnchorOptions';
import ZHUNICODE from './unicode';
import BoardBasic from './BoardBasic';
import customerOptionMap from './customerOptionMap';
import customerPoolBusiness from './customerPoolBusiness';
import scatterType from './scatterType';
import { responseCode, excludeCode } from './errorCode';
import permissionOptions from './permissionOptions';
import seibelConfig from './pageConfig';
import contract from './contract';
import fspRoutes from './fspRoutes';
import orgTreeLevel from './orgTreeLevel';
import padSightLabelDesc from './constructSightLabelDesc';
import createTaskEntry from './createTaskEntry';
import seperator from './filterSeperator';
import retTabParam from './retTabParam';

const sessionStore = engine.createStore([sessionStorage, cookieStorage]);

export default {
  constants,
  fspContainer,
  sessionStore,
  log,
  menu,
  persist,
  request,
  iconTypeMap,
  optionsMap,
  feedbackOptions,
  ZHUNICODE,
  BoardBasic,
  customerOptionMap,
  reportAnchorOptions,
  customerPoolBusiness,
  scatterType,
  responseCode,
  excludeCode,
  permissionOptions,
  seibelConfig,
  contract,
  fspRoutes,
  orgTreeLevel,
  padSightLabelDesc,
  createTaskEntry,
  seperator,
  retTabParam,
};
