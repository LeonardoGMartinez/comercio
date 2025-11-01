const productos = [
    {
        id: 1,
        nombre: "La mano de D10s",
        precio: 98500,
        imagen: "../imagenes/muniecos_accion/munieco_1.png",
        categoria: "figura"
    },
    {
        id: 2,
        nombre: "Messi campeón mundial",
        precio: 98500,
        imagen: "../imagenes/muniecos_accion/munieco_2.png",
        categoria: "figura"
    },
    {
        id: 3,
        nombre: "San Martín",
        precio: 70000,
        imagen: "../imagenes/muniecos_accion/munieco_3.png",
        categoria: "figura"
    },
    {
        id: 4,
        nombre: "Charly García",
        precio: 65000,
        imagen: "../imagenes/muniecos_accion/munieco_4.png",
        categoria: "figura"
    },
    {
        id: 5,
        nombre: "Set Colección - Soda Stereo",
        precio: 165000,
        imagen: "../imagenes/muniecos_accion/munieco_5.png",
        categoria: "figura"
    },
    {
        id: 6,
        nombre: "Televisión - Viale vs Samid",
        precio: 50000,
        imagen: "../imagenes/muniecos_accion/munieco_6.png",
        categoria: "figura"
    },
    {
        id: 7,
        nombre: "Televisión - Mirtha y Susana",
        precio: 50000,
        imagen: "../imagenes/muniecos_accion/munieco_7.png",
        categoria: "figura"
    },
    {
        id: 8,
        nombre: "Dragon Ball - Goku",
        precio: 50000,
        imagen: "../imagenes/muniecos_accion/munieco_8.png",
        categoria: "figura"
    },
    {
        id: 9,
        nombre: "Kit Césped Sintético",
        precio: 5500,
        imagen: "../imagenes/accesorios_decoraciones/cesped.jpg",
        categoria: "accesorio"
    },
    {
        id: 10,
        nombre: "Set de Árboles x5",
        precio: 3500,
        imagen: "../imagenes/accesorios_decoraciones/arboles.avif",
        categoria: "accesorio"
    },
    {
        id: 11,
        nombre: "Bases Personalizadas",
        precio: 1800,
        imagen: "../imagenes/accesorios_decoraciones/peanas.jpg",
        categoria: "accesorio"
    },
    {
        id: 12,
        nombre: "Pack Decoración Variado",
        precio: 1200,
        imagen: "../imagenes/accesorios_decoraciones/rocas.jpg",
        categoria: "accesorio"
    }
];

$(document).ready(function() {
    renderProducts();
    setupEventListeners();
});

