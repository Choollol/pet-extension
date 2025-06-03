import { MessageType } from "@/utils/message-utils";
import { CURRENT_PET_NAME_KEY } from "@/utils/storage-keys";

export default defineBackground(() => {
  let activeTabId: number;
  let activeWindowId: number;
  let doesActiveTabHaveContentScript: boolean;
  let isUpdatingPetData = false;

  const updatePetData = async (newTabId: number) => {
    if (isUpdatingPetData) {
      return;
    }
    isUpdatingPetData = true;

    const didPreviousTabHaveContentScript = doesActiveTabHaveContentScript;

    try {
      await browser.tabs.sendMessage(newTabId, { type: MessageType.DISABLE_PET });
      doesActiveTabHaveContentScript = true;
    }
    catch (error) {
      doesActiveTabHaveContentScript = false;
    }
    try {
      await browser.tabs.get(activeTabId);
      if (didPreviousTabHaveContentScript && newTabId !== activeTabId) {
        await browser.tabs.sendMessage(activeTabId, { type: MessageType.STORE_PET_DATA });
      }
    }
    catch { /* Previous tab was deleted, no need to do anything */ }
    if (doesActiveTabHaveContentScript) {
      await browser.tabs.sendMessage(newTabId, { type: MessageType.LOAD_PET_DATA });
    }

    activeTabId = newTabId;

    isUpdatingPetData = false;
  }

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updatePetData(tabId);
  });

  browser.tabs.onActivated.addListener((activeInfo) => {
    updatePetData(activeInfo.tabId);
  });

  browser.windows.onFocusChanged.addListener(async (windowId: number) => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      if (doesActiveTabHaveContentScript) {
        await browser.tabs.sendMessage(activeTabId, { type: MessageType.DISABLE_PET });
      }
      updatePetData(tab.id!);
    }
  });

  browser.tabs.query({ active: true }).then(async ([tab]) => {
    activeTabId = tab.id!;
    activeWindowId = tab.windowId;
    try {
      await browser.tabs.sendMessage(tab.id!, { type: MessageType.CHECK_CONTENT_SCRIPT_EXISTENCE });
      doesActiveTabHaveContentScript = true;
    }
    catch {
      doesActiveTabHaveContentScript = false;
    }
  });

  storage.getItem(CURRENT_PET_NAME_KEY).then((storedPetName) => {
    if (!storedPetName) {
      storage.setItem(CURRENT_PET_NAME_KEY, DEFAULT_PET_NAME);
    }
  });
});
