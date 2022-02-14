import { h, PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

class ExtendedPolylineEdge extends PolylineEdge {
  // 代码来源 LogicFlow/packages/extension/src/materials/curved-edge/index.ts
  getEdge() {
    const { strokeWidth, stroke, strokeDashArray } =
      this.props.model.getEdgeStyle();
    const { points } = this.props.model;
    const points2 = points
      .split(" ")
      .map((p) => p.split(",").map((a) => Number(a)));
    const [startX, startY] = points2[0];
    let d = `M${startX} ${startY}`;
    // 1) 如果一个点不为开始和结束，则在这个点的前后增加弧度开始和结束点。
    // 2) 判断这个点与前一个点的坐标
    //    如果x相同则前一个点的x也不变，
    //    y为（这个点的y 大于前一个点的y, 则 为 这个点的y - 5；小于前一个点的y, 则为这个点的y+5）
    //    同理，判断这个点与后一个点的x,y是否相同，如果x相同，则y进行加减，如果y相同，则x进行加减
    // todo: 好丑，看看怎么优化下
    const space = 5;
    for (let i = 1; i < points2.length - 1; i++) {
      const [preX, preY] = points2[i - 1];
      const [currentX, currentY] = points2[i];
      const [nextX, nextY] = points2[i + 1];
      if (currentX === preX && currentY !== preY) {
        const y = currentY > preY ? currentY - space : currentY + space;
        d = `${d} L ${currentX} ${y}`;
      }
      if (currentY === preY && currentX !== preX) {
        const x = currentX > preX ? currentX - space : currentX + space;
        d = `${d} L ${x} ${currentY}`;
      }
      d = `${d} Q ${currentX} ${currentY}`;
      if (currentX === nextX && currentY !== nextY) {
        const y = currentY > nextY ? currentY - space : currentY + space;
        d = `${d} ${currentX} ${y}`;
      }
      if (currentY === nextY && currentX !== nextX) {
        const x = currentX > nextX ? currentX - space : currentX + space;
        d = `${d} ${x} ${currentY}`;
      }
    }
    const [endX, endY] = points2[points2.length - 1];
    d = `${d} L ${endX} ${endY}`;
    return h("path", {
      d,
      strokeWidth,
      stroke,
      fill: "none",
      strokeDashArray
    });
  }
}

class ExtendedPolylineEdgeModel extends PolylineEdgeModel {
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
  type: "extended-polyline-edge",
  view: ExtendedPolylineEdge,
  model: ExtendedPolylineEdgeModel
};
