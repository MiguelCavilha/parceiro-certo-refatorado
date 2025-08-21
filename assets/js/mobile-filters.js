// Funcionalidade para toggle de filtros em mobile
document.addEventListener("DOMContentLoaded", function () {
  // Criar botão de toggle se não existir
  const sidebar = document.querySelector(".sidebar")
  const sidebarTitle = sidebar.querySelector(".sidebar__title")

  // Criar botão de toggle
  const toggleButton = document.createElement("button")
  toggleButton.type = "button"
  toggleButton.className = "sidebar__toggle"
  toggleButton.id = "filters-toggle"
  toggleButton.innerHTML = "🔍 Mostrar Filtros"

  // Criar container para os filtros
  const filtersContainer = document.createElement("div")
  filtersContainer.className = "sidebar__filters"
  filtersContainer.id = "filters-container"

  // Mover todos os elementos exceto o título para o container
  const elementsToMove = Array.from(sidebar.children).filter(
    el =>
      !el.classList.contains("sidebar__toggle") &&
      !el.classList.contains("sidebar__filters")
  )

  elementsToMove.forEach(element => {
    filtersContainer.appendChild(element)
  })

  // Inserir botão e container no sidebar
  sidebar.insertBefore(toggleButton, sidebar.firstChild)
  sidebar.appendChild(filtersContainer)

  // Funcionalidade do toggle
  let filtersVisible = false

  function toggleFilters() {
    filtersVisible = !filtersVisible

    if (filtersVisible) {
      filtersContainer.classList.add("show")
      filtersContainer.style.display = "block"
      toggleButton.innerHTML = "❌ Ocultar Filtros"
      toggleButton.setAttribute("aria-expanded", "true")
    } else {
      filtersContainer.classList.remove("show")
      filtersContainer.style.display = "none"
      toggleButton.innerHTML = "🔍 Mostrar Filtros"
      toggleButton.setAttribute("aria-expanded", "false")
    }
  }

  // Event listener para o botão
  toggleButton.addEventListener("click", toggleFilters)

  // Verificar se é mobile e ajustar visibilidade inicial
  function checkMobileView() {
    const isMobile = window.innerWidth <= 768

    if (isMobile) {
      toggleButton.style.display = "block"
      if (!filtersVisible) {
        filtersContainer.style.display = "none"
      }
    } else {
      toggleButton.style.display = "none"
      filtersContainer.style.display = "block"
      filtersContainer.classList.add("show")
    }
  }

  // Verificar no carregamento e no redimensionamento
  checkMobileView()
  window.addEventListener("resize", checkMobileView)

  // Funcionalidade do range de avaliação
  const ratingRange = document.getElementById("rating-range")
  const ratingDisplay = document.getElementById("rating-display")

  if (ratingRange && ratingDisplay) {
    ratingRange.addEventListener("input", function () {
      ratingDisplay.textContent = this.value
    })
  }

  // Funcionalidade dos filtros
  const applyFiltersBtn = document.getElementById("apply-filters")
  const clearFiltersBtn = document.getElementById("clear-filters")
  const searchInput = document.getElementById("search-input")

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", function () {
      // Aplicar filtros (funcionalidade pode ser expandida)
      console.log("Filtros aplicados")

      // Em mobile, ocultar filtros após aplicar
      if (window.innerWidth <= 768 && filtersVisible) {
        toggleFilters()
      }
    })
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function () {
      // Limpar todos os filtros
      if (searchInput) searchInput.value = ""
      if (ratingRange) {
        ratingRange.value = 0
        if (ratingDisplay) ratingDisplay.textContent = "0.0"
      }

      // Limpar checkboxes
      const checkboxes = sidebar.querySelectorAll('input[type="checkbox"]')
      checkboxes.forEach(cb => (cb.checked = false))

      // Limpar selects
      const selects = sidebar.querySelectorAll("select")
      selects.forEach(select => (select.selectedIndex = 0))

      console.log("Filtros limpos")
    })
  }

  // Melhorar experiência de toque em mobile
  if ("ontouchstart" in window) {
    // Adicionar classe para dispositivos touch
    document.body.classList.add("touch-device")

    // Melhorar feedback visual para elementos interativos
    const interactiveElements = sidebar.querySelectorAll(
      "button, input, select, .sidebar__checkbox"
    )

    interactiveElements.forEach(element => {
      element.addEventListener("touchstart", function () {
        this.classList.add("touch-active")
      })

      element.addEventListener("touchend", function () {
        setTimeout(() => {
          this.classList.remove("touch-active")
        }, 150)
      })
    })
  }
})
