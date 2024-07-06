import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse, res: NextResponse) {
  try {
    const {
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
    } = await req.json();

    let data = JSON.stringify({
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
        payment_amount: 102,
        payment_reference: "RCO1322XLINE",
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://router-live.78financials.com/api/request/secure/payloadhandler",
      headers: {
        Authorization: `Payaza ${process.env.NEXT_PAYAZA_PK}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong..." },
      { status: 500 }
    );
  }
}
