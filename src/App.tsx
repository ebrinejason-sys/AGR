import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';
import RuntimeStabilityGuard from '@/components/RuntimeStabilityGuard';
import ScrollToTop from '@/components/ScrollToTop';
import LayoutShell from '@/components/layout/LayoutShell';
import AdminGuard from '@/components/admin/AdminGuard';

import HomePage from '@/pages/HomePage';
import ProgramsPage from '@/pages/ProgramsPage';
import ProgramDetailPage from '@/pages/ProgramDetailPage';
import StoriesPage from '@/pages/StoriesPage';
import EventsPage from '@/pages/EventsPage';
import PayPage from '@/pages/PayPage';
import DonatePage from '@/pages/DonatePage';
import ContactPage from '@/pages/ContactPage';
import ContactAdvocatePage from '@/pages/ContactAdvocatePage';
import ContactMentorPage from '@/pages/ContactMentorPage';
import ContactPartnerPage from '@/pages/ContactPartnerPage';
import OurStoryPage from '@/pages/OurStoryPage';
import FounderPage from '@/pages/FounderPage';
import LegalAdvocacyPage from '@/pages/LegalAdvocacyPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';
import TermsPage from '@/pages/legal/TermsPage';
import RefundPage from '@/pages/legal/RefundPage';
import NotFoundPage from '@/pages/NotFoundPage';

import AdminLoginPage from '@/pages/admin/LoginPage';
import AdminDashboardPage from '@/pages/admin/DashboardPage';
import AdminProjectsPage from '@/pages/admin/ProjectsPage';
import AdminEventsPage from '@/pages/admin/EventsPage';
import AdminStoriesPage from '@/pages/admin/StoriesPage';
import AdminMediaPage from '@/pages/admin/MediaPage';
import AdminSubscriptionsPage from '@/pages/admin/SubscriptionsPage';
import AdminContactsPage from '@/pages/admin/ContactsPage';

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:id" element={<ProgramDetailPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/donate" element={<DonatePage />} />
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
      </LayoutShell>
    </>
  );
}

export default function App() {
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    const ios = detectIOS();
    setIsIOSDevice(ios);
    if (ios) {
      document.documentElement.setAttribute('data-ios', '1');
      document.documentElement.setAttribute('data-runtime-safe', '1');
    }
    document.documentElement.classList.add('antialiased');
  }, []);

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
