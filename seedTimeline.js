const mongoose = require('mongoose');
require('dotenv').config();
const Timeline = require('./models/Timeline');

const connectDB = require('./config/database');

// Connect to database
connectDB();

const timelineData = [
  {
    year: "2019",
    title: "Union Founded",
    description: "Started with 500 students from 5 universities",
    achievement: "First student policy paper submitted to Parliament",
    order: 1
  },
  {
    year: "2020",
    title: "National Expansion",
    description: "Reached all 27 governorates with 5,000+ members",
    achievement: "Launched Egypt's largest student leadership program",
    order: 2
  },
  {
    year: "2021",
    title: "Government Partnership",
    description: "Official recognition and collaboration agreements",
    achievement: "15 policy recommendations adopted by ministries",
    order: 3
  },
  {
    year: "2022",
    title: "International Recognition",
    description: "Awarded 'Best Student Organization' by Arab League",
    achievement: "50+ alumni placed in government positions",
    order: 4
  },
  {
    year: "2023",
    title: "Digital Innovation",
    description: "Launched digital platform connecting 25,000+ students",
    achievement: "100+ community projects completed nationwide",
    order: 5
  },
  {
    year: "2024",
    title: "Future Leaders",
    description: "50,000+ active members shaping Egypt's tomorrow",
    achievement: "Direct influence on 3 major national initiatives",
    order: 6
  }
];

const seedTimeline = async () => {
  try {
    // Clear existing timeline data
    await Timeline.deleteMany({});
    console.log('🗑️ Existing timeline data cleared');

    // Insert new timeline data
    const timeline = await Timeline.insertMany(timelineData);
    console.log(`✅ ${timeline.length} timeline events seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding timeline:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedTimeline();
}

module.exports = { seedTimeline };