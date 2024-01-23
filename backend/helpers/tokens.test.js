const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", function () {
  test("works: not Company", function () {
    const token = createToken({ username: "test", id: 1, userType: "user" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      id: 1,
      username: "test",
      userType: "user",
    });
  });

  test("works: Company", function () {
    const token = createToken({ username: "test", id: 2, userType: "company" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      id: 2,
      username: "test",
      userType: "company",
    });
  });

  test("works: with excess information", function () {
    const token = createToken({ username: "test", id: 3, userType: "user", email: "test@example.com"});
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      id: 3,
      username: "test",
      userType: "user",
    });
  });

  test("throws error for missing information", function () {
    const token = createToken({ username: "test" });
    const payload = jwt.verify(token, SECRET_KEY);
  });
});
