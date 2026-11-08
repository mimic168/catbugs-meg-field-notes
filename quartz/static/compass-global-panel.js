// 星海羅盤：全域圖即時控制面板
(() => {
  const panelId = "compass-global-slider-panel";

  function updatePanel() {
    const graph = document.querySelector(".global-graph-outer.active");
    const expanded = !!graph;

    let panel = document.getElementById(panelId);

    if (!expanded) {
      if (panel) panel.style.display = "none";
      return;
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.id = panelId;

      Object.assign(panel.style, {
        position: "fixed",
        top: "100px",
        right: "300px",
        zIndex: "99999",
        background: "#20232B",
        color: "#E8EDF5",
        padding: "16px 20px",
        border: "1px solid #505766",
        borderRadius: "10px",
        boxShadow: "0 8px 24px #0008",
        fontFamily: "sans-serif"
      });

      panel.innerHTML = `
        <div style="margin-bottom:12px;font-weight:bold">
          ✦ 星海羅盤 · 局部控制
        </div>
        <label>
          連線距離：
          <span id="compass-global-distance-value">45</span>
        </label>
        <div style="margin-top:10px">
          <input
            id="compass-global-distance-slider"
            type="range"
            min="15"
            max="150"
            value="45"
            step="1"
            style="width:220px"
          >
        </div>
        <div style="margin-top:16px">
          <label>
            節點斥力：
            <span id="compass-global-repel-value">1.0</span>
          </label>
          <div style="margin-top:10px">
            <input
              id="compass-global-repel-slider"
              type="range"
              min="0"
              max="5"
              value="1"
              step="0.1"
              style="width:220px"
            >
          </div>
        </div>
        <div style="margin-top:16px">
          <label>
            節點大小：
            <span id="compass-global-scale-value">0.6</span>×
          </label>
          <div style="margin-top:10px">
            <input
              id="compass-global-scale-slider"
              type="range"
              min="0.2"
              max="2"
              value="0.6"
              step="0.1"
              style="width:220px"
            >
          </div>
        </div>
        <div style="margin-top:16px">
          <label>
            文字大小：
            <span id="compass-global-font-value">0.35</span>×
          </label>
          <div style="margin-top:10px">
            <input
              id="compass-global-font-slider"
              type="range"
              min="0.2"
              max="2"
              value="0.35"
              step="0.05"
              style="width:220px"
            >
          </div>
        </div>
      `;

      panel.addEventListener("click", (event) => event.stopPropagation());
  document.body.appendChild(panel);

      const slider = panel.querySelector("#compass-global-distance-slider");
      const value = panel.querySelector("#compass-global-distance-value");

      const repelSlider = panel.querySelector("#compass-global-repel-slider");
      const repelValue = panel.querySelector("#compass-global-repel-value");

      repelSlider.addEventListener("input", () => {
        repelValue.textContent = Number(repelSlider.value).toFixed(1);

        window.compassGraphControls
          ?.get("global")
          ?.setRepelForce(Number(repelSlider.value));
      });
      const scaleSlider = panel.querySelector("#compass-global-scale-slider");
      const scaleValue = panel.querySelector("#compass-global-scale-value");

      scaleSlider.addEventListener("input", () => {
        scaleValue.textContent = Number(scaleSlider.value).toFixed(1);

        window.compassGraphControls
          ?.get("global")
          ?.setNodeScale(Number(scaleSlider.value));
      });
      const fontSlider = panel.querySelector("#compass-global-font-slider");
      const fontValue = panel.querySelector("#compass-global-font-value");

      fontSlider.addEventListener("input", () => {
        fontValue.textContent = Number(fontSlider.value).toFixed(2);

        window.compassGraphControls
          ?.get("global")
          ?.setFontSize(Number(fontSlider.value));
      });
      const colorRow = document.createElement("div");
      colorRow.style.marginTop = "16px";
      colorRow.innerHTML = `
        <label style="display:flex;align-items:center;justify-content:space-between;gap:16px">
          <span>文字顏色</span>
          <input
            id="compass-global-font-color"
            type="color"
            value="#E8EDF5"
            style="width:54px;height:32px;cursor:pointer"
          >
        </label>
      `;

      const fadeRow = document.createElement("div");
      fadeRow.style.marginTop = "16px";
      fadeRow.innerHTML = `
        <label>
          文字透明度：
          <span id="compass-global-fade-value">0.00</span>
        </label>
        <div style="margin-top:10px">
          <input
            id="compass-global-fade-slider"
            type="range"
            min="-3"
            max="3"
            value="0"
            step="0.05"
            style="width:220px"
          >
        </div>
      `;

      const fadeSlider = fadeRow.querySelector("#compass-global-fade-slider");
      const fadeValue = fadeRow.querySelector("#compass-global-fade-value");

      fadeSlider.addEventListener("input", () => {
        const value = Number(fadeSlider.value);
        fadeValue.textContent = value.toFixed(2);

        window.compassGraphControls
          ?.get("global")
          ?.setTextFade(value);
      });

      panel.appendChild(fadeRow);
      panel.appendChild(colorRow);

      const fontColor = colorRow.querySelector("#compass-global-font-color");

      fontColor.addEventListener("input", () => {
        window.compassGraphControls
          ?.get("global")
          ?.setFontColor(fontColor.value);
      });
      slider.addEventListener("input", () => {
        value.textContent = slider.value;

        window.compassGraphControls
          ?.get("global")
          ?.setLinkDistance(Number(slider.value));
      });
    }

    const outer = graph.querySelector(".global-graph-container");
    const closeButton = null;

    if (outer) {
      const rect = outer.getBoundingClientRect();
      const buttonRect = closeButton?.getBoundingClientRect();

      panel.style.left = "auto";

      panel.style.right = Math.max(
        8,
        window.innerWidth - rect.right + 12
      ) + "px";

      panel.style.top = (
        rect.top + 40
      ) + "px";

      panel.style.maxHeight = Math.max(
        120,
        rect.bottom - parseFloat(panel.style.top) - 12
      ) + "px";

      panel.style.overflowY = "auto";
    }

    panel.style.display = "block";
  }

  window.addEventListener("resize", () => {
    requestAnimationFrame(updatePanel);
  });

  const observer = new MutationObserver(() => {
    requestAnimationFrame(updatePanel);
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"]
  });

  document.addEventListener("nav", () => {
    requestAnimationFrame(updatePanel);
  });

  requestAnimationFrame(updatePanel);
})();
