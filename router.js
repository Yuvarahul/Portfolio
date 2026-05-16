import { HomeView } from './views/HomeView.js';
import { CatalogView } from './views/CatalogView.js';
import { ProductDetailView } from './views/ProductDetailView.js';

const routes = {
    '/': HomeView,
    '/catalog': CatalogView,
    '/product': ProductDetailView
};

export function initRouter() {
    // Handle browser navigation (Back/Forward)
    window.addEventListener('popstate', handleRouting);

    // Intercept global link clicks for seamless SPA transitions
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            window.history.pushState(null, null, href);
            handleRouting();
        }
    });

    // Run router on first load
    handleRouting();
}

function handleRouting() {
    // Basic dynamic matching logic
    let path = window.location.pathname;
    
    // Fallback for route definitions
    const view = routes[path] || HomeView;
    
    // Inject the view component into our primary app container
    const appContainer = document.getElementById('app-root');
    if (appContainer) {
        appContainer.innerHTML = view.render();
        // Fire lifecycle hooks if the view requires post-render execution
        if (view.afterRender) view.afterRender();
    }
}