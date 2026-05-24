const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Position = require('./models/Position');
const News = require('./models/News');
const Event = require('./models/Event');
const CustomField = require('./models/CustomField');
const MandatoryUpdate = require('./models/MandatoryUpdate');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // 1. تنظيف كل الداتا القديمة من الجداول للبدء على نظافة
    await User.deleteMany();
    await Position.deleteMany();
    await News.deleteMany();
    await Event.deleteMany();
    await CustomField.deleteMany();
    await MandatoryUpdate.deleteMany();

    console.log('Existing data cleared');

    // 2. إنشاء المناصب (Positions)
    const positions = await Position.create([
      {
        name: 'President',
        description: 'Union President - Leadership role',
        isGlobal: true,
        isActive: true
      },
      {
        name: 'Vice President',
        description: 'Union Vice President',
        isGlobal: true,
        isActive: true
      },
      {
        name: 'Secretary',
        description: 'Union Secretary',
        isGlobal: true,
        isActive: true
      },
      {
        name: 'Treasurer',
        description: 'Union Treasurer',
        isGlobal: true,
        isActive: true
      },
      {
        name: 'Cairo Representative',
        description: 'Representative for Cairo Governorate',
        isGlobal: false,
        governorate: 'Cairo',
        isActive: true
      },
      {
        name: 'Alexandria Representative',
        description: 'Representative for Alexandria Governorate',
        isGlobal: false,
        governorate: 'Alexandria',
        isActive: true
      }
    ]);

    console.log('Positions created');

    // 3. إنشاء الحقول الديناميكية العامة (Custom Fields)
    const field1 = await CustomField.create({
      label: "رقم العضوية بنقابة المهندسين",
      type: "number",
      status: "active",
      order: 1
    });

    const field2 = await CustomField.create({
      label: "اللجنة النوعية المفضلة",
      type: "radio",
      options: ["اللجنة التقنية", "لجنة التنظيم والمتابعة", "لجنة العلاقات الخارجية"],
      status: "active",
      order: 2
    });

    console.log('Dynamic Custom Fields created');

    // 4. إنشاء حساب الأدمن (Admin User) - الباسورد نص عادي ليقوم الموديل بتشفيره
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@tahyamisr.org',
      password: 'admin123', // 🌟 نص عادي علطول
      phone: '01000000000',
      university: 'Cairo University',
      nationalId: '29801010101010',
      governorate: 'Cairo',
      position: positions[0]._id, // President
      membershipNumber: 'TM-2025-ADMIN',
      membershipExpiry: new Date('2026-12-31'),
      role: 'admin'
    });

    console.log('Admin User created successfully');

    // 5. إنشاء حسابات الأعضاء للتجربة (نص عادي للباسورد ودور 'member' المتوافق)
    const sampleUsers = await User.create([
      {
        // أحمد محمد ➡️ حالة الحجب الصارم التام (Hard Block) لوجود تحديث إلزامي له
        name: 'Ahmed Mohamed',
        email: 'ahmed@example.com',
        password: 'password123', // 🌟 نص عادي علطول
        phone: '01111111111',
        university: 'Cairo University',
        nationalId: '29801010101011',
        governorate: 'Cairo',
        position: positions[4]._id, // Cairo Representative
        membershipNumber: 'TM-2025-001',
        membershipExpiry: new Date('2026-12-31'),
        role: 'member', 
        customFieldValues: [] 
      },
      {
        // فاطمة حسن ➡️ حالة اللافتة العلوية التنبيهية فقط (Soft Banner)
        name: 'Fatma Hassan',
        email: 'fatma@example.com',
        password: 'password123', // 🌟 نص عادي علطول
        phone: '01222222222',
        university: 'Alexandria University',
        nationalId: '29801010101012',
        governorate: 'Alexandria',
        position: positions[5]._id, // Alexandria Representative
        membershipNumber: 'TM-2025-002',
        membershipExpiry: new Date('2026-12-31'),
        role: 'member', 
        customFieldValues: [] 
      },
      {
        // عمر علي ➡️ حالة الحساب الكامل (شاشة نظيفة تماماً Clean UI)
        name: 'Omar Ali',
        email: 'omar@example.com',
        password: 'password123', // 🌟 نص عادي علطول
        phone: '01333333333',
        university: 'Ain Shams University',
        nationalId: '29801010101013',
        governorate: 'Cairo',
        membershipNumber: 'TM-2025-003',
        membershipExpiry: new Date('2026-12-31'),
        role: 'member', 
        customFieldValues: [
          { fieldId: field1._id, value: "98765" },
          { fieldId: field2._id, value: "اللجنة التقنية" }
        ]
      }
    ]);

    console.log('Sample Users created');

    // 6. إنشاء قاعدة التحديث الإلزامي الصارم (تستهدف أحمد فقط لتقفل شاشته)
    await MandatoryUpdate.create({
      title: "تحديث البيانات النقابية الإلزامي",
      adminMessage: "يا شباب، برجاء إدخال رقم العضوية الخاص بالنقابة لتفعيل الكارنيهات الجديدة الموحدة.",
      fields: [field1._id], 
      targetType: "targeted",
      targetUserIds: [sampleUsers[0]._id], // ربط بـ ID أحمد محمد
      status: "active",
      createdBy: adminUser._id
    });

    console.log('Explicit Mandatory Update Rule created for Ahmed');

    // 7. إنشاء الأخبار التجريبية
    await News.create([
      {
        title: 'Welcome to Tahya Misr Students Union Platform',
        content: 'We are excited to launch our new digital platform to better serve our student community. This platform will help us stay connected, share news, and organize events more effectively.',
        createdBy: adminUser._id
      },
      {
        title: 'Annual Student Conference 2025',
        content: 'Mark your calendars! Our annual student conference will be held in March 2025. More details will be announced soon. Stay tuned for registration information.',
        createdBy: adminUser._id
      }
    ]);

    console.log('News created');

    // 8. إنشاء الفعاليات التجريبية
    await Event.create([
      {
        title: 'Orientation Day for New Members',
        description: 'Join us for an orientation session to learn about Tahya Misr Students Union, our mission, and how you can get involved.',
        date: new Date('2025-02-15T10:00:00.000Z'),
        location: 'Cairo University Main Hall',
        createdBy: adminUser._id
      },
      {
        title: 'Community Service Workshop',
        description: 'Learn about various community service opportunities and how to make a positive impact in your local community.',
        date: new Date('2025-02-20T14:00:00.000Z'),
        location: 'Alexandria University Student Center',
        createdBy: adminUser._id
      }
    ]);

    console.log('Events created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('Email: admin@tahyamisr.org | Password: admin123');
    console.log('\n📧 Users Logins (Password: password123):');
    console.log('- Hard Block (🔴): ahmed@example.com');
    console.log('- Soft Banner (🟡): fatma@example.com');
    console.log('- Clean UI (🟢): omar@example.com');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();