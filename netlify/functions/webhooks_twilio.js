import Twilio from "twilio";
import withVerifyTwilio from "../lib/withVerifyTwilio";

async function twilioHandler(event, _context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method Not Allowed"
    };
  }
  const { Body } = event.parsedBody;
  const [context, entry] = Body.split(" ");

  const twiml = new Twilio.twiml.MessagingResponse();
  const message = twiml.message();
  message.body(`Contest: ${contest}, Entry: ${entry}`);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/xml"
    },
    body: twiml.toString()
  };
}

export const handler = withVerifyTwilio(twitchHandler);
