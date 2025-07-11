// This file contains all the JavaScript and jQuery code for the Product Comparison Tool.

// ---- STATIC PRODUCT DATA ----
// In a real application, this data would likely be fetched from a server/API.
const products = [
    {
        id: 1,
        name: 'ZenBook 14',
        brand: 'Asus',
        price: 999,
        image: 'azus.jpg',
        features: {
            'Screen Size': '14 inches',
            'RAM': '16 GB',
            'Storage': '512 GB SSD'
        }
    },
    {
        id: 2,
        name: 'MacBook Air M2',
        brand: 'Apple',
        price: 1199,
        image: 'm2-macbook.jpg',
        features: {
            'Screen Size': '13.6 inches',
            'RAM': '8 GB',
            'Storage': '256 GB SSD'
        }
    },
    {
        id: 3,
        name: 'XPS 15',
        brand: 'Dell',
        price: 1499,
        image: 'xps15.jpg',
        features: {
            'Screen Size': '15.6 inches',
            'RAM': '16 GB',
            'Storage': '512 GB SSD'
        }
    },
    {
        id: 4,
        name: 'Spectre x360',
        brand: 'HP',
        price: 1249,
        image: 'spectre.jpg',
        features: {
            'Screen Size': '13.5 inches',
            'RAM': '8 GB',
            'Storage': '512 GB SSD'
        }
    },
    {
        id: 5,
        name: 'Surface Laptop 5',
        brand: 'Microsoft',
        price: 1299,
        image: 'surface.jpg',
        features: {
            'Screen Size': '13.5 inches',
            'RAM': '16 GB',
            'Storage': '256 GB SSD'
        }
    },
    {
        id: 6,
        name: 'Yoga 7i',
        brand: 'Lenovo',
        price: 899,
        image: 'Yoga.jpg',
        features: {
            'Screen Size': '16 inches',
            'RAM': '8 GB',
            'Storage': '512 GB SSD'
        }
    }
];

// Use jQuery's .ready() function to ensure the DOM is fully loaded before running scripts
$(document).ready(function() {

    // Array to store the IDs of products selected for comparison
    let compareItems = [];

    // ---- RENDER THE INITIAL PRODUCT LIST ----
    const productGrid = $('#product-grid');
    products.forEach(product => {
        const productCard = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${product.brand}</h6>
                        <p class="card-text fs-4 fw-bold">$${product.price}</p>
                        <ul class="list-unstyled mt-3 mb-4">
                            <li><strong>Screen:</strong> ${product.features['Screen Size']}</li>
                            <li><strong>RAM:</strong> ${product.features.RAM}</li>
                            <li><strong>Storage:</strong> ${product.features.Storage}</li>
                        </ul>
                        <div class="mt-auto">
                           <button class="btn btn-primary w-100 add-to-compare-btn" data-id="${product.id}">
                                Add to Compare
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productGrid.append(productCard);
    });


    // ---- EVENT HANDLER for "Add to Compare" button clicks ----
    $('.add-to-compare-btn').on('click', function() {
        const button = $(this);
        const productId = button.data('id');

        if (compareItems.includes(productId)) {
            // If already selected, remove it (deselect)
            compareItems = compareItems.filter(id => id !== productId);
            button.removeClass('btn-success').addClass('btn-primary').text('Add to Compare');
        } else {
            // If not selected, add it (if there's room)
            if (compareItems.length < 3) {
                compareItems.push(productId);
                button.removeClass('btn-primary').addClass('btn-success').text('Added to Compare');
            } else {
                alert('You can only compare up to 3 products.');
            }
        }
        
        // Update the comparison view
        renderComparison();
    });

    // ---- EVENT HANDLER for "Remove" buttons in the comparison area ----
    // Note: We use event delegation for dynamically created elements
    $('#comparison-table').on('click', '.remove-from-compare-btn', function() {
        const productId = $(this).data('id');
        
        // Remove item from the comparison array
        compareItems = compareItems.filter(id => id !== productId);
        
        // Reset the corresponding "Add to Compare" button in the main grid
        $(`.add-to-compare-btn[data-id="${productId}"]`)
            .removeClass('btn-success')
            .addClass('btn-primary')
            .text('Add to Compare');
        
        renderComparison(); // Re-render the comparison view
    });

    // ---- EVENT HANDLER for the "Clear All" button ----
    $('#clear-comparison-btn').on('click', function() {
        compareItems = []; // Empty the array
        
        // Reset all "Add to Compare" buttons
        $('.add-to-compare-btn')
            .removeClass('btn-success')
            .addClass('btn-primary')
            .text('Add to Compare');
            
        renderComparison(); // Re-render to hide the section
    });

    // ---- FUNCTION to render the comparison section ----
    function renderComparison() {
        const comparisonSection = $('#comparison-section');
        const comparisonTable = $('#comparison-table');
        comparisonTable.empty(); // Clear out old comparison cards

        // Hide the section if fewer than 2 items are selected
        if (compareItems.length < 2) {
            comparisonSection.hide();
            return;
        }

        comparisonSection.show(); // Show the section

        // Get the full product objects for the selected IDs
        const selectedProducts = products.filter(p => compareItems.includes(p.id));

        // Create and append a card for each selected product
        selectedProducts.forEach(product => {
            const comparisonCard = `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${product.brand}</h6>
                            <p class="card-text fs-4 fw-bold">$${product.price}</p>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" data-feature="Screen Size">${product.features['Screen Size']}</li>
                                <li class="list-group-item" data-feature="RAM">${product.features.RAM}</li>
                                <li class="list-group-item" data-feature="Storage">${product.features.Storage}</li>
                            </ul>
                            <button class="btn btn-sm btn-warning remove-from-compare-btn mt-3" data-id="${product.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            comparisonTable.append(comparisonCard);
        });
        
        highlightDifferences(); // Call function to highlight different features
    }

    // ---- FUNCTION to highlight differing features ----
    function highlightDifferences() {
        const featuresToCompare = ['Screen Size', 'RAM', 'Storage'];
        const selectedProducts = products.filter(p => compareItems.includes(p.id));

        if (selectedProducts.length < 2) return; // No need to compare if less than 2 items

        featuresToCompare.forEach(feature => {
            // Get all values for the current feature (e.g., ['16 GB', '8 GB', '16 GB'])
            const values = selectedProducts.map(p => p.features[feature]);
            
            // A Set only stores unique values. If its size > 1, the features are different.
            const uniqueValues = new Set(values);

            if (uniqueValues.size > 1) {
                // Find all list items for this feature and add a highlight class
                $(`#comparison-table .list-group-item[data-feature="${feature}"]`).addClass('highlight');
            }
        });
    }

}); // End of $(document).ready()