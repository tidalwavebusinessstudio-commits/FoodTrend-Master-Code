/**
 * Theme Toggle Utility
 * Handles dark/light mode switching with localStorage persistence
 */

(function () {
    'use strict';

    const THEME_KEY = 'foodtrend_theme';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';

    // Get saved theme or default to dark
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || DARK_THEME;
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);

        // Update all toggle switches
        const toggles = document.querySelectorAll('.theme-switch-input');
        toggles.forEach(toggle => {
            toggle.checked = (theme === LIGHT_THEME);
        });

        console.log('[Theme] Applied:', theme);
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(newTheme);
        return newTheme;
    }

    // Initialize on page load
    function initTheme() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
    }

    // Create toggle switch HTML
    function createToggleSwitch() {
        const isLight = getSavedTheme() === LIGHT_THEME;
        return `
            <label class="theme-switch" title="Toggle Light/Dark Mode">
                <input type="checkbox" class="theme-switch-input" ${isLight ? 'checked' : ''}>
                <span class="theme-switch-slider">
                    <span class="theme-switch-icon sun">☀️</span>
                    <span class="theme-switch-icon moon">🌙</span>
                </span>
            </label>
        `;
    }

    // Inject CSS for toggle switch
    function injectStyles() {
        if (document.getElementById('theme-toggle-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'theme-toggle-styles';
        styles.textContent = `
            .theme-switch {
                position: relative;
                display: inline-block;
                width: 52px;
                height: 28px;
                cursor: pointer;
            }
            
            .theme-switch-input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .theme-switch-slider {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 28px;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .theme-switch-slider::before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background: white;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .theme-switch-input:checked + .theme-switch-slider {
                background: #FF3008;
            }
            
            .theme-switch-input:checked + .theme-switch-slider::before {
                transform: translateX(24px);
            }
            
            .theme-switch-icon {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                transition: opacity 0.3s ease;
            }
            
            .theme-switch-icon.sun {
                right: 6px;
                opacity: 1;
            }
            
            .theme-switch-icon.moon {
                left: 6px;
                opacity: 0;
            }
            
            .theme-switch-input:checked + .theme-switch-slider .sun {
                opacity: 0;
            }
            
            .theme-switch-input:checked + .theme-switch-slider .moon {
                opacity: 1;
            }
            
            /* Light mode adjustments */
            [data-theme="light"] .theme-switch-slider {
                background: rgba(0, 0, 0, 0.1);
                border-color: rgba(0, 0, 0, 0.15);
            }
            
            /* Theme row container for sidebar/menu */
            .theme-toggle-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                gap: 12px;
            }
            
            .theme-toggle-label {
                font-size: 13px;
                color: var(--text-secondary, #94A3B8);
                font-weight: 500;
            }
        `;
        document.head.appendChild(styles);
    }

    // Apply immediately (before DOMContentLoaded to prevent flash)
    initTheme();
    injectStyles();

    // Attach event handlers after DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        applyTheme(getSavedTheme());

        // Attach change handlers to any existing toggles
        document.querySelectorAll('.theme-switch-input').forEach(input => {
            input.addEventListener('change', toggleTheme);
        });
    });

    // Use event delegation for dynamically added toggles
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('theme-switch-input')) {
            toggleTheme();
        }
    });

    // Expose to global scope
    window.FoodTrendTheme = {
        toggle: toggleTheme,
        apply: applyTheme,
        get: getSavedTheme,
        createSwitch: createToggleSwitch,
        DARK: DARK_THEME,
        LIGHT: LIGHT_THEME
    };
})();
