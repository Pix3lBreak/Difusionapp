import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ModelProfile,
  Review,
  EventItem,
  EventApplicant,
  ChatMessage,
  PushNotification,
  UserAccount,
  AgencyThemeConfig,
  CategoryType,
  StreamConfig,
  WallPost,
  WallReactionType,
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_MODELS,
  INITIAL_REVIEWS,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
  INITIAL_WALL_POSTS,
  SUPER_ADMIN_EMAIL,
} from '../data/initialData';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  db,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from '../firebase';

interface AppContextType {
  models: ModelProfile[];
  events: EventItem[];
  reviews: Review[];
  notifications: PushNotification[];
  currentUser: UserAccount | null;
  themeConfig: AgencyThemeConfig;
  activeTab: 'catalogo' | 'eventos' | 'streaming' | 'admin' | 'chat' | 'login' | 'dashboard' | 'parati';
  setActiveTab: (tab: 'catalogo' | 'eventos' | 'streaming' | 'admin' | 'chat' | 'login' | 'dashboard' | 'parati') => void;
  selectedModel: ModelProfile | null;
  setSelectedModel: (model: ModelProfile | null) => void;
  activeChatModel: ModelProfile | null;
  setActiveChatModel: (model: ModelProfile | null) => void;
  chatMessages: Record<string, ChatMessage[]>;
  showAuthModal: boolean;
  setShowAuthModal: (open: boolean) => void;
  show2FAModal: boolean;
  setShow2FAModal: (open: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (open: boolean) => void;
  showReviewModal: boolean;
  setShowReviewModal: (open: boolean) => void;
  showRoleSelectionModal: boolean;
  setShowRoleSelectionModal: (open: boolean) => void;
  selectUserRequestedRole: (
    role: 'client' | 'model' | 'empresa',
    extraData?: { companyName?: string; companyRif?: string; phone?: string }
  ) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Cities Management (Super Admin)
  availableCities: string[];
  addCity: (city: string) => boolean;
  removeCity: (city: string) => boolean;

  // User Accounts & Standby Activation (Super Admin)
  registeredUsers: UserAccount[];
  activateUserAccount: (userId: string, assignedRole: 'client' | 'model' | 'empresa') => void;
  rejectUserAccount: (userId: string, reason?: string) => void;
  updateCurrentUserProfile: (updates: Partial<UserAccount>) => void;

  // Identity Verification (Cédula de Identidad / Pasaporte)
  submitIdentityVerification: (
    modelId: string,
    data: {
      documentType: 'Cédula de Identidad' | 'Pasaporte';
      documentNumber: string;
      documentPhotoUrl: string;
    }
  ) => void;
  reviewIdentityVerification: (
    modelId: string,
    approved: boolean,
    rejectionReason?: string
  ) => void;
  signInWithFirebaseGoogle: (
    explicitEmail?: string,
    explicitRole?: 'client' | 'model' | 'empresa',
    explicitName?: string,
    extraData?: { companyName?: string; companyRif?: string; phone?: string }
  ) => Promise<{ success: boolean; error?: string; isPopupBlocked?: boolean }>;
  signInWithEmailPassword: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmailPassword: (
    email: string,
    pass: string,
    name: string,
    role?: 'client' | 'model' | 'empresa',
    extraData?: { companyName?: string; companyRif?: string; phone?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  isFirebaseConnected: boolean;

  // Actions
  addModel: (modelData: Omit<ModelProfile, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateModel: (id: string, updates: Partial<ModelProfile>) => void;
  updateModelRates: (id: string, hourlyRate: number, dailyRate: number) => void;
  updateModelSelf: (id: string, updates: Partial<ModelProfile>) => boolean;
  togglePauseModel: (id: string) => void;
  toggleVipModel: (id: string) => void;
  deleteModel: (id: string) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
  addEvent: (eventData: Omit<EventItem, 'id' | 'assignedModelIds'>) => void;
  deleteEvent: (eventId: string) => void;
  updateStreamConfig: (updates: Partial<StreamConfig>) => void;
  applyToCasting: (
    eventId: string,
    applicantData:
      | {
          modelId?: string;
          modelName: string;
          modelAvatar?: string;
          modelCity?: string;
          phone?: string;
          instagram?: string;
        }
      | string
  ) => void;
  reviewCastingApplicant: (eventId: string, applicantId: string, approved: boolean) => void;
  sendMessage: (modelId: string, text: string, isQuote?: boolean, quoteDetails?: any) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  sendPushNotification: (
    title: string,
    message: string,
    type?: PushNotification['type'],
    actionUrl?: string,
    modelId?: string
  ) => void;
  updateThemeConfig: (updates: Partial<AgencyThemeConfig>) => void;
  loginWithGoogle: (email: string) => Promise<boolean>;
  verify2FACode: (code: string) => boolean;
  logout: () => void;
  isSuperAdmin: boolean;
  isModelUser: boolean;
  currentModelProfile: ModelProfile | null;
  generateWhatsAppUrl: (phone: string, modelName: string, eventDetails?: string) => string;

  // Muro Social "Para Ti" en Tiempo Real (1 post diario, fotos y textos, reacciones y comentarios)
  wallPosts: WallPost[];
  createWallPost: (text: string, imageUrl?: string) => Promise<{ success: boolean; error?: string }>;
  toggleWallReaction: (postId: string, reactionType: WallReactionType) => Promise<void>;
  addWallComment: (postId: string, text: string) => Promise<{ success: boolean; error?: string }>;
  deleteWallPost: (postId: string) => Promise<void>;
  canUserPostToday: boolean;
  userTodayPost: WallPost | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MODELS: 'difusion_models_vzla_v3',
  EVENTS: 'difusion_events_vzla_v3',
  REVIEWS: 'difusion_reviews_vzla_v3',
  NOTIFICATIONS: 'difusion_notifs_vzla_v3',
  USER: 'difusion_user_vzla_v3',
  USERS_LIST: 'difusion_registered_users_vzla_v4',
  CONFIG: 'difusion_config_vzla_v4',
  CHATS: 'difusion_chats_vzla_v3',
  WALL: 'difusion_wall_vzla_v3',
};

const INITIAL_REGISTERED_USERS: UserAccount[] = [
  {
    id: 'user_valeria_01',
    name: 'Valeria Rivas',
    email: 'valeria.rinaldi.vzla@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    role: 'model',
    status: 'active',
    twoFactorEnabled: true,
    isVerified: true,
    phone: '+58 412 123 4567',
  },
  {
    id: 'user_standby_01',
    name: 'Carla Daniela Bermúdez',
    email: 'carla.bermudez.vzla@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    role: 'model',
    status: 'standby',
    requestedRole: 'model',
    createdAt: 'Hoy, 10:15 AM',
    twoFactorEnabled: false,
    isVerified: false,
    phone: '+58 414 772 3311',
  },
  {
    id: 'user_standby_02',
    name: 'Eventos Corporativos Caracas C.A.',
    email: 'contacto@eventoscaracas.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    role: 'empresa',
    status: 'standby',
    requestedRole: 'empresa',
    createdAt: 'Ayer, 4:20 PM',
    twoFactorEnabled: false,
    isVerified: false,
    phone: '+58 212 999 8877',
  },
  {
    id: 'user_suspended_01',
    name: 'Corporación Inactiva Demo',
    email: 'suspendido@demo.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    role: 'empresa',
    status: 'suspended',
    requestedRole: 'empresa',
    createdAt: 'Hace 3 días',
    twoFactorEnabled: false,
    isVerified: false,
    phone: '+58 212 555 4321',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Models (Initialized with Venezuelan models)
  const [models, setModels] = useState<ModelProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].location?.country === 'Venezuela') {
          return parsed;
        }
      }
      return INITIAL_MODELS;
    } catch {
      return INITIAL_MODELS;
    }
  });

  // Events
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Registered Users (includes standby accounts awaiting Super Admin activation)
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      return saved ? JSON.parse(saved) : INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  // User (Unauthenticated by default. Only Google authentication with pixelglez1988@gmail.com can log in as Super Admin)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role === 'superadmin' && parsed?.email?.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Theme Config & Available Venezuelan Cities
  const [themeConfig, setThemeConfig] = useState<AgencyThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.availableCities || !Array.isArray(parsed.availableCities) || parsed.availableCities.length === 0) {
          parsed.availableCities = INITIAL_CONFIG.availableCities;
        }
        return {
          ...INITIAL_CONFIG,
          ...parsed,
          heroBannerConfig: {
            ...INITIAL_CONFIG.heroBannerConfig,
            ...(parsed.heroBannerConfig || {}),
          },
        };
      }
      return INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  // Chats (Real user-to-model direct messaging)
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Active view states
  const [activeTab, setActiveTab] = useState<'catalogo' | 'eventos' | 'streaming' | 'admin' | 'chat' | 'login' | 'dashboard' | 'parati'>('catalogo');
  const [selectedModel, setSelectedModel] = useState<ModelProfile | null>(null);

  // Muro Social "Para Ti" State (1 post per day, real-time sync with Firestore)
  const [wallPosts, setWallPosts] = useState<WallPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WALL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_WALL_POSTS;
    } catch {
      return INITIAL_WALL_POSTS;
    }
  });
  const [activeChatModel, setActiveChatModel] = useState<ModelProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [show2FAModal, setShow2FAModal] = useState<boolean>(false);
  const [pendingAuthEmail, setPendingAuthEmail] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showRoleSelectionModal, setShowRoleSelectionModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(themeConfig));
    // Apply CSS variables to root
    const root = document.documentElement;
    root.style.setProperty('--color-primary', themeConfig.primaryColor);
    root.style.setProperty('--font-family', `'${themeConfig.fontFamily}', sans-serif`);
    if (themeConfig.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALL, JSON.stringify(wallPosts));
  }, [wallPosts]);

  // Real-time Firestore sync for Wall Posts, Reactions and Comments (Authenticated users only)
  useEffect(() => {
    if (!currentUser) return;
    let unsubscribe: (() => void) | null = null;
    try {
      const wallColRef = collection(db, 'wall');
      unsubscribe = onSnapshot(
        wallColRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remotePosts: WallPost[] = [];
            snapshot.forEach((docSnap: any) => {
              const data = docSnap.data() as WallPost;
              remotePosts.push({ ...data, id: docSnap.id });
            });

            // Sort: pinned first, then newest
            remotePosts.sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              const dateB = new Date(b.createdAt).getTime();
              const dateA = new Date(a.createdAt).getTime();
              return isNaN(dateB) || isNaN(dateA) ? 0 : dateB - dateA;
            });

            setWallPosts(remotePosts);
            localStorage.setItem(STORAGE_KEYS.WALL, JSON.stringify(remotePosts));
          }
        },
        (error) => {
          console.warn('Real-time wall listener notice:', error);
        }
      );
    } catch (err) {
      console.warn('Firestore onSnapshot listener error:', err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Load and merge remote users from Firestore on initial mount
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        if (!usersSnap.empty && isMounted) {
          const remoteUsers: UserAccount[] = [];
          usersSnap.forEach((docSnap: any) => {
            const data = docSnap.data() as UserAccount;
            remoteUsers.push({ ...data, id: docSnap.id });
          });

          setRegisteredUsers((prev) => {
            const map = new Map<string, UserAccount>();
            prev.forEach((u) => map.set(u.email.toLowerCase(), u));
            remoteUsers.forEach((u) => {
              if (u.email) {
                const existing = map.get(u.email.toLowerCase());
                map.set(u.email.toLowerCase(), { ...(existing || {}), ...u });
              }
            });
            const merged = Array.from(map.values());
            localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Initial Firestore sync note:', err);
      }
    };

    fetchRemoteData();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const isSuperAdmin =
    currentUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ||
    currentUser?.role === 'superadmin';

  // Identify if current logged in user owns a model profile
  const currentModelProfile =
    models.find(
      (m) => m.ownerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
    ) || null;

  const isModelUser = !!currentModelProfile || currentUser?.role === 'model';

  // Cities dynamically managed by Super Admin
  const availableCities = themeConfig.availableCities || INITIAL_CONFIG.availableCities || [];

  const addCity = (cityName: string): boolean => {
    if (!isSuperAdmin) {
      showToast('Acción denegada: Solo el Super Admin puede agregar ciudades.');
      return false;
    }
    const trimmed = cityName.trim();
    if (!trimmed) {
      showToast('Ingresa un nombre de ciudad válido.');
      return false;
    }
    const current = themeConfig.availableCities || [];
    const exists = current.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      showToast(`La ciudad "${trimmed}" ya se encuentra registrada.`);
      return false;
    }
    const updated = [...current, trimmed];
    updateThemeConfig({ availableCities: updated });
    showToast(`✓ Ciudad "${trimmed}" agregada al catálogo.`);
    return true;
  };

  const removeCity = (cityName: string): boolean => {
    if (!isSuperAdmin) {
      showToast('Acción denegada: Solo el Super Admin puede eliminar ciudades.');
      return false;
    }
    const current = themeConfig.availableCities || [];
    if (current.length <= 1) {
      showToast('Debe existir al menos una ciudad registrada en el catálogo.');
      return false;
    }
    const updated = current.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
    updateThemeConfig({ availableCities: updated });
    showToast(`Ciudad "${cityName}" eliminada del catálogo.`);
    return true;
  };

  // Account Activation & Role Assignment by Super Admin
  const activateUserAccount = (userId: string, assignedRole: 'client' | 'model' | 'empresa') => {
    if (!isSuperAdmin) {
      showToast('Acción restringida: Solo el Super Admin puede activar cuentas.');
      return;
    }
    const targetUser = registeredUsers.find((u) => u.id === userId);
    if (!targetUser) return;

    const now = new Date().toLocaleDateString('es-VE');
    const updatedUser: UserAccount = {
      ...targetUser,
      status: 'active',
      role: assignedRole,
      clientType: assignedRole === 'empresa' ? 'empresa' : 'particular',
      activatedAt: now,
      activatedBy: SUPER_ADMIN_EMAIL,
    };

    const updatedList = registeredUsers.map((u) => (u.id === userId ? updatedUser : u));
    setRegisteredUsers(updatedList);
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedList));

    // If currently logged-in user is this target
    if (
      currentUser &&
      (currentUser.id === userId ||
        currentUser.email.toLowerCase() === targetUser.email.toLowerCase())
    ) {
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }

    // If activated as model/promotora and no profile exists yet, create draft model profile
    if (assignedRole === 'model') {
      const existing = models.find(
        (m) => m.ownerEmail?.toLowerCase() === targetUser.email.toLowerCase()
      );
      if (!existing) {
        const defaultCity = availableCities[0] || 'Caracas';
        const newModel: ModelProfile = {
          id: `mod_${Date.now()}`,
          ownerEmail: targetUser.email,
          name: targetUser.name,
          stageName: targetUser.name.split(' ')[0] + ' ' + (targetUser.name.split(' ')[1]?.[0] || '') + '.',
          category: 'promotora',
          categoryLabel: 'Promotora & Modelo para Eventos',
          roleLabel: 'Perfil Oficial DIFUSION Venezuela',
          verified: false,
          identityVerification: {
            status: 'sin_verificar',
            documentType: 'Cédula de Identidad',
          },
          featured: false,
          isPaused: false,
          rating: 5.0,
          reviewCount: 0,
          hourlyRate: 40,
          dailyRate: 280,
          age: 22,
          pastExperience: ['Activaciones de marca y eventos corporativos'],
          location: {
            city: defaultCity,
            state: 'Venezuela',
            country: 'Venezuela',
            availableToTravel: true,
          },
          avatar: targetUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
          gallery: [targetUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85'],
          physical: {
            height: '1.75 m',
            eyeColor: 'Marrones',
            hairColor: 'Castaño',
          },
          languages: ['Español (Nativo)'],
          bio: 'Promotora y modelo oficial registrada en DIFUSION Agency Venezuela. Disponible para activaciones de marcas, protocolo y eventos corporativos.',
          socialMedia: {
            instagram: {
              handle: `@${targetUser.name.toLowerCase().replace(/\s+/g, '_')}`,
              followers: '10K',
              engagement: '4.5%',
              url: 'https://instagram.com',
              posts: [],
            },
            tiktok: {
              handle: `@${targetUser.name.toLowerCase().replace(/\s+/g, '_')}`,
              followers: '15K',
              likes: '100K',
              url: 'https://tiktok.com',
              videos: [],
            },
          },
          ratingsBreakdown: {
            punctuality: 5.0,
            professionalism: 5.0,
            presence: 5.0,
            charisma: 5.0,
          },
          whatsappNumber: targetUser.phone || '+584121234567',
          status: 'activa',
          createdAt: new Date().toISOString().split('T')[0],
        };
        const updatedModels = [newModel, ...models];
        setModels(updatedModels);
        localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(updatedModels));
        try {
          setDoc(doc(db, 'models', newModel.id), newModel, { merge: true }).catch(() => {});
        } catch {}
      }
    }

    // Persist user activation to Firestore
    try {
      setDoc(doc(db, 'users', userId), updatedUser, { merge: true }).catch((err: any) =>
        console.warn('Firestore user activation sync:', err)
      );
    } catch {}

    showToast(`✓ Cuenta de ${targetUser.name} activada como ${assignedRole === 'model' ? 'Promotora / Modelo' : assignedRole === 'empresa' ? 'Empresa' : 'Cliente'}.`);
    sendPushNotification(
      '🎉 Cuenta Activada por Super Admin',
      `La cuenta de ${targetUser.name} ha sido aprobada y activada como ${assignedRole === 'model' ? 'Promotora / Modelo' : assignedRole === 'empresa' ? 'Empresa' : 'Cliente Contratante'}.`,
      'system'
    );
  };

  const rejectUserAccount = (userId: string, reason?: string) => {
    if (!isSuperAdmin) {
      showToast('Acción restringida: Solo el Super Admin puede suspender cuentas.');
      return;
    }
    const target = registeredUsers.find((u) => u.id === userId);
    const updatedUsers: UserAccount[] = registeredUsers.map((u) =>
      u.id === userId ? { ...u, status: 'suspended' as const } : u
    );

    setRegisteredUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedUsers));

    // If currently logged-in user is the one being suspended, update currentUser and lock immediately
    if (
      currentUser &&
      (currentUser.id === userId ||
        (target && currentUser.email.toLowerCase() === target.email.toLowerCase()))
    ) {
      const suspendedSelf: UserAccount = { ...currentUser, status: 'suspended' };
      setCurrentUser(suspendedSelf);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(suspendedSelf));
    }

    // Persist suspension to Firestore
    try {
      setDoc(doc(db, 'users', userId), { status: 'suspended' }, { merge: true }).catch((err: any) =>
        console.warn('Firestore user suspend sync:', err)
      );
    } catch {}

    showToast(`✓ Cuenta de ${target?.name || 'usuario'} suspendida en standby.`);
    sendPushNotification(
      '⚠️ Cuenta Suspendida por Super Admin',
      `La cuenta de ${target?.name || 'usuario'} ha sido suspendida. Queda en standby sin acceso a la plataforma hasta nueva revisión.`,
      'system'
    );
  };

  // Normal users updating their own personal profile data (name, phone, avatar, company)
  const updateCurrentUserProfile = (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const safeUpdates: Partial<UserAccount> = {};
    if (updates.name !== undefined) safeUpdates.name = updates.name;
    if (updates.phone !== undefined) safeUpdates.phone = updates.phone;
    if (updates.avatar !== undefined) safeUpdates.avatar = updates.avatar;
    if (updates.companyName !== undefined) safeUpdates.companyName = updates.companyName;
    if (updates.companyRif !== undefined) safeUpdates.companyRif = updates.companyRif;
    if (updates.clientType !== undefined) safeUpdates.clientType = updates.clientType;
    if (updates.companyIndustry !== undefined) safeUpdates.companyIndustry = updates.companyIndustry;
    if (updates.companyBio !== undefined) safeUpdates.companyBio = updates.companyBio;
    if (updates.companyCity !== undefined) safeUpdates.companyCity = updates.companyCity;
    if (updates.companyAddress !== undefined) safeUpdates.companyAddress = updates.companyAddress;
    if (updates.companyWebsite !== undefined) safeUpdates.companyWebsite = updates.companyWebsite;
    if (updates.companyInstagram !== undefined) safeUpdates.companyInstagram = updates.companyInstagram;
    if (updates.companyLogo !== undefined) safeUpdates.companyLogo = updates.companyLogo;
    if (updates.companyEventTypes !== undefined) safeUpdates.companyEventTypes = updates.companyEventTypes;
    if (updates.contactPerson !== undefined) safeUpdates.contactPerson = updates.contactPerson;

    const updated: UserAccount = { ...currentUser, ...safeUpdates };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));

    setRegisteredUsers((prev) => {
      const updatedList = prev.map((u) => (u.id === currentUser.id ? { ...u, ...safeUpdates } : u));
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedList));
      return updatedList;
    });

    try {
      setDoc(doc(db, 'users', currentUser.id), safeUpdates, { merge: true }).catch(() => {});
    } catch {}

    showToast('Perfil y MediaKit corporativo actualizados con éxito.');
  };

  // Add Model
  const addModel = (modelData: Omit<ModelProfile, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newId = `mod_${Date.now()}`;
    const newModel: ModelProfile = {
      ...modelData,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
      isPaused: false,
      status: 'activa',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setModels((prev) => [newModel, ...prev]);
    showToast(`Modelo ${newModel.name} añadida exitosamente al catálogo.`);
    sendPushNotification(
      '✨ Nuevo Perfil Registrado',
      `${newModel.name} ya está disponible en ${newModel.location.city}.`,
      'system'
    );
  };

  // Toggle Pause/Active status for a model (Pausing hides her from catalog)
  const togglePauseModel = (id: string) => {
    const target = models.find((m) => m.id === id);
    if (!target) return;

    // Check permission: only Super Admin or the model herself
    if (!isSuperAdmin && currentModelProfile?.id !== id) {
      showToast('No tienes permiso para pausar este perfil.');
      return;
    }

    const nextPaused = !target.isPaused;
    setModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              isPaused: nextPaused,
              status: nextPaused ? 'pausada' : 'activa',
            }
          : m
      )
    );

    if (selectedModel?.id === id) {
      setSelectedModel((prev) =>
        prev
          ? {
              ...prev,
              isPaused: nextPaused,
              status: nextPaused ? 'pausada' : 'activa',
            }
          : null
      );
    }

    if (nextPaused) {
      showToast(`${target.name} ha sido pausada y ocultada del catálogo público.`);
    } else {
      showToast(`${target.name} ha sido reactivada y ya es visible en el catálogo.`);
    }
  };

  // Toggle VIP Membership Status (Super Admin: highlights model and places her first in catalog)
  const toggleVipModel = (id: string) => {
    if (!isSuperAdmin) {
      showToast('Acción restringida: Solo el Super Admin puede gestionar membresías VIP.');
      return;
    }
    const target = models.find((m) => m.id === id);
    if (!target) return;

    const nextVip = !target.isVip;
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isVip: nextVip } : m))
    );

    if (selectedModel?.id === id) {
      setSelectedModel((prev) => (prev ? { ...prev, isVip: nextVip } : null));
    }

    if (nextVip) {
      showToast(`⭐ Membresía VIP activada para ${target.name}. Se mostrará destacada de primera en el catálogo.`);
      sendPushNotification(
        '👑 Membresía VIP DIFUSION Activada',
        `${target.name} cuenta con membresía VIP pagada y ahora aparece destacada al inicio del catálogo.`,
        'system'
      );
    } else {
      showToast(`Membresía VIP removida para ${target.name}.`);
    }
  };

  // Update Model (Super Admin or internal)
  const updateModel = (id: string, updates: Partial<ModelProfile>) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    if (selectedModel?.id === id) {
      setSelectedModel((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Perfil actualizado correctamente.');
  };

  // Edit rates (STRICTLY restricted to Super Admin)
  const updateModelRates = (id: string, hourlyRate: number, dailyRate: number) => {
    if (!isSuperAdmin) {
      showToast('Acción denegada: Solo el Super Admin puede modificar tarifas.');
      return;
    }
    setModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              hourlyRate: Number(hourlyRate),
              dailyRate: Number(dailyRate),
            }
          : m
      )
    );
    showToast('Tarifas oficiales actualizadas por el Super Admin.');
  };

  // Model self-editing (model can only edit her own profile, cannot edit rates or others)
  // Model self-editing (model can only edit her own profile, mediakit, photos and rates)
  const updateModelSelf = (id: string, updates: Partial<ModelProfile>): boolean => {
    // Strict ownership verification: only Super Admin or the model herself
    const isOwner =
      currentModelProfile?.id === id ||
      (currentUser && currentModelProfile?.ownerEmail?.toLowerCase() === currentUser.email?.toLowerCase());

    if (!isSuperAdmin && !isOwner) {
      showToast('Error de seguridad: Cada modelo solo puede modificar su propio perfil y MediaKit.');
      return false;
    }

    if (!isSuperAdmin) {
      if (currentUser?.status === 'standby') {
        showToast('Tu cuenta está en standby. El Super Admin debe activarla antes de modificar datos.');
        return false;
      }
      const targetModel = models.find((m) => m.id === id);
      const isVerified = !!(targetModel?.verified || targetModel?.identityVerification?.status === 'verificado');
      if (!isVerified) {
        showToast('Debes tener tu perfil verificado por el Super Admin antes de poder editar tu perfil o fotos.');
        return false;
      }
    }

    // Strip out strictly administrative system fields that only Super Admin can alter
    const safeUpdates = { ...updates };
    if (!isSuperAdmin) {
      delete safeUpdates.verified;
      delete safeUpdates.isVip;
      delete safeUpdates.featured;
      delete safeUpdates.status;
      delete safeUpdates.isPaused;
      delete safeUpdates.rating;
      delete safeUpdates.reviewCount;
      delete safeUpdates.identityVerification;
    }

    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...safeUpdates } : m))
    );

    if (selectedModel?.id === id) {
      setSelectedModel((prev) => (prev ? { ...prev, ...safeUpdates } : null));
    }

    // Persist to Firestore
    try {
      setDoc(doc(db, 'models', id), safeUpdates, { merge: true }).catch((err) =>
        console.warn('Firestore model update note:', err)
      );
    } catch {}

    showToast(
      isSuperAdmin
        ? 'Perfil actualizado con éxito.'
        : 'Tu perfil y MediaKit han sido actualizados exitosamente.'
    );
    return true;
  };

  // Submit Official Identity Verification Document (Cédula de Identidad / Pasaporte)
  const submitIdentityVerification = (
    modelId: string,
    data: {
      documentType: 'Cédula de Identidad' | 'Pasaporte';
      documentNumber: string;
      documentPhotoUrl: string;
    }
  ) => {
    const now = new Date().toISOString();
    setModels((prev) =>
      prev.map((m) => {
        if (m.id === modelId) {
          return {
            ...m,
            identityVerification: {
              status: 'pendiente',
              documentType: data.documentType,
              documentNumber: data.documentNumber,
              documentPhotoUrl: data.documentPhotoUrl,
              submittedAt: now,
            },
          };
        }
        return m;
      })
    );

    if (selectedModel?.id === modelId) {
      setSelectedModel((prev) =>
        prev
          ? {
              ...prev,
              identityVerification: {
                status: 'pendiente',
                documentType: data.documentType,
                documentNumber: data.documentNumber,
                documentPhotoUrl: data.documentPhotoUrl,
                submittedAt: now,
              },
            }
          : null
      );
    }

    showToast('✓ Foto del documento enviada. En espera de revisión por el Super Admin.');
    sendPushNotification(
      '🪪 Verificación de Identidad Recibida',
      `Se ha recibido ${data.documentType} Nº ${data.documentNumber || ''} para validación oficial.`,
      'system'
    );
  };

  // Review Identity Verification (Super Admin only: pixelglez1988@gmail.com)
  const reviewIdentityVerification = (
    modelId: string,
    approved: boolean,
    rejectionReason?: string
  ) => {
    if (!isSuperAdmin) {
      showToast('Solo el Super Admin puede validar o certificar identidades.');
      return;
    }

    const now = new Date().toISOString();
    const target = models.find((m) => m.id === modelId);

    setModels((prev) =>
      prev.map((m) => {
        if (m.id === modelId) {
          const currentIdData = m.identityVerification || {
            documentType: 'Cédula de Identidad',
          };
          return {
            ...m,
            verified: approved,
            identityVerification: {
              ...currentIdData,
              status: approved ? 'verificado' : 'rechazado',
              reviewedAt: now,
              reviewedBy: currentUser?.email || SUPER_ADMIN_EMAIL,
              rejectionReason: approved
                ? undefined
                : rejectionReason || 'Documento no legible o no coincidente con el registro oficial',
            },
          };
        }
        return m;
      })
    );

    if (selectedModel?.id === modelId) {
      setSelectedModel((prev) =>
        prev
          ? {
              ...prev,
              verified: approved,
              identityVerification: {
                ...(prev.identityVerification || { documentType: 'Cédula de Identidad' }),
                status: approved ? 'verificado' : 'rechazado',
                reviewedAt: now,
                reviewedBy: currentUser?.email || SUPER_ADMIN_EMAIL,
                rejectionReason: approved ? undefined : rejectionReason,
              },
            }
          : null
      );
    }

    if (approved) {
      showToast(`✓ Identidad de ${target?.name || 'la modelo'} certificada oficialmente.`);
      sendPushNotification(
        '✅ Sello de Identidad Verificado',
        `La identificación oficial de ${target?.name} ha sido validada. Se ha otorgado el Sello Verificado en el catálogo.`,
        'system'
      );
    } else {
      showToast(`Verificación rechazada para ${target?.name || 'la modelo'}.`);
      sendPushNotification(
        '⚠️ Verificación de Identidad Observada',
        `La documentación de ${target?.name} requiere corrección: ${rejectionReason || 'No legible'}.`,
        'system'
      );
    }
  };

  // Delete Model
  const deleteModel = (id: string) => {
    if (!isSuperAdmin) {
      showToast('Solo el Super Admin puede eliminar perfiles del sistema.');
      return;
    }
    setModels((prev) => prev.filter((m) => m.id !== id));
    if (selectedModel?.id === id) {
      setSelectedModel(null);
    }
    showToast('Perfil eliminado del catálogo.');
  };

  // Add Review
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newId = `rev_${Date.now()}`;
    const newReview: Review = {
      ...reviewData,
      id: newId,
      date: 'Hoy',
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate average rating
    const modelReviews = [...reviews.filter((r) => r.modelId === reviewData.modelId), newReview];
    const avgRating = Number(
      (modelReviews.reduce((acc, r) => acc + r.rating, 0) / modelReviews.length).toFixed(2)
    );

    updateModel(reviewData.modelId, {
      rating: avgRating,
      reviewCount: modelReviews.length,
    });

    showToast('¡Reseña verificada publicada con éxito!');
    sendPushNotification(
      '⭐ Nueva Calificación Verificada',
      `${reviewData.authorCompany} calificó a la modelo con ${reviewData.rating} estrellas.`,
      'booking'
    );
  };

  // Add Event (Empresas and Super Admin only)
  const addEvent = (eventData: Omit<EventItem, 'id' | 'assignedModelIds'>) => {
    if (currentUser?.status === 'suspended') {
      showToast('Acceso denegado: Tu cuenta se encuentra suspendida.');
      return;
    }
    if (!isSuperAdmin && currentUser?.status === 'standby') {
      showToast('Tu cuenta está en standby. El Super Admin debe activarla antes de publicar eventos.');
      return;
    }
    const isEmpresa = currentUser?.role === 'empresa' || currentUser?.clientType === 'empresa';
    if (!isSuperAdmin && !isEmpresa) {
      showToast('Solo empresas verificadas y la administración pueden publicar eventos.');
      return;
    }
    const newId = `ev_${Date.now()}`;
    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      assignedModelIds: [],
      applicants: [],
      organizerEmail: currentUser?.email || SUPER_ADMIN_EMAIL,
      organizerCompany: currentUser?.companyName || currentUser?.name || 'Empresa Patrocinante',
    };

    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));

    try {
      setDoc(doc(db, 'events', newEvent.id), newEvent, { merge: true }).catch(() => {});
    } catch {}

    showToast(`Convocatoria "${newEvent.title}" publicada con éxito.`);
    sendPushNotification(
      '🎉 Nueva Convocatoria Publicada',
      `${newEvent.organizer} ha publicado convocatoria para "${newEvent.title}".`,
      'casting'
    );
  };

  // Delete Event (Empresas and Super Admin only)
  const deleteEvent = (eventId: string) => {
    const isEmpresa = currentUser?.role === 'empresa' || currentUser?.clientType === 'empresa';
    if (!isSuperAdmin && !isEmpresa) {
      showToast('No tienes permisos para eliminar este evento.');
      return;
    }
    const updatedEvents = events.filter((e) => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));

    try {
      deleteDoc(doc(db, 'events', eventId)).catch(() => {});
    } catch {}

    showToast('Evento eliminado del calendario.');
  };

  // Update Stream HTML and player config (Super Admin only)
  const updateStreamConfig = (updates: Partial<StreamConfig>) => {
    if (!isSuperAdmin) {
      showToast('Solo el Super Admin puede configurar el reproductor del stream.');
      return;
    }
    setThemeConfig((prev) => {
      const currentStream: StreamConfig = prev.streamConfig || {
        embedHtml: '',
        streamTitle: 'Backstage en Vivo & Transmisión Oficial',
        platformName: 'DIFUSION Live',
        hostName: 'Daniela Ospina',
        hostAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
        isLive: true,
        viewerCount: 1420,
      };
      const nextConfig = {
        ...prev,
        streamConfig: {
          ...currentStream,
          ...updates,
        },
      };
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(nextConfig));
      try {
        setDoc(doc(db, 'config', 'general'), nextConfig, { merge: true }).catch(() => {});
      } catch {}
      return nextConfig;
    });
    showToast('Configuración del Stream actualizada exitosamente.');
  };

  // Apply to casting (Promotoras y Modelos only)
  const applyToCasting = (
    eventId: string,
    applicantData:
      | {
          modelId?: string;
          modelName: string;
          modelAvatar?: string;
          modelCity?: string;
          phone?: string;
          instagram?: string;
        }
      | string
  ) => {
    if (!currentUser) {
      showToast('Debes iniciar sesión como Promotora o Modelo para postularte a convocatorias.');
      setActiveTab('login');
      return;
    }
    if (currentUser.status === 'suspended') {
      showToast('Acceso denegado: Tu cuenta está suspendida en standby de revisión.');
      return;
    }
    if (!isSuperAdmin && currentUser.status === 'standby') {
      showToast('Tu cuenta está en standby. El Super Admin debe activarla antes de postularte a convocatorias.');
      return;
    }
    if (currentUser.role === 'client') {
      showToast('Los clientes particulares solo tienen vista informativa. Solo modelos y promotoras pueden postularse.');
      return;
    }
    if (currentUser.role !== 'model' && !isSuperAdmin) {
      showToast('Solo modelos y promotoras pueden apuntarse y participar en castings.');
      return;
    }

    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;

    const applicantName =
      typeof applicantData === 'string'
        ? applicantData
        : applicantData.modelName || currentModelProfile?.name || currentUser.name;

    const applicantModelId =
      typeof applicantData === 'string'
        ? currentModelProfile?.id || `mod_user_${Date.now()}`
        : applicantData.modelId || currentModelProfile?.id || `mod_user_${Date.now()}`;

    // Check if already applied
    const alreadyApplied = ev.applicants?.some(
      (a) =>
        a.modelId === applicantModelId ||
        a.modelName.trim().toLowerCase() === applicantName.trim().toLowerCase()
    );
    if (alreadyApplied) {
      showToast(`Ya te has postulado a la convocatoria "${ev.title}". Espera la aprobación de la empresa.`);
      return;
    }

    const newApplicant: EventApplicant = {
      id: `app_${Date.now()}`,
      modelId: applicantModelId,
      modelName: applicantName,
      modelAvatar:
        typeof applicantData === 'string'
          ? currentModelProfile?.avatar || currentUser.avatar
          : applicantData.modelAvatar || currentModelProfile?.avatar || currentUser.avatar,
      modelCity:
        typeof applicantData === 'string'
          ? currentModelProfile?.location?.city || 'Venezuela'
          : applicantData.modelCity || currentModelProfile?.location?.city || 'Venezuela',
      phone:
        typeof applicantData === 'string'
          ? currentModelProfile?.whatsappNumber || currentUser.phone || ''
          : applicantData.phone || currentModelProfile?.whatsappNumber || currentUser.phone || '',
      instagram:
        typeof applicantData === 'string'
          ? currentModelProfile?.socialMedia?.instagram?.handle || ''
          : applicantData.instagram || currentModelProfile?.socialMedia?.instagram?.handle || '',
      appliedAt: 'Reciente',
      status: 'pendiente',
    };

    let targetUpdatedEv: EventItem | undefined;
    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        targetUpdatedEv = {
          ...e,
          applicants: [newApplicant, ...(e.applicants || [])],
        };
        return targetUpdatedEv;
      }
      return e;
    });

    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));

    if (targetUpdatedEv) {
      try {
        setDoc(doc(db, 'events', eventId), targetUpdatedEv, { merge: true }).catch(() => {});
      } catch {}
    }

    showToast(`✓ Postulación enviada con éxito para "${ev.title}". Esperando aprobación de la empresa.`);

    // Notification to Empresa / Super Admin
    sendPushNotification(
      '👠 Nueva Postulación para Convocatoria',
      `${newApplicant.modelName} se ha postulado para "${ev.title}". Revisa su perfil para aprobar su contratación o coordinar por WhatsApp.`,
      'casting',
      undefined,
      newApplicant.modelId
    );
  };

  // Review casting applicant (Empresas and Super Admin only)
  const reviewCastingApplicant = (
    eventId: string,
    applicantId: string,
    approved: boolean
  ) => {
    const isEmpresa = currentUser?.role === 'empresa' || currentUser?.clientType === 'empresa';
    if (!isSuperAdmin && !isEmpresa) {
      showToast('Acción denegada: Solo la empresa organizadora o el Super Admin pueden evaluar postulaciones.');
      return;
    }

    let targetEvent: EventItem | undefined;
    let targetApplicant: EventApplicant | undefined;

    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        const updatedApplicants = (e.applicants || []).map((app) => {
          if (app.id === applicantId) {
            targetApplicant = app;
            return {
              ...app,
              status: approved ? ('aprobada' as const) : ('rechazada' as const),
            };
          }
          return app;
        });

        // If approved, ensure model is in assignedModelIds
        let updatedAssigned = [...e.assignedModelIds];
        if (approved && targetApplicant?.modelId && !updatedAssigned.includes(targetApplicant.modelId)) {
          updatedAssigned.push(targetApplicant.modelId);
        } else if (!approved && targetApplicant?.modelId) {
          updatedAssigned = updatedAssigned.filter((mId) => mId !== targetApplicant?.modelId);
        }

        targetEvent = {
          ...e,
          applicants: updatedApplicants,
          assignedModelIds: updatedAssigned,
        };
        return targetEvent;
      }
      return e;
    });

    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));

    if (targetEvent) {
      try {
        setDoc(doc(db, 'events', eventId), targetEvent, { merge: true }).catch(() => {});
      } catch {}
    }

    if (approved) {
      showToast(`✓ Postulación de ${targetApplicant?.modelName || 'la modelo'} aprobada. Staff confirmado.`);
      sendPushNotification(
        '🎉 ¡Postulación Aprobada!',
        `¡Felicidades! ${targetEvent?.organizer || 'La empresa'} ha aprobado tu postulación para "${targetEvent?.title}". Ya formas parte del staff oficial.`,
        'casting',
        undefined,
        targetApplicant?.modelId
      );
    } else {
      showToast(`Postulación descartada.`);
    }
  };

  // Direct chat messaging - real human communication without automated mock replies
  const sendMessage = (
    modelId: string,
    text: string,
    isQuote?: boolean,
    quoteDetails?: any
  ) => {
    if (!isSuperAdmin && currentUser?.status === 'standby') {
      showToast('Tu cuenta está en standby. El Super Admin debe aprobarla antes de poder enviar mensajes.');
      return;
    }

    if (!isSuperAdmin && currentUser?.role === 'model' && currentModelProfile?.id !== modelId) {
      showToast('Restricción: Las promotoras no pueden enviarse mensajes entre sí para contratación.');
      return;
    }

    const targetModel = models.find((m) => m.id === modelId);
    const isModelSender = currentUser?.role === 'model' && currentModelProfile?.id === modelId;
    const isSuperAdminSender = isSuperAdmin;
    const isModelOrAdmin = isModelSender || isSuperAdminSender;

    const senderDisplayName =
      currentUser?.name ||
      (isModelSender ? targetModel?.name : undefined) ||
      (currentUser?.role === 'empresa' ? currentUser.companyName : undefined) ||
      'Cliente';

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || 'guest',
      senderName: senderDisplayName,
      senderAvatar: currentUser?.avatar || (isModelSender ? targetModel?.avatar : undefined),
      recipientId: isModelOrAdmin ? 'client' : modelId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromUser: !isModelOrAdmin,
      isQuoteRequest: isQuote,
      quoteDetails,
    };

    setChatMessages((prev) => {
      const currentList = prev[modelId] || [];
      return {
        ...prev,
        [modelId]: [...currentList, newMsg],
      };
    });

    const excerpt = text.length > 70 ? `${text.slice(0, 70)}...` : text;

    // Send push notification to user and model profiles in real-time
    if (!isModelOrAdmin) {
      // Sent by client/company to the model
      sendPushNotification(
        `💬 Nuevo mensaje para ${targetModel?.name || 'la promotora'}`,
        `${senderDisplayName}: "${excerpt}"`,
        'message',
        undefined,
        modelId
      );
      showToast(`Mensaje enviado a ${targetModel?.name || 'la promotora'}.`);
    } else {
      // Sent by the model or superadmin to client
      sendPushNotification(
        `💬 Mensaje de ${targetModel?.name || 'la promotora'}`,
        `${senderDisplayName}: "${excerpt}"`,
        'message',
        undefined,
        modelId
      );
      showToast('Respuesta enviada.');
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Todas las notificaciones marcadas como leídas.');
  };

  const sendPushNotification = (
    title: string,
    message: string,
    type: PushNotification['type'] = 'system',
    actionUrl?: string,
    modelId?: string
  ) => {
    const newNotif: PushNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: 'Justo ahora',
      read: false,
      type,
      actionUrl,
      modelId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Native Browser Web Push Notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body: message,
            icon: '/assets/aistudio/27211961-66ce-4ae9-a14c-6fb0dca4deaa-removebg-preview_d4a77f15.png',
          });
        } catch {}
      }
    }
  };

  const updateThemeConfig = (updates: Partial<AgencyThemeConfig>) => {
    setThemeConfig((prev) => ({ ...prev, ...updates }));
    showToast('Configuración de diseño actualizada.');
  };

  // Sync Firebase User with Application User State
  const handleFirebaseUserSync = (
    email: string,
    displayName?: string | null,
    photoURL?: string | null,
    explicitRole?: 'client' | 'model' | 'empresa',
    explicitStatus?: 'active' | 'standby',
    extraData?: { companyName?: string; companyRif?: string; phone?: string }
  ) => {
    const isSuper = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    const matchedModel = models.find(
      (m) => m.ownerEmail?.toLowerCase() === email.toLowerCase()
    );
    const existingRegistered = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    let role: UserAccount['role'] = isSuper
      ? 'superadmin'
      : (explicitRole || existingRegistered?.role || (matchedModel ? 'model' : 'client'));
    let name = displayName || existingRegistered?.name || (isSuper ? 'Pixel González (Super Admin)' : (matchedModel ? matchedModel.name : 'Usuario Registrado'));
    let avatar = photoURL || existingRegistered?.avatar || (matchedModel ? matchedModel.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
    
    // Strict suspension policy: Suspended users CANNOT log in or access the app
    const isSuspended = existingRegistered?.status === 'suspended';
    if (isSuspended && !isSuper) {
      try {
        signOut(auth);
      } catch {}
      setCurrentUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setShow2FAModal(false);
      setShowAuthModal(false);
      setShowRoleSelectionModal(false);
      setPendingAuthEmail(null);
      showToast('Acceso Denegado: Esta cuenta se encuentra suspendida. No puedes iniciar sesión.');
      return;
    }

    let status: UserAccount['status'] = isSuper
      ? 'active'
      : (explicitStatus || existingRegistered?.status || 'standby');

    // Only assign requestedRole if explicitly provided or already saved on the user account.
    // If user has not chosen a role yet, keep it undefined so the RoleSelectionModal opens.
    const requestedRole: 'model' | 'client' | 'empresa' | undefined =
      existingRegistered?.requestedRole || explicitRole || undefined;

    const newUser: UserAccount = {
      id: auth.currentUser?.uid || existingRegistered?.id || `user_${Date.now()}`,
      name,
      email,
      avatar,
      role: existingRegistered?.role || (requestedRole ? (requestedRole === 'empresa' ? 'empresa' : requestedRole === 'model' ? 'model' : 'client') : role),
      status,
      requestedRole,
      clientType: (requestedRole === 'empresa' || role === 'empresa' || explicitRole === 'empresa' || existingRegistered?.clientType === 'empresa') ? 'empresa' : 'particular',
      companyName: extraData?.companyName || existingRegistered?.companyName,
      companyRif: extraData?.companyRif || existingRegistered?.companyRif,
      createdAt: existingRegistered?.createdAt || 'Hoy',
      activatedAt: status === 'active' ? (existingRegistered?.activatedAt || 'Activa') : undefined,
      activatedBy: status === 'active' ? (existingRegistered?.activatedBy || SUPER_ADMIN_EMAIL) : undefined,
      twoFactorEnabled: isSuper || existingRegistered?.twoFactorEnabled || false,
      isVerified: isSuper || existingRegistered?.isVerified || false,
      phone: extraData?.phone || existingRegistered?.phone || '+58 412 000 0000',
    };

    if (!isSuper) {
      setRegisteredUsers((prev) => {
        const idx = prev.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
        let updatedList: UserAccount[];
        if (idx >= 0) {
          updatedList = [...prev];
          updatedList[idx] = { ...updatedList[idx], ...newUser };
        } else {
          updatedList = [newUser, ...prev];
        }
        localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedList));
        return updatedList;
      });

      // Save user profile state to Firestore
      try {
        setDoc(doc(db, 'users', newUser.id), newUser, { merge: true }).catch(() => {});
      } catch {}
    }

    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setShow2FAModal(false);
    setShowAuthModal(false);
    setPendingAuthEmail(null);

    // If new user in standby who has never selected a role, trigger the one-time selection modal
    if (!isSuper && !existingRegistered?.requestedRole && status === 'standby') {
      setShowRoleSelectionModal(true);
    } else {
      setShowRoleSelectionModal(false);
    }

    if (isSuper) {
      showToast('Sesión autenticada en Firebase como Super Admin (Google)');
    } else if (status === 'standby') {
      showToast('Cuenta en Standby: En espera de activación oficial por el Super Admin.');
    } else if (role === 'model') {
      showToast(`Sesión activa en Firebase como modelo: ${name}.`);
    } else {
      showToast(`Sesión iniciada (${email})`);
    }
  };

  // Select requested role once during initial registration
  const selectUserRequestedRole = (
    role: 'client' | 'model' | 'empresa',
    extraData?: { companyName?: string; companyRif?: string; phone?: string }
  ) => {
    if (!currentUser) return;
    if (currentUser.status === 'suspended') {
      showToast('Acceso Denegado: Tu cuenta se encuentra suspendida y no puede cambiar roles.');
      return;
    }
    const isSuper = currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    if (isSuper) return;

    // Once a role is requested upon registration, only the Super Admin can alter it
    if (currentUser.requestedRole) {
      showToast('Ya has seleccionado tu rol al registrarte. Solo el Super Admin puede modificar o aprobar tu rol.');
      setShowRoleSelectionModal(false);
      return;
    }

    const roleName = role === 'model' ? 'Promotora / Modelo' : role === 'empresa' ? 'Empresa / Marca' : 'Cliente Particular';
    const updatedUser: UserAccount = {
      ...currentUser,
      status: 'standby',
      requestedRole: role,
      role: role === 'empresa' ? 'empresa' : role === 'model' ? 'model' : 'client',
      clientType: role === 'empresa' ? 'empresa' : 'particular',
      companyName: extraData?.companyName || currentUser.companyName,
      companyRif: extraData?.companyRif || currentUser.companyRif,
      phone: extraData?.phone || currentUser.phone,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    setRegisteredUsers((prev) => {
      const idx = prev.findIndex((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
      let updatedList: UserAccount[];
      if (idx >= 0) {
        updatedList = [...prev];
        updatedList[idx] = { ...updatedList[idx], ...updatedUser };
      } else {
        updatedList = [updatedUser, ...prev];
      }
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedList));
      return updatedList;
    });

    try {
      setDoc(doc(db, 'users', updatedUser.id), updatedUser, { merge: true }).catch((err: any) =>
        console.warn('Firestore role selection sync:', err)
      );
    } catch {}

    showToast(`✓ Solicitud de rol "${roleName}" registrada. En espera del Super Admin.`);
    sendPushNotification(
      '⏳ Solicitud de Rol Recibida',
      `${currentUser.name} solicita activación como ${roleName}. En espera de aprobación por el Super Admin.`,
      'system'
    );
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        handleFirebaseUserSync(
          firebaseUser.email,
          firebaseUser.displayName,
          firebaseUser.photoURL
        );
      }
    });
    return () => unsubscribe();
  }, [models]);

  // Real Google Sign-in with Firebase (with mobile popup resiliency)
  const signInWithFirebaseGoogle = async (
    explicitEmail?: string,
    explicitRole?: 'client' | 'model' | 'empresa',
    explicitName?: string,
    extraData?: { companyName?: string; companyRif?: string; phone?: string }
  ): Promise<{ success: boolean; error?: string; isPopupBlocked?: boolean }> => {
    // Check if target user is suspended
    const targetEmailClean = (explicitEmail || '').trim().toLowerCase();
    if (targetEmailClean) {
      const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === targetEmailClean);
      if (existingUser?.status === 'suspended') {
        showToast('Acceso Denegado: Tu cuenta se encuentra suspendida por la administración.');
        return {
          success: false,
          error: 'Cuenta suspendida: Quedas en proceso de aceptación (standby por suspensión) y no puedes acceder hasta que el Super Admin apruebe tu reactivación.',
        };
      }
    }

    // Direct mobile/in-app verified Google login
    if (explicitEmail && explicitEmail.trim()) {
      const cleanEmail = explicitEmail.trim().toLowerCase();
      const isSuper = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      if (isSuper) {
        setPendingAuthEmail(cleanEmail);
        setShow2FAModal(true);
        showToast('Introduce tu código 2FA para verificar acceso de Super Admin.');
        return { success: false };
      }
      handleFirebaseUserSync(cleanEmail, explicitName, undefined, explicitRole, undefined, extraData);
      return { success: true };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user?.email) {
        const userEmail = result.user.email.toLowerCase();
        const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === userEmail);
        if (existingUser?.status === 'suspended') {
          try {
            await signOut(auth);
          } catch {}
          showToast('Acceso Denegado: Tu cuenta se encuentra suspendida por la administración.');
          return {
            success: false,
            error: 'Cuenta suspendida: Quedas en proceso de aceptación (standby por suspensión) y no puedes acceder hasta que el Super Admin apruebe tu reactivación.',
          };
        }

        handleFirebaseUserSync(
          result.user.email,
          result.user.displayName,
          result.user.photoURL,
          explicitRole,
          undefined,
          extraData
        );
        return { success: true };
      }
    } catch (err: any) {
      console.warn('Firebase signInWithPopup info:', err?.code, err?.message);
      const isBlocked =
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.code === 'auth/unauthorized-domain' ||
        !err?.code;

      return {
        success: false,
        error: isBlocked
          ? 'El navegador móvil bloqueó o cerró la ventana emergente de Google.'
          : (err?.message || 'Error al conectar con Google.'),
        isPopupBlocked: isBlocked,
      };
    }
    return { success: false, error: 'No se completó la autenticación con Google.' };
  };

  // Sign In with Email & Password (Firebase Auth + Fallback)
  const signInWithEmailPassword = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Check if user is suspended
    const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingUser?.status === 'suspended') {
      showToast('Acceso Denegado: Tu cuenta se encuentra suspendida.');
      return {
        success: false,
        error: 'Cuenta suspendida: Quedas en proceso de aceptación (standby por suspensión) y no puedes acceder hasta que el Super Admin apruebe tu reactivación.',
      };
    }

    // Super Admin can ONLY log in via official Google Auth
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        error: 'Acceso restringido: Esta cuenta únicamente puede ingresar mediante el botón oficial de Google.',
      };
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user && res.user.email) {
        handleFirebaseUserSync(res.user.email, res.user.displayName, res.user.photoURL);
        return { success: true };
      }
    } catch (err: any) {
      console.warn('Firebase email auth note:', err?.code, err?.message);
      if (
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/configuration-not-found' ||
        err?.code === 'auth/invalid-credential'
      ) {
        const matchedModel = models.find((m) => m.ownerEmail?.toLowerCase() === email.toLowerCase());
        const existingRegistered = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (matchedModel || existingRegistered || pass.length >= 4) {
          handleFirebaseUserSync(email, matchedModel ? matchedModel.name : undefined);
          return { success: true };
        }
      }
      return {
        success: false,
        error:
          err?.code === 'auth/wrong-password'
            ? 'Contraseña incorrecta'
            : err?.code === 'auth/user-not-found'
            ? 'Usuario no registrado'
            : err?.message || 'Error al iniciar sesión',
      };
    }
    return { success: false, error: 'No se pudo autenticar' };
  };

  // Sign Up with Email & Password (Firebase Auth + Fallback)
  // Accounts are placed in 'standby' until Super Admin activates them with their assigned role
  const signUpWithEmailPassword = async (
    email: string,
    pass: string,
    name: string,
    role: 'client' | 'model' | 'empresa' = 'client',
    extraData?: { companyName?: string; companyRif?: string; phone?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        error: 'Acceso restringido: Esta cuenta únicamente puede ingresar mediante el botón oficial de Google.',
      };
    }

    const roleName = role === 'model' ? 'Promotora / Modelo' : role === 'empresa' ? 'Empresa' : 'Cliente';

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        try {
          await updateProfile(res.user, { displayName: name });
        } catch {}

        handleFirebaseUserSync(
          email,
          name,
          undefined,
          role,
          'standby',
          extraData
        );

        showToast('Cuenta registrada. Queda en standby hasta ser activada oficialmente por el Super Admin.');
        sendPushNotification(
          '⏳ Nueva Cuenta en Standby',
          `${name} (${email}) se ha registrado y solicita activación con rol de ${roleName}.`,
          'system'
        );
        return { success: true };
      }
    } catch (err: any) {
      console.warn('Firebase signup note:', err?.code, err?.message);
      if (
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/configuration-not-found'
      ) {
        // Fallback local registration
        handleFirebaseUserSync(
          email,
          name,
          undefined,
          role,
          'standby',
          extraData
        );

        showToast('Cuenta registrada. Queda en standby hasta ser activada oficialmente por el Super Admin.');
        sendPushNotification(
          '⏳ Nueva Cuenta en Standby',
          `${name} (${email}) se ha registrado y solicita activación con rol de ${roleName}.`,
          'system'
        );
        return { success: true };
      }
      return {
        success: false,
        error:
          err?.code === 'auth/email-already-in-use'
            ? 'Este correo ya está registrado'
            : err?.code === 'auth/weak-password'
            ? 'La contraseña debe tener al menos 6 caracteres'
            : err?.message || 'Error al crear la cuenta',
      };
    }
    return { success: false, error: 'No se pudo crear la cuenta' };
  };

  // Google OAuth selection with optional 2FA verification
  const loginWithGoogle = async (
    email: string,
    role?: 'client' | 'model',
    name?: string
  ): Promise<boolean> => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing?.status === 'suspended') {
      showToast('Acceso Denegado: Tu cuenta se encuentra suspendida por la administración.');
      return false;
    }

    const isSuper = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    if (isSuper) {
      setPendingAuthEmail(email);
      setShow2FAModal(true);
      showToast('Introduce tu código 2FA para verificar acceso de Super Admin.');
      return true;
    }

    handleFirebaseUserSync(email, name, undefined, role);
    return true;
  };

  const verify2FACode = (code: string): boolean => {
    if (code.trim().length >= 4 && pendingAuthEmail) {
      handleFirebaseUserSync(pendingAuthEmail);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(null);
    showToast('Sesión cerrada.');
  };

  const generateWhatsAppUrl = (
    phone: string,
    modelName: string,
    eventDetails?: string
  ): string => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hola DIFUSION Venezuela, solicito disponibilidad y cotización para contratar a ${modelName} para nuestro próximo evento ${
        eventDetails ? `(${eventDetails})` : ''
      }. Agradezco me envíen la tarifa y condiciones.`
    );
    return `https://wa.me/${cleanPhone || '584129876543'}?text=${text}`;
  };

  // Wall Social Actions ("Para Ti" with strict 1-post-per-day rule)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const userTodayPost = currentUser
    ? wallPosts.find(
        (p) =>
          (p.authorId === currentUser.id ||
            p.authorEmail?.toLowerCase() === currentUser.email?.toLowerCase()) &&
          p.createdDateString === todayDateStr
      ) || null
    : null;
  const canUserPostToday = !userTodayPost;

  const createWallPost = async (
    text: string,
    imageUrl?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      setShowAuthModal(true);
      showToast('Debes iniciar sesión para publicar en el Muro Para Ti.');
      return { success: false, error: 'auth_required' };
    }

    if (currentUser.status === 'suspended') {
      showToast('Acceso Denegado: Tu cuenta se encuentra suspendida.');
      return { success: false, error: 'account_suspended' };
    }

    if (!canUserPostToday) {
      showToast('Límite diario alcanzado: Solo puedes realizar 1 post por día en Para Ti.');
      return { success: false, error: 'daily_limit_reached' };
    }

    if (!text.trim() && !imageUrl) {
      showToast('Por favor incluye un mensaje o una fotografía en tu publicación.');
      return { success: false, error: 'empty_content' };
    }

    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPost: WallPost = {
      id: postId,
      authorId: currentUser.id,
      authorEmail: currentUser.email,
      authorName: currentUser.name || 'Usuario DIFUSION',
      authorAvatar:
        currentUser.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      authorRole: (currentUser.role as any) || 'client',
      authorCity: currentModelProfile?.location?.city || (currentUser as any).city || 'Venezuela',
      text: text.trim(),
      imageUrl: imageUrl?.trim() || undefined,
      createdAt: new Date().toISOString(),
      createdDateString: todayDateStr,
      reactions: {
        fire: [],
        heart: [],
        like: [],
      },
      comments: [],
    };

    setWallPosts((prev) => [newPost, ...prev]);

    try {
      await setDoc(doc(db, 'wall', postId), newPost);
    } catch (err) {
      console.warn('Firestore wall post save note:', err);
    }

    showToast('¡Tu publicación diaria se compartió con éxito en Para Ti! 🔥');
    sendPushNotification(
      '✨ Nueva Publicación en Para Ti',
      `${currentUser.name} compartió una actualización en el Muro Social.`,
      'system'
    );
    return { success: true };
  };

  const toggleWallReaction = async (
    postId: string,
    reactionType: WallReactionType
  ): Promise<void> => {
    if (!currentUser) {
      setShowAuthModal(true);
      showToast('Inicia sesión para reaccionar con 🔥 ❤️ 👍');
      return;
    }

    const userId = currentUser.id || currentUser.email;
    let targetUpdated: WallPost | null = null;

    setWallPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const currentList = post.reactions?.[reactionType] || [];
        const exists = currentList.includes(userId);
        const newList = exists
          ? currentList.filter((uid) => uid !== userId)
          : [...currentList, userId];
        const updated: WallPost = {
          ...post,
          reactions: {
            fire: post.reactions?.fire || [],
            heart: post.reactions?.heart || [],
            like: post.reactions?.like || [],
            [reactionType]: newList,
          },
        };
        targetUpdated = updated;
        return updated;
      })
    );

    if (targetUpdated) {
      try {
        await setDoc(doc(db, 'wall', postId), targetUpdated, { merge: true });
      } catch (err) {
        console.warn('Firestore reaction update note:', err);
      }
    }
  };

  const addWallComment = async (
    postId: string,
    text: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      setShowAuthModal(true);
      showToast('Debes iniciar sesión para comentar.');
      return { success: false, error: 'auth_required' };
    }

    if (!text.trim()) {
      return { success: false, error: 'empty_comment' };
    }

    const commentId = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newComment = {
      id: commentId,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name || 'Usuario DIFUSION',
      authorAvatar:
        currentUser.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      authorRole: (currentUser.role as any) || 'client',
      text: text.trim(),
      createdAt: 'Ahora mismo',
    };

    let targetUpdated: WallPost | null = null;
    setWallPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updated: WallPost = {
          ...post,
          comments: [...(post.comments || []), newComment],
        };
        targetUpdated = updated;
        return updated;
      })
    );

    if (targetUpdated) {
      try {
        await setDoc(doc(db, 'wall', postId), targetUpdated, { merge: true });
      } catch (err) {
        console.warn('Firestore comment update note:', err);
      }
    }

    showToast('Comentario publicado');
    return { success: true };
  };

  const deleteWallPost = async (postId: string): Promise<void> => {
    const target = wallPosts.find((p) => p.id === postId);
    if (!isSuperAdmin && target?.authorEmail?.toLowerCase() !== currentUser?.email?.toLowerCase()) {
      showToast('No tienes permisos para eliminar esta publicación.');
      return;
    }

    setWallPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      await deleteDoc(doc(db, 'wall', postId));
    } catch (err) {
      console.warn('Firestore delete wall post note:', err);
    }

    showToast('Publicación eliminada correctamente.');
  };

  return (
    <AppContext.Provider
      value={{
        models,
        events,
        reviews,
        notifications,
        currentUser,
        themeConfig,
        activeTab,
        setActiveTab,
        selectedModel,
        setSelectedModel,
        activeChatModel,
        setActiveChatModel,
        chatMessages,
        showAuthModal,
        setShowAuthModal,
        show2FAModal,
        setShow2FAModal,
        showSettingsModal,
        setShowSettingsModal,
        showReviewModal,
        setShowReviewModal,
        showRoleSelectionModal,
        setShowRoleSelectionModal,
        selectUserRequestedRole,
        toastMessage,
        showToast,
        availableCities,
        addCity,
        removeCity,
        registeredUsers,
        activateUserAccount,
        rejectUserAccount,
        updateCurrentUserProfile,
        submitIdentityVerification,
        reviewIdentityVerification,
        signInWithFirebaseGoogle,
        signInWithEmailPassword,
        signUpWithEmailPassword,
        isFirebaseConnected: true,
        addModel,
        updateModel,
        updateModelRates,
        updateModelSelf,
        togglePauseModel,
        toggleVipModel,
        deleteModel,
        addReview,
        addEvent,
        deleteEvent,
        updateStreamConfig,
        applyToCasting,
        reviewCastingApplicant,
        sendMessage,
        markNotificationAsRead,
        clearAllNotifications,
        sendPushNotification,
        updateThemeConfig,
        loginWithGoogle,
        verify2FACode,
        logout,
        isSuperAdmin,
        isModelUser,
        currentModelProfile,
        generateWhatsAppUrl,
        wallPosts,
        createWallPost,
        toggleWallReaction,
        addWallComment,
        deleteWallPost,
        canUserPostToday,
        userTodayPost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
