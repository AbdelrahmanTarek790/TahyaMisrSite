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
    const logoUrl = "https://tahyamisryu.com/Logo.webp" // Fallback to a public logo

    return `
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>${title}</title>
    <style type="text/css">
        /* Client-specific Styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; max-width: 100%; }
        
        /* Reset Styles */
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; }
        
        /* Prevent Overflow */
        * { box-sizing: border-box; }
        table { max-width: 100%; }
        div, p, h1, h2, h3, h4, h5, h6, li, span { 
            word-wrap: break-word; 
            word-break: break-word; 
            overflow-wrap: break-word;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
            hyphens: auto;
        }
        
        /* iOS Blue Links */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        
        /* Mobile Styles */
        @media only screen and (max-width: 600px) {
            .wrapper { padding: 10px !important; }
            .container { max-width: 100% !important; width: 100% !important; border-radius: 0 !important; }
            .header { padding: 20px 15px !important; }
            .header h1 { font-size: 20px !important; line-height: 1.3 !important; }
            .header p { font-size: 12px !important; }
            .header img { max-width: 60px !important; }
            .content { padding: 20px 15px !important; }
            .content h2 { font-size: 18px !important; }
            .content div { font-size: 14px !important; }
            .content table { width: 100% !important; }
            .footer { padding: 20px 15px !important; }
            .footer h3 { font-size: 16px !important; }
            .footer p { font-size: 12px !important; }
            .social-links { text-align: center !important; }
            .social-links a { display: block !important; margin: 5px auto !important; max-width: 200px !important; }
            .social-button { margin: 5px 0 !important; width: 100% !important; }
            .button { padding: 12px 20px !important; font-size: 14px !important; max-width: 100% !important; word-break: keep-all !important; }
            .icon-circle { width: 70px !important; height: 70px !important; font-size: 36px !important; padding: 15px !important; }
            .large-icon { width: 80px !important; height: 80px !important; font-size: 42px !important; padding: 15px !important; }
            .info-box { padding: 15px !important; margin-bottom: 15px !important; }
            .badge { padding: 6px 10px !important; font-size: 12px !important; margin: 3px !important; display: inline-block !important; }
            .code-box { padding: 12px !important; font-size: 18px !important; max-width: 100% !important; overflow-x: auto !important; }
            .code-box span { font-size: 18px !important; }
        }
        
        @media only screen and (max-width: 480px) {
            .header h1 { font-size: 18px !important; }
            .header p { font-size: 11px !important; }
            .content h2 { font-size: 16px !important; }
            .content div { font-size: 13px !important; }
            .button { padding: 10px 15px !important; font-size: 13px !important; }
            .code-box { padding: 10px !important; font-size: 16px !important; }
            .code-box span { font-size: 16px !important; letter-spacing: 1px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f5f5f5; direction: rtl;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td class="wrapper" style="padding: 20px;">
                <!-- Main Container -->
                <table role="presentation" class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header with Logo and Colors -->
                    <tr>
                        <td class="header" style="background: linear-gradient(135deg, #B31D1D 0%, #FFD700 100%); padding: 30px 40px; text-align: center;">
                            <img src="${logoUrl}" alt="اتحاد شباب تحيا مصر" style="max-width: 80px; height: auto; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" />
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                                اتحاد شباب تحيا مصر
                            </h1>
                            <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">
                                نحو مستقبل أفضل للشباب المصري
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content Area -->
                    <tr>
                        <td class="content" style="padding: 40px; text-align: right;">
                            <h2 style="color: #B31D1D; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                                ${title}
                            </h2>
                            <div style="color: #333333; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
                                ${content}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer" style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 3px solid #FFD700;">
                            <div style="margin-bottom: 15px;">
                                <h3 style="color: #B31D1D; margin: 0 0 10px 0; font-size: 18px;">تواصل معنا</h3>
                                <p style="color: #666666; margin: 5px 0; font-size: 14px; word-break: break-all; overflow-wrap: break-word; max-width: 100%;">
                                    📧 info@tahyamisryu.com<br/>
                                    🌐 tahyamisryu.com
                                </p>
                            </div>
                            
                            <div class="social-links" style="margin-bottom: 20px;">
                                <a href="https://www.facebook.com/TahiaMisrYouthUnion" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                                    <div class="social-button" style="background-color: #1877f2; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">Facebook</div>
                                </a>
                                <a href="https://tahyamisryu.com" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                                    <div class="social-button" style="background-color: #B31D1D; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">الموقع الرسمي</div>
                                </a>
                            </div>
                            
                            <div style="border-top: 1px solid #e9ecef; padding-top: 20px;">
                                <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.4;">
                                    © 2025 اتحاد شباب تحيا مصر. جميع الحقوق محفوظة.<br/>
                                    هذا البريد الإلكتروني تم إرساله من نظام إدارة الاتحاد.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
                
                <!-- Disclaimer -->
                <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                    <tr>
                        <td style="text-align: center; padding: 10px;">
                            <p style="color: #999999; font-size: 11px; margin: 0; line-height: 1.4;">
                                إذا كنت تواجه مشكلة في عرض هذا البريد، يرجى التواصل مع الدعم الفني.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}

async function sendResetPasswordEmail(email, resetToken) {
    const subject = "🔐 إعادة تعيين كلمة المرور - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "إعادة تعيين كلمة المرور",
        `
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">🔒 طلب إعادة تعيين كلمة المرور</h3>
            <p style="margin: 0; color: #856404;">تم استلام طلبك لإعادة تعيين كلمة المرور لحسابك في منصة اتحاد شباب تحيا مصر.</p>
        </div>
        
        <div class="info-box" style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <h3 style="color: #155724; margin: 0 0 15px 0;">رمز إعادة التعيين</h3>
            <div class="code-box" style="background-color: #ffffff; border: 2px dashed #28a745; border-radius: 8px; padding: 15px; display: inline-block; max-width: 100%; overflow-wrap: break-word;">
                <span style="font-size: 24px; font-weight: bold; color: #B31D1D; letter-spacing: 2px; font-family: 'Courier New', monospace; word-break: break-all;">
                    ${resetToken}
                </span>
            </div>
            <p style="color: #155724; margin: 15px 0 0 0; font-size: 14px;">
                ⏰ سينتهي هذا الرمز خلال <strong>10 دقائق</strong> من وقت الإرسال
            </p>
        </div>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #721c24; margin: 0 0 10px 0;">⚠️ تعليمات مهمة للأمان:</h4>
            <ul style="color: #721c24; margin: 0; padding-right: 20px;">
                <li>لا تشارك هذا الرمز مع أي شخص آخر</li>
                <li>إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذا البريد</li>
                <li>تأكد من استخدام كلمة مرور قوية وآمنة</li>
            </ul>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
            <a href="https://tahyamisryu.com/reset-password?token=${resetToken}" 
               class="button"
               style="background: linear-gradient(135deg, #B31D1D 0%, #d63384 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 12px 30px; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(179, 29, 29, 0.3);
                      max-width: 90%;
                      white-space: normal;
                      word-break: keep-all;">
                🔑 إعادة تعيين كلمة المرور الآن
            </a>
        </p>
        `
    )
    return sendEmail({ to: email, subject, html, text: `رمز إعادة التعيين: ${resetToken}` })
}

async function sendJoinRequestSubmitted(email, name) {
    const subject = "✅ تم استلام طلب الانضمام - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "مرحباً بك في رحلة التغيير!",
        `
        <div style="text-align: center; margin-bottom: 30px;">
            <div class="icon-circle" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                        color: white; 
                        padding: 20px; 
                        border-radius: 50%; 
                        width: 80px; 
                        height: 80px; 
                        margin: 0 auto 20px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 36px;">
                ✅
            </div>
        </div>
        
        <p style="font-size: 18px; color: #B31D1D; font-weight: bold; text-align: center; margin-bottom: 25px;">
            أهلاً وسهلاً ${name}! 🎉
        </p>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #155724; margin: 0 0 15px 0;">📋 حالة طلبك</h3>
            <p style="color: #155724; margin: 0;">
                تم استلام طلب الانضمام الخاص بك بنجاح وهو الآن قيد المراجعة من قِبل فريق الإدارة.
            </p>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #856404; margin: 0 0 15px 0;">⏳ الخطوات التالية:</h4>
            <ol style="color: #856404; margin: 0; padding-right: 20px;">
                <li style="margin-bottom: 8px;">سيقوم فريقنا بمراجعة طلبك خلال 2-3 أيام عمل</li>
                <li style="margin-bottom: 8px;">ستتلقى إشعاراً عبر البريد الإلكتروني بنتيجة المراجعة</li>
                <li style="margin-bottom: 8px;">في حالة الموافقة، ستحصل على بيانات الدخول لحسابك</li>
            </ol>
        </div>
        
        <div style="background-color: #cce7ff; border: 1px solid #99d6ff; border-radius: 8px; padding: 20px; text-align: center;">
            <h4 style="color: #0066cc; margin: 0 0 15px 0;">💡 نصائح مفيدة</h4>
            <p style="color: #0066cc; margin: 0;">
                تابع صفحاتنا على وسائل التواصل الاجتماعي للبقاء على اطلاع بأحدث الأنشطة والفعاليات!
            </p>
        </div>
        
        <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            شكراً لاختيارك الانضمام إلى أسرة اتحاد شباب تحيا مصر 🇪🇬
        </p>
        `
    )
    return sendEmail({ to: email, subject, html, text: "تم استلام طلب الانضمام الخاص بك." })
}

async function sendJoinRequestApproved(email, name, tempPassword) {
    const subject = "🎉 مبروك! تم قبولك في اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "أهلاً بك في أسرة الاتحاد!",
        `
        <div style="text-align: center; margin-bottom: 30px;">
            <div class="large-icon" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                        color: #B31D1D; 
                        padding: 20px; 
                        border-radius: 50%; 
                        width: 100px; 
                        height: 100px; 
                        margin: 0 auto 20px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 48px;
                        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);">
                🎉
            </div>
            <h2 style="color: #B31D1D; margin: 0; font-size: 24px;">مبروك ${name}!</h2>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">تم قبولك رسمياً في اتحاد شباب تحيا مصر</p>
        </div>
        
        <div class="info-box" style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                    border: 2px solid #28a745; 
                    border-radius: 12px; 
                    padding: 25px; 
                    margin-bottom: 30px;
                    text-align: center;">
            <h3 style="color: #155724; margin: 0 0 20px 0; font-size: 20px;">🔑 بيانات الدخول الخاصة بك</h3>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">📧 البريد الإلكتروني:</p>
                <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; font-family: 'Courier New', monospace; max-width: 100%; overflow-wrap: break-word;">
                    <strong style="color: #B31D1D; word-break: break-all;">${email}</strong>
                </div>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">🔒 كلمة المرور المؤقتة:</p>
                <div class="code-box" style="background-color: #fff3cd; border: 2px dashed #ffc107; border-radius: 4px; padding: 15px; font-family: 'Courier New', monospace; max-width: 100%; overflow-wrap: break-word;">
                    <strong style="color: #B31D1D; font-size: 18px; letter-spacing: 1px; word-break: break-all;">${tempPassword}</strong>
                </div>
            </div>
        </div>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #721c24; margin: 0 0 15px 0;">⚠️ مهم جداً - اقرأ بعناية:</h4>
            <ul style="color: #721c24; margin: 0; padding-right: 20px;">
                <li style="margin-bottom: 8px;"><strong>قم بتسجيل الدخول فوراً</strong> وغيّر كلمة المرور</li>
                <li style="margin-bottom: 8px;">احتفظ ببيانات الدخول في مكان آمن</li>
                <li style="margin-bottom: 8px;">لا تشارك كلمة المرور مع أي شخص آخر</li>
                <li>تأكد من إكمال ملفك الشخصي بعد تسجيل الدخول</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://tahyamisryu.com/login" 
               class="button"
               style="background: linear-gradient(135deg, #B31D1D 0%, #FFD700 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 40px; 
                      border-radius: 30px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;
                      box-shadow: 0 6px 20px rgba(179, 29, 29, 0.3);
                      transition: all 0.3s ease;
                      max-width: 90%;
                      white-space: normal;
                      word-break: keep-all;">
                🚀 ابدأ رحلتك معنا الآن
            </a>
        </div>
        
        <div style="background-color: #cce7ff; border: 1px solid #99d6ff; border-radius: 8px; padding: 20px; text-align: center;">
            <h4 style="color: #0066cc; margin: 0 0 15px 0;">🌟 ما ينتظرك في الاتحاد</h4>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
                <div class="badge" style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
                    📚 ورش تدريبية
                </div>
                <div class="badge" style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
                    🎯 فعاليات مجتمعية
                </div>
                <div class="badge" style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
                    🤝 شبكة علاقات
                </div>
                <div class="badge" style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
                    🏆 فرص تطوير
                </div>
            </div>
        </div>
        `
    )
    return sendEmail({ to: email, subject, html, text: `تمت الموافقة على طلبك. كلمة المرور المؤقتة: ${tempPassword}` })
}

async function sendJoinRequestDenied(email, name, notes) {
    const subject = "📝 تحديث مطلوب على طلب الانضمام - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "طلبك يحتاج لبعض التحديثات",
        `
        <div style="text-align: center; margin-bottom: 30px;">
            <div class="large-icon" style="background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%); 
                        color: white; 
                        padding: 20px; 
                        border-radius: 50%; 
                        width: 100px; 
                        height: 100px; 
                        margin: 0 auto 20px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 48px;
                        box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4);">
                📝
            </div>
            <h2 style="color: #B31D1D; margin: 0; font-size: 24px;">مرحباً ${name}</h2>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">شكراً لاهتمامك بالانضمام لاتحاد شباب تحيا مصر</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%); 
                    border: 2px solid #0288d1; 
                    border-radius: 12px; 
                    padding: 25px; 
                    margin-bottom: 30px;">
            <h3 style="color: #01579b; margin: 0 0 20px 0; font-size: 20px; text-align: center;">
                💡 نحتاج لتحديث بعض المعلومات
            </h3>
            <p style="color: #0277bd; text-align: center; margin-bottom: 25px; font-size: 16px;">
                طلبك وصلنا وتم مراجعته، لكن نحتاج منك تحديث بعض البيانات لإكمال عملية الانضمام
            </p>
        </div>
        
        ${
            notes
                ? `
        <div style="background-color: #fff8e1; 
                    border: 2px solid #ff8f00; 
                    border-radius: 12px; 
                    padding: 25px; 
                    margin-bottom: 30px;">
            <h4 style="color: #e65100; margin: 0 0 20px 0; font-size: 18px;">📋 الملاحظات المطلوبة:</h4>
            <div style="background-color: #ffffff; 
                        border-radius: 8px; 
                        padding: 20px; 
                        border-right: 4px solid #ff8f00;
                        box-shadow: 0 2px 10px rgba(255, 143, 0, 0.1);
                        max-width: 100%;
                        overflow-wrap: break-word;">
                <div style="color: #bf360c; font-size: 16px; line-height: 1.6; white-space: pre-line; word-break: break-word; max-width: 100%;">${notes}</div>
            </div>
        </div>
        `
                : ""
        }
        
        <div style="background-color: #f3e5f5; border: 1px solid #ba68c8; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #6a1b9a; margin: 0 0 15px 0;">✅ الخطوات التالية:</h4>
            <ol style="color: #6a1b9a; margin: 0; padding-right: 20px;">
                <li style="margin-bottom: 10px;">راجع الملاحظات المذكورة أعلاه بعناية</li>
                <li style="margin-bottom: 10px;">قم بتحديث البيانات أو المستندات المطلوبة</li>
                <li style="margin-bottom: 10px;">أعد تقديم طلب الانضمام مع التحديثات</li>
                <li>سنقوم بمراجعة طلبك المحدث في أسرع وقت</li>
            </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://tahyamisryu.com/join" 
               class="button"
               style="background: linear-gradient(135deg, #B31D1D 0%, #FFD700 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 40px; 
                      border-radius: 30px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;
                      box-shadow: 0 6px 20px rgba(179, 29, 29, 0.3);
                      transition: all 0.3s ease;
                      max-width: 90%;
                      white-space: normal;
                      word-break: keep-all;">
                🔄 تحديث الطلب الآن
            </a>
        </div>
        
        <div style="background-color: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; text-align: center;">
            <h4 style="color: #2e7d32; margin: 0 0 15px 0;">💚 نحن هنا لمساعدتك</h4>
            <p style="color: #388e3c; margin: 0 0 15px 0;">إذا كان لديك أي استفسار أو تحتاج مساعدة في تحديث طلبك، لا تتردد في التواصل معنا</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 15px;">
                <div class="badge" style="background: white; padding: 8px 12px; border-radius: 15px; color: #2e7d32; font-size: 14px;">
                    📧 info@tahyamisryu.com
                </div>
                <div class="badge" style="background: white; padding: 8px 12px; border-radius: 15px; color: #2e7d32; font-size: 14px;">
                    📱 واتساب: 01234567890
                </div>
            </div>
        </div>
        `
    )
    return sendEmail({ to: email, subject, html, text: `تعديل مطلوب على طلبك. ${notes ? "الملاحظات: " + notes : ""}` })
}

async function sendMandatoryUpdateNotification(email, name, adminMessage) {
    const subject = "📋 تحديث مطلوب لملفك الشخصي - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "تحديث مطلوب لملفك الشخصي",
        `
        <div style="text-align: center; margin-bottom: 30px;">
            <div class="large-icon" style="background: linear-gradient(135deg, #FF6B35 0%, #FFD700 100%); 
                        color: white; 
                        padding: 20px; 
                        border-radius: 50%; 
                        width: 100px; 
                        height: 100px; 
                        margin: 0 auto 20px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 48px;
                        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);">
                📋
            </div>
            <h2 style="color: #B31D1D; margin: 0; font-size: 24px;">مرحباً ${name}!</h2>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">يرجى تحديث بيانات ملفك الشخصي</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); 
                    border: 2px solid #ffc107; 
                    border-radius: 12px; 
                    padding: 25px; 
                    margin-bottom: 30px;">
            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 20px; text-align: center;">
                ⚠️ تحديث إلزامي
            </h3>
            <p style="color: #856404; text-align: center; margin-bottom: 20px; font-size: 16px;">
                طلبت إدارة الاتحاد تحديث بعض بيانات ملفك الشخصي. يرجى فتح التطبيق وإكمال البيانات المطلوبة.
            </p>
        </div>
        
        <div style="background-color: #ffffff; 
                    border: 2px solid #e0e0e0; 
                    border-radius: 12px; 
                    padding: 25px; 
                    margin-bottom: 30px;
                    border-right: 4px solid #B31D1D;">
            <h4 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">💬 رسالة من الإدارة:</h4>
            <div style="color: #555; font-size: 16px; line-height: 1.8; white-space: pre-line; word-break: break-word;">
                ${adminMessage}
            </div>
        </div>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #721c24; margin: 0 0 10px 0;">⚠️ ملاحظة مهمة:</h4>
            <p style="color: #721c24; margin: 0;">
                لن تتمكن من استخدام التطبيق بشكل كامل حتى يتم إكمال البيانات المطلوبة.
            </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://tahyamisryu.com" 
               class="button"
               style="background: linear-gradient(135deg, #B31D1D 0%, #FFD700 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 40px; 
                      border-radius: 30px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;
                      box-shadow: 0 6px 20px rgba(179, 29, 29, 0.3);
                      max-width: 90%;
                      white-space: normal;
                      word-break: keep-all;">
                📱 افتح التطبيق الآن
            </a>
        </div>
        `
    )
    return sendEmail({
        to: email,
        subject,
        html,
        text: `مطلوب تحديث ملفك الشخصي: ${adminMessage}`,
    })
}

async function sendVerificationOtpEmail(email, otpCode) {
    const subject = "🔐 كود التحقق من البريد الإلكتروني - اتحاد شباب تحيا مصر"
    const html = baseTemplate(
        "تفعيل حسابك",
        `
        <div style="background-color: #e2e3e5; border: 1px solid #d6d8db; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #383d41; margin: 0 0 10px 0; font-size: 16px;">✉️ التحقق من البريد الإلكتروني</h3>
            <p style="margin: 0; color: #383d41;">لقد تلقينا طلبك للانضمام إلى منصة اتحاد شباب تحيا مصر. يرجى استخدام الرمز أدناه للتحقق من بريدك الإلكتروني وإكمال طلبك.</p>
        </div>
        
        <div class="info-box" style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <h3 style="color: #155724; margin: 0 0 15px 0;">رمز التحقق (OTP)</h3>
            <div class="code-box" style="background-color: #ffffff; border: 2px dashed #28a745; border-radius: 8px; padding: 15px; display: inline-block; max-width: 100%; overflow-wrap: break-word;">
                <span style="font-size: 32px; font-weight: bold; color: #B31D1D; letter-spacing: 5px; font-family: 'Courier New', monospace; word-break: break-all;">
                    ${otpCode}
                </span>
            </div>
            <p style="color: #155724; margin: 15px 0 0 0; font-size: 14px;">
                ⏰ سينتهي هذا الرمز خلال <strong>15 دقيقة</strong> من وقت الإرسال
            </p>
        </div>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h4 style="color: #721c24; margin: 0 0 10px 0;">⚠️ تنبيه:</h4>
            <p style="color: #721c24; margin: 0;">إذا لم تقم بتقديم طلب الانضمام، يرجى تجاهل هذا البريد.</p>
        </div>
        `
    )
    return sendEmail({ to: email, subject, html, text: `رمز التحقق: ${otpCode}` })
}

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
    sendJoinRequestSubmitted,
    sendJoinRequestApproved,
    sendJoinRequestDenied,
    sendMandatoryUpdateNotification,
    sendVerificationOtpEmail,
}