function renderProducts() {
    const container = $('#productsContainer');
    container.empty();

    // Obtener el tipo de promociion seleccionada
    const promoType = $('#promoSelect').val();

    // IDs de productos validos para 3x2 (solo accesorios)
    // Tambien podria hacerse moificando el json y agregando una propiedad "aplica3x2": true/false o categorias que aplica, pero por simplicidad lo dejo asi
    const validIds3x2 = [9, 10, 11, 12]; // Kit Cesped, Set arboles, Bases, Pack Decoracion

    // Filtrar productos segun la promoción
    let productosToShow = productos;
    if (promoType === '3x2') {
        productosToShow = productos.filter(p => validIds3x2.includes(p.id));
    }

    productosToShow.forEach(function(producto) {
        const productHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="product-checkbox-container" data-product-id="${producto.id}">
                    <div class="form-check text-center">
                        <input class="form-check-input product-checkbox" type="checkbox"
                               value="${producto.id}" id="product-${producto.id}">
                        <label class="form-check-label w-100" for="product-${producto.id}">
                            <img src="${producto.imagen}" alt="${producto.nombre}"
                                 class="product-image d-block mx-auto"
                                 onerror="this.src='../imagenes/logo/logo_horizontal.png'">
                            <div class="product-name">${producto.nombre}</div>
                            <div class="product-price">$${formatPrice(producto.precio)}</div>
                        </label>
                    </div>
                    <div class="quantity-controls" style="display: none;">
                        <button class="quantity-btn minus-btn" data-product-id="${producto.id}">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="10"
                               data-product-id="${producto.id}" readonly>
                        <button class="quantity-btn plus-btn" data-product-id="${producto.id}">+</button>
                    </div>
                </div>
            </div>
        `;
        container.append(productHTML);
    });
}

function setupEventListeners() {
    // Manejar seleccion de productos
    $(document).on('change', '.product-checkbox', function() {
        const productId = $(this).val();
        const container = $(this).closest('.product-checkbox-container');
        const quantityControls = container.find('.quantity-controls');

        if ($(this).is(':checked')) {
            container.addClass('selected');
            quantityControls.show();
        } else {
            container.removeClass('selected');
            quantityControls.hide();
            // Resetear cantidad a 1
            container.find('.quantity-input').val(1);
        }

        // Recalcular automaticamente
        calculatePromotion();
    });

    // Botones de cantidad
    $(document).on('click', '.plus-btn', function() {
        const productId = $(this).data('product-id');
        const input = $(`.quantity-input[data-product-id="${productId}"]`);
        let value = parseInt(input.val());
        if (value < 10) {
            input.val(value + 1);
            // Recalcular automaticamente
            calculatePromotion();
        }
    });

    $(document).on('click', '.minus-btn', function() {
        const productId = $(this).data('product-id');
        const input = $(`.quantity-input[data-product-id="${productId}"]`);
        let value = parseInt(input.val());
        if (value > 1) {
            input.val(value - 1);
            // Recalcular automaticamente
            calculatePromotion();
        }
    });

    // Cambio de tipo de promocion
    $('#promoSelect').on('change', function() {
        // Re-renderizar productos segun la promocion seleccionada
        renderProducts();
        // Ocultar resultados al cambiar de promocion
        $('#resultsSection').slideUp(300);
    });

    // Boton resetear
    $('#resetBtn').on('click', function() {
        resetCalculator();
    });

    // Checkbox de terminos y condiciones
    $('#acceptTerms').on('change', function() {
        $('#redeemBtn').prop('disabled', !$(this).is(':checked'));
    });

    // Boton canjear promocion
    $('#redeemBtn').on('click', function() {
        generatePromoCode();
    });

    // Boton copiar código
    $('#copyCodeBtn').on('click', function() {
        copyPromoCode();
    });
}

function calculatePromotion() {
    const selectedProducts = getSelectedProducts();

    if (selectedProducts.length === 0) {
        // Ocultar resultados si no hay productos seleccionados
        $('#resultsSection').slideUp(300);
        return;
    }

    const promoType = $('#promoSelect').val();
    let result = {};

    switch(promoType) {
        case '2x50':
            result = calculate2x50(selectedProducts);
            break;
        case '3x2':
            result = calculate3x2(selectedProducts);
            break;
        case '10percent':
            result = calculate10Percent(selectedProducts);
            break;
    }

    displayResults(result);
}

function getSelectedProducts() {
    const selected = [];

    $('.product-checkbox:checked').each(function() {
        const productId = parseInt($(this).val());
        const producto = productos.find(p => p.id === productId);
        const quantity = parseInt($(`.quantity-input[data-product-id="${productId}"]`).val());

        // Agregar el producto tantas veces como la cantidad seleccionada
        for (let i = 0; i < quantity; i++) {
            selected.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio
            });
        }
    });

    return selected;
}

function calculate2x50(products) {
    const total = products.reduce((sum, p) => sum + p.precio, 0);
    let discount = 0;

    if (products.length >= 2) {
        // Ordenar por precio descendente
        const sorted = [...products].sort((a, b) => b.precio - a.precio);

        // Aplicar 50% de descuento en cada segundo producto
        for (let i = 1; i < sorted.length; i += 2) {
            discount += sorted[i].precio * 0.5;
        }
    }

    return {
        total: total,
        discount: discount,
        final: total - discount,
        message: products.length < 2 ? 'Necesitás al menos 2 productos para esta promoción' : ''
    };
}

function calculate3x2(products) {
    const total = products.reduce((sum, p) => sum + p.precio, 0);
    let discount = 0;

    // IDs de productos validos para 3x2 (solo accesorios)
    const validIds = [9, 10, 11, 12]; // Kit Cesped, Set Árboles, Bases, Pack Decoracion

    // Filtrar solo productos validos para esta promocion
    const validProducts = products.filter(p => validIds.includes(p.id));

    if (validProducts.length < 3) {
        return {
            total: total,
            discount: 0,
            final: total,
            message: 'La promoción 3x2 solo aplica para accesorios (Césped, Árboles, Bases, Decoración). Necesitás al menos 3 de estos productos.'
        };
    }

    // Ordenar por precio ascendente
    const sorted = [...validProducts].sort((a, b) => a.precio - b.precio);

    // Por cada 3 productos validos, el mas barato es gratis
    const groups = Math.floor(sorted.length / 3);
    for (let i = 0; i < groups; i++) {
        discount += sorted[i].precio;
    }

    return {
        total: total,
        discount: discount,
        final: total - discount,
        message: ''
    };
}

function calculate10Percent(products) {
    const total = products.reduce((sum, p) => sum + p.precio, 0);
    let discount = 0;

    if (total > 30000) {
        discount = total * 0.1;
    }

    return {
        total: total,
        discount: discount,
        final: total - discount,
        message: total <= 30000 ? 'El total debe superar $30.000 para aplicar esta promoción' : ''
    };
}

function displayResults(result) {
    if (result.message) {
        // Mostrar resultados con mensaje de advertencia
        $('#totalOriginal').text('$' + formatPrice(result.total));
        $('#discount').text('$0');
        $('#totalFinal').text('$' + formatPrice(result.total));
        $('#savings').text('$0');

        // Mostrar alerta temporal
        showAlert(result.message);

        // Ocultar seccion de canje
        $('#redeemSection').hide();
    } else {
        $('#totalOriginal').text('$' + formatPrice(result.total));
        $('#discount').text('$' + formatPrice(result.discount));
        $('#totalFinal').text('$' + formatPrice(result.final));
        $('#savings').text('$' + formatPrice(result.discount));

        // Mostrar seccion de canje solo si hay descuento aplicado
        if (result.discount > 0) {
            $('#redeemSection').slideDown(300);
        } else {
            $('#redeemSection').hide();
        }
    }

    // Mostrar seccion de resultados si está oculta (sin scroll)
    if (!$('#resultsSection').is(':visible')) {
        $('#resultsSection').show();
    }
}

function resetCalculator() {
    $('.product-checkbox').prop('checked', false);
    $('.product-checkbox-container').removeClass('selected');
    $('.quantity-controls').hide();
    $('.quantity-input').val(1);
    $('#resultsSection').slideUp(300);
    $('#promoSelect').val('2x50');

    // Scroll al inicio de la seccion de productos
    $('html, body').animate({
        scrollTop: $('#productsContainer').offset().top - 150
    }, 500);
}

function formatPrice(price) {
    return price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function showAlert(message) {
    // Crear alerta temporal
    const alertHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    $('#productsContainer').before(alertHTML);

    // Remover alerta después de 15 segundos
    setTimeout(function() {
        $('.alert-warning').fadeOut(900, function() {
            $(this).remove();
        });
    }, 5000);

    // Scroll a la alerta
    $('html, body').animate({
        scrollTop: $('.alert-warning').offset().top - 150
    }, 300);
}

function generatePromoCode() {
    // Generar codigo unico basado en timestamp y valores aleatorios
    const timestamp = Date.now().toString(36).toUpperCase();
    const random1 = Math.random().toString(36).substring(2, 7).toUpperCase();
    const random2 = Math.random().toString(36).substring(2, 7).toUpperCase();

    const code = `${random1}-${timestamp.substring(0, 5)}-${random2}`;

    // Obtener productos seleccionados
    const selectedProducts = getSelectedProducts();
    const promoType = $('#promoSelect').val();

    // Nombre de la promocion
    let promoName = '';
    switch(promoType) {
        case '2x50':
            promoName = '2x50% en el segundo';
            break;
        case '3x2':
            promoName = '3x2 en Accesorios';
            break;
        case '10percent':
            promoName = '10% OFF +$30.000';
            break;
    }

    // Generar lista de productos
    const productCounts = {};
    selectedProducts.forEach(p => {
        if (productCounts[p.nombre]) {
            productCounts[p.nombre].qty++;
        } else {
            productCounts[p.nombre] = {
                qty: 1,
                precio: p.precio
            };
        }
    });

    let detailsHTML = '<ul class="list-unstyled small mb-0">';
    detailsHTML += `<li class="mb-1"><strong>Promoción:</strong> ${promoName}</li>`;
    detailsHTML += '<li class="mb-1"><strong>Productos:</strong></li>';

    for (const [nombre, data] of Object.entries(productCounts)) {
        detailsHTML += `<li class="ms-3">• ${nombre} x${data.qty} - $${formatPrice(data.precio * data.qty)}</li>`;
    }

    const totalOriginal = $('#totalOriginal').text();
    const discount = $('#discount').text();
    const totalFinal = $('#totalFinal').text();

    detailsHTML += `<li class="mt-2"><strong>Total sin desc.:</strong> ${totalOriginal}</li>`;
    detailsHTML += `<li><strong>Descuento:</strong> ${discount}</li>`;
    detailsHTML += `<li class="text-success"><strong>Total final:</strong> ${totalFinal}</li>`;
    detailsHTML += '</ul>';

    // Mostrar codigo en el modal
    $('#promoCode').text(code);
    $('#promoDetailsList').html(detailsHTML);

    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('codeModal'));
    modal.show();

    // Resetear checkbox
    $('#acceptTerms').prop('checked', false);
    $('#redeemBtn').prop('disabled', true);
}

function copyPromoCode() {
    const code = $('#promoCode').text();

    navigator.clipboard.writeText(code).then(function() {
        // Cambiar el texto del boton
        const originalHTML = $('#copyCodeBtn').html();
        $('#copyCodeBtn').html('<i class="bi bi-check2 me-2"></i>Copiado!');

        setTimeout(function() {
            $('#copyCodeBtn').html(originalHTML);
        }, 2000);
    }).catch(function(err) {
        alert('Error al copiar el código. Por favor, copialo manualmente.');
    });
}
