(() => {
  function initGraphButtons() {
    document.querySelectorAll(".graph").forEach((graph) => {
      const originalButton = graph.querySelector(".global-graph-icon");
      const localContainer = graph.querySelector(".graph-container");
      const globalOverlay = graph.querySelector(".global-graph-outer");

      if (!originalButton || !localContainer || !globalOverlay) return;
      if (graph.dataset.compassInitialized === "true") return;

      graph.dataset.compassInitialized = "true";

      // 保留原本的全域圖按鈕，移到圖框下方
      const globalButton = originalButton.cloneNode(true);
      globalButton.className = "compass-global-button";
      globalButton.textContent = "✦ 展開全域星海羅盤圖";
      globalButton.setAttribute("aria-label", "展開全域星海羅盤");

      graph.querySelector(".graph-outer").after(globalButton);

      // 使用原本 Graph 插件的全域圖開啟功能
      globalButton.addEventListener("click", (event) => {
        event.stopPropagation();

        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "g",
            ctrlKey: true,
            bubbles: true,
          })
        );
      });

      // 原本右上角按鈕改成局部圖放大
      originalButton.setAttribute("aria-label", "展開局部關聯圖");
      originalButton.setAttribute("title", "展開局部關聯圖");

      // 攔截右上角的點擊，不觸發原本的全域圖
      originalButton.addEventListener(
        "click",
        (event) => {
          if (event.isTrusted === false) return;
          event.stopImmediatePropagation();

          const isExpanded = graph.classList.toggle("compass-local-expanded");

      originalButton.setAttribute(
        "aria-label",
        isExpanded ? "縮小局部關聯圖" : "展開局部關聯圖"
      );

// 保存原本的局部圖設定
if (!localContainer.dataset.originalCfg) {
  localContainer.dataset.originalCfg = localContainer.dataset.cfg;
}

const originalCfg = JSON.parse(localContainer.dataset.originalCfg);

if (isExpanded) {
  localContainer.dataset.cfg = JSON.stringify({
    ...originalCfg,
linkDistance: 55,
repelForce: 1.2,
fontSize: 0.4,
opacityScale: 1.5,
nodeScale: 0.5,
  });
} else {
  localContainer.dataset.cfg = localContainer.dataset.originalCfg;
}

// 等待視窗尺寸更新，再重新繪製
requestAnimationFrame(() => {
  document.dispatchEvent(new Event("render"));

  if (isExpanded) {
const zoomWhenReady = () => {
  const canvas = localContainer.querySelector("canvas");

  if (!canvas) {
    requestAnimationFrame(zoomWhenReady);
    return;
  }

  const rect = canvas.getBoundingClientRect();

  canvas.dispatchEvent(
    new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      deltaY: -549.3,
      deltaMode: 0,
    })
  );
};

requestAnimationFrame(zoomWhenReady);
  }
});
        },
        true
      );
    });
  }

  // 星海羅盤：局部圖沿用全域圖的外部點擊判斷方式
  document.addEventListener("click", (event) => {
    const graph = document.querySelector(".graph.compass-local-expanded");
    if (!graph) return;

    const insideGraph = event.target.closest(".graph-outer");
    const onButton = event.target.closest(".global-graph-icon");
    const insidePanel = event.target.closest("#compass-local-slider-panel");

    if (insideGraph || onButton || insidePanel) return;

    graph.classList.remove("compass-local-expanded");

    // 與右上角按鈕相同：還原原始設定並重新繪製
    const localContainer = graph.querySelector(".graph-container");

    if (localContainer?.dataset.originalCfg) {
      localContainer.dataset.cfg = localContainer.dataset.originalCfg;
    }

    requestAnimationFrame(() => {
      document.dispatchEvent(new Event("render"));
    });

    const button = graph.querySelector(".global-graph-icon");
    if (button) {
      button.setAttribute("aria-label", "展開局部關聯圖");
      button.setAttribute("title", "展開局部關聯圖");
    }
  });

  // 星海羅盤：Esc 收合局部圖
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    // 全域圖開啟時，優先交給 Quartz 原生功能
    if (document.querySelector(".global-graph-outer.active")) return;

    const graph = document.querySelector(".graph.compass-local-expanded");
    if (!graph) return;

    graph.classList.remove("compass-local-expanded");

    // 還原局部圖設定
    const localContainer = graph.querySelector(".graph-container");

    if (localContainer?.dataset.originalCfg) {
      localContainer.dataset.cfg = localContainer.dataset.originalCfg;
    }

    // 重新繪製，避免縮小後變成黑畫面
    requestAnimationFrame(() => {
      document.dispatchEvent(new Event("render"));
    });

    const button = graph.querySelector(".global-graph-icon");

    if (button) {
      button.setAttribute("aria-label", "展開局部關聯圖");
      button.setAttribute("title", "展開局部關聯圖");
    }
  });

  document.addEventListener("DOMContentLoaded", initGraphButtons);
  document.addEventListener("nav", initGraphButtons);

  if (document.readyState !== "loading") {
    initGraphButtons();
  }
})();


