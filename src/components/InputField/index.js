import React, { useState } from "react";

const useInput = ({ type="text", placeholder = "", className, style }) => {
  const [value, setValue] = useState(null);
  const input = 
    type !== "file"
    ? <input value={value || ""} placeholder={placeholder} onChange={e => setValue(e.target.value)} type={type} className={className} style={style} />
    : <input type={type} onChange={e => setValue(e.target.files[0])} />;
  return [value, input];
}

export default useInput;