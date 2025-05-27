import { MessageType } from "@/utils/message-utils";
import { CURRENT_PET_NAME_KEY } from "@/utils/storage-keys";

export default defineBackground(() => {
  let activeTabId: number;
  let doesActiveTabHaveContentScript: boolean;
  let isUpdatingPetData = false;

  const updatePetData = async (tabId: number) => {
    if (isUpdatingPetData) {
      return;
    }
    isUpdatingPetData = true;

    const didPreviousTabHaveContentScript = doesActiveTabHaveContentScript;

    try {
      await browser.tabs.sendMessage(tabId, { type: MessageType.DISABLE_PET });
      doesActiveTabHaveContentScript = true;
    }
    catch {
      doesActiveTabHaveContentScript = false;
    }
    try {
      await browser.tabs.get(activeTabId);
      if (didPreviousTabHaveContentScript && tabId !== activeTabId) {
        await browser.tabs.sendMessage(activeTabId, { type: MessageType.STORE_PET_DATA });
      }
    }
    catch { /* Previous tab was deleted, no need to do anything */ }
    if (doesActiveTabHaveContentScript) {
      await browser.tabs.sendMessage(tabId, { type: MessageType.LOAD_PET_DATA });
    }

    activeTabId = tabId;

    isUpdatingPetData = false;
  }

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updatePetData(tabId);
  });

  browser.tabs.onActivated.addListener((activeInfo) => {
    updatePetData(activeInfo.tabId);
  });

  browser.tabs.query({ active: true }).then(async ([tab]) => {
    activeTabId = tab.id!;
    try {
      await browser.tabs.sendMessage(tab.id!, { type: MessageType.CHECK_CONTENT_SCRIPT_EXISTENCE });
      doesActiveTabHaveContentScript = true;
    }
    catch {
      doesActiveTabHaveContentScript = false;
    }
  });

  storage.setItem(CURRENT_PET_NAME_KEY, DEFAULT_PET_NAME);
});
