import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import PropTypes from "prop-types";
import styles from "./ComboBox.module.scss";

const ComboBox = ({
  allOptions,
  onSelection,
  onClear,
  onAddTag,
  placeholder,
}) => {
  const filterOptions = (options, value) =>
    value
      ? options.filter(({ name }) => name.toLowerCase().includes(value))
      : options;

  const [value, setValue] = useState("");
  const [options, setOptions] = useState(
    allOptions?.length ? filterOptions(allOptions, value) : []
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setOptions(filterOptions(allOptions, value));
  }, [allOptions, value]);

  const handleInputChange = (event) => {
    event.persist();
    setValue(event.target.value.toLowerCase());
    setOptions(filterOptions(allOptions, event.target.value));
  };

  const handleOnKeyDown = (event) => {
    event.persist();
    if (event.keyCode === 13) {
      event.preventDefault();
      onAddTag(event.target.value);
      if (!onClear) {
        setValue("");
      }
    }
  };

  const handleClick = (event) => {
    event.persist();
    onSelection({
      id: event.target.dataset.id,
      name: event.target.dataset.value,
    });
    setValue("");
    setIsFocused(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setValue("");
    if (onClear) onClear();
  };

  const boldenString = (str, boldStr) => {
    const i = str.toLowerCase().indexOf(boldStr.toLowerCase());
    if (!boldStr || i === -1) return str;
    return (
      <>
        {str.substr(0, i)}
        <strong>{str.substr(i, boldStr.length)}</strong>
        {str.substr(i + boldStr.length)}
      </>
    );
  };

  return (
    <div className={styles.comboBox}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          name="tag"
          value={value}
          autoComplete={"off"}
          className={styles.comboInput}
          onChange={handleInputChange}
          onKeyDown={handleOnKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />
        {value && (
          <button type="button" className={styles.clear} onClick={handleClear}>
            <IoClose />
          </button>
        )}
      </div>

      {isFocused && options?.length ? (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option.id}
              className={styles.option}
              data-value={option.name}
              data-id={option.id}
              onClick={handleClick}
            >
              {boldenString(option.name, value)}
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className={styles.add}
        onClick={() => {
          onAddTag(value);
          setValue("");
        }}
      >
        <FaPlus />
      </button>
    </div>
  );
};

ComboBox.propTypes = {
  allOptions: PropTypes.arrayOf(PropTypes.object),
  onSelection: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  onAddTag: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default ComboBox;
