export interface AdminInquiry {
  id: string;
  timestamp: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  serviceInterest: string[];
  scale?: string;
  budgetEstimate?: string;
  notes: string;
  source: 'kalkulator' | 'kontak' | 'rfp';
  status: 'new' | 'contacted' | 'survey' | 'deal' | 'archived';
  priority: 'high' | 'medium' | 'normal';
}

export interface AdminProject {
  id: string;
  title: string;
  clientName: string;
  category: string;
  year: string;
  status: 'completed' | 'in_progress' | 'tender';
  valueApprox?: string;
  description: string;
}

export interface AdminNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  read: boolean;
  type: 'inquiry' | 'rfp' | 'system';
}

export interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitorEmail?: string;
  visitorCompany?: string;
  serviceInterest?: string;
  createdAt: string;
  lastActive: string;
  status: 'active' | 'resolved' | 'waiting';
  unreadCountAdmin: number;
  unreadCountVisitor: number;
  messages: ChatMessage[];
}
