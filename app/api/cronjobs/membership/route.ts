import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(req: Request) {
  try {
    // Optional: Add a simple secret key check to prevent unauthorized execution
    // const { searchParams } = new URL(req.url);
    // const secret = searchParams.get('secret');
    // if (secret !== process.env.CRON_SECRET) {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // }

    const now = new Date().toISOString();

    // Find and update users whose VIP membership has expired
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, email')
      .eq('membership', 'VIP')
      .lt('end_membership', now);

    if (fetchError) {
      console.error("Error fetching expired users:", fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      return NextResponse.json({ success: true, message: 'No expired memberships found', updatedCount: 0 });
    }

    // Update the expired users back to Free
    const userIds = expiredUsers.map(user => user.id);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ membership: 'Free' })
      .in('id', userIds);

    if (updateError) {
      console.error("Error updating expired users:", updateError);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    // Return the result
    return NextResponse.json({
      success: true,
      message: 'Successfully updated expired memberships',
      updatedCount: userIds.length,
      updatedUsers: expiredUsers.map(u => u.email)
    });
    
  } catch (error: any) {
    console.error("Cronjob error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
