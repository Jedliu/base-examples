import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import {
  Control,
  DndPanel,
  MiniMap,
  SelectionSelect
} from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
import Swal from "sweetalert2";
import { baseData } from "./data.js";
import ExtendedBezierEdge from "./extendedBezierEdge";
import ExtendedLineEdge from "./extendedLineEdge";
import ExtendedPolylineEdge from "./extendedPolylineEdge";
import "./select.css";
import sqlNode from "./sqlNode";
import "./style.css";
import { deleteField, setEdgeText } from "./utils.js";

// 注意加载插件需要在new LogicFlow()之前
// 使用mini-map插件
LogicFlow.use(MiniMap);

const lf = new LogicFlow({
  container: document.querySelector("#app"),
  textEdit: false,
  adjustEdge: false,
  edgeTextDraggable: true,
  grid: false,
  stopScrollGraph: true,
  stopZoomGraph: true,
  plugins: [DndPanel, SelectionSelect, Control, MiniMap],
  keyboard: {
    enabled: true,
    shortcuts: [
      {
        keys: ["backspace"],
        callback: () => {
          Swal.fire({
            title: "确认删除?",
            icon: "warning",
            showCancelButton: true,
            heightAuto: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "删除",
            cancelButtonText: "取消"
          }).then((result) => {
            if (result.isConfirmed) {
              const elements = lf.getSelectElements(true);
              lf.clearSelectElements();
              elements.edges.forEach((edge) => lf.deleteEdge(edge.id));
              elements.nodes.forEach((node) => lf.deleteNode(node.id));
            }
          });
        }
      }
    ]
  }
});

// 添加导航栏
lf.extension.control.addItem({
  iconClass: "custom-minimap",
  title: "",
  text: "导航",
  onMouseEnter: (lf, ev) => {
    const position = lf.getPointByClient(ev.x, ev.y);
    lf.extension.miniMap.show(
      position.domOverlayPosition.x - 120,
      position.domOverlayPosition.y + 35
    );
  },
  onClick: (lf, ev) => {
    const position = lf.getPointByClient(ev.x, ev.y);
    lf.extension.miniMap.show(
      position.domOverlayPosition.x - 120,
      position.domOverlayPosition.y + 35
    );
  }
});

// 设置样式
lf.setTheme({
  //隐藏箭头,设置为0会导致报错
  arrow: {
    offset: 0.01,
    verticalLength: 0.01
  }
});

// 注册连线类型
lf.register(ExtendedBezierEdge);
lf.register(ExtendedLineEdge);
lf.register(ExtendedPolylineEdge);

// 设置默认连线类型
lf.setDefaultEdgeType("extended-polyline-edge");

// 注册SQL节点样式模型
lf.register(sqlNode);

// 监听相关事件
lf.on("edge:dbclick", (data) => setEdgeText(lf, data));
lf.on("edge:add", (data) => {
  data = { ...data };
  if (!data.data.text) {
    lf.deleteEdge(data.data.id);
    setEdgeText(lf, data);
  }
});

// 加载数据并且渲染
// lf.render(baseData);
const data = window.sessionStorage.getItem("sqlNodeData");
if (data) {
  lf.render(JSON.parse(data));
} else {
  lf.render(baseData);
}

document.querySelector("#js_add-table").addEventListener("click", () => {
  lf.addNode({
    properties: { tableName: "hello" },
    type: "sql-node",
    x: 150,
    y: 50
  });
});

document.querySelector("#js_add-field").addEventListener("click", () => {
  lf.getNodeModelById("d8ab19c6-98d7-4e53-b6c5-ee895b07c635").addField({
    name: Math.random().toString(36).substring(2, 7),
    type: ["integer", "long", "string", "boolean"][
      Math.floor(Math.random() * 4)
    ],
    indexType: "none"
  });
});

document.querySelector("#js_update-field").addEventListener("click", () => {
  lf.getNodeModelById("d8ab19c6-98d7-4e53-b6c5-ee895b07c635").updateField({
    id: "405ad52d-6340-4405-8a7e-b27d40d34bf9",
    indexType: "none",
    name: "how_about",
    type: "uuid"
  });
});

document.querySelector("#js_remove-field").addEventListener("click", () => {
  Swal.fire({
    title: "确认删除字段?",
    icon: "warning",
    showCancelButton: true,
    heightAuto: false,
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteField(
        lf,
        "d8ab19c6-98d7-4e53-b6c5-ee895b07c635",
        "405ad52d-6340-4405-8a7e-b27d40d34bf9"
      );
    }
  });
});

document.querySelector("#js_change-edge").addEventListener("click", () => {
  const { edges } = lf.getGraphData();
  const type =
    edges[0].type === "extended-bezier-edge"
      ? "extended-line-edge"
      : edges[0].type === "extended-line-edge"
      ? "extended-polyline-edge"
      : "extended-bezier-edge";
  edges.forEach((edge) => {
    lf.changeEdgeType(edge.id, type);
  });
});

document.querySelector("#js_save").addEventListener("click", () => {
  const data = lf.getGraphData();
  window.sessionStorage.setItem("sqlNodeData", JSON.stringify(data));
  console.log(data);
});
