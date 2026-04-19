import { DHUniform } from "../sds";

test("DHUniform returns zero", () => {
  expect(DHUniform(1)).toBe(0);
});
