const { PrismaClient } = require('@prisma/client');

// Create a new instance each time to avoid connection issues
async function resetSearchCount() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to database...');
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(`Today's date: ${today.toISOString()}`);

    // First find the user
    console.log('Looking for user...');
    const user = await prisma.user.findUnique({
      where: { email: 'mihai.chindris@icloud.com' }
    });

    if (!user) {
      console.log('User not found - that might be the issue!');
      return;
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);

    // Check current searches
    const currentSearches = await prisma.search.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: today.toISOString()
        }
      }
    });

    console.log(`Current searches today: ${currentSearches.length}`);

    // Delete today's searches for this user
    const result = await prisma.search.deleteMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: today.toISOString()
        }
      }
    });

    console.log(`Deleted ${result.count} search records for today`);
    console.log('Search count has been reset. You should now see 10 searches available.');
    
  } catch (error) {
    console.error('Error resetting search count:', error);
    console.error('Full error:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

resetSearchCount();