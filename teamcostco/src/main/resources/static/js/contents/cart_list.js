// 수량 증가/감소 버튼 이벤트 리스너
$('.decrease_btn, .increase_btn').on('click', function () {
    var quantityInput = $(this).siblings('.quantity_input');
    var currentValue = parseInt(quantityInput.val()) || 1;

    if ($(this).hasClass('decrease_btn') && currentValue > 1) {
        currentValue--;
    } else if ($(this).hasClass('increase_btn')) {
        currentValue++;
    }

    quantityInput.val(currentValue);
    updateQuantityAndPrice(quantityInput, currentValue);
});

// 수량 입력 필드 변경 이벤트 리스너
$('.quantity_input').on('change', function () {
    var numericValue = this.value.replace(/[^0-9]/g, '');
    if (numericValue === '') {
        numericValue = '1';
    }
    this.value = numericValue;
    updateQuantityAndPrice($(this), numericValue);
});

// 수량 및 가격 업데이트 함수
function updateQuantityAndPrice(quantityInput, value) {
    var itemId = quantityInput.parent().data('item-id');
    updateProductCount(itemId, value);

    let price = $('#cart_item_' + itemId).data('item-price');
    updateTotalPrice(itemId, formatPrice(value * price));

    // 체크된 아이템인 경우 총합 업데이트
    if ($('#' + itemId).is(':checked')) {
        updateTotalSummary();
    }

    // 수량 변경 시 서버로 AJAX 요청 보내기
    var productCode = $('#cart_item_' + itemId).data('product-code');
    updateProductCountOnServer(productCode, value);
}

// 상품 수량 업데이트 함수
function updateProductCount(item_id, value) {
    $('#product_count_' + item_id).text(value);
}

// 상품 총 가격 업데이트 함수
function updateTotalPrice(item_id, value) {
    $('#product_total_price_' + item_id).text(value);
}

// 가격 포맷팅 함수
function formatPrice(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' 원';
}

// 총합 업데이트 함수
function updateTotalSummary() {
    var totalQuantity = 0;
    var totalProductAmount = 0;

    $('.item_checkbox:checked').each(function() {
        var itemId = $(this).attr('id');

        var quantity = parseInt($('#product_count_' + itemId).text()) || 0;

        var totalPriceText = $('#product_total_price_' + itemId).text();
        var totalPrice = parseInt(totalPriceText.replace(/[^0-9]/g, '')) || 0;

        totalQuantity += quantity;
        totalProductAmount += totalPrice;
    });

    $('#total_quantity').text(totalQuantity + ' 개');
    $('#total_product_amount').text(formatPrice(totalProductAmount));

    var shippingFee = calculateShippingFee(totalProductAmount);

    $('#total_shipping_fee').text(formatPrice(shippingFee));

    var totalOrderAmount = totalProductAmount + shippingFee;

    $('#total_order_amount').text(formatPrice(totalOrderAmount));
}

// 삭제 버튼 이벤트 리스너
$('.remove_btn').on('click', function() {
    var cartId = $(this).data('cart-id');

    if (confirm('해당 상품을 장바구니에서 삭제하시겠습니까?')) {
        // 서버로 AJAX 요청 보내기
        $.ajax({
            url: '/api/cart/delete/' + cartId,
            type: 'DELETE',
            success: function(response) {
                console.log('삭제 성공:', response);
                // 아이템을 화면에서 제거
                $('#cart_item_' + cartId).remove();
                updateTotalSummary();
            },
            error: function(xhr, status, error) {
                console.error('삭제 실패:', error);
            }
        });
    }
});


// 배송비 계산 함수
function calculateShippingFee(totalProductAmount) {
    if (totalProductAmount >= 50000) {
        return 0;
    } else if (totalProductAmount > 0) {
        return 3000;
    } else {
        return 0;
    }
}

// 체크박스 변경 이벤트 리스너
$('.item_checkbox').on('change', function() {
    var productCode = $(this).data('product-code');
    var checked = $(this).is(':checked') ? 'Y' : 'N';

    // 서버로 AJAX 요청 보내기
    updateCheckedStatusOnServer(productCode, checked);

    updateTotalSummary();
});

// 수량 업데이트를 서버로 전송하는 함수
function updateProductCountOnServer(productCode, productCount) {
    $.ajax({
        url: '/api/cart/quantity/' + productCode + '/' + productCount,
        type: 'GET',
        success: function(response) {
            console.log('수량 업데이트 성공:', response);
        },
        error: function(xhr, status, error) {
            console.error('수량 업데이트 실패:', error);
        }
    });
}

// 체크 상태를 서버로 전송하는 함수
function updateCheckedStatusOnServer(productCode, checked) {
    $.ajax({
        url: '/api/cart/checked/' + productCode + '/' + checked,
        type: 'GET',
        success: function(response) {
            console.log('체크 상태 업데이트 성공:', response);
        },
        error: function(xhr, status, error) {
            console.error('체크 상태 업데이트 실패:', error);
        }
    });
}

// 페이지 로드 시 총합 초기화
$(document).ready(function() {
    updateTotalSummary();
});
