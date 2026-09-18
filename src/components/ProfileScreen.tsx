import React, { useState } from 'react';
import { ScreenName, UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onNavigate,
  onLogout,
  onToast,
}) => {
  const [beaconAlerts, setBeaconAlerts] = useState(true);
  const [smsOverdue, setSmsOverdue] = useState(true);
  const [wifiAutoDetect, setWifiAutoDetect] = useState(true);

  return (
    <div className="flex flex-col w-full space-y-4 pb-28 max-w-md mx-auto">
      {/* Profile Overview Card */}
      <section className="rounded-2xl bg-white p-5 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] flex flex-col items-center text-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-sky-100 shadow-md mb-3">
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        </div>

        <h2 className="font-headline-sm text-lg font-bold text-[#0b192c]">{user.name}</h2>
        <p className="font-caption text-xs text-slate-500 mt-0.5">{user.email}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="font-mono text-xs font-bold text-[#0284c7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            {user.idNumber}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {user.division}
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-100 text-center">
          <div>
            <span className="font-bold text-base text-[#0b192c]">14</span>
            <span className="font-caption text-[11px] text-slate-400 block">Total Read</span>
          </div>
          <div className="border-x border-slate-100">
            <span className="font-bold text-base text-emerald-600">100%</span>
            <span className="font-caption text-[11px] text-slate-400 block">On-Time Return</span>
          </div>
          <div>
            <span className="font-bold text-base text-[#0284c7]">2</span>
            <span className="font-caption text-[11px] text-slate-400 block">Active Loans</span>
          </div>
        </div>
      </section>

      {/* Library Preferences & Sensors */}
      <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] space-y-3">
        <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
          Stacks Telemetry & Preferences
        </h3>

        <div className="space-y-3 divide-y divide-slate-100 text-xs">
          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#0b192c]">LiFi & Beacon Wayfinding</p>
              <p className="text-slate-500 text-[11px]">Auto-connect to shelf micro-beacons</p>
            </div>
            <input
              type="checkbox"
              checked={beaconAlerts}
              onChange={(e) => {
                setBeaconAlerts(e.target.checked);
                onToast(
                  e.target.checked ? 'Beacon telemetry enabled' : 'Beacon telemetry muted',
                  'sensors'
                );
              }}
              className="rounded text-[#0284c7] focus:ring-[#0284c7] h-4 w-4"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#0b192c]">Due Date & Hold Alerts</p>
              <p className="text-slate-500 text-[11px]">Receive 48h notice before due date</p>
            </div>
            <input
              type="checkbox"
              checked={smsOverdue}
              onChange={(e) => {
                setSmsOverdue(e.target.checked);
                onToast('Notification preferences updated', 'notifications');
              }}
              className="rounded text-[#0284c7] focus:ring-[#0284c7] h-4 w-4"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#0b192c]">Campus Eduroam Auto-Sync</p>
              <p className="text-slate-500 text-[11px]">Download offline floorplans in advance</p>
            </div>
            <input
              type="checkbox"
              checked={wifiAutoDetect}
              onChange={(e) => setWifiAutoDetect(e.target.checked)}
              className="rounded text-[#0284c7] focus:ring-[#0284c7] h-4 w-4"
            />
          </div>
        </div>
      </section>

      {/* Campus Support & Library Hours */}
      <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] space-y-2">
        <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
          Central Library Info
        </h3>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between py-1">
            <span className="font-medium text-slate-500">Stacks Hours</span>
            <span className="font-bold text-[#0b192c]">Mon–Sun: 7:30 AM – 1:00 AM</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-medium text-slate-500">Holds Locker Access</span>
            <span className="font-bold text-[#0b192c]">24/7 with Student Card</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-medium text-slate-500">Circulation Help Desk</span>
            <span className="font-bold text-[#0284c7]">Floor 1 Central Rotunda</span>
          </div>
        </div>
      </section>

      {/* Auth & Logout Actions */}
      <div className="space-y-2 pt-2">
        {!user.isLoggedIn || user.isGuest ? (
          <button
            type="button"
            onClick={() => onNavigate('signin')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-bold text-xs shadow-md active:scale-98 transition-transform"
          >
            Sign In with Campus SSO
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onNavigate('signin')}
              className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Switch Account
            </button>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onToast('Logged out of LibFind', 'logout');
                onNavigate('signin');
              }}
              className="w-full py-2.5 text-red-600 font-bold text-xs hover:bg-red-50 rounded-xl transition-colors"
            >
              Sign Out of Campus Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};
