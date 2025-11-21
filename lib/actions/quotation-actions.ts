'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { createNotification } from '@/app/actions/notifications';

interface QuotationSubmission {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  message?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    notes?: string;
  }[];
}

export async function submitQuotation(data: QuotationSubmission): Promise<{
  success: boolean;
  quoteId?: string;
  error?: string;
}> {
  try {
    const session = await auth();

    // Generate quote number
    const quoteNumber = `RFQ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        userId: session?.user?.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        companyName: data.companyName || null,
        message: data.message || null,
        status: 'PENDING',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            notes: item.notes || null,
          })),
        },
      },
    });

    // Notify all admin/manager/staff users about the new quotation request
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'MANAGER', 'STAFF'],
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    // Create notifications for all admin users
    await Promise.all(
      adminUsers.map((admin) =>
        createNotification(
          admin.id,
          'QUOTE_RECEIVED',
          'New Quotation Request',
          `Quotation ${quoteNumber} has been submitted by ${data.customerName}. ${data.items.length} item(s) requested.`,
          `/quotation/${quote.id}`,
          'QUOTE',
          quote.id
        )
      )
    );

    return {
      success: true,
      quoteId: quote.id,
    };
  } catch (error) {
    console.error('Error submitting quotation:', error);
    return {
      success: false,
      error: 'Failed to submit quotation',
    };
  }
}

export async function getQuotationById(id: string): Promise<{
  success: boolean;
  quotation?: {
    id: string;
    quoteNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    companyName: string | null;
    message: string | null;
    status: string;
    createdAt: Date;
    items: {
      id: string;
      productName: string;
      quantity: number;
      notes: string | null;
      product: {
        id: string;
        sku: string;
        slug: string;
        poPrice: number;
        images: {
          url: string;
        }[];
      } | null;
    }[];
  };
  error?: string;
}> {
  try {
    const session = await auth();

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                sku: true,
                slug: true,
                poPrice: true,
                images: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!quote) {
      return {
        success: false,
        error: 'Quotation not found',
      };
    }

    // Check if user has access to this quote
    if (quote.userId && session?.user?.id !== quote.userId) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    return {
      success: true,
      quotation: {
        ...quote,
        items: quote.items.map((item) => ({
          ...item,
          product: item.product
            ? {
                ...item.product,
                poPrice: Number(item.product.poPrice),
              }
            : null,
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return {
      success: false,
      error: 'Failed to fetch quotation',
    };
  }
}
