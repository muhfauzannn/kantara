// Test script to verify Prisma client works correctly
// Run with: node test-prisma.mjs

import { PrismaClient } from "./lib/generated/prisma/client.js";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Testing Prisma connection...");
    const daerahCount = await prisma.daerah.count();
    console.log(
      `✅ Connection successful! Found ${daerahCount} daerah records.`
    );
    console.log("✅ Prisma client is working correctly.");
  } catch (error) {
    console.error("❌ Prisma connection failed:", error.message);
    console.error("Full error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
