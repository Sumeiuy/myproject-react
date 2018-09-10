import apiCreator from './apiCreator';
import request from './request';
import * as sagaEffects from './sagaEffects';
import {
  dispatchTabPane,
  openRctTab,
  openFspTab,
  openInTab,
  closeRctTab,
  closeFspTab,
  removeTab,
  navToTab,
  navTo,
  linkTo,
  saveTabUrl,
  openFspIframeTab,
} from './controlPane';

import initFspMethod from './initFspMethod';
import fspGlobal from './fspGlobal';

const exported = {
  apiCreator,
  request,
  sagaEffects,
  initFspMethod,
  fspGlobal,
  dispatchTabPane,
  openRctTab,
  openFspTab,
  closeRctTab,
  closeFspTab,
  removeTab,
  openInTab,
  navToTab,
  navTo,
  linkTo,
  saveTabUrl,
  openFspIframeTab,
};

export default exported;
export {
  apiCreator,
  request,
  sagaEffects,
  initFspMethod,
  fspGlobal,
  dispatchTabPane,
  openRctTab,
  openFspTab,
  closeRctTab,
  closeFspTab,
  removeTab,
  openInTab,
  navToTab,
  navTo,
  linkTo,
  saveTabUrl,
  openFspIframeTab,
};
