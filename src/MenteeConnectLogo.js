import React from 'react';

const MenteeConnectLogo = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  animate = false,
  variant = 'default' // 'default', 'white', 'minimal'
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { container: 'h-6 w-6', inner: 'h-4 w-4', text: 'text-sm', dot: 'h-2 w-2' },
    sm: { container: 'h-8 w-8', inner: 'h-6 w-6', text: 'text-base', dot: 'h-3 w-3' },
    md: { container: 'h-12 w-12', inner: 'h-8 w-8', text: 'text-xl', dot: 'h-4 w-4' },
    lg: { container: 'h-16 w-16', inner: 'h-12 w-12', text: 'text-2xl', dot: 'h-6 w-6' },
    xl: { container: 'h-20 w-20', inner: 'h-16 w-16', text: 'text-3xl', dot: 'h-8 w-8' }
  };

  const config = sizeConfig[size];

  // Variant configurations
  const variants = {
    default: {
      container: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      inner: 'bg-white',
      text: 'text-indigo-600',
      dot: 'bg-gradient-to-r from-pink-400 to-orange-400',
      brandText: 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
    },
    white: {
      container: 'bg-white border-2 border-indigo-200',
      inner: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      text: 'text-white',
      dot: 'bg-gradient-to-r from-pink-400 to-orange-400',
      brandText: 'text-gray-800'
    },
    minimal: {
      container: 'bg-indigo-100',
      inner: 'bg-indigo-600',
      text: 'text-white',
      dot: 'bg-pink-400',
      brandText: 'text-indigo-600'
    }
  };

  const colors = variants[variant];

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <div className={`
          ${config.container} 
          ${colors.container}
          rounded-2xl flex items-center justify-center shadow-lg 
          ${animate ? 'transform rotate-12 hover:rotate-0 transition-transform duration-300' : 'transform rotate-12'}
        `}>
          <div className={`
            ${config.inner} 
            ${colors.inner}
            rounded-xl flex items-center justify-center transform -rotate-12
          `}>
            <span className={`${colors.text} font-bold ${config.text}`}>
              M
            </span>
          </div>
        </div>
        <div className={`
          absolute -top-1 -right-1 
          ${config.dot} 
          ${colors.dot}
          rounded-full 
          ${animate ? 'animate-pulse' : ''}
        `}></div>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`
          ml-3 font-bold 
          ${config.text} 
          ${colors.brandText}
        `}>
          MenteeConnect
        </span>
      )}
    </div>
  );
};

// Usage Examples:
const LogoExamples = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">MenteeConnect Logo Variations</h2>
      
      {/* Default with different sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Sizes</h3>
        <div className="flex items-center space-x-6">
          <MenteeConnectLogo size="xs" />
          <MenteeConnectLogo size="sm" />
          <MenteeConnectLogo size="md" />
          <MenteeConnectLogo size="lg" />
          <MenteeConnectLogo size="xl" />
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Variants</h3>
        <div className="flex items-center space-x-8">
          <MenteeConnectLogo variant="default" animate />
          <MenteeConnectLogo variant="white" animate />
          <MenteeConnectLogo variant="minimal" animate />
        </div>
      </div>

      {/* Icon only */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Icon Only</h3>
        <div className="flex items-center space-x-6">
          <MenteeConnectLogo showText={false} size="sm" />
          <MenteeConnectLogo showText={false} size="md" />
          <MenteeConnectLogo showText={false} size="lg" animate />
        </div>
      </div>

      {/* Different backgrounds */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">On Different Backgrounds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <MenteeConnectLogo />
          </div>
          <div className="bg-indigo-600 p-6 rounded-lg shadow">
            <MenteeConnectLogo variant="white" />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <MenteeConnectLogo variant="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeConnectLogo;
export { LogoExamples };