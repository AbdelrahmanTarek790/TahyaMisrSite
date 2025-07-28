const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Position = require('./models/Position');
const News = require('./models/News');
const Event = require('./models/Event');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Position.deleteMany();
    await News.deleteMany();
    await Event.deleteMany();

    console.log('Existing data cleared');

    // Create positions
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

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@tahyamisr.org',
      password: hashedPassword,
      phone: '01000000000',
      university: 'Cairo University',
      nationalId: '29801010101010',
      governorate: 'Cairo',
      position: positions[0]._id, // President
      membershipNumber: 'TM-2025-ADMIN',
      membershipExpiry: new Date('2026-12-31'),
      role: 'admin'
    });

    // Create sample users
    const sampleUsers = await User.create([
      {
        name: 'Ahmed Mohamed',
        email: 'ahmed@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '01111111111',
        university: 'Cairo University',
        nationalId: '29801010101011',
        governorate: 'Cairo',
        position: positions[4]._id, // Cairo Representative
        membershipNumber: 'TM-2025-001',
        membershipExpiry: new Date('2026-12-31'),
        role: 'volunteer'
      },
      {
        name: 'Fatma Hassan',
        email: 'fatma@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '01222222222',
        university: 'Alexandria University',
        nationalId: '29801010101012',
        governorate: 'Alexandria',
        position: positions[5]._id, // Alexandria Representative
        membershipNumber: 'TM-2025-002',
        membershipExpiry: new Date('2026-12-31'),
        role: 'volunteer'
      },
      {
        name: 'Omar Ali',
        email: 'omar@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '01333333333',
        university: 'Ain Shams University',
        nationalId: '29801010101013',
        governorate: 'Cairo',
        membershipNumber: 'TM-2025-003',
        membershipExpiry: new Date('2026-12-31'),
        role: 'student'
      }
    ]);

    console.log('Users created');

    // Create sample news
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

    // Create sample events
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
    console.log('Email: admin@tahyamisr.org');
    console.log('Password: admin123');
    
    console.log('\n📧 Sample User Logins:');
    console.log('Email: ahmed@example.com | Password: password123');
    console.log('Email: fatma@example.com | Password: password123');
    console.log('Email: omar@example.com | Password: password123');

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