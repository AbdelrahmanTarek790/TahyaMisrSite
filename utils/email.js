const nodemailer = require("nodemailer")

// SMTP config from env
// Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
const smtpOptions = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: !!(process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465"),
    auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
              }
            : undefined,
}

const transporter = nodemailer.createTransport(smtpOptions)

async function sendEmail({ to, subject, html, text }) {
    if (!process.env.SMTP_HOST) {
        console.warn("[email] SMTP not configured; logging email to console instead")
        console.log({ to, subject, text, html })
        return { success: true, mocked: true }
    }
    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"اتحاد شباب تحيا مصر" <info@tahyamisryu.com>',
        to,
        subject,
        text,
        html,
    })
    return { success: true, messageId: info.messageId }
}

function baseTemplate(title, content) {
    return `
  <div style="font-family:Tahoma,Arial,sans-serif;direction:rtl;text-align:right">
    <h2>${title}</h2>
    <div style="font-size:14px;line-height:1.8">${content}</div>
    <hr/>
    <div style="font-size:12px;color:#666">اتحاد شباب تحيا مصر</div>
  </div>`
}

async function sendResetPasswordEmail(email, resetToken) {
    const subject = "إعادة تعيين كلمة المرور - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "إعادة تعيين كلمة المرور",
        `
    <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك.</p>
    <p>رمز إعادة التعيين: <b>${resetToken}</b></p>
    <p>سينتهي الرمز خلال 10 دقائق.</p>
  `
    )
    return sendEmail({ to: email, subject, html, text: `رمز إعادة التعيين: ${resetToken}` })
}

async function sendJoinRequestSubmitted(email, name) {
    const subject = "تم استلام طلب الانضمام - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "تم استلام طلبك",
        `
    <p>عزيزي/عزيزتي ${name}،</p>
    <p>تم استلام طلب الانضمام الخاص بك وسيتم مراجعته بواسطة الإدارة.</p>
    <p>سنقوم بإبلاغك عند اتخاذ القرار.</p>
  `
    )
    return sendEmail({ to: email, subject, html, text: "تم استلام طلب الانضمام الخاص بك." })
}

async function sendJoinRequestApproved(email, name, tempPassword) {
    const subject = "تمت الموافقة على طلب الانضمام - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "تهانينا! تمت الموافقة على طلبك",
        `
    <p>عزيزي/عزيزتي ${name}،</p>
    <p>تمت الموافقة على طلب الانضمام الخاص بك وتم إنشاء حساب لك.</p>
    <p>بيانات الدخول المؤقتة:</p>
    <p>البريد الإلكتروني: <b>${email}</b><br/>كلمة المرور المؤقتة: <b>${tempPassword}</b></p>
    <p>يرجى تسجيل الدخول وتغيير كلمة المرور فورًا.</p>
  `
    )
    return sendEmail({ to: email, subject, html, text: `تمت الموافقة على طلبك. كلمة المرور المؤقتة: ${tempPassword}` })
}

async function sendJoinRequestDenied(email, name, notes) {
    const subject = "تم رفض طلب الانضمام - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "نأسف، تم رفض طلبك",
        `
    <p>عزيزي/عزيزتي ${name}،</p>
    <p>نأسف لإبلاغك بأنه تم رفض طلب الانضمام الخاص بك.</p>
    ${notes ? `<p>ملاحظات: ${notes}</p>` : ""}
  `
    )
    return sendEmail({ to: email, subject, html, text: `تم رفض طلب الانضمام الخاص بك. ${notes ? "ملاحظات: " + notes : ""}` })
}

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
    sendJoinRequestSubmitted,
    sendJoinRequestApproved,
    sendJoinRequestDenied,
}
