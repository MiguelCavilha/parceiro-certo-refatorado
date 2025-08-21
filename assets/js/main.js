/**
 * Parceiro Certo - Sistema de Filtros e Busca
 * JavaScript para funcionalidades interativas
 */

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Variáveis globais
let companies = [];
let filteredCompanies = [];

/**
 * Inicializa a aplicação
 */
function initializeApp() {
    loadCompanies();
    setupEventListeners();
    setupRatingSlider();
    updateResultsCount();
}

/**
 * Carrega dados das empresas do DOM
 */
function loadCompanies() {
    const cards = document.querySelectorAll('.card');
    companies = Array.from(cards).map(card => ({
        element: card,
        name: card.dataset.name,
        category: card.dataset.category,
        location: card.dataset.location,
        size: card.dataset.size,
        rating: parseFloat(card.dataset.rating),
        premium: card.dataset.premium === 'true'
    }));
    filteredCompanies = [...companies];
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
    // Busca em tempo real
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filtros de categoria
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Filtros de select
    const selects = ['location-select', 'size-select', 'sort-select'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.addEventListener('change', applyFilters);
        }
    });

    // Filtro premium
    const premiumCheckbox = document.getElementById('premium-only');
    if (premiumCheckbox) {
        premiumCheckbox.addEventListener('change', applyFilters);
    }

    // Slider de avaliação
    const ratingRange = document.getElementById('rating-range');
    if (ratingRange) {
        ratingRange.addEventListener('input', handleRatingChange);
        ratingRange.addEventListener('change', applyFilters);
    }

    // Botões de ação
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');
    
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }

    // Botões dos cards
    setupCardButtons();
}

/**
 * Configura o slider de avaliação
 */
function setupRatingSlider() {
    const ratingRange = document.getElementById('rating-range');
    const ratingDisplay = document.getElementById('rating-display');
    
    if (ratingRange && ratingDisplay) {
        ratingDisplay.textContent = ratingRange.value;
    }
}

/**
 * Configura botões dos cards
 */
function setupCardButtons() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const detailsBtn = card.querySelector('.btn--primary');
        const connectBtn = card.querySelector('.btn--outline');
        const companyName = card.dataset.name;
        
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
                showCompanyDetails(companyName);
            });
        }
        
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                connectToCompany(companyName);
            });
        }
    });
}

/**
 * Manipula a busca por texto
 */
function handleSearch() {
    applyFilters();
}

/**
 * Manipula mudança no slider de avaliação
 */
function handleRatingChange(event) {
    const ratingDisplay = document.getElementById('rating-display');
    if (ratingDisplay) {
        ratingDisplay.textContent = event.target.value;
    }
}

/**
 * Aplica todos os filtros
 */
function applyFilters() {
    const searchTerm = getSearchTerm();
    const selectedCategories = getSelectedCategories();
    const selectedLocation = getSelectedLocation();
    const selectedSize = getSelectedSize();
    const minRating = getMinRating();
    const premiumOnly = getPremiumOnly();
    const sortBy = getSortBy();

    // Aplica filtros
    filteredCompanies = companies.filter(company => {
        // Filtro de busca
        if (searchTerm && !matchesSearch(company, searchTerm)) {
            return false;
        }

        // Filtro de categoria
        if (selectedCategories.length > 0 && !selectedCategories.includes(company.category)) {
            return false;
        }

        // Filtro de localização
        if (selectedLocation && company.location !== selectedLocation) {
            return false;
        }

        // Filtro de tamanho
        if (selectedSize && company.size !== selectedSize) {
            return false;
        }

        // Filtro de avaliação
        if (company.rating < minRating) {
            return false;
        }

        // Filtro premium
        if (premiumOnly && !company.premium) {
            return false;
        }

        return true;
    });

    // Aplica ordenação
    sortCompanies(sortBy);

    // Atualiza interface
    updateDisplay();
    updateResultsCount();
    
    // Adiciona feedback visual
    showFilterFeedback();
}

/**
 * Obtém termo de busca
 */
function getSearchTerm() {
    const searchInput = document.getElementById('search-input');
    return searchInput ? searchInput.value.toLowerCase().trim() : '';
}

/**
 * Obtém categorias selecionadas
 */
function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Obtém localização selecionada
 */
function getSelectedLocation() {
    const select = document.getElementById('location-select');
    return select ? select.value : '';
}

/**
 * Obtém tamanho selecionado
 */
function getSelectedSize() {
    const select = document.getElementById('size-select');
    return select ? select.value : '';
}

/**
 * Obtém avaliação mínima
 */
function getMinRating() {
    const range = document.getElementById('rating-range');
    return range ? parseFloat(range.value) : 0;
}

/**
 * Obtém filtro premium
 */
