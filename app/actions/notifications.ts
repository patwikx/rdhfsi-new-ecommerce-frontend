'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUnreadNotifications() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Get all recent notifications (both read and unread)
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Increased to show more in read tab
    });

    return { success: true, notifications };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { 
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

export async function markAllAsRead() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await prisma.notification.updateMany({
      where: { 
        userId: user.id,
        isRead: false,
      },
      data: { 
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error marking all as read:', error);
    return { success: false, error: 'Failed to mark all as read' };
  }
}

type NotificationType = 
  | 'ORDER_CONFIRMED'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'QUOTE_RECEIVED'
  | 'QUOTE_RESPONDED'
  | 'QUOTE_DECLINED'
  | 'PRODUCT_BACK_IN_STOCK'
  | 'PRICE_DROP'
  | 'SYSTEM';

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  referenceType?: string,
  referenceId?: string
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        referenceType,
        referenceId,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}
