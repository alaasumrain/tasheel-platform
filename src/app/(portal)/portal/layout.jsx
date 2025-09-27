/**
 * Layout shell derived from Devias Material Kit React dashboard (MIT License).
 * https://github.com/devias-io/material-kit-react
 */

import PortalLayoutShell from '../PortalLayoutShell';
import { getSupabaseServerComponentClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PortalLayout({ children }) {
  const supabase = await getSupabaseServerComponentClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return <PortalLayoutShell user={session?.user || null}>{children}</PortalLayoutShell>;
}
