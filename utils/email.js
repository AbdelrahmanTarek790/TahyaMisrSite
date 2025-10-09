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
    const logoUrl = "https://tahyamisryu.com/Logo.png" // Fallback to a public logo

    return `
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f5f5f5; direction: rtl;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px;">
                <!-- Main Container -->
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header with Logo and Colors -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #B31D1D 0%, #FFD700 100%); padding: 30px 40px; text-align: center;">
                            <img src="${logoUrl}" alt="اتحاد شباب تحيا مصر" style="max-width: 80px; height: auto; margin-bottom: 15px;" />
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
                        <td style="padding: 40px; text-align: right;">
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
                        <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 3px solid #FFD700;">
                            <div style="margin-bottom: 15px;">
                                <h3 style="color: #B31D1D; margin: 0 0 10px 0; font-size: 18px;">تواصل معنا</h3>
                                <p style="color: #666666; margin: 5px 0; font-size: 14px;">
                                    📧 info@tahyamisryu.com | 🌐 tahyamisryu.com
                                </p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <a href="https://www.facebook.com/TahiaMisrYouthUnion" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                                    <div style="background-color: #1877f2; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">Facebook</div>
                                </a>
                                <a href="https://tahyamisryu.com" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                                    <div style="background-color: #B31D1D; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">الموقع الرسمي</div>
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
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <h3 style="color: #155724; margin: 0 0 15px 0;">رمز إعادة التعيين</h3>
            <div style="background-color: #ffffff; border: 2px dashed #28a745; border-radius: 8px; padding: 15px; display: inline-block;">
                <span style="font-size: 24px; font-weight: bold; color: #B31D1D; letter-spacing: 2px; font-family: 'Courier New', monospace;">
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
               style="background: linear-gradient(135deg, #B31D1D 0%, #d63384 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 12px 30px; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(179, 29, 29, 0.3);">
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
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
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
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
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
        
        <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                    border: 2px solid #28a745; 
                    border-radius: 12px; 
                    padding: 25px; 
                    margin-bottom: 30px;
                    text-align: center;">
            <h3 style="color: #155724; margin: 0 0 20px 0; font-size: 20px;">🔑 بيانات الدخول الخاصة بك</h3>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">📧 البريد الإلكتروني:</p>
                <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; font-family: 'Courier New', monospace;">
                    <strong style="color: #B31D1D;">${email}</strong>
                </div>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">🔒 كلمة المرور المؤقتة:</p>
                <div style="background-color: #fff3cd; border: 2px dashed #ffc107; border-radius: 4px; padding: 15px; font-family: 'Courier New', monospace;">
                    <strong style="color: #B31D1D; font-size: 18px; letter-spacing: 1px;">${tempPassword}</strong>
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
               style="background: linear-gradient(135deg, #B31D1D 0%, #FFD700 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 40px; 
                      border-radius: 30px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;
                      box-shadow: 0 6px 20px rgba(179, 29, 29, 0.3);
                      transition: all 0.3s ease;">
                🚀 ابدأ رحلتك معنا الآن
            </a>
        </div>
        
        <div style="background-color: #cce7ff; border: 1px solid #99d6ff; border-radius: 8px; padding: 20px; text-align: center;">
            <h4 style="color: #0066cc; margin: 0 0 15px 0;">🌟 ما ينتظرك في الاتحاد</h4>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
                <div style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
                    📚 ورش تدريبية
                </div>
                <div style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
                    🎯 فعاليات مجتمعية
                </div>
                <div style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
                    🤝 شبكة علاقات
                </div>
                <div style="background: white; padding: 10px 15px; border-radius: 20px; color: #0066cc; font-size: 14px;">
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
            <div style="background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%); 
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
                        box-shadow: 0 2px 10px rgba(255, 143, 0, 0.1);">
                <div style="color: #bf360c; font-size: 16px; line-height: 1.6; white-space: pre-line;">${notes}</div>
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
               style="background: linear-gradient(135deg, #B31D1D 0%, #FFD700 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 40px; 
                      border-radius: 30px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;
                      box-shadow: 0 6px 20px rgba(179, 29, 29, 0.3);
                      transition: all 0.3s ease;">
                🔄 تحديث الطلب الآن
            </a>
        </div>
        
        <div style="background-color: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; text-align: center;">
            <h4 style="color: #2e7d32; margin: 0 0 15px 0;">💚 نحن هنا لمساعدتك</h4>
            <p style="color: #388e3c; margin: 0 0 15px 0;">إذا كان لديك أي استفسار أو تحتاج مساعدة في تحديث طلبك، لا تتردد في التواصل معنا</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 15px;">
                <div style="background: white; padding: 8px 12px; border-radius: 15px; color: #2e7d32; font-size: 14px;">
                    📧 info@tahyamisryu.com
                </div>
                <div style="background: white; padding: 8px 12px; border-radius: 15px; color: #2e7d32; font-size: 14px;">
                    📱 واتساب: 01234567890
                </div>
            </div>
        </div>
        `
    )
    return sendEmail({ to: email, subject, html, text: `تعديل مطلوب على طلبك. ${notes ? "الملاحظات: " + notes : ""}` })
}

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
    sendJoinRequestSubmitted,
    sendJoinRequestApproved,
    sendJoinRequestDenied,
}
