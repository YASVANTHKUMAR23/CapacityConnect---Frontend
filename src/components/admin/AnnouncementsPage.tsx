import React, { useState } from 'react';
import {
  Calendar,
  Edit2,
  MoreHorizontal,
  Plus,
  Trash2,
  Check,
  Megaphone,
  Pin,
  Copy,
  Globe,
  Eye,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import { AnnouncementItem } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { ScrollDrivenTable } from './ScrollDrivenTable';

interface AnnouncementsPageProps {
  showToast: (msg: string) => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ showToast }) => {
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    selectedAnnouncementId,
    setSelectedAnnouncementId,
  } = useAdminData();

  const [activeFilter, setActiveFilter] = useState('All');
  const [openActionDropdownId, setOpenActionDropdownId] = useState<string | null>(null);

  // Find currently selected announcement or default to first
  const currentAnn =
    announcements.find((a) => a.id === selectedAnnouncementId) || announcements[0];

  // Form states for the right-hand editing panel
  const [formType, setFormType] = useState<AnnouncementItem['type']>(currentAnn?.type || 'Announcement');
  const [formTitle, setFormTitle] = useState(currentAnn?.title || '');
  const [formMessage, setFormMessage] = useState(currentAnn?.message || '');
  const [formPublishOn, setFormPublishOn] = useState(currentAnn?.publishOn || '25 Oct 2026, 09:00');
  const [formIsPinned, setFormIsPinned] = useState(currentAnn?.isPinned || false);
  const [formImageUrl, setFormImageUrl] = useState<string>(currentAnn?.imageUrl || '');

  // Sync form when selected announcement changes
  const handleSelectAnnouncement = (item: AnnouncementItem) => {
    setSelectedAnnouncementId(item.id);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormMessage(item.message);
    setFormPublishOn(item.publishOn);
    setFormIsPinned(item.isPinned);
    setFormImageUrl(item.imageUrl || '');
  };

  const handleCreateNew = () => {
    const newItem: Omit<AnnouncementItem, 'id'> = {
      title: 'New IMD Advisory Bulletin',
      type: 'Announcement',
      status: 'Draft',
      date: 'Today',
      message: 'Draft bulletin details regarding upcoming training curriculum.',
      publishOn: '28 Oct 2026, 10:00',
      isPinned: false,
      imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
    };
    addAnnouncement(newItem);
    showToast('New announcement draft created.');
  };

  const handleSavePublish = () => {
    if (!currentAnn) return;
    updateAnnouncement(currentAnn.id, {
      title: formTitle,
      type: formType,
      message: formMessage,
      publishOn: formPublishOn,
      isPinned: formIsPinned,
      imageUrl: formImageUrl,
      status: 'Published',
      date: 'Today',
    });
    showToast(`Published "${formTitle}" to homepage.`);
  };

  const handleSaveDraft = () => {
    if (!currentAnn) return;
    updateAnnouncement(currentAnn.id, {
      title: formTitle,
      type: formType,
      message: formMessage,
      publishOn: formPublishOn,
      isPinned: formIsPinned,
      imageUrl: formImageUrl,
      status: 'Draft',
    });
    showToast('Saved announcement as draft.');
  };

  const handleDelete = () => {
    if (!currentAnn) return;
    deleteAnnouncement(currentAnn.id);
    showToast('Announcement removed.');
  };

  // Filter list
  const filteredAnnouncements = announcements.filter((a) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Notifications') return a.type === 'Notification';
    if (activeFilter === 'Announcements') return a.type === 'Announcement';
    if (activeFilter === 'Achievements') return a.type === 'Achievement';
    if (activeFilter === 'New content') return a.type === 'New content';
    return true;
  });

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills matching 07-announcements.png */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              activeFilter === 'All'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            All <span className="opacity-80 ml-0.5">18</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('Notifications')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              activeFilter === 'Notifications'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Notifications
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('Announcements')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              activeFilter === 'Announcements'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Announcements
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('Achievements')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              activeFilter === 'Achievements'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Achievements
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('New content')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              activeFilter === 'New content'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            New content
          </button>
        </div>

        {/* Create announcement button */}
        <button
          type="button"
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create announcement</span>
        </button>
      </div>

      {/* Main 2-column split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Announcements Table (8 cols) */}
        <div className="lg:col-span-8 w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
          <ScrollDrivenTable minWidth="min-w-[680px]">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[240px]">Title</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[140px]">Type</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px]">Status</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px]">Date</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAnnouncements.map((item) => {
                  const isSelected = item.id === currentAnn?.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectAnnouncement(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {item.isPinned && (
                            <span className="w-2 h-2 rounded-full bg-blue-600" title="Pinned to homepage banner" />
                          )}
                          <span className="font-semibold text-slate-900 line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                        {item.status === 'Published' && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        )}
                        {item.status === 'Scheduled' && (
                          <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Scheduled
                          </span>
                        )}
                        {item.status === 'Draft' && (
                          <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-500">{item.date}</td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-right relative">
                        <div className="flex items-center justify-end gap-1.5 text-slate-400">
                          {/* Quick Pin Action */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newPinned = !item.isPinned;
                              updateAnnouncement(item.id, { isPinned: newPinned });
                              if (item.id === currentAnn?.id) setFormIsPinned(newPinned);
                              showToast(newPinned ? `Pinned "${item.title}" to homepage banner.` : `Unpinned "${item.title}".`);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              item.isPinned
                                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                : 'hover:text-blue-600 hover:bg-slate-100'
                            }`}
                            title={item.isPinned ? 'Unpin from homepage banner' : 'Pin to homepage banner'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Edit in Panel Action */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAnnouncement(item);
                              showToast(`Editing "${item.title}" in panel.`);
                            }}
                            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit announcement"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* More Options Dropdown Toggle */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionDropdownId(openActionDropdownId === item.id ? null : item.id);
                              }}
                              className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="More actions"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu */}
                            {openActionDropdownId === item.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-1 w-48 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs text-left animate-in fade-in zoom-in-95 duration-100"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSelectAnnouncement(item);
                                    setOpenActionDropdownId(null);
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Edit details</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextStatus = item.status === 'Published' ? 'Draft' : 'Published';
                                    updateAnnouncement(item.id, { status: nextStatus });
                                    showToast(`Status updated: "${item.title}" is now ${nextStatus}.`);
                                    setOpenActionDropdownId(null);
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                                >
                                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{item.status === 'Published' ? 'Revert to Draft' : 'Publish to Homepage'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const duplicatedItem: Omit<AnnouncementItem, 'id'> = {
                                      title: `${item.title} (Copy)`,
                                      type: item.type,
                                      status: 'Draft',
                                      date: 'Today',
                                      message: item.message,
                                      publishOn: item.publishOn,
                                      isPinned: false,
                                    };
                                    addAnnouncement(duplicatedItem);
                                    showToast(`Duplicated announcement as draft.`);
                                    setOpenActionDropdownId(null);
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Duplicate announcement</span>
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteAnnouncement(item.id);
                                    showToast(`Removed "${item.title}".`);
                                    setOpenActionDropdownId(null);
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 text-rose-600 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Delete announcement</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollDrivenTable>
        </div>

        {/* Right Column: Edit Announcement Panel (4 cols) matching 07-announcements.png */}
        <div className="lg:col-span-4 w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Edit announcement</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                currentAnn?.status === 'Published'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              • {currentAnn?.status || 'Draft'}
            </span>
          </div>

          {/* Form */}
          <div className="space-y-4 text-xs">
            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as AnnouncementItem['type'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
              >
                <option value="Announcement">Announcement</option>
                <option value="New content">New content</option>
                <option value="Achievement">Achievement</option>
                <option value="Notification">Notification</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            {/* Publish on */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Publish on
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formPublishOn}
                  onChange={(e) => setFormPublishOn(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Media Attachment / Image Upload Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Announcement Cover Image</span>
                </label>
                {formImageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('')}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                id="announcement-file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      showToast('File size exceeds 5MB limit.');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const result = event.target?.result as string;
                      if (result) {
                        setFormImageUrl(result);
                        showToast(`Uploaded image "${file.name}".`);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              {/* Upload Dropzone or Preview */}
              {formImageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 mb-2 group aspect-[16/9] max-h-36 bg-slate-900">
                  <img
                    src={formImageUrl}
                    alt="Announcement banner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-2.5">
                    <span className="text-[10px] text-white/90 font-medium truncate">
                      Image attached
                    </span>
                    <label
                      htmlFor="announcement-file-upload"
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-md text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      Change image
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="announcement-file-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        if (result) {
                          setFormImageUrl(result);
                          showToast(`Uploaded image "${file.name}".`);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-xl p-4 text-center bg-blue-50/30 hover:bg-blue-50/60 transition-colors cursor-pointer block mb-2"
                >
                  <Upload className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-800 font-semibold">
                    Click to upload image
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    PNG, JPG, WebP or SVG up to 5MB (Drag & drop supported)
                  </p>
                </label>
              )}

              {/* Quick Meteorological Presets */}
              <div className="mt-2">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">
                  Or select official IMD sample banner:
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: 'Cyclone Radar', url: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80' },
                    { label: 'Doppler Tower', url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&auto=format&fit=crop&q=80' },
                    { label: 'INSAT Satellite', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
                    { label: 'AWS Weather Station', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormImageUrl(preset.url)}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pin to homepage banner switch */}
            <div className="flex items-center justify-between pt-2 pb-1">
              <div>
                <span className="block text-xs font-semibold text-slate-800">
                  Pin to homepage banner
                </span>
                <span className="text-[11px] text-slate-400">
                  Featured on dashboard announcement card
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormIsPinned(!formIsPinned)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  formIsPinned ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    formIsPinned ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSavePublish}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-center"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-medium py-2.5 rounded-xl transition-colors cursor-pointer text-center"
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                title="Delete announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
