const typographySizes = {
  heading1: 'text-5xl md:text-6xl !leading-tight',
  heading2: 'text-4xl md:text-5xl !leading-tight',
  heading3: 'text-3xl md:text-4xl !leading-tight',
  heading4: 'text-2xl md:text-3xl !leading-tight',
  heading5: 'text-xl md:text-2xl !leading-tight',
  heading6: 'text-lg md:text-xl !leading-tight',
  title: 'text-lg lg:text-xl !leading-tight',
  paragraph: 'text-base md:text-lg !leading-tight',
  body: 'text-sm md:text-base',
  label: 'text-base',
  button: 'text-sm',
  caption1: 'text-sm',
  caption2: 'text-xs',
};

const fontFamilies = {
  'poppins': 'font-poppins',
};

const fontWeights = {
  bold: 'font-bold',
  semibold: 'font-semibold',
  medium: 'font-medium',
  regular: 'font-normal',
};

export function Typography({
  type,
  font = 'poppins',
  weight = 'regular',
  children,
  className = '',
  dangerouslySetInnerHTML,
}) {
  const variantStyles = typographySizes[type] || '';
  const fontStyles = fontFamilies[font] || '';
  const weightStyles = fontWeights[weight] || '';

  if (dangerouslySetInnerHTML) {
    return (
      <div
        className={`${variantStyles} ${fontStyles} ${weightStyles} ${className}`}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    );
  }

  return (
    <div className={`${variantStyles} ${fontStyles} ${weightStyles} ${className}`}>
      {children}
    </div>
  );
}
