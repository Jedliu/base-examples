import Swal from "sweetalert2";

export const setEdgeText = (lf, data) => {
  data = data.data;
  const edgeId = data.id;
  const relationship = {
    one: "1:1",
    two: "1:n",
    three: "n:1",
    four: "n:n"
  };
  const relationshipKey = Object.keys(relationship).find(
    (key) => relationship[key] === data.text?.value
  );
  Swal.fire({
    focusConfirm: true,
    heightAuto: false,
    allowOutsideClick: relationshipKey ? true : false,
    width: 400,
    allowEscapeKey: relationshipKey ? true : false,
    confirmButtonText: "应用关系",
    denyButtonText: "删除关系",
    showCloseButton: true,
    showDenyButton: true,
    preConfirm: () => {
      const selected = document.querySelector(
        "input[name='relationship']:checked"
      );
      return selected ? true : false;
    },
    html: `
        <div class="card">
          <div class="title">请选择表间关系:</div>
          <div class="content">
            <input type="radio" name="relationship" id="one" ${
              relationshipKey == "one" ? "checked" : ""
            }>
            <input type="radio" name="relationship" id="two" ${
              relationshipKey == "two" ? "checked" : ""
            }>
            <input type="radio" name="relationship" id="three" ${
              relationshipKey == "three" ? "checked" : ""
            }>
            <input type="radio" name="relationship" id="four" ${
              relationshipKey == "four" ? "checked" : ""
            }>
            <label for="one" class="box first">
              <div class="plan">
                <span class="circle"></span>
                <span class="yearly">1对1关系(1:1)</span>
              </div>
            </label>
            <label for="two" class="box second">
              <div class="plan">
                <span class="circle"></span>
                <span class="yearly">1对多关系(1:n)</span>
              </div>
            </label>
            <label for="three" class="box third">
              <div class="plan">
                <span class="circle"></span>
                <span class="yearly">多对1关系(n:1)</span>
              </div>
            </label>
            <label for="four" class="box fourth">
              <div class="plan">
                <span class="circle"></span>
                <span class="yearly">多对多关系(n:n)</span>
              </div>
            </label>
          </div>
        </div>
      `
  }).then((result) => {
    if (result.isConfirmed) {
      const selected = document.querySelector(
        "input[name='relationship']:checked"
      );
      if (selected) {
        const edgeModel = lf.getEdgeModelById(edgeId);
        const text = relationship[selected.id];
        // 如果当前存在edge,则是编辑edge的text
        if (edgeModel) {
          // 直接通过model更新text界面不会直接更新
          edgeModel.setText({
            value: text,
            draggable: true,
            editable: false
          });
          // 通过LogicFlow的updateText可以直接更新
          lf.updateText(edgeId, text);
        } else {
          // 没有edge存在,表示原来的edge已经被删除了,则重新创建edge
          lf.addEdge({
            sourceAnchorId: data.sourceAnchorId,
            sourceNodeId: data.sourceNodeId,
            targetAnchorId: data.targetAnchorId,
            targetNodeId: data.targetNodeId,
            startPoint: data.startPoint,
            endPoint: data.endPoint,
            text: text
          });
        }
      }
    } else if (result.isDenied) {
      lf.deleteEdge(edgeId);
    }
  });
};

/**
 * 删除字段和字段对应的连线
 * @param LogicFlow lf
 * @param string nodeId
 * @param string fieldId
 */
export const deleteField = (lf, nodeId, fieldId) => {
  lf.getNodeModelById(nodeId).removeField({
    id: fieldId
  });
  const data = lf.getGraphData();
  for (const edge of data.edges) {
    if (
      edge.sourceAnchorId.indexOf(fieldId) >= 0 ||
      edge.targetAnchorId.indexOf(fieldId) >= 0
    ) {
      lf.deleteEdge(edge.id);
    }
  }
};
