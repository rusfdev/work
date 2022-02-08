$(window).resize(function () {
    //Всплывающее окно "Ваш город?", сбор расстояния до блока
    toCityButton = $('[data-action="cityButton"]').offset().left;
    toDesktopCityButton = $('[data-action="desktopCityButton"]').offset().left;
    windowWidth = $(window).width();
    if (windowWidth < 1025) {
        $('[data-action="cityChoice"]').css({
            'left': toCityButton + 'px'
        });
    } else {
        $('[data-action="cityChoice"]').css({
            'left': toDesktopCityButton + 'px'
        });
    }
});

function headerTabs() {
    //Вкладки среднего меню, смена просмотра с по клику на по наведению и обратно при изменении разрешения экрана
    if ($(window).width() < 1200) {
        $('[data-action="tab1"]').click(function (e) {
            e.preventDefault();
            $(this).parent().parent().find('[data-action="tab1"]').removeClass('new-tabs__link-action-open');
            $(this).addClass('new-tabs__link-action-open');
            $(this).parent().parent().parent().find('[data-action="tabContent"]').removeClass('new-tabs__cell-action-open').eq($(this).parent().index() - 1).addClass('new-tabs__cell-action-open');
        });
    } else {
        $('[data-action="tab1"]').each(function() {
            var $this = $(this),
                tabContent = $this.parent().parent().parent().find('[data-action="tabContent"]').eq($this.parent().index() - 1).html();
            rootCategorySlug = $this.data('root-category-slug');
            if ($this.parent().children().length < 2) {
                $this.parent().append('<div class="new-tabs__cell-type-alternative ' +
                    rootCategorySlug + '" data-action="tabLinkContent">' + tabContent + '</div>');
            }
            $this.on('mouseenter', function() {
                var tabLinkContent = $this.parent().find('[data-action="tabLinkContent"]'),
                    totalWidth = 0;

                tabLinkContent.children().each(function () {
                    totalWidth = totalWidth + $(this).outerWidth()+1;
                });
                tabLinkContent.css({'width': totalWidth});
            })
        })
    }
}

headerTabs();
$(window).resize(function() {
    headerTabs();
})



$(document).ready(function () {
    //Всплывающее окно "Ваш город?", отработка окна при смене разрешения, для планшетов
    $(window).resize();
    $('[data-action="cityYesButton"]').click(function () {
        $('[data-action="cityChoice"]').hide();
    });
    $('[data-action="cityNoButton"]').click(function () {
        $('[data-action="cityShell"]').toggleClass('new-card__fastBuy-action-open');
        $('[data-action="cityChoice"]').hide();
    });
});




