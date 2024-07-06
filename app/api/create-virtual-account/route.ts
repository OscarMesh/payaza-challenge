import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

function generateRandomReference(length = 10) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "REF";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const dataParsed = JSON.parse(body);

    const {
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
    } = dataParsed;

    if (
      !customer_first_name ||
      !customer_last_name ||
      !customer_email ||
      !customer_phone
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const payment_reference = generateRandomReference();

    const payload = JSON.stringify({
      service_type: "Account",
      service_payload: {
        request_application: "Payaza",
        application_module: "USER_MODULE",
        application_version: "1.0.0",
        request_class: "MerchantCreateVirtualAccount",
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_phone,
        virtual_account_provider: "Premiumtrust",
        payment_amount: 1429,
        payment_reference,
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://router-live.78financials.com/api/request/secure/payloadhandler",
      headers: {
        Authorization: `Payaza ${process.env.NEXT_PUBLIC_PAYAZA_PK!}`,
        "Content-Type": "application/json",
      },
      data: payload,
    };

    const response = await axios.request(config);
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("Error occurred:", error);

    return NextResponse.json(
      { error: "Something went wrong..." },
      { status: 500 }
    );
  }
}
