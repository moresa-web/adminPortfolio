import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Shortcuts = () => {
  const navigate = useNavigate();

  const keybindings = {
    d: '/dashboard',
    v: '/visitor',
    u: '/users/index',
    p: '/product/index',
    c: '/contacts/index',
    b: '/brands/index',
  };
  
  const altKeybindings = {
    u: '/users/create',
    p: '/product/create',
    c: '/category/index',
    b: '/brands/create',
  };
  
  const ctrlAltKeybindings = {
    c: '/category/create',
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.altKey && event.ctrlKey && ctrlAltKeybindings[event.key]) {
        navigate(ctrlAltKeybindings[event.key], { replace: true });
      } else if (event.altKey && altKeybindings[event.key]) {
        navigate(altKeybindings[event.key], { replace: true });
      } else if (keybindings[event.key]) {
        navigate(keybindings[event.key], { replace: true });
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [navigate]);

  return null; // or return some JSX if you need to render something
};

export default Shortcuts;