$(document).ready(function () {

    //Выпадающие списки
    $('[data-action="dropdownButton"]').on('click', function () {
        let $this = $(this),
            btn_class = 'new-dropdown__button-action-open',
            cnt_class = 'new-dropdown__wrapper-action-open',
            $parent = $this.closest('[data-action="dropdown"]'),
            $content = $parent.find('[data-action="dropdownWrapper"]').eq(0),
            $siblings = $parent.closest('.new-dropdown__wrapper').length?$parent.closest('.new-dropdown__wrapper').find('[data-action="dropdown"]').not($parent):$parent.siblings(),
            $siblings_button = $siblings.find('[data-action="dropdownButton"]'),
            $siblings_content = $siblings.find('[data-action="dropdownWrapper"]');

        $siblings_button.removeClass(btn_class);
        $siblings_content.removeClass(cnt_class);
        $content.toggleClass(cnt_class);
        $this.toggleClass(btn_class);
    })



    //Выпадающие списки сортировки с подменой значения
    $('[data-action="dropdownСhanger"]').click(function () {
        changerValue = $(this).parent().parent().find('[data-action="dropdownButton"]').text();
        $('[data-action="toSortByButton"]').html(changerValue);
        $('[data-action="toSortByWrapper"]').toggleClass('new-content__sort-action-open');
        $(this).addClass('new-dropdown__link-type-sortCurrent').siblings().removeClass("new-dropdown__link-type-sortCurrent");
    })



    //Вкладки
    $('[data-action="tab"]').click(function () {
        $(this).parent().find('[data-action="tab"]').removeClass('new-tabs__link-action-open');
        $(this).addClass('new-tabs__link-action-open');
        $(this).parent().parent().find('[data-action="tabContent"]').removeClass('new-tabs__cell-action-open').eq($(this).index()).addClass('new-tabs__cell-action-open');
    });



    //Мобильное меню
    $('[data-action="menuButton"]').click(function () {
        $('[data-action="menuWrapper"]').toggleClass('new-header__top-action-open');
    })
    $('[data-action="closeButton"]').click(function () {
        $('[data-action="menuWrapper"]').toggleClass('new-header__top-action-open');
    })



    //Всплывающее окно личного кабинета
    $('[data-action="cabinetButton"]').click(function () {
        $(this).toggleClass('new-console__button-action-open')
        $('[data-action="cabinetPopup"]').toggleClass('new-console__loginPopup-type-open');
    })
    $('[data-action="cabinetCloseButton"]').click(function () {
        $('[data-action="cabinetButton"]').toggleClass('new-console__button-action-open')
        $('[data-action="cabinetPopup"]').toggleClass('new-console__loginPopup-type-open');
    })



    //Всплывающее окно быстрой покупки
    // ORIGINAL (NOT WORKED)
    // $('[data-action="fastBuyArea"]').click(function(){
    //  $(this).parent().find('[data-action="fastBuyShell"]').toggleClass('new-card__fastBuy-action-open');
    // })
    // $('[data-action="fastBuyCloseButton"]').click(function(){
    //  $('[data-action="fastBuyShell"]').toggleClass('new-card__fastBuy-action-open');
    // })

    // FIXED VARIANT
    // $('[data-action="fastBuyArea"]').click(function(){
    //  $(this).parent().find('[data-action="fastBuyShell"]').addClass('new-card__fastBuy-action-open');
    // });
    // $('[data-action="fastBuyCloseButton"]').click(function(){
    //  $('.new-card__fastBuy-action-open').removeClass('new-card__fastBuy-action-open');
    // });

    // BY AJAX (NEW)
    $('[data-action="fastBuyArea"]').click(function () {
        $.get($(this).data('preview-url'), function (response) {
            if (response.html) {
                $('body').append(response.html);
                initBuyButtons();
                initComparisonFormSubmit();
                slider.init();
            }
        });

    });

    $(document).on('click', '[data-action="fastBuyCloseButton"]', function (event) {
        $('[data-action="fastBuySlider"], [data-action="fastBuyThumbs"]')
            .slick('unslick');
        $('.new-card__fastBuy-action-open').remove();
    });



    //Всплывающее окно выбора города
    $('[data-action="cityButton"],[data-action="desktopCityButton"],[data-action="cityCloseButton"]').click(function () {
        $('[data-action="cityShell"]').toggleClass('new-card__fastBuy-action-open');
        $('[data-action="cityChoice"]').hide();
    })
    
    $('[data-action="mobileCityButton"]').click(function () {
        $('[data-action="mobileCityShell"]').toggleClass('new-city-action-open');
    })



    $('[data-action="cityLink"]').click(function () {
        $(this).addClass('new-button-action-check').siblings().removeClass('new-button-action-check');
        cityChanger = $(this).text();
        $('[data-action="cityChanger"]').html(cityChanger);
    });



    //Всплывающее окно фильтрации
    $('[data-action="filtersButton"]').click(function () {
        $('[data-action="filtersWrapper"]').toggleClass('new-content__filters-action-open');
    })
    $('[data-action="filtersCloseButton"]').click(function () {
        $('[data-action="filtersWrapper"]').toggleClass('new-content__filters-action-open');
    })



    //Всплывающее окно сортировки
    $('[data-action="toSortByButton"]').click(function () {
        $('[data-action="toSortByWrapper"]').toggleClass('new-content__filters-action-open');
    })
    $('[data-action="toSortByCloseButton"]').click(function () {
        $('[data-action="toSortByWrapper"]').toggleClass('new-content__filters-action-open');
    })



    //Всплывающее окно "Быстрого звонка"
    $('[data-action="callbackButton"],[data-action="callbackCloseButton"]').click(function () {
        $('[data-action="callbackShell"]').toggleClass('new-card__fastBuy-action-open');
    });



    //"Быстрый звонок", проверка поля на заполненность
    $('[data-action="inputChanger"]').change(function () {
        if ($(this).val()) {
            $(this).parent().addClass('new-callback__label-type-change');
        } else {
            $(this).parent().removeClass('new-callback__label-type-change');
        }
    });



    initBuyButtons();



    //Аккордеоны
    $('[data-action="accordionOpener"]').click(function () {
        $(this).parent().find('[data-action="accordionShell"]').toggleClass('new-accordion__shell-action-open');
        $(this).toggleClass('new-accordion__button-action-open');
    })



    //Замена контента в "Отзывах"
    $('[data-action="reviewChanger"]').click(function () {
        reviewHidden = $(this).parent().find('[data-action="reviewHidden"]').html();
        $(this).parent().find('[data-action="reviewWrapper"]').html(reviewHidden);
        $(this).css({
            'opacity': '0'
        });
    });



    //Рекламный слайдер в шапке
    $('[data-action="adSliderInMain"]').slick({
        arrows: false,
        dots: true,
        mobileFirst: true,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        responsive: [{
            breakpoint: 1024,
            settings: {
                infinite: true,
                autoplay: true,
                autoplaySpeed: 5000,
                arrows: true,
                dots: true
            }
        }]
    });






    //Слайдер товаров недели
    $('[data-action="weeklySlider"]').slick({
        arrows: true,
        dots: false,
        mobileFirst: true,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        responsive: [{
                breakpoint: 768
            },
            {
                breakpoint: 1179,
                settings: {
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 5000
                }
            }
        ]
    });



    //Слайдер со статьями
    $('[data-action="blogSlider"]').slick({
        arrows: false,
        dots: true,
        mobileFirst: true,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        responsive: [{
                breakpoint: 580,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 790,
                settings: {
                    slidesToShow: 3,
                    dots: false
                }
            },
        ]
    });



    //Слайдер партнеров
    const settings = {
        arrows: false,
        dots: true,
        mobileFirst: true,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        responsive: [{
                breakpoint: 768
            },
            {
                breakpoint: 1024,
                settings: 'unslick'
            }
        ]
    };
    const sl = $('[data-action="partnerSlider"]').slick(settings);
    $(window).on('resize', function () {
        if ($(window).width() < 1024 && !sl.hasClass('slick-initialized')) {
            $('[data-action="partnerSlider"]').slick(settings);
        }
    });



    //Слайдер на странице сравнения
    slidersCount = $('[data-count="tabCompare"]').length;
    for (x = 1; x <= slidersCount; x++) {
        attrSliderCount = 'compareSlider' + x;
        mainSliderCount = '[data-action="' + attrSliderCount + '"]';
        $('[data-count="tabCompare"]').eq(x - 1).find('[data-action="compareSlider"]').attr('data-action', attrSliderCount);
        $(mainSliderCount).on('init', function (event) {
            compareElement = $(this).find('[data-action="compareSlide"]');
            $(compareElement).each(function () {
                paramsCount = $(this).children().length;
            })
            for (i = 1; i <= paramsCount; i++) {
                maxHeight = 0;
                $(this).find('[data-action="trLead"]:nth-child(' + i + ')').each(function (ind, el) {
                    currentHeight = $(el).innerHeight();
                    if (maxHeight < currentHeight) {
                        maxHeight = currentHeight;
                    }
                });
                $(this).find('[data-action="trLead"]:nth-child(' + i + ')').height(maxHeight);
                if (windowWidth < 1025) {
                    $(this).closest('[data-action="tabContent"]').find('[data-action="trLed"]:nth-child(' + i + ')').height(maxHeight);
                    $(this).closest('[data-action="tabContent"]').find('[data-action="trLed"]:nth-child(1)').height('auto');
                } else {
                    $(this).closest('[data-action="tabContent"]').find('[data-action="trLed"]:nth-child(' + i + ')').height(maxHeight);
                }
                maxHeight = 0;
            }
        }).slick({
            arrows: true,
            dots: false,
            mobileFirst: true,
            pauseOnHover: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: false,
            responsive: [{
                    breakpoint: 420,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 520,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 620,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 719,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        arrows: false
                    }
                },
            ]
        }).on('breakpoint', function (event, slick, currentSlide, nextSlide, direction) {
            $(this).find('[data-action="trLead"]').height('auto');
            for (i = 1; i <= paramsCount; i++) {
                maxHeight = 0;
                $(this).find('[data-action="trLead"]:nth-child(' + i + ')').each(function (ind, el) {
                    currentHeight = $(el).innerHeight();
                    if (maxHeight < currentHeight) {
                        maxHeight = currentHeight;
                    }
                });
                $(this).find('[data-action="trLead"]:nth-child(' + i + ')').height(maxHeight);
                if (windowWidth < 1025) {
                    $(this).closest('[data-action="tabContent"]').find('[data-action="trLed"]:nth-child(' + i + ')').height(maxHeight);
                    $(this).closest('[data-action="tabContent"]').find('[data-action="trLed"]:nth-child(1)').height('auto');
                } else {
                    $(this).closest('[data-action="tabContent"]').find('[data-action="trLed"]:nth-child(' + i + ')').height(maxHeight);
                }
                maxHeight = 0;
            }
        });
    }



    //Кнопка удаления слайда в слайдере на странице сравнения
    $('[data-action="removeButton"]').click(function () {
        ind = $(this).closest('[data-action="compareSlide"]').index();
        $(this).closest('[data-action*="compareSlider"]').slick('slickRemove', ind).slick('reinit');
        $(this).closest('[data-action*="compareSlider"]').find('[data-action="trLead"]').height('auto').closest('[data-action="tabContent"]').find('[data-action="trLed"]').height('auto');
        for (i = 1; i <= paramsCount; i++) {
            maxHeight = 0;
            $(this).closest('[data-action*="compareSlider"]').find('[data-action="trLead"]:nth-child(' + i + ')').each(function (ind, el) {
                currentHeight = $(el).innerHeight();
                if (maxHeight < currentHeight) {
                    maxHeight = currentHeight;
                }
            });
            $(this).closest('[data-action*="compareSlider"]').find('[data-action="trLead"]:nth-child(' + i + ')').height(maxHeight);
            if (windowWidth < 1025) {
                $(this).closest('[data-action*="compareSlider"]').find('[data-action="trLed"]:nth-child(' + i + ')').height(maxHeight);
                $(this).closest('[data-action*="compareSlider"]').find('[data-action="trLed"]:nth-child(1)').height('auto');
            } else {
                $(this).closest('[data-action*="compareSlider"]').find('[data-action="trLed"]:nth-child(' + i + ')').height(maxHeight);
            }
            maxHeight = 0;
        }
    })
});

