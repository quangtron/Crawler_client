import React, { useEffect, useState } from "react";
import "./style.scss";
import { IoIosArrowDropdown } from "react-icons/io";

export const useInput = ({
  type = "text",
  placeholder = "",
  className,
  style,
}) => {
  const [value, setValue] = useState(null);
  const input =
    type !== "file" ? (
      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        className={className}
        style={style}
      />
    ) : (
      <input type={type} onChange={(e) => setValue(e.target.files[0])} />
    );
  return [value, input];
};

export const useDropdown = ({
  opts = [],
  defautValue = -1,
  label = "",
  idDropdownElement,
}) => {
  const [value, setValue] = useState({});

  useEffect(() => {
    if (opts.length) {
      setValue(opts.find((o) => o.id === defautValue));
    }
  }, [opts, defautValue]);

  function handleChange(value) {
    setValue(value);
  }

  const renderOpts = () =>
    opts.map((o) => (
      <li onClick={() => handleChange(o)} key={o.id}>
        {o.name}
      </li>
    ));

  const handleClick = () => {
    let el = document.getElementById(idDropdownElement);
    if (el) {
      el.classList.toggle("dropdown-list-active");
    }
  };

  const dropdown = (
    <div className="dropdown-wrap">
      {label ? (
        <div className="dropdown-label">
          <label onClick={handleClick}>{label}</label>
        </div>
      ) : null}
      <div
        className="dropdown"
        onClick={handleClick}
        onMouseLeave={() => {
          let el = document.getElementById(idDropdownElement);
          if (el) {
            el.classList.remove("dropdown-list-active");
          }
        }}
      >
        <div className="dropdown-input">
          <span>{value.name || ""}</span>
        </div>
        <span className="dropdown-icon">
          <IoIosArrowDropdown fontSize={20} />
        </span>
        <ul id={idDropdownElement} className="dropdown-list">
          {renderOpts()}
        </ul>
      </div>
    </div>
  );

  return [value, dropdown];
};
