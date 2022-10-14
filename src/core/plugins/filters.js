const filterPrice = function (price) {
  if (price === null || price === undefined) {
    return "";
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const filterNumber = function (price) {
  if (price === null || price === undefined) {
    return "";
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const capitalize = function (str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const kebabCase = function (str) {
  return str.replace(/\s+/g, "-").toLowerCase();
};

const stripHtml = function (value) {
  var div = document.createElement("div");
  div.innerHTML = value;
  var text = div.textContent || div.innerText || "";
  return text;
};

module.exports = {
  filterPrice,
  filterNumber,
  capitalize,
  kebabCase,
  stripHtml,
};
