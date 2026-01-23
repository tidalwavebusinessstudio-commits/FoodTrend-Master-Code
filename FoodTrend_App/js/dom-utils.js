/**
 * PRIME DIRECTIVE - Self-Healing DOM Utilities
 * 
 * Defensive DOM access and UI helpers that never throw, always log, and fail gracefully.
 * Part of the Fib(5)→Fib(8) self-healing upgrade.
 * 
 * @module dom-utils
 */

(function (window) {
    'use strict';

    const DOMUtils = {
        /**
         * Safe query selector that never throws
         * Returns null and logs error if element not found
         * 
         * @param {string} selector - CSS selector
         * @param {Element|Document} root - Root element to search from (default: document)
         * @param {boolean} required - Whether this element is required (logs error if true)
         * @returns {Element|null}
         */
        safeQuery: function (selector, root, required) {
            root = root || document;
            required = required !== undefined ? required : false;

            try {
                const element = root.querySelector(selector);

                if (!element && required && window.Logger) {
                    window.Logger.logError('javascript', {
                        message: `Required element not found: ${selector}`,
                        userAction: 'DOM query',
                        additionalData: {
                            selector: selector,
                            rootElement: root.tagName || 'Document'
                        }
                    });
                }

                return element;
            } catch (error) {
                if (window.Logger) {
                    window.Logger.logError('javascript', {
                        error: error,
                        message: `Invalid selector: ${selector}`,
                        userAction: 'DOM query',
                        additionalData: { selector: selector }
                    });
                }
                return null;
            }
        },

        /**
         * Safe query selector all that never throws
         * 
         * @param {string} selector - CSS selector
         * @param {Element|Document} root - Root element to search from (default: document)
         * @returns {Array<Element>} Array of elements (empty if none found)
         */
        safeQueryAll: function (selector, root) {
            root = root || document;

            try {
                const elements = root.querySelectorAll(selector);
                return Array.from(elements);
            } catch (error) {
                if (window.Logger) {
                    window.Logger.logError('javascript', {
                        error: error,
                        message: `Invalid selector for querySelectorAll: ${selector}`,
                        userAction: 'DOM query',
                        additionalData: { selector: selector }
                    });
                }
                return [];
            }
        },

        /**
         * Wrap an async function with loading state management
         * Disables button, shows loading state, restores after completion
         * 
         * @param {HTMLElement} buttonEl - Button element to manage
         * @param {Function} asyncFn - Async function to execute
         * @returns {Promise}
         */
        withLoading: async function (buttonEl, asyncFn) {
            if (!buttonEl) {
                console.warn('[DOM Utils] withLoading: No button element provided');
                return asyncFn();
            }

            const originalText = buttonEl.textContent;
            const originalDisabled = buttonEl.disabled;

            try {
                // Set loading state
                buttonEl.disabled = true;
                buttonEl.setAttribute('aria-busy', 'true');

                if (buttonEl.dataset.loadingText) {
                    buttonEl.textContent = buttonEl.dataset.loadingText;
                } else {
                    buttonEl.classList.add('loading');
                }

                // Execute async function
                const result = await asyncFn();

                return result;
            } catch (error) {
                // Log error
                if (window.Logger) {
                    window.Logger.logError('javascript', {
                        error: error,
                        message: 'Async operation failed',
                        userAction: `Button click: ${originalText}`,
                        additionalData: {
                            buttonId: buttonEl.id,
                            buttonText: originalText
                        }
                    });
                }

                // Show error to user
                this.showToast('An error occurred. Please try again.', 'error');

                throw error; // Re-throw so caller can handle if needed
            } finally {
                // Restore original state
                buttonEl.disabled = originalDisabled;
                buttonEl.removeAttribute('aria-busy');
                buttonEl.textContent = originalText;
                buttonEl.classList.remove('loading');
            }
        },

        /**
         * Show a toast notification to the user
         * 
         * @param {string} message - Message to display
         * @param {string} type - Type: 'success', 'error', 'warning', 'info'
         * @param {number} duration - Duration in ms (default: 3000)
         */
        showToast: function (message, type, duration) {
            type = type || 'info';
            duration = duration || 3000;

            // Create toast container if it doesn't exist
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.setAttribute('aria-live', 'polite');
                container.setAttribute('aria-atomic', 'true');
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `;
                document.body.appendChild(container);
            }

            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.setAttribute('role', 'status');
            toast.textContent = message;
            toast.style.cssText = `
                padding: 12px 20px;
                background: ${this._getToastColor(type)};
                color: white;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                max-width: 300px;
                word-wrap: break-word;
                animation: slideIn 0.3s ease-out;
            `;

            container.appendChild(toast);

            // Auto-remove after duration
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    container.removeChild(toast);
                }, 300);
            }, duration);
        },

        /**
         * Validate form with helpful error messages
         * 
         * @param {HTMLFormElement} formEl - Form element to validate
         * @returns {Object} { isValid: boolean, errors: Array }
         */
        validateForm: function (formEl) {
            if (!formEl || formEl.tagName !== 'FORM') {
                return { isValid: false, errors: ['Invalid form element'] };
            }

            const errors = [];
            const inputs = formEl.querySelectorAll('input, select, textarea');

            // Clear previous error states
            inputs.forEach(input => {
                input.classList.remove('error');
                const errorEl = document.getElementById(`${input.id}-error`);
                if (errorEl) errorEl.remove();
            });

            // Validate each input
            inputs.forEach(input => {
                // Required field validation
                if (input.hasAttribute('required') && !input.value.trim()) {
                    const label = formEl.querySelector(`label[for="${input.id}"]`);
                    const fieldName = label ? label.textContent : input.name || 'This field';

                    errors.push({
                        field: input.name || input.id,
                        message: `${fieldName} is required`
                    });

                    this._showFieldError(input, `${fieldName} is required`);
                }

                // Email validation
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        errors.push({
                            field: input.name || input.id,
                            message: 'Please enter a valid email address'
                        });

                        this._showFieldError(input, 'Please enter a valid email address');
                    }
                }

                // Custom validation via data attribute
                if (input.dataset.validate) {
                    try {
                        const validationFn = new Function('value', input.dataset.validate);
                        const result = validationFn(input.value);
                        if (!result) {
                            const errorMsg = input.dataset.validateMessage || 'Invalid value';
                            errors.push({
                                field: input.name || input.id,
                                message: errorMsg
                            });

                            this._showFieldError(input, errorMsg);
                        }
                    } catch (e) {
                        console.warn('[DOM Utils] Custom validation failed:', e);
                    }
                }
            });

            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },

        // Private methods

        _getToastColor: function (type) {
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };
            return colors[type] || colors.info;
        },

        _showFieldError: function (input, message) {
            input.classList.add('error');

            const errorEl = document.createElement('div');
            errorEl.id = `${input.id}-error`;
            errorEl.className = 'field-error';
            errorEl.textContent = message;
            errorEl.setAttribute('role', 'alert');
            errorEl.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 4px;
            `;

            input.setAttribute('aria-describedby', errorEl.id);
            input.setAttribute('aria-invalid', 'true');

            input.parentNode.insertBefore(errorEl, input.nextSibling);
        }
    };

    // Export to window
    if (typeof window !== 'undefined') {
        window.DOMUtils = DOMUtils;
    }

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DOMUtils;
    }

})(typeof window !== 'undefined' ? window : global);