function getPremiumOnly() {
    const checkbox = document.getElementById('premium-only');
    return checkbox ? checkbox.checked : false;
}

/**
 * Obtém critério de ordenação
 */
function getSortBy() {
    const select = document.getElementById('sort-select');
    return select ? select.value : 'relevance';
}

/**
 * Verifica se empresa corresponde ao termo de busca
 */
function matchesSearch(company, searchTerm) {
    const searchableText = [
        company.name,
        company.category,
        company.location
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
}

/**
 * Ordena empresas
 */
function sortCompanies(sortBy) {
    switch (sortBy) {
        case 'rating-desc':
            filteredCompanies.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-asc':
            filteredCompanies.sort((a, b) => a.rating - b.rating);
            break;
        case 'name-asc':
            filteredCompanies.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredCompanies.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default: // relevance
            // Mantém ordem original
            break;
    }
}

/**
 * Atualiza exibição dos cards
 */
function updateDisplay() {
    const grid = document.getElementById('companies-grid');
    if (!grid) return;

    // Remove todos os cards
    grid.innerHTML = '';

    // Adiciona cards filtrados
    filteredCompanies.forEach(company => {
        grid.appendChild(company.element);
    });

    // Adiciona animação
    const cards = grid.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Atualiza contador de resultados
 */
function updateResultsCount() {
    const counter = document.getElementById('results-count');
    if (counter) {
        const count = filteredCompanies.length;
        const text = count === 1 ? 'empresa encontrada' : 'empresas encontradas';
        counter.textContent = `${count} ${text}`;
    }
}

/**
 * Limpa todos os filtros
 */
function clearFilters() {
    // Limpa busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Limpa checkboxes de categoria
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(cb => cb.checked = false);

    // Limpa selects
    const selects = ['location-select', 'size-select', 'sort-select'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.selectedIndex = 0;
        }
    });

    // Limpa premium
    const premiumCheckbox = document.getElementById('premium-only');
    if (premiumCheckbox) {
        premiumCheckbox.checked = false;
    }

    // Reset rating
    const ratingRange = document.getElementById('rating-range');
    const ratingDisplay = document.getElementById('rating-display');
    if (ratingRange && ratingDisplay) {
        ratingRange.value = 0;
        ratingDisplay.textContent = '0.0';
    }

    // Reaplica filtros (que agora estão limpos)
    applyFilters();
    
    // Feedback visual
    showClearFeedback();
}

/**
 * Mostra detalhes da empresa
 */
function showCompanyDetails(companyName) {
    // Simula abertura de modal ou página de detalhes
    alert(`Visualizando detalhes de: ${companyName}\n\nEm uma implementação real, isso abriria uma página ou modal com informações detalhadas da empresa.`);
}

/**
 * Conecta com empresa
 */
function connectToCompany(companyName) {
    // Simula processo de conexão
    if (confirm(`Deseja se conectar com ${companyName}?`)) {
        alert(`Solicitação de conexão enviada para ${companyName}!\n\nEm uma implementação real, isso enviaria uma mensagem ou notificação para a empresa.`);
    }
}

/**
 * Mostra feedback visual dos filtros
 */
function showFilterFeedback() {
    const applyButton = document.getElementById('apply-filters');
    if (applyButton) {
        applyButton.textContent = 'Filtros Aplicados!';
        applyButton.style.background = 'var(--accent)';
        
        setTimeout(() => {
            applyButton.textContent = 'Aplicar Filtros';
            applyButton.style.background = '';
        }, 1500);
    }
}

/**
 * Mostra feedback de limpeza
 */
function showClearFeedback() {
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
        clearButton.textContent = 'Filtros Limpos!';
        clearButton.style.background = 'var(--accent)';
        clearButton.style.color = 'white';
        
        setTimeout(() => {
            clearButton.textContent = 'Limpar';
            clearButton.style.background = '';
            clearButton.style.color = '';
        }, 1500);
    }
}

/**
 * Função debounce para otimizar performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Adiciona efeitos de hover nos cards
 */
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });
}

/**
 * Adiciona animações de scroll
 */
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Inicializa efeitos adicionais após carregamento
window.addEventListener('load', function() {
    addCardHoverEffects();
    addScrollAnimations();
});

/**
 * Funcionalidade de busca avançada (futura implementação)
 */
function setupAdvancedSearch() {
    // Implementar busca por múltiplos critérios
    // Implementar histórico de buscas
    // Implementar sugestões de busca
}

/**
 * Sistema de favoritos (futura implementação)
 */
function setupFavorites() {
    // Implementar sistema de favoritos
    // Salvar no localStorage
    // Interface para gerenciar favoritos
}

/**
 * Sistema de notificações (futura implementação)
 */
function setupNotifications() {
    // Implementar notificações de novas empresas
    // Notificações de conexões aceitas
    // Sistema de alertas personalizados
}

