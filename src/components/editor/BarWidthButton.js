import React from "react";

const BarWidthInput = ({ barWidth, onChange, onFix }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="text"
        placeholder="Bar width (px)"
        value={barWidth}
        onChange={onChange}
        style={{ width: "100px", padding: "4px" }}
      />
      <button onClick={onFix} style={{ padding: "4px 8px" }}>
        FIXED BAR
      </button>
    </div>
  );
};

export default BarWidthInput;
