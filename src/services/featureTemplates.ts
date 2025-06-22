import { DesignSystem } from '../types/app';

export interface FeatureTemplate {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'social' | 'commerce' | 'data' | 'communication';
  requiredScreens: ScreenTemplate[];
  designSystemUpdates?: Partial<DesignSystem>;
}

export interface ScreenTemplate {
  name: string;
  type: 'screen' | 'modal' | 'flow';
  connections: { to: string; type: string }[];
  content?: any;
}

export const featureTemplates: FeatureTemplate[] = [
  {
    id: 'auth-basic',
    name: 'User Authentication',
    description: 'Login, signup, and password reset flows',
    category: 'auth',
    requiredScreens: [
      {
        name: 'Login',
        type: 'screen',
        connections: [
          { to: 'Signup', type: 'navigation' },
          { to: 'ForgotPassword', type: 'navigation' },
          { to: 'Home', type: 'navigation' }
        ]
      },
      {
        name: 'Signup',
        type: 'screen',
        connections: [
          { to: 'Login', type: 'navigation' },
          { to: 'Onboarding', type: 'navigation' }
        ]
      },
      {
        name: 'ForgotPassword',
        type: 'modal',
        connections: [
          { to: 'Login', type: 'navigation' }
        ]
      }
    ]
  },
  {
    id: 'chat-messaging',
    name: 'Chat & Messaging',
    description: 'Real-time chat with channels or direct messages',
    category: 'communication',
    requiredScreens: [
      {
        name: 'ChatList',
        type: 'screen',
        connections: [
          { to: 'ChatDetail', type: 'navigation' },
          { to: 'NewChat', type: 'action' }
        ]
      },
      {
        name: 'ChatDetail',
        type: 'screen',
        connections: [
          { to: 'ChatList', type: 'navigation' },
          { to: 'UserProfile', type: 'navigation' }
        ]
      }
    ]
  },
  {
    id: 'social-feed',
    name: 'Social Feed',
    description: 'Photo/video feed with likes and comments',
    category: 'social',
    requiredScreens: [
      {
        name: 'Feed',
        type: 'screen',
        connections: [
          { to: 'PostDetail', type: 'navigation' },
          { to: 'CreatePost', type: 'action' }
        ]
      },
      {
        name: 'PostDetail',
        type: 'screen',
        connections: [
          { to: 'Feed', type: 'navigation' },
          { to: 'UserProfile', type: 'navigation' }
        ]
      },
      {
        name: 'CreatePost',
        type: 'modal',
        connections: [
          { to: 'Feed', type: 'navigation' }
        ]
      }
    ]
  },
  {
    id: 'ecommerce-basic',
    name: 'E-commerce Store',
    description: 'Product catalog, cart, and checkout',
    category: 'commerce',
    requiredScreens: [
      {
        name: 'Products',
        type: 'screen',
        connections: [
          { to: 'ProductDetail', type: 'navigation' },
          { to: 'Cart', type: 'navigation' }
        ]
      },
      {
        name: 'ProductDetail',
        type: 'screen',
        connections: [
          { to: 'Products', type: 'navigation' },
          { to: 'Cart', type: 'action' }
        ]
      },
      {
        name: 'Cart',
        type: 'screen',
        connections: [
          { to: 'Checkout', type: 'navigation' },
          { to: 'Products', type: 'navigation' }
        ]
      },
      {
        name: 'Checkout',
        type: 'flow',
        connections: [
          { to: 'OrderConfirmation', type: 'navigation' }
        ]
      }
    ]
  }
];