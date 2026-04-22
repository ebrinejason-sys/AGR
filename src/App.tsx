import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';
import RuntimeStabilityGuard from '@/components/RuntimeStabilityGuard';
import ScrollToTop from '@/components/ScrollToTop';
import LayoutShell from '@/components/layout/LayoutShell';
import AdminGuard from '@/components/admin/AdminGuard';

import HomePage from '@/pages/HomePage';
const ProgramsPage = lazy(() => import('@/pages/ProgramsPage'));
const ProgramDetailPage = lazy(() => import('@/pages/ProgramDetailPage'));
const StoriesPage = lazy(() => import('@/pages/StoriesPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const PayPage = lazy(() => import('@/pages/PayPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const ContactAdvocatePage = lazy(() => import('@/pages/ContactAdvocatePage'));
const ContactMentorPage = lazy(() => import('@/pages/ContactMentorPage'));
const ContactPartnerPage = lazy(() => import('@/pages/ContactPartnerPage'));
const OurStoryPage = lazy(() => import('@/pages/OurStoryPage'));
const FounderPage = lazy(() => import('@/pages/FounderPage'));
const LegalAdvocacyPage = lazy(() => import('@/pages/LegalAdvocacyPage'));
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
const RefundPage = lazy(() => import('@/pages/legal/RefundPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AdminLoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProjectsPage = lazy(() => import('@/pages/admin/ProjectsPage'));
const AdminEventsPage = lazy(() => import('@/pages/admin/EventsPage'));
const AdminStoriesPage = lazy(() => import('@/pages/admin/StoriesPage'));
const AdminMediaPage = lazy(() => import('@/pages/admin/MediaPage'));
const AdminSubscriptionsPage = lazy(() => import('@/pages/admin/SubscriptionsPage'));
const AdminContactsPage = lazy(() => import('@/pages/admin/ContactsPage'));

// Lightweight loading fallback
function PageLoader() {
  return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
}

function detectIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod|CriOS|FxiOS/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function AppRoutes({ isIOSDevice }: { isIOSDevice: boolean }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <LayoutShell isIOSDevice={isIOSDevice} isAdmin={isAdmin}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetailPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/pay" element={<PayPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact/advocate" element={<ContactAdvocatePage />} />
            <Route path="/contact/mentor" element={<ContactMentorPage />} />
            <Route path="/contact/partner" element={<ContactPartnerPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/founder" element={<FounderPage />} />
            <Route path="/legal-advocacy" element={<LegalAdvocacyPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/refund" element={<RefundPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/projects" element={<AdminProjectsPage />} />
              <Route path="/admin/events" element={<AdminEventsPage />} />
              <Route path="/admin/stories" element={<AdminStoriesPage />} />
              <Route path="/admin/media" element={<AdminMediaPage />} />
              <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
              <Route path="/admin/contacts" element={<AdminContactsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </LayoutShell>
    </>
  );
}

export default function App() {
  // Synchronous detection for first-render optimization
  const [isIOSDevice] = useState(() => detectIOS());

  useEffect(() => {
    if (isIOSDevice) {
      document.documentElement.setAttribute('data-ios', '1');
      document.documentElement.setAttribute('data-runtime-safe', '1');
    }
    document.documentElement.classList.add('antialiased');
  }, [isIOSDevice]);

  return (
    <BrowserRouter>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="light"
        themes={['light', 'dark']}
        enableSystem={false}
        enableColorScheme
        disableTransitionOnChange
        storageKey="agr-theme"
      >
        <RuntimeStabilityGuard />
        <AppRoutes isIOSDevice={isIOSDevice} />
        {!isIOSDevice && <Analytics />}
      </ThemeProvider>
    </BrowserRouter>
  );
}
