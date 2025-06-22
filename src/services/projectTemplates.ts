import { AppProject } from '../types/app';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'social' | 'ecommerce' | 'productivity' | 'entertainment';
  thumbnail: string;
  tags: string[];
  project: Partial<AppProject>;
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'ecommerce-basic',
    name: 'E-Commerce Starter',
    description: 'Complete online store with product catalog, cart, and checkout',
    category: 'ecommerce',
    thumbnail: '🛍️',
    tags: ['shopping', 'payments', 'inventory'],
    project: {
      name: 'My Online Store',
      description: 'A modern e-commerce platform',
      screens: [
        {
          id: 'home',
          name: 'Home',
          type: 'screen',
          position: { x: 100, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'home', to: 'products', type: 'navigation' },
            { from: 'home', to: 'cart', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'products',
          name: 'Products',
          type: 'screen',
          position: { x: 400, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'products', to: 'product-detail', type: 'navigation' },
            { from: 'products', to: 'cart', type: 'action' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'product-detail',
          name: 'Product Detail',
          type: 'screen',
          position: { x: 700, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'product-detail', to: 'cart', type: 'action' },
            { from: 'product-detail', to: 'products', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'cart',
          name: 'Shopping Cart',
          type: 'screen',
          position: { x: 400, y: 400 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'cart', to: 'checkout', type: 'navigation' },
            { from: 'cart', to: 'products', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }, { name: 'empty' }]
        },
        {
          id: 'checkout',
          name: 'Checkout',
          type: 'flow',
          position: { x: 700, y: 400 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'checkout', to: 'order-confirmation', type: 'navigation' }
          ],
          states: [{ name: 'shipping', isDefault: true }, { name: 'payment' }, { name: 'review' }]
        },
        {
          id: 'order-confirmation',
          name: 'Order Confirmation',
          type: 'screen',
          position: { x: 1000, y: 400 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'order-confirmation', to: 'home', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        }
      ],
      journeys: [
        {
          id: 'shopping-flow',
          name: 'Shopping Journey',
          description: 'Complete shopping experience from browsing to purchase',
          screens: ['home', 'products', 'product-detail', 'cart', 'checkout', 'order-confirmation']
        },
        {
          id: 'quick-buy',
          name: 'Quick Purchase',
          description: 'Fast path for returning customers',
          screens: ['products', 'product-detail', 'cart', 'checkout', 'order-confirmation']
        }
      ],
      features: [
        {
          id: 'feat-1',
          templateId: 'search-basic',
          name: 'Product Search',
          screens: ['products'],
          configuration: { placeholder: 'Search products...' }
        },
        {
          id: 'feat-2',
          templateId: 'cart-basic',
          name: 'Shopping Cart',
          screens: ['cart'],
          configuration: { persistCart: true }
        }
      ]
    }
  },
  {
    id: 'social-app',
    name: 'Social Network',
    description: 'Social media app with feed, profiles, and messaging',
    category: 'social',
    thumbnail: '👥',
    tags: ['social', 'messaging', 'community'],
    project: {
      name: 'My Social App',
      description: 'Connect and share with friends',
      screens: [
        {
          id: 'feed',
          name: 'Feed',
          type: 'screen',
          position: { x: 400, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'feed', to: 'profile', type: 'navigation' },
            { from: 'feed', to: 'post-detail', type: 'navigation' },
            { from: 'feed', to: 'create-post', type: 'action' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'profile',
          name: 'Profile',
          type: 'screen',
          position: { x: 100, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'profile', to: 'settings', type: 'navigation' },
            { from: 'profile', to: 'feed', type: 'navigation' }
          ],
          states: [{ name: 'own', isDefault: true }, { name: 'other' }]
        },
        {
          id: 'messages',
          name: 'Messages',
          type: 'screen',
          position: { x: 700, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'messages', to: 'chat', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'chat',
          name: 'Chat',
          type: 'screen',
          position: { x: 700, y: 400 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'chat', to: 'messages', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'create-post',
          name: 'Create Post',
          type: 'modal',
          position: { x: 400, y: 400 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'create-post', to: 'feed', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        }
      ],
      journeys: [
        {
          id: 'content-creation',
          name: 'Content Creation',
          description: 'Creating and sharing posts',
          screens: ['feed', 'create-post']
        },
        {
          id: 'social-interaction',
          name: 'Social Interaction',
          description: 'Viewing profiles and messaging',
          screens: ['feed', 'profile', 'messages', 'chat']
        }
      ],
      features: [
        {
          id: 'feat-1',
          templateId: 'social-feed',
          name: 'Social Feed',
          screens: ['feed'],
          configuration: { infiniteScroll: true }
        },
        {
          id: 'feat-2',
          templateId: 'chat-basic',
          name: 'Messaging',
          screens: ['messages', 'chat'],
          configuration: { realtime: true }
        }
      ]
    }
  },
  {
    id: 'productivity-app',
    name: 'Task Manager',
    description: 'Productivity app with tasks, projects, and team collaboration',
    category: 'productivity',
    thumbnail: '✅',
    tags: ['tasks', 'projects', 'teams'],
    project: {
      name: 'TaskMaster Pro',
      description: 'Manage tasks and projects efficiently',
      screens: [
        {
          id: 'dashboard',
          name: 'Dashboard',
          type: 'screen',
          position: { x: 400, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'dashboard', to: 'tasks', type: 'navigation' },
            { from: 'dashboard', to: 'projects', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'tasks',
          name: 'Tasks',
          type: 'screen',
          position: { x: 100, y: 300 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'tasks', to: 'task-detail', type: 'navigation' },
            { from: 'tasks', to: 'create-task', type: 'action' }
          ],
          states: [{ name: 'list', isDefault: true }, { name: 'kanban' }]
        },
        {
          id: 'projects',
          name: 'Projects',
          type: 'screen',
          position: { x: 700, y: 300 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'projects', to: 'project-detail', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'team',
          name: 'Team',
          type: 'screen',
          position: { x: 400, y: 500 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'team', to: 'member-profile', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        }
      ],
      journeys: [
        {
          id: 'task-management',
          name: 'Task Management',
          description: 'Creating and managing tasks',
          screens: ['dashboard', 'tasks', 'task-detail']
        },
        {
          id: 'project-overview',
          name: 'Project Overview',
          description: 'Managing projects and teams',
          screens: ['dashboard', 'projects', 'team']
        }
      ],
      features: [
        {
          id: 'feat-1',
          templateId: 'search-basic',
          name: 'Task Search',
          screens: ['tasks'],
          configuration: { filters: ['status', 'priority', 'assignee'] }
        }
      ]
    }
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'Analytics dashboard for SaaS applications',
    category: 'business',
    thumbnail: '📊',
    tags: ['analytics', 'dashboard', 'saas'],
    project: {
      name: 'Analytics Pro',
      description: 'Comprehensive analytics dashboard',
      screens: [
        {
          id: 'overview',
          name: 'Overview',
          type: 'screen',
          position: { x: 400, y: 100 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'overview', to: 'analytics', type: 'navigation' },
            { from: 'overview', to: 'reports', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'analytics',
          name: 'Analytics',
          type: 'screen',
          position: { x: 100, y: 300 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'analytics', to: 'overview', type: 'navigation' }
          ],
          states: [{ name: 'default', isDefault: true }]
        },
        {
          id: 'reports',
          name: 'Reports',
          type: 'screen',
          position: { x: 700, y: 300 },
          size: { width: 256, height: 384 },
          connections: [
            { from: 'reports', to: 'export', type: 'action' }
          ],
          states: [{ name: 'default', isDefault: true }]
        }
      ],
      journeys: [
        {
          id: 'data-analysis',
          name: 'Data Analysis',
          description: 'Analyzing business metrics',
          screens: ['overview', 'analytics', 'reports']
        }
      ],
      features: []
    }
  }
];