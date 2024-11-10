// ==UserScript==
// @name         Dyslexic Color Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Darryl Lewis
// @homepageURL  https://github.com/DLewis01/Dyslexic-Color-Overlay
// @supportURL   https://github.com/DLewis01/Dyslexic-Color-Overlay
// @description  Add colored overlays that might make it easier for dyslexic people to read
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

// It is claimed that the use of coloured filters and lenses can alleviate visual distortions for people with dyslexia.
// You should research this yourself.
//
// I make no claims, medical or otherwise, and I'm not asking anything for the script. This script is free.
// If this helps you, please let me know.


(function() {
    'use strict';

    // Overlay colors
    const colors = {
        "Yellow": "rgba(255, 255, 0, 0.3)",
        "Grass Green": "rgba(124, 252, 0, 0.3)",
        "Aqua": "rgba(0, 255, 255, 0.3)",
        "Sky Blue": "rgba(135, 206, 235, 0.3)",
        "Pink": "rgba(255, 192, 203, 0.3)"
    };

    // Create overlay element
    const overlay = document.createElement("div");
    overlay.id = "colorOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "9999";
    overlay.style.display = "none";
    document.body.appendChild(overlay);

    // Create control panel
    const controlPanel = document.createElement("div");
    controlPanel.id = "controlPanel";
    controlPanel.style.position = "fixed";
    controlPanel.style.top = "20px";
    controlPanel.style.right = "20px";
    controlPanel.style.width = "200px";
    controlPanel.style.backgroundColor = "#f0f0f0";
    controlPanel.style.border = "1px solid #ccc";
    controlPanel.style.padding = "10px";
    controlPanel.style.zIndex = "10000";
    controlPanel.style.cursor = "move";
    controlPanel.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(controlPanel);

    // Add title and exit button to control panel
    const titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.style.justifyContent = "space-between";
    titleBar.style.alignItems = "center";
    titleBar.style.marginBottom = "5px";

    const title = document.createElement("span");
    title.innerText = "Overlay Colors";
    title.style.fontWeight = "bold";
    titleBar.appendChild(title);

    const closeButton = document.createElement("span");
    closeButton.innerText = "✖";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontWeight = "bold";
    closeButton.style.color = "#888";
    closeButton.onclick = () => {
        overlay.style.display = "none";
        controlPanel.remove();  // Remove control panel to exit
    };
    titleBar.appendChild(closeButton);

    controlPanel.appendChild(titleBar);

    // Add buttons for each color
    Object.keys(colors).forEach(colorName => {
        const button = document.createElement("button");
        button.innerText = colorName;
        button.style.margin = "5px";
        button.onclick = () => {
            overlay.style.backgroundColor = colors[colorName];
            overlay.style.display = "block";
        };
        controlPanel.appendChild(button);
    });

    // Add "Hide Overlay" button
    const hideButton = document.createElement("button");
    hideButton.innerText = "Hide Overlay";
    hideButton.style.marginTop = "10px";
    hideButton.onclick = () => {
        overlay.style.display = "none";
    };
    controlPanel.appendChild(hideButton);

    // Add contrast slider
    const contrastLabel = document.createElement("div");
    contrastLabel.innerText = "Contrast";
    contrastLabel.style.marginTop = "10px";
    controlPanel.appendChild(contrastLabel);

    const contrastSlider = document.createElement("input");
    contrastSlider.type = "range";
    contrastSlider.min = "100";
    contrastSlider.max = "300";
    contrastSlider.value = "100";
    contrastSlider.style.width = "100%";
    contrastSlider.oninput = () => {
        const contrastValue = contrastSlider.value;
        overlay.style.filter = `contrast(${contrastValue}%)`;
    };
    controlPanel.appendChild(contrastSlider);

    // Make control panel draggable
    let isDragging = false;
    let offsetX, offsetY;
    controlPanel.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - controlPanel.offsetLeft;
        offsetY = e.clientY - controlPanel.offsetTop;
        controlPanel.style.opacity = "0.8";
    });
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            controlPanel.style.left = `${e.clientX - offsetX}px`;
            controlPanel.style.top = `${e.clientY - offsetY}px`;
        }
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
        controlPanel.style.opacity = "1";
    });

    // Style adjustments
    GM_addStyle(`
        #controlPanel button {
            width: calc(100% - 10px);
            padding: 5px;
            font-size: 14px;
            cursor: pointer;
        }
        #controlPanel input[type=range] {
            margin-top: 5px;
        }
        #controlPanel span[style*="cursor: pointer"] {
            font-size: 16px;
            margin-left: 5px;
        }
    `);
})();
