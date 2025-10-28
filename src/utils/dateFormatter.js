/**
 * @param {string} date - The date string to format.
 * @param {"justYear"|"fullDate"} [format="justYear"] - The format type.
 * @returns {string} The formatted date.
 */
const dateFormatter = (date, format = "justYear") => {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const day = String(time.getDate()).padStart(2, "0");

  if (format === "justYear") return `${year}-${month}-${day}`;

  let hours = time.getHours();
  const at = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const hoursStr = String(hours).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} / ${hoursStr}:${minutes}:${seconds} ${at}`;
};

export default dateFormatter;
