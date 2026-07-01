import { useLayoutEffect, useRef } from "react";
import { caretIndexForDigitCount, countDigitsBeforeCaret, formatINRForInput, stripINRFormatting } from "../utils/currency";

export default function IndianMoneyInput({
  value,
  onValueChange,
  className = "wf-input",
  placeholder = "",
  required = false,
  name,
  id,
  inputMode = "numeric",
  ...props
}) {
  const inputRef = useRef(null);
  const caretDigitCountRef = useRef(null);
  const displayValue = formatINRForInput(value);

  useLayoutEffect(() => {
    if (caretDigitCountRef.current === null || document.activeElement !== inputRef.current) return;
    const caretIndex = caretIndexForDigitCount(displayValue, caretDigitCountRef.current);
    inputRef.current.setSelectionRange(caretIndex, caretIndex);
    caretDigitCountRef.current = null;
  }, [displayValue]);

  const handleChange = (event) => {
    caretDigitCountRef.current = countDigitsBeforeCaret(event.target.value, event.target.selectionStart);
    onValueChange(stripINRFormatting(event.target.value), event);
  };

  return (
    <input
      {...props}
      ref={inputRef}
      id={id}
      name={name}
      type="text"
      inputMode={inputMode}
      className={className}
      value={displayValue}
      onChange={handleChange}
      required={required}
      placeholder={placeholder}
    />
  );
}
