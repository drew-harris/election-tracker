import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export async function getAccessToken() {
  const creds = await prisma.credentials.findFirst({});
  if (
    !creds ||
    !creds.accessToken ||
    (creds.expiresAt < new Date() && creds.refreshToken)
  ) {
    if (!creds?.refreshToken) throw new Error("No refresh token");
    const newCreds = await getNewCreds(creds?.refreshToken);
    return newCreds.accessToken;
  } else {
    return creds.accessToken;
  }
}

export async function getNewCreds(refresh: string) {
  console.log("Refresh", env.API_REFRESH);
  const response = await fetch(
    "https://securetoken.googleapis.com/v1/token?key=AIzaSyCV4nUAYef19aqroWDdeMFzQZmCXxdJoJs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Ios-Bundle-Identifier": "com.ashtoncofer.Buzz",
        "X-Client-Version": "iOS/FirebaseSDK/10.2.0/FirebaseCore-iOS",
        "User-Agent":
          "FirebaseAuth.iOS/10.2.0 com.ashtoncofer.Buzz/1.12.12 iPhone/16.1 hw/iPhone13_3",
        "X-Firebase-GMPID": env.GMPID,
      },
      body: JSON.stringify({
        grantType: "refresh_token",
        refreshToken: env.API_REFRESH,
      }),
    }
  );

  if (response.ok) {
    const json = await response.json();
    const updated = await prisma.credentials.update({
      where: {
        id: 1,
      },
      data: {
        accessToken: json.access_token,
        expiresAt: new Date(Date.now() + json.expires_in * 1000),
        refreshToken: json.refresh_token,
      },
    });
    console.log(json);
    return updated;
  } else {
    console.error(await response.text());
    throw new Error("Failed to get new creds");
  }
}
