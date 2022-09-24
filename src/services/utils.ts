const loadingOverlayID = "vis-loading-overlay";
export const enableLoadingOverlay = (targetID?: string) => {
  let style =
    "top: 0; left: 0;z-index: 10000;height: 100%;width: 100%;cursor: progress;";
  const overlayElement = document.createElement("div");
  overlayElement.id = loadingOverlayID;

  let target: HTMLElement | null;
  if (targetID) {
    target = document.getElementById(targetID);
    if (!target) {
      console.error(
        `Loading Overlay: Unable to locate element \"${targetID}\"`
      );
      return;
    }
    target.style.position = "relative";
    style += "position: absolute;";
  } else {
    target = document.body;
    style += "position: fixed;";
  }
  overlayElement.setAttribute("style", style);
  target.appendChild(overlayElement);
};

export const removeLoadingOverlay = () => {
  const overlayElement = document.getElementById(loadingOverlayID);
  overlayElement?.remove();
};

export const downloadTextFile = (filename: string, text: string) => {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
