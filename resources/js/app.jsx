import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '@/Context/CartContext';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx')
        return pages[`./Pages/${name}.jsx`]()
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <CartProvider>
                <App {...props} />
            </CartProvider>
        )
    },
})