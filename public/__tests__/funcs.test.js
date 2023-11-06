/**
 * @jest-environment jsdom
 */

"use strict";
window.$ = window.jQuery = require("jquery");
var { checkModal, isValidUrl, isValidTrackingCode } = require("../js/funcs");

document.querySelector = jest.fn();
window.alert = jest.fn();

const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("isValidTrackingCode", () => {
  test("should return true for valid tracking codes", () => {
    expect(isValidTrackingCode("ABC123")).toBe(true);
    expect(isValidTrackingCode("WXYZ99")).toBe(true);
    expect(isValidTrackingCode("ABC123 ")).toBe(true);
    expect(isValidTrackingCode(" ABC123")).toBe(true);
    expect(isValidTrackingCode(" ABC123 ")).toBe(true);
  });

  test("should return false for invalid tracking codes", () => {
    expect(isValidTrackingCode("")).toBe(false);
    expect(isValidTrackingCode(" ")).toBe(false);
    expect(isValidTrackingCode(".")).toBe(false);
    expect(isValidTrackingCode("ABC1234")).toBe(false);
    expect(isValidTrackingCode("12345")).toBe(false);
    expect(isValidTrackingCode("abc123")).toBe(false);
    expect(isValidTrackingCode("ABC 123")).toBe(false);
    expect(isValidTrackingCode("ABC12$")).toBe(false);
  });
});

describe("isValidUrl", () => {
  test("should return true for valid URLs", () => {
    expect(isValidUrl("http://www.example.com")).toBe(true);
    expect(isValidUrl("https://www.example.com")).toBe(true);
    expect(isValidUrl("https://example..com")).toBe(true);
    expect(isValidUrl("ftp:example.com")).toBe(true);
  });

  test("should return false for invalid URLs", () => {
    expect(isValidUrl("example.com")).toBe(false);
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("www.example.com")).toBe(false);
  });
});

describe("checkModal", () => {
  const isValidUrl = jest.fn();
  const isValidTrackingCode = jest.fn();

  window.localStorage.setItem = jest.fn();

  var $ = require("jquery");
  $.fn.modal = jest.fn();

  document.querySelector = jest.fn();
  document.querySelector.mockImplementation((selector) => {
    if (selector === ".user-input" && isValidUrl("http://www.example.com")) {
      return { value: "http://www.example.com" };
    } else if (selector === ".user-input" && isValidTrackingCode("ABC123")) {
      return { value: "ABC123" };
    } else {
      return { value: "some-mock-user-input-that-returns-undefined" };
    }
  });

  beforeEach(() => {
    document.querySelector.mockClear();
    window.alert.mockClear();
  });

  test("valid URL input opens modal", () => {
    const event = {
      keyCode: 13,
      preventDefault: jest.fn(),
    };
    isValidUrl.mockReturnValue(true);
    isValidTrackingCode.mockReturnValue(false);

    const result = checkModal(event);

    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("user_input", "url");
    expect($("#modal").modal).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("valid tracking code input opens modal", () => {
    const event = {
      keyCode: 13,
      preventDefault: jest.fn(),
    };
    isValidUrl.mockReturnValue(false);
    isValidTrackingCode.mockReturnValue(true);

    const result = checkModal(event);

    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user_input",
      "tracking_code"
    );
    expect($("#modal").modal).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("invalid input shows alert", () => {
    const event = {
      keyCode: 13,
      preventDefault: jest.fn(),
    };
    isValidUrl.mockReturnValue(false);
    isValidTrackingCode.mockReturnValue(false);

    const result = checkModal(event);

    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith(
      "Enter a valid URL or tracking code"
    );
  });
});
