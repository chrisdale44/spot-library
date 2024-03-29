import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import PropTypes from "prop-types";
import styles from "./ComboBox.module.scss";

const ComboBox = ({
  allOptions,
  onSelection,
  onClear,
  onSubmit,
  submitIcon,
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

  const handleOnKeyDown = (e) => {
    e.persist();
    if (e.keyCode === 13) {
      e.preventDefault();
      onSubmit(e.target.value);
      if (!onClear) {
        setValue("");
      }
    }
  };

  const handleClick = (e) => {
    e.persist();
    e.stopPropagation();

    const { id, value } = e.target.dataset;
    onSelection({ id, name: value });
    setValue("");
    setIsFocused(false);
  };

  const handleClickOutside = (e) => {
    e.persist();
    if (e?.relatedTarget?.className.includes(styles.option)) {
      return;
    }
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
          onBlur={handleClickOutside}
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
              tabIndex="0"
            >
              {boldenString(option.name, value)}
            </li>
          ))}
        </ul>
      ) : null}
      {submitIcon && (
        <button
          type="button"
          className={styles.add}
          onClick={() => {
            onSubmit(value);
            setValue("");
          }}
        >
          {submitIcon}
        </button>
      )}
    </div>
  );
};

ComboBox.propTypes = {
  allOptions: PropTypes.arrayOf(PropTypes.object),
  onSelection: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitIcon: PropTypes.node,
  placeholder: PropTypes.string,
};

export default ComboBox;
