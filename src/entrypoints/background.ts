import { MessageType } from "@/utils/message-utils";
import { CURRENT_PET_NAME_KEY } from "@/utils/storage-keys";

export default defineBackground(() => {
  let previousActiveTabId: number;
  browser.tabs.query({ active: true }).then(([tab]) => {
    previousActiveTabId = tab.id!;
  });

  const updatePetPosition = async () => {
    const [tab] = await browser.tabs.query({ active: true });
    browser.tabs.sendMessage(previousActiveTabId, { type: MessageType.STORE_PET_POSITION });
    browser.tabs.sendMessage(tab.id!, { type: MessageType.LOAD_PET_POSITION });
    previousActiveTabId = tab.id!;
  }

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updatePetPosition();
  });

  browser.tabs.onActivated.addListener(() => {
    updatePetPosition();
  });

  browser.tabs.onCreated.addListener((tab) => {
    updatePetPosition();
  });

  storage.setItem(CURRENT_PET_NAME_KEY, "Test Pet");

  console.log('Hello background!', { id: browser.runtime.id });
});
