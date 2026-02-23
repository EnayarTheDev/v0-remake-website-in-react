-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  grade TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user')),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);

-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  level TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair')),
  description TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Books RLS Policies
CREATE POLICY "Anyone can view available books" ON public.books FOR SELECT USING (
  is_available = TRUE OR 
  auth.uid() = user_id OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);
CREATE POLICY "Users can create books" ON public.books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own books" ON public.books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete books" ON public.books FOR DELETE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);
CREATE POLICY "Users can delete their own books" ON public.books FOR DELETE USING (auth.uid() = user_id);

-- Create swap_offers table
CREATE TABLE IF NOT EXISTS public.swap_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  offered_book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  swap_code TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.swap_offers ENABLE ROW LEVEL SECURITY;

-- Swap Offers RLS Policies
CREATE POLICY "Users can view their own offers" ON public.swap_offers FOR SELECT USING (
  auth.uid() = requester_id OR 
  auth.uid() = (SELECT user_id FROM public.books WHERE id = book_id) OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);
CREATE POLICY "Users can create swap offers" ON public.swap_offers FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Book owners can update swap offers" ON public.swap_offers FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM public.books WHERE id = book_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  swap_offer_id UUID REFERENCES public.swap_offers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('swap_request', 'swap_accepted', 'swap_declined', 'swap_completed')),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications RLS Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create admin_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Admin Logs RLS Policies
CREATE POLICY "Admins can view logs" ON public.admin_logs FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);

-- Create pending_approvals table
CREATE TABLE IF NOT EXISTS public.pending_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.pending_approvals ENABLE ROW LEVEL SECURITY;

-- Pending Approvals RLS Policies
CREATE POLICY "Admins can view pending approvals" ON public.pending_approvals FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);
CREATE POLICY "Anyone can submit approval" ON public.pending_approvals FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can update approvals" ON public.pending_approvals FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);