function initSlickForPreview() {

    //Слайдер быстрого просмотра
    $('[data-action="fastBuySlider"]').on('init', function (event, slick) {
        if (slick.$slides.length <= 3 && slick.options.asNavFor != null) {
            slick.slickSetOption({
                asNavFor: null
            });
        }
    }).slick({
        arrows: true,
        dots: false,
        mobileFirst: true,
        slidesToShow: 1,
        infinite: false,
        asNavFor: '[data-action="fastBuyThumbs"]',
        responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1170,
                settings: {
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    pauseOnHover: true
                }
            }
        ]
    });
    $('[data-action="fastBuyThumbs"]').slick({
        arrows: false,
        dots: false,
        mobileFirst: true,
        slidesToShow: 1,
        infinite: false,
        asNavFor: '[data-action="fastBuySlider"]',
        focusOnSelect: true,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }]
    });
}


function initBuyButtons() {
    //Кнопка покупки
    // $('[data-action="buyButton"]').click(function() {
    //  $(this).parent().addClass('new-card__bottom-type-sold');
    //  $(this).html('Оформить заказ');
    // });
    $('[data-action="buyButton"]').click(function (e) {
        //Дефолтные настрйоки плагинов
        Noty.overrideDefaults({
            layout: 'topRight',
            theme: 'metroui',
            timeout: 3000
        });
        tippy.setDefaultProps({
            duration: 300,
            placement: 'auto',
            hideOnClick: true,
            trigger: 'click',
            zIndex: 99,
            offset: [0, 15],
            maxWidth: 380
        });
        e.preventDefault();
        var $this = $(this);
        $this.unbind('click');
        $.getJSON($this.data('url'), function (response) {
            if (response.message) {
                var theme = response.result;
                var _instance = tippy($this[0], {
                    theme: theme,
                    content: response.message
                });
                _instance.show();
            }
            if (response.result == 'success') {
                $('[data-url="' + $this.data('url') + '"]').each(function () {
                    current_element = $(this);
                    current_element.addClass('button_style-green');
                    current_element.parent().addClass('new-card__bottom-type-sold');
                    current_element.html('Оформить заказ');
                    current_element.siblings('.new-card__priceBlock').remove();
                    current_element.click(function () {
                        window.location = URLS.cart;
                    });
                });
                if (window.yaCounter10771960 !== undefined) {
                    window.yaCounter10771960.reachGoal('ADDTOCART');
                }
                $('.cart_count').html(response.count);
                $('.menu-cart-count').html(response.count);
                $('.cart_price').html(response.total_price);
            }
        });
    });

}

$(document).ready(function () {
    Noty.overrideDefaults({
        layout: 'topRight',
        theme: 'metroui',
        timeout: 3000
    });
    tippy.setDefaultProps({
        duration: 300,
        placement: 'auto',
        hideOnClick: true,
        trigger: 'click',
        zIndex: 99,
        offset: [0, 15],
        maxWidth: 380
    });
    $('#subscription_form').submit(function (e) {
        e.preventDefault();
        var form = $(this);
        $.post(form.attr('action'), form.serialize(), function (data) {
            if (data.errors) {
                form.parent().find('div.errors').html(data.errors);
            } else {
                form.parent().html("<h5 class=\"footer-topline__title\">" + data.text + "</h5>");
            }
        });
    });
});