// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

export interface hCaptchaRequest {
  /**
   * The hCaptcha account secret key
   */
  secret: string;
  /**
   * Captcha verification token from the user
   *
   * The hCaptcha frontend should return this when the user completes the captcha
   */
  response: string;
  /**
   * User's IP address
   *
   * Optional, supposedly improves verification accuracy
   */
  remoteip?: string;
  /**
   * Sitekey expected for this captcha solution
   *
   * Optional, ensures that the captcha was solved on the correct site,
   * prevents the usage of tokens solved on other sites.
   */
  sitekey?: string;
}

export interface hCaptchaResponseSuccess {
  /**
   * true if the user passed verification, false on failure
   */
  success: true;
}

export interface hCaptchaResponseFailure {
  /**
   * true if the user passed verification, false on failure
   */
  success: false;
  /**
   * List of issues with the verification request
   *
   * See [hCaptcha docs](https://docs.hcaptcha.com/#siteverify-error-codes-table) for a full list of possible codes.
   */
  "error-codes": string[];
}

export interface hCaptchaResponseCommon {
  /**
   * Timestap of the challenge, in ISO format
   */
  challenge_ts: string;
  /**
   * Name of the site where the challenge was solved.
   *
   * Untrusted user input - do not use for authentication
   */
  hostname: string;
}

export type hCaptchaResponse = hCaptchaResponseCommon &
  (hCaptchaResponseSuccess | hCaptchaResponseFailure);

export async function verifyHCaptcha(
  req: hCaptchaRequest,
): Promise<hCaptchaResponse> {
  // serialize the request
  const qs = new URLSearchParams({ ...req }).toString();

  // send the request
  let response;
  try {
    const resp = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs,
    });
    response = (await resp.json()) as hCaptchaResponse;
  } catch (err) {
    throw new Error("hCaptcha request failed", { cause: err });
  }

  return response;
}
