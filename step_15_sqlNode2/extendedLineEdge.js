import { LineEdge, LineEdgeModel } from "@logicflow/core";

class ExtendedLineEdge extends LineEdge {}

class ExtendedLineEdgeModel extends LineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    // svg属性
    if (this.isHovered || this.isSelected) {
      style.stroke = "orange";
      style.strokeWidth = 2;
    } else {
      style.stroke = "#ababac";
      style.strokeWidth = 1;
    }
    // style.adjustLine.stroke = "orange";
    // style.adjustAnchor.fill = "orange";
    // style.adjustAnchor.stroke = "orange";
    return style;
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "none";
    style.hover.stroke = "none";
    return style;
  }
  //自定义文本样式
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 14;
    style.background.fill = "#f1f6f8";
    return style;
  }
  /**
   * 重写此方法，使保存数据时能带上锚点数据。
   */
  getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    return data;
  }
}

export default {
  type: "extended-line-edge",
  view: ExtendedLineEdge,
  model: ExtendedLineEdgeModel
};
