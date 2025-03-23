export const startListening = (eventName: string, listener: EventListener) => {
  document.addEventListener(eventName, listener);
}

export const stopListening = (eventName: string, listener: EventListener) => {
  document.removeEventListener(eventName, listener);
}

export const triggerEvent = (eventName: string) => {
  const event = new Event(eventName);
  document.dispatchEvent(event);
}