// 星海羅盤：局部圖即時控制面板
(() => {
  const panelId = "compass-local-slider-panel";

  function updatePanel() {
    const graph = document.querySelector(".graph.compass-local-expanded") ?? document.querySelector(".graph");
    const expanded = graph?.classList.contains("compass-local-expanded");

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
          <span id="compass-local-distance-value">45</span>
        </label>
        <div style="margin-top:10px">
          <input
            id="compass-local-distance-slider"
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
            <span id="compass-local-repel-value">1.0</span>
          </label>
          <div style="margin-top:10px">
            <input
              id="compass-local-repel-slider"
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
            <span id="compass-local-scale-value">0.6</span>×
          </label>
          <div style="margin-top:10px">
            <input
              id="compass-local-scale-slider"
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
            <span id="compass-local-font-value">0.35</span>×
          </label>
          <div style="margin-top:10px">
            <input
              id="compass-local-font-slider"
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

      document.body.appendChild(panel);

      const slider = panel.querySelector("#compass-local-distance-slider");
      const value = panel.querySelector("#compass-local-distance-value");

      const repelSlider = panel.querySelector("#compass-local-repel-slider");
      const repelValue = panel.querySelector("#compass-local-repel-value");

      repelSlider.addEventListener("input", () => {
        repelValue.textContent = Number(repelSlider.value).toFixed(1);

        window.compassGraphControls
          ?.get("local")
          ?.setRepelForce(Number(repelSlider.value));
      });
      const scaleSlider = panel.querySelector("#compass-local-scale-slider");
      const scaleValue = panel.querySelector("#compass-local-scale-value");

      scaleSlider.addEventListener("input", () => {
        scaleValue.textContent = Number(scaleSlider.value).toFixed(1);

        window.compassGraphControls
          ?.get("local")
          ?.setNodeScale(Number(scaleSlider.value));
      });
      const fontSlider = panel.querySelector("#compass-local-font-slider");
      const fontValue = panel.querySelector("#compass-local-font-value");

      fontSlider.addEventListener("input", () => {
        fontValue.textContent = Number(fontSlider.value).toFixed(2);

        window.compassGraphControls
          ?.get("local")
          ?.setFontSize(Number(fontSlider.value));
      });
      const colorRow = document.createElement("div");
      colorRow.style.marginTop = "16px";
      colorRow.innerHTML = `
        <label style="display:flex;align-items:center;justify-content:space-between;gap:16px">
          <span>文字顏色</span>
          <input
            id="compass-local-font-color"
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
          <span id="compass-local-fade-value">0.00</span>
        </label>
        <div style="margin-top:10px">
          <input
            id="compass-local-fade-slider"
            type="range"
            min="-3"
            max="3"
            value="0"
            step="0.05"
            style="width:220px"
          >
        </div>
      `;

      const fadeSlider = fadeRow.querySelector("#compass-local-fade-slider");
      const fadeValue = fadeRow.querySelector("#compass-local-fade-value");

      fadeSlider.addEventListener("input", () => {
        const value = Number(fadeSlider.value);
        fadeValue.textContent = value.toFixed(2);

        window.compassGraphControls
          ?.get("local")
          ?.setTextFade(value);
      });

      panel.appendChild(fadeRow);
      panel.appendChild(colorRow);

      const fontColor = colorRow.querySelector("#compass-local-font-color");

      fontColor.addEventListener("input", () => {
        window.compassGraphControls
          ?.get("local")
          ?.setFontColor(fontColor.value);
      });
      slider.addEventListener("input", () => {
        value.textContent = slider.value;

        window.compassGraphControls
          ?.get("local")
          ?.setLinkDistance(Number(slider.value));
      });
    }

    const outer = graph.querySelector(".graph-outer");
    const closeButton = graph.querySelector(".global-graph-icon");

    if (outer) {
      const rect = outer.getBoundingClientRect();
      const buttonRect = closeButton?.getBoundingClientRect();

      panel.style.left = "auto";

      panel.style.right = Math.max(
        8,
        window.innerWidth - rect.right + 12
      ) + "px";

      panel.style.top = (
        buttonRect ? buttonRect.bottom + 12 : rect.top + 40
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
