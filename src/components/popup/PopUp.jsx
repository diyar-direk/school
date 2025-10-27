/**
 * @typedef {Object} divProps
 * @property {boolean} isOpen
 * @property {() => void} [onClose]
 */

import { memo, useMemo } from "react";
import "./popups.css";

/**
 * @param {divProps & React.HTMLAttributes<HTMLDivElement>} props
 */
const PopUp = ({
  isOpen = false,
  onClose = () => {},
  className,
  children,
  ...props
}) => {
  const popupClassName = useMemo(() => `popup ${className || ""}`, [className]);
  if (isOpen)
    return (
      <div className="overlay" onClick={onClose}>
        <div
          {...props}
          onClick={(e) => e.stopPropagation()}
          className={popupClassName}
        >
          {children}
        </div>
      </div>
    );
};

export default memo(PopUp);
