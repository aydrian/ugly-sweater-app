import Twilio from "twilio";
import withVerifyTwilio from "../lib/withVerifyTwilio";
import { createEntry, vote } from "../lib/contest";

async function twilioHandler(event, _context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method Not Allowed"
    };
  }
  // console.log(event.parsedBody);
  const { Body, From, NumMedia, MediaUrl0, MediaContentType0 } =
    event.parsedBody;
  const [contest, entry] = Body.trim().split(" ");

  let response = `Contest: ${contest}, Entry: ${entry}`;

  if (parseInt(NumMedia)) {
    // new entry
    response = await createEntry(contest, entry, MediaUrl0, MediaContentType0);
  } else {
    // vote for entry
    response = await vote(contest, entry, From);
  }

  const twiml = new Twilio.twiml.MessagingResponse();
  const message = twiml.message();
  message.body(response);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/xml"
    },
    body: twiml.toString()
  };
}

export const handler = withVerifyTwilio(twilioHandler);
