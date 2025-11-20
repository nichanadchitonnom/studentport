import axios from "axios";

export const sendEmail = async (htmlContent, email, subject) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "mymeiii2359@gmail.com", name: "studentport" },
        to: [{ email }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "Api-Key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📧 Email sent:", response.data);
    return 1;
  } catch (err) {
    console.error("❌ Send email error:", err.response?.data || err.message);
    return 0;
  }
};
