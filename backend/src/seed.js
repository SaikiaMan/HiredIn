// Seed script to add sample events to the database
// Run with: node src/seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const eventModel = require("./models/eventModel");
const connectDB = require("./config/db");

const sampleEvents = [
  {
    name: "Summer Music Festival 2024",
    description: "Join us for an amazing summer music festival featuring top artists from around the world. We need volunteers for ticketing, security, and event management. Great opportunity to meet industry professionals and build your event management experience.",
    date: new Date("2024-06-15T18:00:00Z"),
    location: "Central Park, New York, NY",
    payRate: 18,
    volunteersRequired: 50,
    volunteersApplied: 12,
    category: "Concert",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop"
  },
  {
    name: "Tech Conference 2024",
    description: "The largest tech conference of the year. Help us with registration, speaker coordination, and attendee support. Perfect for tech enthusiasts looking to network and gain experience in event coordination.",
    date: new Date("2024-07-20T09:00:00Z"),
    location: "San Francisco Convention Center, CA",
    payRate: 20,
    volunteersRequired: 100,
    volunteersApplied: 35,
    category: "Conference",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop"
  },
  {
    name: "Metropolitan Marathon 2024",
    description: "Support runners in our annual city marathon. Volunteers needed for water stations, finish line support, and crowd management. Be part of this exciting athletic event!",
    date: new Date("2024-08-10T07:00:00Z"),
    location: "Downtown Marathon Route, Boston, MA",
    payRate: 16,
    volunteersRequired: 200,
    volunteersApplied: 89,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop"
  },
  {
    name: "Arts & Culture Festival",
    description: "A vibrant celebration of local arts and culture. Assist with artist coordination, booth setup, and visitor engagement. Ideal for anyone interested in the arts and event production.",
    date: new Date("2024-08-25T11:00:00Z"),
    location: "Riverside Art District, Portland, OR",
    payRate: 15,
    volunteersRequired: 60,
    volunteersApplied: 28,
    category: "Festival",
    image: "https://images.unsplash.com/photo-1493514789560-586609db8906?w=500&h=300&fit=crop"
  },
  {
    name: "Food & Wine Expo",
    description: "Experience world-class culinary delights. Help with food service coordination, vendor management, and guest services. Great networking opportunity in the food industry.",
    date: new Date("2024-09-05T17:00:00Z"),
    location: "Convention Hall, Las Vegas, NV",
    payRate: 17,
    volunteersRequired: 75,
    volunteersApplied: 42,
    category: "Other",
    image: "https://images.unsplash.com/photo-1504674900149-731c6541e5d1?w=500&h=300&fit=crop"
  },
  {
    name: "College Football Championship",
    description: "Be part of the biggest college football event of the season. Assist with stadium operations, crowd management, and spectator services. Exciting atmosphere and great pay!",
    date: new Date("2024-09-15T18:00:00Z"),
    location: "National Stadium, Miami, FL",
    payRate: 19,
    volunteersRequired: 150,
    volunteersApplied: 67,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1516321356793-c8950ccb7ee0?w=500&h=300&fit=crop"
  },
  {
    name: "Independent Film Festival",
    description: "Support independent filmmakers at our annual festival. Help with film screenings, guest coordination, and audience engagement. Perfect for film enthusiasts!",
    date: new Date("2024-09-22T19:00:00Z"),
    location: "Indie Cinema Complex, Los Angeles, CA",
    payRate: 14,
    volunteersRequired: 40,
    volunteersApplied: 18,
    category: "Other",
    image: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=500&h=300&fit=crop"
  },
  {
    name: "Annual Charity Gala",
    description: "Support a great cause at our annual charity gala. Volunteers assist with registration, event setup, and guest coordination. All proceeds go to local community programs.",
    date: new Date("2024-10-05T18:00:00Z"),
    location: "Grand Ballroom, Chicago, IL",
    payRate: 20,
    volunteersRequired: 50,
    volunteersApplied: 31,
    category: "Other",
    image: "https://images.unsplash.com/photo-1519671482677-f88b287c5f39?w=500&h=300&fit=crop"
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing events
    await eventModel.deleteMany({});
    console.log("✓ Cleared existing events");
    
    // Insert sample events
    const insertedEvents = await eventModel.insertMany(sampleEvents);
    console.log(`✓ Successfully added ${insertedEvents.length} sample events`);
    
    // Display inserted events
    console.log("\nSample Events Added:");
    insertedEvents.forEach(event => {
      console.log(`  - ${event.name} (${event.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("✗ Error seeding database:", error.message);
    process.exit(1);
  }
}

seedDatabase();
