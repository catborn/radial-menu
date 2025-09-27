const menuItems = [
  {
    label: "Projects",
    icon: "🎯",
  },
  {
    label: "About",
    icon: "👤",
  },
  {
    label: "Skills",
    icon: "⚡",
  },
  {
    label: "Contact",
    icon: "✉️",
  },
  {
    label: "Blog",
    icon: "📝",
  },
];

class DonutMenu {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.svgNS = "http://www.w3.org/2000/svg";
    this.size = 400;
    this.innerRadius = 120; // Updated inner radius
    this.outerRadius = 200;
    this.sliceAngle = 360 / menuItems.length;
    this.activeSliceIndex = null;
    this.createMenu();
    this.setupMouseTracking();
  }

  createMenu() {
    const svg = document.createElementNS(this.svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    const centerX = this.size / 2;
    const centerY = this.size / 2;

    // Create outer circle
    const outerCircle = document.createElementNS(this.svgNS, "circle");
    outerCircle.setAttribute("cx", centerX);
    outerCircle.setAttribute("cy", centerY);
    outerCircle.setAttribute("r", this.outerRadius);
    outerCircle.setAttribute("fill", "none");
    outerCircle.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
    svg.appendChild(outerCircle);

    // Create following border arc
    const followingBorder = document.createElementNS(this.svgNS, "path");
    followingBorder.setAttribute("class", "following-border");
    followingBorder.style.opacity = "0";
    svg.appendChild(followingBorder);

    menuItems.forEach((item, index) => {
      const startAngle = index * this.sliceAngle;
      const endAngle = startAngle + this.sliceAngle;

      const slice = this.createSlice(
        centerX,
        centerY,
        this.innerRadius,
        this.outerRadius,
        startAngle,
        endAngle,
        item,
        index
      );
      svg.appendChild(slice);
    });

    this.container.appendChild(svg);
    this.followingBorder = followingBorder;
  }

  createSlice(
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    item,
    index
  ) {
    const group = document.createElementNS(this.svgNS, "g");

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + innerRadius * Math.cos(startRad);
    const y1 = cy + innerRadius * Math.sin(startRad);
    const x2 = cx + outerRadius * Math.cos(startRad);
    const y2 = cy + outerRadius * Math.sin(startRad);
    const x3 = cx + outerRadius * Math.cos(endRad);
    const y3 = cy + outerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(endRad);
    const y4 = cy + innerRadius * Math.sin(endRad);

    const path = document.createElementNS(this.svgNS, "path");
    const d = [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`,
      "Z",
    ].join(" ");

    path.setAttribute("d", d);
    path.setAttribute("class", "menu-slice");
    path.setAttribute("fill", "rgba(255, 255, 255, 0.1)");
    path.setAttribute("cursor", "pointer");

    // Calculate center point for text and icon
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = ((midAngle - 90) * Math.PI) / 180;
    const textRadius = (innerRadius + outerRadius) / 2;
    const textX = cx + textRadius * Math.cos(midRad);
    const textY = cy + textRadius * Math.sin(midRad);

    // Create icon
    const icon = document.createElementNS(this.svgNS, "text");
    icon.textContent = item.icon;
    icon.setAttribute("x", textX);
    icon.setAttribute("y", textY - 10);
    icon.setAttribute("class", "menu-icon");
    icon.setAttribute("text-anchor", "middle");
    icon.setAttribute("font-size", "24");
    icon.setAttribute("fill", "rgba(255, 255, 255, 0.9)");
    icon.setAttribute("pointer-events", "none");

    // Create label
    const label = document.createElementNS(this.svgNS, "text");
    label.textContent = item.label;
    label.setAttribute("x", textX);
    label.setAttribute("y", textY + 15);
    label.setAttribute("class", "menu-label");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "14");
    label.setAttribute("fill", "rgba(255, 255, 255, 0.9)");
    label.setAttribute("pointer-events", "none");

    // Create tooltip container

    // const tooltip = document.createElement('div');
    // tooltip.className = 'menu-tooltip';
    // tooltip.innerHTML = item.tooltip;
    // tooltip.style.opacity = '0';
    // tooltip.style.maxWidth = '200px';
    // this.container.appendChild(tooltip);

    // Event handlers
    path.addEventListener("mouseenter", () => {
      this.activeSliceIndex = index;
      // tooltip.style.opacity = '1';
      this.updateFollowingBorder(startAngle, endAngle);
    });

    path.addEventListener("mouseleave", () => {
      this.activeSliceIndex = null;
      // tooltip.style.opacity = '0';
      this.followingBorder.style.opacity = "0";
    });

    path.addEventListener("mousemove", (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // tooltip.style.transform = `translate(${x + 15}px, ${y}px)`;
    });

    group.appendChild(path);
    group.appendChild(icon);
    group.appendChild(label);
    return group;
  }

  setupMouseTracking() {
    this.container.addEventListener("mousemove", (e) => {
      if (this.activeSliceIndex !== null) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Convert to SVG coordinates
        const svgX = (x / rect.width) * this.size;
        const svgY = (y / rect.height) * this.size;

        this.updateFollowingBorderPosition(svgX, svgY);
      }
    });
  }

  updateFollowingBorder(startAngle, endAngle) {
    const cx = this.size / 2;
    const cy = this.size / 2;
    const arcLength = this.sliceAngle;

    this.startAngle = startAngle;
    this.followingBorder.style.opacity = "1";
  }

  updateFollowingBorderPosition(mouseX, mouseY) {
    const cx = this.size / 2;
    const cy = this.size / 2;

    // Calculate angle from center to mouse
    let angle = (Math.atan2(mouseY - cy, mouseX - cx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    // Create arc path
    const startAngle = angle - this.sliceAngle / 2;
    const endAngle = angle + this.sliceAngle / 2;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + this.outerRadius * Math.cos(startRad);
    const y1 = cy + this.outerRadius * Math.sin(startRad);
    const x2 = cx + this.outerRadius * Math.cos(endRad);
    const y2 = cy + this.outerRadius * Math.sin(endRad);

    const d = [
      `M ${x1} ${y1}`,
      `A ${this.outerRadius} ${this.outerRadius} 0 0 1 ${x2} ${y2}`,
    ].join(" ");

    this.followingBorder.setAttribute("d", d);
  }
}

// Initialize menu
document.addEventListener("DOMContentLoaded", () => {
  new DonutMenu("menu-container");
});
