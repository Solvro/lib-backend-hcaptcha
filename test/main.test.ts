// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
import { verifyHCaptcha } from "../lib/main.ts";

const TEST_SITEKEY = "10000000-ffff-ffff-ffff-000000000001";
const TEST_SECRETKEY = "0x0000000000000000000000000000000000000000";
const TEST_REPONSETOKEN = "10000000-aaaa-bbbb-cccc-000000000001";

describe("verifyHCaptcha", function () {
  this.timeout(5000);
  this.slow(1000);

  it("known test values should pass (no site key)", async () => {
    await expect(
      verifyHCaptcha({
        secret: TEST_SECRETKEY,
        response: TEST_REPONSETOKEN,
      }),
    )
      .to.eventually.have.property("success")
      .equal(true);
  });

  it("known test values should pass (with site key)", async () => {
    await expect(
      verifyHCaptcha({
        secret: TEST_SECRETKEY,
        response: TEST_REPONSETOKEN,
        sitekey: TEST_SITEKEY,
      }),
    )
      .to.eventually.have.property("success")
      .equal(true);
  });

  // seems like the test secret key completely skips site key validation
  it.skip("known test values, wrong site key = fail", async () => {
    await expect(
      verifyHCaptcha({
        secret: TEST_SECRETKEY,
        response: TEST_REPONSETOKEN,
        sitekey: "99999999-aaaa-aaaa-aaaa-555555555555",
      }),
    )
      .to.eventually.have.property("success")
      .equal(false);
  });

  it("known test response, bad secret key = fail", async () => {
    await expect(
      verifyHCaptcha({
        secret: "0x0000000000000000000000000000000000000003",
        response: TEST_REPONSETOKEN,
      }),
    )
      .to.eventually.have.property("success")
      .equal(false);
  });

  it("known test key, bad response = fail", async () => {
    await expect(
      verifyHCaptcha({
        secret: TEST_SECRETKEY,
        response: "10000000-aaaa-bbbb-cccc-000000000002",
      }),
    )
      .to.eventually.have.property("success")
      .equal(false);
  });
});
