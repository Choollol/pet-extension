import { MessageType } from "@/utils/message-utils";
import { CURRENT_PET_NAME_KEY } from "@/utils/storage-keys";

export default defineBackground(() => {
  let activeTabId: number;
  let doesActiveTabHaveContentScript: boolean;

  const updatePetData = async () => {
    const [tab] = await browser.tabs.query({ active: true });

    const didPreviousTabHaveContentScript = doesActiveTabHaveContentScript;

    try {
      await browser.tabs.sendMessage(tab.id!, { type: MessageType.DISABLE_PET });
      doesActiveTabHaveContentScript = true;
    }
    catch {
      doesActiveTabHaveContentScript = false;
    }
    if (didPreviousTabHaveContentScript) {
      await browser.tabs.sendMessage(activeTabId, { type: MessageType.STORE_PET_DATA });
    }
    if (doesActiveTabHaveContentScript) {
      await browser.tabs.sendMessage(tab.id!, { type: MessageType.LOAD_PET_DATA });
    }

    activeTabId = tab.id!;
  }

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updatePetData();
  });

  browser.tabs.onActivated.addListener(() => {
    updatePetData();
  });

  browser.tabs.onCreated.addListener((tab) => {
    updatePetData();
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
