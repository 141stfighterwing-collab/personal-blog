// Theme Configuration - Classic WordPress-inspired themes

export type ThemeId = 'twenty-ten' | 'twenty-eleven' | 'twenty-twelve'

export interface ThemeConfig {
  id: ThemeId
  name: string
  year: number
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
    link: string
    linkHover: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    headingSize: {
      h1: string
      h2: string
      h3: string
    }
    bodySize: string
    lineHeight: string
  }
  layout: {
    headerStyle: 'fullwidth-image' | 'centered' | 'minimal'
    sidebarPosition: 'left' | 'right' | 'none'
    contentWidth: string
    headerImageHeight: string
    cardStyle: 'shadow' | 'border' | 'flat'
  }
  features: {
    hasHeaderImage: boolean
    hasCalendar: boolean
    hasFeaturedPosts: boolean
    hasTeamSection: boolean
    hasStickyPosts: boolean
    hasSearchBox: boolean
  }
  headerImage: {
    default: string
    alt: string
  }
}

export const themes: Record<ThemeId, ThemeConfig> = {
  'twenty-ten': {
    id: 'twenty-ten',
    name: 'Twenty Ten',
    year: 2010,
    description: 'The classic WordPress default theme. Clean, readable, and timeless.',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#0066CC',
      background: '#FFFFFF',
      surface: '#F9F9F9',
      text: '#333333',
      textMuted: '#666666',
      border: '#CCCCCC',
      link: '#0066CC',
      linkHover: '#004499',
    },
    typography: {
      headingFont: 'Georgia, "Times New Roman", serif',
      bodyFont: 'Arial, Helvetica, sans-serif',
      headingSize: {
        h1: '2.5rem',
        h2: '1.8rem',
        h3: '1.4rem',
      },
      bodySize: '14px',
      lineHeight: '1.6',
    },
    layout: {
      headerStyle: 'fullwidth-image',
      sidebarPosition: 'right',
      contentWidth: '940px',
      headerImageHeight: '198px',
      cardStyle: 'border',
    },
    features: {
      hasHeaderImage: true,
      hasCalendar: true,
      hasFeaturedPosts: false,
      hasTeamSection: false,
      hasStickyPosts: true,
      hasSearchBox: true,
    },
    headerImage: {
      default: '/themes/twenty-ten-header.png',
      alt: 'Tree-lined path',
    },
  },
  'twenty-eleven': {
    id: 'twenty-eleven',
    name: 'Twenty Eleven',
    year: 2011,
    description: 'A sophisticated theme with featured posts and flexible layouts.',
    colors: {
      primary: '#1B1B1B',
      secondary: '#3D3D3D',
      accent: '#1B8BE0',
      background: '#FFFFFF',
      surface: '#F8F8F8',
      text: '#1B1B1B',
      textMuted: '#777777',
      border: '#DDDDDD',
      link: '#1B8BE0',
      linkHover: '#1565C0',
    },
    typography: {
      headingFont: 'Arial, Helvetica, sans-serif',
      bodyFont: 'Arial, Helvetica, sans-serif',
      headingSize: {
        h1: '2.2rem',
        h2: '1.6rem',
        h3: '1.3rem',
      },
      bodySize: '15px',
      lineHeight: '1.7',
    },
    layout: {
      headerStyle: 'fullwidth-image',
      sidebarPosition: 'left',
      contentWidth: '1000px',
      headerImageHeight: '288px',
      cardStyle: 'shadow',
    },
    features: {
      hasHeaderImage: true,
      hasCalendar: false,
      hasFeaturedPosts: true,
      hasTeamSection: false,
      hasStickyPosts: true,
      hasSearchBox: true,
    },
    headerImage: {
      default: '/themes/twenty-eleven-header.png',
      alt: 'Vintage car wheel close-up',
    },
  },
  'twenty-twelve': {
    id: 'twenty-twelve',
    name: 'Twenty Twelve',
    year: 2012,
    description: 'A modern, responsive theme with team sections and clean typography.',
    colors: {
      primary: '#444444',
      secondary: '#666666',
      accent: '#21759B',
      background: '#FFFFFF',
      surface: '#F1F1F1',
      text: '#444444',
      textMuted: '#888888',
      border: '#EDEDED',
      link: '#21759B',
      linkHover: '#0F3647',
    },
    typography: {
      headingFont: '"Open Sans", Arial, Helvetica, sans-serif',
      bodyFont: '"Open Sans", Arial, Helvetica, sans-serif',
      headingSize: {
        h1: '2rem',
        h2: '1.5rem',
        h3: '1.25rem',
      },
      bodySize: '14px',
      lineHeight: '1.714',
    },
    layout: {
      headerStyle: 'centered',
      sidebarPosition: 'right',
      contentWidth: '960px',
      headerImageHeight: '250px',
      cardStyle: 'flat',
    },
    features: {
      hasHeaderImage: true,
      hasCalendar: false,
      hasFeaturedPosts: false,
      hasTeamSection: true,
      hasStickyPosts: false,
      hasSearchBox: false,
    },
    headerImage: {
      default: '/themes/twenty-twelve-header.png',
      alt: 'Wheat field under blue sky',
    },
  },
}

export const getTheme = (themeId: ThemeId): ThemeConfig => {
  return themes[themeId] || themes['twenty-ten']
}

export const themeList = Object.values(themes)
