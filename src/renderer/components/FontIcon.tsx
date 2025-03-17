import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Initialize FontAwesome library
library.add(fas)

// Render FontAwesome icon from string with color
export const renderIcon = (iconString: string, color: string = '#1677ff') => {
  if (!iconString) return null;
  
  const iconParts = iconString.split(' ');
  if (iconParts.length < 2) return null;
  
  const iconName = iconParts[1].replace('fa-', '');
  return <FontAwesomeIcon icon={['fas', iconName]} style={{ color }} />;
} 