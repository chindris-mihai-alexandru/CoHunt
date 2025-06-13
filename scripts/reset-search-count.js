const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetSearchCount() {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First find the user
    const user = await prisma.user.findUnique({
      where: { email: 'mihai.chindris@icloud.com' }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);

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
  } finally {
    await prisma.$disconnect();
  }
}

resetSearchCount();