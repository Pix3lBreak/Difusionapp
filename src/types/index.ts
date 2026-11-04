export type CategoryType = 'promotora' | 'pasarela' | 'fotografia' | 'hostess' | 'streaming';

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: string;
  comments: string;
  type: 'post' | 'reel';
  url: string;
}

export interface TikTokVideo {
  id: string;
  thumbnail: string;
  title: string;
  views: string;
  likes: string;
  url: string;
}

export interface SocialMediaData {
  instagram: {
    handle: string;
    followers: string;
    engagement: string;
    url: string;
    posts: InstagramPost[];
  };
  tiktok: {
    handle: string;
    followers: string;
    likes: string;
    url: string;
    videos: TikTokVideo[];
  };
}

export type VerificationStatus = 'sin_verificar' | 'pendiente' | 'verificado' | 'rechazado';

export interface IdentityVerificationData {
  status: VerificationStatus;
  documentType: 'Cédula de Identidad' | 'Pasaporte';
  documentNumber?: string;
  documentPhotoUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ModelProfile {
  id: string;
  ownerEmail?: string; // Linked Google email for self-editing
  name: string;
  stageName: string;
  category: CategoryType;
  categoryLabel: string;
  roleLabel: string;
  verified: boolean;
  identityVerification?: IdentityVerificationData; // Official ID document verification
  featured: boolean;
  isVip?: boolean; // Membresía VIP pagada: destaca de primera en el catálogo
  isPaused: boolean; // Paused models disappear from public catalog
  rating: number;
  reviewCount: number;
  hourlyRate: number; // in USD (managed by superadmin)
  dailyRate: number; // in USD (managed by superadmin)
  location: {
    city: string; // Caracas, Maracaibo, Valencia, etc.
    state: string;
    country: 'Venezuela';
    availableToTravel: boolean;
  };
  avatar: string;
  gallery: string[];
  age?: number; // Edad de la modelo/promotora
  pastExperience?: string[]; // Trabajos anteriores, marcas, eventos y ferias
  physical: {
    height: string; // e.g. 1.77 m
    bust?: string;
    waist?: string;
    hips?: string;
    eyeColor: string;
    hairColor: string;
    shoeSize?: string;
  };
  languages: string[];
  bio: string;
  socialMedia: SocialMediaData;
  ratingsBreakdown: {
    punctuality: number;
    professionalism: number;
    presence: number;
    charisma: number;
  };
  whatsappNumber: string;
  status: 'activa' | 'pausada' | 'en_evento';
  createdAt: string;
}

export interface Review {
  id: string;
  modelId: string;
  authorName: string;
  authorCompany: string;
  authorRole: string;
  rating: number;
  date: string;
  verifiedBooking: boolean;
  comment: string;
  eventTitle: string;
  punctualityScore: number;
  professionalismScore: number;
  presenceScore: number;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  date: string;
  time: string;
  location: string;
  category: string;
  banner: string;
  requiredProfilesCount: number;
  assignedModelIds: string[];
  status: 'upcoming' | 'casting_open' | 'completed';
  description: string;
  organizer: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  text: string;
  timestamp: string;
  isFromUser: boolean;
  isQuoteRequest?: boolean;
  quoteDetails?: {
    modelName: string;
    eventName: string;
    eventDate: string;
    hours: number;
    totalUsd: number;
  };
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'casting' | 'message' | 'stream' | 'system';
  actionUrl?: string;
}

export type UserAccountStatus = 'active' | 'standby' | 'suspended';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'superadmin' | 'admin' | 'model' | 'client' | 'empresa';
  status: UserAccountStatus; // 'standby' when newly registered until Super Admin activates
  requestedRole?: 'model' | 'client' | 'empresa';
  clientType?: 'empresa' | 'particular';
  companyName?: string;
  companyRif?: string;
  createdAt?: string;
  activatedAt?: string;
  activatedBy?: string;
  twoFactorEnabled: boolean;
  isVerified: boolean;
  phone?: string;
}

export interface AgencyThemeConfig {
  primaryColor: string; // e.g. #39ff14
  colorScheme: 'neon-green' | 'electric-cyan' | 'cyber-magenta' | 'solar-gold';
  fontFamily: string;
  isDarkMode: boolean;
  brandName: string;
  agencyPhone: string;
  agencyEmail: string;
  availableCities: string[]; // Ciudades de Venezuela gestionables por el Super Admin
  privacy: {
    publicProfiles: boolean;
    requireLoginForRates: boolean;
    twoFactorRequiredForAdmin: boolean;
    allowDirectWhatsApp: boolean;
  };
}
