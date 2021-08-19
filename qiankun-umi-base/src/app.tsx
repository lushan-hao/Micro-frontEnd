/*
 * @LastEditors: haols
 */
let isSubApp = false;
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    rootElement: isSubApp ? 'sub-root' : memo.rootElement,    
  };
}