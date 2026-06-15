 const productCards = document.querySelectorAll('.product-card');
        const modal = document.getElementById('productModal');
        const closeBtn = document.getElementById('closeBtn');

        // Modal content references
        const modalImg = document.getElementById('modalImg');
        const modalCategory = document.getElementById('modalCategory');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
      

        // Open Modal Event
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                // Extract data values from clicked card markup properties
                const img = card.getAttribute('data-img');
                const cat = card.getAttribute('data-category');
                const title = card.getAttribute('data-title');
                const desc = card.getAttribute('data-desc');
             

                // Inject targeted data into modal spaces
                modalImg.src = img;
                modalCategory.textContent = cat;
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
              

                // Add active modal class toggles to screen layout 
                document.body.classList.add('modal-open');
            });
        });

        // Close Modal via Exit Button
        closeBtn.addEventListener('click', closeModal);

        // Close Modal via Outside Clicking Overlay space
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        function closeModal() {
            document.body.classList.remove('modal-open');
        }