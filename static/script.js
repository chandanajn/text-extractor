document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const resultsSection = document.getElementById('results-section');
    const imagePreview = document.getElementById('image-preview');
    const textOutput = document.getElementById('text-output');
    const loadingOverlay = document.getElementById('loading-overlay');
    const copyBtn = document.getElementById('copy-btn');
    const historyList = document.getElementById('history-list');
    const refreshBtn = document.getElementById('refresh-btn');

    // Initial History Load
    fetchHistory();

    // Event Listeners for Drag and Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    
    // File Input change
    fileInput.addEventListener('change', function(e) {
        if(this.files && this.files[0]) {
            handleFile(this.files[0]);
        }
    });

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if(files && files[0]) {
            handleFile(files[0]);
        }
    }

    function handleFile(file) {
        // Validate file type
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Invalid file type. Please upload a PNG or JPG image.');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            imagePreview.src = reader.result;
        }

        // Upload to server
        uploadImage(file);
    }

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        // Show loading
        loadingOverlay.classList.remove('hidden');
        resultsSection.classList.add('hidden');

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to extract text');
            }

            const data = await response.json();
            
            // Update UI with results
            textOutput.value = data.extracted_text;
            resultsSection.classList.remove('hidden');
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Refresh history
            fetchHistory();

        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            loadingOverlay.classList.add('hidden');
            // Reset file input
            fileInput.value = '';
        }
    }

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        textOutput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });

    // Refresh History
    refreshBtn.addEventListener('click', fetchHistory);

    async function fetchHistory() {
        refreshBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => refreshBtn.style.transform = 'rotate(0deg)', 300);

        try {
            const response = await fetch('/records?limit=20');
            if (!response.ok) throw new Error('Failed to fetch history');
            
            const records = await response.json();
            
            historyList.innerHTML = '';
            
            if (records.length === 0) {
                historyList.innerHTML = '<div class="loading-text">No records found.</div>';
                return;
            }

            // Sort newest first
            records.sort((a, b) => new Date(b.upload_time) - new Date(a.upload_time));

            records.forEach(record => {
                const item = document.createElement('div');
                item.className = 'history-item';
                
                // Format date
                const date = new Date(record.upload_time);
                const dateString = date.toLocaleString();
                
                // Truncate text for preview
                let previewText = record.extracted_text;
                if(previewText.length > 50) previewText = previewText.substring(0, 50) + '...';

                item.innerHTML = `
                    <h4><i class="fa-regular fa-image"></i> ${record.filename}</h4>
                    <p>${previewText}</p>
                    <span class="time">${dateString}</span>
                `;
                
                // Clicking history item puts text in main view (no image available from backend without another endpoint, just text)
                item.addEventListener('click', () => {
                    textOutput.value = record.extracted_text;
                    imagePreview.src = '';
                    imagePreview.alt = 'Image not available in history view';
                    resultsSection.classList.remove('hidden');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });

                historyList.appendChild(item);
            });

        } catch (error) {
            console.error('History fetch error:', error);
            historyList.innerHTML = `<div class="loading-text" style="color: var(--danger)">Error loading history.</div>`;
        }
    }
});
