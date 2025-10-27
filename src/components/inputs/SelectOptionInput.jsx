import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./inputs.css";
import Button from "../buttons/Button";

/**
 * @typedef {Object} OptionItem
 * @property {string} text - النص الذي سيُعرض داخل القائمة المنسدلة
 * @property {any} [value] - القيمة المرتبطة بهذا الخيار (يمكن أن تكون أي نوع)
 * @property {function(): void} [onSelectOption] - دالة اختيار مخصصة تُنفذ عند الضغط على هذا الخيار
 * @property {Object} [props] - خصائص إضافية يمكن تمريرها لتخصيص كل خيار (className, style, إلخ)
 */

/**
 * @typedef {Object} SelectOptionInputProps
 * @property {string} label - عنوان الحقل
 * @property {string} placeholder - النص المعروض عند عدم وجود قيمة محددة
 * @property {OptionItem[]} options - قائمة الخيارات القابلة للعرض والاختيار
 * @property {string} [value] - القيمة الحالية المحددة
 * @property {function(OptionItem): void} onSelectOption - دالة تُستدعى عند اختيار أحد الخيارات
 * @property {function(): void} [onIgnore] - دالة تُستدعى عند الضغط على زر الحذف
 * @property {string} [errorText] - نص الخطأ لعرضه أسفل الحقل
 * @property {React.ReactNode} [addOption] - عنصر إضافي يُعرض أعلى قائمة الخيارات (مثل زر "إضافة خيار")
 * @property {Object} [optionListProps] - خصائص إضافية يمكن تمريرها إلى قائمة الخيارات (مثل style أو className)
 * @property {Object} [wrapperProps] - خصائص إضافية يمكن تمريرها إلى الغلاف الرئيسي للمكون
 */

/**
 * مكون لاختيار القيم من قائمة منسدلة قابلة للتخصيص
 * @param {SelectOptionInputProps} props
 */
const SelectOptionInput = ({
  label,
  placeholder,
  onIgnore,
  value,
  options = [],
  onSelectOption,
  errorText,
  addOption,
  optionListProps = {},
  wrapperProps = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);

  const toggleOptionArea = useCallback((e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (option, e) => {
      e?.stopPropagation();
      option.onSelectOption ? option.onSelectOption() : onSelectOption(option);
      setIsOpen(false);
      setHighlightIndex(-1);
    },
    [onSelectOption]
  );

  useEffect(() => {
    const onBodyClick = (e) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };

    window.addEventListener("click", onBodyClick);
    return () => window.removeEventListener("click", onBodyClick);
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
        setHighlightIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % options.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev - 1 + options.length) % options.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < options.length) {
        handleSelect(options[highlightIndex]);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  const optionListClassName = useMemo(
    () => `options active ${optionListProps?.className || ""}`,
    [optionListProps]
  );

  const wrapperClassName = useMemo(
    () => `select-input inp ${wrapperProps?.className || ""}`,
    [wrapperProps]
  );

  return (
    <div
      {...wrapperProps}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={wrapperClassName}
    >
      <label
        tabIndex={0}
        onFocus={() => setIsOpen(true)}
        onClick={toggleOptionArea}
        className="title"
      >
        {label}
      </label>

      <div onClick={toggleOptionArea} className="placeholder center relative">
        <span className="flex-1 ellipsis">{placeholder}</span>
        <i className="fa-solid fa-chevron-down"></i>

        {isOpen && (
          <article {...optionListProps} className={optionListClassName}>
            {addOption}
            {options?.map((opt, index) => (
              <h3
                key={opt.text || index}
                onClick={(e) => handleSelect(opt, e)}
                className={highlightIndex === index ? "highlight" : ""}
                {...opt.props}
              >
                {opt.text}
              </h3>
            ))}
          </article>
        )}
      </div>

      {value && (
        <Button onClick={onIgnore} btnStyleType="outlined" btnType="delete">
          {value}
        </Button>
      )}

      {errorText && <p className="field-error">{errorText}</p>}
    </div>
  );
};

export default memo(SelectOptionInput);
