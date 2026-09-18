import React, { useState } from 'react';
import { ScreenName, UserProfile } from '../types';

interface AuthScreensProps {
  screen: 'signin' | 'signup' | 'forgot-password';
  onNavigate: (screen: ScreenName) => void;
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  onToast: (msg: string, icon?: string) => void;
  onOpenScanner?: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  screen,
  onNavigate,
  onLoginSuccess,
  onToast,
  onOpenScanner,
}) => {
  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('maya.lin@campus.edu');
  const [signInPassword, setSignInPassword] = useState('••••••••••••');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sign Up State
  const [regFullName, setRegFullName] = useState('Maya Lin');
  const [regStudentId, setRegStudentId] = useState('STU-2024-88419');
  const [regEmail, setRegEmail] = useState('m.lin@campus.edu');
  const [regPassword, setRegPassword] = useState('GlacierLibrary#2024');
  const [regConfirmPassword, setRegConfirmPassword] = useState('GlacierLibrary#2024');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Forgot Password State
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      onLoginSuccess({
        name: signInIdentifier.includes('maya') ? 'Maya Lin' : 'Alex Rivera',
        email: signInIdentifier.includes('@') ? signInIdentifier : `${signInIdentifier}@campus.edu`,
        isLoggedIn: true,
        isGuest: false,
      });
      onToast('Authenticated successfully. Welcome back!', 'check_circle');
      onNavigate('home');
    }, 800);
  };

  const handleGuestContinue = () => {
    onLoginSuccess({
      name: 'Guest Scholar',
      email: 'guest@campus.edu',
      isLoggedIn: true,
      isGuest: true,
    });
    onToast('Exploring as Guest. Floorplans & Stacks unlocked.', 'explore');
    onNavigate('home');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      onToast('Please accept the library lending policies', 'error');
      return;
    }
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      onLoginSuccess({
        name: regFullName,
        idNumber: regStudentId,
        email: regEmail,
        isLoggedIn: true,
        isGuest: false,
      });
      onToast(`Welcome, ${regFullName}! Account created.`, 'check_circle');
      onNavigate('home');
    }, 900);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryIdentifier.trim()) return;
    setIsSendingReset(true);
    setTimeout(() => {
      setIsSendingReset(false);
      setRecoverySent(true);
      onToast('Reset link dispatched to campus inbox', 'mark_email_read');
    }, 700);
  };

  // 1. FORGOT PASSWORD SCREEN (Image 1)
  if (screen === 'forgot-password') {
    return (
      <div className="flex flex-col w-full pb-space-2xl max-w-md mx-auto pt-2">
        {/* Subtle Ambient Glow Aura */}
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute -top-6 w-56 h-56 bg-tertiary-fixed-dim/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

          {/* Sub-Nav & Campus SSO Badge */}
          <div className="w-full flex items-center justify-between pt-space-xs pb-space-md">
            <button
              onClick={() => onNavigate('signin')}
              className="inline-flex items-center gap-space-2xs text-primary font-label-md text-label-md py-space-2xs px-space-xs rounded-full hover:bg-surface-container transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Sign In</span>
            </button>
            <div className="flex items-center gap-space-2xs bg-surface-container-low px-space-sm py-1 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Campus SSO
              </span>
            </div>
          </div>

          {/* Illuminated Glacier Emblem */}
          <div className="mt-space-sm mb-space-md flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg scale-110"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-surface-container-lowest to-surface-container-high shadow-md flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock_reset
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Header Section */}
          <div className="text-center px-space-xs mb-space-lg">
            <h1 className="font-headline-lg-mobile text-[26px] text-on-surface mb-space-xs tracking-tight font-bold">
              Forgot your password?
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Don't worry! Enter your registered campus email or student ID, and we'll send you an instant reset link and temporary library access PIN.
            </p>
          </div>

          {/* Interactive Recovery Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-md relative overflow-hidden border border-blue-100/80">
            {/* Decorative Top Rim Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary-fixed via-primary to-primary-container"></div>

            {/* Icon & Status Accent Badge */}
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">mark_email_unread</span>
              </div>
              <div className="min-w-0">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary block font-bold">
                  Account Recovery
                </span>
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate block">
                  Library Identity Verification
                </span>
              </div>
            </div>

            {!recoverySent ? (
              <form onSubmit={handleRecoverySubmit} className="flex flex-col gap-space-md mt-space-2xs">
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-md text-label-md text-on-surface font-medium flex justify-between items-center" htmlFor="recoveryId">
                    <span>University Email or Student ID</span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">Required</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-space-sm text-secondary text-[20px] pointer-events-none">
                      badge
                    </span>
                    <input
                      id="recoveryId"
                      value={recoveryIdentifier}
                      onChange={(e) => setRecoveryIdentifier(e.target.value)}
                      placeholder="e.g. maya.lin@campus.edu or #8841-STU"
                      required
                      type="text"
                      className="w-full h-12 pl-11 pr-space-md rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Helpful In-Person Tip Banner */}
                <div className="rounded-lg bg-surface-container-low p-space-sm flex items-start gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    lightbulb
                  </span>
                  <p className="font-body-sm text-body-sm leading-snug">
                    <span className="font-semibold text-on-surface">Campus Tip:</span> You can also reset credentials instantly at the 1st Floor Central Circulation Desk with your physical student card.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="w-full h-12 mt-space-xs rounded-full bg-primary text-on-primary font-title-md text-title-md flex items-center justify-center gap-space-xs shadow-md active:scale-[0.99] hover:bg-primary-container transition-all font-semibold"
                >
                  {isSendingReset ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      <span>Sending Reset Link...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-space-sm bg-surface-container-high p-space-md rounded-lg animate-in fade-in">
                <div className="flex items-center gap-space-xs text-tertiary">
                  <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
                  <span className="font-title-md text-title-md font-semibold">Dispatch Sent</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                  Check your university inbox for verification code & 1-hour circulating PIN. Didn't arrive? Check spam or re-request below.
                </p>
                <button
                  onClick={() => {
                    setRecoverySent(false);
                    setRecoveryIdentifier('');
                  }}
                  className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold self-start hover:underline mt-1"
                  type="button"
                >
                  <span>Try a different ID</span>
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                </button>
              </div>
            )}

            {/* Secondary Action: Return to Sign In */}
            <button
              onClick={() => onNavigate('signin')}
              className="w-full h-11 rounded-full bg-surface-container-low text-on-surface font-title-md text-title-md flex items-center justify-center gap-space-xs hover:bg-surface-container transition-colors mt-space-2xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">west</span>
              <span>Return to Sign In</span>
            </button>
          </div>

          {/* Support & Circulation Hours */}
          <div className="w-full mt-space-lg flex flex-col items-center gap-space-sm text-center">
            <a
              className="inline-flex items-center gap-space-2xs text-primary font-label-md text-label-md hover:text-primary-container transition-colors group"
              href="mailto:library-support@campus.edu"
            >
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span className="group-hover:underline">Need help? Contact Library IT Support</span>
            </a>

            <div className="flex items-center gap-space-md mt-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                Campus 256-bit SSL
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                Help Desk: 8am - 10pm
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. CREATE ACCOUNT SCREEN (Image 13)
  if (screen === 'signup') {
    return (
      <div className="flex flex-col w-full pb-space-2xl max-w-md mx-auto pt-2">
        {/* Ambient Glow */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-16 -right-12 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-28 -left-12 w-48 h-48 bg-tertiary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Navigation & Welcoming Header */}
          <div className="relative pt-space-xs pb-space-sm px-space-2xs flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('signin')}
                className="inline-flex items-center gap-space-2xs text-primary hover:text-primary-container transition-colors py-space-2xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                <span className="font-label-md text-label-md font-semibold">Return to Sign In</span>
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-secondary tracking-tight font-medium">
                  Fall Semester Pass
                </span>
              </div>
            </div>

            {/* Community Proof Badge */}
            <div className="mt-space-2xs self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low shadow-sm">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-4 w-4 rounded-full bg-primary-container ring-1 ring-surface flex items-center justify-center text-[8px] text-on-primary font-bold">ML</div>
                <div className="inline-block h-4 w-4 rounded-full bg-tertiary ring-1 ring-surface flex items-center justify-center text-[8px] text-on-tertiary font-bold">AK</div>
                <div className="inline-block h-4 w-4 rounded-full bg-secondary ring-1 ring-surface flex items-center justify-center text-[8px] text-on-secondary font-bold">JD</div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Join 14,000+ students navigating stacks
              </span>
            </div>

            {/* Headings */}
            <div className="mt-space-2xs">
              <h1 className="font-headline-lg-mobile text-[26px] text-on-surface tracking-tight font-bold">
                Create your account
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                Get personalized stack wayfinding, instant hold reservations, and overdue alert notifications.
              </p>
            </div>
          </div>

          {/* Registration Form Card */}
          <form
            onSubmit={handleCreateAccount}
            className="relative mt-space-sm bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-xl p-space-lg flex flex-col gap-space-md border border-blue-100/80"
          >
            {/* Field 1: Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="reg-fullname">
                <span>Full Name</span>
                <span className="font-label-sm text-label-sm text-outline font-normal">Legal or preferred</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px] pointer-events-none">
                  person
                </span>
                <input
                  id="reg-fullname"
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md outline-none placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200"
                />
              </div>
            </div>

            {/* Field 2: Student ID */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="reg-studentid">
                <span>Student or Faculty ID</span>
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="font-label-sm text-label-sm text-primary flex items-center gap-0.5 hover:underline"
                >
                  <span className="material-symbols-outlined text-[13px]">help_outline</span>
                  <span>Card Barcode</span>
                </button>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px] pointer-events-none">
                  badge
                </span>
                <input
                  id="reg-studentid"
                  type="text"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  placeholder="e.g. #8841-STU or 9-digit barcode"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-surface-container-low text-on-surface rounded-xl font-call-number text-call-number tracking-wider outline-none placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={onOpenScanner}
                  aria-label="Scan ID barcode"
                  className="absolute right-2.5 p-1 rounded-lg text-primary hover:bg-secondary-container/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                </button>
              </div>
            </div>

            {/* Field 3: Campus Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="reg-email">
                University Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. m.lin@university.edu"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md outline-none placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200"
                />
              </div>
            </div>

            {/* Field 4: Password with strength meter */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="reg-password">
                  Create Password
                </label>
                <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Strong
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="reg-password"
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md outline-none placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-2.5 p-1 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showRegPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* 3-Step Strength Meter */}
              <div className="pt-1 flex items-center gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-tertiary transition-all duration-300"></div>
                <div className="h-1.5 flex-1 rounded-full bg-tertiary transition-all duration-300"></div>
                <div className="h-1.5 flex-1 rounded-full bg-tertiary transition-all duration-300"></div>
              </div>
              <p className="font-body-sm text-body-sm text-outline">
                Must contain letters, numbers & special character
              </p>
            </div>

            {/* Field 5: Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="reg-confirm">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px] pointer-events-none">
                  lock_reset
                </span>
                <input
                  id="reg-confirm"
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md outline-none placeholder:text-outline/70 focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200"
                />
                <span className="material-symbols-outlined absolute right-3.5 text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </div>

            {/* Shelf Floorplan Preview Delight */}
            <div className="p-3 bg-surface-container-low/70 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">map</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-medium truncate">
                  Smart Campus Stacks Sync
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Ready to pin shelf-levels in Main & Science Stacks
                </p>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            </div>

            {/* Terms and Conditions Checkbox */}
            <label className="flex items-start gap-3 select-none cursor-pointer pt-1 group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant flex-1 leading-snug">
                I agree to the{' '}
                <a className="text-primary font-medium underline underline-offset-2 hover:text-primary-container" href="#policies">
                  Campus Library Lending Policies
                </a>{' '}
                and acknowledge data retention terms.
              </span>
            </label>

            {/* Primary Action CTA */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-md text-title-md font-semibold tracking-wide shadow-md active:scale-[0.99] transition-transform duration-100 flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Setting up your desk...</span>
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>

            {/* Inline Footer Re-routing */}
            <div className="text-center pt-2 pb-1">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already registered?
                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="text-primary font-semibold hover:text-primary-container underline underline-offset-4 ml-1"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>

          {/* Security & Institutional Assurance */}
          <div className="mt-space-md flex items-center justify-center gap-4 text-outline px-4 text-center">
            <div className="flex items-center gap-1 font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px]">lock</span>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
            <div className="flex items-center gap-1 font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px]">school</span>
              <span>EDU Federated ID</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. SIGN IN SCREEN (Image 7)
  return (
    <div className="flex flex-col w-full pb-space-2xl relative overflow-hidden max-w-md mx-auto pt-2">
      {/* Subtle Ambient Ice Reflections */}
      <div className="absolute -top-12 -left-16 w-56 h-56 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none"></div>
      <div className="absolute top-48 -right-16 w-64 h-64 rounded-full bg-tertiary-fixed-dim/20 blur-3xl pointer-events-none"></div>

      {/* Hero Header Section */}
      <section className="flex flex-col items-center text-center pt-space-md pb-space-lg px-space-xs relative z-10">
        {/* Glowing Brand Ring & Emblem */}
        <div className="relative flex items-center justify-center mb-space-sm">
          <div className="absolute inset-0 rounded-full bg-primary-container/20 blur-md transform scale-125"></div>
          <div className="relative w-20 h-20 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center p-2 border border-blue-100">
            {/* Logo Emblem */}
            <div className="w-14 h-14 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
                <rect x="2" y="2" width="96" height="96" rx="26" fill="#0b1326" stroke="#1d2948" strokeWidth="3" />
                <circle cx="50" cy="24" r="16" fill="#f59e0b" fillOpacity="0.25" filter="blur(4px)" />
                <line x1="50" y1="12" x2="50" y2="17" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="39" y1="24" x2="44" y2="24" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <line x1="56" y1="24" x2="61" y2="24" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="24" r="7" fill="#f59e0b" />
                <rect x="48" y="30" width="4" height="36" rx="2" fill="#ffffff" />
                <path d="M 48 35 C 38 34, 28 36, 22 38 L 22 66 C 28 64, 38 62, 48 64 Z" fill="#3b82f6" />
                <path d="M 52 35 C 62 34, 72 36, 78 38 L 78 66 C 72 64, 62 62, 52 64 Z" fill="#2563eb" />
                <path d="M 64 63 L 74 63 L 74 74 L 69 70 L 64 74 Z" fill="#f43f5e" />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center border border-blue-100">
            <span className="material-symbols-outlined text-primary text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_library
            </span>
          </div>
        </div>

        {/* Title & Taglines */}
        <div className="flex items-center gap-1.5 justify-center mb-space-2xs">
          <h1 className="font-headline-lg-mobile text-[28px] text-on-surface font-bold tracking-tight">
            LibFind
          </h1>
          <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
            Stacks v2.4
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-secondary mb-space-sm">Your library, just a search away.</p>
        <div className="mt-space-2xs">
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Welcome back!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
            Sign in to continue exploring your campus catalog.
          </p>
        </div>
      </section>

      {/* Main Login Card (Frosted Minimalist) */}
      <section className="w-full relative z-10">
        <div className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-xl shadow-lg shadow-primary/5 p-space-lg border border-blue-100/80">
          <form onSubmit={handleSignIn} className="flex flex-col gap-space-md">
            {/* Field 1: Identifier */}
            <div className="flex flex-col gap-space-2xs text-left">
              <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between" htmlFor="identifier">
                <span>Email or Student ID</span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Campus Auth</span>
              </label>
              <div className="relative flex items-center rounded-lg bg-surface-container-low focus-within:bg-surface-container-lowest transition-colors shadow-inner">
                <span className="material-symbols-outlined absolute left-space-sm text-secondary text-[20px] pointer-events-none">
                  badge
                </span>
                <input
                  id="identifier"
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="e.g. maya.lin@campus.edu or #8841-STU"
                  required
                  type="text"
                  className="w-full bg-transparent py-3 pl-11 pr-space-md text-on-surface font-body-md text-body-md placeholder:text-outline/60 outline-none rounded-lg focus:shadow-[0_0_0_2px_#007bb9]"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="flex flex-col gap-space-2xs text-left">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="font-label-md text-label-md text-primary font-semibold hover:underline active:opacity-75 transition-opacity"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center rounded-lg bg-surface-container-low focus-within:bg-surface-container-lowest transition-colors shadow-inner">
                <span className="material-symbols-outlined absolute left-space-sm text-secondary text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  type={showSignInPassword ? 'text' : 'password'}
                  className="w-full bg-transparent py-3 pl-11 pr-11 text-on-surface font-body-md text-body-md placeholder:text-outline/60 outline-none rounded-lg focus:shadow-[0_0_0_2px_#007bb9]"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-space-xs w-9 h-9 flex items-center justify-center text-secondary hover:text-on-surface active:scale-95 transition-all rounded-full"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showSignInPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Options: Remember Me */}
            <div className="flex items-center justify-between pt-space-2xs">
              <label className="flex items-center gap-space-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span className="font-body-sm text-body-sm text-on-surface font-medium">Keep me signed in</span>
              </label>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">lock_reset</span> 30 days
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="pt-space-xs">
              <button
                type="submit"
                disabled={isSigningIn}
                className="relative overflow-hidden w-full h-12 rounded-full bg-primary-container text-on-primary-container font-title-md text-title-md font-semibold flex items-center justify-center shadow-md active:scale-[0.98] transition-all hover:bg-primary"
              >
                {isSigningIn ? (
                  <span className="flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Accessing Stacks...</span>
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center gap-space-xs text-white">
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-space-2xs">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="font-title-md text-body-sm text-primary font-bold hover:underline ml-1"
                >
                  Create Account
                </button>
              </p>
            </div>

            {/* Soft Visual Separator */}
            <div className="flex items-center gap-space-sm my-space-xs">
              <div className="flex-1 h-px bg-surface-container-highest"></div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">Or</span>
              <div className="flex-1 h-px bg-surface-container-highest"></div>
            </div>

            {/* Guest Access Action Card */}
            <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-col gap-space-2xs text-left shadow-sm">
              <button
                onClick={handleGuestContinue}
                type="button"
                className="w-full py-2.5 px-space-md rounded-full bg-surface-container-lowest text-primary font-title-md text-title-md font-semibold flex items-center justify-center gap-space-xs shadow-sm hover:bg-secondary-container/40 active:scale-[0.98] transition-all"
              >
                <span>Continue as Guest</span>
                <span className="material-symbols-outlined text-[18px]">explore</span>
              </button>
              <p className="font-body-sm text-body-sm text-center text-on-surface-variant px-space-xs pt-1">
                Browse full catalog & live physical stack floorplans without logging in.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Scholarly Footer Info */}
      <footer className="mt-space-lg flex flex-col items-center justify-center gap-space-2xs text-center z-10">
        <div className="flex items-center gap-space-sm text-secondary">
          <span className="flex items-center gap-1 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
            EduID Protected
          </span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span className="flex items-center gap-1 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[15px] text-primary">wifi_protected_setup</span>
            Campus VPN Compatible
          </span>
        </div>
        <div className="flex items-center gap-space-md mt-space-2xs font-body-sm text-body-sm text-secondary">
          <a className="hover:underline" href="#help">Catalog Help Desk</a>
          <span>•</span>
          <a className="hover:underline" href="#privacy">Privacy Charter</a>
        </div>
      </footer>
    </div>
  );
};
