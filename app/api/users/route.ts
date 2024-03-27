import { Bot } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const bot = new Bot("7006253241:AAG10Qr6yTpnJM0_4FtXXGqs0fWj6FBoTjk");

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, queryId } = body;
  try {
    await bot.api.answerWebAppQuery(queryId, {
      id: queryId,
      type: "article",
      title: "Successfull",
      input_message_content: {
        message_text: `Hello, ${firstName} ${lastName}`,
      },
    });

    return NextResponse.json({ success: true, data: { firstName, lastName } });
  } catch (error) {
    await bot.api.answerWebAppQuery(queryId, {
      id: queryId,
      type: "article",
      title: "Unsuccessfull",
      input_message_content: {
        message_text: `Hello, ${firstName} ${lastName}`,
      },
    });

    return NextResponse.json({ success: false, data: { firstName, lastName } });
  }
}
