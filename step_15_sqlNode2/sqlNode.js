import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import { v4 as uuidv4 } from "uuid";

const fieldHeight = 25;
const tableContainerWidth = 250;

class SqlNode extends HtmlNode {
  // 生成字段html
  getTableFieldHtml(fields) {
    return fields && fields.length > 0
      ? fields
          .map(
            (field) => `
          <div class="table-field">
            <div class="table-field-index-and-key">
              <span class="icon-index-${field.indexType}"></span>
              <span>${field.name}</span>
            </div>
            <div class="field-type">
              <span>${field.type}</span>
              <span class="field-nullable">${field.nullable ? "?" : ""}</span>
            </div>
          </div>
        `
          )
          .join("")
      : "";
  }
  setHtml(rootEl) {
    const {
      properties: { fields, tableName }
    } = this.props.model;

    const container = document.createElement("div");
    container.className = `table-node table-color-${Math.ceil(
      Math.random() * 4
    )}`;
    container.innerHTML = `
      <div class="table-name">${tableName}</div>
        ${this.getTableFieldHtml(fields)}
      </div>
    `;

    rootEl.setAttribute("class", "table-container");
    rootEl.innerHTML = "";
    rootEl.appendChild(container);
  }
}

class SqlNodeModel extends HtmlNodeModel {
  createId() {
    return uuidv4();
  }
  /**
   * 新增一个字段
   * @param {*} item
   */
  addField(item) {
    item.id = uuidv4();
    this.properties.fields.push(item);
    this.setAttributes();
    // 为了保持节点顶部位置不变，在节点变化后，对节点进行一个位移,位移距离为添加高度的一半。
    this.move(0, fieldHeight / 2);
  }
  /**
   * 更新一个字段
   * @param {*} item
   */
  updateField(item) {
    const {
      properties: { fields }
    } = this;
    const index = fields.findIndex((field) => field.id === item.id);
    fields[index] = item;
    this.setAttributes();
  }
  /**
   * 移除一个字段
   * @param {*} item
   */
  removeField(item) {
    const {
      properties: { fields }
    } = this;
    const index = fields.findIndex((field) => field.id === item.id);
    fields.splice(index, 1);
    this.setAttributes();
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    // style.stroke = "none";
    // style.hover.stroke = "none";
    return style;
  }
  setAttributes() {
    const {
      properties: { fields }
    } = this;
    this.width = tableContainerWidth;
    if (fields && fields.length > 0) {
      this.height = 60 + fields.length * fieldHeight;
    } else {
      this.height = 60;
    }
    const circleOnlyAsTarget = {
      message: "检测锚点连出的规则",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        // return sourceAnchor.type === "right" || sourceAnchor.type === "left";
        return true;
      }
    };
    this.sourceRules.push(circleOnlyAsTarget);
  }
  getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
      height,
      properties: { fields }
    } = this;
    const anchors = [];
    fields &&
      fields.length > 0 &&
      fields.forEach((field, index) => {
        anchors.push({
          x: x - width / 2 + 10,
          y: y - height / 2 + 65 + index * fieldHeight,
          id: `${field.id}_left`,
          type: "left"
        });
        anchors.push({
          x: x + width / 2 - 10,
          y: y - height / 2 + 65 + index * fieldHeight,
          id: `${field.id}_right`,
          type: "right"
        });
      });
    return anchors;
  }
}

export default {
  type: "sql-node",
  model: SqlNodeModel,
  view: SqlNode
};
