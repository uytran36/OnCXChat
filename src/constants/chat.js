import { API_BASE_URL } from '@env';

export const chatConstants = {
  AVATAR_AGENT_BASE_URL: `${API_BASE_URL}/avatar`,
};

export const logAction = {
  APPROVED: { text: 'đã chấp nhận cuộc hội thoại' },
  FORWARDED: { text: 'đã chuyển tiếp cuộc hội thoại', bonus: 'cho' },
  ALLOW: { text: 'đã chấp nhận cuộc hội thoại chuyển tiếp', bonus: 'từ' },
  DENIED: { text: 'đã từ chối cuộc hội thoại chuyển tiếp', bonus: 'từ' },
  CLOSED: { text: 'đã hoàn tất cuộc hội thoại' },
  LIVECHAT_CLOSED: { text: 'đã rời khỏi cuộc trò chuyện' },
  ROLLBACK: { text: 'đã thu hồi cuộc hội thoại chuyển tiếp' },
  ALL_CHAT: { text: 'đang chat xen giữa cuộc hội thoại', bonus: 'của' },
  REOPEN: { text: 'đã mở lại cuộc hội thoại' },
};
