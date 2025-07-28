// Mock data service for testing when database is not available
const mockData = {
  news: [
    {
      _id: 'news1',
      title: 'Welcome to Tahya Misr Platform',
      content: 'We are excited to announce the launch of our new student union platform connecting students across Egypt.',
      image: null,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      author: 'Admin'
    },
    {
      _id: 'news2',
      title: 'Student Elections 2024',
      content: 'Annual student union elections will be held next month. Register your candidacy today!',
      image: null,
      createdAt: new Date('2024-01-10T14:20:00Z'),
      author: 'Election Committee'
    },
    {
      _id: 'news3',
      title: 'New Scholarship Opportunities',
      content: 'Several scholarship opportunities are now available for outstanding students. Apply now!',
      image: null,
      createdAt: new Date('2024-01-05T09:15:00Z'),
      author: 'Academic Affairs'
    }
  ],
  events: [
    {
      _id: 'event1',
      title: 'Student Leadership Conference',
      description: 'Join us for a day of leadership workshops and networking opportunities.',
      date: new Date('2024-02-15T10:00:00Z'),
      location: 'Cairo University',
      image: null,
      registrations: ['user1', 'user2', 'user3'],
      createdAt: new Date('2024-01-15T10:30:00Z')
    },
    {
      _id: 'event2',
      title: 'Cultural Night 2024',
      description: 'Celebrate Egyptian culture with music, dance, and traditional performances.',
      date: new Date('2024-02-20T19:00:00Z'),
      location: 'Alexandria University',
      image: null,
      registrations: ['user1', 'user4'],
      createdAt: new Date('2024-01-10T14:20:00Z')
    }
  ],
  users: [
    {
      _id: 'user1',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      role: 'student',
      university: 'Cairo University',
      governorate: 'Cairo',
      phone: '+20123456789',
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      _id: 'admin1',
      name: 'Admin User',
      email: 'admin@tahyamisr.org',
      role: 'admin',
      university: 'Cairo University',
      governorate: 'Cairo',
      phone: '+20123456789',
      createdAt: new Date('2024-01-01T00:00:00Z')
    }
  ],
  media: [
    {
      _id: 'media1',
      originalName: 'conference-photo.jpg',
      caption: 'Leadership Conference Group Photo',
      type: 'image/jpeg',
      size: 2048000,
      url: '/uploads/media1.jpg',
      createdAt: new Date('2024-01-15T10:30:00Z')
    },
    {
      _id: 'media2',
      originalName: 'event-video.mp4',
      caption: 'Cultural Night Highlights',
      type: 'video/mp4',
      size: 25600000,
      url: '/uploads/media2.mp4',
      createdAt: new Date('2024-01-10T14:20:00Z')
    }
  ]
};

module.exports = mockData;